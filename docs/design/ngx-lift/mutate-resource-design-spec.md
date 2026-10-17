# Design Specification: `mutateResource`

Status: Implemented (contract audit). Owner: ngx-lift maintainers. Updated: October 16, 2026. Package: ngx-lift.
Approval: existing API plus the October 16 maintainer request for consistent `invalidateTags` naming and domain-owned
key/tag guidance. Preserve the previous spelling as a compatibility alias.

**Source:** [mutate-resource.ts](../../../libs/ngx-lift/src/lib/query/mutate-resource.ts)

**Regression tests:** [mutate-resource.spec.ts](../../../libs/ngx-lift/src/lib/query/mutate-resource.spec.ts)

---

## Background

`mutateResource` is designed exclusively for explicit asynchronous write operations (e.g., POST, PUT, PATCH, DELETE)
triggered by direct user interactions (such as button clicks or form submissions).

Unlike read queries (`queryResource`), which trigger automatically as reactive dependencies change, mutations execute
strictly on demand when `.mutate(args)` is called.

```
       [ User Action: Form Submit / Click ]
                         │
                         ▼
        ┌─────────────────────────────────┐
        │  mutateResource.mutate(payload) │
        └────────────────┬────────────────┘
                         │
              Concurrency Coordinator
           ┌─────────────┼─────────────┐
           ▼             ▼             ▼
       [exhaust]      [concat]     [parallel]
       (drop/join)    (queued)     (concurrent)
                         │
                         ▼
             Network Request Execution
                         │
           ┌─────────────┴─────────────┐
           ▼                           ▼
       [SUCCESS]                    [ERROR]
           │                           │
  Invalidate Tags              Update error() Signal
  Update value() Signal        Reject returned Promise
  Resolve returned Promise
```

---

## Developer learning journey and pedagogy plan

Runtime status remains Implemented (contract audit). Documentation revision approved October 17, 2026; delivery and
validation are tracked in the [query documentation plan](../../query-documentation-plan.md).

Teach one explicitly submitted save before introducing cached reads or tag invalidation. The initial example shows a
pending submit, server result, failure and recovery, with a complete compiled source/template. It does not require a
query key or tags. Catch the returned Promise at the action boundary while keeping `error()` visible in the UI.

| Reader task               | Outcome                                                          | Destination / type                             | Example and validation                                          |
| ------------------------- | ---------------------------------------------------------------- | ---------------------------------------------- | --------------------------------------------------------------- |
| Save a value              | Submit once, observe pending/result/error, recover after failure | `/ngx-lift/query/mutateResource`, tutorial     | Shared compiled starter; browser repeated save/failure/recovery |
| Update cached views       | Connect a successful write to affected query tags                | Same page, second task; `/ngx-lift/query/keys` | Existing table/summary invalidation preview                     |
| Organize writes           | Reuse domain definitions and scope-aware tag factories           | `/ngx-lift/query/organization`, guide          | Existing team service and query definitions                     |
| Control concurrent writes | Choose exhaust, concat or parallel after basic recovery          | Mutation page, advanced recipe                 | Existing concurrency preview and regressions                    |

Tags are objects, for example `{invalidateTags: [{type: 'Items'}]}`, not string arrays. Query tags must match the tags
selected by the mutation. A click-triggered read remains a read; choose mutation for a server write. Server success and
post-success cache synchronization failure are distinct outcomes. Shared optimistic updates/rollback remain deferred.

---

## Public API and examples

Name mutation handles with an action plus `Mutation`, such as `createMutation` or `saveSettingsMutation`. Use
`readonly createMutation = mutateResource(...)` in component/service fields; use `this.createMutation.mutate(...)` in
methods and `createMutation.isLoading()` in templates. Plain verbs identify action methods, not mutation handles. See
the [shared naming convention](query-resource-design-spec.md#terminology).

### 2.1 Signatures

```typescript
export function mutateResource<TArgs, TResult, E = Error>(
  mutation: (args: TArgs) => Observable<TResult> | PromiseLike<TResult> | TResult,
  options?: MutateResourceOptions<TArgs, TResult>,
): MutateResourceRef<TArgs, TResult, E>;
```

Observable results use `firstValueFrom`; other results use `Promise.resolve` to assimilate Promises, custom thenables,
and synchronous values (including `undefined`). The internal rejection hook therefore always receives a real Promise.
Source failures still reject `mutate()` and do not invalidate tags.

### 2.2 Options & Configuration (`MutateResourceOptions`)

- **`concurrency?: 'parallel' | 'exhaust' | 'concat'`**:
  - **`parallel` (Default)**: Multiple submissions proceed independently and simultaneously.
  - **`exhaust`**: Drops duplicate submissions while a request is in flight. Returns the active in-flight Promise so
    callers can await the outcome without generating duplicate server side-effects.
  - **`concat`**: Queues incoming submissions sequentially in FIFO order.
- **`invalidateTags?: readonly QueryTag[] | ((result: TResult, args: TArgs) => readonly QueryTag[])`**: Static tags or a
  synchronous function evaluated after successful write completion. The callback receives the actual result and the
  arguments of that accepted invocation. Return `[]` to skip invalidation. It is not called after a failed write.
- **`invalidatesTags`**: Deprecated compatibility alias with the same type. If both spellings are supplied,
  `invalidateTags` takes precedence, including an empty array. Only one invalidation runs.
- **`client?: QueryClient`**: Explicit cache client; otherwise resolved from the owner injector.
- **`injector?: Injector`**: Optional explicit Angular injector.

### 2.3 `MutateResourceRef<TArgs, TResult, E>` Surface

| Property / Method | Type                                                   | Description                                                                                    |
| :---------------- | :----------------------------------------------------- | :--------------------------------------------------------------------------------------------- |
| `mutate(args)`    | `(args: TArgs) => Promise<TResult>`                    | Executes the mutation with arguments and returns a standard Promise.                           |
| `value`           | `Signal<TResult \| undefined>`                         | Retains last published success; only the latest accepted invocation can publish a replacement. |
| `status`          | `Signal<'idle' \| 'loading' \| 'resolved' \| 'error'>` | Current mutation status: `'idle' \| 'loading' \| 'resolved' \| 'error'`.                       |
| `isLoading`       | `Signal<boolean>`                                      | `true` while any accepted mutation is pending.                                                 |
| `error`           | `Signal<E \| null>`                                    | Failure of the latest accepted invocation; cleared when a new invocation is accepted.          |

The implementation also returns `invalidationError: Signal<unknown | null>` for post-success synchronization faults.

```typescript
// In an Angular injection context, with HttpClient provided.
import {HttpClient} from '@angular/common/http';
import {inject} from '@angular/core';
import {mutateResource} from 'ngx-lift';

const http = inject(HttpClient);
const saveMutation = mutateResource((settings: {name: string}) => http.put<{name: string}>('/api/settings', settings), {
  concurrency: 'exhaust',
  invalidateTags: [{type: 'Settings'}],
});
// In a submit handler, await saveMutation.mutate({name: 'Analytics'}).
// Catch transport failure; inspect invalidationError separately after a successful write.
```

---

## Behavior and architecture

### 3.1 Unhandled Rejection Safety

The returned `Promise` from `mutate()` is internally chained with `.catch(() => undefined)` to prevent unhandled
rejection warnings in the browser console when callers fire-and-forget without `await`. Callers who do
`await resource.mutate()` still properly receive the rejection in their `try/catch` block.

### 3.2 Tag Invalidation Timing

Successful writes invalidate declared tags immediately without awaiting background query refetches. Observing queries in
the background will update their UI states smoothly.

Use `invalidateTags` for both the mutation option and `QueryClient.invalidateTags(tags)` to keep one public spelling.
The option is declarative: configuring it does not invalidate immediately. RTK Query uses `invalidatesTags` for endpoint
configuration and accepts callbacks
([primary documentation](https://redux.js.org/toolkit/rtk-query/usage/automated-refetching)). Adapt the callback idea,
but prefer consistent naming here. Unlike RTK Query's callback, this callback receives `(result, args)` and runs only on
success; there is no error argument.

Capture scope in mutation arguments rather than reading a changing selection after the server responds:

```typescript
import {mutateResource} from 'ngx-lift';
import {teamTags} from './team.queries';
import {TeamService, NewMember} from './team.service';

// Inside an Angular component with an injected TeamService.
readonly addMutation = mutateResource(
  (args: {scope: string; member: NewMember}) => this.teamService.createMember(args.scope, args.member),
  {
    invalidateTags: (created, args) => [
      teamTags.members(args.scope),
      teamTags.member(args.scope, created.id),
    ],
    concurrency: 'exhaust',
  },
);
```

The input scope and server-assigned ID select dependencies without duplicating tag strings. Keep tags and complete query
definitions in the domain module described in
[large-project ownership](query-resource-design-spec.md#large-project-key-and-tag-ownership). Migrate `invalidatesTags:`
to `invalidateTags:`; legacy consumers keep working. A throwing mapper remains a post-success synchronization failure
through `invalidationError`, never a failed server write.

Post-success invalidation failures do not reject or reclassify the completed server write. `invalidationError` exposes
that cache synchronization failure (the interface marks it optional for structural test refs; the implementation
supplies it). Handle it separately from `error` so retry UI does not duplicate a successful write. In parallel mode,
value/error/status publication belongs to the latest accepted invocation, regardless of completion order; `isLoading`
remains true while any accepted invocation is outstanding.

### 3.3 Server Boundary & Argument Snapshots

Disposal or unmounting does not cancel an already accepted server-side write. Pass immutable argument snapshots to
prevent accidental mutations of request payloads while requests are pending. Queued `concat` mutations will not start
after resource disposal.

### 3.4 Placement & Double Invalidation Prevention (Point B)

Like `queryResource`, mutations can be defined either:

- **In an `@Injectable` Service**: As a domain action facade (e.g., `userService.updateUser`), centralizing API
  transport and tag invalidation logic across multiple components.
- **In a Component**: Local to a specific form or dialog where arguments and lifecycle are tightly coupled to the view.

_Avoid Double Invalidation_: If an underlying service layer already handles cache invalidation on write success, avoid
declaring duplicate invalidation tags in the calling component.

---

## 4. Scope and limitations

Shared optimistic cache updates/rollback and a global mutation counter are not implemented. They need overlapping-write,
cancellation and rollback ownership contracts before becoming public APIs. For now, use local pending UI, explicit write
results and scoped invalidation. See the [query production guide](query-resource-design-spec.md).

## Terminology

An accepted invocation uses caller-owned arguments; capture an immutable snapshot. Latest invocation means submission
order, not completion order. Invalidation failure is cache synchronization after a successful server write.

## Goals

- G1: Execute writes only on explicit calls, with selected concurrency.
- G2: Preserve server success even if background cache synchronization fails; avoid duplicate-write recovery advice.

## Non-Goals

### Not now

Shared optimistic rollback, reset and global mutation counters.

### Outside this API

Server write undo, automatic retry or endpoint idempotency guarantees.

## Use cases and acceptance

| ID  | Task                  | Initial state/action                                      | Outcome                                                        | Failure/recovery                                         | Demo/test                   |
| --- | --------------------- | --------------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------- | --------------------------- |
| M1  | Prevent double submit | Active exhaust write; click again                         | Same Promise; second args ignored                              | Await original result/error                              | mutate-resource.spec.ts     |
| M2  | Save independently    | Parallel submissions finish out of order                  | Every server write runs; latest invocation owns display        | Older completion cannot replace latest state             | ordering regressions        |
| M3  | Synchronize cache     | Server succeeds; invalidation throws                      | mutate resolves server result                                  | invalidationError shows sync failure                     | post-success regression     |
| M4  | Dispose queued writer | concat queue then injector destroy                        | Accepted started write finishes; queued transport never starts | Queued Promise rejects                                   | disposal tests              |
| M5  | Share domain reads    | Table and summary observe one definition; create a member | One refetch updates both; other scope remains unchanged        | Closing summary preserves table observation              | query-key-ownership.spec.ts |
| M6  | Map affected tags     | Successful write returns an ID; invocation contains scope | Mapper receives `(result, args)` and selects domain tags       | Failed writes do not call mapper; old option still works | mutate-resource.spec.ts     |

## Industry evidence and current gaps

[TanStack mutations](https://tanstack.com/query/latest/docs/framework/angular/guides/mutations) separates explicit write
execution from read caching. Adopt explicit submission and local pending state; retain this library's own
parallel/exhaust/concat and invalidationError semantics rather than copying another library's defaults.

## Demo and validation plan

Use existing query/mutation demos and adjacent mutate-resource tests. Regressions cover plain values/thenables,
Observable failure, each concurrency mode, latest-invocation ordering, disposal and post-success invalidation failure.
Show transport error and synchronization error separately when presenting a write outcome.

October 16, 2026 local validation: 25 mutation regressions and four mutation-demo unit tests passed; 33 query browser
cases passed across Chromium, Firefox and WebKit, including scoped invalidation and all 11 demo languages. Library/demo
type checks, lint, translation coverage, package builds and fresh installed-consumer verification passed. The packed
declarations expose both spellings and the deprecation notice; installed Angular consumers exercise the preferred
callback in zoneless and ZoneJS modes. These are local checks, not CI, merge or publication approval.

## Compatibility, rollout, and risks

Angular 21/RxJS and the selected QueryClient. Pass injector outside injection context. Arguments are not deep-cloned;
queued writes need caller-owned snapshots. Form submission is an invocation boundary, not a CVA or native field bridge.

## Clarity, accessibility, and localization

Headless API; it owns no control labels, focus or translations. Application UI distinguishes initial loading/error from
retained-data refresh where applicable. Forms invoke/observe this API without assigning it a CVA/native field value.

## Review decisions and delivery

This is an audit of shipped behavior. Proposed features and unresolved implementation work belong in the
[gap register](../implementation-gaps.md) and [roadmap](../../priority-roadmap.md); no new API is approved here.

## Evidence

Contract checked against source and existing regression assertions at base `e4a43f9` on October 16, 2026. Test pointers
identify existing coverage; no runtime suites were rerun for this documentation-only change. Release/CI evidence remains
in the corresponding PR and pipeline.
