import {QueryObserverHandle, QueryObserverOptions} from './query.models';
import type {QueryClient} from './query-client';

/** Internal handshake so a resource owns its handle before listeners or transport can reenter it. */
export const onQueryObserverAttached = Symbol('onQueryObserverAttached');

/** Observer options used internally to deliver the disposer before the first snapshot. */
export interface OwnedQueryObserverOptions extends QueryObserverOptions {
  readonly [onQueryObserverAttached]?: (handle: QueryObserverHandle) => void;
}

interface QueryDispatchEntry {
  readonly serializedKey: string;
  readonly publicationRevision: number;
}

interface QueryDispatch {
  client: QueryClient;
  entry: QueryDispatchEntry;
  observer: QueryObserverHandle;
  revision: number;
}

let activeDispatch: QueryDispatch | undefined;

/** Preserve the publishing entry and revision across synchronous client decorators, including nested notifications. */
export function dispatchQuerySnapshot<T>(
  client: QueryClient,
  entry: QueryDispatchEntry,
  observer: QueryObserverHandle,
  deliver: () => T,
): T {
  const previous = activeDispatch;
  activeDispatch = {client, entry, observer, revision: entry.publicationRevision};
  try {
    return deliver();
  } finally {
    activeDispatch = previous;
  }
}

/** Suppress only an older dispatch for this observer. Custom deliveries outside dispatch retain their own semantics. */
export function isSupersededQueryDispatch(client: QueryClient, key: string, observer?: QueryObserverHandle): boolean {
  const dispatch = activeDispatch;
  if (!dispatch || dispatch.entry.serializedKey !== key) return false;
  // A decorator may omit the private registration hook, so the handle is unavailable during its initial callback.
  const matches = observer ? observer === dispatch.observer : client === dispatch.client;
  return matches && dispatch.revision !== dispatch.entry.publicationRevision;
}
