import {last, of, takeLast, throwError} from 'rxjs';

import {createAsyncState} from './create-async-state.operator';

describe('createAsyncState', () => {
  it('should transform Observable data to AsyncState with default loading state', (done) => {
    const data$ = of('test').pipe(createAsyncState());

    data$.pipe(last()).subscribe((result) => {
      expect(result).toEqual({loading: false, error: null, data: 'test'});
      done();
    });
  });

  it('should handle side effects using tap for successful data', (done) => {
    const sideEffectSpy = jasmine.createSpy('sideEffectSpy');

    const data$ = of('test').pipe(
      createAsyncState({
        next: sideEffectSpy,
      }),
    );

    data$.pipe(last()).subscribe(() => {
      expect(sideEffectSpy).toHaveBeenCalledWith('test');
      done();
    });
  });

  it('should handle side effects using tap for error case', (done) => {
    const errorCallbackSpy = jasmine.createSpy('errorCallbackSpy');
    const error$ = throwError(() => new Error('Error!'));

    const data$ = error$.pipe(
      createAsyncState({
        error: errorCallbackSpy,
      }),
    );

    data$.pipe(last()).subscribe(() => {
      expect(errorCallbackSpy).toHaveBeenCalledWith(new Error('Error!'));
      done();
    });
  });

  it('should transform Observable data to AsyncState with custom loading state', (done) => {
    const data$ = of('test').pipe(
      createAsyncState({
        next: (value) => console.log(value),
      }),
    );

    data$.pipe(takeLast(1)).subscribe((result) => {
      expect(result).toEqual({loading: false, error: null, data: 'test'});
      done();
    });
  });

  it('should transform Observable data to AsyncState with custom loading state and catchError', (done) => {
    const error$ = throwError(() => 'Error!');
    const data$ = error$.pipe(
      createAsyncState<unknown, string>({
        error: (err) => console.error(err),
      }),
    );

    data$.pipe(last()).subscribe((result) => {
      expect(result).toEqual({loading: false, error: 'Error!', data: null});
      done();
    });
  });
});
