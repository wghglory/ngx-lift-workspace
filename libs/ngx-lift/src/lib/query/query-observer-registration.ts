import {QueryObserverHandle, QueryObserverOptions} from './query.models';

/** Internal handshake so a resource owns its handle before listeners or transport can reenter it. */
export const onQueryObserverAttached = Symbol('onQueryObserverAttached');

/** Observer options used internally to deliver the disposer before the first snapshot. */
export interface OwnedQueryObserverOptions extends QueryObserverOptions {
  readonly [onQueryObserverAttached]?: (handle: QueryObserverHandle) => void;
}
