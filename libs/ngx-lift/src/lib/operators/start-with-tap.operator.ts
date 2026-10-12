import {defer, Observable, MonoTypeOperatorFunction} from 'rxjs';

/**
 * RxJS operator that executes a callback before each subscription to the source Observable.
 * Constructing the pipeline does not execute the callback. Callback failures enter the Observable error channel.
 * This operator is useful for triggering side effects (like logging, state updates, or initialization)
 * before the main Observable begins emitting.
 *
 * @template T - The type of values emitted by the observable.
 * @param callback - A function to be executed synchronously before the source Observable emits its first value.
 * @returns An RxJS operator function that executes the callback and then returns the source Observable unchanged.
 *
 * @example
 * ```typescript
 * // Log before starting
 * data$.pipe(
 *   startWithTap(() => console.log('Starting data fetch...')),
 *   switchMap(() => this.http.get('/api/data'))
 * ).subscribe();
 *
 * // Update loading state
 * data$.pipe(
 *   startWithTap(() => this.isLoading.set(true)),
 *   finalize(() => this.isLoading.set(false))
 * ).subscribe();
 * ```
 */
export function startWithTap<T>(callback: () => void): MonoTypeOperatorFunction<T> {
  return (source: Observable<T>) =>
    defer(() => {
      callback();
      return source;
    });
}
