import {
  assertInInjectionContext,
  computed,
  CreateComputedOptions,
  DestroyRef,
  effect,
  inject,
  Signal,
  signal,
  untracked,
} from '@angular/core';
import {from, isObservable, Observable, Subscription} from 'rxjs';

import {ResourceStatus} from '../models';
import {isPromise} from '../utils/is-promise.util';

/**
 * Configuration options for resourceAsync.
 *
 * @template T - The type of the resource value.
 * @template E - The type of errors (defaults to Error).
 */
export interface ResourceRefOptions<T, E = Error> extends CreateComputedOptions<T> {
  /**
   * Initial value for the resource before first fetch.
   * If provided, the resource will use this value during loading states.
   * If not provided, T must include undefined.
   */
  initialValue?: T;

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
   * **Important**: Unlike a typical signal, this always returns a value (T).
   * If initialValue is provided, it returns that during loading/error states.
   * If no initialValue is provided, T must include undefined in its type.
   *
   * When in error state with no initialValue, value() returns undefined (T must include undefined).
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
   * **Note**: This is an ngx-lift extension (not in Angular's httpResource).
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
   * Manually trigger execution of the resource operation.
   * This is an alias for `reload()` with a name more appropriate for mutations.
   *
   * **Note**: This is an ngx-lift extension (not in Angular's httpResource).
   * Use `execute()` for mutations (POST/PUT/DELETE) like form submissions, saves, deletes.
   * Use `reload()` for read operations (GET requests) where "reload" makes semantic sense.
   *
   * @returns true if execution was initiated, false if execution was unnecessary or unsupported
   */
  execute(): boolean;
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
 * // With error handling
 * userRef = resourceAsync(
 *   () => this.http.get<User>(`/api/user/${this.userId()}`),
 *   {
 *     onError: (error) => {
 *       console.error('Failed to load user:', error);
 *       return null; // Fallback value
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
export function resourceAsync<T, E = Error>(
  sourceFn: () => Observable<T> | Promise<T> | T,
  options: ResourceRefOptions<T, E> = {},
): WritableResourceRef<T, E> {
  assertInInjectionContext(resourceAsync);

  const destroyRef = inject(DestroyRef);

  // State signals
  const valueSignal = signal<T | undefined>(options.initialValue);
  const errorSignal = signal<E | null>(null);
  const statusSignal = signal<ResourceStatus>(options.lazy ? 'idle' : 'loading');

  // Create a computed signal that returns T (with initialValue as fallback)
  // This matches Angular's pattern where value() always returns T
  const valueComputed = computed(() => {
    const val = valueSignal();
    if (val !== undefined) {
      return val;
    }
    // Return initialValue if available, otherwise return undefined
    // TypeScript will enforce that T includes undefined if no initialValue provided
    return options.initialValue as T;
  });

  // Trigger for manual reload
  const reloadTrigger = signal(0);

  // Track current subscription for cancellation
  let currentSubscription: Subscription | null = null;

  // Main effect that handles fetching
  effect(() => {
    // Track reload trigger to re-execute on reload()
    const currentTrigger = reloadTrigger();

    // Skip if lazy and never triggered
    // Use untracked to read status without creating a dependency
    if (options.lazy && untracked(() => statusSignal()) === 'idle' && currentTrigger === 0) {
      return;
    }

    // Handle exhaust behavior - ignore new requests while loading
    if (options.behavior === 'exhaust' && currentSubscription && !currentSubscription.closed) {
      return;
    }

    // Execute source function (tracks reactive dependencies)
    const source = sourceFn();

    // Cancel previous request (important for 'switch' behavior)
    if (currentSubscription && !currentSubscription.closed) {
      currentSubscription.unsubscribe();
    }

    // Determine if this is initial loading or reloading
    const hasExistingValue = untracked(() => valueSignal() !== undefined);
    const newStatus: ResourceStatus = hasExistingValue ? 'reloading' : 'loading';

    // Set loading/reloading state and clear previous error when starting a new request
    untracked(() => {
      statusSignal.set(newStatus);
      errorSignal.set(null);
      options.onLoading?.();
    });

    // Convert source to observable
    const source$ = isObservable(source) ? source : isPromise(source) ? from(source) : from([source]);

    let receivedValue = false;
    currentSubscription = source$.subscribe({
      next: (value) => {
        receivedValue = true;
        untracked(() => {
          valueSignal.set(value);
          errorSignal.set(null);
          statusSignal.set('resolved'); // Use 'resolved' to match httpResource
          options.onSuccess?.(value);
        });
      },
      error: (error: E) => {
        untracked(() => {
          // Try error handler if provided
          if (options.onError) {
            const fallbackValue = options.onError(error);
            if (fallbackValue !== undefined) {
              valueSignal.set(fallbackValue);
              errorSignal.set(null);
              statusSignal.set('resolved'); // Success with fallback
              return;
            }
          }

          // Set error state - clear value to match Angular's httpResource behavior
          valueSignal.set(undefined as T);
          errorSignal.set(error);
          statusSignal.set('error');

          // Optionally throw after handling
          if (options.throwOnError) {
            throw error;
          }
        });
      },
      complete: () => {
        // Empty observable: complete without next leaves resource stuck in loading
        if (!receivedValue) {
          untracked(() => {
            valueSignal.set(undefined as T);
            errorSignal.set(null);
            statusSignal.set('resolved');
          });
        }
      },
    });
  });

  // Cleanup subscription on destroy
  destroyRef.onDestroy(() => {
    if (currentSubscription && !currentSubscription.closed) {
      currentSubscription.unsubscribe();
    }
  });

  // isLoading as a computed Signal (matches Angular's httpResource API)
  const isLoadingSignal = computed(() => {
    const status = statusSignal();
    return status === 'loading' || status === 'reloading';
  });

  // isIdle as a computed Signal (ngx-lift extension)
  const isIdleSignal = computed(() => {
    return statusSignal() === 'idle';
  });

  // hasValue as a method with type predicate for type narrowing
  const hasValue = function (this: WritableResourceRef<T, E>): this is WritableResourceRef<Exclude<T, undefined>, E> {
    // Matches Angular's httpResource behavior:
    // hasValue is true when we have an actual loaded value (not just initialValue)
    // This is true for 'resolved', 'reloading', or 'local' status
    const status = statusSignal();
    const val = valueSignal(); // Check the actual loaded value
    return (status === 'resolved' || status === 'reloading' || status === 'local') && val !== undefined;
  };

  const reload = (): boolean => {
    // Matches Angular's httpResource behavior:
    // Returns true if reload was initiated, false if unnecessary
    const status = untracked(statusSignal);

    // Don't reload if already loading
    if (status === 'loading' || status === 'reloading') {
      return false;
    }

    // If lazy and idle, trigger first load
    if (status === 'idle') {
      untracked(() => statusSignal.set('loading'));
    }

    reloadTrigger.update((v) => v + 1);
    return true;
  };

  // Manually set the resource value (transitions to 'local' state)
  const set = (value: T): void => {
    // Cancel any pending request
    if (currentSubscription && !currentSubscription.closed) {
      currentSubscription.unsubscribe();
      currentSubscription = null;
    }

    // Update state to 'local'
    untracked(() => {
      valueSignal.set(value);
      errorSignal.set(null);
      statusSignal.set('local');
    });
  };

  // Update the resource value using an updater function
  const update = (updater: (value: T) => T): void => {
    // Get current value (may be undefined if no initialValue)
    const currentValue = untracked(() => valueComputed());

    // Call updater with current value
    const newValue = updater(currentValue);

    // Set the new value (transitions to 'local')
    set(newValue);
  };

  // Return read-only version
  const asReadonly = (): ResourceRef<T, E> => {
    // Create a wrapper function that preserves the type predicate
    const readonlyHasValue = function (this: ResourceRef<T, E>): this is ResourceRef<Exclude<T, undefined>, E> {
      return hasValue.call(this as WritableResourceRef<T, E>);
    };

    // Return a new object without set/update methods
    return {
      value: valueComputed,
      error: errorSignal.asReadonly(),
      status: statusSignal.asReadonly(),
      isLoading: isLoadingSignal,
      isIdle: isIdleSignal,
      hasValue: readonlyHasValue,
      reload,
      execute: reload,
    };
  };

  const resourceRef: WritableResourceRef<T, E> = {
    value: valueComputed,
    error: errorSignal.asReadonly(),
    status: statusSignal.asReadonly(),
    isLoading: isLoadingSignal,
    isIdle: isIdleSignal,
    hasValue,
    reload,
    execute: reload, // Alias for mutations - same functionality, clearer intent
    set,
    update,
    asReadonly,
  };

  return resourceRef;
}
