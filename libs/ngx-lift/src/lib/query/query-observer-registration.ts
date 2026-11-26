import {QueryObserverHandle, QueryObserverOptions, QuerySnapshot} from './query.models';

/** Internal handshake so a resource owns its handle before listeners or transport can reenter it. */
export const onQueryObserverAttached = Symbol('onQueryObserverAttached');

/** Observer options used internally to deliver the disposer before the first snapshot. */
export interface OwnedQueryObserverOptions extends QueryObserverOptions {
  readonly [onQueryObserverAttached]?: (handle: QueryObserverHandle) => void;
}

/** Carried by object spread so decorators can adapt a publication without losing its order. */
export const querySnapshotRevision = Symbol('querySnapshotRevision');

/** Custom clients may deliver a snapshot without the client's publication order. */
export interface OrderedQuerySnapshot<T> extends QuerySnapshot<T> {
  readonly [querySnapshotRevision]?: number;
}
