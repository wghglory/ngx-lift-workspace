import {interval, last, Observable, of, take} from 'rxjs';

import {startWithTap} from './start-with-tap.operator';

describe('startWithTap', () => {
  it('calls the callback function and switches to the source observable', (done) => {
    const callbackSpy = jasmine.createSpy('callback');
    const source$ = of('data');

    source$.pipe(startWithTap(callbackSpy)).subscribe({
      next: (value) => {
        expect(callbackSpy).toHaveBeenCalled();
        expect(value).toBe('data');
        done();
      },
    });
  });

  it('works with an observable that emits multiple values', (done) => {
    let callbackTime: number;

    const callbackSpy = jasmine.createSpy('callback').and.callFake(() => (callbackTime = Date.now() - startTime));

    const count = 4;
    const period = 100;
    const source$ = interval(period).pipe(take(count));
    const startTime = Date.now();

    source$.pipe(last(), startWithTap(callbackSpy)).subscribe({
      next: (value) => {
        const nextTime = Date.now() - startTime;

        expect(callbackTime).toBeLessThan(period);
        expect(nextTime).toBeGreaterThanOrEqual(period * count);

        expect(callbackSpy).toHaveBeenCalled();
        expect(value).toBe(count - 1);
        done();
      },
    });
  });

  it('works with an observable that throws an error', (done) => {
    const callbackSpy = jasmine.createSpy('callback');
    const error = new Error('Test Error');
    const source$ = new Observable((observer) => {
      observer.error(error);
    });

    source$.pipe(startWithTap(callbackSpy)).subscribe({
      error: (err) => {
        expect(callbackSpy).toHaveBeenCalled();
        expect(err).toBe(error);
        done();
      },
    });
  });
});
