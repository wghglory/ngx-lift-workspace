# Query design and production contracts

Implemented APIs: `QueryClient`, `queryResource`, `queryResources`, `fetchQueryObservable`, `observeQueryObservable` and
`provideQueryClient`. See the [publishing procedure](../../DEPLOYMENT.md) for release gates.

This is the single query design entry point. Mutation execution has its own
[specification](mutate-resource-design-spec.md); published-version changes belong in the
[changelog](../../../CHANGELOG.md).

## Choosing an API

| Need                                                                      | API                      |
| ------------------------------------------------------------------------- | ------------------------ |
| One cached server read, shared state, invalidation or coordinated polling | `queryResource`          |
| A changing homogeneous collection of independent cached reads             | `queryResources`         |
| Independent async state with local overrides or streaming behavior        | `resourceAsync`          |
| One finite cached result in an RxJS service                               | `fetchQueryObservable`   |
| Live cached snapshots in an RxJS service                                  | `observeQueryObservable` |
| An explicitly submitted server write                                      | `mutateResource`         |

Each canonical query key identifies one cache entry. `QueryClient` owns cache state, in-flight work, generations and
scheduling; Angular resources own observers. Multiple observers share data without sharing their component lifetimes.

## Naming

| Value                                            | Example                                  |
| ------------------------------------------------ | ---------------------------------------- |
| One query handle, even if its result is an array | `userQuery`, `databasesQuery`            |
| Collection of independent query handles          | `tenantQueries`                          |
| Write handle                                     | `createMutation`, `saveSettingsMutation` |
| Resolved data / event method                     | `user`, `tenant`, `createDatabase()`     |

Avoid calling a resource handle `user`, `tenants` or `create`: the name should distinguish its controls from the data or
an action method. The same convention appears in the demo callouts.

## Basic read and dependent requests

Configure `provideHttpClient()` in application providers. The root query client requires no extra registration.

```typescript
import {HttpClient} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {queryResource} from 'ngx-lift';

interface Tenant {
  id: string;
  name: string;
}
interface Database {
  id: number;
  name: string;
}

@Component({
  selector: 'app-tenant',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (tenantQuery.value(); as tenant) {
      <h2>{{ tenant.name }}</h2>
    }
    @if (tenantQuery.isInitialLoading()) {
      <p>Loading tenant…</p>
    }
    @if (tenantQuery.isInitialError()) {
      <p role="alert">Could not load the tenant.</p>
    }
    <button (click)="tenantQuery.reload()">Refresh</button>
  `,
})
export class TenantComponent {
  private readonly http = inject(HttpClient);
  readonly tenantId = signal('a');
  readonly tenantQuery = queryResource(() => {
    const id = this.tenantId();
    return {
      key: ['tenants', id],
      loader: () => this.http.get<Tenant>(`/api/tenants/${id}`),
      staleTime: 30_000,
    };
  });
  readonly databasesQuery = queryResource(() => {
    const tenant = this.tenantQuery.value();
    if (!tenant) return undefined;
    return {
      key: ['databases', tenant.id],
      tags: [{type: 'Databases', scope: tenant.id}],
      loader: () => this.http.get<Database[]>(`/api/tenants/${tenant.id}/databases`),
    };
  });
}
```

Capture changing parameters once so the key and loader describe the same request. Include every endpoint, filter, paging
and authorization variable that changes the response. Returning `undefined` disables the observer and exposes idle
state. A key change hides the previous key's value immediately, before observer attachment is scheduled. Other observers
and cached entries retain their own lifetimes.

Sibling queries run independently. A dependent query waits for its prerequisites; retained parent data remains usable
through a background refresh. Show the parent's error when its initial failure prevents the child from starting. For an
inseparable multi-step result, compose the loader with RxJS; forward `context.refresh` to nested cached reads when an
explicit refresh must bypass their completed data.

### Single-resource API

`queryResource(() => definition | undefined, options?)` returns readonly signals and explicit execution controls.

| Surface                                         | Meaning                                                                                  |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `value`, `error`, `status`                      | Latest successful data, terminal error and `idle/loading/reloading/resolved/error` state |
| `isLoading`, `isInitialLoading`, `isRefreshing` | Any pending read, pending without data, pending with retained data                       |
| `isInitialError`, `isRefreshError`              | Failure without successful data / failure with retained data                             |
| `hasValue()`                                    | Type guard for a defined successful value                                                |
| `updatedAt`, `isStale`                          | Last successful time and freshness                                                       |
| `failureCount`, `failureReason`, `nextRetryAt`  | Current logical read's attempt failures and scheduled retry time                         |
| `reload()`                                      | Background refresh; returns false when disabled/destroyed                                |
| `execute()`                                     | Await a fresh read; rejects when disabled/destroyed                                      |
| `destroy()`                                     | Dispose this observer; shared work follows the cache cancellation policy                 |

`QueryResourceOptions` accepts `injector`, `client`, reactive `pollInterval`, `refetchOnFocus` and `refetchOnReconnect`.
Outside an injection context, pass the lifecycle owner's injector explicitly.

## Dynamic collections

`queryResources(items, definition, options?)` implements item-based pattern B. It returns a signal of ordered
`QueryResourceItem<T, I>` refs; each row has the single-query surface plus serialized `key` and typed `item()`.

```typescript
// Component fields; HttpClient is injected as this.http.
readonly selectedIds = signal(['a']);
readonly tenantQueries = queryResources(this.selectedIds, id => ({
  key: ['tenants', id],
  loader: () => this.http.get<Tenant>(`/api/tenants/${id}`),
  staleTime: 30_000,
  cancelOnNoObservers: true,
}));
```

```html
@for (query of tenantQueries(); track query.key) {
<p>{{ query.item() }}: {{ query.status() }}</p>
@if (query.value(); as tenant) {
<p>{{ tenant.name }}</p>
} @if (query.isInitialError()) {
<button (click)="query.reload()">Retry this read</button>
} }
```

- Reordering preserves refs; removed rows disappear immediately and their observers detach during reconciliation.
- New rows attach during Angular effect scheduling. Empty inputs create no observers; destroying the collection disposes
  every child observer and prevents restart.
- Duplicate canonical keys throw. Use one result type per collection and filter out unready items before defining
  queries.
- One failed row does not fail its peers. `item()` identifies the input before success and after failure; retry only
  that row.

Requests start in parallel without a concurrency limit. Paginate, limit selection or use a backend batch endpoint for
large lists. `maxEntries` cannot evict active observers or pending work. Prebuilt-definition arrays, heterogeneous
collections and a shared concurrency scheduler are deferred until a consumer needs them.

## Definitions and shared cache policy

`QueryDefinition<T>` uses `key`, `loader`, optional `tags`, `staleTime`, `gcTime`, `cancelOnNoObservers`, `retry` and
`deadlineMs`. Its loader returns `Observable<T> | PromiseLike<T>` and receives `{abortSignal, refresh}`.

| Policy                  | Default / contract                                                 |
| ----------------------- | ------------------------------------------------------------------ |
| `staleTime`             | 0; freshness starts at successful completion                       |
| `gcTime`                | 300,000 ms; retention after the last use, independent of freshness |
| `cancelOnNoObservers`   | false; finite reads finish and populate cache by default           |
| `maxEntries`            | 200; LRU removal of inactive entries without pending work          |
| `pollInterval`          | Unset; fastest active observer interval per key                    |
| `retry`, `deadlineMs`   | Disabled unless configured                                         |
| Focus/reconnect refresh | Disabled unless configured                                         |

For an entry's lifetime, definitions combine minimum freshness, maximum retention and cancellation only if every
registered definition opts in. Detaching a reader does not reverse those policies. Tags accumulate until eviction. The
latest registered definition supplies future loaders and read policy; a started logical read freezes its initiating
loader/policy. Centralize consistent same-key definitions, including imperative fetches. Poll intervals instead
aggregate active observers only.

Fresh imperative reads return cached data. Stale cached data is synchronously available to mounted resources while
revalidating. Reads, refreshes and polling join current pending work. Refresh bypasses completed data, not valid pending
work. Successful `undefined` is recorded by `QuerySnapshot.hasValue`; the resource's `hasValue()` guards defined values.

Unused entries collect after retention; active observers and all unsettled reads are protected. Capacity is therefore a
soft bound. Timers segment durations beyond the native timer limit and recheck before expiry.

## Transport, cancellation and invalidation

Observable loaders resolve the first value and unsubscribe. Empty completion rejects with `EmptyError`; continuous
streams need another lifecycle. Native PromiseLike results are assimilated with `Promise.resolve`. The normalizer
handles synchronous sources and subscription-boundary teardown failures without stranding shared work. Original
transport errors take precedence; an escaping teardown failure after a value rejects that attempt. Cleanup exceptions
suppressed internally by RxJS follow RxJS behavior.

Destroying/disabling/changing a resource detaches its observer. Transport aborts when the last observer leaves only if
`cancelOnNoObservers` is enabled. Promise loaders must forward the signal to physically cancel their transport. A finite
`fetchQueryObservable` subscription is not an independent cancellation owner. Explicit `removeQueries` and client
destruction abort both current and obsolete reads and dispose scheduling.

Tags are invalidation dependencies, not identity. `{type, id?, scope?}` matches its own scope; omitting scope means the
unscoped namespace, not every tenant. Omitting id matches every registered id of that type within the same scope.
`invalidateTags` detaches every affected generation before any refetch begins. Observed entries refetch; inactive
entries become stale. Old callers can finish, including retries, but cannot publish or report into a newer generation.
Reentrant notifications use publication revisions and membership checks so old batches cannot overwrite newer state.

Polling waits for the entire logical read, including retry backoff, before scheduling another interval. The default
Angular provider pauses background polling while hidden and disables it on the server. Dynamic intervals can pause an
individual observer. Visibility return resumes overdue work without duplicating a recovery request.

## Failure and recovery

| Situation           | UI / execution contract                                                                                      |
| ------------------- | ------------------------------------------------------------------------------------------------------------ |
| Initial failure     | Undefined value, `isInitialError()`, rejected execution; blocking error with manual recovery                 |
| Refresh failure     | Preserve data and `updatedAt`; `isRefreshError()` supports a local warning                                   |
| Retry wait          | Stay loading/reloading; expose failed attempts, original failure and `nextRetryAt`                           |
| Successful recovery | Clear error and retry metadata                                                                               |
| Terminal failure    | Keep actual failure count and last failure                                                                   |
| Deadline            | `QueryTimeoutError`, retaining its cause when available; no invented failed attempt before an actual failure |
| Normal cancellation | Awaiting callers reject; no new client-level user-error report                                               |

A logical read's deadline includes synchronous loading publication, attempts and waits. It uses an elapsed-time clock,
separate from wall-clock cache timestamps, and rechecks before accepting/publishing success. A hanging read settles;
late noncancelable results cannot publish. Retry invokes the loader anew. Attempts include the initial read, and policy
is shared by joiners rather than duplicated per observer.

Never shorten a server minimum retry wait to fit the deadline. Stop the read instead. Query-policy callback failures
report diagnostically and preserve the original transport failure. Observer exceptions do not interrupt peers, transport
settlement, removal or timer cleanup. Superseded reads retain their own completion machinery until settled.

Opt-in focus/reconnect recovery refreshes observed stale entries only and joins existing work. Focus is ignored while
hidden; reconnect is a connectivity hint and may refresh while hidden. There is no offline queue or pause-and-replay
state.

`onQueryError` reports once per terminal current logical read with key, attempt count, retained-data flag and trigger.
`onDiagnostic` isolates observer, retry-policy and error-reporter faults from transport outcomes. Avoid converting a
failed request to a successful empty list unless that represents the domain result.

## Application configuration

```typescript
import {HttpErrorResponse, provideHttpClient} from '@angular/common/http';
import {ApplicationConfig} from '@angular/core';
import {provideQueryClient} from 'ngx-lift';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideQueryClient({
      queryDefaults: {
        deadlineMs: 10_000,
        retry: {
          maxAttempts: 3,
          shouldRetry: (error) =>
            error instanceof HttpErrorResponse && error.status === 503 && !error.headers.has('Retry-After'),
          delayMs: (_error, context) => 500 * 2 ** (context.attempt - 1),
        },
        refetchOnFocus: true,
        refetchOnReconnect: true,
      },
      onQueryError: (error, context) => console.error(context.trigger, error),
    }),
  ],
};
```

This example retries safe reads only and declines server-hinted waits; provide an application policy that honors those
hints when retrying them. Choose retry ownership between the query layer and HTTP interceptors to avoid multiplied
attempts. Per-query `retry: false` / `deadlineMs: false` opt out of inherited defaults; observer recovery flags can also
override defaults.

`QUERY_CLIENT` is root-provided. `provideQueryClient` retains browser events, Angular ErrorHandler diagnostics and
DestroyRef disposal while configuring defaults. A plain `new QueryClient` is supported; hosts supply visibility/events
and destruction. Each SSR request needs an isolated injector/client, with browser scheduling disabled.

## Placement Architecture: Component vs Service

A query observer can be instantiated directly on an Angular `@Component` field or inside an `@Injectable()` service.
Because `queryResource`, `queryResources`, and `mutateResource` rely on Angular's dependency injection context
(`inject(QUERY_CLIENT)` and `inject(DestroyRef)`), both placement targets are first-class and officially supported.

### Architectural Comparison

| Dimension                    | Component Placement                                | Service Placement                                                 |
| ---------------------------- | -------------------------------------------------- | ----------------------------------------------------------------- |
| **Injector & Owner**         | Component `Injector`                               | Service `Injector` (`providedIn: 'root'` or feature route)        |
| **Observer Lifetime**        | Destroyed when component unmounts                  | Persists across route changes for service lifetime                |
| **State Sharing**            | Local to one component instance                    | Shared synchronously across multiple components & routes          |
| **Memory Cache**             | Shared globally by `QueryKey` in `QueryClient`     | Shared globally by `QueryKey` in `QueryClient`                    |
| **Re-fetching Coordination** | Triggered locally (`query.reload()`)               | Triggered globally via service methods or shared signals          |
| **Mutation Invalidation**    | Listens to tags; updates if mounted                | Listens to tags; updates active observers automatically           |
| **Parameter Handling**       | Component signal inputs (`input()`)                | Service parameter signals (e.g. `activeId = signal(...)`)         |
| **Boilerplate**              | Zero extra files; self-contained in view           | Requires an `@Injectable` service class                           |
| **Best Used For**            | Isolated views, modals, forms, one-off detail tabs | Shared session/auth, master-detail workflows, cross-cutting state |

### Component Placement: Pros and Cons

- **Pros**:
  - **Zero Indirection**: No extra service files needed for single-use views or isolated routes.
  - **Automatic Teardown**: Observers detach immediately when the component is destroyed.
  - **Native Signal Inputs**: Can directly capture Angular signal inputs (e.g., `userId = input.required<string>()`) in
    the query definition.
- **Cons**:
  - **Observer Re-creation**: Navigating away and back creates a new observer (though `QueryClient` serves cached data
    immediately if within `gcTime`).
  - **Duplicated Definitions**: If two distant components need the same data, they must duplicate the key and loader
    definition unless extracted.
  - **Harder Cross-View Coordination**: An external navbar cannot easily trigger a reload on an isolated component's
    query.

### When Component Placement is Mandatory or Preferable

Component placement is not just an alternative; in many scenarios it is either **mandatory** or **highly preferable**:

1. **MANDATORY: Direct Component Signal Inputs (`input()` / `input.required()`)**
   - When a query depends on component inputs (e.g. `userId = input.required<string>()`), declaring `queryResource`
     inside the component directly captures `this.userId()`.
   - A singleton service cannot access individual component inputs. Attempting to manage this via a service requires
     imperative setters or synchronization effects, causing race conditions and state leakage.
2. **MANDATORY: Multi-Instance Reusable Components (Side-by-Side Views, Card Grids, Dialogs)**
   - When the same component is rendered multiple times concurrently on the same screen (e.g. comparing two clusters
     side-by-side, or multiple metric cards in a grid), each component instance MUST have its own independent
     `queryResource` observer.
   - If the query were placed in a singleton service, all instances would conflict and overwrite each other's active
     parameters.
3. **PREFERABLE: Ephemeral UI Lifecycles (Modals, Drawers, Wizard Steps)**
   - When data is only needed while a modal or slide-over drawer is open, component placement ensures the observer
     detaches and stops background polling immediately when closed.
4. **PREFERABLE: Isolated Single-Use Feature Views (KISS Principle)**
   - For a route or view where no other part of the app cares about the data (e.g. `/audit-logs` or `/release-notes`),
     creating an extra `@Injectable()` service file introduces unnecessary boilerplate and indirection.

### The 80/20 Rule: Where Should Most Queries Live?

In traditional Angular (RxJS `BehaviorSubject`), developers were taught to put all data fetching in services because
components had no memory cache—destroying a component meant losing data.

With **`ngx-lift` and `QueryClient`**, the cache and request deduplication are **already globally managed by
`QueryKey`**. Therefore:

- **~70–80% of queries belong directly in Components**: Most views, cards, modals, and route pages are self-contained.
  Placing `queryResource` in the component provides direct `input()` binding, zero boilerplate, and automatic lifecycle
  management while still enjoying global caching and deduplication.
- **~20–30% of queries belong in Services**: Reserve service placement for truly cross-cutting, application-wide state:
  1. Global Session / Auth (`currentUserQuery`, permissions).
  2. Active global workspace/tenant selection that coordinates decoupled sibling components (e.g. Topbar, Sidebar,
     Router breadcrumbs).
  3. Master-detail coordination between independent views that have no parent-child relationship.

### Service Placement: Pros and Cons

- **Pros**:
  - **Single Source of Truth**: Multiple components (navbar, sidebar, widgets, modals) bind to the exact same reactive
    Signal.
  - **Cross-Component Synchronization**: Calling `service.query.reload()` or executing a mutation in one component
    updates all observing components synchronously.
  - **Route-Crossing Continuity**: In a root service, active observers retain their state across route changes without
    re-mounting flashes.
  - **Clean View Components**: Components remain thin UI presentations, delegating data management and keys to domain
    services.
- **Cons**:
  - **Service Boilerplate**: Requires creating and maintaining service classes for simple views.
  - **State Retention Caution**: Parameter signals held on singleton services (e.g., `activeTenantId`) must be reset
    explicitly during logout or session switches.

---

### Canonical Service Patterns

#### Pattern A: Global Auth & User Profile Service (Root Singleton)

A global session service provides the currently authenticated user and a profile update mutation to the entire
application.

```typescript
// auth-state.service.ts
import {HttpClient} from '@angular/common/http';
import {Injectable, inject} from '@angular/core';
import {mutateResource, queryResource} from 'ngx-lift';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

@Injectable({providedIn: 'root'})
export class AuthStateService {
  private readonly http = inject(HttpClient);

  // 1. Centralized cached query resource (follows *Query naming convention)
  readonly currentUserQuery = queryResource(() => ({
    key: ['auth', 'current-user'],
    tags: [{type: 'User', id: 'me'}],
    loader: () => this.http.get<UserProfile>('/api/me'),
    staleTime: 60_000,
  }));

  // 2. Centralized mutation that invalidates the cached user tag (follows *Mutation naming convention)
  readonly updateProfileMutation = mutateResource(
    (changes: Partial<UserProfile>) => this.http.patch<UserProfile>('/api/me', changes),
    {invalidatesTags: [{type: 'User', id: 'me'}]},
  );
}
```

**Consuming in Components (Zero RxJS Boilerplate):**

```typescript
// topbar.component.ts
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {AuthStateService} from './auth-state.service';

@Component({
  selector: 'app-topbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="topbar">
      @if (authStateService.currentUserQuery.isInitialLoading()) {
        <span class="spinner spinner-inline">Loading user…</span>
      } @else if (authStateService.currentUserQuery.value(); as user) {
        @if (authStateService.currentUserQuery.isRefreshing()) {
          <span class="spinner spinner-inline">Refreshing user…</span>
        }
        <span>{{ user.name }} ({{ user.role }})</span>
      }
    </header>
  `,
})
export class TopbarComponent {
  // Inject the service directly:
  readonly authStateService = inject(AuthStateService);
}
```

```typescript
// user-profile-editor.component.ts
import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AuthStateService} from './auth-state.service';

@Component({
  selector: 'app-user-profile-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    @if (authStateService.currentUserQuery.value(); as user) {
      <div class="profile-card">
        <h3>Edit Profile</h3>
        <input [(ngModel)]="newName" placeholder="Enter new name" />
        <button [disabled]="!newName() || authStateService.updateProfileMutation.isLoading()" (click)="saveName()">
          {{ authStateService.updateProfileMutation.isLoading() ? 'Saving…' : 'Save Name' }}
        </button>
      </div>
    }
  `,
})
export class UserProfileEditorComponent {
  readonly authStateService = inject(AuthStateService);
  readonly newName = signal('');

  saveName(): void {
    if (!this.newName().trim()) return;
    this.authStateService.updateProfileMutation.mutate({name: this.newName().trim()});
    this.newName.set('');
    // Both TopbarComponent and UserProfileEditorComponent update synchronously!
  }
}
```

---

#### Pattern B: Dynamic Master-Detail Feature Service (Parameterized Query)

When a master list and detail views share an active selection, a feature service binds selection state to a reactive
query.

```typescript
// database-state.service.ts
import {HttpClient} from '@angular/common/http';
import {Injectable, inject, signal} from '@angular/core';
import {queryResource} from 'ngx-lift';

export interface DatabaseDetails {
  id: string;
  name: string;
  engine: string;
  status: string;
  cpu: string;
  ram: string;
}

@Injectable({providedIn: 'root'})
export class DatabaseStateService {
  private readonly http = inject(HttpClient);

  // Active parameter signal owned by the service
  readonly activeDatabaseId = signal<string | null>(null);

  // queryResource reacts automatically whenever activeDatabaseId() changes
  readonly databaseDetailsQuery = queryResource(() => {
    const id = this.activeDatabaseId();
    if (!id) return undefined; // Enters idle state when unselected

    return {
      key: ['databases', id],
      tags: [{type: 'Databases', id}],
      loader: () => this.http.get<DatabaseDetails>(`/api/databases/${id}`),
      staleTime: 30_000,
    };
  });

  selectDatabase(id: string): void {
    this.activeDatabaseId.set(id);
  }

  clearSelection(): void {
    this.activeDatabaseId.set(null);
  }
}
```

**Consuming in Master and Detail Components:**

```typescript
// database-list.component.ts (Master View)
@Component({
  selector: 'app-database-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="list-group">
      @for (db of databases; track db.id) {
        <button
          class="list-group-item"
          [class.active]="dbService.activeDatabaseId() === db.id"
          (click)="dbService.selectDatabase(db.id)"
        >
          {{ db.name }}
        </button>
      }
    </div>
  `,
})
export class DatabaseListComponent {
  readonly dbService = inject(DatabaseStateService);
  readonly databases = [
    {id: 'db-pg-01', name: 'Production PostgreSQL'},
    {id: 'db-ch-02', name: 'Analytics ClickHouse'},
  ];
}
```

```typescript
// database-detail.component.ts (Detail View)
@Component({
  selector: 'app-database-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (dbService.activeDatabaseId(); as id) {
      <div class="card">
        @if (dbService.databaseDetailsQuery.isInitialLoading()) {
          <p>Loading database specifications…</p>
        } @else if (dbService.databaseDetailsQuery.isInitialError()) {
          <p class="error">Could not load database details.</p>
          <button (click)="dbService.databaseDetailsQuery.reload()">Retry</button>
        } @else if (dbService.databaseDetailsQuery.value(); as details) {
          <h3>{{ details.name }}</h3>
          <p>Engine: {{ details.engine }} | Status: {{ details.status }}</p>
          <p>Compute: {{ details.cpu }} / {{ details.ram }}</p>
          <button (click)="dbService.databaseDetailsQuery.reload()">Refresh Specs</button>
        }
      </div>
    } @else {
      <p class="text-muted">Select a database from the list to inspect specifications.</p>
    }
  `,
})
export class DatabaseDetailComponent {
  readonly dbService = inject(DatabaseStateService);
}
```

---

#### Pattern C: Parallel Multi-Resource Monitoring (`queryResources`)

When a service needs to monitor multiple independent cluster nodes or tenant health checks:

```typescript
// cluster-monitor.service.ts
import {HttpClient} from '@angular/common/http';
import {Injectable, inject, signal} from '@angular/core';
import {queryResources} from 'ngx-lift';

export interface NodeHealth {
  nodeId: string;
  status: 'healthy' | 'degraded';
  loadAverage: number;
}

@Injectable({providedIn: 'root'})
export class ClusterMonitorService {
  private readonly http = inject(HttpClient);
  readonly monitoredNodeIds = signal<string[]>(['node-1', 'node-2', 'node-3']);

  readonly nodeQueries = queryResources(
    this.monitoredNodeIds,
    (nodeId) => ({
      key: ['nodes', nodeId, 'health'],
      loader: () => this.http.get<NodeHealth>(`/api/nodes/${nodeId}/health`),
    }),
    {pollInterval: 10_000},
  );
}
```

---

## RxJS Interoperability & Low-Level Adapters

`ngx-lift` is built around the **Core Triad**: `queryResource`, `queryResources`, and `mutateResource`. These three
Signal-native primitives cover the data fetching, collection mapping, and cache invalidation needs of modern Angular
applications.

`fetchQueryObservable` and `observeQueryObservable` are **low-level interop adapters** provided specifically for
boundaries where an RxJS `Observable` contract is mandatory (such as Angular Route Resolvers, Route Guards, NgRx
Effects, or existing operator chains).

The interactive query demos focus on `queryResource`, `queryResources`, and `mutateResource`. Low-level adapter examples
remain documented below rather than adding a separate interactive adapter component.

### Architectural Decision: Why NO Parallel `fetchQuery$` or `query$`

1. **Avoids API Fragmentation & Choice Paralysis**: Providing duplicate parallel APIs (`queryResource` vs `query$`,
   `fetchQuery` vs `fetchQuery$`) leads developers to question whether they should write Signal-based or
   Observable-based components.
2. **Signal-First Modern Angular**: Modern Angular (v18–v21) treats Signals as the primary view-model reactivity layer.
   Observables remain essential for continuous event streams and HTTP pipelines, but component templates and state
   models belong to Signals.
3. **Alignment with Industry Standards**:
   - **TanStack Query Angular**: Exposes only `injectQuery` and `injectMutation` (no `query$` Observable stream).
   - **Angular Core**: Exposes `resource()` and `httpResource()` (no `httpResourceObservable`).
   - **NgRx SignalStore**: Signal-first; provides `@ngrx/operators` (`rxMethod`) only as a boundary connector.
4. **Clean Boundary Bridges**: If an application requires an Observable from a Signal query, Angular's official
   `toObservable(query.value)` or `from(client.fetchQuery(def))` provides standard, idiomatic translation without
   bloating the library API.

### Low-Level Adapter Usage

#### 1. `fetchQueryObservable`: Angular Route Guards & Resolvers

Use `fetchQueryObservable` when an Angular router contract expects a cold, single-emission `Observable<T>` that
completes after reading through the cache.

```typescript
// tenant.resolver.ts
import {inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ResolveFn} from '@angular/router';
import {QUERY_CLIENT, fetchQueryObservable} from 'ngx-lift';
import {Observable} from 'rxjs';

export interface Tenant {
  id: string;
  name: string;
}

export const tenantResolver: ResolveFn<Tenant> = (route): Observable<Tenant> => {
  const client = inject(QUERY_CLIENT);
  const http = inject(HttpClient);
  const tenantId = route.paramMap.get('id')!;

  return fetchQueryObservable(client, {
    key: ['tenants', tenantId],
    loader: () => http.get<Tenant>(`/api/tenants/${tenantId}`),
    staleTime: 60_000,
  });
};
```

#### 2. `fetchQueryObservable`: RxJS Operator Composition Pipeline

When composing queries with RxJS operators (e.g. `switchMap`, `debounceTime`):

```typescript
// search-integration.service.ts
import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormControl} from '@angular/forms';
import {QUERY_CLIENT, fetchQueryObservable} from 'ngx-lift';
import {debounceTime, distinctUntilChanged, switchMap, Observable} from 'rxjs';

export interface SearchResult {
  items: string[];
}

@Injectable({providedIn: 'root'})
export class SearchIntegrationService {
  private readonly http = inject(HttpClient);
  private readonly client = inject(QUERY_CLIENT);

  createSearchStream(searchControl: FormControl<string>): Observable<SearchResult> {
    return searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term) =>
        fetchQueryObservable(this.client, {
          key: ['search', term],
          loader: () => this.http.get<SearchResult>(`/api/search?q=${encodeURIComponent(term)}`),
          staleTime: 10_000,
        }),
      ),
    );
  }
}
```

#### 3. `observeQueryObservable`: Streaming Cache Snapshots into RxJS Stores

Use `observeQueryObservable` when an RxJS state store (such as NgRx ComponentStore) needs a continuous stream of cache
lifecycle snapshots (`QuerySnapshot<T>`):

```typescript
// legacy-store.service.ts
import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {QUERY_CLIENT, observeQueryObservable, QuerySnapshot} from 'ngx-lift';
import {Observable} from 'rxjs';

@Injectable()
export class LegacyFleetStore {
  private readonly client = inject(QUERY_CLIENT);
  private readonly http = inject(HttpClient);

  readonly fleetSnapshot$: Observable<QuerySnapshot<FleetMetrics>> = observeQueryObservable(
    this.client,
    {
      key: ['fleet', 'metrics'],
      loader: () => this.http.get<FleetMetrics>('/api/fleet'),
    },
    {pollInterval: 5000},
  );
}
```

## Session transitions and writes

Use an opaque session/authorization revision in keys and scope tags; tenant identity alone does not distinguish changed
permissions or a different login. Never put credentials in keys. Disable observers and purge old scoped data before
enabling new-session reads. The following predicate assumes a centralized key schema with scope at index 1:

```typescript
// Component/service members; http and client are injected fields.
readonly sessionScope = signal<string | undefined>(undefined);
readonly usersQuery = queryResource(() => {
  const scope = this.sessionScope();
  if (!scope) return undefined;
  return {
    key: ['users', scope],
    tags: [{type: 'Users', scope}],
    loader: () => this.http.get<User[]>('/api/users'),
    staleTime: 30_000,
    deadlineMs: 10_000,
    cancelOnNoObservers: true,
  };
});

changeSession(nextScope: string | undefined): void {
  const previous = this.sessionScope();
  this.sessionScope.set(undefined);
  if (previous !== undefined) this.client.removeQueries(key => key[1] === previous);
  // Install the new authentication context before enabling its reads.
  this.sessionScope.set(nextScope);
}
```

Invalidation lets old callers finish and is not a logout purge. A destroyed client cannot be reused; remove scoped
entries or replace the provider deliberately. Mutation invalidation must use scope captured in submitted arguments, not
a current-session signal sampled after completion. Already-submitted writes may finish after observer destruction.

Writes are never automatically replayed. A timeout can be an uncertain server outcome: reconcile by reading or an
endpoint-specific idempotency protocol before resubmitting. `invalidationError` means the server write succeeded and
cache synchronization failed; refresh reads instead of repeating the write. Shared optimistic cache setters and rollback
are not implemented. See [mutation execution](mutate-resource-design-spec.md).

## Diagnostics

`getEntriesSnapshot()` and `getDiagnostics()` inspect without fetching, notifying, retaining entries or mutating state.
Keys and tag arrays are detached copies; each complete snapshot samples time/visibility once. Callers own refresh
frequency and destruction. Redact identifiers when exporting telemetry.

- `requestCount` / `pendingRequestCount` count unsettled logical reads on cached entries, including retry waits and
  obsolete generations. Removed entries are excluded; removal aborts their work.
- `isPending` describes only the current generation and may be false while an obsolete read remains.
- `failureCount` / `nextRetryAt` describe the current logical read, not aggregate transports; success clears them.
- These metrics do not count active HTTP subscriptions or claim offline queue semantics.

The demo inspector observes its application client. Isolated failure/service examples own separate clients.

## Production scope and deferred work

Browser contracts have unit, real-browser and strict installed-package evidence. The installed Angular 21.2 DOM fixture
runs in separate zoneless and ZoneJS processes, testing session isolation, cancellation, refresh recovery, collection
lifecycle and scoped writes. ZoneJS uses its Node patch in the DOM fixture; this is not a real-browser ZoneJS run. This
does not prove SSR serialization/hydration or every version allowed by peer ranges. Arbitrary async loaders need an
Angular stability contract before SSR support is claimed; HttpClient tracks its own requests. See
[Angular SSR task guidance](https://angular.dev/guide/zoneless#pendingtasks-for-server-side-rendering-ssr).

Implemented resilience priorities: callback isolation, retained-data recovery, bounded retry, total deadlines, observed
focus/reconnect recovery and terminal reporting. Explicit mutation failure handling is implemented; advanced write
reconciliation and optimism remain application-specific/deferred.

Persistence, infinite queries, offline queues, shared rollback, mutation reset, nondestructive cancellation and a global
concurrency scheduler require concrete consumers and ownership contracts. `fetchQuery` already warms cache without a
separate prefetch helper. Publication additionally requires dependency triage/audit, compatible versioning,
final-revision checks and authentication; [publishing](../../DEPLOYMENT.md) defines those gates.

Primary-source background: [Angular resources](https://angular.dev/guide/signals/resource),
[TanStack query defaults](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults),
[query cancellation](https://tanstack.com/query/latest/docs/framework/react/guides/query-cancellation), and
[RTK Query tags](https://redux-toolkit.js.org/rtk-query/usage/automated-refetching). Those libraries' defaults and full
feature sets are comparisons, not ngx-lift contracts.
