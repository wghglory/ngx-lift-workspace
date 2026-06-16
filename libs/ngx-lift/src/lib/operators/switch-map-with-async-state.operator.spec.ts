import {beforeEach, afterEach, vi} from 'vitest';
import {TestBed} from '@angular/core/testing';
import {BehaviorSubject, of, throwError} from 'rxjs';
import {delay, skip, take} from 'rxjs/operators';

import {switchMapWithAsyncState} from './switch-map-with-async-state.operator';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('switchMapWithAsyncState', () => {
  it('should transform values and handle successful async operation', async () => {
    const source$ = new BehaviorSubject<number>(1);
    const asyncOperation = (value: number) => of(value * 2).pipe(delay(100));

    const result$ = source$.pipe(switchMapWithAsyncState(asyncOperation));

    let state: unknown;
    result$.pipe(skip(1), take(1)).subscribe((s) => {
      state = s;
    });

    TestBed.tick();
    await vi.advanceTimersByTimeAsync(100);
    TestBed.tick();
    expect(state).toEqual({status: 'resolved', isLoading: false, error: null, data: 2});
  });

  it('should transform values and handle error in async operation', async () => {
    const source$ = new BehaviorSubject<number>(1);
    const asyncOperation = () => throwError(() => new Error('Async Error!'));

    const result$ = source$.pipe(switchMapWithAsyncState<number, number, Error>(asyncOperation));

    let state: unknown;
    result$.pipe(skip(1), take(1)).subscribe((s) => {
      state = s;
    });

    TestBed.tick();
    await vi.advanceTimersByTimeAsync(0);
    TestBed.tick();
    expect(state).toEqual({status: 'error', isLoading: false, error: new Error('Async Error!'), data: null});
  });

  it('should start with loading state and handle multiple async operations', async () => {
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
    TestBed.tick();
    await vi.advanceTimersByTimeAsync(100);
    TestBed.tick();

    expect(states[1]).toEqual({status: 'resolved', isLoading: false, error: null, data: 2});

    subscription.unsubscribe();
  });
});
