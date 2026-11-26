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

import {QueryDefinition, QueryObserverHandle, QueryRecoveryOptions, QuerySnapshot, QueryStatus} from './query.models';
import {QueryClient} from './query-client';
import {QUERY_CLIENT} from './query-client.token';
import {QueryResourceDisabledError, QueryResourceDisposedError} from './query-errors';
import {onQueryObserverAttached, OwnedQueryObserverOptions} from './query-observer-registration';
import {serializeQueryKey} from './query-key';

/**
 * Angular query definition accepting Promise or Observable reads.
 * Alias for QueryDefinition.
 */
export type QueryResourceDefinition<T> = QueryDefinition<T>;

/** Injection, shared-client, and reactive polling configuration for queryResource. */
export interface QueryResourceOptions extends QueryRecoveryOptions {
  pollInterval?: number | (() => number | undefined);
  injector?: Injector;
  client?: QueryClient;
}

/** Readonly signals and explicit refresh controls for one shared query observer. */
export interface QueryFailureSignals {
  readonly isInitialError: Signal<boolean>;
  readonly isRefreshError: Signal<boolean>;
  readonly updatedAt: Signal<number | null>;
  readonly failureCount: Signal<number>;
  readonly failureReason: Signal<unknown | null>;
  readonly nextRetryAt: Signal<number | null>;
}

export interface QueryResourceRef<T, E = Error> extends QueryFailureSignals {
  readonly value: Signal<T>;
  readonly error: Signal<E | null>;
  readonly status: Signal<QueryStatus>;
  readonly isLoading: Signal<boolean>;
  readonly isInitialLoading: Signal<boolean>;
  readonly isRefreshing: Signal<boolean>;
  readonly isStale: Signal<boolean>;
  hasValue(): this is QueryResourceRef<Exclude<T, undefined>, E>;
  /** Force fresh data while joining a valid request already in flight; true means initiated, not succeeded. */
  reload(): boolean;
  /**
   * Await a fresh read, joining current work. Rejects with `QueryResourceDisabledError` when disabled and
   * `QueryResourceDisposedError` after destruction; transport failures reject with their original error.
   */
  execute(): Promise<T>;
  /** Dispose this observer. Other observers and pending shared reads remain active. */
  destroy(): void;
}

function idleSnapshot<T>(): QuerySnapshot<T> {
  return {
    value: undefined,
    hasValue: false,
    error: null,
    status: 'idle',
    updatedAt: null,
    isStale: true,
    failureCount: 0,
    failureReason: null,
    nextRetryAt: null,
  };
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
  const pollInterval = computed(() =>
    typeof options.pollInterval === 'function' ? options.pollInterval() : options.pollInterval,
  );
  const state = signal<{key: string; snapshot: QuerySnapshot<T>} | undefined>(undefined);
  type Observation = {key: string; interval?: number; handle?: QueryObserverHandle};
  let observer: Observation | undefined;
  let destroyed = false;

  const detach = () => {
    const previous = observer;
    observer = undefined;
    previous?.handle?.();
  };
  const refresh = (query: QueryDefinition<T>) => {
    try {
      return client.fetchQuery(query, {refresh: true});
    } catch (error) {
      return Promise.reject<T>(error);
    }
  };
  const observe = (key: string, manual = false) => {
    detach();
    // Detaching can run application teardown that changes the selection, executes or destroys this ref.
    const current = requested();
    if (destroyed || current?.key !== key) return;
    if (observer) return manual && observer.key === key ? execute() : undefined;
    const interval = pollInterval();
    const next: Observation = {key, interval};
    observer = next;
    let execution: Promise<T> | undefined;
    let startManualRead = manual;
    try {
      const onAttached = (handle: QueryObserverHandle) => {
        if (observer === next) next.handle = handle;
        else handle();
      };
      const observerOptions: OwnedQueryObserverOptions = {
        pollInterval: interval,
        refetchOnFocus: options.refetchOnFocus,
        refetchOnReconnect: options.refetchOnReconnect,
        [onQueryObserverAttached]: onAttached,
      };
      const handle = client.observeQuery(
        current.query,
        (snapshot) => {
          if (observer !== next) return;
          state.set({key, snapshot});
          // The first snapshot precedes automatic loading. Start explicit reads here so they have
          // an observer before dispatch and retain their manual trigger and shared request Promise.
          if (startManualRead) {
            startManualRead = false;
            execution = refresh(current.query);
          }
        },
        observerOptions,
      );
      // A custom client may only return its handle after synchronous publication.
      if (!next.handle) onAttached(handle);
    } catch (error) {
      if (observer === next) {
        observer = undefined;
        state.set({key: current.key, snapshot: {...idleSnapshot<T>(), status: 'error', error}});
      }
      if (manual) return Promise.reject<T>(error);
    }
    return execution;
  };

  // Hide the previous scope synchronously, even before Angular schedules the observer effect.
  const visibleState = computed(() => {
    const current = requested();
    if (!current) {
      return idleSnapshot<T>();
    }
    const observed = state();
    if (current.key !== observed?.key) {
      const cached = client.getSnapshot<T>(current.query.key);
      if (cached?.hasValue) return cached.isStale ? {...cached, status: 'reloading' as const} : cached;
      return {...idleSnapshot<T>(), status: 'loading' as const};
    }
    return observed.snapshot;
  });

  const observerEffect = effect(
    () => {
      const current = requested();
      const interval = pollInterval();
      untracked(() => {
        if (destroyed) return;
        if (!current) {
          state.set(undefined);
          detach();
        } else if (observer?.key !== current.key) {
          observe(current.key);
        } else {
          const retained = observer;
          retained.handle?.updateDefinition(current.query);
          if (retained.interval !== interval) {
            retained.interval = interval;
            retained.handle?.updateOptions({
              pollInterval: interval,
              refetchOnFocus: options.refetchOnFocus,
              refetchOnReconnect: options.refetchOnReconnect,
            });
          }
        }
      });
    },
    {injector, manualCleanup: true},
  );

  const destroy = () => {
    if (!destroyed) {
      destroyed = true;
      observerEffect.destroy();
      detach();
    }
  };
  const unregisterDestroy = injector.get(DestroyRef).onDestroy(destroy);
  const execute = (): Promise<T> => {
    if (destroyed) return Promise.reject(new QueryResourceDisposedError());
    try {
      return untracked(() => {
        const current = requested();
        if (!current) return Promise.reject(new QueryResourceDisabledError());
        if (observer?.key === current.key) {
          if (observer.handle?.isAttached()) return refresh(current.query);
          if (!observer.handle) {
            // A custom client can publish synchronously without forwarding the private registration hook.
            // Join existing work now. Otherwise wait for this handle before starting a refresh.
            const registering = observer;
            const cached = client.getSnapshot(current.query.key);
            if (cached?.status === 'loading' || cached?.status === 'reloading') return refresh(current.query);
            return Promise.resolve().then(() => {
              if (destroyed) throw new QueryResourceDisposedError();
              if (untracked(requested)?.key !== current.key || (cached && !registering.handle?.isAttached())) {
                throw new DOMException('Query changed before execution', 'AbortError');
              }
              return execute();
            });
          }
        }
        const execution = observe(current.key, true);
        if (execution) return execution;
        if (destroyed) throw new QueryResourceDisposedError();
        if (!requested()) throw new QueryResourceDisabledError();
        throw new DOMException('Query selection changed before execution', 'AbortError');
      });
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
    isInitialError: computed(() => visibleState().status === 'error' && !visibleState().hasValue),
    isRefreshError: computed(() => visibleState().status === 'error' && visibleState().hasValue),
    updatedAt: computed(() => visibleState().updatedAt),
    failureCount: computed(() => visibleState().failureCount),
    failureReason: computed(() => visibleState().failureReason),
    nextRetryAt: computed(() => visibleState().nextRetryAt),
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
