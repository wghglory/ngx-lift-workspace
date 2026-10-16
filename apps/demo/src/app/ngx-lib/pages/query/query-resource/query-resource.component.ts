import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, DestroyRef, inject, signal, computed} from '@angular/core';
import {RouterLink} from '@angular/router';
import {QueryStatusDirective} from '../query-status.directive';
import {FormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {CalloutComponent, PageContainerComponent, SpinnerComponent, TranslatePipe, TranslationService} from 'clr-lift';
import {mutateResource, QUERY_CLIENT, QueryClientDiagnostics, queryResource, QueryResourceRef} from 'ngx-lift';

import {QueryFailureExamplesComponent} from './query-failure-examples.component';
import {ApiProperty, ApiTableComponent} from '../../../../shared/components/api-table';
import {DemoPlaygroundComponent} from '../../../../shared/components/demo-playground/demo-playground.component';
import {highlight} from '../../../../shared/utils/highlight.util';
import {ClarityIcons, refreshIcon} from '@clr/angular/icon';

ClarityIcons.addIcons(refreshIcon);

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

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface DemoDatabaseDetails {
  name: string;
  engine: string;
  cpu: string;
  ram: string;
}

@Component({
  selector: 'app-query-resource-demo',
  imports: [
    CommonModule,
    RouterLink,
    QueryStatusDirective,
    FormsModule,
    ClarityModule,
    CalloutComponent,
    PageContainerComponent,
    SpinnerComponent,
    TranslatePipe,
    DemoPlaygroundComponent,
    ApiTableComponent,
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
  // Placement Architecture: Component vs Service
  // ---------------------------------------------------------------------------
  readonly demoAuthUser = signal<UserProfile>({
    id: 'usr-901',
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    role: 'Platform Admin',
  });

  readonly demoAuthQuery = queryResource(() => ({
    key: ['demo-auth', 'current-user'],
    tags: [{type: 'User', id: 'me'}],
    loader: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return this.demoAuthUser();
    },
    staleTime: 60_000,
  }));

  readonly demoAuthMutation = mutateResource(
    async (changes: Partial<UserProfile>) => {
      await new Promise((resolve) => setTimeout(resolve, 400));
      this.demoAuthUser.update((user) => ({...user, ...changes}));
      return this.demoAuthUser();
    },
    {
      invalidatesTags: [{type: 'User', id: 'me'}],
    },
  );

  cycleDemoUserName(): void {
    const names = ['Alex Rivera', 'Jordan Lee', 'Taylor Morgan', 'Sam Chen'];
    const current = this.demoAuthUser().name;
    const nextIdx = (names.indexOf(current) + 1) % names.length;
    this.demoAuthMutation.mutate({name: names[nextIdx]});
  }

  readonly demoSelectedDbId = signal<string | null>('db-pg-01');

  readonly demoDbList = [
    {id: 'db-pg-01', name: 'Production PostgreSQL'},
    {id: 'db-ch-02', name: 'Analytics ClickHouse'},
    {id: 'db-rd-03', name: 'Session Cache Redis'},
  ];

  readonly demoDbDetailsQuery = queryResource(() => {
    const id = this.demoSelectedDbId();
    if (!id) return undefined;
    return {
      key: ['demo-db', id],
      loader: async () => {
        await new Promise((resolve) => setTimeout(resolve, 400));
        const dbs: Record<string, DemoDatabaseDetails> = {
          'db-pg-01': {name: 'Production PostgreSQL', engine: 'PostgreSQL 16.2', cpu: '8 vCPU', ram: '32 GB'},
          'db-ch-02': {name: 'Analytics ClickHouse', engine: 'ClickHouse 24.1', cpu: '16 vCPU', ram: '64 GB'},
          'db-rd-03': {name: 'Session Cache Redis', engine: 'Redis 7.2 Cluster', cpu: '4 vCPU', ram: '16 GB'},
        };
        return dbs[id] ?? {name: id, engine: 'Generic Engine', cpu: '2 vCPU', ram: '8 GB'};
      },
      staleTime: 10_000,
    };
  });

  selectDemoDb(id: string): void {
    this.demoSelectedDbId.set(id);
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

  metricsAQuery: QueryResourceRef<ServerMetrics | undefined> = queryResource(() =>
    this.widgetAShown()
      ? {
          key: ['metrics', 'cluster-overview'],
          loader: () => this.fetchMetrics(),
          staleTime: 4000,
        }
      : undefined,
  );

  metricsBQuery: QueryResourceRef<ServerMetrics | undefined> = queryResource(() =>
    this.widgetBShown()
      ? {
          key: ['metrics', 'cluster-overview'],
          loader: () => this.fetchMetrics(),
          staleTime: 4000,
        }
      : undefined,
  );

  refreshMetrics() {
    this.metricsAQuery.reload();
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
  newUserRole = signal('Platform Engineer');

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
      concurrency: 'exhaust',
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
  readonly diagnosticsCode = highlight(`private readonly queryClient = inject(QUERY_CLIENT);
readonly diagnostics = signal(this.queryClient.getDiagnostics());

refreshDiagnostics(): void {
  this.diagnostics.set(this.queryClient.getDiagnostics());
  const entries = this.queryClient.getEntriesSnapshot();
  for (const entry of entries) {
    console.log(entry.key, {
      status: entry.status,
      observers: entry.observerCount,
      failures: entry.failureCount,
      retryAt: entry.nextRetryAt,
    });
  }
}

// In template:
// <button (click)="refreshDiagnostics()">Refresh Diagnostics</button>`);

  readonly authServiceCode = highlight(`// 1. Singleton Root Service (Centralized state, query, and mutation)
@Injectable({providedIn: 'root'})
export class AuthStateService {
  private readonly http = inject(HttpClient);

  // Centralized cached query resource (follows *Query naming convention)
  readonly currentUserQuery = queryResource(() => ({
    key: ['auth', 'current-user'],
    tags: [{type: 'User', id: 'me'}],
    loader: () => this.http.get<UserProfile>('/api/me'),
    staleTime: 60_000,
  }));

  // Centralized mutation (follows *Mutation naming convention and ngx-lift signature)
  readonly updateProfileMutation = mutateResource(
    (changes: Partial<UserProfile>) => this.http.patch<UserProfile>('/api/me', changes),
    {invalidatesTags: [{type: 'User', id: 'me'}]},
  );
}

// 2. Consumed in Topbar Component:
@Component({
  selector: 'app-topbar',
  template: \`
    <header class="topbar">
      @if (authStateService.currentUserQuery.value(); as user) {
        <span>{{ user.name }} ({{ user.role }})</span>
      }
    </header>
  \`,
})
export class TopbarComponent {
  // Inject the service directly:
  readonly authStateService = inject(AuthStateService);
}

// 3. Consumed in User Profile Editor Component:
@Component({
  selector: 'app-user-profile-editor',
  template: \`
    @if (authStateService.currentUserQuery.value(); as user) {
      <button (click)="saveName('Alex Rivera')">Save Profile</button>
    }
  \`,
})
export class UserProfileEditorComponent {
  readonly authStateService = inject(AuthStateService);

  saveName(name: string) {
    this.authStateService.updateProfileMutation.mutate({name});
    // Invalidation updates both TopbarComponent and UserProfileEditorComponent synchronously!
  }
}`);

  readonly databaseServiceCode = highlight(`// 1. Dynamic Parameterized Feature Service
@Injectable({providedIn: 'root'})
export class DatabaseStateService {
  private readonly http = inject(HttpClient);
  readonly activeDatabaseId = signal<string | null>(null);

  // queryResource reacts automatically whenever activeDatabaseId() changes
  readonly databaseDetailsQuery = queryResource(() => {
    const id = this.activeDatabaseId();
    if (!id) return undefined; // Idle state when unselected

    return {
      key: ['databases', id],
      loader: () => this.http.get<DatabaseDetails>(\`/api/databases/\${id}\`),
      staleTime: 30_000,
    };
  });

  selectDatabase(id: string) {
    this.activeDatabaseId.set(id);
  }
}

// 2. Master View: List Component
@Component({
  selector: 'app-database-list',
  template: \`
    @for (db of databases; track db.id) {
      <button
        [class.active]="dbService.activeDatabaseId() === db.id"
        (click)="dbService.selectDatabase(db.id)"
      >
        {{ db.name }}
      </button>
    }
  \`,
})
export class DatabaseListComponent {
  readonly dbService = inject(DatabaseStateService);
  readonly databases = [
    {id: 'db-pg-01', name: 'Production PostgreSQL'},
    {id: 'db-ch-02', name: 'Analytics ClickHouse'},
  ];
}

// 3. Detail View: Detail Component
@Component({
  selector: 'app-database-detail',
  template: \`
    @if (dbService.activeDatabaseId(); as id) {
      @if (dbService.databaseDetailsQuery.isInitialLoading()) {
        <clr-spinner />
      } @else if (dbService.databaseDetailsQuery.value(); as details) {
        @if (dbService.databaseDetailsQuery.isRefreshing()) { <clr-spinner /> }
        <h3>{{ details.name }}</h3>
        <p>{{ details.engine }} | {{ details.cpu }}</p>
      }
    }
  \`,
})
export class DatabaseDetailComponent {
  readonly dbService = inject(DatabaseStateService);
}`);

  readonly componentPlacementCode = highlight(`// Direct Component Placement:
// Best for self-contained, single-use views where no other component
// needs to observe or coordinate with this data.

@Component({
  selector: 'app-project-detail',
  template: \`
    @if (projectQuery.isInitialLoading()) {
      <clr-spinner />
    } @else if (projectQuery.value(); as project) {
      @if (projectQuery.isRefreshing()) { <clr-spinner /> }
      <h2>{{ project.name }}</h2>
      <button (click)="projectQuery.reload()">Refresh</button>
    }
  \`,
})
export class ProjectDetailComponent {
  private readonly http = inject(HttpClient);
  readonly projectId = input.required<string>();

  // Self-contained: automatically created on mount, destroyed on unmount.
  // Directly reads the component's signal input:
  readonly projectQuery = queryResource(() => ({
    key: ['projects', this.projectId()],
    loader: () => this.http.get<Project>(\`/api/projects/\${this.projectId()}\`),
    staleTime: 30_000,
  }));
}`);

  readonly coalesceCode = highlight(`// Real-world scenario: Two independent components mounted on the same page
// (e.g. Global Topbar and Main Dashboard) both requesting the same cluster metrics.

// 1. Top Navigation Bar Component:
@Component({
  selector: 'app-topbar-status',
  template: \`
    @if (metricsQuery.value(); as metrics) {
      <span>Active Users: {{ metrics.activeUsers }} ({{ metricsQuery.status() }})</span>
    }
  \`,
})
export class TopbarStatusComponent {
  private readonly http = inject(HttpClient);

  readonly metricsQuery = queryResource(() => ({
    key: ['metrics', 'cluster-overview'],
    loader: () => this.http.get<ServerMetrics>('/api/metrics'),
    staleTime: 5000,
  }));
}

// 2. Main Dashboard Component:
@Component({
  selector: 'app-dashboard-metrics',
  template: \`
    @if (metricsQuery.value(); as metrics) {
      <div>CPU: {{ metrics.cpuLoad }}% | Memory: {{ metrics.memoryUsage }}%</div>
    }
    <button (click)="metricsQuery.reload()">Reload Query</button>
  \`,
})
export class DashboardMetricsComponent {
  private readonly http = inject(HttpClient);

  readonly metricsQuery = queryResource(() => ({
    key: ['metrics', 'cluster-overview'],
    loader: () => this.http.get<ServerMetrics>('/api/metrics'),
    staleTime: 5000,
  }));
}

// When the route loads both components concurrently:
// QueryClient detects the shared key ['metrics', 'cluster-overview'],
// executes only 1 HTTP request, and synchronously delivers the data to both!`);

  readonly pollCode = highlight(`// Polling is coordinated globally by QueryClient:
// - Multiple observers join the fastest requested interval.
// - Automatically pauses when document visibility is hidden.
// - Resumes on visibility return without duplicate bursts.
readonly pollingEnabled = signal(false);

readonly statusQuery = queryResource(
  () =>
    this.pollingEnabled()
      ? {
          key: ['system', 'heartbeat'],
          loader: () => this.api.checkHealth(),
          staleTime: 0,
        }
      : undefined,
  {
    pollInterval: () => (this.pollingEnabled() ? 3000 : undefined),
  },
);

togglePolling() {
  this.pollingEnabled.update((v) => !v);
}

// In template:
// <button (click)="togglePolling()">{{ pollingEnabled() ? 'Stop Polling' : 'Start Polling' }}</button>`);

  readonly mutationCode = highlight(`// Define query with cache tags
readonly usersQuery = queryResource(() => ({
  key: ['users', 'list'],
  tags: [{type: 'users'}],
  loader: () => this.userService.getAll(),
  staleTime: 60_000,
}));

// Define mutation that invalidates 'users' tag on success
readonly addUserMutation = mutateResource((payload: NewUser) => this.userService.create(payload), {
  invalidatesTags: [{type: 'users'}],
  concurrency: 'exhaust', // prevents double-submit
});

submitNewUser() {
  if (!this.newUserName().trim()) return;
  this.addUserMutation.mutate({
    name: this.newUserName().trim(),
    role: this.newUserRole(),
  });
  this.newUserName.set('');
}

// In template:
// <button [disabled]="!newUserName().trim() || addUserMutation.isLoading()" (click)="submitNewUser()">
//   Add Member
// </button>
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
      type: 'Signal<T | undefined>',
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
