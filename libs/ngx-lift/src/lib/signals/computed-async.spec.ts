import {computed, effect, Injector, Signal, signal} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {catchError, delay, map, Observable, of, startWith, Subject, throwError} from 'rxjs';
import {tap} from 'rxjs/operators';
import {afterEach, beforeEach, vi} from 'vitest';

import {computedAsync} from './computed-async';
import {flushEffects} from '../../test-setup';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

const promise = <T>(value: T, time = 0): Promise<T> => new Promise((resolve) => setTimeout(() => resolve(value), time));

describe(computedAsync.name, () => {
  it('infers the resolved type of a Promise-like source without a catch method', async () => {
    await TestBed.runInInjectionContext(async () => {
      const promise = Promise.resolve('thenable value');
      const thenable: PromiseLike<string> = {then: promise.then.bind(promise)};
      const result = computedAsync(() => thenable);
      expectTypeOf(result).toEqualTypeOf<Signal<string | undefined>>();
      await flushEffects();
      expect(result()).toBe('thenable value');
    });
  });

  it('rejects Promise-like sources under requireSync without an initial value', () => {
    TestBed.runInInjectionContext(() => {
      const promise = Promise.resolve('thenable value');
      const thenable: PromiseLike<string> = {then: promise.then.bind(promise)};
      expect(() => {
        const result: never = computedAsync(() => thenable, {requireSync: true});
        void result;
      }).toThrow(/Promises cannot work with requireSync/);
    });
  });

  describe.each([false, true])('factory compatibility with requireSync=%s', (requireSync) => {
    it('allows service loading writes while tracking request parameters once', async () => {
      const parameter = signal(1);
      const loading = signal(false);
      const requests: number[] = [];
      const factory = () => {
        loading.set(true);
        const id = parameter();
        requests.push(id);
        return of(id);
      };
      const result = TestBed.runInInjectionContext(() =>
        requireSync ? computedAsync(factory, {requireSync: true}) : computedAsync(factory),
      );

      if (requireSync) {
        expect(result()).toBe(1);
        expect(requests).toEqual([1]);
      }
      await flushEffects();
      expect(result()).toBe(1);
      expect(loading()).toBe(true);
      expect(requests).toEqual([1]);

      loading.set(false);
      await flushEffects();
      expect(requests).toEqual([1]);
      parameter.set(2);
      await flushEffects();
      expect(result()).toBe(2);
      expect(loading()).toBe(true);
      expect(requests).toEqual([1, 2]);
    });
  });

  describe('works with raw values', () => {
    it('null & undefined', async () => {
      await TestBed.runInInjectionContext(async () => {
        const value = signal(null);
        const result = computedAsync(() => value());
        expect(result()).toEqual(undefined); // initial value
        value.set(null);
        await flushEffects();
        expect(result()).toEqual(null);
      });
    });
    it('objects', async () => {
      await TestBed.runInInjectionContext(async () => {
        const value = signal(0);
        const data = signal([1, 2, 3]);

        const result = computedAsync(() => {
          return data().map((v) => v + value());
        });

        expect(result()).toEqual(undefined); // initial value
        await flushEffects();
        expect(result()).toEqual([1, 2, 3]);
        value.set(1);
        await flushEffects();
        expect(result()).toEqual([2, 3, 4]);
      });
    });
    it('initialValue', async () => {
      await TestBed.runInInjectionContext(async () => {
        const value = signal(0);
        const data = signal([1, 2, 3]);

        const result = computedAsync(
          () => {
            return data().map((v) => v + value());
          },
          {initialValue: []},
        );

        expect(result()).toEqual([]); // initial value
        await flushEffects();
        expect(result()).toEqual([1, 2, 3]);
        value.set(1);
        await flushEffects();
        expect(result()).toEqual([2, 3, 4]);
      });
    });
  });

  describe('works with previousValue', () => {
    it('and can be retrieved in the callback fn', async () => {
      await TestBed.runInInjectionContext(async () => {
        const logs: number[] = [];
        const value = signal(1);

        const s = computedAsync((previousValue: number | undefined) => {
          const v = value();
          if (previousValue !== undefined) {
            logs.push(previousValue * 1000);
          }
          return promise(v, 100).then((x) => {
            logs.push(x);
            return x;
          });
        });

        expect(s()).toEqual(undefined); // initial value
        expect(logs).toEqual([]);
        await flushEffects();
        expect(s()).toEqual(undefined); // initial value
        expect(logs).toEqual([]);
        await flushEffects(100);
        expect(s()).toEqual(1);
        expect(logs).toEqual([1]);

        value.set(3);
        await flushEffects();
        expect(s()).toEqual(1); // still the old value
        expect(logs).toEqual([1, 1000]);
        await flushEffects(100);
        expect(s()).toEqual(3);
        expect(logs).toEqual([1, 1000, 3]);

        value.set(4);
        await flushEffects();
        expect(s()).toEqual(3); // still the old value
        expect(logs).toEqual([1, 1000, 3, 3000]); // previousValue is 3 and it gets pushed again
        await flushEffects(100);
        expect(s()).toEqual(4);
        expect(logs).toEqual([1, 1000, 3, 3000, 4]);
      });
    });
  });

  describe('works with requireSync', () => {
    it('adds and removes dynamic request dependencies without repeating the initializer', async () => {
      const useFirst = signal(true);
      const first = signal(1);
      const second = signal(10);
      const requests: number[] = [];
      const result = TestBed.runInInjectionContext(() =>
        computedAsync(
          () => {
            const value = useFirst() ? first() : second();
            requests.push(value);
            return of(value);
          },
          {requireSync: true},
        ),
      );
      expect(result()).toBe(1);
      await flushEffects();
      second.set(20);
      await flushEffects();
      expect(requests).toEqual([1]);

      useFirst.set(false);
      await flushEffects();
      expect(result()).toBe(20);
      first.set(2);
      await flushEffects();
      expect(requests).toEqual([1, 20]);
      second.set(30);
      await flushEffects();
      expect(result()).toBe(30);
      expect(requests).toEqual([1, 20, 30]);
    });

    it('does not repeat a request when a computed parameter stays equal', async () => {
      const input = signal(1);
      const parameter = computed(() => input() % 2);
      const requests: number[] = [];
      const result = TestBed.runInInjectionContext(() =>
        computedAsync(
          () => {
            const captured = parameter();
            requests.push(captured);
            return of(captured);
          },
          {requireSync: true},
        ),
      );
      input.set(3);
      await flushEffects();
      expect(result()).toBe(1);
      expect(requests).toEqual([1]);
      input.set(4);
      await flushEffects();
      expect(result()).toBe(0);
      expect(requests).toEqual([1, 0]);
    });

    it('keeps subscription and error callback reads outside its request dependencies', async () => {
      const parameter = signal(1);
      const callbackValue = signal(10);
      const requests: number[] = [];
      const result = TestBed.runInInjectionContext(() =>
        computedAsync(
          () => {
            const captured = parameter();
            requests.push(captured);
            return captured === 2
              ? throwError(() => new Error('Request failed'))
              : of(captured).pipe(tap(() => callbackValue()));
          },
          {requireSync: true, onError: () => callbackValue()},
        ),
      );
      callbackValue.set(20);
      await flushEffects();
      expect(requests).toEqual([1]);
      parameter.set(2);
      await flushEffects();
      expect(result()).toBe(20);
      callbackValue.set(30);
      await flushEffects();
      expect(result()).toBe(20);
      expect(requests).toEqual([1, 2]);
      parameter.set(3);
      await flushEffects();
      expect(result()).toBe(3);
      expect(requests).toEqual([1, 2, 3]);
    });

    it('disconnects synchronous dependencies and its active Observable on injector destruction', async () => {
      const injector = Injector.create({providers: [], parent: TestBed.inject(Injector)});
      const parameter = signal(1);
      const requests: number[] = [];
      let activeSubscriptions = 0;
      const result = computedAsync(
        () => {
          const captured = parameter();
          requests.push(captured);
          return new Observable<number>((subscriber) => {
            activeSubscriptions++;
            subscriber.next(captured);
            return () => activeSubscriptions--;
          });
        },
        {requireSync: true, injector},
      );
      expect(result()).toBe(1);
      await flushEffects();
      expect(requests).toEqual([1]);
      parameter.set(2);
      await flushEffects();
      expect(result()).toBe(2);
      expect(activeSubscriptions).toBe(1);
      injector.destroy();
      expect(activeSubscriptions).toBe(0);
      parameter.set(3);
      await flushEffects();
      expect(requests).toEqual([1, 2]);
      expect(result()).toBe(2);
    });

    it('uses dependencies changed before the first effect instead of discarding their new source', async () => {
      const parameter = signal(1);
      const result = TestBed.runInInjectionContext(() => computedAsync(() => of(parameter()), {requireSync: true}));
      expect(result()).toBe(1);
      parameter.set(2);
      await flushEffects();
      expect(result()).toBe(2);
    });

    it('starts the first fetch when requireSync is combined with an initial value', async () => {
      const result = TestBed.runInInjectionContext(() =>
        computedAsync(() => of(2), {requireSync: true, initialValue: 1}),
      );
      expect(result()).toBe(1);
      await flushEffects();
      expect(result()).toBe(2);
    });

    it('releases an asynchronous Observable immediately when synchronous initialization fails', () => {
      let activeSubscriptions = 0;
      const stream = new Observable<number>(() => {
        activeSubscriptions++;
        return () => activeSubscriptions--;
      });
      expect(() => TestBed.runInInjectionContext(() => computedAsync(() => stream, {requireSync: true}))).toThrow(
        /doesn't emit synchronously/,
      );
      expect(activeSubscriptions).toBe(0);
    });

    it('evaluates a synchronous initializer once and only starts new work when its dependencies change', async () => {
      const parameter = signal(1);
      const startedRequests: number[] = [];
      const result = TestBed.runInInjectionContext(() =>
        computedAsync(
          () => {
            const captured = parameter();
            startedRequests.push(captured);
            return of(captured);
          },
          {requireSync: true},
        ),
      );
      expect(result()).toBe(1);
      await flushEffects();
      expect(startedRequests).toEqual([1]);
      parameter.set(2);
      await flushEffects();
      expect(result()).toBe(2);
      expect(startedRequests).toEqual([1, 2]);
    });

    it('returns undefined for sync observables if not enabled', async () => {
      await TestBed.runInInjectionContext(async () => {
        const value = signal(1);
        const s = computedAsync(() => of(value()));
        expect(s()).toEqual(undefined); // initial value
      });
    });
    it('returns correct value and does not throw error if enabled', async () => {
      await TestBed.runInInjectionContext(async () => {
        const value = signal(1);
        const s = computedAsync(() => of(value()), {requireSync: true});
        expect(s()).toEqual(1); // initial value
      });
    });
    it('returns correct value and does not throw error with initial value provided', async () => {
      await TestBed.runInInjectionContext(async () => {
        const s = computedAsync(() => of(1), {initialValue: 2});
        expect(s()).toEqual(2); // initial value
        await flushEffects();
        expect(s()).toEqual(1);
      });
    });
    it('returns correct value and does not throw error with normal variable when enabled', async () => {
      await TestBed.runInInjectionContext(async () => {
        const s = computedAsync(() => 1, {requireSync: true});
        expect(s()).toEqual(1); // initial value
      });
    });
    it('throws error for promises', async () => {
      await TestBed.runInInjectionContext(async () => {
        const value = signal(1);
        expect(() => {
          computedAsync(() => promise(value()), {
            requireSync: true,
          });
        }).toThrowError(/Promises cannot work with requireSync/i);
      });
    });
  });

  describe('works with promises', () => {
    it('observes a queued Promise rejection before concat subscribes to it and then continues the queue', async () => {
      const parameter = signal(1);
      const failure = new Error('Queued request failed');
      let finishActive: ((value: number) => void) | undefined;
      const active = new Promise<number>((resolve) => {
        finishActive = resolve;
      });
      const result = TestBed.runInInjectionContext(() =>
        computedAsync(
          () => {
            const captured = parameter();
            return captured === 1 ? active : captured === 2 ? Promise.reject(failure) : Promise.resolve(captured);
          },
          {behavior: 'concat'},
        ),
      );
      await flushEffects();
      parameter.set(2);
      await flushEffects();
      expect(result()).toBeUndefined();
      if (!finishActive) throw new Error('The active Promise did not capture its resolver');
      finishActive(1);
      await flushEffects();
      expect(result()).toBe(failure);
      parameter.set(3);
      await flushEffects();
      expect(result()).toBe(3);
    });

    it('ignores an older Promise result after switching to a new parameter', async () => {
      const parameter = signal(1);
      const finish: ((value: number) => void)[] = [];
      const result = TestBed.runInInjectionContext(() =>
        computedAsync(() => {
          parameter();
          return new Promise<number>((resolve) => {
            finish.push(resolve);
          });
        }),
      );
      await flushEffects();
      parameter.set(2);
      await flushEffects();
      finish[1](2);
      await flushEffects();
      expect(result()).toBe(2);
      finish[0](1);
      await flushEffects();
      expect(result()).toBe(2);
    });

    it('stops accepting a Promise result after its injector is destroyed', async () => {
      const injector = Injector.create({providers: [], parent: TestBed.inject(Injector)});
      let finish: ((value: number) => void) | undefined;
      const result = computedAsync(
        () =>
          new Promise<number>((resolve) => {
            finish = resolve;
          }),
        {injector, initialValue: 1},
      );
      await flushEffects();
      injector.destroy();
      if (!finish) throw new Error('The Promise did not capture its resolver');
      finish(2);
      await flushEffects();
      expect(result()).toBe(1);
    });

    it('handles rejected eager Promises discarded by exhaust without replacing the active result', async () => {
      const parameter = signal(1);
      let finishActive: ((value: number) => void) | undefined;
      const active = new Promise<number>((resolve) => {
        finishActive = resolve;
      });
      const result = TestBed.runInInjectionContext(() =>
        computedAsync(
          () => {
            const captured = parameter();
            if (captured === 1) return active;
            if (captured === 2) return Promise.reject(new Error('Discarded eager request failed'));
            return Promise.resolve(captured);
          },
          {behavior: 'exhaust'},
        ),
      );
      await flushEffects();
      parameter.set(2);
      await flushEffects();
      if (!finishActive) throw new Error('The active Promise did not capture its resolver');
      finishActive(1);
      await flushEffects();
      expect(result()).toBe(1);
      parameter.set(3);
      await flushEffects();
      expect(result()).toBe(3);
    });

    it('waits for them to resolve', async () => {
      await TestBed.runInInjectionContext(async () => {
        const logs: number[] = [];
        const value = signal(1);

        const s = computedAsync(() => {
          return promise(value(), 100).then((v) => {
            logs.push(v);
            return v;
          });
        });
        expect(s()).toEqual(undefined); // initial value
        await flushEffects();
        expect(s()).toEqual(undefined); // initial value
        await flushEffects(100);
        expect(s()).toEqual(1);
        expect(logs).toEqual([1]);

        value.set(2);
        await flushEffects();
        expect(s()).toEqual(1); // still the old value
        await flushEffects(100);
        expect(s()).toEqual(2);
        expect(logs).toEqual([1, 2]);
      });
    });
  });

  describe('works with observables', () => {
    for (const behavior of ['switch', 'merge', 'concat', 'exhaust'] as const) {
      it(`releases active and queued Observable work on destruction with ${behavior}`, async () => {
        const injector = Injector.create({providers: [], parent: TestBed.inject(Injector)});
        const parameter = signal(1);
        const first = new Subject<number>();
        const second = new Subject<number>();
        const result = computedAsync(() => (parameter() === 1 ? first : second), {injector, behavior});
        await flushEffects();
        first.next(10);
        expect(result()).toBe(10);
        parameter.set(2);
        await flushEffects();
        injector.destroy();
        expect(first.observed).toBe(false);
        expect(second.observed).toBe(false);
        first.next(99);
        first.complete();
        second.next(100);
        await flushEffects();
        expect(result()).toBe(10);
      });
    }

    it('waits for them to resolve', async () => {
      await TestBed.runInInjectionContext(async () => {
        const logs: number[] = [];
        const value = signal(1);

        const s = computedAsync(() => {
          return of(value()).pipe(
            delay(100),
            tap((v) => logs.push(v)),
          );
        });

        expect(s()).toEqual(undefined); // initial value
        await flushEffects();
        expect(s()).toEqual(undefined); // initial value
        await flushEffects(100);
        expect(s()).toEqual(1);
        expect(logs).toEqual([1]);

        value.set(2);
        await flushEffects();
        expect(s()).toEqual(1); // still the old value
        await flushEffects(100);
        expect(s()).toEqual(2);
        expect(logs).toEqual([1, 2]);
      });
    });
    it('behavior: switch (default) -> previous computation', async () => {
      await TestBed.runInInjectionContext(async () => {
        const logs: number[] = [];
        const value = signal(1);

        const s = computedAsync(
          () => {
            return of(value()).pipe(
              delay(100),
              tap((v) => logs.push(v)),
            );
          },
          // { behavior: 'switch' },
        );

        expect(s()).toEqual(undefined); // initial value
        await flushEffects();
        expect(s()).toEqual(undefined); // initial value
        await flushEffects(100);
        expect(s()).toEqual(1);
        expect(logs).toEqual([1]);

        value.set(2);
        await flushEffects();
        expect(s()).toEqual(1); // still the old value

        await flushEffects(50);

        expect(s()).toEqual(1);
        expect(logs).toEqual([1]);

        value.set(3);
        await flushEffects();

        await flushEffects(50);
        expect(s()).toEqual(1);
        expect(logs).toEqual([1]);

        await flushEffects(50);
        expect(s()).toEqual(3);
        expect(logs).toEqual([1, 3]);

        // 2 was skipped -> the computation was cancelled
      });
    });
    it('behavior: concat -> does not cancel previous computation', async () => {
      await TestBed.runInInjectionContext(async () => {
        const logs: number[] = [];
        const value = signal(1);

        const s = computedAsync(
          () => {
            return of(value()).pipe(
              delay(100),
              tap((v) => logs.push(v)),
            );
          },
          {behavior: 'concat'},
        );

        expect(s()).toEqual(undefined); // initial value
        await flushEffects();
        expect(s()).toEqual(undefined); // initial value
        await flushEffects(50);
        expect(s()).toEqual(undefined); // initial value
        await flushEffects(50);
        // now we have 100ms passed
        expect(s()).toEqual(1);
        expect(logs).toEqual([1]);

        value.set(2);
        await flushEffects();
        expect(s()).toEqual(1); // still the old value
        await flushEffects(50);
        expect(s()).toEqual(1);
        expect(logs).toEqual([1]);

        value.set(3);
        await flushEffects();

        await flushEffects(50);
        expect(s()).toEqual(2);
        expect(logs).toEqual([1, 2]);

        // now the next computation starts again, so we need to wait 100ms
        await flushEffects(100);
        expect(s()).toEqual(3);
        expect(logs).toEqual([1, 2, 3]);
      });
    });

    it('behavior: concat -> continues executing subsequent queued requests when an intermediate request fails', async () => {
      await TestBed.runInInjectionContext(async () => {
        const value = signal(1);
        const logs: (number | string)[] = [];

        const s = computedAsync<number | Error>(
          () => {
            const val = value();
            if (val === 2) {
              return of(null).pipe(
                delay(50),
                map(() => {
                  logs.push('error-2');
                  throw new Error('Intermediate error for 2');
                }),
              );
            }
            return of(val).pipe(
              delay(50),
              tap((v) => logs.push(v)),
            );
          },
          {behavior: 'concat'},
        );

        // Initial emission for 1
        await flushEffects();
        expect(s()).toBeUndefined();

        // Queue 2 (which will fail) and 3 (which will succeed) while 1 is in-flight
        value.set(2);
        await flushEffects();
        value.set(3);
        await flushEffects();

        // After 50ms: request 1 completes
        await flushEffects(50);
        expect(s()).toBe(1);
        expect(logs).toEqual([1]);

        // After next 50ms: request 2 runs and fails, emitting the Error object into the signal
        await flushEffects(50);
        expect(s()).toBeInstanceOf(Error);
        expect(s()).toMatchObject({message: 'Intermediate error for 2'});
        expect(logs).toEqual([1, 'error-2']);

        // After next 50ms: request 3 runs and succeeds
        await flushEffects(50);
        expect(s()).toBe(3);
        expect(logs).toEqual([1, 'error-2', 3]);
      });
    });

    it('behavior: concat -> continues executing subsequent queued requests with onError fallback when intermediate fails', async () => {
      await TestBed.runInInjectionContext(async () => {
        const value = signal(1);

        const s = computedAsync(
          () => {
            const val = value();
            if (val === 2) {
              return of(null).pipe(
                delay(50),
                map(() => {
                  throw new Error('Failed request 2');
                }),
              );
            }
            return of(`Success ${val}`).pipe(delay(50));
          },
          {
            behavior: 'concat',
            onError: (err) => `Fallback for ${(err as Error).message}`,
          },
        );

        await flushEffects();
        value.set(2);
        await flushEffects();
        value.set(3);
        await flushEffects();

        // Request 1 completes
        await flushEffects(50);
        expect(s()).toBe('Success 1');

        // Request 2 completes with error, caught by onError
        await flushEffects(50);
        expect(s()).toBe('Fallback for Failed request 2');

        // Request 3 completes with success
        await flushEffects(50);
        expect(s()).toBe('Success 3');
      });
    });
    it('behavior: merge -> runs everything in parallel', async () => {
      await TestBed.runInInjectionContext(async () => {
        const logs: number[] = [];
        const value = signal(1);

        const s = computedAsync(
          () => {
            return of(value()).pipe(
              delay(100),
              tap((v) => logs.push(v)),
            );
          },
          {behavior: 'merge'},
        );

        expect(s()).toEqual(undefined); // initial value
        await flushEffects();
        expect(s()).toEqual(undefined); // initial value
        await flushEffects(50);
        expect(s()).toEqual(undefined); // initial value
        await flushEffects(50);
        // now we have 100ms passed
        expect(s()).toEqual(1);
        expect(logs).toEqual([1]);

        value.set(2);
        await flushEffects();

        value.set(0);
        await flushEffects();

        value.set(3);
        await flushEffects();

        value.set(4);
        await flushEffects();

        await flushEffects(100);
        expect(s()).toEqual(4);
        expect(logs).toEqual([1, 2, 0, 3, 4]);
      });
    });
    it('behavior: exhaust -> skips new computations until last one completes', async () => {
      await TestBed.runInInjectionContext(async () => {
        const logs: number[] = [];
        const value = signal(1);

        const s = computedAsync(
          () => {
            return of(value()).pipe(
              delay(100),
              tap((v) => logs.push(v)),
            );
          },
          {behavior: 'exhaust'},
        );

        expect(s()).toEqual(undefined); // initial value
        await flushEffects();
        expect(s()).toEqual(undefined); // initial value
        await flushEffects(50);
        expect(s()).toEqual(undefined); // initial value
        await flushEffects(50);
        // now we have 100ms passed
        expect(s()).toEqual(1);
        expect(logs).toEqual([1]);

        value.set(2);
        await flushEffects();
        expect(s()).toEqual(1); // still the old value
        await flushEffects(50);

        value.set(3);
        await flushEffects();

        expect(s()).toEqual(1);
        expect(logs).toEqual([1]);

        await flushEffects(50);
        expect(s()).toEqual(2);
        expect(logs).toEqual([1, 2]);

        // now the next computation starts again, so we need to wait 100ms
        await flushEffects(100);
        expect(s()).toEqual(2);
        expect(logs).toEqual([1, 2]);
      });
    });

    it('behavior: exhaust -> unlocks after error so subsequent computations can run', async () => {
      await TestBed.runInInjectionContext(async () => {
        const trigger = signal(1);

        const s = computedAsync(
          () => {
            const val = trigger();
            if (val === 1) {
              return throwError(() => new Error('First attempt failed'));
            }
            return of(`Success ${val}`);
          },
          {behavior: 'exhaust'},
        );

        await flushEffects();
        expect(s()).toBeInstanceOf(Error);

        // When trigger changes, exhaust gate should be unlocked because the error completed
        trigger.set(2);
        await flushEffects();
        expect(s()).toBe('Success 2');
      });
    });
  });

  describe('works with contextual observables + requireSync', () => {
    it('and recovers from errors', async () => {
      await TestBed.runInInjectionContext(async () => {
        const loadAsyncDataLogs: number[] = [];
        function loadAsyncData(number: number, throwError = false): Observable<number[]> {
          if (throwError) {
            loadAsyncDataLogs.push(number);
            return of([]).pipe(
              delay(1000),
              tap(() => {
                throw new Error('error-message');
              }),
            );
          }

          const array = Array.from({length: number}, (_, i) => i);
          return of(array).pipe(
            tap(() => loadAsyncDataLogs.push(number)), // log the number of the request
            delay(1000), // simulate async
          );
        }

        const id = signal(1);
        let throwErrorFlag = false;

        const data = computedAsync(
          () =>
            loadAsyncData(id(), throwErrorFlag).pipe(
              map((res) => ({status: 'loaded' as const, result: res})),
              startWith({status: 'loading' as const, result: []}),
              catchError((err) => of({status: 'error' as const, error: err})),
            ),
          {requireSync: true},
        );

        expect(data()).toEqual({status: 'loading', result: []});
        expect(loadAsyncDataLogs).toEqual([1]);
        await flushEffects(500);
        expect(data()).toEqual({status: 'loading', result: []});
        expect(loadAsyncDataLogs).toEqual([1]);
        await flushEffects(500);
        expect(data()).toEqual({status: 'loaded', result: [0]});

        // if we don't flush effects, the effect won't run
        await flushEffects();

        id.set(2);
        await flushEffects();
        expect(loadAsyncDataLogs.length).toEqual(2);
        expect(data().status).toEqual('loading');
        await flushEffects(500);
        expect(data().status).toEqual('loading');
        await flushEffects(500);
        expect(data()).toEqual({status: 'loaded', result: [0, 1]});
        expect(loadAsyncDataLogs).toEqual([1, 2]);

        id.set(3);
        throwErrorFlag = true;
        await flushEffects();
        expect(loadAsyncDataLogs).toEqual([1, 2, 3]);
        expect(data().status).toEqual('loading');
        await flushEffects(500);
        expect(data().status).toEqual('loading');
        await flushEffects(500);

        // TODO:
        // expect(data()).toEqual({
        //   status: 'error',
        //   error: new Error('error-message'),
        // });

        id.set(4);
        throwErrorFlag = false; // should recover from error
        await flushEffects();
        expect(loadAsyncDataLogs).toEqual([1, 2, 3, 4]);
        expect(data().status).toEqual('loading');
        await flushEffects(500);
        expect(data().status).toEqual('loading');
        await flushEffects(500);
        expect(data()).toEqual({status: 'loaded', result: [0, 1, 2, 3]});
      });
    });
  });

  describe('is typesafe', () => {
    it('initial value', async () => {
      await TestBed.runInInjectionContext(async () => {
        // promise
        const onePromise: Signal<number | undefined> = computedAsync(() => promise(1));
        const onlyPromises: Signal<number | undefined> = computedAsync(() => {
          if (Math.random() > 0.5) return Promise.resolve(1);
          return Promise.resolve(1);
        });

        // observable
        const oneObservable: Signal<number | undefined> = computedAsync(() => of(1));
        const onlyObservables: Signal<number | undefined> = computedAsync(() => {
          if (Math.random() > 0.5) return of(1);
          return of(1);
        });

        // normal value
        const normalValue: Signal<number | undefined> = computedAsync(() => 1);
        const normalValue2: Signal<1 | '1' | undefined> = computedAsync(() => {
          if (Math.random() > 0.5) return 1;
          return '1';
        });

        // undefined or null
        const undefinedValue: Signal<undefined> = computedAsync(() => undefined);
        // TODO: should we allow this?
        const nullValue: Signal<null | undefined> = computedAsync(() => null);

        const numberOrUndefined: Signal<number | undefined> = computedAsync(() => {
          if (Math.random() > 0.5) return 1;
          return undefined;
        });

        const numberOrNull: Signal<number | null | undefined> = computedAsync(() => {
          if (Math.random() > 0.5) return 1;
          return null;
        });

        // initialValue + normal value
        const withInitialValue: Signal<number | undefined> = computedAsync(() => 1, {initialValue: undefined});

        const withNullInitialValue: Signal<number | null> = computedAsync(() => 1, {initialValue: null});

        const withInitialValue2: Signal<number> = computedAsync(() => 1, {
          initialValue: 0,
        });
        const withInitialValue3: Signal<number[]> = computedAsync(() => [1, 2, 3], {initialValue: []});

        // initialValue + promise
        const promiseWithInitialValue: Signal<number | undefined> = computedAsync(() => promise(1), {
          initialValue: undefined,
        });
        const promiseWithInitialValue2: Signal<number> = computedAsync(() => promise(1), {initialValue: 1});
        const promiseWithInitialValue3: Signal<number[]> = computedAsync(() => promise([1, 2, 3]), {
          initialValue: [],
        });

        // initialValue + observable
        const observableWithInitialValue = computedAsync(() => of(1), {
          initialValue: undefined,
        });

        const observableWithInitialValue2: Signal<number> = computedAsync(() => of(1), {initialValue: 1});
        const observableWithInitialValue3: Signal<number[]> = computedAsync(() => of([1, 2, 3]), {initialValue: []});

        // initialValue + undefined
        const initialValueUndefined: Signal<number | undefined> = computedAsync(() => 1, {initialValue: undefined});
        // initialValue + null
        const initialValueNull: Signal<number | null> = computedAsync(() => 1, {
          initialValue: null,
        });
        // initialValue + promise + observable -> Not supported
        const initialValuePromiseObservable = computedAsync(
          () => {
            if (Math.random() > 0.5) return promise(1);
            return of(1);
          },
          {initialValue: 1},
        );

        // requireSync + normal value
        const requireSyncNormalValue: Signal<number> = computedAsync(() => 1, {
          requireSync: true,
        });

        expect(requireSyncNormalValue()).toEqual(1);

        const requireSyncNormalValue2: Signal<1 | '1'> = computedAsync(
          () => {
            const value = 1;
            if (value > 0.5) return 1;
            return '1';
          },
          {requireSync: true},
        );

        expect(requireSyncNormalValue2()).toEqual(1);

        const requireSyncNormalValue3: Signal<number[]> = computedAsync(() => [1, 2, 3], {requireSync: true});

        expect(requireSyncNormalValue3()).toEqual([1, 2, 3]);

        // requireSync + promise -> Not supported
        expect(() => {
          const requireSyncPromise: never = computedAsync(() => promise(1), {
            requireSync: true,
          });
          void requireSyncPromise;
        }).toThrowError(/Promises cannot work with requireSync/i);

        // requireSync + observable
        const requireSyncObservable: Signal<number> = computedAsync(() => of(1), {requireSync: true});

        expect(requireSyncObservable()).toEqual(1);

        // requireSync + initialValue
        const requireSyncNormalValue4: Signal<number> = computedAsync(() => 1, {
          requireSync: true,
          initialValue: 0,
        });

        expect(requireSyncNormalValue4()).toEqual(0);

        const requireSyncNormalValue5: Signal<number[]> = computedAsync(() => [1, 2, 3], {
          requireSync: true,
          initialValue: [],
        });

        expect(requireSyncNormalValue5()).toEqual([]);

        // requireSync + undefined
        const requireSyncUndefined: Signal<number | undefined> = computedAsync(() => 1, {
          requireSync: true,
          initialValue: undefined,
        });

        expect(requireSyncUndefined()).toEqual(1);

        // requireSync + null
        const requireSyncNull: Signal<number | null> = computedAsync(() => 1, {
          requireSync: true,
          initialValue: null,
        });

        expect(requireSyncNull()).toEqual(null);

        // // requireSync + initialValue + promise -> Works but Types are changed to not support it
        // const requireSyncPromiseWithInitialValue: never = computedAsync(() => promise(1), { requireSync: true, initialValue: 0 });
        // // @ts-expect-error promise + requireSync + initialValue -> Not supported -> Types are changed to not support it
        // expect(requireSyncPromiseWithInitialValue()).toBe(0);

        // requireSync + initialValue + observable
        const requireSyncObservableWithInitialValue: Signal<number> = computedAsync(() => of(1), {
          requireSync: true,
          initialValue: 0,
        });

        expect(requireSyncObservableWithInitialValue()).toEqual(0);

        // requireSync + initialValue + undefined
        const requireSyncUndefinedWithInitialValue: Signal<number> = computedAsync(() => 1, {
          requireSync: true,
          initialValue: undefined,
        });

        expect(requireSyncUndefinedWithInitialValue()).toEqual(1);

        // requireSync + initialValue + null
        const requireSyncNullWithInitialValue: Signal<number | null> = computedAsync(() => 1, {
          requireSync: true,
          initialValue: null,
        });

        expect(requireSyncNullWithInitialValue()).toEqual(null);

        const all = [
          onlyPromises,
          onePromise,
          oneObservable,
          onlyObservables,
          normalValue,
          normalValue2,
          undefinedValue,
          nullValue,
          numberOrUndefined,
          numberOrNull,
          withInitialValue,
          withInitialValue2,
          withInitialValue3,
          withNullInitialValue,
          promiseWithInitialValue,
          promiseWithInitialValue2,
          promiseWithInitialValue3,
          observableWithInitialValue,
          observableWithInitialValue2,
          observableWithInitialValue3,
          initialValuePromiseObservable,
          initialValueUndefined,
          initialValueNull,
        ];

        all.forEach((g) => {
          expect(g()).toBe(g());
        });
      });
    });
  });

  describe('error handling and stream resilience', () => {
    it('throws an onError callback failure only on read with throwOnError and still recovers', async () => {
      const parameter = signal(false);
      const failure = new Error('Handler transformed the failure');
      const result = TestBed.runInInjectionContext(() =>
        computedAsync(() => (parameter() ? of(2) : throwError(() => new Error('Network failure'))), {
          throwOnError: true,
          onError: () => {
            throw failure;
          },
        }),
      );
      await expect(flushEffects()).resolves.toBeUndefined();
      expect(() => result()).toThrow(failure);
      parameter.set(true);
      await flushEffects();
      expect(result()).toBe(2);
    });

    it('does not treat signal reads in the error handler as request dependencies', async () => {
      const request = signal(1);
      const fallback = signal('fallback-a');
      const capturedRequests: number[] = [];
      const result = TestBed.runInInjectionContext(() =>
        computedAsync(
          () => {
            capturedRequests.push(request());
            throw new Error('Computation failed');
          },
          {onError: () => fallback()},
        ),
      );
      await flushEffects();
      expect(result()).toBe('fallback-a');
      fallback.set('fallback-b');
      await flushEffects();
      expect(capturedRequests).toEqual([1]);
      expect(result()).toBe('fallback-a');
      request.set(2);
      await flushEffects();
      expect(capturedRequests).toEqual([1, 2]);
      expect(result()).toBe('fallback-b');
    });

    it('cancels an older switch source when the latest computation throws synchronously', async () => {
      const shouldFail = signal(false);
      const previousSource = new Subject<string>();
      const result = TestBed.runInInjectionContext(() =>
        computedAsync(
          () => {
            if (shouldFail()) {
              throw new Error('Latest computation failed');
            }
            return previousSource;
          },
          {onError: () => 'fallback'},
        ),
      );
      await flushEffects();
      previousSource.next('initial');
      expect(result()).toBe('initial');
      shouldFail.set(true);
      await flushEffects();
      expect(result()).toBe('fallback');
      previousSource.next('late old result');
      await flushEffects();
      expect(result()).toBe('fallback');
    });

    it('stores an onError callback failure without an uncaught RxJS error and recovers on later data', async () => {
      const trigger = signal(false);
      const handlerFailure = new Error('Error handler failed');
      const result = TestBed.runInInjectionContext(() =>
        computedAsync(() => (trigger() ? of('recovered') : throwError(() => new Error('Request failed'))), {
          onError: () => {
            throw handlerFailure;
          },
        }),
      );
      await expect(flushEffects()).resolves.toBeUndefined();
      expect(result()).toBe(handlerFailure);
      trigger.set(true);
      await flushEffects();
      expect(result()).toBe('recovered');
    });

    it('should continue emitting when a new source is provided after an inner error', async () => {
      await TestBed.runInInjectionContext(async () => {
        const trigger = signal<string>('initial');
        const s = computedAsync(() => {
          const val = trigger();
          if (val === 'error') {
            return throwError(() => new Error('Request canceled'));
          }
          return of(`Data for ${val}`);
        });

        await flushEffects();
        expect(s()).toBe('Data for initial');

        // Simulate request error/cancel
        trigger.set('error');
        await flushEffects();
        expect(s()).toBeInstanceOf(Error);

        // Subsequent valid source should continue to work and not be frozen
        trigger.set('recovered');
        await flushEffects();
        expect(s()).toBe('Data for recovered');
      });
    });

    it('should throw error when reading signal with throwOnError: true, and recover on subsequent success', async () => {
      await TestBed.runInInjectionContext(async () => {
        const trigger = signal<string>('initial');
        const onErrorSpy = vi.fn();

        const s = computedAsync(
          () => {
            const val = trigger();
            if (val === 'error') {
              return throwError(() => new Error('API failure'));
            }
            return of(`Success ${val}`);
          },
          {
            throwOnError: true,
            onError: onErrorSpy,
          },
        );

        await flushEffects();
        expect(s()).toBe('Success initial');

        trigger.set('error');
        await flushEffects();
        expect(onErrorSpy).toHaveBeenCalledTimes(1);
        expect(() => s()).toThrow('API failure');

        // Verify it recovers seamlessly from error state
        trigger.set('recovered');
        await flushEffects();
        expect(s()).toBe('Success recovered');
      });
    });

    it('should use fallback value from onError without throwing', async () => {
      await TestBed.runInInjectionContext(async () => {
        const trigger = signal<string>('initial');

        const s = computedAsync(
          () => {
            const val = trigger();
            if (val === 'error') {
              return throwError(() => new Error('Network timeout'));
            }
            return of(`Data: ${val}`);
          },
          {
            onError: () => 'fallback data',
          },
        );

        await flushEffects();
        expect(s()).toBe('Data: initial');

        trigger.set('error');
        await flushEffects();
        expect(s()).toBe('fallback data');

        trigger.set('recovered');
        await flushEffects();
        expect(s()).toBe('Data: recovered');
      });
    });

    it('should handle synchronous throw inside computeFn and recover', async () => {
      await TestBed.runInInjectionContext(async () => {
        const trigger = signal<'valid' | 'throw'>('valid');

        const s = computedAsync(
          () => {
            if (trigger() === 'throw') {
              throw new Error('Sync calculation error');
            }
            return of('Valid calculation');
          },
          {
            onError: (err: unknown) => `Recovered from: ${(err as Error).message}`,
          },
        );

        await flushEffects();
        expect(s()).toBe('Valid calculation');

        trigger.set('throw');
        await flushEffects();
        expect(s()).toBe('Recovered from: Sync calculation error');

        trigger.set('valid');
        await flushEffects();
        expect(s()).toBe('Valid calculation');
      });
    });

    it('should work outside injection context when custom injector is provided', async () => {
      const injector = TestBed.inject(Injector);
      const trigger = signal('initial');

      // Called outside TestBed.runInInjectionContext
      const s = computedAsync(() => of(`Result: ${trigger()}`), {injector});

      await flushEffects();
      expect(s()).toBe('Result: initial');

      trigger.set('updated');
      await flushEffects();
      expect(s()).toBe('Result: updated');
    });

    it('should cancel prior in-flight async request when switching to a synchronous primitive value', async () => {
      await TestBed.runInInjectionContext(async () => {
        const mode = signal<'async' | 'sync'>('async');

        const s = computedAsync(() => {
          if (mode() === 'async') {
            return of('slow-async-data').pipe(delay(50));
          }
          return 'immediate-sync-data';
        });

        await flushEffects();
        expect(s()).toBeUndefined();

        // Switch to synchronous primitive before the 50ms async completes
        mode.set('sync');
        await flushEffects();
        expect(s()).toBe('immediate-sync-data');

        // Advance past the 50ms delay of the initial async request
        await flushEffects(60);

        // Crucial assertion: the slow async request must NOT clobber the synchronous data
        expect(s()).toBe('immediate-sync-data');
      });
    });
  });

  it('applies equality to consumer values while still capturing each changed request parameter', async () => {
    const id = signal(1);
    const revision = signal(1);
    const observed: {id: number; revision: number}[] = [];
    const requests: {id: number; revision: number}[] = [];
    const result = TestBed.runInInjectionContext(() =>
      computedAsync(
        () => {
          const params = {id: id(), revision: revision()};
          requests.push(params);
          return of(params);
        },
        {equal: (previous, next) => previous?.id === next?.id},
      ),
    );
    TestBed.runInInjectionContext(() =>
      effect(() => {
        const value = result();
        if (value) observed.push(value);
      }),
    );
    await flushEffects();
    revision.set(2);
    await flushEffects();
    expect(result()).toEqual({id: 1, revision: 1});
    expect(observed).toEqual([{id: 1, revision: 1}]);
    id.set(2);
    await flushEffects();
    expect(result()).toEqual({id: 2, revision: 2});
    expect(requests).toEqual([
      {id: 1, revision: 1},
      {id: 1, revision: 2},
      {id: 2, revision: 2},
    ]);
    expect(observed).toEqual([
      {id: 1, revision: 1},
      {id: 2, revision: 2},
    ]);
  });
});
