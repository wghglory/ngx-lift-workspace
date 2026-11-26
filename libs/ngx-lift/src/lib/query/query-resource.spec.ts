import {DOCUMENT} from '@angular/common';
import {HttpClient, provideHttpClient, withInterceptors} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {ChangeDetectionStrategy, Component, effect, Injector, input, signal} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {EMPTY, EmptyError, firstValueFrom, Observable, of, Subject, throwError} from 'rxjs';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {QueryDefinition} from './query.models';
import {QueryClient} from './query-client';
import {provideQueryClient, QUERY_CLIENT} from './query-client.token';
import {QueryResourceDisabledError, QueryResourceDisposedError} from './query-errors';
import {queryResource} from './query-resource';

@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class QueryConsumerComponent {
  definition = input.required<QueryDefinition<string>>();
  interval = input(1000);
  query = queryResource(() => this.definition(), {pollInterval: this.interval});
}

@Component({
  selector: 'lib-polling-query',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
})
class PollingQueryComponent {
  readonly interval = input.required<number>();
  readonly query = queryResource(() => ({key: ['required-poll'], loader: async () => 1}), {
    pollInterval: this.interval,
  });
}

@Component({
  imports: [PollingQueryComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<lib-polling-query [interval]="interval()" />',
})
class PollingQueryHostComponent {
  readonly interval = signal(500);
}

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

  it('uses a bound required input for the first polling interval and tracks its changes', async () => {
    vi.useFakeTimers();
    const observe = vi.spyOn(client, 'observeQuery');
    const host = TestBed.createComponent(PollingQueryHostComponent);
    host.detectChanges();
    await settle();
    expect(observe.mock.calls[0][2]?.pollInterval).toBe(500);
    host.componentInstance.interval.set(1000);
    host.detectChanges();
    await settle();
    expect(client.getEntriesSnapshot()[0].remainingPollDelay).toBe(1000);
  });

  it('can attach after its first polling configuration was rejected', async () => {
    const interval = signal(0);
    const source = new Subject<number>();
    const resource = TestBed.runInInjectionContext(() =>
      queryResource(() => ({key: ['invalid-interval'], loader: () => source, cancelOnNoObservers: true}), {
        pollInterval: interval,
      }),
    );
    await settle();
    expect(resource.error()).toBeInstanceOf(RangeError);
    interval.set(100);
    const read = resource.execute();
    expect(client.getDiagnostics().totalObserverCount).toBe(1);
    resource.destroy();
    await expect(read).rejects.toMatchObject({name: 'AbortError'});
  });

  it.each([false, true])('owns immediate execution through destruction (surviving observer: %s)', async (shared) => {
    const source = new Subject<number>();
    const definition = {key: ['immediate'], loader: vi.fn(() => source), cancelOnNoObservers: true};
    const first = TestBed.runInInjectionContext(() => queryResource(() => definition));
    const request = first.execute();
    const survivor = shared ? client.observeQuery(definition, () => undefined) : undefined;
    first.destroy();
    expect(source.observed).toBe(shared);
    if (shared) {
      source.next(42);
      await expect(request).resolves.toBe(42);
    } else {
      await expect(request).rejects.toMatchObject({name: 'AbortError'});
    }
    expect(definition.loader).toHaveBeenCalledTimes(1);
    survivor?.();
  });

  it('owns a read started from the preceding key’s teardown', async () => {
    const key = signal('a');
    const replacement = new Subject<number>();
    let read: Promise<number | undefined> | undefined;
    const outgoing = new Observable<number>(() => () => {
      read = resource.execute();
      void read.catch(() => undefined);
      resource.destroy();
    });
    const resource = TestBed.runInInjectionContext(() =>
      queryResource(() => {
        const id = key();
        return {key: [id], loader: () => (id === 'a' ? outgoing : replacement), cancelOnNoObservers: true};
      }),
    );
    await settle();
    key.set('b');
    await settle();
    expect(replacement.observed).toBe(false);
    await expect(read).rejects.toMatchObject({name: 'AbortError'});
  });

  it('joins a reload from a custom client that forwards only public options during registration', async () => {
    const observe = client.observeQuery.bind(client);
    const source = new Subject<number>();
    const loader = vi.fn(() => source);
    let registrations = 0;
    vi.spyOn(client, 'observeQuery').mockImplementation((definition, listener, options) => {
      // Bound the failure so recursive registration produces a deterministic assertion.
      if (++registrations > 2) throw new Error('Recursive observer registration');
      return observe(
        definition,
        (snapshot) => {
          if (snapshot.status === 'idle') resource.reload();
          listener(snapshot);
        },
        {pollInterval: options?.pollInterval},
      );
    });
    const resource = TestBed.runInInjectionContext(() =>
      queryResource(() => ({key: ['custom-registration'], loader, cancelOnNoObservers: true})),
    );
    await settle();
    expect(registrations).toBe(1);
    expect(loader).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({refresh: true}));
    expect(resource.status()).toBe('loading');
    expect(resource.isLoading()).toBe(true);
    source.next(7);
    await settle();
    expect(resource.value()).toBe(7);
    expect(client.getDiagnostics().totalObserverCount).toBe(1);
  });

  it.each([false, true])(
    'keeps a refresh visible when a client forwards the preceding success (copied snapshot: %s)',
    async (copy) => {
      const observe = client.observeQuery.bind(client);
      const source = new Subject<number>();
      let refreshed = false;
      vi.spyOn(client, 'observeQuery').mockImplementation((query, listener, options) =>
        observe(
          query,
          (snapshot) => {
            if (snapshot.status === 'resolved' && !refreshed) {
              refreshed = true;
              resource.reload();
            }
            listener(copy && snapshot.status === 'reloading' ? {...snapshot} : snapshot);
          },
          options,
        ),
      );
      const resource = TestBed.runInInjectionContext(() =>
        queryResource(() => ({key: ['wrapped-refresh'], loader: () => source})),
      );
      await settle();
      source.next(1);
      await settle();
      expect(resource.value()).toBe(1);
      expect(resource.isRefreshing()).toBe(true);
      source.next(2);
      await settle();
      expect(resource.status()).toBe('resolved');
      expect(resource.value()).toBe(2);
    },
  );

  it('keeps purged data hidden when a decorator forwards a structured clone after removal', async () => {
    const observe = client.observeQuery.bind(client);
    vi.spyOn(client, 'observeQuery').mockImplementation((query, listener, options) =>
      observe(
        query,
        (snapshot) => {
          if (snapshot.status === 'resolved') client.removeQueries();
          listener(structuredClone(snapshot));
        },
        options,
      ),
    );
    const resource = TestBed.runInInjectionContext(() =>
      queryResource(() => ({key: ['purged-copy'], loader: () => of(7)})),
    );
    await settle();
    expect(client.getSnapshot(['purged-copy'])).toBeUndefined();
    expect(resource.status()).toBe('idle');
    expect(resource.hasValue()).toBe(false);
    expect(resource.value()).toBeUndefined();
  });

  it.each(['shallow', 'structured'] as const)(
    'preserves error translations on a %s copy of a snapshot',
    async (copy) => {
      const observe = client.observeQuery.bind(client);
      const transportError = new Error('transport');
      const translated = new Error('Service unavailable');
      vi.spyOn(client, 'observeQuery').mockImplementation((query, listener, options) =>
        observe(
          query,
          (snapshot) => {
            if (snapshot.status === 'error') {
              const copied = copy === 'shallow' ? {...snapshot} : structuredClone(snapshot);
              listener({...copied, error: translated});
            } else listener(snapshot);
          },
          options,
        ),
      );
      const resource = TestBed.runInInjectionContext(() =>
        queryResource(() => ({key: ['translated-error'], loader: () => throwError(() => transportError)})),
      );
      await settle();
      expect(resource.error()).toBe(translated);
      expect(client.getSnapshot(['translated-error'])?.error).toBe(transportError);
    },
  );

  it('keeps an inactive cache entry idle when a custom client reloads and destroys before attaching', async () => {
    const loader = vi.fn(async () => 7);
    const definition = {key: ['custom-before-registration'], loader, staleTime: Infinity};
    await client.fetchQuery(definition);
    const observe = client.observeQuery.bind(client);
    vi.spyOn(client, 'observeQuery').mockImplementation((query, listener) => {
      resource.reload();
      resource.destroy();
      return observe(query, listener);
    });
    const resource = TestBed.runInInjectionContext(() => queryResource(() => definition));
    await settle();
    expect(loader).toHaveBeenCalledTimes(1);
    expect(client.getDiagnostics().totalObserverCount).toBe(0);
  });

  it('returns the shared result to a reentrant caller destroyed while a peer keeps the read alive', async () => {
    const source = new Subject<number>();
    let joined: Promise<number | undefined> | undefined;
    const definition: QueryDefinition<number> = {
      key: ['shared-registration'],
      cancelOnNoObservers: true,
      loader: () => {
        joined = resource.execute();
        void joined.catch(() => undefined);
        client.observeQuery(definition, () => undefined);
        resource.destroy();
        return source;
      },
    };
    const resource = TestBed.runInInjectionContext(() => queryResource(() => definition));
    await settle();
    expect(client.getDiagnostics().totalObserverCount).toBe(1);
    source.next(42);
    await expect(joined).resolves.toBe(42);
  });

  it.each(['execute then remove', 'remove then execute'] as const)(
    'preserves the order of a manual execution and removal inside the initial loader (%s)',
    async (order) => {
      let nested: Promise<number | undefined> | undefined;
      const loader = vi
        .fn<() => Observable<number>>()
        .mockImplementationOnce(() => {
          if (order === 'remove then execute') client.removeQueries();
          nested = resource.execute();
          void nested.catch(() => undefined);
          if (order === 'execute then remove') client.removeQueries();
          return of(1);
        })
        .mockReturnValue(of(2));
      const resource = TestBed.runInInjectionContext(() =>
        queryResource(() => ({key: ['ordered-removal'], loader, cancelOnNoObservers: true})),
      );
      await settle();
      if (order === 'execute then remove') {
        expect(loader).toHaveBeenCalledTimes(1);
        await expect(nested).rejects.toMatchObject({name: 'AbortError'});
        expect(client.getDiagnostics().entryCount).toBe(0);
      } else {
        await expect(nested).resolves.toBe(2);
        expect(resource.value()).toBe(2);
        expect(loader).toHaveBeenCalledTimes(2);
        expect(client.getDiagnostics().totalObserverCount).toBe(1);
      }
    },
  );

  it('does not start an ownerless read when the initial loader removes the entry during attachment', async () => {
    const source = new Subject<number>();
    let nested: Promise<number | undefined> | undefined;
    const loader = vi
      .fn<() => Observable<number>>()
      .mockImplementationOnce(() => {
        client.removeQueries();
        nested = resource.execute();
        void nested.catch(() => undefined);
        resource.destroy();
        return source;
      })
      .mockReturnValue(source);
    const resource = TestBed.runInInjectionContext(() =>
      queryResource(() => ({
        key: ['removed-during-attach'],
        loader,
        cancelOnNoObservers: true,
      })),
    );
    await settle();
    expect(source.observed).toBe(false);
    await expect(nested).rejects.toMatchObject({name: 'AbortError'});
  });

  it('checks the current selection after the outgoing transport disables the query', async () => {
    const key = signal<string | undefined>('a');
    const replacement = vi.fn(() => of(2));
    const outgoing = new Observable<number>(() => () => key.set(undefined));
    const resource = TestBed.runInInjectionContext(() =>
      queryResource(() => {
        const id = key();
        return id
          ? {key: [id], loader: id === 'a' ? () => outgoing : replacement, cancelOnNoObservers: true}
          : undefined;
      }),
    );
    await settle();
    key.set('b');
    await settle();
    expect(resource.status()).toBe('idle');
    expect(replacement).not.toHaveBeenCalled();
  });

  it('reports a failed manual recovery after removal once with its manual trigger', async () => {
    const report = vi.fn();
    client.destroy();
    client = new QueryClient({onQueryError: report});
    const failure = new Error('manual refresh failed');
    const loader = vi.fn<() => Promise<number>>().mockResolvedValueOnce(1).mockRejectedValueOnce(failure);
    const resource = TestBed.runInInjectionContext(() => queryResource(() => ({key: ['recover'], loader}), {client}));
    await settle();
    client.removeQueries();
    await expect(resource.execute()).rejects.toBe(failure);
    expect(loader).toHaveBeenCalledTimes(2);
    expect(report).toHaveBeenCalledExactlyOnceWith(failure, expect.objectContaining({trigger: 'manual'}));
  });

  it('distinguishes falsy initial errors from refresh errors after successful undefined data', async () => {
    const enabled = signal(true);
    const failure = new Error('refresh failed');
    const loader = vi
      .fn<() => Promise<number | undefined>>()
      .mockRejectedValueOnce(null)
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(failure);
    const resource = TestBed.runInInjectionContext(() =>
      queryResource(() => (enabled() ? {key: ['failure-signals'], loader} : undefined)),
    );
    await settle();
    expect(resource.error()).toBeNull();
    expect(resource.isInitialError()).toBe(true);
    expect(resource.isRefreshError()).toBe(false);
    expect(resource.failureCount()).toBe(1);
    await resource.execute();
    await settle();
    expect(resource.updatedAt()).not.toBeNull();
    expect(resource.failureCount()).toBe(0);
    expect(resource.hasValue()).toBe(false);
    await expect(resource.execute()).rejects.toBe(failure);
    await settle();
    expect(resource.isInitialError()).toBe(false);
    expect(resource.isRefreshError()).toBe(true);
    expect(resource.failureReason()).toBe(failure);
    enabled.set(false);
    expect(resource.status()).toBe('idle');
    expect(resource.failureCount()).toBe(0);
    expect(resource.nextRetryAt()).toBeNull();
    expect(resource.updatedAt()).toBeNull();
  });

  it('coordinates mounted components with different policies and isolates scope keys', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
    const loader = vi.fn(async () => 'shared');
    const otherLoader = vi.fn(async () => 'other');
    const slow = TestBed.createComponent(QueryConsumerComponent);
    const fast = TestBed.createComponent(QueryConsumerComponent);
    const isolated = TestBed.createComponent(QueryConsumerComponent);
    slow.componentRef.setInput('definition', {key: ['widgets', 'a'], loader, staleTime: 5000, gcTime: 5000});
    slow.componentRef.setInput('interval', 1000);
    fast.componentRef.setInput('definition', {key: ['widgets', 'a'], loader, staleTime: 1000, gcTime: 1000});
    fast.componentRef.setInput('interval', 100);
    isolated.componentRef.setInput('definition', {key: ['widgets', 'b'], loader: otherLoader, staleTime: Infinity});
    isolated.componentRef.setInput('interval', undefined);
    for (const fixture of [slow, fast, isolated]) fixture.detectChanges();
    await settle();
    expect(loader).toHaveBeenCalledTimes(1);
    expect(otherLoader).toHaveBeenCalledTimes(1);
    expect(client.getDiagnostics().totalObserverCount).toBe(3);
    const entry = client.getEntriesSnapshot().find((entry) => entry.key[1] === 'a');
    expect(entry).toMatchObject({observerCount: 2, staleTime: 1000, gcTime: 5000, remainingPollDelay: 100});
    await vi.advanceTimersByTimeAsync(100);
    await settle();
    expect(loader).toHaveBeenCalledTimes(2);
    fast.destroy();
    await vi.advanceTimersByTimeAsync(1000);
    await settle();
    expect(loader).toHaveBeenCalledTimes(3);
    expect(otherLoader).toHaveBeenCalledTimes(1);
    expect(slow.componentInstance.query.value()).toBe('shared');
    slow.destroy();
    expect(client.getEntriesSnapshot().find((entry) => entry.key[1] === 'a')).toMatchObject({
      observerCount: 0,
      remainingGcTime: 5000,
      remainingPollDelay: null,
    });
    await vi.advanceTimersByTimeAsync(5000);
    await settle();
    expect(client.getSnapshot(['widgets', 'a'])).toBeUndefined();
    expect(isolated.componentInstance.query.value()).toBe('other');
    isolated.destroy();
  });

  it('shares initial reads and refresh results across Signal observers', async () => {
    const loader = vi.fn(async () => loader.mock.calls.length);
    const definition = {key: ['bindings'], loader, staleTime: 5000};
    const first = TestBed.runInInjectionContext(() => queryResource(() => definition));
    const second = TestBed.runInInjectionContext(() => queryResource(() => definition));
    expect(first.status()).toBe('loading');
    expect(first.isLoading()).toBe(true);
    expect(first.isInitialLoading()).toBe(true);
    expect(first.isRefreshing()).toBe(false);
    await settle();
    expect(loader).toHaveBeenCalledTimes(1);
    expect(first.value()).toBe(1);
    expect(second.value()).toBe(1);
    expect(first.isInitialLoading()).toBe(false);
    expect(first.isRefreshing()).toBe(false);
    first.reload();
    second.reload();
    expect(first.status()).toBe('reloading');
    expect(first.isLoading()).toBe(true);
    expect(first.isInitialLoading()).toBe(false);
    expect(first.isRefreshing()).toBe(true);
    expect(first.hasValue()).toBe(true);
    await settle();
    expect(loader).toHaveBeenCalledTimes(2);
    expect(first.value()).toBe(2);
    expect(second.value()).toBe(2);
    expect(first.isInitialLoading()).toBe(false);
    expect(first.isRefreshing()).toBe(false);
  });

  it.each(['initial', 'recovery'] as const)(
    'detaches when destroyed during a synchronous %s snapshot',
    async (phase) => {
      const observe = client.observeQuery.bind(client);
      const definition = {
        key: ['synchronous-destroy'],
        loader: vi.fn(async () => 1),
        tags: [{type: 'SyncDestroy'}],
        staleTime: Infinity,
      };
      const resource = TestBed.runInInjectionContext(() => queryResource(() => definition));
      if (phase === 'recovery') {
        await settle();
        client.removeQueries();
        await settle();
      }
      let attached: (() => boolean) | undefined;
      vi.spyOn(client, 'observeQuery').mockImplementation((query, listener, options) => {
        const handle = observe(
          query,
          (snapshot) => {
            listener(snapshot);
            resource.destroy();
          },
          options,
        );
        attached = handle.isAttached;
        return handle;
      });
      if (phase === 'recovery') resource.reload();
      await settle();
      expect(attached?.()).toBe(false);
      const calls = definition.loader.mock.calls.length;
      client.invalidateTags(definition.tags);
      await settle();
      expect(definition.loader).toHaveBeenCalledTimes(calls);
    },
  );

  it('reads a fresh cached value immediately before the observer effect runs', async () => {
    const definition = {key: ['warm-cache'], loader: vi.fn(async () => 7), staleTime: Infinity};
    await client.fetchQuery(definition);
    const resource = TestBed.runInInjectionContext(() => queryResource(() => definition));
    expect(resource.value()).toBe(7);
    expect(resource.status()).toBe('resolved');
    expect(resource.isLoading()).toBe(false);
    await settle();
    expect(definition.loader).toHaveBeenCalledTimes(1);
  });

  it.each([0, 1])('retains stale cached data synchronously on mount (staleTime: %s)', async (staleTime) => {
    let now = 0;
    client.destroy();
    client = new QueryClient({now: () => now});
    TestBed.overrideProvider(QUERY_CLIENT, {useValue: client});
    const source = new Subject<number>();
    const loader = vi.fn(() => source);
    const definition = {key: ['stale-cache'], loader, staleTime};
    await client.fetchQuery({...definition, loader: async () => 7});
    now = 2;
    const resource = TestBed.runInInjectionContext(() => queryResource(() => ({...definition, loader})));
    expect(resource.value()).toBe(7);
    expect(resource.hasValue()).toBe(true);
    expect(resource.status()).toBe('reloading');
    expect(resource.isLoading()).toBe(true);
    expect(resource.isStale()).toBe(true);
    await settle();
    // Keep the revalidation pending so cached data remains visible throughout attachment.
    expect(resource.value()).toBe(7);
    source.next(9);
    await settle();
    expect(resource.value()).toBe(9);
    expect(resource.status()).toBe('resolved');
  });

  it('takes the first synchronous Observable value and supports Promise refreshes', async () => {
    const contexts: boolean[] = [];
    const resource = TestBed.runInInjectionContext(() =>
      queryResource(() => ({
        key: ['mixed-source'],
        loader: ({refresh}) => {
          contexts.push(refresh);
          return refresh ? Promise.resolve(3) : of(1, 2);
        },
      })),
    );
    await settle();
    expect(resource.value()).toBe(1);
    expect(await resource.execute()).toBe(3);
    await settle();
    expect(resource.value()).toBe(3);
    expect(contexts).toEqual([false, true]);
  });

  it('shares a direct Observable definition with imperative client reads', async () => {
    const definition = {key: ['shared-observable'], loader: () => of(7)};
    const resource = TestBed.runInInjectionContext(() => queryResource(() => definition));
    await settle();
    expect(resource.value()).toBe(7);
    expect(await client.fetchQuery(definition)).toBe(7);
  });

  it('reports empty Observable reads and retains data on Observable refresh errors', async () => {
    const failure = new Error('refresh failed');
    const version = signal(0);
    const resource = TestBed.runInInjectionContext(() =>
      queryResource(() => {
        const current = version();
        return {
          key: ['observable-errors'],
          loader: () => (current === 0 ? EMPTY : current === 1 ? of(1) : throwError(() => failure)),
        };
      }),
    );
    await settle();
    expect(resource.error()).toBeInstanceOf(EmptyError);
    expect(resource.status()).toBe('error');
    version.set(1);
    await settle();
    expect(await resource.execute()).toBe(1);
    version.set(2);
    await settle();
    await expect(resource.execute()).rejects.toBe(failure);
    await settle();
    expect(resource.value()).toBe(1);
    expect(resource.error()).toBe(failure);
  });

  it('cancels scoped Observable reads when the key changes, disables, or destroys', async () => {
    const scope = signal<string | undefined>('a');
    const sources = new Map<string, Subject<string>>();
    const resource = TestBed.runInInjectionContext(() =>
      queryResource(() => {
        const key = scope();
        if (!key) return undefined;
        return {
          key: ['scoped-observable', key],
          cancelOnNoObservers: true,
          loader: () => {
            const source = new Subject<string>();
            sources.set(key, source);
            return source;
          },
        };
      }),
    );
    await settle();
    expect(sources.get('a')?.observed).toBe(true);
    scope.set('b');
    await settle();
    expect(sources.get('a')?.observed).toBe(false);
    expect(sources.get('b')?.observed).toBe(true);
    sources.get('a')?.next('obsolete');
    expect(resource.value()).toBeUndefined();
    scope.set(undefined);
    await settle();
    expect(sources.get('b')?.observed).toBe(false);
    expect(resource.status()).toBe('idle');
    scope.set('c');
    await settle();
    expect(sources.get('c')?.observed).toBe(true);
    TestBed.resetTestingModule();
    expect(sources.get('c')?.observed).toBe(false);
  });

  it('lets default shared Observable reads finish after observer destruction', async () => {
    const source = new Subject<number>();
    const resource = TestBed.runInInjectionContext(() =>
      queryResource(() => ({key: ['shared-observable'], loader: () => source})),
    );
    await settle();
    resource.destroy();
    expect(source.observed).toBe(true);
    source.next(9);
    await settle();
    expect(source.observed).toBe(false);
    expect(client.getSnapshot<number>(['shared-observable'])?.value).toBe(9);
  });

  it('deduplicates direct HttpClient loaders and cancels only after the last scoped observer leaves', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(
          withInterceptors([(request, next) => next(request.clone({setHeaders: {'X-Query': 'test'}}))]),
        ),
        provideHttpClientTesting(),
      ],
    });
    const http = TestBed.inject(HttpClient);
    const controller = TestBed.inject(HttpTestingController);
    const loader = vi.fn(() => http.get<number>('/api/value'));
    const definition = {key: ['http-value'], loader, cancelOnNoObservers: true};
    const first = TestBed.runInInjectionContext(() => queryResource(() => definition));
    const second = TestBed.runInInjectionContext(() => queryResource(() => definition));
    await settle();
    const request = controller.expectOne('/api/value');
    expect(request.request.headers.get('X-Query')).toBe('test');
    expect(loader).toHaveBeenCalledTimes(1);
    first.destroy();
    expect(request.cancelled).toBe(false);
    request.flush(7);
    await settle();
    expect(second.value()).toBe(7);
    second.reload();
    await settle();
    const refresh = controller.expectOne('/api/value');
    second.destroy();
    expect(refresh.cancelled).toBe(true);
    controller.verify();
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
    await expect(resource.execute()).rejects.toBeInstanceOf(QueryResourceDisabledError);
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
    await expect(resource.execute()).rejects.toBeInstanceOf(QueryResourceDisposedError);
  });

  it('reads a fresh cache immediately when a disabled query is re-enabled with the same key', async () => {
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
    expect(resource.status()).toBe('resolved');
    expect(resource.isLoading()).toBe(false);
    expect(resource.hasValue()).toBe(true);
    expect(resource.value()).toBe(1);
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

  it('eagerly passes initial pollInterval to client.observeQuery on first attach', async () => {
    const observeSpy = vi.spyOn(client, 'observeQuery');
    const loader = vi.fn(async () => 1);
    TestBed.runInInjectionContext(() =>
      queryResource(() => ({key: ['eager-poll'], loader, staleTime: 60000}), {pollInterval: 2500}),
    );
    await settle();
    expect(observeSpy).toHaveBeenCalledWith(
      expect.objectContaining({key: ['eager-poll']}),
      expect.any(Function),
      expect.objectContaining({pollInterval: 2500}),
    );
  });

  it('eagerly passes initial pollInterval from a signal to client.observeQuery on first attach', async () => {
    const observeSpy = vi.spyOn(client, 'observeQuery');
    const loader = vi.fn(async () => 1);
    const interval = signal(3000);
    TestBed.runInInjectionContext(() =>
      queryResource(() => ({key: ['eager-poll-signal'], loader, staleTime: 60000}), {pollInterval: interval}),
    );
    await settle();
    expect(observeSpy).toHaveBeenCalledWith(
      expect.objectContaining({key: ['eager-poll-signal']}),
      expect.any(Function),
      expect.objectContaining({pollInterval: 3000}),
    );
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

  it('joins rapid and reentrant reloads during recovery without leaking an observer', async () => {
    const source = new Subject<number>();
    const loader = vi.fn(() => source);
    const definition = {
      key: ['reentrant-recovery'],
      loader,
      tags: [{type: 'Recovery'}],
      cancelOnNoObservers: true,
    };
    const observe = client.observeQuery.bind(client);
    const observeSpy = vi.spyOn(client, 'observeQuery');
    const resource = TestBed.runInInjectionContext(() => queryResource(() => definition));
    await settle();
    source.next(1);
    await settle();
    client.removeQueries();
    await settle();
    let reentered = false;
    observeSpy.mockImplementation((query, listener, options) =>
      observe(
        query,
        (snapshot) => {
          listener(snapshot);
          if (!reentered) {
            reentered = true;
            expect(resource.reload()).toBe(true);
          }
        },
        options,
      ),
    );
    expect(resource.reload()).toBe(true);
    expect(resource.reload()).toBe(true);
    expect(resource.reload()).toBe(true);
    await settle();
    expect(reentered).toBe(true);
    expect(observeSpy).toHaveBeenCalledTimes(2);
    expect(loader).toHaveBeenCalledTimes(2);
    expect(source.observed).toBe(true);
    resource.destroy();
    expect(source.observed).toBe(false);
    client.invalidateTags(definition.tags);
    await settle();
    expect(loader).toHaveBeenCalledTimes(2);
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

  it('configures defaults while retaining browser recovery and disposing every listener', async () => {
    TestBed.configureTestingModule({providers: [provideQueryClient({queryDefaults: {refetchOnReconnect: true}})]});
    const document = TestBed.inject(DOCUMENT);
    const view = document.defaultView;
    if (!view) throw new Error('Browser test requires a window');
    const add = vi.spyOn(view, 'addEventListener');
    const remove = vi.spyOn(view, 'removeEventListener');
    const client = TestBed.inject(QUERY_CLIENT);
    const loader = vi.fn(async () => 42);
    const definition = {key: ['provider-recovery'], loader};
    client.observeQuery(definition, () => undefined);
    await client.fetchQuery(definition);
    view.dispatchEvent(new Event('online'));
    await client.fetchQuery(definition);
    expect(loader).toHaveBeenCalledTimes(2);
    expect(add).toHaveBeenCalledWith('focus', expect.any(Function));
    expect(add).toHaveBeenCalledWith('online', expect.any(Function));
    TestBed.resetTestingModule();
    expect(remove).toHaveBeenCalledWith('focus', expect.any(Function));
    expect(remove).toHaveBeenCalledWith('online', expect.any(Function));
    expect(() => client.fetchQuery(definition)).toThrow('destroyed');
  });

  it('preserves provider SSR defaults when optional overrides are explicitly undefined', async () => {
    vi.useFakeTimers();
    const document = {defaultView: null, addEventListener: vi.fn(), removeEventListener: vi.fn()};
    TestBed.configureTestingModule({
      providers: [
        {provide: DOCUMENT, useValue: document},
        provideQueryClient({
          isVisible: undefined,
          subscribeVisibility: undefined,
          subscribeFocus: undefined,
          queryDefaults: {refetchOnFocus: true},
        }),
      ],
    });
    const client = TestBed.inject(QUERY_CLIENT);
    const loader = vi.fn(async () => 42);
    const definition = {key: ['provider-ssr'], loader};
    client.observeQuery(definition, () => undefined, {pollInterval: 10});
    await client.fetchQuery(definition);
    await vi.advanceTimersByTimeAsync(30);
    expect(loader).toHaveBeenCalledTimes(1);
    expect(document.addEventListener).not.toHaveBeenCalled();
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
