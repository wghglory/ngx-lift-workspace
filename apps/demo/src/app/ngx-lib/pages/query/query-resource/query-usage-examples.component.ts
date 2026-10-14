import {AsyncPipe, JsonPipe} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {mutateResource, QUERY_CLIENT, QueryClient, queryResource} from 'ngx-lift';
import {of} from 'rxjs';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';
import {QueryDemoApiService} from './query-demo-api.service';
import {DemoTenant, QueryDemoBackend} from './query-demo-backend';

/** Executable HttpClient examples isolated from the application's real HTTP configuration. */
@Component({
  selector: 'app-query-usage-examples',
  imports: [AsyncPipe, JsonPipe, FormsModule, CodeBlockComponent],
  providers: [
    QueryDemoBackend,
    QueryDemoApiService,
    {provide: HttpClient, useFactory: () => new HttpClient(inject(QueryDemoBackend))},
    {
      provide: QUERY_CLIENT,
      useFactory: () => {
        const client = new QueryClient();
        inject(DestroyRef).onDestroy(() => client.destroy());
        return client;
      },
    },
  ],
  templateUrl: './query-usage-examples.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueryUsageExamplesComponent {
  readonly backend = inject(QueryDemoBackend);
  private readonly http = inject(HttpClient);
  private readonly api = inject(QueryDemoApiService);
  readonly tenantId = signal('a');
  readonly databaseName = signal('New database');
  readonly widgetsShown = signal(false);
  readonly widgetRevision = signal(0);
  readonly widgetNames = ['A', 'B', 'C'];

  readonly tenantQuery = queryResource(() => {
    const id = this.tenantId();
    return {
      key: ['query-demo', id, 'tenant'],
      loader: () => this.http.get<DemoTenant>(`/query-demo/tenants/${id}`),
      staleTime: 30_000,
    };
  });
  readonly healthQuery = queryResource(() => {
    const id = this.tenantId();
    return {
      key: ['query-demo', id, 'health'],
      loader: () => this.http.get<{state: string}>(`/query-demo/tenants/${id}/health`),
      staleTime: 30_000,
    };
  });
  readonly databasesQuery = queryResource(() => {
    const tenant = this.tenantQuery.value();
    return tenant === undefined ? undefined : this.api.databaseQuery(tenant.id);
  });
  readonly snapshots$ = computed(() => {
    const tenant = this.tenantQuery.value();
    return tenant === undefined ? of(undefined) : this.api.observeDatabases$(tenant.id);
  });
  readonly widgetReads$ = computed(() => {
    const id = this.tenantId();
    const revision = this.widgetRevision();
    return this.api.preferences$(id, {refresh: revision > 0});
  });
  readonly createMutation = mutateResource((args: {tenantId: string; name: string}) => this.api.createDatabase$(args), {
    invalidatesTags: (_database, args) => [{type: 'DemoDatabases', scope: args.tenantId}],
    concurrency: 'exhaust',
  });
  readonly createDisabled = computed(
    () => !this.tenantQuery.value() || !this.databaseName().trim() || this.createMutation.isLoading(),
  );

  createDatabase() {
    this.createMutation.mutate({tenantId: this.tenantId(), name: this.databaseName()});
  }

  failTenant() {
    this.backend.failNextTenant = true;
    this.tenantQuery.reload();
  }

  refreshWidgets() {
    this.widgetRevision.update((value) => value + 1);
  }

  readonly usageCode =
    highlight(`import {queryResource, defineQuery, fetchQueryObservable, QUERY_CLIENT} from 'ngx-lift';
import {ChangeDetectionStrategy, Component, Injectable, inject, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';

interface Tenant { id: string; }
interface Database { id: number; name: string; }

@Injectable({providedIn: 'root'})
export class DatabaseService {
  private readonly http = inject(HttpClient);
  private readonly client = inject(QUERY_CLIENT);
  databaseQuery(id: string) {
    return defineQuery({key: ['databases', id], tags: [{type: 'Databases', scope: id}],
      loader: () => this.http.get<Database[]>(\`/api/tenants/\${id}/databases\`)});
  }
  databases$(id: string) {
    return fetchQueryObservable(this.client, this.databaseQuery(id));
  }
}

@Component({selector: 'app-example', template: '{{ databasesQuery.status() }}',
  changeDetection: ChangeDetectionStrategy.OnPush})
export class ExampleComponent {
  private readonly http = inject(HttpClient);
  private readonly api = inject(DatabaseService);
  readonly tenantId = signal('a');
  readonly tenantQuery = queryResource(() => {
    const id = this.tenantId();
    return {key: ['tenants', id], loader: () => this.http.get<Tenant>(\`/api/tenants/\${id}\`)};
  });
  readonly databasesQuery = queryResource(() => {
    const tenant = this.tenantQuery.value();
    return tenant ? this.api.databaseQuery(tenant.id) : undefined;
  });
}`);
}
