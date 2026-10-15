# Query design and production contracts

Implemented APIs: `QueryClient`, `queryResource`, `queryResources`, `fetchQueryObservable`, `observeQueryObservable` and
`provideQueryClient`. See the [publishing procedure](../DEPLOYMENT.md) for release gates.

This is the single query design entry point. Mutation execution has its own
[specification](mutate-resource-design-spec.md); published-version changes belong in the
[changelog](../../CHANGELOG.md).

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

## Placement and Observable services

| Placement                         | Owner                                                                                            |
| --------------------------------- | ------------------------------------------------------------------------------------------------ |
| Component field                   | Component injector owns the observer; application client shares cache                            |
| Service returns definitions       | Component creates its own observer from centralized keys, loader and tags                        |
| Service resource field            | Service provider injector owns its lifetime; root fields can last until application teardown     |
| Service method creates a resource | Pass the caller's injector explicitly; an injectable method does not create an injection context |

A cached finite service read retains an Observable contract:

```typescript
// Injectable service members.
private readonly http = inject(HttpClient);
private readonly client = inject(QUERY_CLIENT);

users$(scope: string) {
  return fetchQueryObservable(this.client, {
    key: ['users', scope],
    tags: [{type: 'Users', scope}],
    loader: () => this.http.get<User[]>('/api/users'),
    staleTime: 30_000,
  });
}
```

Use `observeQueryObservable` or signal resources for ongoing invalidation updates. Explicit removal completes snapshot
Observable subscribers; resubscribe to observe a recreated entry. Signal resources can manually reattach on reload.
Private one-off service reads need not enter a shared cache.

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
final-revision checks and authentication; [publishing](../DEPLOYMENT.md) defines those gates.

Primary-source background: [Angular resources](https://angular.dev/guide/signals/resource),
[TanStack query defaults](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults),
[query cancellation](https://tanstack.com/query/latest/docs/framework/react/guides/query-cancellation), and
[RTK Query tags](https://redux-toolkit.js.org/rtk-query/usage/automated-refetching). Those libraries' defaults and full
feature sets are comparisons, not ngx-lift contracts.
