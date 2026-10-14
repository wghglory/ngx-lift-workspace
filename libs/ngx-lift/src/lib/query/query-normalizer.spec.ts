import {EMPTY, EmptyError, Observable, of, Subject} from 'rxjs';
import {describe, expect, it} from 'vitest';

import {normalizeQueryResult} from './query-normalizer';
import {QueryClient} from './query-client';

describe('query result normalization', () => {
  it('makes a query retryable after a teardown failure rather than joining stuck work', async () => {
    const client = new QueryClient();
    try {
      const source = new Subject<number>();
      let fail = true;
      const definition = {
        key: ['cleanup-recovery'],
        loader: () =>
          fail
            ? new Observable<number>((subscriber) => {
                source.subscribe(subscriber);
                subscriber.add(() => {
                  throw new Error('cleanup failed');
                });
              })
            : of(7),
      };
      const result = client.fetchQuery(definition);
      const rejected = expect(result).rejects.toMatchObject({name: 'UnsubscriptionError'});
      source.next(42);
      await rejected;
      expect(client.getSnapshot(definition.key)?.status).toBe('error');
      fail = false;
      expect(await client.fetchQuery(definition)).toBe(7);
      expect(client.getSnapshot(definition.key)?.status).toBe('resolved');
    } finally {
      client.destroy();
    }
  });

  it('assimilates a custom PromiseLike result', async () => {
    const source: PromiseLike<number> = {
      then: (resolve, reject) => Promise.resolve(42).then(resolve, reject),
    };
    expect(
      await normalizeQueryResult(source, {
        abortSignal: new AbortController().signal,
        refresh: false,
      }),
    ).toBe(42);
  });
  it.each(['next', 'error', 'complete', 'abort'] as const)(
    'settles and releases the subscription when teardown throws during %s',
    async (event) => {
      const controller = new AbortController();
      const source = new Subject<number>();
      const cleanupError = new Error('cleanup failed');
      const sourceError = new Error('request failed');
      const result = normalizeQueryResult(
        new Observable<number>((subscriber) => {
          const subscription = source.subscribe(subscriber);
          subscription.add(() => {
            throw cleanupError;
          });
          return subscription;
        }),
        {abortSignal: controller.signal, refresh: false},
      );
      const failure =
        event === 'next'
          ? expect(result).rejects.toMatchObject({name: 'UnsubscriptionError'})
          : event === 'error'
            ? expect(result).rejects.toBe(sourceError)
            : event === 'complete'
              ? expect(result).rejects.toBeInstanceOf(EmptyError)
              : expect(result).rejects.toMatchObject({name: 'AbortError'});
      expect(() => {
        if (event === 'next') source.next(42);
        if (event === 'error') source.error(sourceError);
        if (event === 'complete') source.complete();
        if (event === 'abort') controller.abort();
      }).not.toThrow();
      await failure;
      expect(source.observed).toBe(false);
    },
  );

  it('takes only the first synchronous emission', async () => {
    expect(
      await normalizeQueryResult(of(1, 2), {
        abortSignal: new AbortController().signal,
        refresh: false,
      }),
    ).toBe(1);
  });

  it('rejects empty completion', async () => {
    await expect(
      normalizeQueryResult(EMPTY, {
        abortSignal: new AbortController().signal,
        refresh: false,
      }),
    ).rejects.toBeInstanceOf(EmptyError);
  });

  it('does not subscribe after an abort', async () => {
    const controller = new AbortController();
    controller.abort();
    let subscriptions = 0;
    const source = new Observable<number>(() => {
      subscriptions++;
    });
    await expect(
      normalizeQueryResult(source, {
        abortSignal: controller.signal,
        refresh: false,
      }),
    ).rejects.toMatchObject({name: 'AbortError'});
    expect(subscriptions).toBe(0);
  });
});
