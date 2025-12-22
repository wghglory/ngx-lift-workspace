import {BehaviorSubject, firstValueFrom, of, throwError} from 'rxjs';
import {delay, skip, take} from 'rxjs/operators';

import {switchMapWithAsyncState} from './switch-map-with-async-state.operator';

describe('switchMapWithAsyncState', () => {
  it('should transform values and handle successful async operation', async () => {
    const source$ = new BehaviorSubject<number>(1);
    const asyncOperation = (value: number) => of(value * 2).pipe(delay(100));

    const result$ = source$.pipe(switchMapWithAsyncState(asyncOperation));

    const state = await firstValueFrom(result$.pipe(skip(1), take(1)));
    expect(state).toEqual({loading: false, error: null, data: 2});
  });

  it('should transform values and handle error in async operation', async () => {
    const source$ = new BehaviorSubject<number>(1);
    const asyncOperation = () => throwError(() => new Error('Async Error!'));

    const result$ = source$.pipe(switchMapWithAsyncState<number, number, Error>(asyncOperation));

    const state = await firstValueFrom(result$.pipe(skip(1), take(1)));
    expect(state).toEqual({loading: false, error: new Error('Async Error!'), data: null});
  });

  it('should start with loading state and handle multiple async operations', async () => {
    const source$ = new BehaviorSubject<number>(1);
    const asyncOperation = (value: number) => of(value * 2).pipe(delay(100));

    const result$ = source$.pipe(switchMapWithAsyncState(asyncOperation));

    const states: unknown[] = [];
    const subscription = result$.subscribe((state) => {
      states.push(state);
    });

    // Wait for both states
    await new Promise((resolve) => setTimeout(resolve, 150));

    expect(states[0]).toEqual({loading: true, error: null, data: null});
    expect(states[1]).toEqual({loading: false, error: null, data: 2});

    subscription.unsubscribe();
  });
});
