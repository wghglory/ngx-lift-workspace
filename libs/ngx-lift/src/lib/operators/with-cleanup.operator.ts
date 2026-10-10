import {catchError, defaultIfEmpty, forkJoin, map, Observable, of, switchMap, throwError} from 'rxjs';

import type {ResourceDeleteHandler} from '../models/resource-state.model';
import {extractResourceStates, sanitizeTombstones} from '../utils/resource-state.util';

/**
 * Options for `withCleanup` operator callbacks.
 */
export interface CleanupOptions<T, R> {
  /**
   * Callback invoked when the projected inner observable emits a value successfully.
   * Can perform cleanup of superseded or temporary resources.
   * Any errors thrown or emitted by the returned observable will be safely caught and logged.
   */
  onSuccess?: (value: T, result: R) => Observable<unknown>;

  /**
   * Callback invoked when the projected inner observable errors.
   * Can perform rollback of newly created resources.
   * Any errors thrown or emitted by the returned observable will be safely caught,
   * and the original primary error will be re-thrown.
   */
  onError?: (value: T, error: unknown) => Observable<unknown>;
}

/**
 * Custom RxJS operator that projects incoming values into an inner observable
 * while providing lifecycle cleanup callbacks for success and error scenarios.
 *
 * - When passed a `ResourceDeleteHandler` function:
 *   - On error: rolls back all resources with `isNew: true`.
 *   - On success: cleans up all superseded resources with `replacedOldName`.
 * - When passed a `CleanupOptions` object:
 *   - Invokes custom `onSuccess` and `onError` callbacks.
 *
 * @param project Function that maps source value to the primary target observable.
 * @param optionsOrDeleteHandler A delete handler function or custom CleanupOptions.
 * @returns An operator function returning the primary result observable.
 */
export function withCleanup<T, R>(
  project: (value: T) => Observable<R>,
  optionsOrDeleteHandler?: CleanupOptions<T, R> | ResourceDeleteHandler,
): (source$: Observable<T>) => Observable<R> {
  const isDeleteHandler = typeof optionsOrDeleteHandler === 'function';
  const deleteHandler = isDeleteHandler ? optionsOrDeleteHandler : undefined;
  const customOptions = !isDeleteHandler ? optionsOrDeleteHandler : undefined;

  const resolvedOnError =
    customOptions?.onError ??
    (deleteHandler
      ? (value: T) => {
          const newItems = extractResourceStates(value).filter((r) => Boolean(r.isNew && r.name));
          return newItems.length === 0
            ? of(null)
            : forkJoin(
                newItems.map((r) =>
                  deleteHandler(r).pipe(
                    catchError((err: unknown) => {
                      console.error('[withCleanup] Individual rollback delete failed:', err);
                      return of(null);
                    }),
                  ),
                ),
              );
        }
      : undefined);

  const resolvedOnSuccess =
    customOptions?.onSuccess ??
    (deleteHandler
      ? (value: T) => {
          const oldItems = extractResourceStates(value).filter((r) => Boolean(r.replacedOldName));
          return oldItems.length === 0
            ? of(null)
            : forkJoin(
                oldItems.map((r) =>
                  deleteHandler({
                    ...r,
                    name: r.replacedOldName ?? r.name,
                  }).pipe(
                    catchError((err: unknown) => {
                      console.error('[withCleanup] Individual superseded cleanup failed:', err);
                      return of(null);
                    }),
                  ),
                ),
              );
        }
      : undefined);

  return (source$: Observable<T>): Observable<R> =>
    source$.pipe(
      switchMap((value) =>
        project(sanitizeTombstones(value)).pipe(
          switchMap((result) => {
            if (!resolvedOnSuccess) {
              return of(result);
            }
            return resolvedOnSuccess(value, result).pipe(
              catchError((cleanupErr: unknown) => {
                console.error('[withCleanup] Success cleanup failed:', cleanupErr);
                return of(null);
              }),
              defaultIfEmpty(null),
              map(() => result),
            );
          }),
          catchError((mainError: unknown) => {
            if (!resolvedOnError) {
              return throwError(() => mainError);
            }
            return resolvedOnError(value, mainError).pipe(
              catchError((rollbackErr: unknown) => {
                console.error('[withCleanup] Rollback cleanup failed:', rollbackErr);
                return of(null);
              }),
              defaultIfEmpty(null),
              switchMap(() => throwError(() => mainError)),
            );
          }),
        ),
      ),
    );
}
