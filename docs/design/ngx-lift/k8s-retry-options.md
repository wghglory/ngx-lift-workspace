# Kubernetes retry configuration and demos

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
