import {
  assertInInjectionContext,
  computed,
  DestroyRef,
  effect,
  inject,
  Injector,
  Signal,
  signal,
  untracked,
} from '@angular/core';
import {Observable, Subject} from 'rxjs';

import {QueryDefinition, QueryObserverHandle, QuerySnapshot, QueryStatus} from './query.models';
import {QueryClient} from './query-client';
import {QUERY_CLIENT} from './query-client.token';
import {serializeQueryKey} from './query-key';
import {resourceAsync} from './resource-async';

/**
 * Angular query definition accepting Promise or Observable reads.
 * Alias for QueryDefinition.
 */
export type QueryResourceDefinition<T> = QueryDefinition<T>;

/** Injection, shared-client, and reactive polling configuration for queryResource. */
export interface QueryResourceOptions {
  pollInterval?: number | (() => number | undefined);
  injector?: Injector;
  client?: QueryClient;
}

/** Readonly signals and explicit refresh controls for one shared query observer. */
export interface QueryResourceRef<T, E = Error> {
  readonly value: Signal<T>;
  readonly error: Signal<E | null>;
  readonly status: Signal<QueryStatus>;
  readonly isLoading: Signal<boolean>;
  readonly isInitialLoading: Signal<boolean>;
  readonly isRefreshing: Signal<boolean>;
  readonly isStale: Signal<boolean>;
  hasValue(): this is QueryResourceRef<Exclude<T, undefined>, E>;
  /** Force fresh data while joining a valid request already in flight. */
  reload(): boolean;
  /** Await a fresh read, joining current work. Rejects when disabled or destroyed. */
  execute(): Promise<T>;
  /** Dispose this observer. Other observers and pending shared reads remain active. */
  destroy(): void;
}

function idleSnapshot<T>(): QuerySnapshot<T> {
  return {value: undefined, hasValue: false, error: null, status: 'idle', updatedAt: null, isStale: true};
}

/**
 * Signal observer of a shared query entry. The definition captures one consistent parameter snapshot.
 *
 * @example
 * ```typescript
 * // In an Angular injection context, with HttpClient provided:
 * const http = inject(HttpClient);
 * const userId = signal('42');
 * const userQuery = queryResource(() => {
 *   const id = userId();
 *   return {key: ['user', id], loader: () => http.get<User>(`/api/users/${id}`)};
 * });
 * // Read userQuery.value(), userQuery.isLoading(), and userQuery.error() from the template.
 * ```
 *
 * @param definition Reactive factory returning a QueryDefinition or undefined when prerequisites are missing.
 * @param options Polling interval, custom injector, or custom query client.
 * @returns QueryResourceRef exposing signals and execution controls.
 */
export function queryResource<T, E = Error>(
  definition: () => QueryResourceDefinition<T> | undefined,
  options: QueryResourceOptions = {},
): QueryResourceRef<T | undefined, E> {
  if (!options.injector) {
    assertInInjectionContext(queryResource);
  }
  const injector = options.injector ?? inject(Injector);
  const client = options.client ?? injector.get(QUERY_CLIENT);
  const requested = computed(() => {
    const query = definition();
    if (!query) return undefined;
    return {query, key: serializeQueryKey(query.key)};
  });
  const requestedKey = computed(() => requested()?.key);
  const observedKey = signal<string | undefined>(undefined);
  let unsubscribe: QueryObserverHandle | undefined;
  const initialInterval =
    typeof options.pollInterval === 'function' ? untracked(options.pollInterval) : options.pollInterval;
  let observedInterval: number | undefined = initialInterval;
  let destroyed = false;
  const recoverObserver = new Subject<void>();

  // resourceAsync owns Observable observation and cancellation; QueryClient owns query state and scheduling.
  const sharedState = resourceAsync(
    {
      params: () => requestedKey(),
      loader: (key: string | undefined) => {
        const current = untracked(requested);
        if (!current || current.key !== key) {
          observedKey.set(undefined);
          return idleSnapshot<T>();
        }
        return new Observable<QuerySnapshot<T>>((subscriber) => {
          let handle: QueryObserverHandle | undefined;
          const detach = () => {
            handle?.();
            if (unsubscribe === handle) unsubscribe = undefined;
            handle = undefined;
          };
          const attach = (refresh = false) => {
            detach();
            const latest = untracked(requested);
            if (!latest || latest.key !== key) return;
            observedKey.set(key);
            const returnedHandle = client.observeQuery(
              latest.query,
              (snapshot) => {
                untracked(() => {
                  if (!destroyed && observedKey() === key) subscriber.next(snapshot);
                });
              },
              {pollInterval: observedInterval, refresh},
            );
            // A synchronous snapshot can destroy the resource while recovery is attaching.
            if (destroyed || subscriber.closed) {
              returnedHandle();
              return;
            }
            handle = returnedHandle;
            unsubscribe = handle;
          };
          attach();
          // Explicit cache removal leaves the observer idle. A manual reload can synchronously reattach it.
          const recovery = recoverObserver.subscribe(() => attach(true));
          return () => {
            recovery.unsubscribe();
            detach();
          };
        });
      },
    },
    {injector, defaultValue: idleSnapshot<T>()},
  );

  // Hide the previous scope synchronously, even before Angular schedules the observer effect.
  const visibleState = computed(() => {
    const current = requested();
    if (!current) {
      return idleSnapshot<T>();
    }
    if (current.key !== observedKey()) {
      const cached = client.getSnapshot<T>(current.query.key);
      if (cached?.hasValue) return cached.isStale ? {...cached, status: 'reloading' as const} : cached;
      return {...idleSnapshot<T>(), status: 'loading' as const};
    }
    const snapshot = sharedState.value();
    return sharedState.error() ? {...snapshot, error: sharedState.error(), status: 'error' as const} : snapshot;
  });

  const observerEffect = effect(
    () => {
      const current = requested();
      const interval = typeof options.pollInterval === 'function' ? options.pollInterval() : options.pollInterval;
      untracked(() => {
        if (destroyed) {
          return;
        }
        const intervalChanged = interval !== observedInterval;
        observedInterval = interval;
        if (current?.key === observedKey() && current) {
          unsubscribe?.updateDefinition(current.query);
          if (intervalChanged) unsubscribe?.updateOptions({pollInterval: interval});
        }
      });
    },
    {injector, manualCleanup: true},
  );

  const destroy = () => {
    if (!destroyed) {
      destroyed = true;
      observerEffect.destroy();
      recoverObserver.complete();
      sharedState.destroy();
    }
  };
  const unregisterDestroy = injector.get(DestroyRef).onDestroy(destroy);
  const execute = (): Promise<T> => {
    const current = untracked(requested);
    if (destroyed || !current)
      return Promise.reject(new Error(destroyed ? 'Query resource has been destroyed' : 'Query resource is disabled'));
    try {
      if (unsubscribe && !unsubscribe.isAttached() && current.key === untracked(observedKey)) {
        untracked(() => recoverObserver.next());
      }
      return untracked(() => client.fetchQuery(current.query, {refresh: true}));
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return {
    value: computed(() => visibleState().value),
    error: computed(() => visibleState().error as E | null),
    status: computed(() => visibleState().status),
    isLoading: computed(() => ['loading', 'reloading'].includes(visibleState().status)),
    isInitialLoading: computed(() => visibleState().status === 'loading'),
    isRefreshing: computed(() => visibleState().status === 'reloading'),
    isStale: computed(() => visibleState().isStale),
    hasValue(): this is QueryResourceRef<Exclude<T, undefined>, E> {
      return visibleState().hasValue && visibleState().value !== undefined;
    },
    reload: () => {
      const current = untracked(requested);
      if (destroyed || !current) {
        return false;
      }
      void execute().catch(() => undefined);
      return true;
    },
    execute,
    destroy: () => {
      unregisterDestroy();
      destroy();
    },
  };
}
