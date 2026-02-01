import {effect, signal} from '@angular/core';
import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {toObservable} from '@angular/core/rxjs-interop';
import {delay, map, switchMap} from 'rxjs/operators';
import {of} from 'rxjs';

import {createTrigger} from './create-trigger';

describe(createTrigger.name, () => {
  describe('basic functionality', () => {
    it('should create a trigger with initial value of 0', () => {
      TestBed.runInInjectionContext(() => {
        const trigger = createTrigger();

        expect(trigger.value()).toBe(0);
      });
    });

    it('should increment counter when next() is called', () => {
      TestBed.runInInjectionContext(() => {
        const trigger = createTrigger();

        expect(trigger.value()).toBe(0);

        trigger.next();
        expect(trigger.value()).toBe(1);

        trigger.next();
        expect(trigger.value()).toBe(2);

        trigger.next();
        expect(trigger.value()).toBe(3);
      });
    });

    it('should be a readonly signal', () => {
      TestBed.runInInjectionContext(() => {
        const trigger = createTrigger();

        // Verify it's readonly by checking it doesn't have 'set' or 'update' methods
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect((trigger.value as any).set).toBeUndefined();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect((trigger.value as any).update).toBeUndefined();
      });
    });
  });

  describe('integration with effects', () => {
    it('should trigger effects when next() is called', () => {
      TestBed.runInInjectionContext(() => {
        const trigger = createTrigger();
        const callLog: number[] = [];

        effect(() => {
          callLog.push(trigger.value());
        });

        TestBed.tick();

        // Initial effect run
        expect(callLog).toEqual([0]);

        trigger.next();
        TestBed.tick();
        expect(callLog).toEqual([0, 1]);

        trigger.next();
        TestBed.tick();
        expect(callLog).toEqual([0, 1, 2]);
      });
    });

    it('should work with computed signals', () => {
      TestBed.runInInjectionContext(() => {
        const trigger = createTrigger();
        const multiplier = signal(10);

        // Create a computed that depends on trigger
        const computed = () => trigger.value() * multiplier();

        expect(computed()).toBe(0);

        trigger.next();
        expect(computed()).toBe(10);

        trigger.next();
        expect(computed()).toBe(20);

        multiplier.set(5);
        expect(computed()).toBe(10); // 2 * 5 = 10
      });
    });
  });

  describe('integration with observables', () => {
    it('should work with toObservable', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const trigger = createTrigger();
        const values: number[] = [];

        const trigger$ = toObservable(trigger.value);

        trigger$.subscribe((value) => values.push(value));

        TestBed.tick();
        expect(values).toEqual([0]);

        trigger.next();
        TestBed.tick();
        expect(values).toEqual([0, 1]);

        trigger.next();
        TestBed.tick();
        expect(values).toEqual([0, 1, 2]);
      });
    }));

    it('should trigger observable emissions', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const trigger = createTrigger();
        const apiCallCount: number[] = [];

        // Simulate API call on trigger
        const data$ = toObservable(trigger.value).pipe(
          switchMap((count) => {
            apiCallCount.push(count);
            return of(`data-${count}`).pipe(delay(100));
          }),
        );

        const results: string[] = [];
        data$.subscribe((result) => results.push(result));

        TestBed.tick();
        tick(100);
        expect(results).toEqual(['data-0']);
        expect(apiCallCount).toEqual([0]);

        trigger.next();
        TestBed.tick();
        tick(100);
        expect(results).toEqual(['data-0', 'data-1']);
        expect(apiCallCount).toEqual([0, 1]);

        trigger.next();
        TestBed.tick();
        tick(100);
        expect(results).toEqual(['data-0', 'data-1', 'data-2']);
        expect(apiCallCount).toEqual([0, 1, 2]);
      });
    }));

    it('should work with RxJS operators', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const trigger = createTrigger();

        const doubled$ = toObservable(trigger.value).pipe(map((v) => v * 2));

        const results: number[] = [];
        doubled$.subscribe((result) => results.push(result));

        TestBed.tick();
        expect(results).toEqual([0]);

        trigger.next();
        TestBed.tick();
        expect(results).toEqual([0, 2]);

        trigger.next();
        TestBed.tick();
        expect(results).toEqual([0, 2, 4]);
      });
    }));
  });

  describe('use cases', () => {
    it('should work as a refresh trigger', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const refreshTrigger = createTrigger();
        let fetchCount = 0;

        const data$ = toObservable(refreshTrigger.value).pipe(
          switchMap(() => {
            fetchCount++;
            return of({id: fetchCount, data: `Data ${fetchCount}`}).pipe(delay(100));
          }),
        );

        const results: {id: number; data: string}[] = [];
        data$.subscribe((result) => results.push(result));

        // Initial fetch
        TestBed.tick();
        tick(100);
        expect(results).toEqual([{id: 1, data: 'Data 1'}]);

        // Manual refresh
        refreshTrigger.next();
        TestBed.tick();
        tick(100);
        expect(results).toEqual([
          {id: 1, data: 'Data 1'},
          {id: 2, data: 'Data 2'},
        ]);

        // Another refresh
        refreshTrigger.next();
        TestBed.tick();
        tick(100);
        expect(results).toEqual([
          {id: 1, data: 'Data 1'},
          {id: 2, data: 'Data 2'},
          {id: 3, data: 'Data 3'},
        ]);
      });
    }));

    it('should work for polling control', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const pollTrigger = createTrigger();
        let apiCallCount = 0;

        const polledData$ = toObservable(pollTrigger.value).pipe(
          switchMap(() => {
            apiCallCount++;
            return of(apiCallCount);
          }),
        );

        const values: number[] = [];
        polledData$.subscribe((value) => values.push(value));

        TestBed.tick();
        expect(values).toEqual([1]);
        expect(apiCallCount).toBe(1);

        // Trigger poll
        pollTrigger.next();
        TestBed.tick();
        expect(values).toEqual([1, 2]);
        expect(apiCallCount).toBe(2);

        // Trigger poll multiple times
        pollTrigger.next();
        TestBed.tick();
        pollTrigger.next();
        TestBed.tick();
        expect(values).toEqual([1, 2, 3, 4]);
        expect(apiCallCount).toBe(4);
      });
    }));

    it('should work as a manual trigger for side effects', () => {
      TestBed.runInInjectionContext(() => {
        const saveTrigger = createTrigger();
        const saveLog: string[] = [];

        effect(() => {
          const count = saveTrigger.value();
          if (count > 0) {
            saveLog.push(`Save triggered: ${count}`);
          }
        });

        TestBed.tick();
        expect(saveLog).toEqual([]);

        saveTrigger.next();
        TestBed.tick();
        expect(saveLog).toEqual(['Save triggered: 1']);

        saveTrigger.next();
        TestBed.tick();
        expect(saveLog).toEqual(['Save triggered: 1', 'Save triggered: 2']);
      });
    });
  });

  describe('multiple triggers', () => {
    it('should maintain independent counters', () => {
      TestBed.runInInjectionContext(() => {
        const trigger1 = createTrigger();
        const trigger2 = createTrigger();

        expect(trigger1.value()).toBe(0);
        expect(trigger2.value()).toBe(0);

        trigger1.next();
        expect(trigger1.value()).toBe(1);
        expect(trigger2.value()).toBe(0);

        trigger2.next();
        trigger2.next();
        expect(trigger1.value()).toBe(1);
        expect(trigger2.value()).toBe(2);

        trigger1.next();
        trigger1.next();
        trigger1.next();
        expect(trigger1.value()).toBe(4);
        expect(trigger2.value()).toBe(2);
      });
    });

    it('should trigger independent effects', () => {
      TestBed.runInInjectionContext(() => {
        const trigger1 = createTrigger();
        const trigger2 = createTrigger();
        const log1: number[] = [];
        const log2: number[] = [];

        effect(() => {
          log1.push(trigger1.value());
        });

        effect(() => {
          log2.push(trigger2.value());
        });

        TestBed.tick();
        expect(log1).toEqual([0]);
        expect(log2).toEqual([0]);

        trigger1.next();
        TestBed.tick();
        expect(log1).toEqual([0, 1]);
        expect(log2).toEqual([0]);

        trigger2.next();
        TestBed.tick();
        expect(log1).toEqual([0, 1]);
        expect(log2).toEqual([0, 1]);
      });
    });
  });

  describe('edge cases', () => {
    it('should handle rapid calls to next()', () => {
      TestBed.runInInjectionContext(() => {
        const trigger = createTrigger();

        // Rapid calls
        for (let i = 0; i < 100; i++) {
          trigger.next();
        }

        expect(trigger.value()).toBe(100);
      });
    });

    it('should work with multiple subscribers', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const trigger = createTrigger();
        const trigger$ = toObservable(trigger.value);

        const values1: number[] = [];
        const values2: number[] = [];
        const values3: number[] = [];

        trigger$.subscribe((v) => values1.push(v));
        trigger$.subscribe((v) => values2.push(v));
        trigger$.subscribe((v) => values3.push(v));

        TestBed.tick();
        expect(values1).toEqual([0]);
        expect(values2).toEqual([0]);
        expect(values3).toEqual([0]);

        trigger.next();
        TestBed.tick();
        expect(values1).toEqual([0, 1]);
        expect(values2).toEqual([0, 1]);
        expect(values3).toEqual([0, 1]);
      });
    }));
  });

  describe('type safety', () => {
    it('should have correct types', () => {
      TestBed.runInInjectionContext(() => {
        const trigger = createTrigger();

        // value is a Signal<number>
        const value: number = trigger.value();
        expect(typeof value).toBe('number');

        // next is a function that returns void
        const result: void = trigger.next();
        expect(result).toBeUndefined();
      });
    });
  });
});
