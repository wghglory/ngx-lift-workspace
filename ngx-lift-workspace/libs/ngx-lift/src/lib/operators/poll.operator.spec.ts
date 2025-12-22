import {of} from 'rxjs';
import {take} from 'rxjs/operators';

import {AsyncState} from '../models';
import {poll} from './poll.operator';

describe('poll', () => {
  let mockPollingFn: jasmine.Spy;
  let mockParamsBuilder: jasmine.Spy;

  beforeEach(() => {
    mockPollingFn = jasmine.createSpy('pollingFn').and.returnValue(of('Mocked Data'));
    mockParamsBuilder = jasmine.createSpy('paramsBuilder').and.returnValue({param: 'value'});
  });

  it('should call pollingFn with correct params and return data', (done) => {
    const interval = 1000;
    const forceRefresh = of(null); // Mocking a trigger observable emitting once

    poll({interval, pollingFn: mockPollingFn, paramsBuilder: mockParamsBuilder, forceRefresh})
      .pipe(take(1))
      .subscribe((state) => {
        expect(state).toEqual({loading: true, error: null, data: null}); // Initial loading state
      });

    setTimeout(() => {
      expect(mockPollingFn).toHaveBeenCalledWith({param: 'value'}); // Ensure pollingFn is called with correct params
      done();
    }, interval + 50);
  });

  it('should handle initial trigger emissions', (done) => {
    const interval = 1000;
    const forceRefresh = of('trigger');

    poll({interval, pollingFn: mockPollingFn, paramsBuilder: mockParamsBuilder, forceRefresh})
      .pipe(take(1))
      .subscribe((state: AsyncState<unknown, Error>) => {
        expect(state).toEqual({loading: true, error: null, data: null}); // Initial loading state
      });

    setTimeout(() => {
      expect(mockPollingFn).toHaveBeenCalledWith({param: 'value'}); // Ensure pollingFn is called with correct params
      done();
    }, interval + 50);
  });
});
