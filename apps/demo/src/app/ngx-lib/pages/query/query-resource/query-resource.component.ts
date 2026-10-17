import {QueryStarterComponent, QUERY_STARTER_TEMPLATE} from '../query-starter/query-starter.component';
import {QUERY_STARTER_SOURCE} from '../query-starter/query-starter.example';
import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, signal, computed, viewChild} from '@angular/core';
import {RouterLink} from '@angular/router';
import {QueryStatusDirective} from '../query-status.directive';
import {FormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {
  PageContainerComponent,
  QueryDevtoolsComponent,
  SpinnerComponent,
  TranslatePipe,
  TranslationService,
} from 'clr-lift';
import {mutateResource, queryResource} from 'ngx-lift';

import {AuthPlacementDemoComponent} from './auth-placement-demo.component';
import {QueryFailureExamplesComponent} from './query-failure-examples.component';
import {MetricsService} from './metrics.service';
import {MetricsWidgetComponent} from './metrics-widget.component';
import {DatabaseStateService} from './query-placement-state';
import {ProjectDetailDemoComponent} from './project-detail-demo.component';
import {ApiProperty, ApiTableComponent} from '../../../../shared/components/api-table';
import {DemoPlaygroundComponent} from '../../../../shared/components/demo-playground/demo-playground.component';
import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';
import {ClarityIcons, refreshIcon} from '@clr/angular/icon';

ClarityIcons.addIcons(refreshIcon);

interface DemoUser {
  id: number;
  name: string;
  role: string;
}

@Component({
  selector: 'app-query-resource-demo',
  imports: [
    CommonModule,
    QueryStarterComponent,
    RouterLink,
    QueryStatusDirective,
    FormsModule,
    ClarityModule,
    PageContainerComponent,
    QueryDevtoolsComponent,
    SpinnerComponent,
    TranslatePipe,
    DemoPlaygroundComponent,
    CodeBlockComponent,
    ApiTableComponent,
    QueryFailureExamplesComponent,
    ProjectDetailDemoComponent,
    AuthPlacementDemoComponent,
    MetricsWidgetComponent,
  ],
  providers: [DatabaseStateService, MetricsService],
  templateUrl: './query-resource.component.html',
  styleUrls: ['./query-resource.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueryResourceDemoComponent {
  private readonly translationService = inject(TranslationService);
  readonly starterCode = highlight(QUERY_STARTER_SOURCE);
  readonly starterHtmlCode = highlight(QUERY_STARTER_TEMPLATE, 'html');
  readonly httpSetupCode = highlight(`import {ApplicationConfig} from '@angular/core';
import {provideHttpClient} from '@angular/common/http';

export const appConfig: ApplicationConfig = {providers: [provideHttpClient()]};`);

  // ---------------------------------------------------------------------------
  // Placement Architecture: Component vs Service
  // ---------------------------------------------------------------------------
  readonly databaseStateService = inject(DatabaseStateService);

  // ---------------------------------------------------------------------------
  // Demo 1: Request Coalescing / Deduplication
  // ---------------------------------------------------------------------------
  readonly metricsService = inject(MetricsService);

  readonly metricsWidget = viewChild(MetricsWidgetComponent);

  refreshMetrics(): void {
    this.metricsWidget()?.metricsQuery.reload();
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
      invalidateTags: [{type: 'users'}],
      concurrency: 'exhaust',
    },
  );

  submitNewUser() {
    if (!this.newUserName().trim()) return;
    void this.addUserMutation.mutate({
      name: this.newUserName().trim(),
      role: this.newUserRole(),
    });
    this.newUserName.set('');
  }

  // ---------------------------------------------------------------------------
  // Code Snippets for DemoPlayground
  // ---------------------------------------------------------------------------
  readonly diagnosticsCode = highlight(`import {Component} from '@angular/core';
import {QueryDevtoolsComponent} from 'clr-lift';

@Component({
  selector: 'app-query-diagnostics-demo',
  imports: [QueryDevtoolsComponent],
  template: '<cll-query-devtools [enabled]="true" />',
})
export class QueryDiagnosticsDemoComponent {}`);

  readonly diagnosticsHtmlCode = highlight(`<cll-query-devtools [enabled]="true" />`, 'html');

  readonly diagnosticsSetupCode = highlight(`import {ApplicationConfig} from '@angular/core';
import {provideQueryDevtools} from 'clr-lift/devtools';

export const appConfig: ApplicationConfig = {
  providers: [provideQueryDevtools()],
};`);

  readonly authServiceCode =
    highlight(`import {ChangeDetectionStrategy, Component, inject, Injectable} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {SpinnerComponent, TranslatePipe} from 'clr-lift';
import {mutateResource, queryResource} from 'ngx-lift';
import {QueryStatusDirective} from '../query-status.directive';
import {UserProfile, UserProfileService} from './user-profile.service';

@Injectable({providedIn: 'root'})
export class AuthStateService {
  private readonly userProfileService = inject(UserProfileService);

  readonly currentUserQuery = queryResource(() => ({
    key: ['current-user'],
    tags: [{type: 'current-user'}],
    loader: () => this.userProfileService.getProfile(),
    staleTime: 60_000,
  }));
  readonly updateProfileMutation = mutateResource(
    (changes: Partial<UserProfile>) => this.userProfileService.updateProfile(changes),
    {
      invalidateTags: [{type: 'current-user'}],
      concurrency: 'exhaust',
    },
  );

  updateName(): void {
    const names = ['Alex Rivera', 'Jordan Lee', 'Taylor Morgan', 'Sam Chen'];
    const current = this.currentUserQuery.value();
    if (!current || this.currentUserQuery.isRefreshing()) return;
    const name = names[(names.indexOf(current.name) + 1) % names.length];
    void this.updateProfileMutation.mutate({name});
  }
}

@Component({
  selector: 'app-auth-placement-demo',
  imports: [ClarityModule, SpinnerComponent, TranslatePipe, QueryStatusDirective],
  templateUrl: './auth-placement-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthPlacementDemoComponent {
  readonly authStateService = inject(AuthStateService);
}
`);

  readonly authHtmlCode = highlight(`<div cds-layout="vertical gap:sm">
  <div class="card p-3">
    <div class="card-header font-weight-semibold">
      {{ 'queryResource.simulatedTopbar' | translate }}
    </div>
    <div class="card-block">
      @if (authStateService.currentUserQuery.isInitialLoading()) {
        <cll-spinner inline [size]="'sm'" />
        <span class="m-l-xs">{{ 'queryResource.loading' | translate }}</span>
      } @else if (authStateService.currentUserQuery.value(); as user) {
        @if (authStateService.currentUserQuery.isRefreshing()) {
          <cll-spinner inline [size]="'sm'" />
        }
        <span>
          <strong>{{ user.name }}</strong> ({{ user.role }}) &middot;
          <span class="text-secondary">{{ user.email }}</span>
        </span>
      }
    </div>
  </div>

  <div class="card p-3 m-t-sm">
    <div class="card-header font-weight-semibold">
      {{ 'queryResource.simulatedProfile' | translate }}
    </div>
    <div class="card-block" cds-layout="vertical gap:sm">
      @if (authStateService.currentUserQuery.value(); as user) {
        <p class="m-0">
          {{ 'queryResource.activeUser' | translate }}: <code>{{ user.name }}</code> &middot;
          {{ 'mutateResource.statusLabel' | translate }}:
          <span [appQueryStatus]="authStateService.currentUserQuery.status()">{{
            authStateService.currentUserQuery.status()
          }}</span>
        </p>
      }
      <button
        type="button"
        class="btn btn-sm btn-outline-primary"
        [clrLoading]="authStateService.updateProfileMutation.isLoading()"
        [disabled]="
          authStateService.updateProfileMutation.isLoading() ||
          authStateService.currentUserQuery.isLoading() ||
          !authStateService.currentUserQuery.hasValue()
        "
        (click)="authStateService.updateName()"
      >
        <clr-icon shape="refresh" />
        {{ 'queryResource.updateNameBtn' | translate }}
      </button>
    </div>
  </div>
</div>
`);

  readonly databaseServiceCode = highlight(`import {Component, inject, Injectable, signal} from '@angular/core';
import {SpinnerComponent} from 'clr-lift';
import {queryResource} from 'ngx-lift';
import {DatabaseService} from './database.service';

@Injectable()
export class DatabaseStateService {
  private readonly databaseService = inject(DatabaseService);

  readonly activeDatabaseId = signal('db-pg-01');
  readonly databases = [
    {id: 'db-pg-01', name: 'Production PostgreSQL'},
    {id: 'db-ch-02', name: 'Analytics ClickHouse'},
    {id: 'db-rd-03', name: 'Session Cache Redis'},
  ];
  readonly databaseDetailsQuery = queryResource(() => {
    const id = this.activeDatabaseId();
    return {
      key: ['databases', id],
      loader: () => this.databaseService.getDatabase(id),
      staleTime: 10_000,
    };
  });
  selectDatabase(id: string): void {
    this.activeDatabaseId.set(id);
  }
}

// Provide the service at the feature shell, not at root.
@Component({
  imports: [SpinnerComponent],
  providers: [DatabaseStateService],
  template: \`
    @for (db of databaseStateService.databases; track db.id) {
      <button (click)="databaseStateService.selectDatabase(db.id)">{{ db.name }}</button>
    }
    @if (databaseStateService.databaseDetailsQuery.isInitialLoading()) {
      <cll-spinner inline size="sm" />
    } @else if (databaseStateService.databaseDetailsQuery.value(); as details) {
      <h4>{{ details.name }}</h4>
      <p>{{ details.engine }} · {{ details.cpu }} / {{ details.ram }}</p>
      <span>{{ databaseStateService.databaseDetailsQuery.status() }}</span>
    }
  \`,
})
export class DatabaseFeatureComponent {
  readonly databaseStateService = inject(DatabaseStateService);
}`);

  readonly componentPlacementCode =
    highlight(`import {ChangeDetectionStrategy, Component, inject, Injectable, input} from '@angular/core';
import {AlertComponent, SpinnerComponent, TranslatePipe} from 'clr-lift';
import {queryResource} from 'ngx-lift';
import {QueryStatusDirective} from '../query-status.directive';

@Injectable({providedIn: 'root'})
export class ProjectService {
  private projectReads = 0;

  async getProject(id: string): Promise<{id: string; name: string; revision: number}> {
    const revision = ++this.projectReads;
    await new Promise((resolve) => setTimeout(resolve, 350));
    return {
      id,
      name: id === 'website-redesign' ? 'Website redesign' : 'Mobile application',
      revision,
    };
  }
}

@Component({
  selector: 'app-project-detail-demo',
  imports: [AlertComponent, SpinnerComponent, TranslatePipe, QueryStatusDirective],
  template: \`
    @if (projectQuery.isInitialLoading()) {
      <cll-spinner inline size="sm" />
    } @else if (projectQuery.value(); as project) {
      <div cds-layout="vertical gap:sm">
        <h3>{{ project.name }}</h3>
        <p data-testid="project-revision">{{ 'queryResource.projectRevision' | translate }}: {{ project.revision }}</p>
        <span [appQueryStatus]="projectQuery.status()">{{ projectQuery.status() }}</span>
        @if (projectQuery.isRefreshing()) {
          <cll-spinner inline size="sm" />
        }
        <button type="button" class="btn btn-sm btn-outline" (click)="projectQuery.reload()">
          {{ 'common.refresh' | translate }}
        </button>
      </div>
    }
    @if (projectQuery.error(); as error) {
      <cll-alert [content]="error.message" [alertType]="'danger'" />
    }
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetailDemoComponent {
  private readonly projectService = inject(ProjectService);

  readonly projectId = input.required<string>();
  readonly projectQuery = queryResource(() => {
    const id = this.projectId();
    return {
      key: ['projects', id],
      loader: () => this.projectService.getProject(id),
      staleTime: 30_000,
    };
  });
}`);

  readonly componentPlacementHtmlCode = highlight(`<app-project-detail-demo projectId="website-redesign" />`, 'html');

  readonly coalesceCode =
    highlight(`import {ChangeDetectionStrategy, Component, inject, Injectable, input, signal, viewChild} from '@angular/core';
import {SpinnerComponent, TranslatePipe} from 'clr-lift';
import {queryResource} from 'ngx-lift';
import {QueryStatusDirective} from '../query-status.directive';

interface ServerMetrics {
  activeUsers: number;
  cpuLoad: number;
  memoryUsage: number;
  timestamp: string;
}

@Injectable()
export class MetricsService {
  readonly readCount = signal(0);

  async getMetrics(): Promise<ServerMetrics> {
    this.readCount.update((count) => count + 1);
    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      activeUsers: 142 + Math.floor(Math.random() * 20),
      cpuLoad: Math.floor(35 + Math.random() * 25),
      memoryUsage: Math.floor(60 + Math.random() * 15),
      timestamp: new Date().toLocaleTimeString(),
    };
  }
}

@Component({
  selector: 'app-metrics-widget',
  imports: [SpinnerComponent, TranslatePipe, QueryStatusDirective],
  template: \`<div class="card widget-card">
    <div class="card-header">
      <div class="widget-header-text">
        <div class="card-title">
          <span class="label label-info m-r-xs">{{ variant() === 'topbar' ? 'Component 1' : 'Component 2' }}</span>
          {{ (variant() === 'topbar' ? 'queryResource.widgetATitle' : 'queryResource.widgetBTitle') | translate }}
        </div>
        <div class="card-subtitle text-muted">
          {{ (variant() === 'topbar' ? 'queryResource.widgetASubtitle' : 'queryResource.widgetBSubtitle') | translate }}
        </div>
      </div>
      @if (metricsQuery.isLoading()) {
        <cll-spinner inline [size]="'sm'" class="m-l-xs" />
      }
    </div>
    <div class="card-block">
      @if (metricsQuery.value(); as data) {
        <div class="widget-metrics">
          <p class="p7">
            {{ (variant() === 'topbar' ? 'queryResource.activeUsers' : 'queryResource.memoryUsage') | translate }}:
            <strong
              >{{ variant() === 'topbar' ? data.activeUsers : data.memoryUsage
              }}{{ variant() === 'dashboard' ? '%' : '' }}</strong
            >
          </p>
          <p class="p7">
            {{ 'queryResource.cpuLoad' | translate }}: <strong>{{ data.cpuLoad }}%</strong>
          </p>
          <p class="p7">
            {{ 'queryResource.status' | translate }}:
            <span [appQueryStatus]="metricsQuery.status()">{{ metricsQuery.status() }}</span>
          </p>
          <p class="p7 text-muted">{{ 'queryResource.updated' | translate }}: {{ data.timestamp }}</p>
        </div>
      }
    </div>
  </div> \`,
  styleUrl: './metrics-widget.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricsWidgetComponent {
  private readonly metricsService = inject(MetricsService);

  readonly variant = input.required<'topbar' | 'dashboard'>();
  readonly metricsQuery = queryResource(() => ({
    key: ['metrics', 'cluster-overview'],
    loader: () => this.metricsService.getMetrics(),
    staleTime: 4000,
    gcTime: 0,
  }));
}

@Component({
  selector: 'app-metrics-demo',
  imports: [MetricsWidgetComponent, TranslatePipe],
  providers: [MetricsService],
  template: \` <div cds-layout="vertical gap:sm">
    <div class="query-actions">
      <span class="badge badge-info">{{
        'queryResource.actualHttpCalls' | translate: [metricsService.readCount()]
      }}</span>
      <button type="button" class="btn btn-sm btn-primary" (click)="refreshMetrics()">
        {{ 'queryResource.reloadQuery' | translate }}
      </button>
    </div>

    <div class="clr-row m-t-xs">
      <div class="clr-col-12 clr-col-md-6 widget-col">
        <app-metrics-widget variant="topbar" />
      </div>
      <div class="clr-col-12 clr-col-md-6 widget-col">
        <app-metrics-widget variant="dashboard" />
      </div>
    </div>
  </div>\`,
})
export class MetricsDemoComponent {
  readonly metricsService = inject(MetricsService);

  readonly metricsWidget = viewChild(MetricsWidgetComponent);

  refreshMetrics(): void {
    this.metricsWidget()?.metricsQuery.reload();
  }
}`);

  readonly pollCode = highlight(`import {signal} from '@angular/core';
import {queryResource} from 'ngx-lift';

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
}`);

  readonly mutationCode = highlight(`import {signal} from '@angular/core';
import {mutateResource, queryResource} from 'ngx-lift';
interface DemoUser {
  id: number;
  name: string;
  role: string;
}

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
    invalidateTags: [{type: 'users'}],
    concurrency: 'exhaust',
  },
);

submitNewUser() {
  if (!this.newUserName().trim()) return;
  void this.addUserMutation.mutate({
    name: this.newUserName().trim(),
    role: this.newUserRole(),
  });
  this.newUserName.set('');
}`);

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
