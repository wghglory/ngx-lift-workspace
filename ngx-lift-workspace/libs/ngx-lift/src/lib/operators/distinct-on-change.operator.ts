import {Observable, OperatorFunction, Subscriber, TeardownLogic} from 'rxjs';

/**
 * Creates an operator function for RxJS Observables that filters out consecutive
 * values that are considered equal according to a provided comparator function,
 * and invokes a callback when a distinct value is encountered.
 *
 * @template T - The type of elements emitted by the observable.
 * @param {(previousValue: T, currentValue: T) => void} onChangeCallback
 *   A callback function that will be invoked when a distinct value is encountered.
 *   It receives the previous distinct value and the current value.
 * @param {(previousValue: T, currentValue: T) => boolean} [comparator]
 *   A function that determines if two values are considered equal.
 *   Defaults to a function that performs strict equality (===) comparison.
 * @returns {OperatorFunction<T, T>} - The RxJS operator function.
 *
 * @example
 * Example 1:
 * const source$ = new Observable<number>((observer) => {
 *   observer.next(1);
 *   observer.next(2);
 *   observer.next(2);
 *   observer.next(3);
 *   observer.next(3);
 *   observer.next(4);
 *   observer.next(5);
 *   observer.complete();
 * });
 *
 * const distinctOnChange$ = source$.pipe(
 *   distinctOnChange(
 *     (prev, curr) => console.log(`Value changed from ${prev} to: ${curr}`),
 *     (prev, curr) => prev === curr,
 *   ),
 * );
 * distinctOnChange$.subscribe((res) => console.log(res));
 *
 *
 * Example 2:
 * distinctOnChange<RDEValue<OseInstance>[]>(
 *   () => {
 *     this.store.dispatch(
 *       addToast({
 *         toast: {
 *           type: ToastType.SUCCESS,
 *           title: this.l10nService.getMessage('STATUS_CHANGE'),
 *           description: this.l10nService.getMessage('STATUS_CHANGE_DESC'),
 *         },
 *       }),
 *     );
 *   },
 *   (prev, current) =>
 *     prev.every((prevInstance, index) => instanceComparator(prevInstance.entity, current[index].entity)),
 * );
 */
export function distinctOnChange<T>(
  onChangeCallback: (previousValue: T, currentValue: T) => void,
  comparator: (previousValue: T, currentValue: T) => boolean = (prev, curr) => prev === curr,
): OperatorFunction<T, T> {
  return (source: Observable<T>) =>
    new Observable<T>((subscriber: Subscriber<T>): TeardownLogic => {
      let hasFirstValue = false;
      let previousValue: T;

      const subscription = source.subscribe({
        next: (currentValue: T) => {
          if (hasFirstValue) {
            if (!comparator(previousValue, currentValue)) {
              onChangeCallback(previousValue, currentValue);
              previousValue = currentValue;
              subscriber.next(currentValue);
            }
          } else {
            previousValue = currentValue;
            hasFirstValue = true;
            subscriber.next(currentValue);
          }
        },
        error: (err: unknown) => subscriber.error(err),
        complete: () => subscriber.complete(),
      });

      return () => subscription.unsubscribe();
    });
}
