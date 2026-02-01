import {last, lastValueFrom, of, takeLast, throwError} from 'rxjs';
import {vi} from 'vitest';

import {createAsyncState} from './create-async-state.operator';

describe('createAsyncState', () => {
  it('should transform Observable data to AsyncState with default loading state', async () => {
    const data$ = of('test').pipe(createAsyncState());

    const result = await lastValueFrom(data$.pipe(last()));
    expect(result).toEqual({status: 'resolved', isLoading: false, error: null, data: 'test'});
  });

  it('should handle side effects using tap for successful data', async () => {
    const sideEffectSpy = vi.fn();

    const data$ = of('test').pipe(
      createAsyncState({
        next: sideEffectSpy,
      }),
    );

    await lastValueFrom(data$.pipe(last()));
    expect(sideEffectSpy).toHaveBeenCalledWith('test');
  });

  it('should handle side effects using tap for error case', async () => {
    const errorCallbackSpy = vi.fn();
    const error$ = throwError(() => new Error('Error!'));

    const data$ = error$.pipe(
      createAsyncState({
        error: errorCallbackSpy,
      }),
    );

    await lastValueFrom(data$.pipe(last()));
    expect(errorCallbackSpy).toHaveBeenCalledWith(new Error('Error!'));
  });

  it('should transform Observable data to AsyncState with custom loading state', async () => {
    const data$ = of('test').pipe(
      createAsyncState({
        next: (value) => console.log(value),
      }),
    );

    const result = await lastValueFrom(data$.pipe(takeLast(1)));
    expect(result).toEqual({status: 'resolved', isLoading: false, error: null, data: 'test'});
  });

  it('should transform Observable data to AsyncState with custom loading state and catchError', async () => {
    const error$ = throwError(() => 'Error!');
    const data$ = error$.pipe(
      createAsyncState<unknown, string>({
        error: (err) => console.error(err),
      }),
    );

    const result = await lastValueFrom(data$.pipe(last()));
    expect(result).toEqual({status: 'error', isLoading: false, error: 'Error!', data: null});
  });

  it('should emit loading state initially with status', async () => {
    const data$ = of('test').pipe(createAsyncState());
    const states: unknown[] = [];

    data$.subscribe((state) => states.push(state));

    expect(states[0]).toEqual({status: 'loading', isLoading: true, error: null, data: null});
    expect(states[1]).toEqual({status: 'resolved', isLoading: false, error: null, data: 'test'});
  });

  it('should support custom initial value with status', async () => {
    const data$ = of('test').pipe(
      createAsyncState(undefined, {status: 'idle', isLoading: false, error: null, data: 'initial'}),
    );
    const states: unknown[] = [];

    data$.subscribe((state) => states.push(state));

    expect(states[0]).toEqual({status: 'idle', isLoading: false, error: null, data: 'initial'});
    expect(states[1]).toEqual({status: 'resolved', isLoading: false, error: null, data: 'test'});
  });
});
