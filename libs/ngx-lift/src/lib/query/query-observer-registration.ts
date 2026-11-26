import {QueryObserverHandle, QueryObserverOptions} from './query.models';

/** Internal handshake so a resource owns its handle before listeners or transport can reenter it. */
export const onQueryObserverAttached = Symbol('onQueryObserverAttached');

export interface OwnedQueryObserverOptions extends QueryObserverOptions {
  readonly [onQueryObserverAttached]?: (handle: QueryObserverHandle) => void;
}
