import {BehaviorSubject, of, throwError} from 'rxjs';
import {delay, skip, take} from 'rxjs/operators';

import {switchMapWithAsyncState} from './switch-map-with-async-state.operator';

describe('switchMapWithAsyncState', () => {
  it('should transform values and handle successful async operation', (done) => {
    const source$ = new BehaviorSubject<number>(1);
    const asyncOperation = (value: number) => of(value * 2).pipe(delay(100));

    const result$ = source$.pipe(switchMapWithAsyncState(asyncOperation));

    result$.pipe(skip(1), take(1)).subscribe((state) => {
      expect(state).toEqual({loading: false, error: null, data: 2});
      done();
    });
  });

  it('should transform values and handle error in async operation', (done) => {
    const source$ = new BehaviorSubject<number>(1);
    const asyncOperation = () => throwError(() => new Error('Async Error!'));

    const result$ = source$.pipe(switchMapWithAsyncState<number, number, Error>(asyncOperation));

    result$.pipe(skip(1), take(1)).subscribe((state) => {
      expect(state).toEqual({loading: false, error: new Error('Async Error!'), data: null});
      done();
    });
  });

  it('should start with loading state and handle multiple async operations', (done) => {
    const source$ = new BehaviorSubject<number>(1);
    const asyncOperation = (value: number) => of(value * 2).pipe(delay(100));

    const result$ = source$.pipe(switchMapWithAsyncState(asyncOperation));

    let count = 0;

    result$.subscribe((state) => {
      if (count === 0) {
        expect(state).toEqual({loading: true, error: null, data: null});
      } else if (count === 1) {
        expect(state).toEqual({loading: false, error: null, data: 2});
        done();
      }

      count++;
    });
  });
});
