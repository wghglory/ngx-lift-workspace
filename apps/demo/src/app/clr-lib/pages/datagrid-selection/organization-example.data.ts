export type Status = 'ready' | 'maintenance';
export interface Organization {
  id: string;
  name: string;
  status: Status;
}
export const STATUS_KEYS: Record<Status, string> = {
  ready: 'organizationExample.ready',
  maintenance: 'organizationExample.maintenance',
};
export const STATUS_ORDER: Record<Status, number> = {ready: 0, maintenance: 1};
