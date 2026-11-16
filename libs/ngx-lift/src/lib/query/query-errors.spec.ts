import {describe, expect, it} from 'vitest';

import {QueryResourceDisabledError, QueryResourceDisposedError, QueryTimeoutError} from './query-errors';

describe('query errors', () => {
  it('carries the deadline and cause on timeout errors', () => {
    const cause = new Error('loader failed');
    const error = new QueryTimeoutError(5000, cause);
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('QueryTimeoutError');
    expect(error.message).toBe('Query deadline exceeded (5000 ms)');
    expect(error.deadlineMs).toBe(5000);
    expect(error.cause).toBe(cause);
  });

  it('uses stable names and default messages for lifecycle errors', () => {
    const disabled = new QueryResourceDisabledError();
    const disposed = new QueryResourceDisposedError('custom');
    expect(disabled.name).toBe('QueryResourceDisabledError');
    expect(disabled.message).toBe('Query resource is disabled');
    expect(disposed.name).toBe('QueryResourceDisposedError');
    expect(disposed.message).toBe('custom');
  });
});
