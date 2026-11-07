import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import type {QueryDefinition} from 'ngx-lift';
import type {Observable} from 'rxjs';

import {
  SERVER_ORGANIZATIONS_URL,
  type ServerOrganizationPage,
  type ServerOrganizationQuery,
} from './server-organization.data';

/** Requests one bounded server page for the current scope, filter, sort and page. */
@Injectable({providedIn: 'root'})
export class ServerOrganizationService {
  private readonly httpClient = inject(HttpClient);

  /**
   * Requests one filtered and sorted page from the server endpoint.
   * @param query Every response-changing parameter of the request.
   * @returns The requested page and total count of matching organizations.
   */
  list(query: ServerOrganizationQuery): Observable<ServerOrganizationPage> {
    return this.httpClient.get<ServerOrganizationPage>(SERVER_ORGANIZATIONS_URL, {
      params: {
        scope: query.scope,
        name: query.name,
        status: query.status,
        sort: query.sort,
        page: query.page,
        pageSize: query.pageSize,
      },
    });
  }

  /**
   * Declares the shared query for one page request.
   *
   * Every response-changing parameter stays in the query identity, so the shared client caches
   * one page per scope, filter, sort and page instead of mixing results from different requests.
   *
   * @param query Scope, filter, sort and page parameters of this refresh.
   * @returns Query definition with those parameters inside both key and loader.
   */
  listQuery(query: ServerOrganizationQuery): QueryDefinition<ServerOrganizationPage> {
    return {
      key: ['server-organizations', {...query}],
      staleTime: 30_000,
      loader: () => this.list(query),
    };
  }
}
