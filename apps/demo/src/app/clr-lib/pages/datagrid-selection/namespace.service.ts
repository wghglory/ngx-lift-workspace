import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import type {QueryDefinition} from 'ngx-lift';
import type {Namespace} from './namespace-example.data';

/** Loads the complete local namespace inventory for a scope. */
@Injectable({providedIn: 'root'})
export class NamespaceService {
  private readonly httpClient = inject(HttpClient);

  /**
   * Declares the shared query for one scope. The scope is part of the query key so the
   * shared client caches one inventory per scope.
   *
   * @param scope Every response-changing parameter of the request.
   * @returns Query definition with that scope inside both key and loader.
   */
  listQuery(scope: string): QueryDefinition<Namespace[]> {
    return {
      key: ['namespaces', 'list', scope],
      staleTime: 60_000,
      loader: () => this.httpClient.get<Namespace[]>('/assets/datagrid-selection/namespaces.json', {params: {scope}}),
    };
  }
}
