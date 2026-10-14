# Query failure design: recovery, bounded work, and useful UI state

Status: implementation in progress. Observer exception isolation and onDiagnostic are implemented; resilience policy
additions below are next. Checked October 14, 2026 against commit `98d8918`. [中文说明](query-failure-design.zh-CN.md) ·
[Primary-source comparison](query-failure-industry-research.md)

## Decision

ngx-lift already has a useful basic failure contract. Preserve native Observable and PromiseLike loaders, retained data
on refresh failure, independent collection results, scoped invalidation, and explicit rejected execution promises.
Prioritize one reproduced correctness defect before adding retry or offline machinery. A green CI run validates covered
scenarios; it does not prove every failure path is safe.

Do not automatically turn errors into successful empty arrays. A domain fallback is appropriate only when empty data
really represents the intended result; otherwise it conceals the failure and can enter the shared success cache.

## Existing behavior and gaps

| Concern                             | Current behavior                                                                        | Recommendation                                                                          |
| ----------------------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Initial failure                     | Error snapshot; manual reload/execute can retry                                         | Document blocking-error UI; add convenience flags later                                 |
| Failed refresh                      | Last value, hasValue, and updatedAt survive; status becomes error and data stays stale  | Render retained content plus a warning and Retry; expose updatedAt on resource          |
| Parallel partial failure            | queryResources keeps per-row results/errors                                             | Retry the failed row; avoid making an entire page one composite query                   |
| Dependent failure                   | Returning undefined disables a child                                                    | Show the parent failure separately; idle child does not mean an empty successful result |
| Observable normalization            | First value, empty completion, cancellation, and observable teardown exceptions handled | Keep existing contract and RxJS-internal suppression boundary                           |
| Observer exceptions                 | Can interrupt publication/startup and strand shared work                                | P0 correctness fix and adversarial regressions                                          |
| Automatic read retry                | None in QueryClient; possible inside Observable loaders                                 | Bounded, opt-in shared policy for both transports                                       |
| Query deadline                      | None; a never-emitting source can stay pending                                          | Opt-in logical deadline; distinguish it from transport timeout                          |
| Visibility recovery                 | Visibility-aware polling only                                                           | Optional stale-observed focus/reconnect refresh                                         |
| Shared diagnostics                  | No client-level terminal error hook                                                     | Report once per failed logical read, not per observer                                   |
| Mutation failure                    | Error signal and rejected Promise; no automatic retry                                   | Preserve submitted arguments, show local error, retry only when safe                    |
| Successful write, failed cache sync | invalidationError is separate from write error                                          | Offer read refresh; never label the completed write failed                              |
| Write optimism/reset/cancel         | No shared optimistic cache API or mutation reset; no nondestructive cancelQueries       | Later increments with explicit ownership/concurrency contracts                          |

Sources: [models](../../libs/ngx-lift/src/lib/query/query.models.ts),
[client](../../libs/ngx-lift/src/lib/query/query-client.ts),
[resource](../../libs/ngx-lift/src/lib/query/query-resource.ts),
[collection](../../libs/ngx-lift/src/lib/query/query-resources.ts),
[mutation](../../libs/ngx-lift/src/lib/query/mutate-resource.ts).

## P0: isolate observer exceptions

Reproduced against the actual TypeScript client. A listener throwing only on the loading notification produces:

```text
attachmentError: "UI listener failed"
loaderCalls: 0
snapshot.status: "loading"
another same-key fetch: still pending after a 20 ms Promise.race
```

The 20 ms probe establishes that transport never started and the shared pending Promise did not settle in that window;
the control flow has no remaining transport completion path. Explicit removal/destroy can still abort it.

`observeQuery` registers a listener before invoking it directly. `startRequest` installs pending work, then calls
`publish` outside the loader try/catch. `publish` directly calls consumers. An exception can also skip other observers
or interrupt timer cleanup after a successful response.

Independent review also reproduced a resolved-only listener exception: the loader returned and cached 42, but the shared
fetch Promise rejected with the UI exception. Failure isolation must prevent this cache/result contradiction.

Required design:

- Isolate each listener at initial notification and later publication; report its exception separately.
- Continue transport and peer notification. Never substitute a UI exception for the transport result.
- Preserve revision and membership checks when listeners reenter or detach other observers.
- Make disposal/removal continue across bad listeners; protect diagnostic/reporting callbacks too.
- Treat application callbacks as an untrusted boundary, not part of server success/failure.

Regression gates: throw on initial/loading/resolved/error/removal notifications; verify finite calls settle, healthy
peers receive state, polling/GC still run, all removed requests abort, and reentrant generations remain safe. This audit
records the defect; it does not implement the fix.

## Developer pattern available today

Choose content before error when usable data exists. This component uses only current APIs:

```typescript
import {HttpClient} from '@angular/common/http';
import {Component, inject} from '@angular/core';
import {queryResource} from 'ngx-lift';

interface User {
  id: string;
  name: string;
}

@Component({
  selector: 'app-users',
  template: `
    @if (usersQuery.hasValue()) {
      @for (user of usersQuery.value()!; track user.id) {
        <p>{{ user.name }}</p>
      }
      @if (usersQuery.status() === 'error') {
        <p role="status">Could not refresh. Showing the last successful result.</p>
        <button [disabled]="usersQuery.isLoading()" (click)="usersQuery.reload()">Retry</button>
      }
    } @else if (usersQuery.status() === 'error') {
      <p role="alert">Could not load users.</p>
      <button (click)="usersQuery.reload()">Retry</button>
    } @else if (usersQuery.isInitialLoading()) {
      <p role="status">Loading users…</p>
    }
  `,
})
export class UsersComponent {
  private readonly http = inject(HttpClient);
  readonly usersQuery = queryResource(() => ({
    key: ['users'],
    loader: () => this.http.get<User[]>('/api/users'),
    staleTime: 30_000,
  }));
}
```

Provide HttpClient and include every authorization/tenant scope in real query keys. The strings above illustrate the UI
states; demo implementations must use the existing translation system in all 11 languages.

Use status rather than error truthiness: JavaScript promises/Observables can reject with null, undefined, or other
non-Error values. Preserve raw errors for application-specific classification; E typing does not validate runtime
errors.

`reload()` returns whether a refresh was accepted, not whether it succeeded. It records failures through signals.
`execute()` rejects; use try/catch when awaiting it. For finite services, catch the error from `fetchQueryObservable`.
For mounted snapshot observers, request failures are snapshot fields, not a terminating Observable error. Configuration
errors may still fail the observation stream.

Dependent requests should derive readiness from usable parent data. Retained parent data can deliberately keep a child
enabled during a refresh failure. If freshness is mandatory, gate on that rule explicitly and show why the child is
blocked. Do not hide the parent's error behind an idle child.

For dynamic independent reads, keep B-only `queryResources` and per-row Retry. A single `forkJoin` is a fail-fast atomic
read unless errors are converted to typed per-item results inside each source; `Promise.all` also fails fast. Neither
failing a composite nor unsubscribing a finite bridge proves that every underlying shared cache read was canceled.

## Proposed API additions

These are design declarations, not exports or implemented behavior. Add fields to the existing definitions; keep
`queryResource(() => definition)` and direct HttpClient loaders.

```typescript
export interface QueryAttemptContext {
  readonly key: QueryKey;
  readonly attempt: number; // 1-based; includes the initial attempt
  readonly elapsedMs: number;
}

export interface QueryRetryOptions {
  readonly maxAttempts: number; // finite positive integer; includes initial attempt
  readonly shouldRetry: (error: unknown, context: QueryAttemptContext) => boolean;
  readonly delayMs: number | ((error: unknown, context: QueryAttemptContext) => number);
}

export interface QueryReadPolicy {
  readonly retry?: false | QueryRetryOptions;
  readonly deadlineMs?: number; // total logical read, including loader and retry waits
}

// Planned: QueryDefinition<T> extends QueryReadPolicy.
// Planned: QueryClientOptions.queryDefaults?: QueryReadPolicy.
// Planned: QueryResourceRef adds the following readonly signals:
export interface QueryFailureSignals {
  readonly isInitialError: Signal<boolean>;
  readonly isRefreshError: Signal<boolean>;
  readonly updatedAt: Signal<number | null>;
  readonly failureCount: Signal<number>;
  readonly failureReason: Signal<unknown | null>;
  readonly nextRetryAt: Signal<number | null>;
}

export interface QueryErrorContext {
  readonly key: QueryKey;
  readonly attemptCount: number;
  readonly hasValue: boolean;
  readonly trigger: 'initial' | 'manual' | 'poll' | 'invalidation' | 'focus' | 'reconnect';
}

// Planned client callbacks:
// onQueryError?: (error: unknown, context: QueryErrorContext) => void;
// onDiagnostic?: (error: unknown, context: {key?: QueryKey; phase: string}) => void;
```

Policy defaults: no automatic retry, no deadline, no offline queue. Per-definition policy overrides client defaults;
`retry: false` explicitly disables inherited retries. Keep query and mutation defaults separate. Convenience error flags
derive from snapshot status and snapshot.hasValue, not truthiness of value/error. `hasValue()` on the resource
separately narrows undefined out of the data type.

Retry mechanics:

1. Freeze loader, policy, parameters, and generation for a logical read; concurrent same-key callers join it. The
   initiating read chooses its execution policy; later joiners do not replace it. Use one factory per key for consistent
   policy. Reject invalid policy before installing pending work.
2. Invoke the loader anew for each attempt. Cold Observable and PromiseLike support share this loop; retrying an already
   rejected Promise is not a new request. Do not require a public transport adapter.
3. During attempts/backoff retain loading/reloading; publish failureCount/failureReason without terminal-error toasts.
   First failure is count 1; maxAttempts 3 means at most three loader invocations.
4. Default retries off. A shared HTTP read preset can use bounded attempts, predicate-based transient classification,
   capped jittered backoff, and Retry-After. Query core must not infer HTTP methods or business success from a DTO.
   Auth/validation/domain errors, aborts, EmptyError, and cleanup errors are not default transient candidates.
5. Choose exactly one retry owner: service operator/interceptor or QueryClient. Nested retries multiply attempts.
   Existing retryOnK8sBackoff already supports bounded waits and Retry-After; it is not a missing capability.
6. Dispose retry/deadline timers on explicit cancellation, removal, and completion. Tag invalidation currently lets old
   callers finish: retain a superseded read's own retry/deadline machinery until it settles, while suppressing its cache
   publication, polling ownership, and terminal-error reporting. Never clear a continuation timer and leave its Promise
   pending. The new generation schedules only its own work.
7. Validate callbacks per attempt: thrown predicates/delay callbacks, nonboolean eligibility, and nonfinite/negative
   delay values terminate retries and settle with the original request error, reporting the policy error separately.
   Invalid static policy rejects before pending registration. Dynamic policy cannot be fully validated upfront.
8. Polling schedules after the complete current logical read, including retries; it must not run a competing retry loop.

Deadline semantics: a positive finite elapsed-time budget from logical read creation to final settlement, including
retry waits. Expiry rejects with a recognizable QueryTimeoutError and aborts the request. Observable subscription is
released. Promise callers settle even if the loader ignores abort; late values cannot populate this attempt's cache. A
dependent composite gets a total bound. Preserve previous good data. A shared deadline affects all joined readers; a
caller-only RxJS timeout stops that caller waiting, not the shared transport.

Do not shorten server minimum retry hints to fit a deadline: terminate the logical read instead. A future
attemptTimeoutMs is a separate feature, only needed if a hung attempt should be retried before the total deadline. The
research lists attempt timeouts as an option; this design deliberately starts with the smaller total-deadline API.

JavaScript cannot preempt a blocking synchronous loader, and throttling can delay timer callbacks. Check elapsed time
before starting attempts and before publishing success; settle at the earliest executable boundary after expiry. Use a
monotonic elapsed-time clock for the budget and wall-clock timestamps for UI dates.

For errors reported through onQueryError, emit once per terminal logical read belonging to the current generation, not
per subscriber or retry. Use logical-read identity plus the generation guard: two separate failed polls/manual reads
within one generation each produce one terminal event. Suppress normal lifecycle cancellations and obsolete generations.
Retain original error objects; the app decides whether a warning, inline validation, toast, or telemetry event is
appropriate. Diagnostic callback errors must be isolated and surfaced through a nonrecursive host reporting path.
Telemetry must redact raw keys/errors as needed.

### Retry state transitions

| Transition                     | failureCount / failureReason                                  | nextRetryAt                  | Terminal error                                                         |
| ------------------------------ | ------------------------------------------------------------- | ---------------------------- | ---------------------------------------------------------------------- |
| New logical read               | 0 / null                                                      | null                         | Clear previous error as today; keep good data                          |
| Failed attempt, retry allowed  | Consecutive failures / latest original failure                | Scheduled retry deadline     | No new terminal error                                                  |
| Next attempt starts            | Preserve current read's failure metadata                      | null                         | No new terminal error                                                  |
| Successful recovery            | 0 / null                                                      | null                         | null                                                                   |
| Terminal read failure          | Number of failed attempts / last failure                      | null                         | Original failure; retained data survives                               |
| Total deadline expires         | Preserve actual failure count; expose timeout as final reason | null                         | QueryTimeoutError; pending clears                                      |
| Explicit cancel                | Clear visible retry metadata                                  | null                         | Abort reaches awaiting callers; canceled query is not a new user error |
| Removed/disabled resource view | 0 / null in idle view                                         | null                         | No stale countdown                                                     |
| Superseded read                | Keep per-request state until settlement; do not publish it    | Its private timer may remain | Do not replace newer state or report obsolete failure                  |

A deadline expiry before any attempt failed has failureCount 0; it must not invent a failed retry attempt. A disabled
observer does not cancel other observers' shared read. Detached cache/request state and visible idle resource state have
different owners.

## Recovery and mutations

Optional next increment: `refetchOnFocus` and `refetchOnReconnect` for observed stale queries only, joining valid
pending work. Returning visible currently only resumes overdue polling. Do not claim a paused fetch state until
queue-and-resume semantics exist; a later fetchStatus can distinguish idle/fetching/paused if that capability is
actually implemented. Default network-independent execution preserves local Observable/Promise loaders. Browser online
state is a hint.

Mutation timeout/lost response can leave server outcome unknown. Do not automatically resubmit POST/PATCH or replay
offline writes. Backend idempotency keys or reading the operation result are required for safe retry of uncertain
writes. Keep mutation arguments as an immutable submitted snapshot, retain form input, and distinguish write error from
invalidationError. Success with a failed background refresh calls for read recovery, not a second write.

Defer shared optimistic updates until rollback, overlap, and cancellation ownership are explicit. Local pending UI is
often enough. Future mutation.reset must clear presentation without pretending to abort an already submitted write;
in-flight tracking and successful scoped invalidation must remain truthful.

## Delivery and evidence

1. Correctness: observer isolation and diagnostic safety; add focused reproductions before fixes.
2. Current-API failure recipes and localized demos: initial/refresh errors, partial rows, parent failures, mutation
   errors.
3. Bounded shared retries plus logical deadline and once-per-read reporting, with Observable/Promise parity tests.
4. Optional focus/reconnect recovery; defer offline replay, React-style error boundaries, and complex optimism.

The research comparison is source-backed. The listener defect is independently reproduced in this audit. Proposed new
fields are not exported, and no production source was changed in this design pass. The preceding normalizer fix
`98d8918` is CI-green (16 passed, 2 skipped), but that does not cover the newly discovered observer-exception defect.

The current-API UsersComponent example passed strict TypeScript checking with zero diagnostics. All three new Markdown
artifacts passed formatting checks. No runtime changes or new runtime test claims are part of this design pass.

Implementation checkpoint: observer exception isolation passed 5 new regression cases and 43 existing QueryClient tests.
