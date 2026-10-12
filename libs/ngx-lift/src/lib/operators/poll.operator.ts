import {Signal} from '@angular/core';
import {toObservable} from '@angular/core/rxjs-interop';
import {
  catchError,
  defer,
  EMPTY,
  exhaustMap,
  from,
  isObservable,
  map,
  merge,
  Observable,
  of,
  share,
  startWith,
  tap,
  timer,
} from 'rxjs';

import {AsyncState} from '../models';
import {isPromise} from '../utils/is-promise.util';

/**
 * Polls data at a specified interval and can be triggered manually, returning an observable that
 * emits the result of each poll as an `AsyncState` object.
 *
 * This operator is useful for periodically fetching data from an API or checking for updates.
 * It supports:
 * - Automatic polling at a specified interval
 * - Manual refresh triggers via Observable or Signal
 * - Parameter building for dynamic polling requests
 * - Initial values and delayed start
 *
 * The polling function can return an Observable, Promise, or synchronous value.
 * The operator uses `exhaustMap` internally, which means if a poll is in progress when a new
 * trigger arrives, no additional request starts. Manual parameter changes are retained for the next accepted tick.
 * Synchronous factory/parameter-builder failures become error states without terminating future polling.
 *
 * @template Data - The type of the data emitted by the polling function.
 * @template Input - The type of the input parameter used to build polling parameters (when using `forceRefresh`).
 *
 * @param options - Configuration options for polling:
 *   - `interval`: The interval in milliseconds between each automatic poll.
 *   - `pollingFn`: A function that returns an Observable, Promise, or primitive value to poll.
 *     When `forceRefresh` is provided, this function receives the parameter value.
 *   - `forceRefresh`: Optional Observable or Signal that triggers a manual refresh.
 *     The emitted value can be used as a parameter for `pollingFn` or transformed via `paramsBuilder`.
 *   - `paramsBuilder`: Optional function that transforms the `forceRefresh` value into parameters for `pollingFn`.
 *   - `initialValue`: Optional initial `AsyncState` value to emit before the first poll completes.
 *   - `delay`: Optional delay in milliseconds to wait before starting the first poll.
 *
 * @returns An observable that emits `AsyncState<Data>` objects representing the polling results.
 *   Each emission includes `isLoading`, `error`, and `data` properties.
 *
 * @example
 * ```typescript
 * // Simple polling
 * const dataState$ = poll({
 *   interval: 5000, // Poll every 5 seconds
 *   pollingFn: () => this.http.get('/api/data'),
 *   initialValue: { status: 'loading', isLoading: true, error: null, data: null }
 * });
 *
 * // Polling with manual refresh
 * const refresh$ = new Subject<void>();
 * const dataState$ = poll({
 *   interval: 5000,
 *   pollingFn: () => this.http.get('/api/data'),
 *   forceRefresh: refresh$
 * });
 *
 * // Polling with parameters
 * const userId$ = new BehaviorSubject(1);
 * const userState$ = poll({
 *   interval: 10000,
 *   pollingFn: (id: number) => this.http.get(`/api/users/${id}`),
 *   forceRefresh: userId$,
 *   paramsBuilder: (id) => id
 * });
 * ```
 */
export function poll<Data>(options: {
  interval: number;
  pollingFn: () => Observable<Data> | Promise<Data> | Data;
  initialValue?: AsyncState<Data>;
  delay?: number;
}): Observable<AsyncState<Data>>;

// forceRefresh output is the pollingFn params' input
export function poll<Data, Input>(options: {
  interval: number;
  pollingFn: (params: Input) => Observable<Data> | Promise<Data> | Data;
  forceRefresh: Observable<Input> | Signal<Input>;
  initialValue?: AsyncState<Data>;
  delay?: number;
}): Observable<AsyncState<Data>>;

// paramsBuilder exists, forceRefresh output is the paramsBuilder params' input
export function poll<Data, Input, Params = Input>(options: {
  interval: number;
  pollingFn: (params: Params) => Observable<Data> | Promise<Data> | Data;
  forceRefresh: Observable<Input> | Signal<Input>;
  paramsBuilder: (input: Input) => Params;
  initialValue?: AsyncState<Data>;
  delay?: number;
}): Observable<AsyncState<Data>>;

export function poll<Data, Input = void, Params = Input>(options: {
  interval: number;
  pollingFn: (params: Params) => Observable<Data> | Promise<Data> | Data;
  forceRefresh?: Observable<Input> | Signal<Input>;
  paramsBuilder?: (input: Input) => Params;
  initialValue?: AsyncState<Data>;
  delay?: number;
}): Observable<AsyncState<Data>> {
  type Trigger = {kind: 'timer'; index: number} | {kind: 'manual'; input: Input};
  const timer$ = timer(options.delay ?? 0, options.interval).pipe(map((index): Trigger => ({kind: 'timer', index})));

  const trigger$ =
    options.forceRefresh === undefined
      ? EMPTY
      : isObservable(options.forceRefresh)
        ? options.forceRefresh
        : toObservable(options.forceRefresh);

  return defer(() => {
    let inputByForceRefresh: Input | undefined;
    const manual$ = trigger$.pipe(map((input): Trigger => ({kind: 'manual', input})));

    return merge(manual$, timer$).pipe(
      // Keep parameters current even when exhaustMap skips a busy trigger.
      tap((trigger) => {
        if (trigger.kind === 'manual') {
          inputByForceRefresh = trigger.input;
        }
      }),
      exhaustMap((trigger) => {
        let observable$: Observable<AsyncState<Data>> = defer(() => {
          const params = (
            options.paramsBuilder ? options.paramsBuilder(inputByForceRefresh as Input) : inputByForceRefresh
          ) as Params;
          const result = options.pollingFn(params);
          return isObservable(result) ? result : isPromise(result) ? from(result) : of(result);
        }).pipe(
          map((data) => ({status: 'resolved' as const, isLoading: false, error: null, data})),
          catchError((error) => of({status: 'error' as const, isLoading: false, error, data: null})),
        );

        if (trigger.kind === 'timer' && trigger.index === 0) {
          observable$ = observable$.pipe(
            startWith(options.initialValue ?? {status: 'loading' as const, isLoading: true, error: null, data: null}),
          );
        } else if (trigger.kind === 'manual') {
          observable$ = observable$.pipe(
            startWith({status: 'loading' as const, isLoading: true, error: null, data: null}),
          );
        }
        return observable$;
      }),
    );
  }).pipe(share());
}
