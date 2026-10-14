# Query PR #146 / #147 integration review

Reviewed October 14, 2026. [中文说明](query-pr146-pr147-integration.zh-CN.md).

## Decision and merge order

Merge #146 first, then the updated #147. #146 defines native Observable/PromiseLike execution, retry/deadline and
failure contracts. #147 adds inspection and full demo localization on that lifecycle. The prepared #147 branch includes
#146's exact head (`6128d54`) so the combination can be validated before either merge. Original #147 head: `a168da7`;
common base: `b8459ed`. Neither PR is replaced by the other.

Their independent green checks did not establish combination safety. Integration had 16 conflict files, including query
core/tests, the API table, eleven dictionaries and the translation checker. Resolutions preserve native loaders, B-only
collections, error/recovery signals, scoped mutation invalidation, both sets of tests, #147's translated API rows and
its strict full-dictionary validation. No deprecated Observable wrapper or identity-only factory was restored.

## Findings and repairs

| Severity            | Finding                                                                                                                                                                     | Repair and evidence                                                                                                                                                                                                              |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1 demo requirement | Inspector used `playground-preview` / `playground-actions`, while DemoPlayground projects `[preview]` / `[inspector]`. The metrics table and refresh action never rendered. | Use supported projection slots and `badgeText`. A component regression checks actual projection. Browser checks verify the table, retry headers and working refresh button in all eleven locales.                                |
| P2 diagnostics      | Freshness reread the clock after countdown calculation; aggregate visibility was sampled again. A near-boundary snapshot could contradict itself.                           | Capture clock/visibility once per complete snapshot and reuse them. Advancing-clock regressions cover both inspection entry points.                                                                                              |
| P2 public contract  | Request metrics were described as HTTP transports, but retries keep logical reads alive during backoff.                                                                     | Define counts as unsettled logical reads attached to cached entries, including obsolete generations and waits. Describe current-generation `isPending` and removal explicitly. Add `failureCount` / `nextRetryAt` to inspection. |
| P2 validation       | New native/resource/provider API type proof was in a linked consumer, while the fresh strict consumer exercised an older query surface.                                     | Extend the freshly installed tarball consumer with both Observable facades, provider defaults, single/collection resources, inferred item types, failure signals and diagnostics types.                                          |

Six new diagnostic regressions initially produced four failures and two passes; all six pass after the repairs. They
cover a logical read with zero active transport subscriptions, an obsolete retry wait after current-generation success,
and removal/destruction during backoff. Original-error, listener-isolation, deadline, generation and cancellation
regressions from #146 remain present.

## Independent idle scope repair

A nonquery scan found a P2 state mismatch: changing the active idle service retained the previous modal/countdown, while
a late-mounted shared consumer missed an already-active countdown. `observeState()` now replays the service's actual
state, synchronizes scope changes, and closes shared dialogs on activity reset. Three rendered-component cases failed
before the fix and pass afterward; ten service cases cover replay, reset, ownership release, destruction and synchronous
callbacks. Timer ownership is installed before notification; callbacks that reset/release/clear prevent stale
continuation, and destruction blocks timer resurrection. Superseded synchronous state batches are filtered so a peer
cannot receive an old warning after a reset. This repair is a separate commit from query integration. The existing event
APIs remain available.

## Public inspection contract

`getEntriesSnapshot()` and `getDiagnostics()` do not fetch, notify observers, extend retention or mutate query state.
Keys and tag membership arrays are detached. The returned value is a point-in-time snapshot; consumers own refresh
frequency and lifecycle. One snapshot shares a single wall-clock/visibility sample across all entries.

- `requestCount` includes unsettled logical reads on the cached entry, including obsolete generations and retry waits.
- `pendingRequestCount` sums those counts for entries currently present in the cache. Removed entries are excluded;
  remove/destroy abort their pending work.
- `isPending` refers to the current generation. It can be false while `requestCount` is positive because obsolete
  callers are still completing.
- `failureCount` / `nextRetryAt` describe the current logical read, not a sum of obsolete attempts. Successful recovery
  clears them; terminal errors retain the actual failed-attempt count.
- These metrics do not claim transport activity or offline pause/queue support. A separate transport gauge would need
  its own ownership contract; it is unnecessary for this cache inspector.

The inspector observes its injected application client. Failure/Observable service examples deliberately own separate
clients; their work is outside this inspector's scope. Query keys can contain tenant/user identifiers: keep inspection
access appropriate and redact keys when exporting telemetry.

## Developer usage

```typescript
import {DestroyRef, inject, signal} from '@angular/core';
import {QUERY_CLIENT} from 'ngx-lift';

export class CacheInspector {
  private readonly client = inject(QUERY_CLIENT);
  readonly diagnostics = signal(this.client.getDiagnostics());

  constructor() {
    const timer = setInterval(() => this.diagnostics.set(this.client.getDiagnostics()), 1000);
    inject(DestroyRef).onDestroy(() => clearInterval(timer));
  }
}
```

Use [provideQueryClient](../design/query-failure-design.md#application-configuration) for application configuration;
loaders remain direct HttpClient Observables or PromiseLike factories. Automatic read retry, deadline and recovery are
opt-in; writes have no automatic replay. Preserve service RxJS contracts with finite `fetchQueryObservable`; use live
snapshot observation or signal resources for mounted views.

## Validation

The combined branch passed `pnpm run validate`: 848 ngx-lift tests, 262 clr-lift tests and the full demo unit suite;
coverage gates, source type checks, lint, full dictionary checks, tooling, production builds, bundle dependency gates
and strict fresh consumer installation. Source and spec TypeScript checks passed for all three projects. All 120
Chromium/Firefox/WebKit E2E tests passed on the frozen source, including every locale's inspector projection and
refresh. The fresh consumer additionally executes native Observable reads, bounded retry, diagnostics and deadline
rejection against installed tarballs. Final-head remote CI must still complete before merge. The previous #147
production review is explicitly historical; publication dry runs did not exercise this combination and do not substitute
for its checks. No package was published. Dependency audit/advisory triage remains a separate publication gate.
