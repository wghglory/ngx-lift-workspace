import {fakeAsync, tick} from '@angular/core/testing';
import {BehaviorSubject, of, throwError} from 'rxjs';
import {delay, skip, take} from 'rxjs/operators';

import {switchMapWithAsyncState} from './switch-map-with-async-state.operator';

describe('switchMapWithAsyncState', () => {
  it('should transform values and handle successful async operation', fakeAsync(() => {
    const source$ = new BehaviorSubject<number>(1);
    const asyncOperation = (value: number) => of(value * 2).pipe(delay(100));

    const result$ = source$.pipe(switchMapWithAsyncState(asyncOperation));

    let state: unknown;
    result$.pipe(skip(1), take(1)).subscribe((s) => {
      state = s;
    });

    tick(100);
    expect(state).toEqual({status: 'resolved', isLoading: false, error: null, data: 2});
  }));

  it('should transform values and handle error in async operation', fakeAsync(() => {
    const source$ = new BehaviorSubject<number>(1);
    const asyncOperation = () => throwError(() => new Error('Async Error!'));

    const result$ = source$.pipe(switchMapWithAsyncState<number, number, Error>(asyncOperation));

    let state: unknown;
    result$.pipe(skip(1), take(1)).subscribe((s) => {
      state = s;
    });

    tick(0);
    expect(state).toEqual({status: 'error', isLoading: false, error: new Error('Async Error!'), data: null});
  }));

  it('should start with loading state and handle multiple async operations', fakeAsync(() => {
    const source$ = new BehaviorSubject<number>(1);
    const asyncOperation = (value: number) => of(value * 2).pipe(delay(100));

    const result$ = source$.pipe(switchMapWithAsyncState(asyncOperation));

    const states: unknown[] = [];
    const subscription = result$.subscribe((state) => {
      states.push(state);
    });

    // Initial loading state
    expect(states[0]).toEqual({status: 'loading', isLoading: true, error: null, data: null});

    // Wait for async operation to complete
    tick(100);

    expect(states[1]).toEqual({status: 'resolved', isLoading: false, error: null, data: 2});

    subscription.unsubscribe();
  }));
});
