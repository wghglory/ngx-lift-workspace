import {of, Subject, throwError} from 'rxjs';
import {afterEach, describe, expect, it, vi} from 'vitest';

import {QueryClient} from './query-client';

describe('QueryClient refetch by key', () => {
  const client = new QueryClient();
  afterEach(() => client.removeQueries());

  it('uses the latest registered loader, bypasses fresh data and updates existing observers only', async () => {
    const key = ['shared'];
    const original = vi.fn(() => of(1));
    await client.fetchQuery({key, loader: original, staleTime: Infinity});
    const updated = vi.fn(() => of(2));
    const values: unknown[] = [];
    const observer = client.observeQuery({key, loader: updated, staleTime: Infinity}, (state) =>
      values.push(state.value),
    );
    await expect(client.refetchQuery(key)).resolves.toBe(2);
    expect(original).toHaveBeenCalledTimes(1);
    expect(updated).toHaveBeenCalledTimes(1);
    expect(values.at(-1)).toBe(2);
    expect(client.getDiagnostics().totalObserverCount).toBe(1);
    observer();
  });

  it('joins pending work without creating an observer or starting a second request', async () => {
    const transport = new Subject<number>();
    const loader = vi.fn(() => transport);
    const initial = client.fetchQuery({key: ['pending'], loader});
    const refetch = client.refetchQuery(['pending']);
    expect(refetch).toBe(initial);
    transport.next(7);
    await expect(refetch).resolves.toBe(7);
    expect(loader).toHaveBeenCalledTimes(1);
    expect(client.getDiagnostics().totalObserverCount).toBe(0);
  });

  it('never creates a missing entry and rejects normal loader failures', async () => {
    expect(client.refetchQuery(['missing'])).toBeUndefined();
    expect(client.getDiagnostics().entryCount).toBe(0);
    let failing = false;
    await client.fetchQuery({
      key: ['failure'],
      loader: () => (failing ? throwError(() => new Error('offline')) : of('cached')),
    });
    failing = true;
    await expect(client.refetchQuery(['failure'])).rejects.toThrow('offline');
    expect(client.getSnapshot(['failure'])).toMatchObject({value: 'cached', status: 'error'});
  });

  it('keeps inactive refetches eligible for normal collection', async () => {
    vi.useFakeTimers();
    try {
      await client.fetchQuery({key: ['inactive'], loader: () => of(1), gcTime: 10});
      await client.refetchQuery(['inactive']);
      await vi.advanceTimersByTimeAsync(11);
      expect(client.getSnapshot(['inactive'])).toBeUndefined();
    } finally {
      vi.useRealTimers();
    }
  });

  it('extends garbage collection retention when refetching an inactive query near expiration', async () => {
    vi.useFakeTimers();
    try {
      await client.fetchQuery({key: ['near-expiry'], loader: () => of('initial'), gcTime: 100});
      await vi.advanceTimersByTimeAsync(90);
      const refetched: Promise<string> | undefined = client.refetchQuery<string>(['near-expiry']);
      await expect(refetched).resolves.toBe('initial');
      // 20ms later (110ms from initial fetch, but only 20ms after refetch): should still be cached
      await vi.advanceTimersByTimeAsync(20);
      expect(client.getSnapshot(['near-expiry'])).toBeDefined();
      // 90ms more (110ms after refetch): now it should be collected
      await vi.advanceTimersByTimeAsync(90);
      expect(client.getSnapshot(['near-expiry'])).toBeUndefined();
    } finally {
      vi.useRealTimers();
    }
  });

  it('protects a pending inactive read past retention, then collects it under the normal GC policy', async () => {
    vi.useFakeTimers();
    try {
      const transport = new Subject<string>();
      let refetching = false;
      const key = ['slow-inactive'];
      await client.fetchQuery({key, loader: () => (refetching ? transport : of('cached')), gcTime: 100});
      await vi.advanceTimersByTimeAsync(90);
      refetching = true;
      const request = client.refetchQuery<string>(key);
      await vi.advanceTimersByTimeAsync(110);
      expect(client.getSnapshot(key)?.status).toBe('reloading');
      transport.next('updated');
      await expect(request).resolves.toBe('updated');
      expect(client.getSnapshot(key)?.value).toBe('updated');
      await vi.advanceTimersByTimeAsync(0);
      expect(client.getSnapshot(key)).toBeUndefined();
    } finally {
      vi.useRealTimers();
    }
  });

  it('does not execute a loader after client destruction', () => {
    const destroyed = new QueryClient();
    destroyed.destroy();
    expect(() => destroyed.refetchQuery(['gone'])).toThrow();
  });
});
