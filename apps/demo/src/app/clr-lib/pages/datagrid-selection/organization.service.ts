import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import type {QueryDefinition} from 'ngx-lift';
import type {Organization} from './organization-example.data';

/** Loads the complete local organization inventory for a scope. */
@Injectable({providedIn: 'root'})
export class OrganizationService {
  private readonly httpClient = inject(HttpClient);

  /**
   * Declares the shared query for one scope.
   *
   * The scope is part of the query key, so the shared client caches one inventory per scope
   * instead of letting a later scope overwrite an earlier one.
   *
   * @param scope Every response-changing parameter of the request.
   * @returns Query definition with that scope inside both key and loader.
   */
  listQuery(scope: string): QueryDefinition<Organization[]> {
    return {
      key: ['organizations', 'list', scope],
      staleTime: 60_000,
      loader: () =>
        this.httpClient.get<Organization[]>('/assets/datagrid-selection/organizations.json', {params: {scope}}),
    };
  }
}
