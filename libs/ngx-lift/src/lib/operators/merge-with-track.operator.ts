import {map, merge, Observable, scan} from 'rxjs';

/**
 * Merges multiple source observables into a single observable and tracks which source observable
 * emitted last along with the latest values from all sources.
 *
 * Emits an object containing:
 * - `values`: Record of the latest values emitted by each source indexed by their original array position.
 * - `lastEmittedIndex`: Index of the source observable that triggered the latest emission.
 *
 * @param sources$ Array of source observables to track and merge.
 * @returns Observable emitting the latest combined values and last emitted index.
 *
 * @example
 * ```typescript
 * import { Subject } from 'rxjs';
 * import { mergeWithTrack } from 'ngx-lift';
 *
 * const search$ = new Subject<string>();
 * const filter$ = new Subject<number>();
 *
 * mergeWithTrack([search$, filter$]).subscribe(({ values, lastEmittedIndex }) => {
 *   console.log('Latest values:', values);
 *   console.log('Triggered by source index:', lastEmittedIndex);
 * });
 * ```
 */
export function mergeWithTrack<T>(sources$: Observable<T>[]): Observable<{
  values: Record<number, T>;
  lastEmittedIndex: number | null;
}> {
  return merge(...sources$.map((source$, index) => source$.pipe(map((value) => ({index, value}))))).pipe(
    scan(
      (acc, {index, value}) => ({
        values: {
          ...acc.values,
          [index]: value,
        },
        lastEmittedIndex: index,
      }),
      {values: {} as Record<number, T>, lastEmittedIndex: null as number | null},
    ),
  );
}
