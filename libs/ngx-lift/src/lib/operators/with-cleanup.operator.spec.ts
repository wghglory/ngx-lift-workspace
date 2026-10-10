import {of, throwError} from 'rxjs';
import {describe, expect, it, vi} from 'vitest';

import type {ResourceState} from '../models/resource-state.model';
import {withCleanup} from './with-cleanup.operator';

describe('withCleanup operator', () => {
  it('should clean up superseded resources on success', () => {
    const deleteSpy = vi.fn(() => of(null));
    const resource: ResourceState = {
      name: 'new-secret',
      type: 'secret',
      isNew: true,
      replacedOldName: 'old-secret',
    };

    const projectFn = vi.fn(() => of({status: 'updated'}));

    of(resource)
      .pipe(withCleanup(projectFn, deleteSpy))
      .subscribe((result) => {
        expect(result).toEqual({status: 'updated'});
        expect(deleteSpy).toHaveBeenCalledWith({
          ...resource,
          name: 'old-secret',
        });
      });
  });

  it('should rollback new resources on inner error', () => {
    const deleteSpy = vi.fn(() => of(null));
    const resource: ResourceState = {
      name: 'new-secret',
      type: 'secret',
      isNew: true,
    };

    const projectFn = vi.fn(() => throwError(() => new Error('Patch error')));

    of(resource)
      .pipe(withCleanup(projectFn, deleteSpy))
      .subscribe({
        error: (err: Error) => {
          expect(err.message).toBe('Patch error');
          expect(deleteSpy).toHaveBeenCalledWith(resource);
        },
      });
  });
});
