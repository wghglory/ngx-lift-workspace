import {AsyncPipe, JsonPipe} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TranslatePipe} from 'clr-lift';
import {mutateResource, QUERY_CLIENT, QueryClient, queryResource} from 'ngx-lift';
import {of} from 'rxjs';

import {ClarityModule} from '@clr/angular';
import {DemoPlaygroundComponent} from '../../../../shared/components/demo-playground/demo-playground.component';
import {QueryStatusDirective} from '../query-status.directive';
import {highlight} from '../../../../shared/utils/highlight.util';
import {QueryDemoApiService} from './query-demo-api.service';
import {DemoTenant, QueryDemoBackend} from './query-demo-backend';

/** Executable HttpClient examples isolated from the application's real HTTP configuration. */
@Component({
  selector: 'app-query-usage-examples',
  imports: [
    AsyncPipe,
    JsonPipe,
    FormsModule,
    ClarityModule,
    DemoPlaygroundComponent,
    QueryStatusDirective,
    TranslatePipe,
  ],
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
  styleUrl: '../query-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueryUsageExamplesComponent {
  readonly backend = inject(QueryDemoBackend);
  private readonly http = inject(HttpClient);
  private readonly api = inject(QueryDemoApiService);
  readonly tenantId = signal('a');
  readonly databaseName = signal('');
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
    void this.createMutation.mutate({tenantId: this.tenantId(), name: this.databaseName()});
  }

  failTenant() {
    this.backend.failNextTenant = true;
    this.tenantQuery.reload();
  }

  refreshWidgets() {
    this.widgetRevision.update((value) => value + 1);
  }

  readonly basicCode = highlight(`import {Component, ChangeDetectionStrategy, inject, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {queryResource} from 'ngx-lift';

interface Tenant {
  id: string;
  name: string;
}

// Configure provideHttpClient() in application providers.
@Component({
  selector: 'app-tenant',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`<p>{{ tenantQuery.value()?.name }}: {{ tenantQuery.status() }}</p>
    <button (click)="tenantQuery.reload()">Refresh</button>\`,
})
export class TenantComponent {
  private readonly http = inject(HttpClient);
  readonly tenantId = signal('a');
  readonly tenantQuery = queryResource(() => {
    const id = this.tenantId();
    return {
      key: ['tenants', id],
      loader: () => this.http.get<Tenant>(\`/api/tenants/\${id}\`),
      staleTime: 30_000,
    };
  });
}`);

  readonly dependentCode = highlight(`// Component fields (alongside tenantQuery, http and api).
readonly databasesQuery = queryResource(() => {
  const tenant = this.tenantQuery.value();
  if (!tenant) return undefined; // No request until ready.
  return {
    key: ['databases', tenant.id],
    tags: [{type: 'Databases', scope: tenant.id}],
    loader: () => this.http.get<Database[]>(\`/api/tenants/\${tenant.id}/databases\`),
  };
});
readonly createMutation = mutateResource((args: {tenantId: string; name: string}) => this.api.createDatabase$(args), {
  concurrency: 'exhaust',
  invalidatesTags: (_result, args) => [{type: 'Databases', scope: args.tenantId}],
});`);

  readonly serviceCode = highlight(`// A service returns a cold Observable backed by the shared cache.
preferences$(id: string, refresh = false) {
  return fetchQueryObservable(
    this.client,
    {
      key: ['preferences', id],
      loader: () => this.http.get<Preferences>(\`/api/tenants/\${id}/preferences\`),
      staleTime: 30_000,
    },
    {refresh},
  );
}
// Three async-pipe subscribers join the same in-flight request.
// For ongoing invalidation updates, use observeQueryObservable instead.`);
}
