import {defer, EmptyError, from, Observable, Subscriber} from 'rxjs';

import {QueryDefinition, QueryLoaderContext, QueryObserverHandle, QuerySnapshot} from './query.models';
import {QueryClient} from './query-client';

/**
 * Adapt an HttpClient/Observable read without losing interceptor or cancellation behavior.
 * @example
 * ```typescript
 * const definition = {key: ['users'], loader: observableLoader(() => http.get<User[]>('/api/users'))};
 * const users = await client.fetchQuery(definition);
 * ```
 */
export function observableLoader<T>(
  factory: (context: QueryLoaderContext) => Observable<T>,
): QueryDefinition<T>['loader'] {
  return (context) =>
    new Promise<T>((resolve, reject) => {
      const {abortSignal} = context;
      let settled = false;
      const cleanup = () => {
        abortSignal.removeEventListener('abort', abort);
        subscriber.unsubscribe();
      };
      const subscriber = new Subscriber<T>({
        next: (value: T) => {
          if (!settled) {
            settled = true;
            cleanup();
            resolve(value);
          }
        },
        error: (error: unknown) => {
          if (!settled) {
            settled = true;
            cleanup();
            reject(error);
          }
        },
        complete: () => {
          if (!settled) {
            settled = true;
            cleanup();
            reject(new EmptyError());
          }
        },
      });
      const abort = () => {
        if (!settled) {
          settled = true;
          cleanup();
          const error = new Error('Query request aborted');
          error.name = 'AbortError';
          reject(error);
        }
      };

      if (abortSignal.aborted) {
        abort();
        return;
      }
      abortSignal.addEventListener('abort', abort, {once: true});
      try {
        factory(context).subscribe(subscriber);
      } catch (error) {
        subscriber.error(error);
      }
    });
}

/**
 * Cold subscription to a shared read; unsubscribing one caller does not cancel other callers.
 * @example
 * ```typescript
 * const definition = {key: ['users'], loader: observableLoader(() => http.get<User[]>('/api/users'))};
 * const users = await firstValueFrom(fetchQueryObservable(client, definition));
 * ```
 */
export function fetchQueryObservable<T>(
  client: QueryClient,
  definition: QueryDefinition<T>,
  options: {refresh?: boolean} = {},
): Observable<T> {
  return defer(() => from(client.fetchQuery(definition, options)));
}

/**
 * Observe shared state. Explicit removal completes this stream; resubscribe to observe a recreated query.
 * @example
 * ```typescript
 * const definition = {key: ['users'], loader: observableLoader(() => http.get<User[]>('/api/users'))};
 * const subscription = observeQueryObservable(client, definition).subscribe((snapshot) => {
 *   render(snapshot.value, snapshot.status, snapshot.error);
 * });
 * subscription.unsubscribe();
 * ```
 */
export function observeQueryObservable<T>(
  client: QueryClient,
  definition: QueryDefinition<T>,
  options: {pollInterval?: number; refresh?: boolean} = {},
): Observable<QuerySnapshot<T>> {
  return new Observable((subscriber) => {
    // The first snapshots arrive synchronously before observeQuery returns the handle.
    let handle: QueryObserverHandle | undefined = undefined;
    handle = client.observeQuery(
      definition,
      (snapshot) => {
        subscriber.next(snapshot);
        if (handle && !handle.isAttached()) {
          subscriber.complete();
        }
      },
      options,
    );
    // Removal can happen during the initial snapshots, before the handle exists.
    if (!handle.isAttached()) subscriber.complete();
    return handle;
  });
}
