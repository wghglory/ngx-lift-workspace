import {HttpErrorResponse} from '@angular/common/http';
import {catchError, map, Observable, of, pipe, startWith, tap, TapObserver, UnaryFunction} from 'rxjs';

import {AsyncState} from '../models/async-state.model';

/**
 * createAsyncState transforms an Observable of type T into an Observable of AsyncState<T>.
 * AsyncState<T> represents the loading, error, and data states for asynchronous operations.
 *
 * @template T - The type of the data in the observable.
 * @template E - The type of the error that can occur.
 *
 * @param {Partial<Observer<T>> | ((value: T) => void)} [observerOrNextForOrigin] -
 *   An optional parameter that can be a partial TapObserver<T> or a function to handle the next value or error in the original Observable.
 *
 * @returns {UnaryFunction<Observable<T>, Observable<AsyncState<T, E>>>} -
 *   A function that transforms an observable stream into an asynchronous state.
 *
 * @example
 * Usage 1: Simple request
 * data$ = this.shopService.products$.pipe(
 *   createAsyncState({
 *    next: res => console.log('Side effect if success: ' + res),
 *    error: error => console.error('Side effect if error: ' + error.message)
 *   })
 * );
 *
 * Usage 2: Dependent requests
 * data$ = firstCall$.pipe(
 *   switchMap(() => this.shopService.products$),
 *   createAsyncState()
 * );
 *
 * Another implementation thought when refreshing the data: instead of startWith, `merge of` emit as the trigger
 *
 * subject.pipe(
 *   switchMap(() => merge(
 *     of({ loading: true, error: null, data: null }),
 *     this.service.apiCall().pipe(
 *       map(data => ({ loading: false, error: null, data })),
 *       tap({
 *         next: res => callback?.(res.data),
 *         error: err => errorCallback?.(err),
 *       }),
 *       catchError(error => of({ loading: false, error, data: null })),
 *     ),
 *   ))
 * )
 *
 * Usage 3: provide initialValue
 *
 * import {createAsyncState} from 'ngx-lift';
 * import {noop} from 'rxjs';
 *
 * private userService = inject(UserService);
 * private location = inject(Location);
 *
 * userState$ = this.userService
 *   .getUserById(1)
 *   .pipe(createAsyncState<User>(noop, {loading: false, error: null, data: this.location.getState()}));
 */
export function createAsyncState<T, E = HttpErrorResponse>(
  observerOrNextForOrigin?: Partial<TapObserver<T>> | ((value: T) => void),
  initialValue: {loading: boolean; error: E | null; data: T | null} = {loading: true, error: null, data: null},
): UnaryFunction<Observable<T>, Observable<AsyncState<T, E>>> {
  return pipe(
    tap(observerOrNextForOrigin),
    map((data) => ({loading: false, error: null, data})),
    startWith(initialValue),
    catchError((error: E) => of({loading: false, error, data: null})),
  );
}
