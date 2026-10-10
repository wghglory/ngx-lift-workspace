import {describe, expect, it} from 'vitest';

import {ActivatedRouteMock} from './activated-route.mock';

describe('ActivatedRouteMock', () => {
  it('should provide reactive params and snapshot maps', () => {
    const route = new ActivatedRouteMock();
    let currentParams: Record<string, string> = {};

    route.params.subscribe((p) => {
      currentParams = p;
    });

    route.setParams({clusterId: 'c-100'});

    expect(currentParams).toEqual({clusterId: 'c-100'});
    expect(route.snapshot.paramMap.get('clusterId')).toBe('c-100');
    expect(route.snapshot.paramMap.has('clusterId')).toBe(true);
    expect(route.snapshot.paramMap.get('unknown')).toBeNull();
  });

  it('should provide reactive queryParams and snapshot maps', () => {
    const route = new ActivatedRouteMock();
    let currentQueryParams: Record<string, string> = {};

    route.queryParams.subscribe((qp) => {
      currentQueryParams = qp;
    });

    route.setQueryParams({tab: 'backups', page: '2'});

    expect(currentQueryParams).toEqual({tab: 'backups', page: '2'});
    expect(route.snapshot.queryParamMap.get('tab')).toBe('backups');
    expect(route.snapshot.queryParamMap.has('tab')).toBe(true);
    expect(route.snapshot.queryParamMap.get('nonexistent')).toBeNull();
  });
});
