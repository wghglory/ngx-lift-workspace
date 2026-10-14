import {EmptyError, isObservable, Subscriber} from 'rxjs';

import {QueryLoaderContext, QueryResult} from './query.models';

/**
 * Normalizes a query loader return value (`Observable<T> | Promise<T> | PromiseLike<T>`) into a Promise.
 *
 * If the source is an Observable:
 * - Unsubscribes after the first emitted value (taking the first value like RxJS firstValueFrom).
 * - Waits for subscription setup to finish before settling, so teardown failures escaping subscribe/unsubscribe reject successful reads.
 * - Rejects with EmptyError if the Observable completes without emitting a value.
 * - Rejects immediately if the request's AbortSignal is aborted, and cancels the Observable subscription.
 * - Rejects on Observable error.
 *
 * If the source is a Promise or PromiseLike:
 * - Resolves to the Promise result.
 *
 * @param source The loader result to normalize.
 * @param context The query loader context containing cancellation and refresh state.
 * @returns A Promise resolving to the first value or rejecting on error, empty stream, or abort.
 */
export function normalizeQueryResult<T>(source: QueryResult<T>, context: QueryLoaderContext): Promise<T> {
  if (isObservable(source)) {
    return new Promise<T>((resolve, reject) => {
      const {abortSignal} = context;
      if (abortSignal.aborted) {
        const error = new Error('Query request aborted');
        error.name = 'AbortError';
        reject(error);
        return;
      }

      let settled = false;
      let subscribing = true;
      let outcome: {value: T} | {error: unknown} | undefined;

      const finish = () => {
        if (subscribing || !outcome) return;
        if ('error' in outcome) reject(outcome.error);
        else resolve(outcome.value);
      };

      const settle = (result: {value: T} | {error: unknown}) => {
        if (settled) return;
        settled = true;
        outcome = result;
        abortSignal.removeEventListener('abort', onAbort);
        try {
          subscriber.unsubscribe();
        } catch (error) {
          // A teardown failure must not strand the shared request or mask its original error.
          outcome = {error: 'error' in result ? result.error : error};
        }
        finish();
      };

      const onAbort = () => {
        const error = new Error('Query request aborted');
        error.name = 'AbortError';
        settle({error});
      };

      const subscriber = new Subscriber<T>({
        next: (value: T) => {
          settle({value});
        },
        error: (error: unknown) => {
          settle({error});
        },
        complete: () => {
          settle({error: new EmptyError()});
        },
      });

      abortSignal.addEventListener('abort', onAbort, {once: true});

      try {
        source.subscribe(subscriber);
      } catch (error) {
        // Synchronous emissions close the subscriber before returned teardown is registered.
        // Wait for subscribe() to return so a teardown failure cannot publish successful data.
        if (!settled) settle({error});
        else if (outcome && 'value' in outcome) outcome = {error};
      } finally {
        subscribing = false;
        finish();
      }
    });
  }

  return Promise.resolve(source);
}
