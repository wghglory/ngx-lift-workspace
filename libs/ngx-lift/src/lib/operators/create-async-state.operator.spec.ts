import {last, lastValueFrom, of, takeLast, throwError} from 'rxjs';
import {vi} from 'vitest';

import {createAsyncState} from './create-async-state.operator';

describe('createAsyncState', () => {
  it('should transform Observable data to AsyncState with default loading state', async () => {
    const data$ = of('test').pipe(createAsyncState());

    const result = await lastValueFrom(data$.pipe(last()));
    expect(result).toEqual({loading: false, error: null, data: 'test'});
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
    expect(result).toEqual({loading: false, error: null, data: 'test'});
  });

  it('should transform Observable data to AsyncState with custom loading state and catchError', async () => {
    const error$ = throwError(() => 'Error!');
    const data$ = error$.pipe(
      createAsyncState<unknown, string>({
        error: (err) => console.error(err),
      }),
    );

    const result = await lastValueFrom(data$.pipe(last()));
    expect(result).toEqual({loading: false, error: 'Error!', data: null});
  });
});
