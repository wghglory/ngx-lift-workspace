import {EMPTY, EmptyError, finalize, firstValueFrom, map, Observable, of, Subject} from 'rxjs';
import {describe, expect, it} from 'vitest';

import {normalizeQueryResult} from './query-normalizer';
import {QueryClient} from './query-client';

describe('query result normalization', () => {
  it.each(['map', 'finalize'] as const)(
    'matches firstValueFrom when RxJS %s suppresses cleanup errors',
    async (operator) => {
      let cleanups = 0;
      const cleanup = () => {
        cleanups++;
        throw new Error('operator cleanup failed');
      };
      const source =
        operator === 'map'
          ? new Observable<number>((subscriber) => {
              subscriber.next(42);
              return cleanup;
            }).pipe(map((value) => value))
          : of(42).pipe(finalize(cleanup));
      // RxJS catches these exceptions internally and sends them to a closed subscriber.
      // Neither subscription consumer can observe that error at its boundary.
      await expect(
        normalizeQueryResult(source, {abortSignal: new AbortController().signal, refresh: false}),
      ).resolves.toBe(42);
      await expect(firstValueFrom(source)).resolves.toBe(42);
      expect(cleanups).toBe(2);
    },
  );

  it.each(['next', 'error', 'complete', 'abort'] as const)(
    'handles returned teardown failures during synchronous %s',
    async (event) => {
      const controller = new AbortController();
      const sourceError = new Error('request failed');
      let cleanups = 0;
      const result = normalizeQueryResult(
        new Observable<number>((subscriber) => {
          if (event === 'next') {
            subscriber.next(42);
            expect(subscriber.closed).toBe(true);
            subscriber.next(99);
          }
          if (event === 'error') subscriber.error(sourceError);
          if (event === 'complete') subscriber.complete();
          if (event === 'abort') controller.abort();
          return () => {
            cleanups++;
            throw new Error('returned cleanup failed');
          };
        }),
        {abortSignal: controller.signal, refresh: false},
      );
      if (event === 'next') await expect(result).rejects.toThrow('returned cleanup failed');
      if (event === 'error') await expect(result).rejects.toBe(sourceError);
      if (event === 'complete') await expect(result).rejects.toBeInstanceOf(EmptyError);
      if (event === 'abort') await expect(result).rejects.toMatchObject({name: 'AbortError'});
      expect(cleanups).toBe(1);
    },
  );

  it('does not cache synchronous success when returned teardown fails, and allows retry', async () => {
    const client = new QueryClient();
    try {
      let fail = true;
      const definition = {
        key: ['synchronous-cleanup-recovery'],
        loader: () =>
          new Observable<number>((subscriber) => {
            subscriber.next(42);
            return () => {
              if (fail) throw new Error('returned cleanup failed');
            };
          }),
      };
      await expect(client.fetchQuery(definition)).rejects.toThrow('returned cleanup failed');
      expect(client.getSnapshot(definition.key)?.status).toBe('error');
      expect(client.getSnapshot(definition.key)?.value).toBeUndefined();
      fail = false;
      await expect(client.fetchQuery(definition)).resolves.toBe(42);
      expect(client.getSnapshot(definition.key)?.status).toBe('resolved');
    } finally {
      client.destroy();
    }
  });

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
