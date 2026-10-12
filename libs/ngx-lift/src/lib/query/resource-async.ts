import {
  assertInInjectionContext,
  computed,
  CreateComputedOptions,
  DestroyRef,
  effect,
  EffectRef,
  inject,
  Injector,
  Signal,
  signal,
  untracked,
} from '@angular/core';
import {from, isObservable, noop, Observable, Subscription} from 'rxjs';

import {isPromise} from '../utils/is-promise.util';
import {ResourceStatus} from '../models';

/** Cancellation context supplied to an accepted resource operation. */
export interface ResourceAsyncContext {
  /** Aborted when the operation is replaced, reset, locally overridden, or destroyed. */
  readonly abortSignal: AbortSignal;
}

/** Separates reactive parameter capture from untracked async transport execution. */
export interface ResourceAsyncDefinition<P, T> {
  /** Pure reactive parameter capture; must not start requests or perform writes. */
  params: () => P;
  /** Runs only when the resource accepts a new operation. Signal reads here are untracked. */
  loader: (params: P, context: ResourceAsyncContext) => Observable<T> | PromiseLike<T> | T;
}

/** Rejection returned to execute callers when their resource operation is cancelled. */
export class ResourceAsyncCancelledError extends Error {
  constructor(message = 'Resource operation was cancelled') {
    super(message);
    this.name = 'ResourceAsyncCancelledError';
  }
}

/** Rejection returned when an operation is requested after resource disposal. */
export class ResourceAsyncDisposedError extends Error {
  constructor() {
    super('Resource was destroyed');
    this.name = 'ResourceAsyncDisposedError';
  }
}

/**
 * Base configuration options for resourceAsync.
 *
 * @template T - The type of the resource value.
 * @template E - The type of errors (defaults to Error).
 */
export interface BaseResourceRefOptions<T, E = Error> extends CreateComputedOptions<T> {
  /**
   * Behavior for handling multiple concurrent async operations.
   * - `switch`: Cancel previous operation when new one starts (default)
   * - `exhaust`: Ignore new operations while one is in progress
   *
   * Note: 'merge' and 'concat' are not supported as they don't make sense
   * for a resource pattern where you want the latest value.
   */
  behavior?: 'switch' | 'exhaust';

  /**
   * Error handler that receives errors from async operations.
   * Can transform errors or provide fallback values.
   * If it returns a value, the resource will be in 'success' state with that value.
   */
  onError?: (error: E) => T | undefined;

  /**
   * If true, errors will be thrown after onError handling.
   * If false (default), errors are stored in the error signal.
   */
  throwOnError?: boolean;

  /**
   * Callback invoked when operation successfully completes.
   */
  onSuccess?: (value: T) => void;

  /**
   * Callback invoked when operation starts loading.
   */
  onLoading?: () => void;

  /**
   * If true, the resource will not fetch automatically on initialization.
   * Fetch will only happen when reload() is called or dependencies change.
   * Default: false (eager fetching)
   */
  lazy?: boolean;

  /** Disable automatic dependency-driven execution, including after the first explicit trigger. */
  reactive?: boolean;

  /** Retain the last received or local value on error. Defaults to false. */
  preserveValueOnError?: boolean;

  /**
   * Optional custom injector. If provided, allows resourceAsync to be called outside an ambient injection context.
   */
  injector?: Injector;
}

/**
 * Options for resourceAsync when an initialValue is provided.
 *
 * @template T - The type of the resource value.
 * @template E - The type of errors (defaults to Error).
 */
export interface ResourceRefOptionsWithInitialValue<T, E = Error> extends BaseResourceRefOptions<T, E> {
  /**
   * Initial value for the resource before first fetch.
   * When provided, value() is guaranteed to return T (never undefined).
   */
  initialValue: T;

  /**
   * Default value for the resource before first fetch.
   * Alias for initialValue to match Angular's resource() API.
   */
  defaultValue?: T;
}

/**
 * Options for resourceAsync when a defaultValue is provided.
 *
 * @template T - The type of the resource value.
 * @template E - The type of errors (defaults to Error).
 */
export interface ResourceRefOptionsWithDefaultValue<T, E = Error> extends BaseResourceRefOptions<T, E> {
  /**
   * Default value for the resource before first fetch.
   * Alias for initialValue to match Angular's resource() API.
   * When provided, value() is guaranteed to return T (never undefined).
   */
  defaultValue: T;

  /**
   * Initial value for the resource before first fetch.
   */
  initialValue?: T;
}

/**
 * Options for resourceAsync when neither initialValue nor defaultValue is provided.
 *
 * @template T - The type of the resource value.
 * @template E - The type of errors (defaults to Error).
 */
export interface ResourceRefOptionsWithoutInitial<T, E = Error> extends BaseResourceRefOptions<T, E> {
  initialValue?: undefined;
  defaultValue?: undefined;
}

/**
 * Configuration options for resourceAsync.
 *
 * @template T - The type of the resource value.
 * @template E - The type of errors (defaults to Error).
 */
export interface ResourceRefOptions<T, E = Error> extends BaseResourceRefOptions<T, E> {
  /**
   * Initial value for the resource before first fetch.
   * If provided, the resource will use this value during loading states.
   * If not provided, value() will return undefined during initial loading/error states.
   */
  initialValue?: T;

  /**
   * Default value for the resource before first fetch.
   * Alias for initialValue to match Angular's resource() API.
   * If provided, the resource will use this value during loading states.
   */
  defaultValue?: T;
}

/**
 * Reactive resource that manages async operations with full lifecycle tracking.
 * Matches Angular's httpResource API for consistency.
 *
 * @template T - The type of the resource value.
 * @template E - The type of errors (defaults to Error).
 */
export interface ResourceRef<T, E = Error> {
  /**
   * The current value of the resource.
   *
   * - If `initialValue` or `defaultValue` is provided, returns `T` (never `undefined`).
   * - If no initial value is provided, returns `T | undefined` (returns `undefined` during initial loading and error states).
   */
  readonly value: Signal<T>;

  /**
   * The current error, if any.
   * Returns null if no error or operation is successful.
   */
  readonly error: Signal<E | null>;

  /**
   * The current status of the resource operation.
   * - `idle`: Never triggered (lazy resources only)
   * - `loading`: Initial fetch, no previous value
   * - `reloading`: Refetch with previous value available
   * - `resolved`: Successfully completed
   * - `error`: Failed with error
   * - `local`: Value set manually via set()/update()
   */
  readonly status: Signal<ResourceStatus>;

  /**
   * Whether this resource is loading a new value (or reloading the existing one).
   * True when status is 'loading' or 'reloading'.
   *
   * This is a Signal (not a method) to match Angular's httpResource API.
   * Use this to disable buttons or show loading indicators during any fetch operation.
   */
  readonly isLoading: Signal<boolean>;

  /**
   * Whether this resource is in idle state (never triggered).
   * True only when status is 'idle'.
   *
   * Useful for lazy resources to check if they've been triggered yet.
   */
  readonly isIdle: Signal<boolean>;

  /**
   * Returns true if the resource has a value available (not undefined).
   * True for 'resolved', 'reloading', or 'local' state.
   *
   * **Type predicate**: When true, narrows the value type to exclude undefined.
   * This matches Angular's httpResource behavior.
   *
   * **Example**:
   * ```typescript
   * if (userRef.hasValue()) {
   *   // TypeScript knows value() is User, not User | undefined
   *   console.log(userRef.value().name); // No ! needed
   * }
   * ```
   *
   * This function is reactive.
   */
  hasValue(): this is ResourceRef<Exclude<T, undefined>, E>;

  /**
   * Manually trigger a reload of the resource.
   * Cancels any pending operation before starting a new one.
   *
   * Note that the resource will not enter its reloading state until the actual backend request is made.
   *
   * @returns true if a reload was initiated, false if a reload was unnecessary or unsupported
   */
  reload(): boolean;

  /**
   * Manually trigger execution of the resource operation and return a Promise of the result.
   *
   * Designed specifically for mutations (POST/PUT/DELETE) like form submissions, saves, deletes.
   *
   * - Returns a Promise resolving to the exact result written to `resource.value()`.
   * - Safe for fire-and-forget calls (e.g. `ref.execute()`) without causing unhandled promise rejections.
   * - Can be awaited: `const result = await ref.execute();`
   * - Clears stale previous value on re-execution so UI displays loading state cleanly.
   *
   * @returns A Promise that resolves with the operation result, or rejects if an error occurs.
   */
  execute(): Promise<T>;

  /**
   * Resets the resource to its initial idle state.
   *
   * - Cancels any pending in-flight operation
   * - Resets the value back to initialValue (or undefined)
   * - Clears any error
   * - Transitions status back to 'idle'
   */
  reset(): void;

  /** Permanently stop observation and cancel pending work. Calling this repeatedly is safe. */
  destroy(): void;
}

/**
 * A writable resource that supports manual value updates.
 * Extends ResourceRef with set() and update() methods.
 * Inspired by Angular's WritableResource API.
 *
 * @template T - The type of the resource value.
 * @template E - The type of errors (defaults to Error).
 *
 * @see https://angular.dev/api/core/WritableResource
 */
export interface WritableResourceRef<T, E = Error> extends ResourceRef<T, E> {
  /**
   * Manually set the resource value, transitioning to 'local' state.
   *
   * When you set a value:
   * - Status becomes 'local'
   * - Error is cleared
   * - Value is immediately available
   * - No fetch is triggered
   * - Pending requests are cancelled
   *
   * Use cases:
   * - Optimistic updates (update UI before server confirmation)
   * - Prefetched/cached data (set initial value, then reload for fresh data)
   * - Manual data management (set filtered/transformed data)
   *
   * @param value - The new value to set
   *
   * @example
   * ```typescript
   * // Optimistic update
   * todoRef.set({ ...todo, completed: true });
   *
   * // Cache-first pattern
   * userRef.set(cachedUser);
   * userRef.reload(); // Fetch fresh data in background
   * ```
   */
  set(value: T): void;

  /**
   * Update the resource value using an updater function.
   * Transitions to 'local' state.
   *
   * Like WritableSignal.update(), this can be called with undefined values.
   * TypeScript enforces that the updater must handle undefined if no initialValue was provided.
   *
   * @param updater - Function that receives current value and returns new value
   *
   * @example
   * ```typescript
   * // Toggle a boolean property
   * userRef.update(user => ({ ...user, active: !user.active }));
   *
   * // Increment a counter
   * counterRef.update(count => count + 1);
   *
   * // Handle undefined (when no initialValue provided)
   * userRef.update(user => user ? { ...user, name: 'New' } : undefined);
   * ```
   */
  update(updater: (value: T) => T): void;

  /**
   * Returns a read-only version of this resource.
   * Useful for exposing resources publicly while keeping write access private.
   *
   * @returns A read-only ResourceRef (without set/update methods)
   *
   * @example
   * ```typescript
   * export class UserStateService {
   *   private _userRef = resourceAsync(() => this.http.get<User>('/api/user'));
   *   public readonly userRef = this._userRef.asReadonly();
   *
   *   updateUser(updates: Partial<User>) {
   *     this._userRef.update(user => ({ ...user, ...updates }));
   *   }
   * }
   * ```
   */
  asReadonly(): ResourceRef<T, E>;

  /**
   * Type predicate override for WritableResourceRef.
   */
  hasValue(): this is WritableResourceRef<Exclude<T, undefined>, E>;
}

/**
 * Creates a reactive resource that manages async operations with full state tracking.
 * Similar to Angular's httpResource but works with any async operation (Observable, Promise, or sync value).
 *
 * Returns a WritableResourceRef with set() and update() methods for manual value management.
 *
 * Key features:
 * - Automatic request cancellation when dependencies change
 * - Manual reload() capability
 * - Manual set()/update() for local state management (optimistic updates, caching)
 * - Status tracking: idle → loading → resolved/error/local
 * - Lazy loading support
 * - Error handling with fallback values
 *
 * @template T - The type of the resource value.
 * @template E - The type of errors (defaults to Error).
 *
 * @param sourceFn - Function that returns the async source (Observable, Promise, or sync value).
 *   This function is reactive and will re-execute when any signals it depends on change.
 * @param options - Optional configuration for the resource behavior.
 *
 * @returns A WritableResourceRef object with state signals, reload capability, and set/update methods.
 *
 * @example
 * ```typescript
 * // Basic HTTP request
 * userId = signal(1);
 * userRef = resourceAsync(() =>
 *   this.http.get<User>(`/api/user/${this.userId()}`)
 * );
 *
 * // Template usage
 * @if (userRef.isLoading()) {
 *   <spinner />
 * } @else if (userRef.error()) {
 *   <error-message [error]="userRef.error()" />
 * } @else if (userRef.hasValue()) {
 *   <user-card [user]="userRef.value()" />
 * }
 *
 * // Manual refresh
 * <button (click)="userRef.reload()">Refresh</button>
 *
 * // Optimistic update
 * userRef.update(user => ({ ...user, name: 'New Name' }));
 * this.http.put('/api/user', userRef.value()).subscribe();
 *
 * // Cache-first pattern
 * userRef.set(cachedUser); // Show cached data immediately
 * userRef.reload(); // Fetch fresh data in background
 *
 * // With defaultValue (non-nullable value() signal)
 * usersRef = resourceAsync(
 *   () => this.http.get<User[]>('/api/users'),
 *   { defaultValue: [] }
 * );
 * // usersRef.value() is Signal<User[]> (never undefined)
 *
 * // With error handling
 * userRef = resourceAsync(
 *   () => this.http.get<User>(`/api/user/${this.userId()}`),
 *   {
 *     onError: (error) => {
 *       console.error('Failed to load user:', error);
 *       return { id: 0, name: 'Anonymous' } as User; // Fallback value
 *     }
 *   }
 * );
 *
 * // Lazy loading
 * searchResultsRef = resourceAsync(
 *   () => this.http.get(`/api/search?q=${this.query()}`),
 *   { lazy: true }
 * );
 * // Only fetches when reload() called or dependencies change after first access
 * ```
 */
export function resourceAsync<T, P, E = Error>(
  definition: ResourceAsyncDefinition<P, T>,
  options: ResourceRefOptionsWithInitialValue<T, E> | ResourceRefOptionsWithDefaultValue<T, E>,
): WritableResourceRef<T, E>;
export function resourceAsync<T, P, E = Error>(
  definition: ResourceAsyncDefinition<P, T>,
  options?: ResourceRefOptionsWithoutInitial<T, E>,
): WritableResourceRef<T | undefined, E>;
export function resourceAsync<T, P, E = Error>(
  definition: ResourceAsyncDefinition<P, T>,
  options?: ResourceRefOptions<T, E>,
): WritableResourceRef<T | undefined, E>;
export function resourceAsync<T, E = Error>(
  sourceFn: (context: ResourceAsyncContext) => Observable<T> | PromiseLike<T> | T,
  options: ResourceRefOptionsWithInitialValue<T, E> | ResourceRefOptionsWithDefaultValue<T, E>,
): WritableResourceRef<T, E>;

/**
 * Creates a reactive resource without an initial value.
 *
 * `value()` is typed as `Signal<T | undefined>` and returns `undefined` during initial loading and error states.
 * Use the `hasValue()` type guard to narrow the value to `T`.
 *
 * @template T - The type of the resource value.
 * @template E - The type of errors (defaults to Error).
 *
 * @param sourceFn - Function returning the async source.
 * @param options - Configuration options without initialValue or defaultValue.
 *
 * @returns A WritableResourceRef whose value signal includes undefined.
 */
export function resourceAsync<T, E = Error>(
  sourceFn: (context: ResourceAsyncContext) => Observable<T> | PromiseLike<T> | T,
  options?: ResourceRefOptionsWithoutInitial<T, E>,
): WritableResourceRef<T | undefined, E>;

/**
 * Creates a reactive resource with optional initial/default configuration.
 *
 * @template T - The type of the resource value.
 * @template E - The type of errors (defaults to Error).
 *
 * @param sourceFn - Function returning the async source.
 * @param options - General resource configuration options.
 *
 * @returns A WritableResourceRef whose value signal includes undefined if not proven non-null.
 */
export function resourceAsync<T, E = Error>(
  sourceFn: (context: ResourceAsyncContext) => Observable<T> | PromiseLike<T> | T,
  options?: ResourceRefOptions<T, E>,
): WritableResourceRef<T | undefined, E>;

export function resourceAsync<T, P, E = Error>(
  source: ((context: ResourceAsyncContext) => Observable<T> | PromiseLike<T> | T) | ResourceAsyncDefinition<P, T>,
  options: ResourceRefOptions<T, E> = {},
): WritableResourceRef<T, E> | WritableResourceRef<T | undefined, E> {
  if (!options.injector) {
    assertInInjectionContext(resourceAsync);
  }
  const injector = options.injector ?? inject(Injector);
  const destroyRef = injector.get(DestroyRef);
  const resolvedInitialValue = options.defaultValue !== undefined ? options.defaultValue : options.initialValue;
  const valueSignal = signal<T | undefined>(undefined);
  const errorSignal = signal<E | null>(null);
  const statusSignal = signal<ResourceStatus>(options.lazy ? 'idle' : 'loading');
  const valueComputed = computed(() => (valueSignal() !== undefined ? valueSignal() : resolvedInitialValue) as T, {
    equal: (left, right) =>
      left === undefined || right === undefined
        ? Object.is(left, right)
        : (options.equal?.(left, right) ?? Object.is(left, right)),
  });
  const reloadTrigger = signal(0);
  const definition = typeof source === 'function' ? undefined : source;
  const factory = typeof source === 'function' ? source : undefined;
  const paramsCapture = definition ? computed(definition.params) : undefined;

  interface Evaluation {
    controller: AbortController;
    source?: Observable<T> | PromiseLike<T> | T;
    failed: boolean;
    error?: unknown;
  }
  let suppressedTrigger: number | undefined;
  let lastHandledTrigger = 0;
  let sequence = 0;
  let queuedExecution: number | undefined;
  let cancellationGeneration = 0;
  let disposed = false;
  let dependencyEffect: EffectRef | undefined;
  const pendingDependencyEffects = new Set<EffectRef>();

  interface Deferred {
    operation: number;
    resolve: (value: T) => void;
    reject: (error: unknown) => void;
  }
  interface Operation {
    id: number;
    controller: AbortController;
    subscription: Subscription;
  }
  let currentOperation: Operation | undefined;
  let deferreds: Deferred[] = [];

  const settle = (id: number, value: T, error?: {reason: unknown}) => {
    const owned = deferreds.filter((deferred) => deferred.operation === id);
    deferreds = deferreds.filter((deferred) => deferred.operation !== id);
    for (const deferred of owned) {
      if (error) deferred.reject(error.reason);
      else deferred.resolve(value);
    }
  };
  const stopOperation = (reason: Error) => {
    const operation = currentOperation;
    currentOperation = undefined;
    if (operation) {
      operation.controller.abort(reason);
      operation.subscription.unsubscribe();
      settle(operation.id, undefined as T, {reason});
    }
  };
  const cancelAll = (reason: Error) => {
    cancellationGeneration++;
    stopOperation(reason);
    queuedExecution = undefined;
    const cancelled = deferreds;
    deferreds = [];
    for (const deferred of cancelled) deferred.reject(reason);
  };
  const isCurrent = (operation: Operation) => !disposed && currentOperation === operation;
  const handleError = (operation: Operation, originalError: unknown) => {
    if (!isCurrent(operation)) return;
    let error = originalError;
    let fallback: T | undefined;
    try {
      fallback = options.onError?.(error as E);
    } catch (handlerError) {
      error = handlerError;
    }
    if (!isCurrent(operation)) return;
    if (fallback !== undefined) {
      valueSignal.set(fallback);
      errorSignal.set(null);
      statusSignal.set('resolved');
      settle(operation.id, valueComputed());
    } else {
      if (!options.preserveValueOnError) valueSignal.set(undefined);
      errorSignal.set(error as E);
      statusSignal.set('error');
      settle(operation.id, undefined as T, {reason: error});
    }
    currentOperation = undefined;
    operation.subscription.unsubscribe();
    if (options.throwOnError && fallback === undefined) throw error;
  };

  const effectOptions = {injector, manualCleanup: true};
  const runSource = () => {
    if (disposed) return;
    const read = <V>(capture: Signal<V>): V => (options.reactive === false ? untracked(capture) : capture());
    let selection: P | undefined;
    let parameterError: {reason: unknown} | undefined;
    if (paramsCapture) {
      // Track pure parameters even when exhaust refuses to execute a new loader.
      try {
        selection = read(paramsCapture);
      } catch (error) {
        parameterError = {reason: error};
      }
    }
    // Legacy factories may eagerly start work, so exhaust must refuse them before invocation.
    if (options.behavior === 'exhaust' && currentOperation) return;
    lastHandledTrigger = untracked(reloadTrigger);
    suppressedTrigger = undefined;
    const generation = ++cancellationGeneration;
    for (const pendingEffect of pendingDependencyEffects) pendingEffect.destroy();
    pendingDependencyEffects.clear();
    stopOperation(new ResourceAsyncCancelledError('Operation cancelled by dependency change'));
    const evaluation: Evaluation = {
      controller: new AbortController(),
      failed: !!parameterError,
      error: parameterError?.reason,
    };
    if (factory) {
      try {
        // Preserve the legacy effect contract: factories may synchronously write signals.
        evaluation.source =
          options.reactive === false
            ? untracked(() => factory({abortSignal: evaluation.controller.signal}))
            : factory({abortSignal: evaluation.controller.signal});
        if (isPromise(evaluation.source)) void Promise.resolve(evaluation.source).catch(noop);
      } catch (error) {
        evaluation.failed = true;
        evaluation.error = error;
      }
    }
    if (disposed || generation !== cancellationGeneration) {
      evaluation.controller.abort(new ResourceAsyncCancelledError('Operation cancelled during source creation'));
      return;
    }
    const operation: Operation = {
      id: queuedExecution ?? ++sequence,
      controller: evaluation.controller,
      subscription: new Subscription(),
    };
    queuedExecution = undefined;
    currentOperation = operation;
    untracked(() => {
      statusSignal.set(valueSignal() !== undefined ? 'reloading' : 'loading');
      errorSignal.set(null);
      let asyncSource: Observable<T> | PromiseLike<T> | T;
      try {
        options.onLoading?.();
        if (!isCurrent(operation)) return;
      } catch (error) {
        handleError(operation, error);
        return;
      }
      if (evaluation.failed) {
        handleError(operation, evaluation.error);
        return;
      }
      try {
        asyncSource = definition
          ? definition.loader(selection as P, {abortSignal: operation.controller.signal})
          : (evaluation.source as Observable<T> | PromiseLike<T> | T);
      } catch (error) {
        handleError(operation, error);
        return;
      }
      if (!isCurrent(operation)) {
        // Eager promises already exist, so attach a rejection observer even after a reentrant cancellation.
        if (isPromise(asyncSource)) void Promise.resolve(asyncSource).catch(noop);
        return;
      }
      const source$ = isObservable(asyncSource)
        ? asyncSource
        : isPromise(asyncSource)
          ? from(asyncSource)
          : from([asyncSource]);
      let received = false;
      operation.subscription.add(
        source$.subscribe({
          next: (value) =>
            untracked(() => {
              if (!isCurrent(operation)) return;
              received = true;
              valueSignal.set(value);
              errorSignal.set(null);
              statusSignal.set('resolved');
              try {
                options.onSuccess?.(value);
              } catch (error) {
                handleError(operation, error);
                return;
              }
              if (isCurrent(operation)) settle(operation.id, valueComputed());
            }),
          error: (error: E) => untracked(() => handleError(operation, error)),
          complete: () =>
            untracked(() => {
              if (!isCurrent(operation)) return;
              if (!received) {
                valueSignal.set(undefined);
                errorSignal.set(null);
                statusSignal.set('resolved');
              }
              // An exhaust caller can join after the stream's final emission and still needs completion settlement.
              settle(operation.id, valueComputed());
              currentOperation = undefined;
              operation.subscription.unsubscribe();
            }),
        }),
      );
    });
  };
  const createDependencyEffect = () => {
    const generation = cancellationGeneration;
    let firstRun = true;
    const created = effect(() => {
      if (disposed) return;
      if (firstRun) {
        pendingDependencyEffects.delete(created);
        if (generation !== cancellationGeneration) {
          if (paramsCapture && !options.lazy && !dependencyEffect) {
            // Pure params can establish initial dependencies without undoing a local override or reset.
            dependencyEffect = created;
            firstRun = false;
            try {
              if (options.reactive === false) untracked(paramsCapture);
              else paramsCapture();
            } catch {
              // The cancelled operation must not replace local/idle state with a capture error.
            }
          } else created.destroy();
          return;
        }
        dependencyEffect?.destroy();
        dependencyEffect = created;
        firstRun = false;
      }
      runSource();
    }, effectOptions);
    pendingDependencyEffects.add(created);
  };
  // Manual scheduling is independent of source tracking, so a suppressed reload cannot discard known dependencies.
  const schedulingEffect = effect(() => {
    const trigger = reloadTrigger();
    if (disposed || trigger === lastHandledTrigger) return;
    lastHandledTrigger = trigger;
    if (suppressedTrigger !== trigger) untracked(createDependencyEffect);
  }, effectOptions);
  if (!options.lazy) createDependencyEffect();

  const destroy = () => {
    if (disposed) return;
    disposed = true;
    cancelAll(new ResourceAsyncDisposedError());
    schedulingEffect.destroy();
    dependencyEffect?.destroy();
    for (const pendingEffect of pendingDependencyEffects) pendingEffect.destroy();
    pendingDependencyEffects.clear();
    unregisterDestroy();
  };
  const unregisterDestroy = destroyRef.onDestroy(destroy);
  const isLoadingSignal = computed(() => statusSignal() === 'loading' || statusSignal() === 'reloading');
  const isIdleSignal = computed(() => statusSignal() === 'idle');
  const hasValue = function (this: WritableResourceRef<T, E>): this is WritableResourceRef<Exclude<T, undefined>, E> {
    const status = statusSignal();
    return (
      valueSignal() !== undefined &&
      (status === 'resolved' ||
        status === 'reloading' ||
        status === 'local' ||
        (status === 'error' && !!options.preserveValueOnError))
    );
  };
  const resume = () => {
    suppressedTrigger = undefined;
    reloadTrigger.update((value) => value + 1);
  };
  const reload = () => {
    if (disposed || (options.behavior === 'exhaust' && (currentOperation || queuedExecution !== undefined)))
      return false;
    cancelAll(new ResourceAsyncCancelledError('Operation cancelled by reload'));
    if (untracked(statusSignal) === 'idle') statusSignal.set('loading');
    resume();
    return true;
  };
  const suppressQueued = () => {
    suppressedTrigger = untracked(reloadTrigger);
  };
  const reset = () => {
    if (disposed) return;
    suppressQueued();
    cancelAll(new ResourceAsyncCancelledError('Resource was reset'));
    if (options.lazy) {
      dependencyEffect?.destroy();
      dependencyEffect = undefined;
      for (const pendingEffect of pendingDependencyEffects) pendingEffect.destroy();
      pendingDependencyEffects.clear();
    }
    valueSignal.set(undefined);
    errorSignal.set(null);
    statusSignal.set('idle');
  };
  const executionPromise = (id: number) => {
    const promise = new Promise<T>((resolve, reject) => deferreds.push({operation: id, resolve, reject}));
    void promise.catch(noop);
    return promise;
  };
  const execute = () => {
    if (disposed) {
      const promise = Promise.reject<T>(new ResourceAsyncDisposedError());
      void promise.catch(noop);
      return promise;
    }
    if (options.behavior === 'exhaust' && (currentOperation || queuedExecution !== undefined)) {
      return executionPromise(currentOperation?.id ?? (queuedExecution as number));
    }
    cancelAll(new ResourceAsyncCancelledError('Operation cancelled by newer execution'));
    queuedExecution = ++sequence;
    const promise = executionPromise(queuedExecution);
    valueSignal.set(undefined);
    errorSignal.set(null);
    statusSignal.set('loading');
    resume();
    return promise;
  };
  const set = (value: T) => {
    if (disposed) throw new ResourceAsyncDisposedError();
    suppressQueued();
    cancelAll(new ResourceAsyncCancelledError('Operation cancelled by local override'));
    valueSignal.set(value);
    errorSignal.set(null);
    statusSignal.set('local');
  };
  const update = (updater: (value: T) => T) => {
    if (disposed) throw new ResourceAsyncDisposedError();
    set(updater(untracked(valueComputed)));
  };
  const asReadonly = (): ResourceRef<T, E> => {
    const readonlyHasValue = function (this: ResourceRef<T, E>): this is ResourceRef<Exclude<T, undefined>, E> {
      return hasValue.call(this as WritableResourceRef<T, E>);
    };
    return {
      value: valueComputed,
      error: errorSignal.asReadonly(),
      status: statusSignal.asReadonly(),
      isLoading: isLoadingSignal,
      isIdle: isIdleSignal,
      hasValue: readonlyHasValue,
      reload,
      execute,
      reset,
      destroy,
    };
  };
  return {
    ...asReadonly(),
    hasValue,
    set,
    update,
    asReadonly,
  };
}
