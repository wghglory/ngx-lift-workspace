import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {PageContainerComponent, SpinnerComponent, TranslatePipe} from 'clr-lift';
import {mutateResource, QUERY_CLIENT, QueryClientDiagnostics, queryResource, QueryResourceRef} from 'ngx-lift';

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
  ],
  templateUrl: './query-resource.component.html',
  styleUrls: ['./query-resource.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueryResourceDemoComponent {
  private readonly queryClient = inject(QUERY_CLIENT);

  diagnostics = signal<QueryClientDiagnostics>(this.queryClient.getDiagnostics());

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
const statsA = queryResource(() => ({
  key: ['metrics', 'cluster-overview'],
  loader: ({ abortSignal }) => fetch('/api/metrics', { signal: abortSignal }),
  staleTime: 5000,
}));

const statsB = queryResource(() => ({
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
  readonly queryResourceApiProps: ApiProperty[] = [
    {
      name: 'definition',
      type: '() => QueryResourceDefinition<T> | undefined',
      description: 'Reactive factory with an Observable or Promise loader, or undefined to disable.',
    },
    {
      name: 'options.pollInterval',
      type: 'number | (() => number | undefined)',
      description: 'Milliseconds between completed requests. Coordinated across all active observers.',
    },
    {
      name: 'options.injector',
      type: 'Injector',
      description: 'Optional explicit Angular Injector for signal registration outside injection context.',
    },
    {
      name: 'options.client',
      type: 'QueryClient',
      description: 'Optional explicit QueryClient override (defaults to QUERY_CLIENT token).',
    },
  ];

  readonly queryResourceDefinitionProps: ApiProperty[] = [
    {
      name: 'key',
      type: 'QueryKey',
      description: 'Array of JSON-compatible values uniquely identifying the query (e.g. ["user", id]).',
    },
    {
      name: 'loader',
      type: '(context: QueryLoaderContext) => Promise<T> | Observable<T>',
      description:
        'Data fetcher receiving { abortSignal, refresh }. Observable reads automatically complete after the first emission.',
    },
    {
      name: 'tags',
      type: 'readonly QueryTag[]',
      description: 'Optional tags for cache invalidation (e.g. [{ type: "users" }]).',
    },
    {
      name: 'staleTime',
      type: 'number',
      defaultValue: '0',
      description: 'Duration in milliseconds before cached data is considered stale.',
    },
    {
      name: 'gcTime',
      type: 'number',
      defaultValue: '300000',
      description: 'Duration in milliseconds (default 5 minutes) to retain unused queries in cache.',
    },
    {
      name: 'cancelOnNoObservers',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Whether to abort an in-flight transport request if all observers unmount before completion.',
    },
  ];

  readonly queryResourceRefApiProps: ApiProperty[] = [
    {
      name: 'value',
      type: 'Signal<T>',
      description: 'Signal holding the latest successfully resolved query data.',
    },
    {
      name: 'error',
      type: 'Signal<E | null>',
      description: 'Signal holding the most recent error, or null when healthy.',
    },
    {
      name: 'status',
      type: 'Signal<QueryStatus>',
      description: 'Granular status: "idle" | "loading" | "reloading" | "resolved" | "error".',
    },
    {
      name: 'isLoading',
      type: 'Signal<boolean>',
      description: 'True when status is "loading" or "reloading".',
    },
    {
      name: 'isStale',
      type: 'Signal<boolean>',
      description: 'True when data has exceeded staleTime or was invalidated by a mutation.',
    },
    {
      name: 'hasValue()',
      type: '() => boolean',
      description: 'Type predicate narrowing value() to exclude undefined when valid data is present.',
    },
    {
      name: 'reload()',
      type: '() => boolean',
      description: 'Triggers a background refresh without wiping existing data (status: "reloading").',
    },
    {
      name: 'execute()',
      type: '() => Promise<T>',
      description: 'Forces an immediate fresh fetch and returns a Promise settling with the result.',
    },
    {
      name: 'destroy()',
      type: '() => void',
      description: 'Detaches this observer without canceling shared queries if other observers remain.',
    },
  ];
}
