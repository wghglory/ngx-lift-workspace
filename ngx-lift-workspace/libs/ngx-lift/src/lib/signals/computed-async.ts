/* eslint-disable @typescript-eslint/no-explicit-any */
import {computed, CreateComputedOptions, DestroyRef, effect, inject, Signal, signal, untracked} from '@angular/core';
import {concatAll, exhaustAll, isObservable, mergeAll, Observable, Subject, switchAll} from 'rxjs';

/**
 * Behavior mode for handling multiple async sources in computedAsync.
 * - `switch`: Cancel previous async operations when a new one starts (default)
 * - `merge`: Process all async operations concurrently
 * - `concat`: Process async operations sequentially
 * - `exhaust`: Ignore new async operations while one is in progress
 */
type ComputedAsyncBehavior = 'switch' | 'merge' | 'concat' | 'exhaust';

// { equal, behavior }
type BaseOptions<T> = CreateComputedOptions<T> & {behavior?: ComputedAsyncBehavior};

type OptionsWithInitialValue<T> = {initialValue: T} & BaseOptions<T>;
type OptionsWithOptionalInitialValue<T> = {initialValue?: undefined} & BaseOptions<T>;
type OptionsWithRequireSync<T> = {requireSync: true} & BaseOptions<T>;

/**
 * Creates a computed signal that can derive its value from asynchronous sources
 * (Observables, Promises) or synchronous values. The signal automatically updates
 * when dependencies change.
 *
 * @template T - The type of the computed value
 * @param computeFn - A function that computes the value. Can return an Observable, Promise, or synchronous value.
 *   The function receives the previous value as a parameter.
 * @returns A signal that emits the computed value
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
 * ```
 */
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
  const destroyRef = inject(DestroyRef);

  const sourceSubject = new Subject<Promise<T> | Observable<T>>();
  const source$ = flattenObservable(sourceSubject, options.behavior || 'switch');

  const sourceValue = signal<T | undefined>(options.initialValue);

  const sourceResult = source$.subscribe({
    next: (value) => sourceValue.set(value),
    error: (error) => {
      sourceValue.set(error);
      // Error should be handled by the user
      // throw error;
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
      sourceValue.set(initialEmission);
    }
  }

  if (options.requireSync && sourceValue() === undefined) {
    throw new Error(`The observable doesn't emit synchronously. Set requireSync to false or pass an initialValue.`);
  }

  let shouldSkipFirstComputation = options.requireSync === true;

  effect(() => {
    const currentValue = untracked(() => sourceValue());

    const newSource = computeFn(currentValue);

    if (shouldSkipFirstComputation) {
      shouldSkipFirstComputation = false;
      return;
    }

    if (isPromise(newSource) || isObservable(newSource)) {
      untracked(() => sourceSubject.next(newSource));
    } else {
      untracked(() => sourceValue.set(newSource));
    }
  });

  return computed(() => sourceValue() as T, {equal: options.equal});
}

function flattenObservable<T>(
  source: Subject<Promise<T> | Observable<T>>,
  behavior: ComputedAsyncBehavior,
): Observable<T> {
  const behaviorMap = {
    switch: switchAll,
    merge: mergeAll,
    concat: concatAll,
    exhaust: exhaustAll,
  };

  return source.pipe(behaviorMap[behavior]());
}

function isPromise<T>(value: any): value is Promise<T> {
  return value && typeof value.then === 'function';
}
