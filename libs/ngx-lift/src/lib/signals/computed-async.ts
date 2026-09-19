/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  assertInInjectionContext,
  computed,
  CreateComputedOptions,
  DestroyRef,
  effect,
  inject,
  Injector,
  Signal,
  signal,
  untracked,
} from '@angular/core';
import {
  catchError,
  concatAll,
  exhaustAll,
  from,
  isObservable,
  map,
  mergeAll,
  Observable,
  of,
  OperatorFunction,
  Subject,
  switchAll,
} from 'rxjs';

import {isPromise} from '../utils/is-promise.util';

/**
 * Behavior mode for handling multiple async sources in computedAsync.
 * - `switch`: Cancel previous async operations when a new one starts (default)
 * - `merge`: Process all async operations concurrently
 * - `concat`: Process async operations sequentially
 * - `exhaust`: Ignore new async operations while one is in progress
 */
type ComputedAsyncBehavior = 'switch' | 'merge' | 'concat' | 'exhaust';

// { equal, behavior, onError, throwOnError }
type BaseOptions<T> = CreateComputedOptions<T> & {
  behavior?: ComputedAsyncBehavior;
  injector?: Injector;
  /**
   * Optional error handler that receives errors from async operations.
   * Can be used to transform errors or provide fallback values.
   * If provided, the signal will emit the return value instead of the error.
   */
  onError?: (error: unknown) => T | undefined;
  /**
   * If true, errors will be thrown and propagate up when the signal is read.
   * If false (default), errors are set on the signal (or handled via `onError` if provided).
   * Note: When `onError` is omitted and `throwOnError` is false, the error object is emitted
   * into the signal as its value.
   */
  throwOnError?: boolean;
};

type OptionsWithInitialValue<T> = {initialValue: T} & BaseOptions<T>;
type OptionsWithOptionalInitialValue<T> = {initialValue?: undefined} & BaseOptions<T>;
type OptionsWithRequireSync<T> = {requireSync: true} & BaseOptions<T>;

/**
 * Creates a computed signal that can derive its value from asynchronous sources
 * (Observables, Promises) or synchronous values. The signal automatically updates
 * when dependencies change.
 *
 * This function extends Angular's `computed()` to support async operations. It handles:
 * - Observables: Automatically subscribes and unsubscribes
 * - Promises: Converts to Observable and handles resolution
 * - Synchronous values: Returns immediately
 *
 * The function supports different behaviors for handling multiple async operations:
 * - `switch`: Cancel previous operations when a new one starts (default)
 * - `merge`: Process all operations concurrently
 * - `concat`: Process operations sequentially
 * - `exhaust`: Ignore new operations while one is in progress
 *
 * @template T - The type of the computed value.
 * @param computeFn - A function that computes the value. Can return an Observable, Promise, or synchronous value.
 *   The function receives the previous value as a parameter (if available).
 * @param options - Optional configuration:
 *   - `initialValue`: Initial value for the Signal
 *   - `requireSync`: If `true`, requires the first computation to be synchronous (throws error for Promises)
 *   - `behavior`: How to handle multiple async operations ('switch' | 'merge' | 'concat' | 'exhaust')
 *   - `equal`: Custom equality function for signal comparison
 *   - `onError`: Error handler that can transform errors or provide fallback values
 *   - `throwOnError`: If true, errors will be thrown; if false (default), errors are set on the signal
 * @returns A signal that emits the computed value. May be `T | undefined` if no initial value is provided.
 *
 * @example
 * ```typescript
 * // Basic usage with Observable
 * const userId = signal(1);
 * const user = computedAsync(() => this.userService.getUser(userId()));
 *
 * // With initial value
 * const user = computedAsync(
 *   () => this.userService.getUser(userId()),
 *   { initialValue: null }
 * );
 *
 * // With requireSync (ensures synchronous initial value)
 * const user = computedAsync(
 *   () => this.userService.getUserSync(userId()),
 *   { requireSync: true }
 * );
 *
 * // With behavior option
 * const data = computedAsync(
 *   () => this.dataService.getData(),
 *   { behavior: 'merge' }
 * );
 *
 * // With error handling
 * const user = computedAsync(
 *   () => this.userService.getUser(userId()),
 *   {
 *     initialValue: null,
 *     onError: (error) => {
 *       console.error('Failed to load user:', error);
 *       return null; // Provide fallback value
 *     }
 *   }
 * );
 *
 * // Throw errors instead of setting them on the signal
 * const data = computedAsync(
 *   () => this.dataService.getData(),
 *   {
 *     throwOnError: true,
 *     onError: (error) => {
 *       this.logService.error(error);
 *       throw error; // Re-throw after logging
 *     }
 *   }
 * );
 * ```
 */
type SignalState<T> = {kind: 'value'; value: T | undefined} | {kind: 'error'; error: unknown};

// without options
export function computedAsync<T>(
  computeFn: (previousValue?: T) => Observable<T> | Promise<T> | T | undefined,
): Signal<T | undefined>;

// with optional initialValue
export function computedAsync<T>(
  computeFn: (previousValue?: T) => Observable<T> | Promise<T> | T | undefined,
  options: OptionsWithOptionalInitialValue<T>,
): Signal<T | undefined>;

// with initialValue
export function computedAsync<T>(
  computeFn: (previousValue?: T) => Observable<T> | Promise<T> | T | undefined,
  options: OptionsWithInitialValue<T>,
): Signal<T>;

// for promise, without initialValue but set requireSync as true, throw error
export function computedAsync<T>(
  computeFn: (previousValue?: T) => Promise<T>,
  options: OptionsWithOptionalInitialValue<T> & {requireSync: true},
): never;

// for observables, without initialValue, without requireSync, return T | undefined
export function computedAsync<T>(
  computeFn: (previousValue?: T) => Observable<T> | T | undefined,
  options: {
    initialValue?: undefined;
    requireSync?: false;
  } & BaseOptions<T>,
): Signal<T | undefined>;

// for observables, without initialValue, but requireSync is true, return T
export function computedAsync<T>(
  computeFn: (previousValue?: T) => Observable<T> | T,
  options: OptionsWithRequireSync<T> & {initialValue?: undefined | T},
): Signal<T>;

export function computedAsync<T>(
  computeFn: (previousValue?: T) => Observable<T> | Promise<T> | T | undefined,
  options: any = {},
): Signal<T | undefined> {
  if (!options?.injector) {
    assertInInjectionContext(computedAsync);
  }

  const destroyRef = options?.injector ? options.injector.get(DestroyRef) : inject(DestroyRef);

  const sourceSubject = new Subject<Promise<T> | Observable<T>>();
  const source$ = flattenObservable(sourceSubject, options.behavior || 'switch');

  const sourceState = signal<SignalState<T>>({kind: 'value', value: options.initialValue});

  const sourceResult = source$.subscribe({
    next: (event) => {
      if (event.type === 'value') {
        sourceState.set({kind: 'value', value: event.value});
      } else {
        const error = event.error;
        if (options.throwOnError) {
          if (options.onError) {
            options.onError(error);
          }
          sourceState.set({kind: 'error', error});
        } else if (options.onError) {
          const fallbackValue = options.onError(error);
          sourceState.set({kind: 'value', value: fallbackValue});
        } else {
          sourceState.set({kind: 'error', error});
        }
      }
    },
  });

  destroyRef.onDestroy(() => sourceResult.unsubscribe());

  if (options.requireSync && options.initialValue === undefined) {
    const initialEmission = computeFn(undefined);

    if (isPromise(initialEmission)) {
      throw new Error(`Promises cannot work with requireSync. Set requireSync to false or pass an initialValue.`);
    }

    if (isObservable(initialEmission)) {
      sourceSubject.next(initialEmission);
    } else {
      // primitive value T
      sourceSubject.next(of(initialEmission as T));
    }
  }

  const currentState = sourceState();
  if (options.requireSync && currentState.kind === 'value' && currentState.value === undefined) {
    throw new Error(`The observable doesn't emit synchronously. Set requireSync to false or pass an initialValue.`);
  }

  let shouldSkipFirstComputation = options.requireSync === true;

  effect(
    () => {
      const state = untracked(() => sourceState());
      const currentValue = state.kind === 'value' ? state.value : undefined;

      let newSource: Observable<T> | Promise<T> | T | undefined;
      try {
        newSource = computeFn(currentValue);
      } catch (error: unknown) {
        shouldSkipFirstComputation = false;
        if (options.throwOnError) {
          if (options.onError) {
            options.onError(error);
          }
          sourceState.set({kind: 'error', error});
        } else if (options.onError) {
          const fallbackValue = options.onError(error);
          sourceState.set({kind: 'value', value: fallbackValue});
        } else {
          sourceState.set({kind: 'error', error});
        }
        return;
      }

      if (shouldSkipFirstComputation) {
        shouldSkipFirstComputation = false;
        return;
      }

      const streamSource = isPromise(newSource) || isObservable(newSource) ? newSource : of(newSource as T);
      untracked(() => sourceSubject.next(streamSource as Promise<T> | Observable<T>));
    },
    options?.injector ? {injector: options.injector} : undefined,
  );

  return computed(
    () => {
      const state = sourceState();
      if (state.kind === 'error') {
        if (options.throwOnError) {
          throw state.error;
        }
        return state.error as T;
      }
      return state.value as T;
    },
    {equal: options.equal},
  );
}

type StreamEvent<T> = {type: 'value'; value: T} | {type: 'error'; error: unknown};

function flattenObservable<T>(
  source: Subject<Promise<T> | Observable<T>>,
  behavior: ComputedAsyncBehavior,
): Observable<StreamEvent<T>> {
  const behaviorMap: Record<ComputedAsyncBehavior, () => OperatorFunction<Observable<StreamEvent<T>>, StreamEvent<T>>> =
    {
      switch: switchAll,
      merge: mergeAll,
      concat: concatAll,
      exhaust: exhaustAll,
    };

  return source.pipe(
    map((sourceItem): Observable<StreamEvent<T>> => {
      const source$: Observable<T> = isObservable(sourceItem)
        ? (sourceItem as Observable<T>)
        : isPromise(sourceItem)
          ? from(sourceItem)
          : of(sourceItem as T);

      return source$.pipe(
        map((value): StreamEvent<T> => ({type: 'value', value})),
        catchError((error: unknown) => of<StreamEvent<T>>({type: 'error', error})),
      );
    }),
    behaviorMap[behavior](),
  );
}
