import {
  assertInInjectionContext,
  computed,
  DestroyRef,
  effect,
  inject,
  Injector,
  Signal,
  signal,
  untracked,
  WritableSignal,
} from '@angular/core';

import {QueryDefinition} from './query.models';
import {serializeQueryKey} from './query-key';
import {queryResource, QueryResourceOptions, QueryResourceRef} from './query-resource';

/** A collection item with canonical cache identity for Angular template tracking. */
export interface QueryResourceItem<T> extends QueryResourceRef<T | undefined> {
  readonly key: string;
}

/** Ordered query observers owned by the caller's injector. */
export interface QueryResourcesRef<T> extends Signal<readonly QueryResourceItem<T>[]> {
  destroy(): void;
}

/**
 * Observe a reactive item collection using one query definition per item (pattern B).
 * Reordering preserves refs; removing an item destroys its observer. Duplicate canonical keys are rejected.
 * New observers attach during Angular's effect scheduling; removed items disappear from the result immediately.
 *
 * @example
 * const hosts = queryResources(() => selectedIds(), id => ({
 *   key: ['hosts', id], loader: () => http.get<Host>(`/api/hosts/${id}`),
 * }));
 * // @for (host of hosts(); track host.key) { ... }
 */
export function queryResources<I, T>(
  items: () => readonly I[],
  definition: (item: I) => QueryDefinition<T>,
  options: QueryResourceOptions = {},
): QueryResourcesRef<T> {
  if (!options.injector) assertInInjectionContext(queryResources);
  const injector = options.injector ?? inject(Injector);
  const requested = computed(() => {
    const seen = new Set<string>();
    return items().map((item) => {
      const query = definition(item);
      const key = serializeQueryKey(query.key);
      if (seen.has(key)) throw new Error(`Duplicate queryResources key: ${key}`);
      seen.add(key);
      return {query, key};
    });
  });
  type Entry = {definition: WritableSignal<QueryDefinition<T>>; ref: QueryResourceItem<T>};
  const active = signal<ReadonlyMap<string, Entry>>(new Map());
  let destroyed = false;
  const reconcile = effect(
    () => {
      const queries = requested();
      untracked(() => {
        if (destroyed) return;
        const previous = active();
        const next = new Map<string, Entry>();
        for (const {query, key} of queries) {
          let entry = previous.get(key);
          if (entry) entry.definition.set(query);
          else {
            const current = signal(query);
            const ref = queryResource(() => current(), {...options, injector});
            entry = {definition: current, ref: {...ref, key}};
          }
          next.set(key, entry);
        }
        for (const [key, entry] of previous) if (!next.has(key)) entry.ref.destroy();
        active.set(next);
      });
    },
    {injector, manualCleanup: true},
  );
  const rows = computed(() => {
    const entries = active();
    if (destroyed) return [];
    return requested().flatMap(({key}) => {
      const entry = entries.get(key);
      return entry ? [entry.ref] : [];
    });
  });
  const dispose = () => {
    if (destroyed) return;
    destroyed = true;
    reconcile.destroy();
    for (const entry of untracked(active).values()) entry.ref.destroy();
    active.set(new Map());
  };
  const unregister = injector.get(DestroyRef).onDestroy(dispose);
  return Object.assign(rows, {
    destroy: () => {
      unregister();
      dispose();
    },
  });
}
