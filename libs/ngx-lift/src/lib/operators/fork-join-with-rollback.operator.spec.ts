import {of, throwError} from 'rxjs';
import {describe, expect, it, vi} from 'vitest';

import type {ResourceState} from '../models/resource-state.model';
import {forkJoinWithRollback} from './fork-join-with-rollback.operator';

describe('forkJoinWithRollback operator', () => {
  const deleteSpy = vi.fn(() => of(null));

  it('should emit resolved array when all observables succeed', () => {
    const r1: ResourceState = {name: 'res-1', type: 'secret', isNew: true};
    const r2: ResourceState = {name: 'res-2', type: 'configMap', isNew: true};

    forkJoinWithRollback([of(r1), of(r2)], deleteSpy).subscribe((results) => {
      expect(results).toEqual([r1, r2]);
    });

    expect(deleteSpy).not.toHaveBeenCalled();
  });

  it('should rollback successful new resources when another observable errors', () => {
    deleteSpy.mockClear();
    const r1: ResourceState = {name: 'res-1', type: 'secret', isNew: true};
    const errorMsg = 'Failed to create res-2';

    forkJoinWithRollback([of(r1), throwError(() => new Error(errorMsg))], deleteSpy).subscribe({
      next: () => {
        throw new Error('Should not succeed');
      },
      error: (err: Error) => {
        expect(err.message).toBe(errorMsg);
        expect(deleteSpy).toHaveBeenCalledWith(r1);
      },
    });
  });

  it('should work with dictionary sources and rollback on error', () => {
    deleteSpy.mockClear();
    const r1: ResourceState = {name: 'secret-a', type: 'secret', isNew: true};

    forkJoinWithRollback(
      {
        secret: of(r1),
        failed: throwError(() => new Error('Creation failure')),
      },
      deleteSpy,
    ).subscribe({
      next: () => {
        throw new Error('Should not succeed');
      },
      error: () => {
        expect(deleteSpy).toHaveBeenCalledWith(r1);
      },
    });
  });
});
