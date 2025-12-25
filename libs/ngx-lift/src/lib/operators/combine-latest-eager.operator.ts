import {combineLatest, Observable, startWith, Subject} from 'rxjs';

export function combineLatestEager<T extends Observable<unknown>[]>(
  sources: T,
  startWithNullForAll?: boolean,
): Observable<{[K in keyof T]: T[K] extends Observable<infer U> ? U | null : never}>;

export function combineLatestEager<T extends Record<string, Observable<unknown>>>(
  sources: T,
  startWithNullForAll?: boolean,
): Observable<{[K in keyof T]: T[K] extends Observable<infer U> ? U | null : never}>;

/**
 * Combines multiple observables into a single observable emitting an array or dictionary
 * of the latest values from each source observable.
 *
 * This operator is similar to RxJS `combineLatest`, but with additional behavior:
 * - When `startWithNullForAll` is `false` (default), only `Subject` instances get `startWith(null)`
 * - When `startWithNullForAll` is `true`, all observables get `startWith(null)`
 *
 * This ensures that `combineLatest` emits immediately with initial values, even if some
 * observables haven't emitted yet.
 *
 * @template T - The type of the data in the observables.
 *
 * @param sources - An array of observables or a dictionary (object) of observables to be combined.
 * @param startWithNullForAll - When `true`, all observables will start with `null`.
 *   When `false` (default), only `Subject` instances will start with `null`.
 * @returns An observable emitting an array or dictionary of the latest values from each source observable.
 *   Values may be `null` initially if `startWithNullForAll` is `true` or for `Subject` instances.
 *
 * @throws {Error} Throws an error if the provided argument is not an array of observables or a dictionary of observables.
 *
 * @example
 * ```typescript
 * // Array of observables
 * const combined$ = combineLatestEager([obs1$, obs2$, obs3$]);
 *
 * // Dictionary of observables
 * const combined$ = combineLatestEager({
 *   users: users$,
 *   posts: posts$,
 *   comments: comments$
 * });
 *
 * // Start all with null
 * const combined$ = combineLatestEager([obs1$, obs2$], true);
 * ```
 */
export function combineLatestEager<T>(
  sources: Array<Observable<T>> | Record<string, Observable<T>>,
  startWithNullForAll = false,
): Observable<Array<T | null> | Record<string, T | null>> {
  function observableMapper<T>(observable: Observable<T>) {
    if (startWithNullForAll) {
      return observable.pipe(startWith(null));
    } else {
      // Check if observable is a Subject, if true, apply startWith(null)
      return observable instanceof Subject ? observable.pipe(startWith(null)) : observable;
    }
  }

  if (Array.isArray(sources)) {
    // If sources is an array of observables
    return combineLatest(sources.map(observableMapper));
  } else if (typeof sources === 'object' && sources !== null) {
    // If sources is a dictionary of observables
    const observables: Record<string, Observable<T | null>> = {};

    for (const [key, value] of Object.entries(sources)) {
      observables[key] = observableMapper(value);
    }

    return combineLatest(observables);
  } else {
    throw new Error(
      `Invalid argument type. Please provide an array of observables or a dictionary of observables. Received: ${typeof sources}`,
    );
  }
}
