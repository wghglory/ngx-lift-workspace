import {defer, from, Observable} from 'rxjs';

import {
  QueryDefinition,
  QueryFetchOptions,
  QueryObserverHandle,
  QueryObserverOptions,
  QuerySnapshot,
} from './query.models';
import {QueryClient} from './query-client';

/**
 * Cold subscription to a shared read; unsubscribing one caller does not cancel other callers.
 *
 * @example
 * ```typescript
 * const definition = {key: ['users'], loader: () => http.get<User[]>('/api/users')};
 * const users = await firstValueFrom(fetchQueryObservable(client, definition));
 * ```
 *
 * @param client The QueryClient managing shared cache state.
 * @param definition The query definition to fetch.
 * @param options Query fetch options such as refresh.
 * @returns An Observable emitting the resolved query result.
 */
export function fetchQueryObservable<T>(
  client: QueryClient,
  definition: QueryDefinition<T>,
  options?: QueryFetchOptions,
): Observable<T> {
  return defer(() => from(client.fetchQuery(definition, options)));
}

/**
 * Stream shared query snapshots; closes when explicit cache removal purges the query.
 * Resubscribe to observe a recreated query.
 *
 * @example
 * ```typescript
 * const definition = {key: ['users'], loader: () => http.get<User[]>('/api/users')};
 * const subscription = observeQueryObservable(client, definition).subscribe((snapshot) => {
 *   console.log(snapshot.value, snapshot.status, snapshot.error);
 * });
 * subscription.unsubscribe();
 * ```
 *
 * @param client The QueryClient managing shared cache state.
 * @param definition The query definition to observe.
 * @param options Observer options such as poll interval or refresh.
 * @returns An Observable emitting QuerySnapshot objects as the query updates.
 */
export function observeQueryObservable<T>(
  client: QueryClient,
  definition: QueryDefinition<T>,
  options?: QueryObserverOptions,
): Observable<QuerySnapshot<T>> {
  return new Observable<QuerySnapshot<T>>((subscriber) => {
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
    if (!handle.isAttached()) {
      subscriber.complete();
    }
    return handle;
  });
}
