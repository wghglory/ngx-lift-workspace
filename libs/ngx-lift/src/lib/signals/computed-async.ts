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
import {createWatch, Watch} from '@angular/core/primitives/signals';
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
  throwError,
} from 'rxjs';

import {isPromise} from '../utils/is-promise.util';

/**
 * Behavior mode for handling multiple async sources in computedAsync.
 * - `switch`: Unsubscribe the previous source; ignore its late Promise result (default)
 * - `merge`: Subscribe to all sources concurrently; each emission updates the value
 * - `concat`: Queue source subscriptions until the previous source completes
 * - `exhaust`: Ignore new source subscriptions while a source is active
 *
 * The factory still runs when its signal dependencies change. Eager Promises start
 * before these subscription policies apply; use a cold Observable for deferred work.
 */
type ComputedAsyncBehavior = 'switch' | 'merge' | 'concat' | 'exhaust';

type BaseOptions<T> = CreateComputedOptions<T> & {
  behavior?: ComputedAsyncBehavior;
  injector?: Injector;
} & (
    | {
        /**
         * Return a typed fallback for source failures. Include undefined in T explicitly if needed.
         * Callback failures throw on reads without escaping the subscription.
         */
        onError?: (error: unknown) => T;
        /** Unhandled errors always throw on reads; false is no longer supported. */
        throwOnError?: undefined;
      }
    | {
        /** Log source failures before they are thrown on reads. The return value is ignored. */
        onError?: (error: unknown) => unknown;
        /** Throw on reads even when onError returns a fallback. */
        throwOnError: true;
      }
  );

type OptionsWithInitialValue<T> = {initialValue: T} & BaseOptions<T>;
type OptionsWithOptionalInitialValue<T> = {initialValue?: undefined} & BaseOptions<T>;
type OptionsWithRequireSync<T> = {requireSync: true} & BaseOptions<T>;

type SignalState<T> = {kind: 'value'; value: T | undefined} | {kind: 'error'; error: unknown};

/**
 * Creates a computed signal that can derive its value from asynchronous sources
 * (Observables, Promises) or synchronous values. The signal automatically updates
 * when dependencies change.
 *
 * This function extends Angular's `computed()` to support async operations. It handles:
 * - Observables: Automatically subscribes and unsubscribes
 * - Promises: Converts to Observable and handles resolution; unsubscribing does not stop the Promise
 * - Synchronous values: Returns immediately
 *
 * The function supports different behaviors for handling multiple async operations:
 * - `switch`: Unsubscribe previous sources when a new one starts (default)
 * - `merge`: Process all operations concurrently
 * - `concat`: Process source subscriptions sequentially
 * - `exhaust`: Ignore new source subscriptions while one is in progress
 *
 * @template T - The type of the computed value.
 * @param computeFn - A function that computes the value. Can return an Observable, Promise, or synchronous value.
 *   The function receives the previous value as a parameter (if available).
 *   Capture signal parameters synchronously. Changes rerun this function in every behavior mode.
 * @param options - Optional configuration:
 *   - `initialValue`: Initial value for the Signal
 *   - `requireSync`: Without an initialValue, synchronously initializes once and rejects Promises or async-only sources
 *   - `behavior`: How to handle multiple async operations ('switch' | 'merge' | 'concat' | 'exhaust')
 *   - `equal`: Custom equality function for signal comparison
 *   - `onError`: Error handler that can transform errors or provide fallback values
 *   - `throwOnError`: If true, errors throw on reads even when onError returns a fallback
 * @returns A signal that emits the computed value. May be `T | undefined` if no initial value is provided.
 *   Unhandled errors and throwing onError callbacks throw when the signal is read.
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
 * // Log and throw errors when the signal is read
 * const data = computedAsync(
 *   () => this.dataService.getData(),
 *   {
 *     throwOnError: true,
 *     onError: (error) => {
 *       this.logService.error(error);
 *     }
 *   }
 * );
 * ```
 */
export function computedAsync<T>(
  computeFn: (previousValue?: T) => Observable<T> | PromiseLike<T> | T | undefined,
): Signal<T | undefined>;

// with optional initialValue
export function computedAsync<T>(
  computeFn: (previousValue?: T) => Observable<T> | PromiseLike<T> | T | undefined,
  options: OptionsWithOptionalInitialValue<T>,
): Signal<T | undefined>;

// with initialValue
export function computedAsync<T>(
  computeFn: (previousValue?: T) => Observable<T> | PromiseLike<T> | T,
  options: OptionsWithInitialValue<T>,
): Signal<T>;

// for promise, without initialValue but set requireSync as true, throw error
export function computedAsync<T>(
  computeFn: (previousValue?: T) => PromiseLike<T>,
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
  computeFn: (previousValue?: T) => Observable<T> | PromiseLike<T> | T | undefined,
  options: BaseOptions<T> & {initialValue?: T; requireSync?: boolean} = {},
): Signal<T | undefined> {
  if (!options?.injector) {
    assertInInjectionContext(computedAsync);
  }

  const destroyRef = options?.injector ? options.injector.get(DestroyRef) : inject(DestroyRef);

  const sourceSubject = new Subject<PromiseLike<T> | Observable<T>>();
  const source$ = flattenObservable(sourceSubject, options.behavior || 'switch');

  const sourceState = signal<SignalState<T>>({kind: 'value', value: options.initialValue});
  const watchTrigger = signal(0);
  let computationWatch: Watch | undefined;
  let synchronousInitialization = options.requireSync && options.initialValue === undefined;
  const handleError = (error: unknown) =>
    untracked(() => {
      let failure = error;
      try {
        if (options.throwOnError === true) {
          options.onError?.(error);
        } else if (options.onError) {
          sourceState.set({kind: 'value', value: options.onError(error)});
          return;
        }
      } catch (handlerError: unknown) {
        failure = handlerError;
      }
      sourceState.set({kind: 'error', error: failure});
    });

  const sourceResult = source$.subscribe({
    next: (event) => {
      if (event.type === 'value') {
        sourceState.set({kind: 'value', value: event.value});
      } else {
        handleError(event.error);
      }
    },
  });

  const dispose = () => {
    computationWatch?.destroy();
    sourceResult.unsubscribe();
    sourceSubject.complete();
  };

  const runComputation = () => {
    const state = untracked(sourceState);
    const currentValue = state.kind === 'value' ? state.value : undefined;
    let newSource: Observable<T> | PromiseLike<T> | T | undefined;
    try {
      newSource = computeFn(currentValue);
    } catch (error: unknown) {
      if (synchronousInitialization) {
        throw error;
      }
      // Preserve the flattening policy even when the factory fails before returning a source.
      untracked(() => sourceSubject.next(throwError(() => error)));
      return;
    }

    if (synchronousInitialization && isPromise(newSource)) {
      // The eager Promise may already be running. Its rejected result must remain handled.
      void Promise.resolve(newSource).catch(() => undefined);
      throw new Error(`Promises cannot work with requireSync. Set requireSync to false or pass an initialValue.`);
    }

    const streamSource = isPromise(newSource) || isObservable(newSource) ? newSource : of(newSource as T);
    untracked(() => sourceSubject.next(streamSource as PromiseLike<T> | Observable<T>));
  };

  try {
    if (synchronousInitialization) {
      // This exported primitive can capture dependencies immediately while allowing legacy
      // factories to write service signals. The effect below still owns Angular scheduling.
      computationWatch = createWatch(
        runComputation,
        () => untracked(() => watchTrigger.update((version) => version + 1)),
        true,
      );
      untracked(() => computationWatch?.run());
    }

    const currentState = sourceState();
    if (options.requireSync && currentState.kind === 'value' && currentState.value === undefined) {
      throw new Error(`The observable doesn't emit synchronously. Set requireSync to false or pass an initialValue.`);
    }
  } catch (error) {
    dispose();
    throw error;
  }
  synchronousInitialization = false;
  destroyRef.onDestroy(dispose);

  effect(
    () => {
      if (computationWatch) {
        watchTrigger();
        untracked(() => computationWatch?.run());
      } else {
        runComputation();
      }
    },
    options?.injector ? {injector: options.injector} : undefined,
  );

  return computed(
    () => {
      const state = sourceState();
      if (state.kind === 'error') {
        throw state.error;
      }
      return state.value as T;
    },
    {equal: options.equal},
  );
}

type StreamEvent<T> = {type: 'value'; value: T} | {type: 'error'; error: unknown};

function flattenObservable<T>(
  source: Subject<PromiseLike<T> | Observable<T>>,
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
      let source$: Observable<T>;
      if (isObservable(sourceItem)) {
        source$ = sourceItem;
      } else if (isPromise(sourceItem)) {
        const promise = Promise.resolve(sourceItem);
        // Concat may queue this Promise; exhaust may never subscribe to it.
        void promise.catch(() => undefined);
        source$ = from(promise);
      } else {
        source$ = of(sourceItem as T);
      }

      return source$.pipe(
        map((value): StreamEvent<T> => ({type: 'value', value})),
        catchError((error: unknown) => of<StreamEvent<T>>({type: 'error', error})),
      );
    }),
    behaviorMap[behavior](),
  );
}
