import {catchError, forkJoin, map, Observable, of, switchMap, throwError} from 'rxjs';

import type {ResourceDeleteHandler} from '../models/resource-state.model';
import {extractResourceStates} from '../utils/resource-state.util';

interface SettledSuccess {
  key: string | number;
  status: 'fulfilled';
  value: unknown;
}

interface SettledError {
  key: string | number;
  status: 'rejected';
  error: unknown;
}

type SettledEntry = SettledSuccess | SettledError;

/**
 * Rolls back newly created resources (`isNew: true`) and safely catches deletion errors.
 */
function rollbackNewResources(fulfilledValues: unknown[], deleteHandler: ResourceDeleteHandler): Observable<unknown> {
  const newItemsToRollback = extractResourceStates(fulfilledValues).filter((r) => Boolean(r.isNew && r.name));

  if (newItemsToRollback.length === 0) {
    return of(null);
  }

  return forkJoin(
    newItemsToRollback.map((item) =>
      deleteHandler(item).pipe(
        catchError((rollbackErr: unknown) => {
          console.error('[forkJoinWithRollback] Auxiliary rollback failed:', rollbackErr);
          return of(null);
        }),
      ),
    ),
  );
}

/**
 * Executes an array of resource creation observables in parallel with automatic rollback.
 * If any creation fails, any newly created resources (`isNew: true`) among the successful ones
 * are immediately deleted via the `deleteHandler` before the error is re-thrown.
 */
export function forkJoinWithRollback<T extends readonly Observable<unknown>[]>(
  sources: [...T],
  deleteHandler: ResourceDeleteHandler,
): Observable<{[K in keyof T]: T[K] extends Observable<infer R> ? R : never}>;

/**
 * Executes a dictionary of resource creation observables in parallel with automatic rollback.
 * If any creation fails, any newly created resources (`isNew: true`) among the successful ones
 * are immediately deleted via the `deleteHandler` before the error is re-thrown.
 */
export function forkJoinWithRollback<T extends Record<string, Observable<unknown>>>(
  sources: T,
  deleteHandler: ResourceDeleteHandler,
): Observable<{[K in keyof T]: T[K] extends Observable<infer R> ? R : never}>;

/**
 * Executes auxiliary resource observables (array or dictionary) in parallel with automatic rollback on partial failure.
 *
 * @param sources Array or object map of observables to execute.
 * @param deleteHandler Function to handle resource deletion or rollback.
 * @returns Observable emitting results matching the input structure.
 */
export function forkJoinWithRollback(
  sources: readonly Observable<unknown>[] | Record<string, Observable<unknown>>,
  deleteHandler: ResourceDeleteHandler,
): Observable<unknown> {
  const isArray = Array.isArray(sources);
  const entries: {key: string | number; source$: Observable<unknown>}[] = isArray
    ? sources.map((source$, index) => ({key: index, source$}))
    : Object.entries(sources).map(([key, source$]) => ({key, source$}));

  if (entries.length === 0) {
    return of(isArray ? [] : {});
  }

  const settledEntries: Observable<SettledEntry>[] = entries.map(({key, source$}) =>
    source$.pipe(
      map((value): SettledEntry => ({key, status: 'fulfilled', value})),
      catchError((error: unknown): Observable<SettledEntry> => of({key, status: 'rejected', error})),
    ),
  );

  return forkJoin(settledEntries).pipe(
    switchMap((results) => {
      const firstRejected = results.find((r): r is SettledError => r.status === 'rejected');

      if (firstRejected) {
        const fulfilledValues = results
          .filter((r): r is SettledSuccess => r.status === 'fulfilled')
          .map((r) => r.value);

        return rollbackNewResources(fulfilledValues, deleteHandler).pipe(
          switchMap(() => throwError(() => firstRejected.error)),
        );
      }

      const successfulResults = results as SettledSuccess[];

      if (isArray) {
        return of(successfulResults.map((r) => r.value));
      }

      const resultObject: Record<string, unknown> = {};
      for (const r of successfulResults) {
        resultObject[r.key] = r.value;
      }
      return of(resultObject);
    }),
  );
}
