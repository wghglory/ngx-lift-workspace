/* eslint-disable @typescript-eslint/no-explicit-any */
import {Signal} from '@angular/core';
import {toObservable} from '@angular/core/rxjs-interop';
import {
  catchError,
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
 * trigger arrives, the new trigger will be ignored until the current poll completes.
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
 *   Each emission includes `loading`, `error`, and `data` properties.
 *
 * @example
 * ```typescript
 * // Simple polling
 * const dataState$ = poll({
 *   interval: 5000, // Poll every 5 seconds
 *   pollingFn: () => this.http.get('/api/data'),
 *   initialValue: { loading: true, error: null, data: null }
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
  pollingFn: (params: any) => Observable<Data> | Promise<Data> | Data;
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
export function poll<Data, Input>(options: {
  interval: number;
  pollingFn: (params: any) => Observable<Data> | Promise<Data> | Data;
  forceRefresh: Observable<Input> | Signal<Input>;
  paramsBuilder: (input: Input) => any;
  initialValue?: AsyncState<Data>;
  delay?: number;
}): Observable<AsyncState<Data>>;

export function poll<Data, Input>(options: {
  interval: number;
  pollingFn: (params: any) => Observable<Data> | Promise<Data> | Data;
  forceRefresh?: Observable<Input> | Signal<Input>;
  paramsBuilder?: (input: Input) => any;
  initialValue?: AsyncState<Data>;
  delay?: number;
}): Observable<AsyncState<Data>> {
  const timerEmitValue = '__timer__emission__';
  const timer$ = timer(options.delay || 0, options.interval).pipe(map((i) => `${timerEmitValue}${i}`));

  const trigger$ =
    options.forceRefresh === undefined
      ? EMPTY
      : isObservable(options.forceRefresh)
        ? options.forceRefresh
        : toObservable(options.forceRefresh);

  let inputByForceRefresh: Input | undefined = undefined; // if forceRefresh is not provided, input will be undefined

  return merge(trigger$, timer$).pipe(
    exhaustMap((input) => {
      // input can be either by forceRefresh or timer
      const isTimerTrigger = typeof input === 'string' && input.includes(timerEmitValue);
      const isManualTrigger = !isTimerTrigger;
      if (isManualTrigger) {
        inputByForceRefresh = input as Input;
      }

      // build params by input
      // if paramsBuilder is provided, params will be the value of this function call
      // if paramsBuilder is not provided, params will be the value emitted by the forceRefresh
      const params = options.paramsBuilder ? options.paramsBuilder(inputByForceRefresh as Input) : inputByForceRefresh;

      // NOTE: using exhaustMap will NOT emit ${timerEmitValue}0 if forceRefresh is not provided
      // using concatMap will emit ${timerEmitValue}0 if forceRefresh is not provided
      const isFirstRequest = input === `${timerEmitValue}0`; // timer first emission when forceRefresh is not provided

      const fnResult = options.pollingFn(params);
      const fnResult$ = isObservable(fnResult) ? fnResult : isPromise(fnResult) ? from(fnResult) : of(fnResult);

      let observable$ = fnResult$.pipe(
        map((data) => ({loading: false, error: null, data})),
        catchError((error) => of({loading: false, error, data: null})),
      );

      if (isFirstRequest) {
        observable$ = observable$.pipe(
          startWith(options.initialValue ?? ({loading: true, error: null, data: null} as any)),
        );
      }
      if (isManualTrigger) {
        observable$ = observable$.pipe(startWith({loading: true, error: null, data: null}));
      }

      return observable$;
    }),
    share(),
  );
}
