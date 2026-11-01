/** Organization availability status used by the examples. */
export type Status = 'ready' | 'maintenance';
/** Organization inventory record used by the datagrid selection examples. */
export interface Organization {
  id: string;
  name: string;
  status: Status;
}
/** Translation keys for each organization status. */
export const STATUS_KEYS: Record<Status, string> = {
  ready: 'organizationExample.ready',
  maintenance: 'organizationExample.maintenance',
};
/** Deterministic display order for organization statuses. */
export const STATUS_ORDER: Record<Status, number> = {ready: 0, maintenance: 1};
