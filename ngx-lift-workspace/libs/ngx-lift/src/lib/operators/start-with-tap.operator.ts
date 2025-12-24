import {Observable} from 'rxjs';

/**
 * RxJS operator that executes a callback function before the source Observable starts emitting values.
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
 *   startWithTap(() => this.loading.set(true)),
 *   finalize(() => this.loading.set(false))
 * ).subscribe();
 * ```
 */
export function startWithTap<T>(callback: () => void) {
  return (source: Observable<T>) => {
    callback();
    return source;
  };
}
