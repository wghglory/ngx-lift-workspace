import type {Status} from './organization-example.data';

/** Namespace inventory record used by the data service policy example. */
export interface Namespace {
  id: string;
  name: string;
  status: Status;
}

/** Translation keys for each namespace status (reuses the organization status keys). */
export const NAMESPACE_STATUS_KEYS: Record<Status, string> = {
  ready: 'organizationExample.ready',
  maintenance: 'organizationExample.maintenance',
};

/** Deterministic display order for namespace statuses. */
export const NAMESPACE_STATUS_ORDER: Record<Status, number> = {ready: 0, maintenance: 1};
