import {JsonPipe} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, DestroyRef, inject, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ClarityModule} from '@clr/angular';
import {CalloutComponent, PageContainerComponent, TranslatePipe} from 'clr-lift';
import {QUERY_CLIENT, QueryClient, queryResources} from 'ngx-lift';

import {DemoPlaygroundComponent} from '../../../../shared/components/demo-playground/demo-playground.component';
import {highlight} from '../../../../shared/utils/highlight.util';
import {DemoTenant, QueryDemoBackend} from '../query-resource/query-demo-backend';
import {FailureDemoData, QueryFailureBackend} from '../query-resource/query-failure-backend';
import {QueryStatusDirective} from '../query-status.directive';

@Component({
  selector: 'app-query-resources-demo',
  imports: [
    JsonPipe,
    RouterLink,
    ClarityModule,
    CalloutComponent,
    PageContainerComponent,
    TranslatePipe,
    DemoPlaygroundComponent,
    QueryStatusDirective,
  ],
  providers: [
    QueryDemoBackend,
    QueryFailureBackend,
    {provide: HttpClient, useFactory: () => new HttpClient(inject(QueryDemoBackend))},
    {
      provide: QUERY_CLIENT,
      useFactory: () => {
        const client = new QueryClient({queryDefaults: {deadlineMs: 5000}});
        inject(DestroyRef).onDestroy(() => client.destroy());
        return client;
      },
    },
  ],
  templateUrl: './query-resources.component.html',
  styleUrl: './query-resources.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueryResourcesDemoComponent {
  readonly backend = inject(QueryDemoBackend);
  readonly failureBackend = inject(QueryFailureBackend);
  private readonly http = inject(HttpClient);
  private readonly failureHttp = new HttpClient(this.failureBackend);
  readonly selectedTenants = signal(['a']);
  readonly tenantQueries = queryResources(this.selectedTenants, (id) => ({
    key: ['collection-demo', id, 'tenant'],
    staleTime: 30_000,
    cancelOnNoObservers: true,
    loader: () => this.http.get<DemoTenant>(`/query-demo/tenants/${id}`),
  }));
  readonly rowQueries = queryResources(
    () => ['a', 'b'],
    (id) => ({
      key: ['collection-demo', 'rows', id],
      staleTime: 30_000,
      cancelOnNoObservers: true,
      loader: () => this.failureHttp.get<FailureDemoData>(`/query-failure/rows/${id}`),
    }),
  );
  readonly dynamicCode = highlight(`// Component fields (with HttpClient injected as this.http).
readonly selectedIds = signal(['a']);
readonly tenantQueries = queryResources(this.selectedIds, (id) => ({
  key: ['tenants', id],
  loader: () => this.http.get<Tenant>(\`/api/tenants/\${id}\`),
  staleTime: 30_000,
  cancelOnNoObservers: true,
}));
// Add, reorder or remove IDs; retained keys keep the same ref.
// Duplicate canonical keys are rejected.
// New rows attach during Angular effect scheduling.`);
  readonly rowCode = highlight(`@for (row of rowQueries(); track row.key) {
  <p>{{ row.item() }}: {{ row.status() }}</p>
  @if (row.hasValue()) { <p>{{ row.value()?.value }}</p> }
  @if (row.isInitialError()) {
    <button (click)="row.reload()">Retry this read</button>
  }
}
<!-- Each row exposes the single-query signals and controls.
     item() identifies the input even when no data has loaded. -->`);
}
