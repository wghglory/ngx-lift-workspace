import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {defineQuery, fetchQueryObservable, observeQueryObservable, QUERY_CLIENT} from 'ngx-lift';

import {DemoDatabase} from './query-demo-backend';

/** Shared definitions let views and Observable services use the same cache identity. */
@Injectable()
export class QueryDemoApiService {
  private readonly http = inject(HttpClient);
  private readonly client = inject(QUERY_CLIENT);

  databaseQuery(tenantId: string) {
    return defineQuery({
      key: ['query-demo', tenantId, 'databases'],
      tags: [{type: 'DemoDatabases', scope: tenantId}],
      staleTime: 30_000,
      loader: () => this.http.get<DemoDatabase[]>(`/query-demo/tenants/${tenantId}/databases`),
    });
  }

  observeDatabases$(tenantId: string) {
    return observeQueryObservable(this.client, this.databaseQuery(tenantId));
  }

  preferences$(tenantId: string, options: {refresh?: boolean} = {}) {
    return fetchQueryObservable(
      this.client,
      defineQuery({
        key: ['query-demo', tenantId, 'preferences'],
        staleTime: 30_000,
        loader: () => this.http.get<{theme: string; tenantId: string}>(`/query-demo/tenants/${tenantId}/preferences`),
      }),
      options,
    );
  }

  createDatabase$(args: {tenantId: string; name: string}) {
    return this.http.post<DemoDatabase>(`/query-demo/tenants/${args.tenantId}/databases`, {name: args.name});
  }
}
