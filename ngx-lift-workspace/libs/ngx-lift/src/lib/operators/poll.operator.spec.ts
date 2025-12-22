import {of} from 'rxjs';
import {take} from 'rxjs/operators';
import {vi} from 'vitest';

import {AsyncState} from '../models';
import {poll} from './poll.operator';

describe('poll', () => {
  let mockPollingFn: ReturnType<typeof vi.fn>;
  let mockParamsBuilder: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockPollingFn = vi.fn().mockReturnValue(of('Mocked Data'));
    mockParamsBuilder = vi.fn().mockReturnValue({param: 'value'});
  });

  it('should call pollingFn with correct params and return data', async () => {
    const interval = 1000;
    const forceRefresh = of(null); // Mocking a trigger observable emitting once

    poll({interval, pollingFn: mockPollingFn, paramsBuilder: mockParamsBuilder, forceRefresh})
      .pipe(take(1))
      .subscribe((state) => {
        expect(state).toEqual({loading: true, error: null, data: null}); // Initial loading state
      });

    await new Promise((resolve) => {
      setTimeout(() => {
        expect(mockPollingFn).toHaveBeenCalledWith({param: 'value'}); // Ensure pollingFn is called with correct params
        resolve(undefined);
      }, interval + 50);
    });
  });

  it('should handle initial trigger emissions', async () => {
    const interval = 1000;
    const forceRefresh = of('trigger');

    poll({interval, pollingFn: mockPollingFn, paramsBuilder: mockParamsBuilder, forceRefresh})
      .pipe(take(1))
      .subscribe((state: AsyncState<unknown, Error>) => {
        expect(state).toEqual({loading: true, error: null, data: null}); // Initial loading state
      });

    await new Promise((resolve) => {
      setTimeout(() => {
        expect(mockPollingFn).toHaveBeenCalledWith({param: 'value'}); // Ensure pollingFn is called with correct params
        resolve(undefined);
      }, interval + 50);
    });
  });
});
