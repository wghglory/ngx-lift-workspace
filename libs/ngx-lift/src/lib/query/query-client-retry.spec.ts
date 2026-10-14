import {Observable, of, throwError} from 'rxjs';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {QueryClientOptions, QueryRetryOptions, QuerySnapshot} from './query.models';
import {QueryClient} from './query-client';
import {QueryTimeoutError} from './query-errors';

const retry: QueryRetryOptions = {maxAttempts: 3, shouldRetry: () => true, delayMs: 10};
async function flush() {
  for (let i = 0; i < 12; i++) await Promise.resolve();
}

describe('shared query recovery', () => {
  const clients: QueryClient[] = [];
  const create = (options: QueryClientOptions = {}) => {
    const client = new QueryClient({elapsedNow: () => Date.now(), ...options});
    clients.push(client);
    return client;
  };
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
  });
  afterEach(async () => {
    clients.splice(0).forEach((client) => client.destroy());
    await flush();
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it.each(['Observable', 'Promise'] as const)(
    'retries %s factories and shares attempts with concurrent readers',
    async (transport) => {
      const onQueryError = vi.fn();
      const client = create({onQueryError});
      const failure = new Error('temporary failure');
      let calls = 0;
      const loader = vi.fn(() => {
        const fail = ++calls < 3;
        return transport === 'Observable'
          ? fail
            ? throwError(() => failure)
            : of(42)
          : fail
            ? Promise.reject(failure)
            : Promise.resolve(42);
      });
      const definition = {key: ['retry', transport], loader, retry};
      const first = client.fetchQuery(definition);
      expect(client.fetchQuery(definition)).toBe(first);
      await flush();
      expect(client.getSnapshot(definition.key)).toMatchObject({
        status: 'loading',
        failureCount: 1,
        failureReason: failure,
        nextRetryAt: 10,
      });
      await vi.advanceTimersByTimeAsync(20);
      await expect(first).resolves.toBe(42);
      expect(loader).toHaveBeenCalledTimes(3);
      expect(client.getSnapshot(definition.key)).toMatchObject({
        status: 'resolved',
        failureCount: 0,
        failureReason: null,
        nextRetryAt: null,
      });
      expect(onQueryError).not.toHaveBeenCalled();
    },
  );

  it('uses the initiating policy and loader despite different same-key joiners', async () => {
    const client = create({queryDefaults: {retry}});
    const loader = vi.fn().mockRejectedValueOnce(new Error('transient')).mockResolvedValue(7);
    const definition = {key: ['frozen-policy'], loader};
    const first = client.fetchQuery(definition);
    await flush();
    const otherLoader = vi.fn(async () => 99);
    expect(client.fetchQuery({...definition, loader: otherLoader, retry: false})).toBe(first);
    await vi.advanceTimersByTimeAsync(10);
    await expect(first).resolves.toBe(7);
    expect(otherLoader).not.toHaveBeenCalled();
    await expect(client.fetchQuery({...definition, retry: false}, {refresh: true})).resolves.toBe(7);
    expect(loader).toHaveBeenCalledTimes(3);
  });

  it('reports each failed logical read once rather than once per observer or generation', async () => {
    const report = vi.fn();
    const client = create({onQueryError: report});
    const error = new Error('unavailable');
    const definition = {
      key: ['error-events'],
      loader: () => throwError(() => error),
      retry: {...retry, maxAttempts: 2},
    };
    client.observeQuery(definition, () => undefined);
    client.observeQuery(definition, () => undefined);
    const first = client.fetchQuery(definition);
    const failed = expect(first).rejects.toBe(error);
    await vi.advanceTimersByTimeAsync(10);
    await failed;
    expect(report).toHaveBeenCalledTimes(1);
    expect(report).toHaveBeenLastCalledWith(error, {
      key: definition.key,
      attemptCount: 2,
      hasValue: false,
      trigger: 'initial',
    });
    const second = expect(client.fetchQuery(definition)).rejects.toBe(error);
    await vi.advanceTimersByTimeAsync(10);
    await second;
    expect(report).toHaveBeenCalledTimes(2);
    expect(report.mock.calls[1][1].trigger).toBe('manual');
  });

  it('lets superseded callers finish retries without overwriting new state', async () => {
    const report = vi.fn();
    const client = create({onQueryError: report});
    const oldLoader = vi.fn().mockRejectedValueOnce(new Error('transient')).mockResolvedValue('old');
    const definition = {
      key: ['superseded-retry'],
      tags: [{type: 'Item'}],
      loader: oldLoader,
      retry,
      staleTime: Infinity,
    };
    const observer = client.observeQuery(definition, () => undefined);
    const old = client.fetchQuery(definition);
    await flush();
    observer.updateDefinition({...definition, loader: async () => 'new', retry: false});
    client.invalidateTags(definition.tags);
    await flush();
    expect(client.getSnapshot(definition.key)).toMatchObject({value: 'new', failureCount: 0});
    await vi.advanceTimersByTimeAsync(10);
    await expect(old).resolves.toBe('old');
    expect(client.getSnapshot(definition.key)).toMatchObject({value: 'new', failureCount: 0, nextRetryAt: null});
    expect(report).not.toHaveBeenCalled();
  });

  it('cancels backoff timers on removal without reporting a lifecycle failure', async () => {
    const report = vi.fn();
    const client = create({onQueryError: report});
    const loader = vi.fn(() => throwError(() => new Error('temporary')));
    const promise = client.fetchQuery({key: ['cancel-retry'], loader, retry, deadlineMs: 100});
    const rejected = expect(promise).rejects.toMatchObject({name: 'AbortError'});
    await flush();
    client.removeQueries();
    await rejected;
    await vi.advanceTimersByTimeAsync(100);
    expect(loader).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
    expect(report).not.toHaveBeenCalled();
  });

  it.each(['Observable', 'Promise'] as const)('bounds a hung %s and isolates late responses', async (transport) => {
    const report = vi.fn();
    const client = create({onQueryError: report});
    let resolveLate!: (value: number) => void;
    const cleanup = vi.fn();
    const definition = {
      key: ['deadline', transport],
      deadlineMs: 20,
      loader: () =>
        transport === 'Observable'
          ? new Observable<number>(() => cleanup)
          : new Promise<number>((resolve) => {
              resolveLate = resolve;
            }),
    };
    const promise = client.fetchQuery(definition);
    const rejected = expect(promise).rejects.toBeInstanceOf(QueryTimeoutError);
    await vi.advanceTimersByTimeAsync(20);
    await rejected;
    expect(client.getSnapshot(definition.key)).toMatchObject({
      status: 'error',
      hasValue: false,
      failureCount: 0,
      nextRetryAt: null,
    });
    if (transport === 'Observable') expect(cleanup).toHaveBeenCalledTimes(1);
    else {
      resolveLate(99);
      await flush();
      expect(client.getSnapshot(definition.key)?.hasValue).toBe(false);
    }
    expect(report).toHaveBeenCalledTimes(1);
    expect(report.mock.calls[0][1].attemptCount).toBe(1);
  });

  it('checks elapsed time before accepting success even before the deadline timer runs', async () => {
    let elapsed = 0;
    const client = create({elapsedNow: () => elapsed});
    const promise = client.fetchQuery({
      key: ['delayed-timer'],
      deadlineMs: 20,
      loader: () => {
        elapsed = 21;
        return of(7);
      },
    });
    await expect(promise).rejects.toBeInstanceOf(QueryTimeoutError);
    expect(client.getSnapshot(['delayed-timer'])?.hasValue).toBe(false);
  });

  it('counts loading publication in the deadline without dispatching expired transport', async () => {
    let elapsed = 0;
    const client = create({elapsedNow: () => elapsed});
    const loader = vi.fn(() => of(42));
    const definition = {key: ['slow-notification'], loader, deadlineMs: 10};
    client.observeQuery(definition, (snapshot) => {
      if (snapshot.status === 'loading') elapsed = 100;
    });
    await expect(client.fetchQuery(definition)).rejects.toBeInstanceOf(QueryTimeoutError);
    expect(loader).not.toHaveBeenCalled();
  });

  it('checks the deadline again at cache publication after transport has already resolved', async () => {
    let elapsed = 0;
    const client = create({elapsedNow: () => elapsed});
    const result = client.fetchQuery({key: ['late-publication'], loader: () => of(42), deadlineMs: 20});
    await Promise.resolve();
    elapsed = 21;
    await expect(result).rejects.toBeInstanceOf(QueryTimeoutError);
    expect(client.getSnapshot(['late-publication'])?.hasValue).toBe(false);
  });

  it.each(['predicate', 'delay', 'progress', 'backoff'] as const)(
    'rechecks deadlines after %s callbacks consume the budget',
    async (phase) => {
      let elapsed = 0;
      const client = create({elapsedNow: () => elapsed});
      const original = new Error('request failed');
      const loader = vi.fn(() => throwError(() => original));
      const definition = {
        key: ['slow-callback', phase],
        deadlineMs: 10,
        loader,
        retry: {
          maxAttempts: 2,
          shouldRetry: () => {
            if (phase === 'predicate') elapsed = 11;
            return true;
          },
          delayMs: () => {
            if (phase === 'delay') elapsed = 11;
            return 0;
          },
        },
      };
      client.observeQuery(definition, (snapshot) => {
        if (phase === 'progress' && snapshot.failureCount > 0 && snapshot.nextRetryAt === null) elapsed = 11;
        if (phase === 'backoff' && snapshot.nextRetryAt !== null) elapsed = 11;
      });
      const failed = expect(client.fetchQuery(definition)).rejects.toBeInstanceOf(QueryTimeoutError);
      await vi.advanceTimersByTimeAsync(0);
      await failed;
      expect(loader).toHaveBeenCalledTimes(1);
      expect(client.getSnapshot(definition.key)?.status).toBe('error');
      expect(client.getSnapshot(definition.key)?.error).toMatchObject({cause: original});
      expect(client.getSnapshot(definition.key)?.failureCount).toBe(1);
    },
  );

  it('clears visible retry metadata after unobserved invalidation while old callers still complete', async () => {
    const client = create();
    const loader = vi.fn().mockRejectedValueOnce(new Error('transient')).mockResolvedValue(7);
    const definition = {key: ['unobserved-invalidation'], loader, tags: [{type: 'Item'}], retry};
    const old = client.fetchQuery(definition);
    await flush();
    client.invalidateTags(definition.tags);
    expect(client.getSnapshot(definition.key)).toMatchObject({
      status: 'idle',
      failureCount: 0,
      failureReason: null,
      nextRetryAt: null,
    });
    await vi.advanceTimersByTimeAsync(10);
    await expect(old).resolves.toBe(7);
    expect(client.getSnapshot(definition.key)?.hasValue).toBe(false);
  });

  it('isolates async observer, error-reporter, and diagnostic rejections', async () => {
    const host = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const client = create({
      onQueryError: async () => {
        throw new Error('async reporter failed');
      },
      onDiagnostic: async () => {
        throw new Error('async diagnostic failed');
      },
    });
    const original = new Error('server failed');
    const definition = {key: ['async-callbacks'], loader: () => Promise.reject(original)};
    client.observeQuery(definition, async () => {
      throw new Error('async UI failed');
    });
    await expect(client.fetchQuery(definition)).rejects.toBe(original);
    await flush();
    expect(host).toHaveBeenCalled();
    expect(client.getSnapshot(definition.key)?.error).toBe(original);
  });

  it('does not shorten a retry wait to fit a deadline and retains prior successful data', async () => {
    const client = create();
    const error = new Error('throttled');
    const loader = vi.fn().mockResolvedValueOnce('rows').mockRejectedValue(error);
    const definition = {
      key: ['retry-budget'],
      loader,
      retry: {...retry, delayMs: 100},
      deadlineMs: 20,
      staleTime: Infinity,
    };
    await client.fetchQuery(definition);
    await expect(client.fetchQuery(definition, {refresh: true})).rejects.toBe(error);
    expect(client.getSnapshot(definition.key)).toMatchObject({
      value: 'rows',
      hasValue: true,
      updatedAt: 0,
      status: 'error',
      failureCount: 1,
      nextRetryAt: null,
    });
    expect(loader).toHaveBeenCalledTimes(2);
  });

  it.each(['predicate', 'delay', 'NaN', 'Infinity', 'negative'] as const)(
    'settles the original failure after invalid %s policy behavior',
    async (kind) => {
      const diagnostic = vi.fn();
      const client = create({onDiagnostic: diagnostic});
      const error = new Error('request failed');
      const policyError = new Error('policy failed');
      const policy = {
        ...retry,
        shouldRetry: () => {
          if (kind === 'predicate') throw policyError;
          return true;
        },
        delayMs: () => {
          if (kind === 'delay') throw policyError;
          return kind === 'NaN' ? NaN : kind === 'Infinity' ? Infinity : -1;
        },
      };
      await expect(
        client.fetchQuery({key: ['bad-policy', kind], loader: () => Promise.reject(error), retry: policy}),
      ).rejects.toBe(error);
      expect(diagnostic).toHaveBeenCalledWith(expect.any(Error), {key: ['bad-policy', kind], phase: 'retry-policy'});
      expect(client.getSnapshot(['bad-policy', kind])).toMatchObject({failureCount: 1, nextRetryAt: null, error});
    },
  );

  it('validates static options before creating cache entries and permits disabling inherited retry', async () => {
    const client = create({queryDefaults: {retry}});
    const loader = vi.fn(() => Promise.reject(new Error('failed')));
    expect(() => client.fetchQuery({key: ['invalid'], loader, retry: {...retry, maxAttempts: 0}})).toThrow(RangeError);
    expect(() => client.fetchQuery({key: ['invalid'], loader, deadlineMs: Infinity})).toThrow(RangeError);
    expect(client.getSnapshot(['invalid'])).toBeUndefined();
    await expect(client.fetchQuery({key: ['disabled-retry'], loader, retry: false})).rejects.toThrow('failed');
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it('keeps polling behind the complete logical read, including retry backoff', async () => {
    const client = create();
    const loader = vi.fn<() => Promise<number>>().mockRejectedValueOnce(new Error('transient')).mockResolvedValue(42);
    const states: QuerySnapshot<number>[] = [];
    client.observeQuery({key: ['poll-retry'], loader, retry}, (snapshot) => states.push(snapshot), {pollInterval: 5});
    await vi.advanceTimersByTimeAsync(5);
    expect(loader).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(5);
    expect(loader).toHaveBeenCalledTimes(2);
    expect(states.at(-1)).toMatchObject({status: 'resolved', failureCount: 0});
    await vi.advanceTimersByTimeAsync(5);
    expect(loader).toHaveBeenCalledTimes(3);
  });
});
