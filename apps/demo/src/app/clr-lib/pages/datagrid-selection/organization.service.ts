import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import type {Observable} from 'rxjs';
import type {QueryDefinition} from 'ngx-lift';
import type {Organization} from './organization-example.data';

@Injectable({providedIn: 'root'})
export class OrganizationService {
  private readonly httpClient = inject(HttpClient);
  list(scope: string): Observable<Organization[]> {
    // This example endpoint returns the complete local-grid inventory for the scope.
    return this.httpClient.get<Organization[]>('/assets/datagrid-selection/organizations.json', {params: {scope}});
  }
}

export function organizationListQuery(
  organizationService: OrganizationService,
  scope: string,
): QueryDefinition<Organization[]> {
  return {
    key: ['organizations', 'list', scope],
    staleTime: 60_000,
    loader: () => organizationService.list(scope),
  };
}
