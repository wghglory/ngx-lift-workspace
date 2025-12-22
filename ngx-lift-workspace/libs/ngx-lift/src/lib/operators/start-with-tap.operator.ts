import {Observable} from 'rxjs';

/**
 * Operator that taps into a callback before the source Observable starts emitting values.
 *
 * This operator is useful for triggering a side effect before the main Observable starts emitting.
 *
 * @param callback A function to be executed before the source Observable emits its first value.
 * @returns An RxJS operator function that taps into the callback and then switchMaps to the source Observable.
 */
export function startWithTap<T>(callback: () => void) {
  return (source: Observable<T>) => {
    callback();
    return source;
  };
}
