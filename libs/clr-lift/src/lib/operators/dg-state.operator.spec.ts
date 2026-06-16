import {flushEffects} from '../../test-setup';
import {ClrDatagridStateInterface} from '@clr/angular';
import {BehaviorSubject} from 'rxjs';
import {TestScheduler} from 'rxjs/testing';
import {vi, beforeEach, afterEach} from 'vitest';

import {dgState} from './dg-state.operator';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('dgState', () => {
  const clrDgState = {
    page: {
      from: 0,
      to: 9,
      size: 10,
      current: 1,
    },
    sort: {
      by: 'description',
      reverse: false,
    },
    filters: [
      {
        property: 'name',
        value: 'mike',
      },
      {
        property: 'job',
        value: 'programming',
      },
    ],
  };

  let testScheduler: TestScheduler;

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should debounce emissions when filters does not change', () => {
    testScheduler.run(({cold, expectObservable}) => {
      // Arrange
      const initialState: ClrDatagridStateInterface | null = null;
      const newState1: ClrDatagridStateInterface | null = {filters: [{column1: 'value1'}]};
      const newState2: ClrDatagridStateInterface | null = {filters: [{column1: 'value1'}]};

      const source$ = cold('a-b-c|', {a: initialState, b: newState1, c: newState2});

      // Act
      const result$ = source$.pipe(dgState());

      // Assert
      expectObservable(result$).toBe('a---c|', {a: initialState, c: newState2}); // Delay applied to newState2

      // Fast-forward time (no debounce needed)
      testScheduler.flush();
    });
  });

  it('should emit when filter changes after 500ms', async () => {
    // Arrange
    const initialState: ClrDatagridStateInterface | null = null;
    const newState1: ClrDatagridStateInterface | null = {filters: [{column1: 'value1'}]};
    const newState2: ClrDatagridStateInterface | null = {filters: [{column1: 'value2'}]};

    const source$ = new BehaviorSubject<ClrDatagridStateInterface | null>(initialState);

    // Act
    const result$ = source$.pipe(dgState());

    const results: (ClrDatagridStateInterface | null)[] = [];
    const subscription = result$.subscribe((result) => {
      results.push(result);
    });

    // BehaviorSubject emits immediately on subscribe, ensure subscription callback ran
    await flushEffects();
    expect(results[0]).toEqual(null);

    // Emit newState1 after 100ms
    await flushEffects(100);
    source$.next(newState1);
    await flushEffects(500);

    // Emit newState2 after 700ms total
    await flushEffects(100);
    source$.next(newState2);
    await flushEffects(500);

    expect(results[1]).toEqual(newState1);
    expect(results[2]).toEqual(newState2);

    subscription.unsubscribe();
    source$.complete();
  });

  it('should not emit when filter changes back to original value within 500ms', async () => {
    // Arrange
    const initialState: ClrDatagridStateInterface | null = null;
    const newState1: ClrDatagridStateInterface | null = {filters: [{column1: 'value1'}]};
    const newState2: ClrDatagridStateInterface | null = {filters: [{column1: 'value2'}]};

    const source$ = new BehaviorSubject<ClrDatagridStateInterface | null>(initialState);

    // Act
    const result$ = source$.pipe(dgState());

    const results: (ClrDatagridStateInterface | null)[] = [];
    const subscription = result$.subscribe((result) => {
      results.push(result);
    });

    // BehaviorSubject emits immediately on subscribe, ensure subscription callback ran
    await flushEffects();
    expect(results[0]).toEqual(null);

    // Emit newState1 after 100ms
    await flushEffects(100);
    source$.next(newState1);
    await flushEffects(100);
    source$.next(newState2);
    await flushEffects(100);
    source$.next(newState1);
    await flushEffects(500);

    expect(results.length).toBe(2); // Only initial and final newState1
    expect(results[1]).toEqual(newState1);

    subscription.unsubscribe();
    source$.complete();
  });

  it('should not emit when filter does not change', async () => {
    // Arrange
    const initialState: ClrDatagridStateInterface | null = null;
    const newState1: ClrDatagridStateInterface | null = {filters: [{column1: 'value1'}]};
    const newState2: ClrDatagridStateInterface | null = {filters: [{column1: 'value1'}]};

    const source$ = new BehaviorSubject<ClrDatagridStateInterface | null>(initialState);

    // Act
    const result$ = source$.pipe(dgState());

    const results: (ClrDatagridStateInterface | null)[] = [];
    const subscription = result$.subscribe((result) => {
      results.push(result);
    });

    // BehaviorSubject emits immediately on subscribe, ensure subscription callback ran
    await flushEffects();
    expect(results[0]).toEqual(null);

    // Emit newState1 after 100ms
    await flushEffects(100);
    source$.next(newState1);
    await flushEffects(500);

    // Emit newState2 (same filter value) after 700ms total
    await flushEffects(100);
    source$.next(newState2);
    await flushEffects(500);

    expect(results.length).toBe(2); // Only initial and newState1
    expect(results[1]).toEqual(newState1);

    subscription.unsubscribe();
    source$.complete();
  });

  it('should emit the same state when enableDistinctUntilChanged is false', async () => {
    // Arrange
    const initialState: ClrDatagridStateInterface | null = null;
    const newState1: ClrDatagridStateInterface | null = clrDgState;
    const newState2: ClrDatagridStateInterface | null = clrDgState;

    const source$ = new BehaviorSubject<ClrDatagridStateInterface | null>(initialState);

    // Act
    const result$ = source$.pipe(dgState(false));

    const results: (ClrDatagridStateInterface | null)[] = [];
    const subscription = result$.subscribe((result) => {
      results.push(result);
    });

    // BehaviorSubject emits immediately on subscribe, ensure subscription callback ran
    await flushEffects();
    expect(results[0]).toEqual(null);

    // Emit newState1 after 100ms
    await flushEffects(100);
    source$.next(newState1);
    await flushEffects(500);

    // Emit newState2 (same state) after 700ms total
    await flushEffects(100);
    source$.next(newState2);
    await flushEffects(500);

    expect(results.length).toBe(3); // initial, newState1, newState2
    expect(results[1]).toEqual(clrDgState);
    expect(results[2]).toEqual(clrDgState);

    subscription.unsubscribe();
    source$.complete();
  });

  it('should not emit the same state when enableDistinctUntilChanged is true', async () => {
    // Arrange
    const initialState: ClrDatagridStateInterface | null = null;
    const newState1: ClrDatagridStateInterface | null = clrDgState;
    const newState2: ClrDatagridStateInterface | null = clrDgState;

    const source$ = new BehaviorSubject<ClrDatagridStateInterface | null>(initialState);

    // Act
    const result$ = source$.pipe(dgState());

    const results: (ClrDatagridStateInterface | null)[] = [];
    const subscription = result$.subscribe((result) => {
      results.push(result);
    });

    // BehaviorSubject emits immediately on subscribe, ensure subscription callback ran
    await flushEffects();
    expect(results[0]).toEqual(null);

    // Emit newState1 after 100ms
    await flushEffects(100);
    source$.next(newState1);
    await flushEffects(500);

    // Emit newState2 (same state) after 700ms total
    await flushEffects(100);
    source$.next(newState2);
    await flushEffects(500);

    expect(results.length).toBe(2); // Only initial and newState1
    expect(results[1]).toEqual(clrDgState);

    subscription.unsubscribe();
    source$.complete();
  });
});
