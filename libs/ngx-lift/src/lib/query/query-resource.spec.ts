import {DOCUMENT} from '@angular/common';
import {effect, Injector, signal} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {firstValueFrom, Subject} from 'rxjs';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {QueryClient} from './query-client';
import {QUERY_CLIENT} from './query-client.token';
import {queryResource} from './query-resource';

async function settle(): Promise<void> {
  TestBed.tick();
  for (let index = 0; index < 8; index++) {
    await Promise.resolve();
  }
  TestBed.tick();
}

describe('queryResource', () => {
  let client: QueryClient;

  beforeEach(() => {
    client = new QueryClient();
    TestBed.configureTestingModule({providers: [{provide: QUERY_CLIENT, useValue: client}]});
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    client.destroy();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('shares initial reads and refresh results across Signal observers', async () => {
    const loader = vi.fn(async () => loader.mock.calls.length);
    const definition = {key: ['bindings'], loader, staleTime: 5000};
    const first = TestBed.runInInjectionContext(() => queryResource(() => definition));
    const second = TestBed.runInInjectionContext(() => queryResource(() => definition));
    expect(first.status()).toBe('loading');
    expect(first.isLoading()).toBe(true);
    await settle();
    expect(loader).toHaveBeenCalledTimes(1);
    expect(first.value()).toBe(1);
    expect(second.value()).toBe(1);
    first.reload();
    second.reload();
    expect(first.status()).toBe('reloading');
    expect(first.hasValue()).toBe(true);
    await settle();
    expect(loader).toHaveBeenCalledTimes(2);
    expect(first.value()).toBe(2);
    expect(second.value()).toBe(2);
  });

  it('retains the last successful value alongside a background refresh error', async () => {
    const failure = new Error('temporarily unavailable');
    const loader = vi
      .fn<() => Promise<number>>()
      .mockResolvedValueOnce(1)
      .mockRejectedValueOnce(failure)
      .mockResolvedValue(2);
    const resource = TestBed.runInInjectionContext(() => queryResource(() => ({key: ['bindings'], loader})));
    await settle();
    resource.reload();
    await settle();
    expect(resource.status()).toBe('error');
    expect(resource.error()).toBe(failure);
    expect(resource.value()).toBe(1);
    expect(resource.hasValue()).toBe(true);
    expect(resource.isLoading()).toBe(false);
    resource.reload();
    await settle();
    expect(resource.value()).toBe(2);
    expect(resource.error()).toBeNull();
  });

  it('rejects execute on a refresh failure while retaining the successful value', async () => {
    const failure = new Error('refresh failed');
    const loader = vi.fn<() => Promise<number>>().mockResolvedValueOnce(1).mockRejectedValueOnce(failure);
    const resource = TestBed.runInInjectionContext(() => queryResource(() => ({key: ['bindings'], loader})));
    await settle();
    await expect(resource.execute()).rejects.toBe(failure);
    await settle();
    expect(resource.value()).toBe(1);
    expect(resource.error()).toBe(failure);
    expect(resource.status()).toBe('error');
  });

  it('keeps a pending scoped request attached when reload joins it', async () => {
    let finish: ((value: number) => void) | undefined;
    let requestSignal: AbortSignal | undefined;
    const loader = vi.fn(({abortSignal}: {abortSignal: AbortSignal}) => {
      requestSignal = abortSignal;
      return new Promise<number>((resolve) => (finish = resolve));
    });
    const resource = TestBed.runInInjectionContext(() =>
      queryResource(() => ({key: ['scoped-rows'], loader, cancelOnNoObservers: true})),
    );
    await settle();
    resource.reload();
    await settle();
    expect(loader).toHaveBeenCalledTimes(1);
    expect(requestSignal?.aborted).toBe(false);
    finish?.(1);
    await settle();
    expect(resource.value()).toBe(1);
  });

  it('hides the previous tenant immediately when reactive parameters change', async () => {
    const scope = signal('tenant-a');
    const resource = TestBed.runInInjectionContext(() =>
      queryResource(() => {
        const tenant = scope();
        return {key: ['bindings', tenant], loader: async () => tenant};
      }),
    );
    await settle();
    expect(resource.value()).toBe('tenant-a');
    scope.set('tenant-b');
    expect(resource.value()).toBeUndefined();
    expect(resource.hasValue()).toBe(false);
    expect(resource.status()).toBe('loading');
    await settle();
    expect(resource.value()).toBe('tenant-b');
  });

  it('disables an undefined definition and resumes when parameters become available', async () => {
    const enabled = signal(false);
    const loader = vi.fn(async () => 1);
    const resource = TestBed.runInInjectionContext(() =>
      queryResource(() => (enabled() ? {key: ['bindings'], loader} : undefined)),
    );
    await settle();
    expect(resource.status()).toBe('idle');
    expect(resource.reload()).toBe(false);
    await expect(resource.execute()).rejects.toThrow('disabled');
    expect(loader).not.toHaveBeenCalled();
    enabled.set(true);
    await settle();
    expect(resource.value()).toBe(1);
    enabled.set(false);
    expect(resource.value()).toBeUndefined();
    await settle();
    expect(resource.status()).toBe('idle');
  });

  it('does not churn observers when a definition recomputes with the same key', async () => {
    const unrelated = signal(1);
    const loader = vi.fn(async () => 1);
    const observe = vi.spyOn(client, 'observeQuery');
    const resource = TestBed.runInInjectionContext(() =>
      queryResource(() => {
        unrelated();
        return {key: ['bindings'], loader, staleTime: 60000};
      }),
    );
    await settle();
    unrelated.set(2);
    await settle();
    expect(observe).toHaveBeenCalledTimes(1);
    expect(loader).toHaveBeenCalledTimes(1);
    expect(resource.value()).toBe(1);
  });

  it('allows awaiting refreshed data through execute while joining an in-flight read', async () => {
    const source = new Subject<number>();
    const loader = vi.fn(() => firstValueFrom(source));
    const resource = TestBed.runInInjectionContext(() => queryResource(() => ({key: ['awaited'], loader})));
    await settle();
    const received = vi.fn();
    const request = resource.execute();
    void request.then(received);
    await settle();
    expect(received).not.toHaveBeenCalled();
    expect(loader).toHaveBeenCalledTimes(1);
    source.next(7);
    expect(await request).toBe(7);
    await settle();
    expect(resource.value()).toBe(7);
    resource.destroy();
    await expect(resource.execute()).rejects.toThrow('destroyed');
  });

  it('reports loading immediately when a disabled query is re-enabled with the same key', async () => {
    const enabled = signal(true);
    const loader = vi.fn(async () => 1);
    const resource = TestBed.runInInjectionContext(() =>
      queryResource(() => (enabled() ? {key: ['bindings'], loader, staleTime: 60000} : undefined)),
    );
    await settle();
    expect(resource.value()).toBe(1);
    enabled.set(false);
    await settle();
    expect(resource.status()).toBe('idle');
    expect(resource.value()).toBeUndefined();

    enabled.set(true);
    expect(resource.status()).toBe('loading');
    expect(resource.isLoading()).toBe(true);
    expect(resource.hasValue()).toBe(false);
    expect(resource.value()).toBeUndefined();
    await settle();
    expect(resource.value()).toBe(1);
    expect(resource.status()).toBe('resolved');
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it('updates same-key reactive tags and captured loaders without fetching until invalidated', async () => {
    const version = signal(1);
    const loader = vi.fn(async (captured: number) => captured);
    const observe = vi.spyOn(client, 'observeQuery');
    const resource = TestBed.runInInjectionContext(() =>
      queryResource(() => {
        const captured = version();
        return {
          key: ['bindings'],
          loader: () => loader(captured),
          tags: [{type: `Bindings-${captured}`}],
          staleTime: 60000,
        };
      }),
    );
    await settle();
    version.set(2);
    await settle();
    expect(observe).toHaveBeenCalledTimes(1);
    expect(loader).toHaveBeenCalledTimes(1);
    client.invalidateTags([{type: 'Bindings-2'}]);
    await settle();
    expect(resource.value()).toBe(2);
    expect(loader).toHaveBeenCalledTimes(2);
  });

  it('updates reactive polling options without forcing a fresh read', async () => {
    vi.useFakeTimers();
    const interval = signal<number | undefined>(1000);
    const loader = vi.fn(async () => loader.mock.calls.length);
    const resource = TestBed.runInInjectionContext(() =>
      queryResource(() => ({key: ['bindings'], loader, staleTime: 60000}), {pollInterval: interval}),
    );
    await settle();
    expect(resource.value()).toBe(1);
    await vi.advanceTimersByTimeAsync(1000);
    await settle();
    expect(resource.value()).toBe(2);
    interval.set(undefined);
    await settle();
    await vi.advanceTimersByTimeAsync(2000);
    await settle();
    expect(loader).toHaveBeenCalledTimes(2);
    interval.set(500);
    await settle();
    expect(loader).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(500);
    await settle();
    expect(resource.value()).toBe(3);
  });

  it('disposes one observer while keeping another observer synchronized', async () => {
    const loader = vi.fn(async () => loader.mock.calls.length);
    const definition = {key: ['bindings'], loader, tags: [{type: 'Bindings'}]};
    const first = TestBed.runInInjectionContext(() => queryResource(() => definition));
    const second = TestBed.runInInjectionContext(() => queryResource(() => definition));
    await settle();
    first.destroy();
    expect(first.reload()).toBe(false);
    client.invalidateTags([{type: 'Bindings'}]);
    await settle();
    expect(loader).toHaveBeenCalledTimes(2);
    expect(first.value()).toBe(1);
    expect(second.value()).toBe(2);
    second.destroy();
    client.invalidateTags([{type: 'Bindings'}]);
    await settle();
    expect(loader).toHaveBeenCalledTimes(2);
  });

  it('uses an explicit injector outside the ambient injection context', async () => {
    const resource = queryResource(() => ({key: ['bindings'], loader: async () => 1}), {
      injector: TestBed.inject(Injector),
    });
    await settle();
    expect(resource.value()).toBe(1);
  });

  it('reattaches a removed query when explicitly reloaded without resurrecting it on removal', async () => {
    const loader = vi.fn(async () => loader.mock.calls.length);
    const definition = {key: ['bindings'], loader, staleTime: 60000};
    const resource = TestBed.runInInjectionContext(() => queryResource(() => definition));
    await settle();
    expect(resource.value()).toBe(1);
    client.removeQueries();
    await settle();
    expect(loader).toHaveBeenCalledTimes(1);
    expect(resource.value()).toBeUndefined();
    expect(resource.status()).toBe('idle');
    expect(resource.reload()).toBe(true);
    await settle();
    expect(resource.value()).toBe(2);
    expect(resource.status()).toBe('resolved');
  });

  it('reattaches after another observer has recreated the removed key', async () => {
    const loader = vi.fn(async () => loader.mock.calls.length);
    const definition = {key: ['bindings'], loader, staleTime: 60000};
    const first = TestBed.runInInjectionContext(() => queryResource(() => definition));
    await settle();
    client.removeQueries();
    const second = TestBed.runInInjectionContext(() => queryResource(() => definition));
    await settle();
    expect(second.value()).toBe(2);
    expect(first.value()).toBeUndefined();
    first.reload();
    await settle();
    expect(first.value()).toBe(3);
    expect(second.value()).toBe(3);
  });

  it('does not add observer signal dependencies to the effect that publishes cache updates', async () => {
    const tenant = signal('a');
    const tags = [{type: 'Bindings'}];
    TestBed.runInInjectionContext(() =>
      queryResource(() => {
        const scope = tenant();
        return {key: ['bindings', scope], loader: async () => scope, tags};
      }),
    );
    await settle();
    let publishingRuns = 0;
    TestBed.runInInjectionContext(() =>
      effect(() => {
        publishingRuns++;
        client.invalidateTags(tags);
      }),
    );
    await settle();
    expect(publishingRuns).toBe(1);
    tenant.set('b');
    await settle();
    expect(publishingRuns).toBe(1);
  });
});

describe('QUERY_CLIENT browser and server lifecycle', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('pauses polling while the document is hidden and removes its listener on injector destruction', async () => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({});
    const document = TestBed.inject(DOCUMENT);
    const visibility = vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible');
    const addListener = vi.spyOn(document, 'addEventListener');
    const removeListener = vi.spyOn(document, 'removeEventListener');
    const client = TestBed.inject(QUERY_CLIENT);
    const loader = vi.fn(async () => 1);
    const definition = {key: ['bindings'], loader, staleTime: 60000};
    client.observeQuery(definition, () => undefined, {pollInterval: 1000});
    await client.fetchQuery(definition);
    expect(addListener).toHaveBeenCalledWith('visibilitychange', expect.any(Function));
    visibility.mockReturnValue('hidden');
    document.dispatchEvent(new Event('visibilitychange'));
    await vi.advanceTimersByTimeAsync(1000);
    expect(loader).toHaveBeenCalledTimes(1);
    visibility.mockReturnValue('visible');
    document.dispatchEvent(new Event('visibilitychange'));
    await settle();
    expect(loader).toHaveBeenCalledTimes(2);
    TestBed.resetTestingModule();
    expect(removeListener).toHaveBeenCalledWith('visibilitychange', expect.any(Function));
    expect(vi.getTimerCount()).toBe(0);
  });

  it('fetches initially on the server without visibility listeners or background polling', async () => {
    vi.useFakeTimers();
    const document = {defaultView: null, addEventListener: vi.fn(), removeEventListener: vi.fn()};
    TestBed.configureTestingModule({providers: [{provide: DOCUMENT, useValue: document}]});
    const client = TestBed.inject(QUERY_CLIENT);
    const loader = vi.fn(async () => 1);
    const definition = {key: ['bindings'], loader, staleTime: 60000};
    client.observeQuery(definition, () => undefined, {pollInterval: 1000});
    expect(await client.fetchQuery(definition)).toBe(1);
    await vi.advanceTimersByTimeAsync(5000);
    expect(loader).toHaveBeenCalledTimes(1);
    expect(document.addEventListener).not.toHaveBeenCalled();
  });
});
