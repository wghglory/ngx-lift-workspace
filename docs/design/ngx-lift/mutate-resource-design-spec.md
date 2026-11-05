# Design Specification: `mutateResource`

Status: Implemented (contract audit + per-call outcome callbacks). Owner: ngx-lift maintainers. Updated: November
5, 2026. Package: ngx-lift. Approval: existing API plus the October 16 maintainer request for consistent
`invalidateTags` naming and domain-owned key/tag guidance, and the November 5 maintainer approval of per-call
`onSuccess` / `onError` with `onSettled` rejected and `invalidationError` demoted to a diagnostic-only optional signal.
Preserve the previous spelling as a compatibility alias.

**Source:** [mutate-resource.ts](../../../libs/ngx-lift/src/lib/query/mutate-resource.ts)

**Regression tests:** [mutate-resource.spec.ts](../../../libs/ngx-lift/src/lib/query/mutate-resource.spec.ts)

---

## Applicable contracts

Write concurrency, settlement/error boundaries, shared-client invalidation and injector disposal apply. Applications own
forms and rendered feedback; the mutation is not a CVA or an optimistic rollback manager.

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

Per-invocation `onSuccess` / `onError` are deliberately **not** members of `MutateResourceOptions`; they are supplied to
`mutate(args, options)` as described in [Per-call outcome callbacks](#per-call-outcome-callbacks).

### 2.3 `MutateResourceRef<TArgs, TResult, E>` Surface

| Property / Method        | Type                                                                                        | Description                                                                                                             |
| :----------------------- | :------------------------------------------------------------------------------------------ | :---------------------------------------------------------------------------------------------------------------------- |
| `mutate(args, options?)` | `(args: TArgs, options?: MutateResourceCallOptions<TArgs, TResult, E>) => Promise<TResult>` | Executes the mutation and returns a standard Promise; optional per-call outcome callbacks are isolated from it.         |
| `value`                  | `Signal<TResult \| undefined>`                                                              | Retains last published success; only the latest accepted invocation can publish a replacement.                          |
| `status`                 | `Signal<'idle' \| 'loading' \| 'resolved' \| 'error'>`                                      | Current mutation status: `'idle' \| 'loading' \| 'resolved' \| 'error'`.                                                |
| `isLoading`              | `Signal<boolean>`                                                                           | `true` while any accepted invocation is outstanding, including queued `concat` work.                                    |
| `error`                  | `Signal<E \| null>`                                                                         | Failure of the latest accepted invocation; cleared when a new invocation is accepted.                                   |
| `invalidationError?`     | `Signal<unknown \| null>` (optional)                                                        | Diagnostic-only post-success cache synchronization failure; never a failed server write, never a submit-handler branch. |

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
// In a submit handler, await saveMutation.mutate({name: 'Analytics'}) then navigate or close the dialog.
// A successful write refreshes tagged queries automatically; no manual reload or cache check is needed.
```

### 2.4 Reacting to outcomes

Mutations have no **resource-level** `onSuccess` / `onError` options. The returned Promise is the per-invocation outcome
boundary, while signals keep the latest state visible in the UI. Since November 5, 2026, `mutate()` also accepts
optional per-call `onSuccess` / `onError` callbacks for call-site ergonomics; both patterns are supported and equivalent
in outcome. Keeping the side effect bound to the call that produced it matters under `parallel` (out-of-order
completion) and `exhaust` (several callers join one Promise).

`dialog`, `announce` and `pendingByForm` below are application-owned services and signals, not library API.

```typescript
async save(name: string): Promise<void> {
  try {
    const saved = await this.saveMutation.mutate({name});
    this.dialog.close(); // application-owned success side effect, bound to this invocation
    this.announce(saved.name); // application-owned localized announcement
  } catch {
    // error() keeps the failed write visible until the next attempt.
  }
  // Configured invalidateTags refreshed matching observers automatically; no reload() call here.
}
// Equivalent call-site form; see "Per-call outcome callbacks" below.
void this.saveMutation.mutate({name}, {
  onSuccess: (saved) => this.announce(saved.name),
  onError: () => this.announceSaveFailure(), // application-owned localized text
});
// Fire-and-forget is also safe: void this.saveMutation.mutate({name}).then(onSaved, onFailed);
// Cleanup for either outcome: void this.saveMutation.mutate({name}).finally(() => this.pendingByForm.set(false));
```

`status()` / `value()` describe the latest accepted invocation, not every invocation. For analytics, toasts, closing
dialogs or navigation that need the submitted arguments, use the Promise or the
[per-call callbacks](#per-call-outcome-callbacks). `effect()` on `status()` is suitable for view state that does not
need to know which invocation settled. See
[Reacting to success and failure](query-resource-design-spec.md#reacting-to-success-and-failure) for the shared decision
and the application-owned localization/accessibility boundary. The compiled mutation starter, the `saveSuccessMessage`
preview and the runnable callback playground in the demo show these patterns in all supported languages. Successful
writes refresh tagged observers automatically; no manual `reload()` or cache-sync check belongs in a submit handler.

---

## Behavior and architecture

### 3.1 Unhandled Rejection Safety

The returned `Promise` from `mutate()` is internally chained with `.catch(() => undefined)` to prevent unhandled
rejection warnings in the browser console when callers fire-and-forget without `await`. Callers who do
`await resource.mutate()` still properly receive the rejection in their `try/catch` block. The optional per-call
callback observer attaches its own fulfillment and rejection handlers and returns the **same** Promise unchanged, so
callbacks cannot introduce an unhandled rejection, delay, replace or reclassify the write outcome.

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
recorded in `invalidationError`, never a failed server write.

Post-success invalidation failures do not reject or reclassify the completed server write. `invalidationError` is
**diagnostic-only**: it stays optional on `MutateResourceRef` so structural test doubles need not provide it, although
`mutateResource` always supplies it. A non-null value normally means a mapper bug or a destroyed `QueryClient`, not a
recoverable user-facing state, so submit handlers must not branch on it and must never repeat a successful write.
Reporting these failures once through the client's `onDiagnostic` channel is a separate proposal with its own spec and
approval; no global UI observer or per-call `onInvalidationError` hook is part of this API. In parallel mode,
value/error/status publication belongs to the latest accepted invocation, regardless of completion order; `isLoading`
remains true while any accepted invocation is outstanding, including work queued by `concat`.

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

## Per-call outcome callbacks

**Status: implemented, November 5, 2026.** Maintainer approval covers exactly two per-invocation callbacks on
`mutate()`: `onSuccess` and `onError`. `onSettled` is rejected. These are **call-site** options, not members of
`MutateResourceOptions`; the resource handle remains callback-free and the
[query decision](query-resource-design-spec.md#reacting-to-success-and-failure) is unchanged. The
[component development workflow](../component-development.md) gates this scope: the spec below describes shipped
behavior, not a proposal.

### Why this shape

`mutate(args)` returns a Promise and the ref exposes signals, but a success side effect often needs the submitted
arguments and the exact invocation. `status()` / `value()` describe only the latest accepted invocation; `parallel`
completes out of order, `exhaust` merges callers into one Promise, and `concat` starts queued work later. A call-site
callback carries that context without a new reactive subscription. A resource-level `onSuccess` option is rejected for
the reasons in the [query decision](query-resource-design-spec.md#reacting-to-success-and-failure): no invocation
context, and it would duplicate `invalidateTags`, already a success-only cache synchronization hook.

### Use cases and acceptance

| ID  | Task                                                                      | Expected outcome                                                                  | Evidence                                         |
| --- | ------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------ |
| M7  | Save a form, then close a dialog / navigate / announce the submitted name | `onSuccess` runs once with `result` and that invocation's `args`, after the write | `mutate-resource.spec.ts` success test           |
| M8  | Report one failed write to analytics with the submitted arguments         | `onError` runs once with the failure and `args`; no outcome reclassification      | `mutate-resource.spec.ts` failure test           |
| M9  | Clear a pending indicator for one invocation                              | `.finally()` on the returned Promise; no new callback                             | [rejected alternative](#rejected-onsettled)      |
| M10 | Fire-and-forget from a template event                                     | Callbacks run without `await`; no unhandled rejection                             | `mutate-resource.spec.ts` fire-and-forget guards |

### API

```typescript
export interface MutateResourceCallOptions<TArgs, TResult, E = Error> {
  onSuccess?: (result: TResult, args: TArgs) => void;
  onError?: (error: E, args: TArgs) => void;
}

mutate(args: TArgs, options?: MutateResourceCallOptions<TArgs, TResult, E>): Promise<TResult>;
```

```typescript
// Services and translations below are application-owned, not library API.
void this.saveMutation.mutate(
  {name},
  {
    onSuccess: (saved, args) => this.announce(this.translate('saved', {name: args.name})),
    onError: (_error, args) => this.analytics.track('save-failed', args),
  },
);
// Cleanup for both outcomes stays on the returned Promise:
// void this.saveMutation.mutate({name}).finally(() => this.pendingByForm.set(false));
```

`onError` is typed with the resource's `E` (default `Error`) to match `error()`; as elsewhere in the API this is a
caller-declared type, not runtime narrowing. `TArgs` / `TResult` are inferred from the mutation function, so every
existing `mutate(args)` call is unchanged.

### Contract

| Question                   | Shipped behavior                                                                                                                                                                                                                                                                                                                          |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `onSuccess`                | Runs once when that invocation's server write succeeds and receives `(result, args)`. It also runs if `invalidateTags` fails afterwards, because the write succeeded and `invalidationError()` is set first.                                                                                                                              |
| `onError`                  | Runs once when that invocation rejects: transport failure, a destroyed handle, or a queued `concat` invocation rejected by disposal. It never runs for an invalidation failure.                                                                                                                                                           |
| Callback faults            | Isolated. Synchronous throws and rejected thenables returned by a callback are reported as developer diagnostics (`console.error('[ngx-lift mutation] callback failed', error)`), matching `QueryClient` callback isolation. They never reject, resolve or reclassify the returned Promise and never change `status` / `value` / `error`. |
| Ordering                   | Callbacks observe the same Promise that `mutate()` returns. They run after state publication and invalidation handling, and before a caller's later-registered `await` / `.then` continuation. The Promise itself is returned unchanged.                                                                                                  |
| `exhaust` join             | Each caller keeps its own callbacks although they share one Promise and one server write. A joined caller receives its own `args`, which were not submitted to the server; callbacks run in call order.                                                                                                                                   |
| `concat` queue             | Callbacks attach when `mutate()` is called and run when that invocation settles. Queued work rejected by disposal triggers `onError`, never `onSuccess`.                                                                                                                                                                                  |
| `parallel`                 | Each invocation settles independently; callbacks belong to the invocation that supplied them.                                                                                                                                                                                                                                             |
| Fire-and-forget            | `mutate()` still attaches a no-op rejection observer, and the callback observer handles both outcomes, so no unhandled rejection is introduced.                                                                                                                                                                                           |
| Compatibility              | Additive optional second parameter. Strict packed declarations are checked in `verify-packages.mjs`, including `@ts-expect-error` guards for the rejected `onSettled` shape.                                                                                                                                                              |
| Localization/accessibility | Callbacks own no strings, focus or roles. Every visible or announced message stays application-owned in all supported locales; automated and independent human acceptance remain separate gates. No new dictionary key or demo UI text ships with this change.                                                                            |

### Rejected: `onSettled`

`onSettled?: (result, error, args) => void` would run once for either outcome, for example to clear a per-form spinner.
It is **not implemented**, with type-level `@ts-expect-error` guards in the spec suite and the packed consumer verifier.

- The returned Promise already has `.finally()`, which is more composable; arguments are captured in the call-site
  closure. `isLoading()` already covers global pending UI, so M9 needs no new API.
- `mutateResource` accepts `undefined` as a synchronous `TResult`, so `result: TResult | undefined` cannot distinguish a
  successful `undefined` result from a failure. A correct signature would need a `{status: 'resolved' | 'error', ...}`
  discriminant, which is heavier than the pattern it replaces.
- It adds settlement edge cases (joined `exhaust` callers, queued `concat` disposal, faults after settlement, ordering
  against `invalidationError`) without adding information. API count is not a quality target.

### Other rejected alternatives

- **Ship nothing**: `await` / `.then/.catch` still covers every use case and remains fully supported; the
  [outcome tutorial](#24-reacting-to-outcomes) documents both patterns. Per-call callbacks were added for call-site
  ergonomics after maintainer approval, not because a Promise was insufficient.
- **Resource-level callbacks**: rejected; no invocation context and duplicates the `invalidateTags` success hook.
- **`effect()` on `status()`**: rejected for invocation-specific work; still the recommended pattern for view state.
- **Read-side symmetry on `execute()`**: rejected; reads are shared and cache-owned.

## 4. Scope and limitations

Shared optimistic cache updates/rollback and a global mutation counter are not implemented. They need overlapping-write,
cancellation and rollback ownership contracts before becoming public APIs. For now, use local pending UI, explicit write
results and scoped invalidation. Resource-level outcome callbacks, `onSettled` and read-side callback symmetry are
deliberately rejected; see [Per-call outcome callbacks](#per-call-outcome-callbacks). See the
[query production guide](query-resource-design-spec.md).

## Terminology

An accepted invocation uses caller-owned arguments; capture an immutable snapshot. Latest invocation means submission
order, not completion order. Invalidation failure is cache synchronization after a successful server write.

## Goals

- G1: Execute writes only on explicit calls, with selected concurrency.
- G2: Preserve server success even if background cache synchronization fails; avoid duplicate-write recovery advice.

## Non-Goals

### Not now

Shared optimistic rollback, reset and global mutation counters. Prose written specifically for a callback playground is
deferred; the shipped playground reuses existing translation keys.

### Outside this API

Server write undo, automatic retry or endpoint idempotency guarantees. Resource-level outcome callbacks, `onSettled`,
read-side callback symmetry, a global `invalidationError` UI observer and a per-call `onInvalidationError` hook are
rejected, not deferred. Client-level `onDiagnostic` reporting of invalidation faults is a separate proposal.

## Use cases and acceptance

| ID  | Task                   | Initial state/action                                      | Outcome                                                        | Failure/recovery                                         | Demo/test                   |
| --- | ---------------------- | --------------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------- | --------------------------- |
| M1  | Prevent double submit  | Active exhaust write; click again                         | Same Promise; second args ignored                              | Await original result/error                              | mutate-resource.spec.ts     |
| M2  | Save independently     | Parallel submissions finish out of order                  | Every server write runs; latest invocation owns display        | Older completion cannot replace latest state             | ordering regressions        |
| M3  | Synchronize cache      | Server succeeds; invalidation throws                      | mutate resolves server result                                  | Diagnostic-only `invalidationError`; no app UI branch    | post-success regression     |
| M4  | Dispose queued writer  | concat queue then injector destroy                        | Accepted started write finishes; queued transport never starts | Queued Promise rejects                                   | disposal tests              |
| M5  | Share domain reads     | Table and summary observe one definition; create a member | One refetch updates both; other scope remains unchanged        | Closing summary preserves table observation              | query-key-ownership.spec.ts |
| M6  | Map affected tags      | Successful write returns an ID; invocation contains scope | Mapper receives `(result, args)` and selects domain tags       | Failed writes do not call mapper; old option still works | mutate-resource.spec.ts     |
| M7  | React to one success   | Submit a form with per-call `onSuccess`                   | Callback runs once with `(result, args)` after the write       | Callback faults are isolated as developer diagnostics    | callback demo + regressions |
| M8  | React to one failure   | Transport rejects with per-call `onError`                 | Callback runs once with `(error, args)`; write still fails     | Invalidation failure never triggers it                   | callback demo + regressions |
| M9  | Clear per-call pending | Either outcome for one invocation                         | `.finally()` on the returned Promise; `isLoading()` for views  | No `onSettled` API                                       | callback demo + regressions |
| M10 | Fire-and-forget        | Template event supplies callbacks without `await`         | Callbacks run once; no unhandled rejection                     | Joined `exhaust` callers keep their own callbacks        | callback demo + regressions |

## Industry evidence and current gaps

[TanStack mutations](https://tanstack.com/query/latest/docs/framework/angular/guides/mutations) separates explicit write
execution from read caching. Adopt explicit submission and local pending state; retain this library's own
parallel/exhaust/concat and invalidationError semantics rather than copying another library's defaults.

[Angular resources](https://angular.dev/guide/signals/resource) expose outcomes through signals without lifecycle
callbacks: adopt that signal-first boundary for view state.
[RTK Query tag invalidation](https://redux-toolkit.js.org/rtk-query/usage/automated-refetching) inspired the
success-only `(result, args)` mapper, which was adapted as `invalidateTags` for cache synchronization, not for UI
notifications. A resource-level `onSuccess` / `onError` option is rejected because a single mutation handle can serve
many invocations with different arguments and concurrency outcomes; the returned Promise already carries that context.
Per-call callbacks are adopted at the call site only, where they keep that context without sharing state between
invocations; `onSettled` is rejected in favor of the Promise's `.finally()`. See
[Per-call outcome callbacks](#per-call-outcome-callbacks). These are comparisons, not a promise to copy another
library's full API surface.

## Demo and validation plan

Use existing query/mutation demos and adjacent mutate-resource tests. Regressions cover plain values/thenables,
Observable failure, each concurrency mode, latest-invocation ordering, disposal, post-success invalidation failure and
the seven per-call callback cases (success, failure, invalidation, synchronous/asynchronous callback faults, `exhaust`
join, `concat` disposal, type-level rejection of `onSettled`). The `mutateResource` page has a runnable
`mutate(args, {onSuccess, onError})` playground for success and failure, with `.finally()` clearing pending state; its
visible text reuses existing translation keys, so no new dictionary key or library-owned message was added. A demo
component regression drives both outcomes. Show transport error and synchronization error separately when presenting a
write outcome; `invalidationError` is diagnostic-only and is deliberately absent from the demo UI.

October 16, 2026 local validation: 25 mutation regressions and four mutation-demo unit tests passed; 33 query browser
cases passed across Chromium, Firefox and WebKit, including scoped invalidation and all 11 demo languages. Library/demo
type checks, lint, translation coverage, package builds and fresh installed-consumer verification passed. The packed
declarations expose both spellings and the deprecation notice; installed Angular consumers exercise the preferred
callback in zoneless and ZoneJS modes. These are local checks, not CI, merge or publication approval.

November 5, 2026 local validation: `pnpm run validate` passed with 890 ngx-lift unit tests, library type checking, lint,
translation coverage, package builds and strict packed declarations in zoneless and ZoneJS installed consumers. An
explicit `tsc --noEmit -p libs/ngx-lift/tsconfig.spec.json` run confirms the `@ts-expect-error` guard for `onSettled`;
it also reports one pre-existing, unrelated error in `kubernetes-pagination.operator.spec.ts`. The callback playground
reuses existing translation keys; no new route or dictionary key was added. No Playwright browsers are cached locally,
so browser checks were not rerun; the accessibility browser suite and independent human language/assistive-technology
acceptance for the changed page remain separate gates. CI, merge and publication remain separate gates.

## Compatibility, rollout, and risks

Angular 21/RxJS and the selected QueryClient. Pass injector outside injection context. Arguments are not deep-cloned;
queued writes need caller-owned snapshots. Form submission is an invocation boundary, not a CVA or native field bridge.
The per-call options are additive, and `invalidationError` remains optional, so this revision introduces no consumer
type break.

## Clarity, accessibility, and localization

Headless API; it owns no control labels, focus or translations. Application UI shows pending, successful and failed
writes separately; it owns every visible or announced message in all supported locales. `invalidationError` is
diagnostic-only and is not surfaced as a visible or announced message. Per-call callbacks own no strings, focus or
roles: any toast, announcement or dialog they trigger stays application-owned and localized. The callback playground
reuses existing translation keys, so no new dictionary key was added. Forms invoke/observe this API without assigning it
a CVA/native field value.

## Review decisions and delivery

This is an audit of shipped behavior. Proposed features and unresolved implementation work belong in the
[gap register](../implementation-gaps.md) and [roadmap](../../priority-roadmap.md).

Contract follow-up, November 4, 2026: this revision documents the queued `concat` pending state, corrects the
accessibility/localization paragraph and adds the outcome tutorial.

November 5, 2026: the maintainer approved `mutate(args, {onSuccess, onError})` and rejected `onSettled`. This spec, the
runtime implementation, regressions, changelog, packed-consumer guards and a runnable demo playground were delivered
together in one PR so the documented contract and shipped code stay in sync. `invalidationError` was demoted to a
diagnostic-only optional signal and the earlier type narrowing reverted: submit handlers do not branch on it, tag
invalidation refreshes active observers automatically, and no consumer compatibility break remains. Reporting such
failures once through `onDiagnostic` is a separate proposal requiring its own spec and approval.

## Evidence

Contract checked against source and existing regression assertions at base `e4a43f9` on October 16, 2026. Test pointers
identify existing coverage; no runtime suites were rerun for that documentation-only change. Release/CI evidence remains
in the corresponding PR and pipeline.

November 5, 2026: seven per-call callback regressions, a type-level `onSettled` rejection test, a runnable demo
playground with its own component regression, and installed-consumer guards were added alongside the implementation.
`invalidationError` stays optional and diagnostic-only; submit-handler examples no longer branch on it. Local validation
results are reported in the accompanying PR. CI, merge, independent human language and assistive-technology acceptance,
and publication remain separate gates.

Documentation delivery, October 17, 2026: the approved routes and compiled introductory examples are implemented. See
[query documentation delivery](../../query-documentation-plan.md#local-delivery-evidence--october-17-2026) for the
follow-up revision, actual checks and remaining human/remote gates. This supplements the earlier runtime contract audit.
