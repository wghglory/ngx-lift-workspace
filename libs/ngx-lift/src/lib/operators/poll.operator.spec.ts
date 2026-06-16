import {TestBed} from '@angular/core/testing';
import {of, throwError} from 'rxjs';
import {take} from 'rxjs/operators';
import {vi, beforeEach, afterEach} from 'vitest';

import {AsyncState} from '../models';
import {poll} from './poll.operator';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('poll', () => {
  let mockPollingFn: ReturnType<typeof vi.fn>;
  let mockParamsBuilder: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockPollingFn = vi.fn().mockReturnValue(of('Mocked Data'));
    mockParamsBuilder = vi.fn().mockReturnValue({param: 'value'});
  });

  it('should call pollingFn with correct params and return data', async () => {
    const interval = 1000;
    const forceRefresh = of(null);

    poll({interval, pollingFn: mockPollingFn, paramsBuilder: mockParamsBuilder, forceRefresh})
      .pipe(take(1))
      .subscribe((state) => {
        expect(state).toEqual({status: 'loading', isLoading: true, error: null, data: null});
      });

    TestBed.tick();
    await vi.advanceTimersByTimeAsync(interval + 50);
    TestBed.tick();
    expect(mockPollingFn).toHaveBeenCalledWith({param: 'value'});
  });

  it('should handle initial trigger emissions', async () => {
    const interval = 1000;
    const forceRefresh = of('trigger');

    poll({interval, pollingFn: mockPollingFn, paramsBuilder: mockParamsBuilder, forceRefresh})
      .pipe(take(1))
      .subscribe((state: AsyncState<unknown, Error>) => {
        expect(state).toEqual({status: 'loading', isLoading: true, error: null, data: null});
      });

    TestBed.tick();
    await vi.advanceTimersByTimeAsync(interval + 50);
    TestBed.tick();
    expect(mockPollingFn).toHaveBeenCalledWith({param: 'value'});
  });

  it('should work without forceRefresh (timer only)', async () => {
    const interval = 100;
    const states: AsyncState<string>[] = [];

    poll({
      interval,
      pollingFn: () => of('Timer Data'),
      initialValue: {status: 'loading', isLoading: true, error: null, data: null},
    })
      .pipe(take(2))
      .subscribe((state) => {
        states.push(state);
      });

    TestBed.tick();
    await vi.advanceTimersByTimeAsync(0);
    TestBed.tick(); // Initial value
    expect(states[0]).toEqual({status: 'loading', isLoading: true, error: null, data: null});

    TestBed.tick();
    await vi.advanceTimersByTimeAsync(interval);
    TestBed.tick(); // First timer emission
    expect(states[1]).toEqual({status: 'resolved', isLoading: false, error: null, data: 'Timer Data'});
  });

  it('should work without paramsBuilder', async () => {
    const interval = 100;
    const forceRefresh = of({param: 'direct'});
    const states: AsyncState<string>[] = [];

    poll({interval, pollingFn: (params: {param: string}) => of(`Data: ${params.param}`), forceRefresh})
      .pipe(take(2))
      .subscribe((state) => {
        states.push(state);
      });

    TestBed.tick();
    await vi.advanceTimersByTimeAsync(0);
    TestBed.tick();
    expect(states[0]).toEqual({status: 'loading', isLoading: true, error: null, data: null});

    TestBed.tick();
    await vi.advanceTimersByTimeAsync(interval);
    TestBed.tick();
    expect(states[1]).toEqual({status: 'resolved', isLoading: false, error: null, data: 'Data: direct'});
  });

  it('should handle Promise return values', async () => {
    const interval = 100;
    const forceRefresh = of(null);
    const states: AsyncState<string>[] = [];

    poll({
      interval,
      pollingFn: () => Promise.resolve('Promise Data'),
      forceRefresh,
    })
      .pipe(take(2))
      .subscribe((state) => {
        states.push(state);
      });

    TestBed.tick();
    await vi.advanceTimersByTimeAsync(0);
    TestBed.tick();
    expect(states[0]).toEqual({status: 'loading', isLoading: true, error: null, data: null});

    TestBed.tick();
    await vi.advanceTimersByTimeAsync(interval);
    TestBed.tick();
    expect(states[1]).toEqual({status: 'resolved', isLoading: false, error: null, data: 'Promise Data'});
  });

  it('should handle primitive return values', async () => {
    const interval = 100;
    const forceRefresh = of(null);
    const states: AsyncState<string>[] = [];

    poll({
      interval,
      pollingFn: () => 'Primitive Data',
      forceRefresh,
    })
      .pipe(take(2))
      .subscribe((state) => {
        states.push(state);
      });

    TestBed.tick();
    await vi.advanceTimersByTimeAsync(0);
    TestBed.tick();
    expect(states[0]).toEqual({status: 'loading', isLoading: true, error: null, data: null});

    TestBed.tick();
    await vi.advanceTimersByTimeAsync(interval);
    TestBed.tick();
    expect(states[1]).toEqual({status: 'resolved', isLoading: false, error: null, data: 'Primitive Data'});
  });

  it('should handle errors', async () => {
    const interval = 100;
    const forceRefresh = of(null);
    const error = new Error('Test error');
    const states: AsyncState<string>[] = [];

    poll({
      interval,
      pollingFn: () => throwError(() => error),
      forceRefresh,
    })
      .pipe(take(2))
      .subscribe((state) => {
        states.push(state);
      });

    TestBed.tick();
    await vi.advanceTimersByTimeAsync(0);
    TestBed.tick();
    expect(states[0]).toEqual({status: 'loading', isLoading: true, error: null, data: null});

    TestBed.tick();
    await vi.advanceTimersByTimeAsync(interval);
    TestBed.tick();
    expect(states[1]).toEqual({status: 'error', isLoading: false, error, data: null});
  });

  it('should work with delay option', async () => {
    const interval = 100;
    const delay = 50;
    const states: AsyncState<string>[] = [];

    poll({
      interval,
      delay,
      pollingFn: () => of('Delayed Data'),
      initialValue: {status: 'loading', isLoading: true, error: null, data: null},
    })
      .pipe(take(2))
      .subscribe((state) => {
        states.push(state);
      });

    TestBed.tick();
    await vi.advanceTimersByTimeAsync(delay);
    TestBed.tick(); // Wait for delay to pass, then initial value is emitted
    expect(states[0]).toEqual({status: 'loading', isLoading: true, error: null, data: null});

    TestBed.tick();
    await vi.advanceTimersByTimeAsync(interval);
    TestBed.tick(); // Wait for first timer emission
    expect(states[1]).toEqual({status: 'resolved', isLoading: false, error: null, data: 'Delayed Data'});
  });

  it('should use paramsBuilder when provided', async () => {
    const interval = 100;
    const forceRefresh = of('input');
    const states: AsyncState<string>[] = [];

    poll({
      interval,
      pollingFn: (params: string) => of(`Built: ${params}`),
      forceRefresh,
      paramsBuilder: (input: string) => `transformed-${input}`,
    })
      .pipe(take(2))
      .subscribe((state) => {
        states.push(state);
      });

    TestBed.tick();
    await vi.advanceTimersByTimeAsync(0);
    TestBed.tick();
    expect(states[0]).toEqual({status: 'loading', isLoading: true, error: null, data: null});

    TestBed.tick();
    await vi.advanceTimersByTimeAsync(interval);
    TestBed.tick();
    expect(states[1]).toEqual({status: 'resolved', isLoading: false, error: null, data: 'Built: transformed-input'});
  });

  it('should handle first request without forceRefresh', async () => {
    const interval = 100;
    const states: AsyncState<string>[] = [];

    poll({
      interval,
      pollingFn: () => of('First Request Data'),
    })
      .pipe(take(2))
      .subscribe((state) => {
        states.push(state);
      });

    TestBed.tick();
    await vi.advanceTimersByTimeAsync(0);
    TestBed.tick();
    expect(states[0]).toEqual({status: 'loading', isLoading: true, error: null, data: null});

    TestBed.tick();
    await vi.advanceTimersByTimeAsync(interval);
    TestBed.tick();
    expect(states[1]).toEqual({status: 'resolved', isLoading: false, error: null, data: 'First Request Data'});
  });

  it('should handle paramsBuilder with undefined inputByForceRefresh', async () => {
    const interval = 100;
    const forceRefresh = of(null);
    const states: AsyncState<string>[] = [];

    poll({
      interval,
      pollingFn: (params: string) => of(`Params: ${params}`),
      forceRefresh,
      paramsBuilder: () => 'default-params',
    })
      .pipe(take(2))
      .subscribe((state) => {
        states.push(state);
      });

    TestBed.tick();
    await vi.advanceTimersByTimeAsync(0);
    TestBed.tick();
    expect(states[0]).toEqual({status: 'loading', isLoading: true, error: null, data: null});

    TestBed.tick();
    await vi.advanceTimersByTimeAsync(interval);
    TestBed.tick();
    expect(states[1]).toEqual({status: 'resolved', isLoading: false, error: null, data: 'Params: default-params'});
  });

  it('should handle timer trigger without forceRefresh and without paramsBuilder', async () => {
    const interval = 100;
    const states: AsyncState<string>[] = [];

    poll({
      interval,
      pollingFn: () => of('Timer: no params'),
      initialValue: {status: 'loading', isLoading: true, error: null, data: null},
    })
      .pipe(take(2))
      .subscribe((state) => {
        states.push(state);
      });

    TestBed.tick();
    await vi.advanceTimersByTimeAsync(0);
    TestBed.tick();
    expect(states[0]).toEqual({status: 'loading', isLoading: true, error: null, data: null});

    TestBed.tick();
    await vi.advanceTimersByTimeAsync(interval);
    TestBed.tick();
    expect(states[1]).toEqual({status: 'resolved', isLoading: false, error: null, data: 'Timer: no params'});
  });

  it('should handle manual trigger without paramsBuilder', async () => {
    const interval = 100;
    const forceRefresh = of({id: 123});
    const states: AsyncState<string>[] = [];

    poll({
      interval,
      pollingFn: (params: {id: number}) => of(`Direct: ${JSON.stringify(params)}`),
      forceRefresh,
    })
      .pipe(take(2))
      .subscribe((state) => {
        states.push(state);
      });

    TestBed.tick();
    await vi.advanceTimersByTimeAsync(0);
    TestBed.tick();
    expect(states[0]).toEqual({status: 'loading', isLoading: true, error: null, data: null});

    TestBed.tick();
    await vi.advanceTimersByTimeAsync(interval);
    TestBed.tick();
    expect(states[1]).toEqual({status: 'resolved', isLoading: false, error: null, data: 'Direct: {"id":123}'});
  });
});
