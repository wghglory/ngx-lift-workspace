import {HttpErrorResponse} from '@angular/common/http';
import {catchError, map, Observable, of, pipe, startWith, tap, TapObserver, UnaryFunction} from 'rxjs';

import {AsyncState} from '../models/async-state.model';

/**
 * createAsyncState transforms an Observable of type T into an Observable of AsyncState<T>.
 * AsyncState<T> represents the status, isLoading, error, and data states for asynchronous operations.
 *
 * @template T - The type of the data in the observable.
 * @template E - The type of the error that can occur. Defaults to `HttpErrorResponse`.
 *   For non-HTTP errors, specify `Error` or a custom error type explicitly.
 *
 * @param {Partial<Observer<T>> | ((value: T) => void)} [observerOrNextForOrigin] -
 *   An optional parameter that can be a partial TapObserver<T> or a function to handle the next value or error in the original Observable.
 * @param {AsyncState<T, E>} [initialValue] -
 *   An optional initial state value. Defaults to {status: 'loading', isLoading: true, error: null, data: null}.
 *
 * @returns {UnaryFunction<Observable<T>, Observable<AsyncState<T, E>>>} -
 *   A function that transforms an observable stream into an asynchronous state.
 *
 * @example
 * Usage 1: Simple HTTP request (default HttpErrorResponse)
 * data$ = this.http.get<User[]>('/api/users').pipe(
 *   createAsyncState({
 *     next: res => console.log('Success:', res),
 *     error: error => console.error('HTTP Error:', error.status)
 *   })
 * );
 *
 * Usage 2: Non-HTTP error with Error type
 * data$ = this.shopService.products$.pipe(
 *   createAsyncState<Product[], Error>({
 *     error: error => console.error('Error:', error.message)
 *   })
 * );
 *
 * Usage 3: Dependent requests
 * data$ = firstCall$.pipe(
 *   switchMap(() => this.shopService.products$),
 *   createAsyncState()
 * );
 *
 * Another implementation thought when refreshing the data: instead of startWith, `merge of` emit as the trigger
 *
 * subject.pipe(
 *   switchMap(() => merge(
 *     of({ status: 'loading', isLoading: true, error: null, data: null }),
 *     this.service.apiCall().pipe(
 *       map(data => ({ status: 'resolved', isLoading: false, error: null, data })),
 *       tap({
 *         next: res => callback?.(res.data),
 *         error: err => errorCallback?.(err),
 *       }),
 *       catchError(error => of({ status: 'error', isLoading: false, error, data: null })),
 *     ),
 *   ))
 * )
 *
 * Usage 4: provide initialValue
 *
 * import {createAsyncState} from 'ngx-lift';
 * import {noop} from 'rxjs';
 *
 * private userService = inject(UserService);
 * private location = inject(Location);
 *
 * userState$ = this.userService
 *   .getUserById(1)
 *   .pipe(createAsyncState<User>(noop, {status: 'idle', isLoading: false, error: null, data: this.location.getState()}));
 */
export function createAsyncState<T, E = HttpErrorResponse>(
  observerOrNextForOrigin?: Partial<TapObserver<T>> | ((value: T) => void),
  initialValue: AsyncState<T, E> = {status: 'loading', isLoading: true, error: null, data: null},
): UnaryFunction<Observable<T>, Observable<AsyncState<T, E>>> {
  return pipe(
    tap(observerOrNextForOrigin),
    map((data) => ({status: 'resolved' as const, isLoading: false, error: null, data})),
    startWith(initialValue),
    catchError((error: E) => of({status: 'error' as const, isLoading: false, error, data: null})),
  );
}
