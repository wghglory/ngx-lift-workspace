import {HttpBackend, HttpClient, HttpInterceptorFn, HttpResponse} from '@angular/common/http';
import {inject} from '@angular/core';
import {map} from 'rxjs';

import {
  SERVER_ORGANIZATIONS_ASSET,
  SERVER_ORGANIZATIONS_URL,
  type ServerOrganization,
  type ServerOrganizationPage,
  type ServerOrganizationQuery,
  type ServerOrganizationScope,
  type ServerOrganizationSort,
  type ServerOrganizationStatus,
} from './server-organization.data';

const DEFAULT_PAGE_SIZE = 5;
const MAXIMUM_PAGE_SIZE = 20;

/**
 * Parses a positive integer query value or falls back.
 * @param value Raw query parameter, possibly null.
 * @param fallback Value used when the parameter is absent or not a positive integer.
 * @returns The parsed integer or the fallback.
 */
function integer(value: string | null, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

/**
 * Parses the selection scope.
 * @param value Raw query parameter, possibly null.
 * @returns The requested scope or the commerce default.
 */
function scope(value: string | null): ServerOrganizationScope {
  return value === 'public' ? 'public' : 'commerce';
}

/**
 * Parses the readiness filter.
 * @param value Raw query parameter, possibly null.
 * @returns A concrete status or all when the parameter is empty or unknown.
 */
function status(value: string | null): ServerOrganizationStatus {
  return value === 'ready' || value === 'maintenance' ? value : 'all';
}

/**
 * Parses the name sort direction.
 * @param value Raw query parameter, possibly null.
 * @returns Descending or ascending name order.
 */
function sort(value: string | null): ServerOrganizationSort {
  return value === '-name' ? '-name' : 'name';
}

/**
 * Serves a bounded, filtered and sorted page from the checked-in inventory.
 * The asset request forwards the same parameters so browser tests can assert request identity.
 * @param request The original request carrying the forwarded query parameters.
 * @param next The following handler; only non-fixture requests reach it.
 * @returns A synthetic fulfilled response for the fixture URL, otherwise the delegated handler.
 */
export const serverOrganizationFixtureInterceptor: HttpInterceptorFn = (request, next) => {
  const url = new URL(request.url, 'http://fixture.local');
  if (url.pathname !== SERVER_ORGANIZATIONS_URL) return next(request);
  const backend = inject(HttpBackend);
  const http = new HttpClient(backend);
  return http
    .get<ServerOrganization[]>(SERVER_ORGANIZATIONS_ASSET, {params: request.params})
    .pipe(map((inventory) => new HttpResponse({status: 200, body: page(inventory, request.params.toString())})));
};

/**
 * Builds one constrained page from the checked-in inventory.
 * @param inventory Full organization inventory served by the fixture.
 * @param params Query string forwarded from the intercepted request.
 * @returns The matching slice and its total; unknown names and out-of-range pages stay valid.
 */
function page(inventory: ServerOrganization[], params: string): ServerOrganizationPage {
  const search = new URLSearchParams(params);
  const query: ServerOrganizationQuery = {
    scope: scope(search.get('scope')),
    name: (search.get('name') ?? '').trim().toLocaleLowerCase(),
    status: status(search.get('status')),
    sort: sort(search.get('sort')),
    page: integer(search.get('page'), 1),
    pageSize: Math.min(MAXIMUM_PAGE_SIZE, Math.max(1, integer(search.get('pageSize'), DEFAULT_PAGE_SIZE))),
  };
  const matching = inventory
    .filter((item) => item.scope === query.scope)
    .filter((item) => !query.name || item.name.toLocaleLowerCase().includes(query.name))
    .filter((item) => query.status === 'all' || item.status === query.status)
    // A server-side sort is locale-independent for the caller; pinning the string comparison keeps browser assertions stable.
    .sort((a, b) => a.name.localeCompare(b.name, 'en'));
  if (query.sort === '-name') matching.reverse();
  const total = matching.length;
  const lastPage = Math.max(1, Math.ceil(total / query.pageSize));
  const current = Math.min(query.page, lastPage);
  return {
    items: matching.slice((current - 1) * query.pageSize, current * query.pageSize),
    total,
  };
}
