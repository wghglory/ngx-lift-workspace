import {
  CollectionStarterComponent,
  COLLECTION_STARTER_TEMPLATE,
} from '../collection-starter/collection-starter.component';
import {COLLECTION_STARTER_SOURCE} from '../collection-starter/collection-starter.example';
import {JsonPipe} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ClarityModule} from '@clr/angular';
import {ClarityIcons, refreshIcon} from '@clr/angular/icon';
import {PageContainerComponent, SpinnerComponent, TranslatePipe} from 'clr-lift';

import {QUERY_CLIENT, queryResource, queryResources} from 'ngx-lift';
import {forkJoin, Observable, of} from 'rxjs';
import {catchError, delay, map, switchMap} from 'rxjs/operators';

import {DemoPlaygroundComponent} from '../../../../shared/components/demo-playground/demo-playground.component';
import {highlight} from '../../../../shared/utils/highlight.util';
import {QueryDemoBackend} from '../query-resource/query-demo-backend';
import {FailureDemoData, QueryFailureBackend} from '../query-resource/query-failure-backend';
import {QueryStatusDirective} from '../query-status.directive';

ClarityIcons.addIcons(refreshIcon);

export interface K8sCluster {
  id: string;
  name: string;
  provider: 'AWS EKS' | 'Azure AKS' | 'Google GKE';
  region: string;
}

export interface K8sClusterMetrics {
  cpuUsagePct: number;
  memoryUsagePct: number;
  activeNodes: number;
  status: 'healthy' | 'degraded';
  latencyMs: number;
}

export interface K8sClusterBulkItem extends K8sCluster {
  metrics: K8sClusterMetrics | null;
  error?: string;
}

const K8S_CLUSTERS: readonly K8sCluster[] = [
  {id: 'cluster-us-east', name: 'prod-us-east', provider: 'AWS EKS', region: 'us-east-1'},
  {id: 'cluster-eu-west', name: 'prod-eu-west', provider: 'Azure AKS', region: 'westeurope'},
  {id: 'cluster-apac-edge', name: 'telemetry-apac', provider: 'Google GKE', region: 'asia-east1'},
];

const K8S_METRICS_FIXTURE: Record<string, {latency: number; metrics: Omit<K8sClusterMetrics, 'latencyMs'>}> = {
  'cluster-us-east': {
    latency: 200,
    metrics: {cpuUsagePct: 42, memoryUsagePct: 65, activeNodes: 12, status: 'healthy'},
  },
  'cluster-eu-west': {
    latency: 500,
    metrics: {cpuUsagePct: 78, memoryUsagePct: 82, activeNodes: 24, status: 'healthy'},
  },
  'cluster-apac-edge': {
    latency: 1200,
    metrics: {cpuUsagePct: 94, memoryUsagePct: 91, activeNodes: 6, status: 'degraded'},
  },
};

@Component({
  selector: 'app-query-resources-demo',
  imports: [
    JsonPipe,
    CollectionStarterComponent,
    RouterLink,
    ClarityModule,
    PageContainerComponent,
    SpinnerComponent,
    TranslatePipe,
    DemoPlaygroundComponent,
    QueryStatusDirective,
  ],
  providers: [
    QueryDemoBackend,
    QueryFailureBackend,
    {provide: HttpClient, useFactory: () => new HttpClient(inject(QueryDemoBackend))},
  ],
  templateUrl: './query-resources.component.html',
  styleUrl: './query-resources.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueryResourcesDemoComponent {
  readonly backend = inject(QueryDemoBackend);
  readonly failureBackend = inject(QueryFailureBackend);
  private readonly failureHttp = new HttpClient(this.failureBackend);
  private readonly queryClient = inject(QUERY_CLIENT);

  readonly rowQueries = queryResources(
    () => ['a', 'b'],
    (id) => ({
      key: ['collection-demo', 'rows', id],
      staleTime: 30_000,
      gcTime: 0,
      deadlineMs: 5000,
      cancelOnNoObservers: true,
      loader: () => this.failureHttp.get<FailureDemoData>(`/query-failure/rows/${id}`),
    }),
  );

  // --- Demo 3: Kubernetes Cluster Monitoring ---
  private fetchK8sClusters(): Observable<K8sCluster[]> {
    return of([...K8S_CLUSTERS]).pipe(delay(100));
  }

  private fetchClusterMetrics(clusterId: string): Observable<K8sClusterMetrics> {
    const fixture = K8S_METRICS_FIXTURE[clusterId] ?? {
      latency: 250,
      metrics: {cpuUsagePct: 50, memoryUsagePct: 50, activeNodes: 4, status: 'healthy' as const},
    };
    return of({...fixture.metrics, latencyMs: fixture.latency}).pipe(delay(fixture.latency));
  }

  // Approach 1: Traditional Bulk Aggregation with forkJoin
  readonly clustersBulkQuery = queryResource<K8sClusterBulkItem[]>(() => ({
    key: ['k8s-demo', 'clusters-bulk-fleet'],
    staleTime: 30_000,
    gcTime: 0,
    deadlineMs: 5000,
    cancelOnNoObservers: true,
    loader: () =>
      this.fetchK8sClusters().pipe(
        switchMap((clusters) => {
          if (!clusters.length) return of<K8sClusterBulkItem[]>([]);
          const requests: Observable<K8sClusterBulkItem>[] = clusters.map((c) =>
            this.fetchClusterMetrics(c.id).pipe(
              map((metrics): K8sClusterBulkItem => ({...c, metrics})),
              catchError((err: unknown) => of<K8sClusterBulkItem>({...c, metrics: null, error: String(err)})),
            ),
          );
          return forkJoin(requests);
        }),
      ),
  }));

  // Approach 2: Granular Reactive Collection
  readonly clustersListQuery = queryResource(() => ({
    key: ['k8s-demo', 'clusters-parent-list'],
    tags: [{type: 'k8s-fleet-demo'}],
    staleTime: 60_000,
    gcTime: 0,
    deadlineMs: 5000,
    cancelOnNoObservers: true,
    loader: () => this.fetchK8sClusters(),
  }));

  readonly clusterItemQueries = queryResources(
    () => this.clustersListQuery.value() ?? [],
    (cluster) => ({
      key: ['k8s-demo', 'cluster-metric', cluster.id],
      tags: [{type: 'k8s-fleet-demo'}, {type: 'k8s-cluster', id: cluster.id}],
      staleTime: 30_000,
      gcTime: 0,
      deadlineMs: 5000,
      cancelOnNoObservers: true,
      loader: () => this.fetchClusterMetrics(cluster.id),
    }),
  );

  readonly isFleetRefreshing = computed(
    () => this.clustersListQuery.isRefreshing() || this.clusterItemQueries().some((q) => q.isRefreshing()),
  );

  reloadBulkFleet() {
    this.clustersBulkQuery.reload();
  }

  reloadGranularFleet() {
    this.queryClient.invalidateTags([{type: 'k8s-fleet-demo'}]);
  }

  readonly dynamicCode = highlight(COLLECTION_STARTER_SOURCE);
  readonly dynamicHtmlCode = highlight(COLLECTION_STARTER_TEMPLATE, 'html');

  readonly rowCode = highlight(`@for (row of rowQueries(); track row.key) {
  <p>{{ row.item() }}: {{ row.status() }}</p>
  @if (row.hasValue()) {
    <p>{{ row.value()?.value }}</p>
  }
  @if (row.isInitialError()) {
    <button (click)="row.reload()">Retry this read</button>
  }
}
<!-- Each row exposes the single-query signals and controls.
     item() identifies the input even when no data has loaded. -->`);

  readonly k8sTraditionalCode = highlight(`// Approach 1: Traditional Bulk Aggregation (switchMap + forkJoin)
readonly clustersBulkQuery = queryResource(() => ({
  key: ['k8s', 'clusters-bulk-view'],
  staleTime: 30_000,
  loader: () =>
    this.http.get<ClusterSummary[]>('/api/v1/clusters').pipe(
      switchMap((clusters) => {
        if (!clusters.length) return of([]);
        const requests = clusters.map((cluster) =>
          this.http.get<ClusterMetrics>(\`/api/v1/clusters/\${cluster.id}/metrics\`).pipe(
            map((metrics) => ({...cluster, metrics})),
            catchError((err) => of({...cluster, metrics: null, error: err.message})),
          ),
        );
        return forkJoin(requests);
      }),
    ),
}));

reloadBulkFleet() {
  this.clustersBulkQuery.reload();
}

// In template:
// <button [clrLoading]="clustersBulkQuery.isRefreshing()" (click)="reloadBulkFleet()">
//   <clr-icon shape="refresh" /> Refresh Fleet
// </button>`);

  readonly k8sGranularCode = highlight(`// Approach 2: Granular Reactive Collection (queryResource + queryResources)
// 1. Parent query: fetches master cluster list
readonly clustersListQuery = queryResource(() => ({
  key: ['k8s', 'clusters-list'],
  tags: [{type: 'k8s-fleet'}],
  staleTime: 60_000,
  loader: () => this.http.get<ClusterSummary[]>('/api/v1/clusters'),
}));

// 2. Child collection: independent query per cluster
readonly clusterItemQueries = queryResources(
  () => this.clustersListQuery.value() ?? [],
  (cluster) => ({
    key: ['k8s', 'cluster-metrics', cluster.id],
    tags: [{type: 'k8s-fleet'}, {type: 'k8s-cluster', id: cluster.id}],
    staleTime: 30_000,
    cancelOnNoObservers: true,
    loader: () => this.http.get<ClusterMetrics>(\`/api/v1/clusters/\${cluster.id}/metrics\`),
  }),
);

// Reload entire fleet via tag invalidation:
reloadGranularFleet() {
  this.queryClient.invalidateTags([{type: 'k8s-fleet'}]);
}

// In template:
// <button [clrLoading]="isFleetRefreshing()" (click)="reloadGranularFleet()">
//   <clr-icon shape="refresh" /> Refresh Fleet
// </button>
// <button [clrLoading]="query.isRefreshing()" (click)="query.reload()">
//   Reload Cluster
// </button>`);
}
