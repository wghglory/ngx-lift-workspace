# Kubernetes retry configuration and demos

Status: Implemented (contract audit). Owner: ngx-lift maintainers. Updated: October 17, 2026. Package: ngx-lift.
Approval: existing API; this audit does not approve new behavior.

## Applicable contracts

Async retries, method/idempotency policy, server minimum delays, budgets and cancellation apply. Applications own
rendered failures and form submission; retry does not create shared cache or write-safety guarantees.

## Developer learning journey and pedagogy plan

Prerequisites: RxJS subscriptions and GET retry semantics; configure HttpClient for the interceptor.

| Reader task              | Learning outcome                                            | Destination / working example                                                                                |
| ------------------------ | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Run one simulated GET    | Observe 429, the required wait and successful recovery      | [/ngx-lift/operators/k8sRetryBackoff](https://ngx-lift.netlify.app/ngx-lift/operators/k8sRetryBackoff)       |
| Configure request policy | Compare interceptor setup, cancellation and allowed methods | [/ngx-lift/interceptors/k8sRetryBackoff](https://ngx-lift.netlify.app/ngx-lift/interceptors/k8sRetryBackoff) |

Validation and delivery: The fixed starters landed in #169. Keep server hints/method-safety regressions and demo request
teardown; writes still require endpoint evidence. The public API and behavior sections below own exact options and
limitations; examples introduce them after the first task.

## Public API and examples

`retryOnK8sBackoff` retains its default 429-only policy, five total attempts, exponential equal jitter, 30s single-wait
cap and 60s scheduled-wait budget. The budget excludes time spent on network requests.

The additional options are:

- `retryStatusCodes`: replace the eligible status list (default `[429]`). Review endpoint behavior before adding 503 or
  other statuses. `getK8sRetryDelayMs(error, fallbackDelayMs, retryStatusCodes)` accepts the same list.
- `isRetryable`: an extra predicate after the status check. False or a thrown exception propagates the original error.
- `minDelayMs`: a floor for fallback waits with every jitter strategy; default 0. A floor above `maxDelayMs` is invalid.
  Server hints retain their existing minimum wait and additive jitter; the fallback floor does not modify them.
- `logRetries`, `label`, `logger`: opt-in retry logging after the wait fits the budget. The callback receives a
  `K8sRetryLogContext` with `attempt`, `maxRetries`, `delayMs`, `error` and `label`. Logger failures do not abort
  recovery.

The interceptor continues to retry GET, HEAD, OPTIONS, PUT and DELETE by default. POST/PATCH require an explicit
`retryMethods` allowlist and an endpoint guarantee such as idempotency or rejection before execution. An `isRetryable`
predicate does not expand the method allowlist.

`isK8sStatusThrottled` recognizes HTTP 429 plus `{kind: 'Status', reason: 'TooManyRequests'}` in parsed or serialized
JSON bodies, including wrapped `HttpErrorResponse` errors. It identifies a response shape; it cannot establish the
origin of the error or absence of write side effects. Kubernetes exposes
[`NewTooManyRequests`](https://github.com/kubernetes/kubernetes/blob/master/staging/src/k8s.io/apimachinery/pkg/api/errors/errors.go)
as a general error constructor.

For an endpoint whose write retry contract has been confirmed:

```typescript
this.http.post('/api/v1/namespaces/default/pods', body, {
  context: new HttpContext().set(K8S_RETRY_BACKOFF_CONFIG, {
    retryMethods: ['POST'],
    isRetryable: isK8sStatusThrottled,
  }),
});
```

Register the retry interceptor before authentication interceptors so each retry rebuilds downstream headers. Use either
the operator or the interceptor for a request; layering both multiplies retry attempts. Generated interceptor log labels
omit query strings and fragments. Paths and custom labels may still contain sensitive data. Custom logger error data is
unredacted; select safe fields rather than serializing the entire context.

The operator demo documents all configuration options and displays actual scheduled waits. The interceptor demo compares
default POST failure, explicitly opted-in Kubernetes POST recovery, and rejection of a generic gateway 429. The mock
next handler exercises the production interceptor without changing application-wide HTTP configuration.

See the [command reference](../../COMMANDS.md) for validation commands.

## Background

Sources: [operator](../../../libs/ngx-lift/src/lib/operators/k8s-retry-backoff.operator.ts) and
[interceptor](../../../libs/ngx-lift/src/lib/interceptors/k8s-retry-backoff.interceptor.ts), with regression suites
beside each source.

Kubernetes throttling can carry minimum retry waits. The operator and interceptor share policy while keeping request
method safety and interceptor resubscription distinct.

## Terminology

maxAttempts counts total attempts, including the original; retry log maxRetries is maxAttempts minus one. A server hint
is a minimum wait. Scheduled-wait budget excludes network execution time; it is not an end-to-end request deadline.

## Goals

- G1: Retry configured throttled reads with bounded attempts/waits while respecting server minimum hints.
- G2: Require explicit method policy and endpoint safety before retrying POST/PATCH.

## Non-Goals

### Not now

A full request deadline, circuit breaker or shared query scheduler.

### Outside this API

Proving a write had no side effect or manufacturing endpoint idempotency.

## Use cases and acceptance

| ID  | Task                       | Initial state/action               | Outcome                                 | Failure/recovery                           | Demo/test                          |
| --- | -------------------------- | ---------------------------------- | --------------------------------------- | ------------------------------------------ | ---------------------------------- |
| K1  | Recover throttled read     | Eligible failure with/without hint | Honor minimum wait or bounded jitter    | Stop when wait cannot fit budget           | k8s-retry-backoff.operator.spec.ts |
| K2  | Protect writes             | Default POST/PATCH failure         | No retry unless explicit method opt-in  | Endpoint owner proves write safety         | interceptor tests/demo             |
| K3  | Refresh downstream headers | Retry through interceptor chain    | Reinvoke downstream handler per attempt | Same retry ownership avoids multiplication | interceptor regressions            |

## Behavior and architecture

The interceptor defers next(req) so each subscription traverses downstream interceptors again. The operator retries
source subscriptions; an eager Promise cannot be restarted by resubscription. Invalid options fail before retrying.
Server hints that exceed available wait/budget are rejected rather than shortened.

## Clarity, accessibility, and localization

Headless API; it owns no control labels, focus or translations. Application UI distinguishes initial loading/error from
retained-data refresh where applicable. Forms invoke/observe this API without assigning it a CVA/native field value.

## Demo and validation plan

Existing operator/interceptor demos show default method exclusion and explicit safe opt-in. Adjacent tests cover
Retry-After, Kubernetes hints, date validation, jitter/budgets, predicate/logging failures and downstream
resubscription. Clock/jitter fixtures make timing assertions deterministic.

## Compatibility, rollout, and risks

Angular 21/HttpClient/RxJS; no new dependency. Keep operator retry ownership separate from interceptor/query retries.
Subscription cancellation stops waits/Observable work; no SSR-specific scheduling behavior is claimed.

## Industry evidence and current gaps

Kubernetes' general TooManyRequests constructor above is response-shape evidence, not write-safety evidence. Adopt
minimum-wait handling; reject implicit POST/PATCH eligibility based only on the body reason.

## Review decisions and delivery

This is an audit of shipped behavior. Proposed features and unresolved implementation work belong in the
[gap register](../implementation-gaps.md) and [roadmap](../../priority-roadmap.md); no new API is approved here.

## Evidence

Contract checked against source and existing regression assertions at base `e4a43f9` on October 16, 2026. Test pointers
identify existing coverage; no runtime suites were rerun for this documentation-only change. Release/CI evidence remains
in the corresponding PR and pipeline.
