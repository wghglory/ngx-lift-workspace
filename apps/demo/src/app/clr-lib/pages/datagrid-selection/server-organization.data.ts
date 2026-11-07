import type {Organization, Status} from './organization-example.data';

/** Business scope accepted by the controlled server-paged inventory fixture. */
export type ServerOrganizationScope = 'commerce' | 'public';
/** Status choice retained by the native server-side filter. */
export type ServerOrganizationStatus = 'all' | Status;
/** Deterministic name ordering requested from the fixture endpoint. */
export type ServerOrganizationSort = 'name' | '-name';
/** One organization row served by the paged fixture endpoint. */
export interface ServerOrganization extends Organization {
  scope: ServerOrganizationScope;
}
/** Every response-changing parameter belongs to the shared query identity. */
export interface ServerOrganizationQuery {
  scope: ServerOrganizationScope;
  name: string;
  status: ServerOrganizationStatus;
  sort: ServerOrganizationSort;
  page: number;
  pageSize: number;
}
/** One bounded server page plus the total matching the same filtered identity. */
export interface ServerOrganizationPage {
  items: ServerOrganization[];
  total: number;
}
/** Fixture endpoint served by the demo interceptor or controlled by a browser test. */
export const SERVER_ORGANIZATIONS_URL = '/api/datagrid-selection/organizations';
/** Full checked-in inventory read by the controlled HTTP fixture. */
export const SERVER_ORGANIZATIONS_ASSET = '/assets/datagrid-selection/organizations-server.json';
