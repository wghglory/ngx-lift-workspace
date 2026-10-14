import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, DestroyRef, inject, signal, computed} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {PageContainerComponent, SpinnerComponent, TranslatePipe, TranslationService} from 'clr-lift';
import {mutateResource, QUERY_CLIENT, QueryClientDiagnostics, queryResource, QueryResourceRef} from 'ngx-lift';

import {QueryFailureExamplesComponent} from './query-failure-examples.component';
import {QueryUsageExamplesComponent} from './query-usage-examples.component';
import {ApiProperty, ApiTableComponent} from '../../../../shared/components/api-table';
import {DemoPlaygroundComponent} from '../../../../shared/components/demo-playground/demo-playground.component';
import {highlight} from '../../../../shared/utils/highlight.util';

interface ServerMetrics {
  activeUsers: number;
  cpuLoad: number;
  memoryUsage: number;
  timestamp: string;
}

interface DemoUser {
  id: number;
  name: string;
  role: string;
}

@Component({
  selector: 'app-query-resource-demo',
  imports: [
    CommonModule,
    FormsModule,
    ClarityModule,
    PageContainerComponent,
    SpinnerComponent,
    TranslatePipe,
    DemoPlaygroundComponent,
    ApiTableComponent,
    QueryUsageExamplesComponent,
    QueryFailureExamplesComponent,
  ],
  templateUrl: './query-resource.component.html',
  styleUrls: ['./query-resource.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueryResourceDemoComponent {
  private readonly translationService = inject(TranslationService);

  private readonly queryClient = inject(QUERY_CLIENT);

  diagnostics = signal<QueryClientDiagnostics>(this.queryClient.getDiagnostics());

  constructor() {
    const timer = setInterval(() => this.refreshDiagnostics(), 1000);
    inject(DestroyRef).onDestroy(() => clearInterval(timer));
  }

  refreshDiagnostics() {
    this.diagnostics.set(this.queryClient.getDiagnostics());
  }

  // ---------------------------------------------------------------------------
  // Demo 1: Request Coalescing / Deduplication
  // ---------------------------------------------------------------------------
  coalesceFetchCount = signal(0);
  widgetAShown = signal(true);
  widgetBShown = signal(true);

  private async fetchMetrics(): Promise<ServerMetrics> {
    this.coalesceFetchCount.update((count) => count + 1);
    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      activeUsers: 142 + Math.floor(Math.random() * 20),
      cpuLoad: Math.floor(35 + Math.random() * 25),
      memoryUsage: Math.floor(60 + Math.random() * 15),
      timestamp: new Date().toLocaleTimeString(),
    };
  }

  metricsQueryA: QueryResourceRef<ServerMetrics | undefined> = queryResource(() =>
    this.widgetAShown()
      ? {
          key: ['metrics', 'cluster-overview'],
          loader: () => this.fetchMetrics(),
          staleTime: 4000,
        }
      : undefined,
  );

  metricsQueryB: QueryResourceRef<ServerMetrics | undefined> = queryResource(() =>
    this.widgetBShown()
      ? {
          key: ['metrics', 'cluster-overview'],
          loader: () => this.fetchMetrics(),
          staleTime: 4000,
        }
      : undefined,
  );

  refreshMetrics() {
    this.metricsQueryA.reload();
    this.refreshDiagnostics();
  }

  // ---------------------------------------------------------------------------
  // Demo 2: Stale-While-Revalidate & Cache Timing
  // ---------------------------------------------------------------------------
  cacheHitCount = signal(0);
  cacheNetworkCount = signal(0);
  staleTimeSeconds = signal(5);

  cacheQuery = queryResource(() => ({
    key: ['cluster', 'nodes'],
    loader: async () => {
      this.cacheNetworkCount.update((c) => c + 1);
      await new Promise((resolve) => setTimeout(resolve, 800));
      return {
        nodeCount: 8,
        healthy: 8,
        region: 'us-west-2',
        lastUpdated: new Date().toLocaleTimeString(),
      };
    },
    staleTime: this.staleTimeSeconds() * 1000,
    gcTime: 60000,
  }));

  // ---------------------------------------------------------------------------
  // Demo 3: Coordinated Polling
  // ---------------------------------------------------------------------------
  pollingIntervalSeconds = signal(3);
  pollingEnabled = signal(false);
  pollNetworkCount = signal(0);

  pollingQuery = queryResource(
    () =>
      this.pollingEnabled()
        ? {
            key: ['system', 'heartbeat'],
            loader: async () => {
              this.pollNetworkCount.update((c) => c + 1);
              await new Promise((resolve) => setTimeout(resolve, 300));
              return {
                status: 'ONLINE',
                pingMs: Math.floor(15 + Math.random() * 12),
                lastPing: new Date().toLocaleTimeString(),
              };
            },
            staleTime: 0,
          }
        : undefined,
    {
      pollInterval: () => (this.pollingEnabled() ? this.pollingIntervalSeconds() * 1000 : undefined),
    },
  );

  togglePolling() {
    this.pollingEnabled.update((v) => !v);
    this.refreshDiagnostics();
  }

  // ---------------------------------------------------------------------------
  // Demo 4: Mutation & Tag-based Invalidation
  // ---------------------------------------------------------------------------
  userList = signal<DemoUser[]>([
    {id: 1, name: 'Alice Smith', role: 'Platform Admin'},
    {id: 2, name: 'Bob Jones', role: 'DevOps Engineer'},
  ]);

  usersQuery = queryResource(() => ({
    key: ['users', 'list'],
    tags: [{type: 'users'}],
    staleTime: 60000,
    loader: async () => {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return [...this.userList()];
    },
  }));

  newUserName = signal('');
  newUserRole = signal('Developer');
  mutationConcurrency = signal<'exhaust' | 'concat' | 'parallel'>('exhaust');

  addUserMutation = mutateResource(
    async (payload: {name: string; role: string}) => {
      await new Promise((resolve) => setTimeout(resolve, 700));
      const created: DemoUser = {
        id: Date.now(),
        name: payload.name,
        role: payload.role,
      };
      this.userList.update((list) => [...list, created]);
      return created;
    },
    {
      invalidatesTags: [{type: 'users'}],
      concurrency: this.mutationConcurrency(),
    },
  );

  submitNewUser() {
    if (!this.newUserName().trim()) return;
    this.addUserMutation.mutate({
      name: this.newUserName().trim(),
      role: this.newUserRole(),
    });
    this.newUserName.set('');
    this.refreshDiagnostics();
  }

  // ---------------------------------------------------------------------------
  // Code Snippets for DemoPlayground
  // ---------------------------------------------------------------------------
  readonly diagnosticsCode = highlight(`// 5. Developer Diagnostics & Cache Inspector
// QueryClient provides inspection hooks for developer tools, telemetry, and debugging
const diagnostics = queryClient.getDiagnostics();
console.log('Total entries:', diagnostics.entryCount);
console.log('Active queries:', diagnostics.activeEntryCount);
console.log('Total observers:', diagnostics.totalObserverCount);

// Inspect individual cache entry metrics & scheduling
const entries = queryClient.getEntriesSnapshot();
for (const entry of entries) {
  console.log(entry.key, {
    status: entry.status,
    observers: entry.observerCount,
    isStale: entry.isStale,
    remainingGc: entry.remainingGcTime,
    remainingPoll: entry.remainingPollDelay,
    failures: entry.failureCount,
    retryAt: entry.nextRetryAt,
  });
}`);

  readonly compareCode = highlight(`// 1. resourceAsync: Local component async state
// Best for: component-owned form submissions, local search inputs, transient state
const userRef = resourceAsync(() => this.http.get<User>('/api/profile'));

// 2. queryResource: Shared entity state with client-wide caching & deduplication
// Best for: server state shared across routes/components, polling, tag invalidation
const profileQuery = queryResource(() => ({
  key: ['user', userId()],
  tags: [{ type: 'users', id: userId() }],
  loader: () => this.http.get<User>('/api/profile'),
  staleTime: 30_000,     // 30s freshness
  gcTime: 300_000,       // 5m cache retention
}), {
  pollInterval: 10_000,  // Background polling coordinated across observers
});

// 3. mutateResource: Invalidate cached queries automatically
const updateProfile = mutateResource(
  (data: UpdateUserDto) => this.http.patch('/api/profile', data),
  {
    invalidatesTags: (result) => [{ type: 'users', id: result.id }],
    concurrency: 'exhaust', // 'parallel' | 'exhaust' | 'concat'
  }
);`);

  readonly coalesceCode = highlight(`// Component A and Component B observe the SAME query key
// Even when mounted concurrently, QueryClient executes only 1 HTTP request!
const statsQueryA = queryResource(() => ({
  key: ['metrics', 'cluster-overview'],
  loader: ({ abortSignal }) => fetch('/api/metrics', { signal: abortSignal }),
  staleTime: 5000,
}));

const statsQueryB = queryResource(() => ({
  key: ['metrics', 'cluster-overview'],
  loader: ({ abortSignal }) => fetch('/api/metrics', { signal: abortSignal }),
  staleTime: 5000,
}));`);

  readonly pollCode = highlight(`// Polling is coordinated globally by QueryClient:
// - Multiple observers join the fastest requested interval.
// - Automatically pauses when document visibility is hidden.
// - Resumes on visibility return without duplicate bursts.
const statusQuery = queryResource(
  () => ({
    key: ['system', 'heartbeat'],
    loader: () => this.api.checkHealth(),
  }),
  {
    pollInterval: 3000, // polls every 3 seconds
  }
);`);

  readonly mutationCode = highlight(`// Define query with cache tags
const usersQuery = queryResource(() => ({
  key: ['users', 'list'],
  tags: [{ type: 'users' }],
  loader: () => this.userService.getAll(),
  staleTime: 60_000,
}));

// Define mutation that invalidates 'users' tag on success
// Provides mutateResource
const addUser = mutateResource(
  (payload: NewUser) => this.userService.create(payload),
  {
    invalidatesTags: [{ type: 'users' }],
    concurrency: 'exhaust', // prevents double-submit
  }
);

// In template or handler:
// await addUser.mutate({ name: 'Alice', role: 'Admin' });
// -> usersQuery automatically refetches fresh data in the background!`);

  // ---------------------------------------------------------------------------
  // API Reference Tables
  // ---------------------------------------------------------------------------
  readonly queryResourceApiProps = computed<ApiProperty[]>(() => [
    {
      name: 'options.refetchOnFocus',
      type: 'boolean',
      defaultValue: 'false',
      description: this.translationService.translate('queryExamples.recoveryFocusDescription'),
    },
    {
      name: 'options.refetchOnReconnect',
      type: 'boolean',
      defaultValue: 'false',
      description: this.translationService.translate('queryExamples.recoveryReconnectDescription'),
    },
    {
      name: 'definition',
      type: '() => QueryResourceDefinition<T> | undefined',
      description: this.translationService.translate('demoApi.query-resource.queryResourceApiProps.definition'),
    },
    {
      name: 'options.pollInterval',
      type: 'number | (() => number | undefined)',
      description: this.translationService.translate(
        'demoApi.query-resource.queryResourceApiProps.options.pollInterval',
      ),
    },
    {
      name: 'options.injector',
      type: 'Injector',
      description: this.translationService.translate('demoApi.query-resource.queryResourceApiProps.options.injector'),
    },
    {
      name: 'options.client',
      type: 'QueryClient',
      description: this.translationService.translate('demoApi.query-resource.queryResourceApiProps.options.client'),
    },
  ]);

  readonly queryResourceDefinitionProps = computed<ApiProperty[]>(() => [
    {
      name: 'retry',
      type: 'false | QueryRetryOptions',
      defaultValue: 'false',
      description: this.translationService.translate('queryExamples.retryDescription'),
    },
    {
      name: 'deadlineMs',
      type: 'number | false',
      defaultValue: 'undefined',
      description: this.translationService.translate('queryExamples.deadlineDescription'),
    },
    {
      name: 'key',
      type: 'QueryKey',
      description: this.translationService.translate('demoApi.query-resource.queryResourceDefinitionProps.key'),
    },
    {
      name: 'loader',
      type: '(context: QueryLoaderContext) => PromiseLike<T> | Observable<T>',
      description: this.translationService.translate('demoApi.query-resource.queryResourceDefinitionProps.loader'),
    },
    {
      name: 'tags',
      type: 'readonly QueryTag[]',
      description: this.translationService.translate('demoApi.query-resource.queryResourceDefinitionProps.tags'),
    },
    {
      name: 'staleTime',
      type: 'number',
      defaultValue: '0',
      description: this.translationService.translate('demoApi.query-resource.queryResourceDefinitionProps.staleTime'),
    },
    {
      name: 'gcTime',
      type: 'number',
      defaultValue: '300000',
      description: this.translationService.translate('demoApi.query-resource.queryResourceDefinitionProps.gcTime'),
    },
    {
      name: 'cancelOnNoObservers',
      type: 'boolean',
      defaultValue: 'false',
      description: this.translationService.translate(
        'demoApi.query-resource.queryResourceDefinitionProps.cancelOnNoObservers',
      ),
    },
  ]);

  readonly queryResourceRefApiProps = computed<ApiProperty[]>(() => [
    {
      name: 'isInitialError',
      type: 'Signal<boolean>',
      description: this.translationService.translate('queryExamples.isInitialErrorDescription'),
    },
    {
      name: 'isRefreshError',
      type: 'Signal<boolean>',
      description: this.translationService.translate('queryExamples.isRefreshErrorDescription'),
    },
    {
      name: 'updatedAt',
      type: 'Signal<number | null>',
      description: this.translationService.translate('queryExamples.updatedAtDescription'),
    },
    {
      name: 'failureCount',
      type: 'Signal<number>',
      description: this.translationService.translate('queryExamples.failureCountDescription'),
    },
    {
      name: 'failureReason',
      type: 'Signal<unknown | null>',
      description: this.translationService.translate('queryExamples.failureReasonDescription'),
    },
    {
      name: 'nextRetryAt',
      type: 'Signal<number | null>',
      description: this.translationService.translate('queryExamples.nextRetryAtDescription'),
    },
    {
      name: 'isInitialLoading',
      type: 'Signal<boolean>',
      description: this.translationService.translate('queryExamples.initialLoadingDescription'),
    },
    {
      name: 'isRefreshing',
      type: 'Signal<boolean>',
      description: this.translationService.translate('queryExamples.refreshingDescription'),
    },
    {
      name: 'value',
      type: 'Signal<T>',
      description: this.translationService.translate('demoApi.query-resource.queryResourceRefApiProps.value'),
    },
    {
      name: 'error',
      type: 'Signal<E | null>',
      description: this.translationService.translate('demoApi.query-resource.queryResourceRefApiProps.error'),
    },
    {
      name: 'status',
      type: 'Signal<QueryStatus>',
      description: this.translationService.translate('demoApi.query-resource.queryResourceRefApiProps.status'),
    },
    {
      name: 'isLoading',
      type: 'Signal<boolean>',
      description: this.translationService.translate('demoApi.query-resource.queryResourceRefApiProps.isLoading'),
    },
    {
      name: 'isStale',
      type: 'Signal<boolean>',
      description: this.translationService.translate('demoApi.query-resource.queryResourceRefApiProps.isStale'),
    },
    {
      name: 'hasValue()',
      type: '() => boolean',
      description: this.translationService.translate('demoApi.query-resource.queryResourceRefApiProps.hasValue()'),
    },
    {
      name: 'reload()',
      type: '() => boolean',
      description: this.translationService.translate('demoApi.query-resource.queryResourceRefApiProps.reload()'),
    },
    {
      name: 'execute()',
      type: '() => Promise<T>',
      description: this.translationService.translate('demoApi.query-resource.queryResourceRefApiProps.execute()'),
    },
    {
      name: 'destroy()',
      type: '() => void',
      description: this.translationService.translate('demoApi.query-resource.queryResourceRefApiProps.destroy()'),
    },
  ]);
}
