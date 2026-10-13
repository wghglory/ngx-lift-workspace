import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {QueryClientOptions, QueryDefinition, QuerySnapshot} from './query.models';
import {QueryClient} from './query-client';

function deferred<T>() {
  let callbacks: {resolve: (value: T | PromiseLike<T>) => void; reject: (failure: unknown) => void} | undefined;
  const promise = new Promise<T>((resolve, reject) => {
    callbacks = {resolve, reject};
  });
  if (!callbacks) throw new Error('Deferred callbacks were not initialized');
  return {promise, ...callbacks};
}

async function flushRequests() {
  for (let i = 0; i < 8; i++) {
    await Promise.resolve();
  }
}

describe('QueryClient', () => {
  const clients: QueryClient[] = [];
  const createClient = (options: QueryClientOptions = {}) => {
    const client = new QueryClient(options);
    clients.push(client);
    return client;
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
  });

  afterEach(() => {
    clients.splice(0).forEach((client) => client.destroy());
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('does not republish removed data after an observer synchronously clears the cache', async () => {
    const client = createClient();
    const definition = {key: ['private'], loader: async () => 'secret', staleTime: Infinity};
    await client.fetchQuery(definition);
    client.observeQuery(definition, (snapshot) => {
      if (snapshot.status === 'reloading') client.removeQueries();
    });
    const snapshots: QuerySnapshot<string>[] = [];
    client.observeQuery(definition, (snapshot) => snapshots.push(snapshot));
    await expect(client.fetchQuery(definition, {refresh: true})).rejects.toMatchObject({name: 'AbortError'});
    expect(snapshots.at(-1)).toMatchObject({status: 'idle', value: undefined, hasValue: false});
    expect(snapshots.map((snapshot) => snapshot.status)).toEqual(['resolved', 'idle']);
  });

  it('does not deliver an older resolved snapshot after a reentrant refresh starts', async () => {
    const client = createClient();
    const pending = deferred<string>();
    const loader = vi.fn<() => Promise<string>>().mockResolvedValueOnce('initial').mockReturnValue(pending.promise);
    const definition = {key: ['reentrant-refresh'], loader, staleTime: Infinity};
    let refreshed = false;
    client.observeQuery(definition, (snapshot) => {
      if (snapshot.status === 'resolved' && !refreshed) {
        refreshed = true;
        void client.fetchQuery(definition, {refresh: true});
      }
    });
    const snapshots: QuerySnapshot<string>[] = [];
    client.observeQuery(definition, (snapshot) => snapshots.push(snapshot));
    await flushRequests();
    expect(snapshots.at(-1)?.status).toBe('reloading');
    pending.resolve('refreshed');
    await flushRequests();
    expect(snapshots.at(-1)).toMatchObject({status: 'resolved', value: 'refreshed'});
  });

  it('skips observers detached synchronously by an earlier listener', async () => {
    const client = createClient();
    const definition = {key: ['detach-during-publish'], loader: async () => 1, staleTime: Infinity};
    await client.fetchQuery(definition);
    client.observeQuery(definition, (snapshot) => {
      if (snapshot.status === 'reloading') detachSecond?.();
    });
    const second = vi.fn();
    const detachSecond = client.observeQuery(definition, second);
    second.mockClear();
    await client.fetchQuery(definition, {refresh: true});
    expect(second).not.toHaveBeenCalled();
  });

  it('shares pending requests after freshness expires and across explicit refreshes', async () => {
    const client = createClient();
    const pending = deferred<string>();
    const loader = vi.fn(() => pending.promise);
    const definition = {key: ['bindings'], loader, staleTime: 5} satisfies QueryDefinition<string>;
    const first = client.fetchQuery(definition);
    await flushRequests();
    await vi.advanceTimersByTimeAsync(100);
    expect(client.fetchQuery(definition)).toBe(first);
    expect(client.fetchQuery(definition, {refresh: true})).toBe(first);
    expect(loader).toHaveBeenCalledTimes(1);
    pending.resolve('result');
    await first;
    await vi.advanceTimersByTimeAsync(4);
    expect(await client.fetchQuery(definition)).toBe('result');
    expect(loader).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1);
    await client.fetchQuery(definition);
    expect(loader).toHaveBeenCalledTimes(2);
  });

  it.each(['remove', 'destroy'] as const)('does not start detached transport after initial listener %s', (action) => {
    const client = createClient();
    const loader = vi.fn(async () => 'old scope');
    let removed = false;
    const handle = client.observeQuery({key: ['bindings'], loader}, () => {
      if (removed) return;
      removed = true;
      if (action === 'remove') client.removeQueries();
      else client.destroy();
    });
    expect(loader).not.toHaveBeenCalled();
    expect(handle.isAttached()).toBe(false);
    expect(client.getSnapshot(['bindings'])).toBeUndefined();
    handle();
  });

  it('starts transport synchronously while allowing a reentrant caller to join pending work', async () => {
    const client = createClient();
    const pending = deferred<string>();
    let joined: Promise<string> | undefined;
    const loader = vi.fn(() => {
      joined = client.fetchQuery(definition);
      return pending.promise;
    });
    const definition = {key: ['bindings'], loader};
    const first = client.fetchQuery(definition);
    expect(loader).toHaveBeenCalledTimes(1);
    expect(joined).toBe(first);
    pending.resolve('rows');
    expect(await first).toBe('rows');
  });

  it('retries failed and synchronously throwing loaders without caching the failure', async () => {
    const client = createClient();
    const error = new Error('unavailable');
    const loader = vi.fn<() => Promise<string>>().mockImplementationOnce(() => {
      throw error;
    });
    loader.mockResolvedValue('recovered');
    const definition = {key: ['bindings'], loader, staleTime: 1000};
    await expect(client.fetchQuery(definition)).rejects.toBe(error);
    expect(client.getSnapshot(definition.key)).toMatchObject({status: 'error', error, hasValue: false});
    expect(await client.fetchQuery(definition)).toBe('recovered');
    expect(loader).toHaveBeenCalledTimes(2);
    expect(client.getSnapshot(definition.key)).toMatchObject({status: 'resolved', error: null});
  });

  it('retains successful data and reports an error when background reload fails', async () => {
    const client = createClient();
    const error = new Error('temporarily offline');
    const loader = vi.fn().mockResolvedValueOnce('rows').mockRejectedValueOnce(error);
    const definition = {key: ['bindings'], loader, staleTime: Infinity};
    await client.fetchQuery(definition);
    const snapshots: QuerySnapshot<string>[] = [];
    const unsubscribe = client.observeQuery<string>(definition, (snapshot) => snapshots.push(snapshot));
    await expect(client.fetchQuery(definition, {refresh: true})).rejects.toBe(error);
    expect(snapshots).toContainEqual(expect.objectContaining({value: 'rows', status: 'reloading', hasValue: true}));
    expect(client.getSnapshot(definition.key)).toMatchObject({
      value: 'rows',
      hasValue: true,
      error,
      status: 'error',
      isStale: true,
    });
    unsubscribe();
  });

  it('distinguishes a successful undefined result from missing data', async () => {
    const client = createClient();
    const loader = vi.fn().mockResolvedValue(undefined);
    const definition = {key: ['optional'], loader, staleTime: Infinity};
    await client.fetchQuery(definition);
    await client.fetchQuery(definition);
    expect(client.getSnapshot(definition.key)).toMatchObject({value: undefined, hasValue: true, isStale: false});
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it('shares live query state and performs one reload for all active observers', async () => {
    const client = createClient();
    const loader = vi.fn().mockResolvedValueOnce('before').mockResolvedValueOnce('after');
    const definition = {key: ['bindings'], loader, tags: [{type: 'Bindings'}], staleTime: Infinity};
    const firstListener = vi.fn();
    const secondListener = vi.fn();
    client.observeQuery(definition, firstListener);
    client.observeQuery(definition, secondListener);
    await flushRequests();
    expect(loader).toHaveBeenCalledTimes(1);
    client.invalidateTags([{type: 'Bindings'}]);
    await flushRequests();
    expect(loader).toHaveBeenCalledTimes(2);
    expect(firstListener).toHaveBeenLastCalledWith(expect.objectContaining({value: 'after', status: 'resolved'}));
    expect(secondListener).toHaveBeenLastCalledWith(expect.objectContaining({value: 'after', status: 'resolved'}));
  });

  it('marks inactive queries stale without fetching until their next use', async () => {
    const client = createClient();
    const loader = vi.fn().mockResolvedValue('rows');
    const definition = {key: ['bindings'], loader, tags: [{type: 'Bindings'}], staleTime: Infinity};
    await client.fetchQuery(definition);
    client.invalidateTags([{type: 'Bindings'}]);
    await flushRequests();
    expect(loader).toHaveBeenCalledTimes(1);
    expect(client.getSnapshot(definition.key)).toMatchObject({value: 'rows', isStale: true});
    await client.fetchQuery(definition);
    expect(loader).toHaveBeenCalledTimes(2);
  });

  it('isolates invalidation by scope and matches entity ids or the entire type', async () => {
    const client = createClient();
    const loader = vi.fn().mockResolvedValue('rows');
    const definitions = [
      {key: ['east', 1], tags: [{type: 'Bindings', scope: 'east', id: 1}], loader, staleTime: Infinity},
      {key: ['east', 2], tags: [{type: 'Bindings', scope: 'east', id: 2}], loader, staleTime: Infinity},
      {key: ['west', 1], tags: [{type: 'Bindings', scope: 'west', id: 1}], loader, staleTime: Infinity},
    ];
    await Promise.all(definitions.map((definition) => client.fetchQuery(definition)));
    client.invalidateTags([{type: 'Bindings', scope: 'east', id: 1}]);
    expect(definitions.map((definition) => client.getSnapshot(definition.key)?.isStale)).toEqual([true, false, false]);
    client.invalidateTags([{type: 'Bindings', scope: 'east'}]);
    expect(definitions.map((definition) => client.getSnapshot(definition.key)?.isStale)).toEqual([true, true, false]);
  });

  it('treats an omitted tag scope as the unscoped namespace rather than a cross-tenant wildcard', async () => {
    const client = createClient();
    const loader = vi.fn().mockResolvedValue('rows');
    const definitions = [
      {key: ['unscoped'], tags: [{type: 'Bindings'}], loader, staleTime: Infinity},
      {key: ['scoped'], tags: [{type: 'Bindings', scope: 'tenant-a'}], loader, staleTime: Infinity},
    ];
    await Promise.all(definitions.map((definition) => client.fetchQuery(definition)));
    client.invalidateTags([{type: 'Bindings'}]);
    expect(definitions.map((definition) => client.getSnapshot(definition.key)?.isStale)).toEqual([true, false]);
  });

  it('registers additional consumer tags on cache hits and removes every tag membership on eviction', async () => {
    const client = createClient();
    const loader = vi.fn().mockResolvedValue('rows');
    const definition = {key: ['bindings'], loader, staleTime: Infinity, tags: [{type: 'Bindings', id: 1}]};
    await client.fetchQuery(definition);
    await client.fetchQuery({...definition, tags: [{type: 'Organizations'}]});
    client.invalidateTags([{type: 'Organizations'}]);
    expect(client.getSnapshot(definition.key)?.isStale).toBe(true);
    client.removeQueries();
    await client.fetchQuery({...definition, tags: [{type: 'Regions'}]});
    client.invalidateTags([{type: 'Bindings'}, {type: 'Bindings', id: 1}, {type: 'Organizations'}]);
    expect(client.getSnapshot(definition.key)?.isStale).toBe(false);
  });

  it('updates observer tags and loader for the same key without fetching or resubscribing', async () => {
    const client = createClient();
    const originalLoader = vi.fn().mockResolvedValue('before');
    const definition = {key: ['bindings'], loader: originalLoader, staleTime: Infinity};
    const listener = vi.fn();
    const observer = client.observeQuery(definition, listener);
    await flushRequests();
    const updatedLoader = vi.fn().mockResolvedValue('after');
    observer.updateDefinition({...definition, loader: updatedLoader, tags: [{type: 'NewTag'}]});
    expect(observer.isAttached()).toBe(true);
    expect(originalLoader).toHaveBeenCalledTimes(1);
    expect(updatedLoader).not.toHaveBeenCalled();
    client.invalidateTags([{type: 'NewTag'}]);
    await flushRequests();
    expect(updatedLoader).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenLastCalledWith(expect.objectContaining({value: 'after'}));
    expect(() => observer.updateDefinition({...definition, key: ['other']})).toThrow('same query key');
    client.removeQueries();
    await client.fetchQuery(definition);
    expect(observer.isAttached()).toBe(false);
  });

  it('prevents an obsolete pre-mutation response from publishing or replacing a newer result', async () => {
    const client = createClient();
    const old = deferred<string>();
    const current = deferred<string>();
    const loader = vi.fn().mockReturnValueOnce(old.promise).mockReturnValueOnce(current.promise);
    const definition = {key: ['bindings'], loader, tags: [{type: 'Bindings'}], staleTime: Infinity};
    const listener = vi.fn();
    client.observeQuery(definition, listener);
    const oldCaller = client.fetchQuery<string>(definition);
    await flushRequests();
    client.invalidateTags([{type: 'Bindings'}]);
    await flushRequests();
    current.resolve('after mutation');
    await flushRequests();
    const callCount = listener.mock.calls.length;
    old.resolve('before mutation');
    expect(await oldCaller).toBe('before mutation');
    expect(listener).toHaveBeenCalledTimes(callCount);
    expect(client.getSnapshot(definition.key)).toMatchObject({value: 'after mutation', isStale: false});
  });

  it('invalidates every dependency before an active composite query can refetch', async () => {
    const client = createClient();
    const old = deferred<string>();
    const bindingLoader = vi.fn().mockReturnValueOnce(old.promise).mockResolvedValueOnce('after mutation');
    const binding = {key: ['bindings'], loader: bindingLoader, tags: [{type: 'Bindings'}], staleTime: Infinity};
    const table: QueryDefinition<string> = {
      key: ['table'],
      loader: ({refresh}) => client.fetchQuery(binding, {refresh}),
      tags: [{type: 'Bindings'}],
      staleTime: Infinity,
    };
    // Registering the parent first reproduces a refetch joining an obsolete child request.
    client.observeQuery(table, vi.fn());
    const oldBindingCaller = client.fetchQuery<string>(binding);
    expect(bindingLoader).toHaveBeenCalledTimes(1);
    client.invalidateTags([{type: 'Bindings'}]);
    expect(bindingLoader).toHaveBeenCalledTimes(2);
    await flushRequests();
    expect(client.getSnapshot(table.key)?.value).toBe('after mutation');
    expect(client.getSnapshot(binding.key)?.value).toBe('after mutation');
    old.resolve('before mutation');
    expect(await oldBindingCaller).toBe('before mutation');
    await flushRequests();
    expect(client.getSnapshot(table.key)?.value).toBe('after mutation');
    expect(client.getSnapshot(binding.key)?.value).toBe('after mutation');
  });

  it('prevents an obsolete error from evicting a newer successful result', async () => {
    const client = createClient();
    const old = deferred<string>();
    const loader = vi.fn().mockReturnValueOnce(old.promise).mockResolvedValueOnce('after mutation');
    const definition = {key: ['bindings'], loader, tags: [{type: 'Bindings'}], staleTime: Infinity};
    const oldCaller = client.fetchQuery(definition);
    await flushRequests();
    client.invalidateTags([{type: 'Bindings'}]);
    await client.fetchQuery(definition);
    old.reject(new Error('old request failed'));
    await expect(oldCaller).rejects.toThrow('old request failed');
    expect(await client.fetchQuery(definition)).toBe('after mutation');
    expect(loader).toHaveBeenCalledTimes(2);
    expect(client.getSnapshot(definition.key)?.error).toBeNull();
  });

  it('propagates forced refresh to dependent loaders while normal access remains unforced', async () => {
    const client = createClient();
    const loader = vi.fn().mockResolvedValue('rows');
    const definition = {key: ['bindings'], loader, staleTime: Infinity};
    await client.fetchQuery(definition);
    await client.fetchQuery(definition, {refresh: true});
    expect(loader.mock.calls.map(([context]) => context.refresh)).toEqual([false, true]);
  });

  it('coordinates polling at the fastest active interval and updates scheduling without implicit fetching', async () => {
    const client = createClient();
    const loader = vi.fn().mockResolvedValue('rows');
    const definition = {key: ['bindings'], loader, staleTime: 0};
    const slower = client.observeQuery(definition, vi.fn(), {pollInterval: 200});
    const faster = client.observeQuery(definition, vi.fn(), {pollInterval: 100});
    await flushRequests();
    await vi.advanceTimersByTimeAsync(100);
    expect(loader).toHaveBeenCalledTimes(2);
    faster.updateOptions({});
    await flushRequests();
    expect(loader).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(199);
    expect(loader).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(1);
    expect(loader).toHaveBeenCalledTimes(3);
    expect(loader.mock.calls[2][0].refresh).toBe(true);
    slower();
    faster();
    await vi.advanceTimersByTimeAsync(500);
    expect(loader).toHaveBeenCalledTimes(3);
  });

  it('waits for slow polling requests to finish before scheduling another interval', async () => {
    const client = createClient();
    const slow = deferred<string>();
    const loader = vi
      .fn()
      .mockResolvedValueOnce('initial')
      .mockReturnValueOnce(slow.promise)
      .mockResolvedValue('later');
    const definition = {key: ['bindings'], loader, staleTime: Infinity};
    client.observeQuery(definition, vi.fn(), {pollInterval: 100});
    await flushRequests();
    await vi.advanceTimersByTimeAsync(1000);
    expect(loader).toHaveBeenCalledTimes(2);
    slow.resolve('updated');
    await flushRequests();
    await vi.advanceTimersByTimeAsync(99);
    expect(loader).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(1);
    expect(loader).toHaveBeenCalledTimes(3);
  });

  it('starts a new interval when polling is enabled after a long pause', async () => {
    const client = createClient();
    const loader = vi.fn().mockResolvedValue('rows');
    const definition = {key: ['bindings'], loader, staleTime: Infinity};
    const observer = client.observeQuery(definition, vi.fn(), {pollInterval: 100});
    await flushRequests();
    await vi.advanceTimersByTimeAsync(100);
    observer.updateOptions({});
    await vi.advanceTimersByTimeAsync(200);
    observer.updateOptions({pollInterval: 50});
    await vi.advanceTimersByTimeAsync(49);
    expect(loader).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(1);
    expect(loader).toHaveBeenCalledTimes(3);
  });

  it('pauses polling while hidden and performs one overdue refresh when visibility returns', async () => {
    let visible = true;
    let onVisibility: (() => void) | undefined;
    const unsubscribeVisibility = vi.fn();
    const client = createClient({
      isVisible: () => visible,
      subscribeVisibility: (listener) => {
        onVisibility = listener;
        return unsubscribeVisibility;
      },
    });
    const loader = vi.fn().mockResolvedValue('rows');
    const definition = {key: ['bindings'], loader, staleTime: Infinity};
    client.observeQuery(definition, vi.fn(), {pollInterval: 100});
    client.observeQuery(definition, vi.fn(), {pollInterval: 200});
    await flushRequests();
    visible = false;
    onVisibility?.();
    await vi.advanceTimersByTimeAsync(500);
    expect(loader).toHaveBeenCalledTimes(1);
    visible = true;
    onVisibility?.();
    await flushRequests();
    expect(loader).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(99);
    expect(loader).toHaveBeenCalledTimes(2);
    client.destroy();
    expect(unsubscribeVisibility).toHaveBeenCalledTimes(1);
  });

  it('resets polling after mutation invalidation to avoid a duplicate scheduled request', async () => {
    const client = createClient();
    const loader = vi.fn().mockResolvedValue('rows');
    const definition = {key: ['bindings'], loader, tags: [{type: 'Bindings'}], staleTime: Infinity};
    client.observeQuery(definition, vi.fn(), {pollInterval: 100});
    await flushRequests();
    await vi.advanceTimersByTimeAsync(90);
    client.invalidateTags([{type: 'Bindings'}]);
    await flushRequests();
    expect(loader).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(99);
    expect(loader).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(1);
    expect(loader).toHaveBeenCalledTimes(3);
  });

  it('reports staleness to active observers when freshness expires without refetching', async () => {
    const client = createClient();
    const loader = vi.fn().mockResolvedValue('rows');
    const listener = vi.fn();
    const definition = {key: ['bindings'], loader, staleTime: 100};
    client.observeQuery(definition, listener);
    await flushRequests();
    expect(listener).toHaveBeenLastCalledWith(expect.objectContaining({isStale: false}));
    await vi.advanceTimersByTimeAsync(100);
    expect(listener).toHaveBeenLastCalledWith(expect.objectContaining({isStale: true}));
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it('keeps a finite request alive after the final observer leaves and collects it after completion', async () => {
    const client = createClient();
    const pending = deferred<string>();
    let abortSignal: AbortSignal | undefined;
    const definition: QueryDefinition<string> = {
      key: ['bindings'],
      loader: (context) => {
        abortSignal = context.abortSignal;
        return pending.promise;
      },
      gcTime: 0,
    };
    const unsubscribe = client.observeQuery(definition, vi.fn());
    const caller = client.fetchQuery(definition);
    await flushRequests();
    unsubscribe();
    await vi.advanceTimersByTimeAsync(100);
    expect(abortSignal?.aborted).toBe(false);
    expect(client.getSnapshot(definition.key)?.status).toBe('loading');
    pending.resolve('rows');
    expect(await caller).toBe('rows');
    await vi.advanceTimersByTimeAsync(0);
    expect(client.getSnapshot(definition.key)).toBeUndefined();
  });

  it('keeps conservative entry policies after a conflicting observer leaves', async () => {
    const client = createClient();
    const pending = deferred<string>();
    let abortSignal: AbortSignal | undefined;
    const definition = {
      key: ['shared-policies'],
      loader: async () => 'initial',
      staleTime: 60_000,
      gcTime: 100,
      cancelOnNoObservers: true,
    };
    const first = client.observeQuery(definition, vi.fn());
    await flushRequests();
    const second = client.observeQuery(
      {
        ...definition,
        staleTime: 0,
        gcTime: 1000,
        cancelOnNoObservers: false,
        loader: (context) => {
          abortSignal = context.abortSignal;
          return pending.promise;
        },
      },
      vi.fn(),
    );
    second();
    expect(client.getSnapshot(definition.key)?.isStale).toBe(true);
    first();
    expect(abortSignal?.aborted).toBe(false);
    pending.resolve('finished');
    await flushRequests();
    await vi.advanceTimersByTimeAsync(100);
    expect(client.getSnapshot(definition.key)?.value).toBe('finished');
    await vi.advanceTimersByTimeAsync(900);
    expect(client.getSnapshot(definition.key)).toBeUndefined();
  });

  it('separates freshness from retention and restarts retention on subsequent use', async () => {
    const client = createClient();
    const loader = vi.fn().mockResolvedValue('rows');
    const definition = {key: ['bindings'], loader, staleTime: Infinity, gcTime: 100};
    await client.fetchQuery(definition);
    await vi.advanceTimersByTimeAsync(90);
    await client.fetchQuery(definition);
    await vi.advanceTimersByTimeAsync(99);
    expect(client.getSnapshot(definition.key)).toBeDefined();
    expect(loader).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1);
    expect(client.getSnapshot(definition.key)).toBeUndefined();
  });

  it('segments durations beyond the native timer limit without early eviction, staleness, or polling', async () => {
    const client = createClient();
    const duration = 3_000_000_000;
    const loader = vi.fn().mockResolvedValue('rows');
    const retained = {key: ['retained'], loader, staleTime: Infinity, gcTime: duration};
    await client.fetchQuery(retained);
    const staleListener = vi.fn();
    client.observeQuery({key: ['stale'], loader, staleTime: duration}, staleListener);
    client.observeQuery({key: ['polled'], loader, staleTime: Infinity}, vi.fn(), {pollInterval: duration});
    await flushRequests();
    await vi.advanceTimersByTimeAsync(2_147_483_647);
    expect(client.getSnapshot(retained.key)).toBeDefined();
    expect(staleListener).toHaveBeenLastCalledWith(expect.objectContaining({isStale: false}));
    expect(loader).toHaveBeenCalledTimes(3);
    await vi.advanceTimersByTimeAsync(duration - 2_147_483_647 - 1);
    expect(client.getSnapshot(retained.key)).toBeDefined();
    expect(loader).toHaveBeenCalledTimes(3);
    await vi.advanceTimersByTimeAsync(1);
    expect(client.getSnapshot(retained.key)).toBeUndefined();
    expect(staleListener).toHaveBeenLastCalledWith(expect.objectContaining({isStale: true}));
    expect(loader).toHaveBeenCalledTimes(4);
  });

  it('only cancels an opted-in query when its final observer leaves', async () => {
    const client = createClient();
    const pending = deferred<string>();
    let abortSignal: AbortSignal | undefined;
    const definition: QueryDefinition<string> = {
      key: ['composite rows'],
      loader: (context) => {
        abortSignal = context.abortSignal;
        return pending.promise;
      },
      gcTime: 0,
      cancelOnNoObservers: true,
    };
    const first = client.observeQuery(definition, vi.fn());
    const second = client.observeQuery(definition, vi.fn());
    const caller = client.fetchQuery(definition);
    first();
    expect(abortSignal?.aborted).toBe(false);
    second();
    expect(abortSignal?.aborted).toBe(true);
    await expect(caller).rejects.toMatchObject({name: 'AbortError'});
    await vi.advanceTimersByTimeAsync(0);
    expect(client.getSnapshot(definition.key)).toBeUndefined();
    // A loader that ignores AbortSignal cannot pin a canceled cache entry indefinitely.
    pending.resolve('obsolete');
    await flushRequests();
    expect(client.getSnapshot(definition.key)).toBeUndefined();
  });

  it('bounds inactive entries using last access while protecting active observers', async () => {
    const client = createClient({maxEntries: 2});
    const loader = vi.fn().mockResolvedValue('rows');
    const definition = (id: number) => ({key: ['bindings', id], loader, staleTime: Infinity});
    const active = client.observeQuery(definition(0), vi.fn());
    await flushRequests();
    await client.fetchQuery(definition(1));
    await client.fetchQuery(definition(2));
    expect(client.getSnapshot(definition(0).key)).toBeDefined();
    expect(client.getSnapshot(definition(1).key)).toBeUndefined();
    expect(client.getSnapshot(definition(2).key)).toBeDefined();
    active();
  });

  it('aborts current and obsolete transports on removal without affecting a recreated entry', async () => {
    const client = createClient();
    const signals: AbortSignal[] = [];
    const first = deferred<string>();
    const second = deferred<string>();
    const loader = vi.fn(({abortSignal}: {abortSignal: AbortSignal}) => {
      signals.push(abortSignal);
      return signals.length === 1 ? first.promise : second.promise;
    });
    const definition = {key: ['bindings'], loader, tags: [{type: 'Bindings'}], staleTime: Infinity};
    const oldCaller = client.fetchQuery(definition);
    await flushRequests();
    client.invalidateTags([{type: 'Bindings'}]);
    const newCaller = client.fetchQuery(definition);
    await flushRequests();
    client.removeQueries();
    const removedCallers = Promise.allSettled([oldCaller, newCaller]);
    expect(signals.map((signal) => signal.aborted)).toEqual([true, true]);
    await client.fetchQuery({...definition, loader: async () => 'recreated'});
    first.resolve('old');
    second.resolve('removed');
    expect((await removedCallers).map((result) => result.status)).toEqual(['rejected', 'rejected']);
    expect(client.getSnapshot(definition.key)?.value).toBe('recreated');
  });

  it('reconciles shorter freshness and longer retention without duplicating pending work or cancelling a shared reader', async () => {
    const client = createClient();
    const pending = deferred<string>();
    const signals: AbortSignal[] = [];
    const loader = vi.fn(({abortSignal}: {abortSignal: AbortSignal}) => {
      signals.push(abortSignal);
      return pending.promise;
    });
    const key = ['shared-policy'];
    const first = client.observeQuery({key, loader, staleTime: 100, gcTime: 10, cancelOnNoObservers: true}, vi.fn());
    const listener = vi.fn();
    const second = client.observeQuery({key, loader, staleTime: 50, gcTime: 40}, listener);
    expect(loader).toHaveBeenCalledTimes(1);
    first();
    second();
    expect(signals[0].aborted).toBe(false);
    pending.resolve('data');
    await flushRequests();
    await vi.advanceTimersByTimeAsync(39);
    expect(client.getSnapshot(key)?.value).toBe('data');
    await vi.advanceTimersByTimeAsync(1);
    expect(client.getSnapshot(key)).toBeUndefined();
  });

  it('reschedules shared staleness notifications for the most demanding reader', async () => {
    const client = createClient();
    const definition = {key: ['shared-staleness'], loader: async () => 'data', staleTime: 100, gcTime: 1000};
    const listener = vi.fn();
    client.observeQuery(definition, listener);
    await flushRequests();
    client.observeQuery({...definition, staleTime: 50}, vi.fn());
    await vi.advanceTimersByTimeAsync(50);
    expect(listener.mock.lastCall?.[0].isStale).toBe(true);
  });

  it('retains zero freshness after a temporary reader leaves without starting automatic refetches', async () => {
    const client = createClient();
    const loader = vi
      .fn()
      .mockResolvedValueOnce('initial')
      .mockResolvedValueOnce('verified')
      .mockResolvedValue('reloaded');
    const definition = {key: ['modal-verification'], loader, staleTime: 5000};
    client.observeQuery(definition, vi.fn());
    await flushRequests();
    expect(client.getSnapshot(definition.key)?.isStale).toBe(false);

    const modal = client.observeQuery({...definition, staleTime: 0}, vi.fn());
    await flushRequests();
    expect(loader).toHaveBeenCalledTimes(2);
    modal();

    expect(client.getSnapshot(definition.key)).toMatchObject({value: 'verified', isStale: true});
    await vi.advanceTimersByTimeAsync(500);
    expect(loader).toHaveBeenCalledTimes(2);
    expect(await client.fetchQuery(definition)).toBe('reloaded');
    expect(loader).toHaveBeenCalledTimes(3);
    expect(client.getSnapshot(definition.key)?.isStale).toBe(true);
  });

  it('refreshes once without shortening canonical freshness and still joins pending verification', async () => {
    const client = createClient();
    const pending = deferred<string>();
    const loader = vi
      .fn()
      .mockResolvedValueOnce('initial')
      .mockReturnValueOnce(pending.promise)
      .mockResolvedValue('after expiry');
    const definition = {key: ['one-off-verification'], loader, staleTime: 5000};
    expect(await client.fetchQuery(definition)).toBe('initial');
    await vi.advanceTimersByTimeAsync(100);

    const refreshed = client.fetchQuery(definition, {refresh: true});
    expect(client.fetchQuery(definition, {refresh: true})).toBe(refreshed);
    expect(loader).toHaveBeenCalledTimes(2);
    pending.resolve('verified');
    expect(await refreshed).toBe('verified');
    expect(client.getSnapshot(definition.key)?.isStale).toBe(false);

    await vi.advanceTimersByTimeAsync(4999);
    expect(await client.fetchQuery(definition)).toBe('verified');
    expect(loader).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(1);
    expect(await client.fetchQuery(definition)).toBe('after expiry');
    expect(loader).toHaveBeenCalledTimes(3);
  });

  it('reconciles shared freshness policies but rejects invalid scheduling and operations after destruction', async () => {
    const client = createClient();
    const definition = {key: ['bindings'], loader: async () => 'rows', staleTime: 100};
    await client.fetchQuery(definition);
    expect(await client.fetchQuery({...definition, staleTime: 200})).toBe('rows');
    expect(() => client.observeQuery(definition, vi.fn(), {pollInterval: 0})).toThrow(RangeError);
    client.destroy();
    expect(() => client.fetchQuery(definition)).toThrow('destroyed');
  });

  it('provides developer diagnostics and entry snapshots for active and inactive queries', async () => {
    const client = createClient({maxEntries: 10});
    expect(client.getDiagnostics()).toEqual({
      entryCount: 0,
      activeEntryCount: 0,
      inactiveEntryCount: 0,
      pendingRequestCount: 0,
      totalObserverCount: 0,
      maxEntries: 10,
      isDestroyed: false,
      isVisible: true,
      entries: [],
    });

    const pending = deferred<string>();
    const loader = vi.fn<() => Promise<string>>().mockReturnValue(pending.promise);
    const definition: QueryDefinition<string> = {
      key: ['diagnostics', 'users'],
      tags: [{type: 'user', id: 42}],
      loader,
      staleTime: 5000,
      gcTime: 60000,
    };

    const unsubscribe = client.observeQuery(definition, vi.fn(), {pollInterval: 10000});
    let diag = client.getDiagnostics();
    expect(diag.entryCount).toBe(1);
    expect(diag.activeEntryCount).toBe(1);
    expect(diag.pendingRequestCount).toBe(1);
    expect(diag.totalObserverCount).toBe(1);

    const snapshot = client.getEntriesSnapshot()[0];
    expect(snapshot.key).toEqual(['diagnostics', 'users']);
    expect(snapshot.status).toBe('loading');
    expect(snapshot.isPending).toBe(true);
    expect(snapshot.observerCount).toBe(1);
    expect(snapshot.remainingGcTime).toBeNull();
    expect(snapshot.tagMemberships.length).toBeGreaterThan(0);

    pending.resolve('data');
    await flushRequests();

    diag = client.getDiagnostics();
    expect(diag.pendingRequestCount).toBe(0);
    expect(diag.entries[0].status).toBe('resolved');
    expect(diag.entries[0].hasValue).toBe(true);
    expect(diag.entries[0].remainingPollDelay).toBe(10000);

    unsubscribe();
    diag = client.getDiagnostics();
    expect(diag.activeEntryCount).toBe(0);
    expect(diag.inactiveEntryCount).toBe(1);
    expect(diag.totalObserverCount).toBe(0);
    expect(diag.entries[0].observerCount).toBe(0);
    expect(diag.entries[0].remainingGcTime).toBe(60000);
    expect(diag.entries[0].remainingPollDelay).toBeNull();

    await vi.advanceTimersByTimeAsync(10000);
    expect(client.getDiagnostics().entries[0].remainingGcTime).toBe(50000);

    client.destroy();
    expect(client.getDiagnostics().isDestroyed).toBe(true);
    expect(client.getDiagnostics().entryCount).toBe(0);
  });
});
