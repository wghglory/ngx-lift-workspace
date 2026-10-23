# Polling and Kubernetes pagination

Status: Implemented (contract audit). Owner: ngx-lift maintainers. Updated: October 17, 2026. Package: ngx-lift.
Approval: existing APIs and repeated-cursor protection; no configurable aggregate caps.

## Applicable contracts

Subscription sharing, timer/request cleanup, sequential page ordering and cursor-cycle detection apply. UI/forms and
cache freshness belong to consumers; aggregate page/item caps are outside the approved pagination scope.

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

Visibility-aware cache polling, incremental list virtualization, client-side page/item caps and truncation.

### Outside this API

Server authorization, writes, infinite scrolling, and form values.

## Use cases and acceptance

| ID  | Task                        | Initial state/action             | Outcome                                              | Failure/recovery                                | Demo/test                              |
| --- | --------------------------- | -------------------------------- | ---------------------------------------------------- | ----------------------------------------------- | -------------------------------------- |
| P1  | Refresh a status panel      | Slow read; timer/manual triggers | Active operation is not overlapped                   | Error becomes AsyncState; later trigger retries | poll.operator.spec.ts                  |
| P2  | Load complete resource list | First page has continue token    | Follow token with original parameters; combine items | Per-page retry or propagate failure             | kubernetes-pagination.operator.spec.ts |
| P3  | Unmount reader              | Unsubscribe during request       | RxJS HTTP work and timers released                   | Promise work may continue without publishing    | shared/final-unsubscribe regressions   |

## Industry evidence and current gaps

The installed RxJS `exhaustMap` controls poll concurrency; pagination uses `expand` and `reduce`. Adopt these lifecycle
mechanisms. Unlike [query resources](query-resource-design-spec.md), poll has no freshness cache or hidden-tab policy.
Repeated or cyclic nonempty continuation tokens fail before another request, rather than requesting the same page
indefinitely. Preserve Kubernetes continuation semantics and original query parameters.

## Developer learning journey and pedagogy plan

Prerequisites: RxJS subscriptions; distinguish a continuing poll from a finite aggregated list.

| Reader task                     | Learning outcome                                            | Destination / working example                                                                                   |
| ------------------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Start, refresh and stop polling | See repeated reads stop when the final subscription leaves  | [/ngx-lift/operators/poll](https://ngx-lift.vercel.app/ngx-lift/operators/poll)                                 |
| Read a multi-page list          | Preserve item order and report repeated continuation tokens | [/ngx-lift/operators/kubernetesPagination](https://ngx-lift.vercel.app/ngx-lift/operators/kubernetesPagination) |

Validation and delivery: Teaching flows landed in #165/#169; #158/#159 cover teardown and cursor cycles. These operators
do not establish shared query-cache ownership. The public API and behavior sections below own exact options and
limitations; examples introduce them after the first task.

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
objects remain supported. No new pagination options are introduced. `limit` controls server page size, not the total
result count; use a single HTTP page or server paging when the UI needs only one page.

## Behavior and architecture

Poll uses fixed timer ticks and exhausts while active. Manual input is remembered even if its trigger is dropped; the
next accepted read uses it. Loading state appears for the first timer read and accepted manual reads; later timer reads
retain the previous state until completion. Errors emit `{status:'error', data:null}` rather than ending polling.
`share()` shares active subscribers without a persistent replay cache; last unsubscribe stops that shared execution.

Pagination retries the supplied initial source and later pages using the [retry policy](k8s-retry-options.md).
Missing/null items become arrays; result order is page order and metadata comes from the last page. It aggregates all
items in memory; `limit` bounds a page, not the total. Unsubscribe cancels Observable work. A failing page rejects the
whole aggregate rather than returning a successful partial list. Cursor history is scoped to each subscription,
including whole-stream retry. Seed history with the initial request cursor using HttpClient serialization semantics.
Repeated/cyclic nonempty tokens fail before another request; an empty token still completes normally.

## Clarity, accessibility, and localization

Headless APIs; hosts own loading/error presentation and announcements. Use a local refresh warning when retaining UI
data; do not infer query-resource retained-data semantics from poll's AsyncState.

## Demo and validation plan

Existing poll and Kubernetes pagination demos plus adjacent tests cover refresh triggers, synchronous error recovery,
normalization, parameter compatibility and retry. Direct poll regressions cover shared execution, no replay,
remaining-subscriber ownership, final-unsubscribe request/timer/manual-trigger cleanup and fresh resubscription.
Pagination tests cover repeated/cyclic tokens, initial cursor reuse, independent subscriptions, whole-stream retry and
continuation cancellation.

## Compatibility, rollout, and risks

Angular 21/RxJS/HttpClient, no new dependency. Signal refresh conversion needs Angular injection context. Aggregation is
unsuitable for unbounded collections; use server paging for UI lists. Retry operator plus interceptor can multiply
attempts; choose one owner.

## Review decisions and delivery

Reject invalid cursor progression while preserving valid-list behavior and the existing API. The maintainer rejected
configurable page/item caps and their configuration-driven errors; do not introduce them. Large collections remain a
caller-owned server-paging/aggregation decision. The [gap register](../implementation-gaps.md) records the original F4
finding.

## Evidence

October 16, 2026: poll unit regressions verify shared subscription and final-unsubscribe behavior with real RxJS
Observables and fake timers. No browser or SSR claims are made by these headless lifecycle checks.

Cursor regressions cover repeated/cyclic tokens, initial cursor serialization, resubscription/retry isolation and
cancellation. Validation results are recorded in the implementation PR; no browser, scale or SSR claims are made.
