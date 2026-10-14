import {Observable, of, throwError} from 'rxjs';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {QueryClientOptions} from './query.models';
import {QueryClient} from './query-client';

async function settle() {
  for (let i = 0; i < 16; i++) await Promise.resolve();
}

describe('QueryClient diagnostic snapshots', () => {
  const clients: QueryClient[] = [];
  const createClient = (options: QueryClientOptions = {}) => {
    const client = new QueryClient(options);
    clients.push(client);
    return client;
  };
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
  });
  afterEach(() => {
    clients.splice(0).forEach((client) => client.destroy());
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it.each(['entries', 'aggregate'] as const)(
    'samples one clock and visibility for a complete %s snapshot',
    async (kind) => {
      const now = vi.fn(() => 0);
      const visible = vi.fn(() => true);
      const client = createClient({now, isVisible: visible});
      for (const id of [1, 2]) {
        await client.fetchQuery({key: ['clock', id], loader: () => of(id), staleTime: 10, gcTime: 10});
      }
      let time = 9;
      now.mockReset().mockImplementation(() => time++);
      visible.mockReset().mockReturnValueOnce(true).mockReturnValue(false);
      const entries = kind === 'entries' ? client.getEntriesSnapshot() : client.getDiagnostics().entries;
      expect(now).toHaveBeenCalledTimes(1);
      expect(visible).toHaveBeenCalledTimes(1);
      expect(entries).toHaveLength(2);
      for (const entry of entries) expect(entry).toMatchObject({isStale: false, remainingGcTime: 1});
    },
  );

  it('reports retry waits as pending logical reads with no active Observable transport', async () => {
    let active = 0;
    let calls = 0;
    const client = createClient();
    const request = client.fetchQuery({
      key: ['backoff'],
      loader: () =>
        new Observable<string>((subscriber) => {
          active++;
          if (++calls === 1) subscriber.error(new Error('temporary'));
          else subscriber.next('recovered');
          return () => active--;
        }),
      retry: {maxAttempts: 2, shouldRetry: () => true, delayMs: 100},
    });
    await settle();
    expect(active).toBe(0);
    expect(client.getDiagnostics()).toMatchObject({pendingRequestCount: 1});
    expect(client.getEntriesSnapshot()[0]).toMatchObject({
      requestCount: 1,
      isPending: true,
      failureCount: 1,
      nextRetryAt: 100,
    });
    await vi.advanceTimersByTimeAsync(100);
    await expect(request).resolves.toBe('recovered');
    expect(client.getEntriesSnapshot()[0]).toMatchObject({
      requestCount: 0,
      isPending: false,
      failureCount: 0,
      nextRetryAt: null,
    });
    expect(active).toBe(0);
  });

  it('counts an obsolete retry wait after the current generation has resolved', async () => {
    let calls = 0;
    const client = createClient();
    const definition = {
      key: ['obsolete-retry'],
      tags: [{type: 'Retry'}],
      loader: () => (++calls === 1 ? throwError(() => new Error('temporary')) : of(`result-${calls}`)),
      retry: {maxAttempts: 2, shouldRetry: () => true, delayMs: 100},
    };
    const obsolete = client.fetchQuery(definition);
    await settle();
    client.invalidateTags([{type: 'Retry'}]);
    const current = client.fetchQuery(definition);
    expect(client.getDiagnostics().pendingRequestCount).toBe(2);
    await expect(current).resolves.toBe('result-2');
    expect(client.getEntriesSnapshot()[0]).toMatchObject({
      requestCount: 1,
      isPending: false,
      failureCount: 0,
      nextRetryAt: null,
    });
    await vi.advanceTimersByTimeAsync(100);
    await expect(obsolete).resolves.toBe('result-3');
    expect(client.getDiagnostics().pendingRequestCount).toBe(0);
    expect(client.getSnapshot(definition.key)?.value).toBe('result-2');
  });

  it.each(['remove', 'destroy'] as const)(
    'drops removed entries from diagnostics and aborts retry work on %s',
    async (action) => {
      const client = createClient();
      const loader = vi.fn(() => throwError(() => new Error('temporary')));
      const request = client.fetchQuery({
        key: ['dispose-retry'],
        loader,
        retry: {maxAttempts: 2, shouldRetry: () => true, delayMs: 100},
      });
      await settle();
      expect(client.getDiagnostics().pendingRequestCount).toBe(1);
      if (action === 'remove') client.removeQueries();
      else client.destroy();
      expect(client.getDiagnostics()).toMatchObject({entryCount: 0, pendingRequestCount: 0, entries: []});
      await expect(request).rejects.toMatchObject({name: 'AbortError'});
      await vi.advanceTimersByTimeAsync(100);
      expect(loader).toHaveBeenCalledTimes(1);
    },
  );
});
