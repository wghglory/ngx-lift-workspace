# Polling and Kubernetes pagination

Status: Implemented (contract audit). Owner: ngx-lift maintainers. Updated: October 16, 2026. Package: ngx-lift.
Approval: existing APIs and pagination progress/bounds repair reviewed in its implementation PR.

## Background

RxJS consumers need repeatable reads or a complete Kubernetes list. Sources:
[poll](../../../libs/ngx-lift/src/lib/operators/poll.operator.ts) and
[pagination](../../../libs/ngx-lift/src/lib/operators/kubernetes-pagination.operator.ts). These APIs do not share
QueryClient cache or polling ownership.

## Terminology

A poll trigger may be a timer tick or manual refresh. A continue token identifies the next server page; aggregate
pagination emits a completed list rather than incremental UI pages.

## Goals

- G1: Poll without overlapping accepted operations, and recover after read errors.
- G2: Retrieve successive Kubernetes pages with consistent parameters and per-page retry.

## Non-Goals

### Not now

Visibility-aware cache polling and incremental list virtualization.

### Outside this API

Server authorization, writes, infinite scrolling, and form values.

## Use cases and acceptance

| ID  | Task                        | Initial state/action             | Outcome                                              | Failure/recovery                                | Demo/test                              |
| --- | --------------------------- | -------------------------------- | ---------------------------------------------------- | ----------------------------------------------- | -------------------------------------- |
| P1  | Refresh a status panel      | Slow read; timer/manual triggers | Active operation is not overlapped                   | Error becomes AsyncState; later trigger retries | poll.operator.spec.ts                  |
| P2  | Load complete resource list | First page has continue token    | Follow token with original parameters; combine items | Per-page retry or propagate failure             | kubernetes-pagination.operator.spec.ts |
| P3  | Unmount reader              | Unsubscribe during request       | RxJS HTTP work and timers released                   | Promise work may continue without publishing    | planned cancellation regression        |

## Industry evidence and current gaps

The installed RxJS `exhaustMap` controls poll concurrency; pagination uses `expand` and `reduce`. Adopt these lifecycle
mechanisms. Unlike [query resources](query-resource-design-spec.md), poll has no freshness cache or hidden-tab policy.
Adopt Kubernetes continuation semantics and preserve original query parameters. Reject a repeated cursor rather than
loop indefinitely; configure aggregate limits separately from server page size. See the
[Kubernetes chunking contract](https://kubernetes.io/docs/reference/using-api/api-concepts/#retrieving-large-results-sets-in-chunks).

## Public API and examples

```typescript
// HttpClient field provided by the host; subscribe with owner-scoped cleanup.
import {poll, fetchPaginatedKubernetesResources} from 'ngx-lift';

readonly status$ = poll({interval: 5000, pollingFn: () => this.http.get('/api/status')});
// Generic resource type must extend KubernetesObject.
// fetchPaginatedKubernetesResources<Pod>(this.http, '/api/pods', {initialParams: {limit: 100}});
```

`poll` accepts `delay=0`, optional initial AsyncState, and Observable/Signal `forceRefresh`, optionally transformed by
`paramsBuilder`. Before the first manual input, timer reads receive undefined input; builders must tolerate it.
`fetchPaginatedKubernetesResources` starts HTTP; `aggregatePaginatedKubernetesResources` operates on a supplied first
page. Options accept initial parameters and `retryConfig`, with `false` disabling per-page retry; legacy parameter
objects remain supported. Optional `bounds: {maxPages, maxItems}` counts the first page and all accumulated items.
`initialParams.limit` requests a server page size, not a total result count: limit=100 may fetch many successive pages.
maxPages caps successful pages (including the first, excluding HTTP retry attempts); maxItems caps all accumulated
items. Exceeding either cap errors instead of returning a truncated list. Use a single HTTP page or server paging when
the UI needs only the first 100 items. Each supplied bound must be a positive safe integer (invalid configuration throws
RangeError); omitted bounds remain unbounded for compatibility. The nested object avoids confusing old HTTP parameters
named maxPages/maxItems/bounds.

```typescript
fetchPaginatedKubernetesResources<Pod>(this.http, '/api/pods', {
  initialParams: {limit: 100},
  bounds: {maxPages: 100, maxItems: 10000},
});
```

## Behavior and architecture

Poll uses fixed timer ticks and exhausts while active. Manual input is remembered even if its trigger is dropped; the
next accepted read uses it. Loading state appears for the first timer read and accepted manual reads; later timer reads
retain the previous state until completion. Errors emit `{status:'error', data:null}` rather than ending polling.
`share()` shares active subscribers without a persistent replay cache; last unsubscribe stops that shared execution.

Pagination retries the supplied initial source and later pages using the [retry policy](k8s-retry-options.md).
Missing/null items become arrays; result order is page order and metadata comes from the last page. It aggregates all
items in memory; `limit` bounds a page, not the total. Unsubscribe cancels Observable work. A failing page rejects the
whole aggregate rather than returning a successful partial list. Every subscription has fresh counters and cursor
history, including whole-stream retry/resubscription. Repeated/cyclic nonempty tokens (including the initial request
cursor) fail before another request. maxPages rejects a continuation at the page limit; maxItems rejects an oversized
received page. Exact limits and terminal empty pages succeed. Failures propagate as errors, with no partial success.
Item bounds limit the aggregate, not the bytes in one HTTP response; HTTP/page-size policy remains caller-owned.

## Clarity, accessibility, and localization

Headless APIs; hosts own loading/error presentation and announcements. Use a local refresh warning when retaining UI
data; do not infer query-resource retained-data semantics from poll's AsyncState.

## Demo and validation plan

Existing poll and Kubernetes pagination demos plus adjacent tests cover refresh triggers, synchronous error recovery,
normalization, parameter compatibility and retry. Add explicit shared-subscriber/last-unsubscribe cancellation
assertions; source use of share() alone does not prove those lifetimes. Pagination tests cover repeated/cyclic tokens,
initial cursor reuse, first/later-page limits, exact bounds, malformed options and independent subscribers/retry.

## Compatibility, rollout, and risks

Angular 21/RxJS/HttpClient, no new dependency. Signal refresh conversion needs Angular injection context. Aggregation is
unsuitable for unbounded collections; use server paging for UI lists. Retry operator plus interceptor can multiply
attempts; choose one owner.

## Review decisions and delivery

Keep per-page retry behavior and legacy parameters. Enforce cursor progress always and make total limits opt-in to
preserve existing large-list consumers; callers handling large or untrusted collections should set both bounds. The
[gap register](../implementation-gaps.md) records the original F4 finding.

## Evidence

October 16, 2026: all 40 pagination tests pass, including cursor cycles, first/later limits and retry/resubscription
isolation. Full ngx-lift tests, lint, typecheck and production build pass. No load or SSR claims are made.

The bounded demo completes twice in each of Chromium, Firefox and WebKit (3 browser checks). Demo tests (236), lint and
typecheck pass. Packed public types and fresh strict-peer Angular 21 consumers pass package verification with the new
numeric bounds API, including rejection of incorrectly typed string bounds.

The demo distinguishes server page size from client aggregate bounds in translated helper text and API rows. It counts
the initial page, exposes maxPages/maxItems controls, shows a persistent alert on either failure, and recovers after
raising the bound. Six browser checks verify success, each bound failure and recovery across the three engines.
