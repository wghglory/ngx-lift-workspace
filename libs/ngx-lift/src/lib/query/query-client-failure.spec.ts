import {Observable, of, throwError} from 'rxjs';
import {afterEach, describe, expect, it, vi} from 'vitest';

import {QuerySnapshot} from './query.models';
import {QueryClient} from './query-client';

describe('query callback failure isolation', () => {
  const clients: QueryClient[] = [];
  afterEach(() => {
    for (const client of clients.splice(0)) client.destroy();
    vi.restoreAllMocks();
  });

  it.each(['idle', 'loading', 'resolved', 'error'] as const)(
    'keeps transport and peer notifications intact when a listener throws during %s',
    async (phase) => {
      const diagnostic = vi.fn();
      const client = new QueryClient({onDiagnostic: diagnostic});
      clients.push(client);
      const uiError = new Error('UI listener failed');
      const transportError = new Error('server unavailable');
      const loader = vi.fn(() => (phase === 'error' ? throwError(() => transportError) : of(42)));
      const definition = {key: ['callback-failure', phase], loader, staleTime: Infinity};
      client.observeQuery(definition, (snapshot) => {
        if (snapshot.status === phase) throw uiError;
      });
      const snapshots: QuerySnapshot<number>[] = [];
      client.observeQuery(definition, (snapshot) => snapshots.push(snapshot));
      const result = client.fetchQuery(definition);
      if (phase === 'error') await expect(result).rejects.toBe(transportError);
      else await expect(result).resolves.toBe(42);
      expect(loader).toHaveBeenCalledTimes(1);
      expect(snapshots.at(-1)?.status).toBe(phase === 'error' ? 'error' : 'resolved');
      expect(diagnostic).toHaveBeenCalledWith(uiError, {key: definition.key, phase: 'observer'});
    },
  );

  it('destroys every pending transport despite removal-listener and reporter failures', async () => {
    const host = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const client = new QueryClient({
      onDiagnostic: () => {
        throw new Error('reporter failed');
      },
    });
    clients.push(client);
    const cleanup = vi.fn();
    for (const id of [1, 2]) {
      let loading = false;
      client.observeQuery(
        {key: ['remove-callback', id], loader: () => new Observable<number>(() => cleanup)},
        (snapshot) => {
          if (snapshot.status === 'loading') loading = true;
          if (loading && snapshot.status === 'idle') throw new Error('removal listener failed');
        },
      );
    }
    expect(() => client.destroy()).not.toThrow();
    expect(cleanup).toHaveBeenCalledTimes(2);
    expect(client.getSnapshot(['remove-callback', 1])).toBeUndefined();
    expect(client.getSnapshot(['remove-callback', 2])).toBeUndefined();
    expect(host).toHaveBeenCalled();
  });
});
