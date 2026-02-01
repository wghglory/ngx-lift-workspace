import {HttpErrorResponse} from '@angular/common/http';
import {Observable, OperatorFunction, switchMap} from 'rxjs';

import {AsyncState} from '../models';
import {createAsyncState} from './create-async-state.operator';

/**
 * Custom RxJS operator that uses switchMap to handle asynchronous operations and
 * transforms the emitted values into an AsyncState object.
 *
 * @template T - The type of data emitted by the observable returned by the project.
 * @template K - The type of value emitted by the source observable.
 * @template E - The type of error that can be encountered during the asynchronous operation.
 *   Defaults to `HttpErrorResponse`. For non-HTTP errors, specify `Error` or a custom error type.
 *
 * @param {function(K): Observable<T>} project - A function that takes a value emitted by the source
 * observable and returns an observable representing an asynchronous operation.
 *
 * @returns {OperatorFunction<K, AsyncState<T, E>>} - An RxJS operator that transforms the source observable into
 * an observable of AsyncState objects.
 *
 * @example
 * // Usage with default HttpErrorResponse
 * const userId$ = new BehaviorSubject<number>(1);
 *
 * const fetchUser = (id: number) => {
 *   return this.http.get<User>(`/api/users/${id}`);
 * };
 *
 * const result$ = userId$.pipe(switchMapWithAsyncState(fetchUser));
 * result$.subscribe((state) => {
 *   console.log(state); // Outputs AsyncState objects with loading, data, and error properties.
 * });
 *
 * @example
 * // Usage with custom Error type for non-HTTP requests
 * const source$ = new BehaviorSubject<number>(1);
 *
 * const asyncOperation = (value: number) => {
 *   return of(value * 2).pipe(delay(1000));
 * };
 *
 * const result$ = source$.pipe(switchMapWithAsyncState<number, number, Error>(asyncOperation));
 */
export function switchMapWithAsyncState<T, K, E = HttpErrorResponse>(
  project: (value: K, index: number) => Observable<T>,
): OperatorFunction<K, AsyncState<T, E>> {
  return (source: Observable<K>) =>
    source.pipe(switchMap((value, index) => project(value, index).pipe(createAsyncState<T, E>())));
}
