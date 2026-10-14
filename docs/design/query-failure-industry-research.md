# Query failure behavior: industry research and ngx-lift gaps

Checked October 14, 2026 against historical baseline `98d8918`, before the resilience implementation. This is research
and API design input; its local gap analysis describes that baseline. See
[implemented failure contracts](query-failure-design.md) for current behavior. External findings use primary
documentation or upstream source. Local findings below come from reading the current query models, client, resource, and
result normalizer; no test suite was run for this research artifact.

## What the established libraries provide

### TanStack Query: portable query behavior

- React query retries default to three retries on the client and zero on the server. Retry policy can be disabled,
  bounded numerically, or decided by an error predicate. Backoff starts at one second, doubles, and caps at 30 seconds.
  Intermediate errors are exposed as `failureReason`, with terminal failure exposed as `error`. These policies have both
  global and query-level configuration. Angular's retry guide documents the same policy and backoff for `injectQuery`.
  [React retries](https://tanstack.com/query/latest/docs/framework/react/guides/query-retries),
  [Angular retries](https://tanstack.com/query/latest/docs/framework/angular/guides/query-retries)
- Query data status and fetch activity are separate. Online mode can pause a fetch or retry when disconnected, then
  continue it after reconnect; cancellation prevents continuation. `always` mode accommodates local async sources.
  `offlineFirst` runs once before pausing retries, permitting service-worker or HTTP cache hits. Reconnect continuation
  and a new reconnect refetch are different operations. These concepts apply to Angular too.
  [React network modes](https://tanstack.com/query/latest/docs/framework/react/guides/network-mode),
  [Angular network modes](https://tanstack.com/query/latest/docs/framework/angular/guides/network-mode)
- `isLoadingError` and `isRefetchError` distinguish failure before useful data exists from a failed background refresh.
  Stale observed queries refetch on focus by default; the policy is configurable. This supports a nonblocking
  refresh-error UI instead of replacing all content with a full-page error.
  [Query result/options](https://tanstack.com/query/latest/docs/framework/react/reference/functions/useQuery)
- Query cancellation is a cache lifecycle operation, not necessarily transport cancellation. Unused reads can finish
  into cache by default. Consuming the supplied AbortSignal permits transport cancellation and reverting prior query
  state. Manual `cancelQueries` also reverts query state. Angular's HttpClient example manually combines `takeUntil`
  with Promise conversion.
  [React cancellation](https://tanstack.com/query/latest/docs/framework/react/guides/query-cancellation),
  [Angular cancellation](https://tanstack.com/query/latest/docs/framework/angular/guides/query-cancellation)
- Cache-wide notifications are available through `QueryCache.subscribe`. Current upstream `QueryCacheConfig`
  additionally defines `onError`, `onSuccess`, and `onSettled` callbacks. A client-level hook can report an error once
  for the shared query rather than once per component observer.
  [QueryCache reference](https://tanstack.com/query/latest/docs/framework/react/reference/classes/QueryCache),
  [Official configuration source](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryCache.ts)

### React-only presentation integration

React `useQuery` and `useMutation` offer `throwOnError` to route selected failures to a React error boundary. This is
framework presentation behavior; it is not an Angular requirement or a portable query-cache contract. Angular should
expose reliable failure state and explicit rejected execution promises before considering an integration with its global
error handling. [useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/functions/useQuery),
[useMutation](https://tanstack.com/query/latest/docs/framework/react/reference/functions/useMutation)

### SWR

- SWR can expose existing `data` and an `error` simultaneously. Retry uses exponential backoff and can be overridden
  with `onErrorRetry`; the documentation demonstrates skipping 404s and bounding retry count. Global `onError` allows
  centralized reporting. [Error handling](https://swr.vercel.app/docs/error-handling)
- Focus and reconnect revalidation are enabled by default and configurable. This improves recovery when a tab becomes
  relevant again. It is not equivalent to guaranteeing that every offline request is retained and replayed.
  [Revalidation](https://swr.vercel.app/docs/revalidation)
- Optimistic mutations support `optimisticData`, `rollbackOnError`, and replacing cache data with a successful response
  through `populateCache`. Rollback can be conditional.
  [Mutation and revalidation](https://swr.vercel.app/docs/mutation)

### RTK Query

- Retries are an explicit wrapper around `baseQuery`, not an automatic claim about every unwrapped endpoint. The `retry`
  wrapper defaults to `maxRetries: 5` and exponential backoff with randomized delay; endpoints can override the count.
  `retry.fail` can stop futile retries, such as unauthorized failures. Its documentation explicitly says the last good
  `data` may coexist with `error`.
  [Customizing queries](https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#automatic-retries)
- `fetchBaseQuery` exposes discriminated HTTP, fetch, parsing, timeout, and custom error results. A timeout can be set
  globally or per endpoint; no default timeout is set. Endpoint timeout wins over the base setting.
  [fetchBaseQuery](https://redux-toolkit.js.org/rtk-query/api/fetchBaseQuery)
- `refetchOnFocus` and `refetchOnReconnect` are configurable and require `setupListeners`. These are observer recovery
  policies, separate from transport details.
  [Cache behavior](https://redux-toolkit.js.org/rtk-query/usage/cache-behavior)
- Macro error reporting can use Redux middleware matching rejected actions. A generic toast is an application choice,
  not required behavior of a cache. [Error handling](https://redux-toolkit.js.org/rtk-query/usage/error-handling)
- Optimistic cache patches can be undone after failure, but overlapping mutations can make `.undo()` race. The docs
  recommend invalidating and refetching on error when rollback ordering is difficult to guarantee.
  [Manual cache updates](https://redux-toolkit.js.org/rtk-query/usage/manual-cache-updates)

### Angular HttpClient and RxJS

- HttpClient reports failures through the Observable error channel as `HttpErrorResponse`. Network and timeout failures
  have status zero; server failures carry the server's status. RxJS retries resubscribe, which creates another HTTP
  request. Unsubscription aborts the in-progress request. HttpClient Observables normally complete, although
  interceptors can change that behavior. [Making requests](https://angular.dev/guide/http/making-requests)
- Current Angular documentation includes `timeout` in HTTP request options. This deadline aborts the backend request; it
  excludes delays elsewhere in the interceptor chain. A query deadline covering a composed loader or Promise is
  consequently a different feature. Verify the consuming application's Angular version before recommending newer request
  options. [HTTP timeouts](https://angular.dev/guide/http/making-requests#timeouts)

## Mutations require a different failure policy

TanStack mutations default to zero retries, support explicit retry/backoff, and can serialize mutations sharing a
`scope.id`. Optimistic cache updates commonly cancel refetches, snapshot prior data, update cache, restore on error, and
invalidate on settlement. A component-local optimistic display can be simpler than editing shared cache.
[Mutation reference](https://tanstack.com/query/latest/docs/framework/react/reference/functions/useMutation),
[Optimistic updates](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates)

HTTP semantics prohibit assuming that an interrupted non-idempotent operation is safe to replay. RFC 9110 says clients
should not automatically retry such a request without knowing it is idempotent or detecting that the original operation
was never applied. Therefore a client timeout, cancellation, or lost response does not establish that a write failed on
the server. Backend idempotency support or reconciliation is needed before reliable automatic replay.
[RFC 9110, section 9.2.2](https://www.rfc-editor.org/rfc/rfc9110.html#section-9.2.2)

**Design judgment:** keep mutation retries disabled by default. Start with pessimistic writes plus scoped invalidation;
add cache optimism only with a documented concurrency and rollback contract. The query library cannot guarantee
exactly-once server writes.

## Current ngx-lift: source-verified baseline

Sources: [query.models.ts](../../libs/ngx-lift/src/lib/query/query.models.ts),
[query-client.ts](../../libs/ngx-lift/src/lib/query/query-client.ts),
[query-normalizer.ts](../../libs/ngx-lift/src/lib/query/query-normalizer.ts),
[query-resource.ts](../../libs/ngx-lift/src/lib/query/query-resource.ts),
[mutate-resource.ts](../../libs/ngx-lift/src/lib/query/mutate-resource.ts).

| Area                    | Verified behavior                                                                                                                                                                                                        | Practical implication                                                                                                                                                            |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Native transports       | `QueryResult<T>` accepts Observable and PromiseLike. Normalizer takes the first Observable value, unsubscribes, rejects empty completion with `EmptyError`, preserves errors, and handles abort.                         | Observable support already exists; do not propose it as missing.                                                                                                                 |
| Refetch failure         | `startRequest` retains `value`, `hasValue`, and `updatedAt`; publishes `status: 'error'`, stores the error, and marks stale.                                                                                             | Data retention already exists; document templates that render value plus a refresh warning.                                                                                      |
| Initial vs refresh      | Resource exposes `isInitialLoading` and `isRefreshing`; snapshot has `hasValue` and `error`.                                                                                                                             | Initial-error vs refresh-error can be derived; named helpers improve DX rather than correctness.                                                                                 |
| Retry                   | Request rejection directly becomes terminal error. Definition/client options have no retry/backoff policy.                                                                                                               | Loader-level RxJS retry is possible today; one shared query policy would support PromiseLike too and expose attempts consistently.                                               |
| Deadlines               | No query timeout/deadline option or attempt watchdog exists in these sources.                                                                                                                                            | A never-emitting Observable or unsettled Promise can keep a shared entry pending indefinitely. This is a contract/availability gap, not proof of a specific production incident. |
| Visibility/reconnect    | Client supports visibility-aware polling. Returning visible starts requests only when a polling deadline is due; no online manager or stale nonpolling focus policy exists.                                              | Polling recovery is not general reconnect/focus recovery.                                                                                                                        |
| Cancellation            | Removal/destroy abort requests; optional `cancelOnNoObservers` permits abandonment. Generation checks prevent superseded results updating cache. No nondestructive public `cancelQueries` method appears in QueryClient. | Existing lifecycle cancellation is useful; a user-facing Cancel action needs an explicit scope contract.                                                                         |
| Global reporting        | Options expose clock/visibility/capacity, but no cache-wide event or terminal-error reporting hook.                                                                                                                      | Apps otherwise report per observer or at transport level; shared-query reporting needs deliberate deduplication.                                                                 |
| Mutation/cache optimism | mutateResource exposes write errors and separate invalidationError, with parallel/exhaust/concat concurrency; QueryClient has scoped invalidation but no optimistic cache setter/rollback facility.                      | Treat mutation ergonomics as separate design scope; do not graft write behavior onto read loaders.                                                                               |

### P0 correctness issue, separate from feature gaps

The coordinating review executed current `QueryClient` with a listener that throws only on the loading notification. It
observed zero loader calls, a loading snapshot, and another same-key fetch still pending after a 20 ms race.
`startRequest` publishes pending state before the `try` around loader execution; `publish` directly invokes each
observer listener. A consumer exception can therefore interrupt transport startup after pending state is installed. This
report is evidence from the coordinating review, not a reproduction executed by this research agent.
[startRequest/publish source](../../libs/ngx-lift/src/lib/query/query-client.ts)

Fix and regression-test observer exception isolation before adding resilience policies. A toast, telemetry callback, or
component listener must not strand transport, prevent other observers receiving state, or turn a successful response
into a transport failure.

## Recommended priorities, without copying every feature

1. **Correctness first:** exception isolation, no pending leaks, abort distinguished from terminal failure, and
   consistent failure publication across Observable and PromiseLike paths. Preserve generation and reentrant publication
   protections.
2. **Document existing recovery:** initial-error vs refetch-error UI; preserve good data during failed refresh; manual
   `reload()` and awaited `execute()`; empty Observable and first-emission behavior. Do not convert failures to
   successful empty lists with `catchError(() => of([]))` unless that is the actual domain contract.
3. **Add a bounded read retry policy:** prefer configurable count, error predicate, capped delay/jitter, and retry
   metadata. Keep zero retries as a defensible default for an unopinionated library; provide a documented transient-read
   preset. Retry must invoke the loader anew, not await the same rejected Promise again. Cancellation/removal cancels
   retry timers. Tag invalidation isolates generations but preserves old callers’ retry/deadline completion machinery
   until settlement; obsolete reads must not publish cache updates or error notifications. Polling must not create a
   second retry loop.
4. **Add an opt-in deadline:** define its scope across loader execution and retry waits. The accompanying design starts
   with a total logical-read deadline and defers a separate attempt timeout. Abort Observable transport on timeout;
   reject Promise callers and suppress late cache updates even when the Promise's work cannot physically be canceled.
   Use a stable timeout error identity without destroying the original cause.
5. **Add optional recovery triggers:** focus/reconnect should refresh observed stale reads with pending deduplication;
   do not refetch every cached entry or every focus event. Adopt paused/offline state only if genuine queue-and-resume
   semantics are implemented. Browser connectivity is a hint, not proof the backend is reachable.
6. **Provide one client-level terminal-error event:** include key, cause, attempt count, whether retained data exists,
   and request cause. Do not report each intermediate retry as a new user-visible failure or emit a toast per observer.
   Reporter exceptions must be isolated.
7. **Keep write recovery explicit:** mutation no-retry default, idempotency/reconciliation recipes, invalidation on
   confirmed or uncertain outcomes, and concurrency-safe optimism as a later increment. Avoid an offline mutation replay
   queue without a product need and a persistence/idempotency design.

These priorities are recommendations inferred from the evidence. Industry libraries differ on defaults; absence of their
entire feature set is not itself an ngx-lift defect.
