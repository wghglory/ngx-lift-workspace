import {firstValueFrom, interval, last, lastValueFrom, Observable, of, take} from 'rxjs';
import {vi} from 'vitest';

import {startWithTap} from './start-with-tap.operator';

describe('startWithTap', () => {
  it('calls the callback function and switches to the source observable', async () => {
    const callbackSpy = vi.fn();
    const source$ = of('data');

    const value = await firstValueFrom(source$.pipe(startWithTap(callbackSpy)));
    expect(callbackSpy).toHaveBeenCalled();
    expect(value).toBe('data');
  });

  it('works with an observable that emits multiple values', async () => {
    let callbackTime: number | undefined;

    const callbackSpy = vi.fn().mockImplementation(() => (callbackTime = Date.now() - startTime));

    const count = 4;
    const period = 100;
    const source$ = interval(period).pipe(take(count));
    const startTime = Date.now();

    const value = await lastValueFrom(source$.pipe(last(), startWithTap(callbackSpy)));
    const nextTime = Date.now() - startTime;

    expect(callbackTime).toBeLessThan(period);
    expect(nextTime).toBeGreaterThanOrEqual(period * count);

    expect(callbackSpy).toHaveBeenCalled();
    expect(value).toBe(count - 1);
  });

  it('works with an observable that throws an error', async () => {
    const callbackSpy = vi.fn();
    const error = new Error('Test Error');
    const source$ = new Observable((observer) => {
      observer.error(error);
    });

    await expect(firstValueFrom(source$.pipe(startWithTap(callbackSpy)))).rejects.toThrow('Test Error');
    expect(callbackSpy).toHaveBeenCalled();
  });

  it('runs once per subscription and does not run while constructing the pipeline', () => {
    const callback = vi.fn();
    const values: string[] = [];
    const source$ = of('data').pipe(startWithTap(callback));

    expect(callback).not.toHaveBeenCalled();
    source$.subscribe((value) => values.push(value));
    source$.subscribe((value) => values.push(value));

    expect(callback).toHaveBeenCalledTimes(2);
    expect(values).toEqual(['data', 'data']);
  });

  it('delivers callback errors through the Observable error channel without subscribing to the source', () => {
    const subscribe = vi.fn();
    const error = new Error('Callback failed');
    const received = vi.fn();
    const source$ = new Observable<string>(subscribe).pipe(
      startWithTap(() => {
        throw error;
      }),
    );

    source$.subscribe({error: received});

    expect(received).toHaveBeenCalledWith(error);
    expect(subscribe).not.toHaveBeenCalled();
  });
});
