# DSM consumer contracts and Kubernetes retry hardening

This review uses ngx-lift `6cc0ef0` and the current hardening branch, DSM's local resource migration, and DSM PR
[#2453](https://github-vcf.devops.broadcom.net/vcf/dsm-ui/pull/2453) at `62e1b33bf66f3173ebdbccb350beffec5a6efcba` (base
`0e4ae5f071793cd5b5de6129428dc0e7d5ee9a5f`). The originating issue is
[TDMP-20455](https://vmw-jira.broadcom.net/browse/TDMP-20455). See the
[Chinese explanation](./dsm-consumer-contracts-and-retry.zh-CN.md) for evidence and validation.

## Emptiness and nullability

A predicate `value is T` promises both directions: true means T, false excludes T. An empty array, object, Map or Set is
still T. `isNotEmpty<T>(value): value is T` therefore lies in the false branch. The boolean overload introduced in
`6cc0ef0` fixes that contract; it was not just a workaround for one test.
[TypeScript's predicate semantics](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-5.html#inferred-type-predicates)
explicitly require the false direction too. Restoring the old overload silently reintroduces incorrect narrowing.

For an optional collection, check presence explicitly:

```typescript
if (criteria != null && isNotEmpty(criteria)) {
  criteria.forEach(useCriterion);
}
```

```html
@if (policy.matchCriteriaOrgIds && isNotEmpty(policy.matchCriteriaOrgIds)) {
<dds-organization-name-signpost [orgIds]="policy.matchCriteriaOrgIds" />
}
```

An array-specific length check is also reasonable when only presence/content matters. Do not change boolean semantics to
truthiness: `0`, `false`, functions and objects without enumerable string keys are considered empty by this utility, in
the historical Lodash-style contract. Date, typed collections, symbol-only objects and foreign-realm containers warrant
explicit application predicates when their content matters. The current DSM production scan found 23 emptiness calls
across `libs/` and `apps/`, mostly optional policy arrays. SQL Server computed booleans and retention-array ternaries do
not require type narrowing.

The package-consumer check compiles both branches using the actual packed `.d.ts`, including expected compile errors for
assigning a nullable collection to a defined array, and property access on a defined empty array. Runtime-only Vitest
`expectTypeOf` assertions are insufficient evidence without an actual TypeScript check.

## Service placement and subscription timing

All three APIs can live in services or components. Use a shared service for domain endpoints, keys and writes; use a
component observer for view lifetime and inputs. Shared cache ownership belongs to `QueryClient`. A service field uses
its provider injector; a root service field can remain alive until application teardown. A service factory method needs
either an ambient injection context or the caller's explicit `{injector}`. The placement example now accepts the caller
injector so event-handler calls are safe too. `resourceAsync` follows the same injector lifetime rule, without
automatically sharing query data.

`fetchQueryObservable` is already cold: its implementation wraps `client.fetchQuery` in `defer`. DSM's additional outer
`defer` builds URL and scoped cache key at subscription time. It is useful even though another defer exists internally.
Keeping the Observable service signature also preserves existing RxJS consumers. Standard
`http.get(url, {headers: getHeaders()})` delays the HTTP request, but JavaScript still evaluates `url` and
`getHeaders()` immediately when the method is called.

## Polling and modals

The parent previously omitted `[pollingEnabled]`, so the default input remained true. The parent now binds
`!isEditOrgModalOpen()`. The table also suppresses its interval while its own toggle modal is open. This pause preserves
the observer and cached rows; it suppresses that observer's scheduled polling only. It does not cancel a request already
in flight or prevent a second observer/manual invalidation from fetching. Root Angular `QUERY_CLIENT` integration pauses
polling when the document is hidden; a standalone `new QueryClient()` needs its own visibility integration. The existing
parent RxJS timer is outside that integration. The parent and child currently both schedule row refreshes; consolidating
row polling under one owner is a follow-up that should preserve immediate refresh after organization writes. Modal pause
is an optional UX/network policy, not a correctness prerequisite.

## Retry contract

`retryOnK8sBackoff` remains 429-only and retains wrapped HTTP errors and JSON-string body support. The default is five
total attempts, 1000ms exponential fallback base, equal jitter, up to 250ms additive hint jitter, 30s maximum individual
wait and 60s cumulative scheduled wait. The budget excludes network request duration; use an application
timeout/cancellation policy when a wall-clock deadline is required. `jitter: 'none'` provides deterministic exponential
delays; `full` permits zero waits by design. `random` is injectable for deterministic scheduling. Invalid numeric
operator configuration throws early; a faulty delay/random callback preserves the original HTTP error. Unsubscription
cancels pending timers.

Server hints are minimum waits. A 120s hint with a 30s cap stops retrying and returns the original error; it never
schedules an early 30s retry. Numeric overflow and malformed numeric/date hints fall back safely. HTTP-date values in
the past yield zero before optional additive jitter.

Interceptors default to GET/HEAD/OPTIONS/PUT/DELETE. POST/PATCH require explicit opt-in and an actual endpoint
idempotency guarantee or idempotency key. The RxJS operator cannot infer an HTTP method; its caller owns write safety.
[RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html#section-9.2.2) explains automatic retry constraints.
`defer(() => next(req))` rebuilds the downstream chain on each attempt, including fresh authentication state. Register
the retry interceptor before authentication interceptors; interceptor order still determines which run again.

```typescript
provideK8sRetryBackoffConfig({maxAttempts: 3, maxTotalDelayMs: 20_000}),
provideHttpClient(withInterceptors([k8sRetryBackoffInterceptor, authInterceptor])),
```

Existing factory/context APIs remain. Global defaults apply to `k8sRetryBackoffInterceptor`; the explicit factory uses
its supplied defaults. A request context override merges over either. `false` disables retries. ngx-lift performs no
automatic request logging and embeds no localStorage/mock-server fault injection. Simulation belongs in development
infrastructure, outside the reusable production retry primitive.

## PR #2453 review

### Standards

No documented repository architecture rule was violated. The code-review Standards axis found six substantive
correctness/security concerns: shortening server hints, default POST/PATCH retries, query-parameter logging, ignored
operator `enabled:false`, mock inspection resetting counters, and missing stringified JSON body hints. These have
concrete fixes in the isolated `fix/pr2453-retry-hardening` worktree.

### Spec

The Spec axis found malformed header values overriding valid body hints, incomplete real-backend simulation activation
instructions, and shared mock counters for parallel clients. The originating Jira requirement to respect
`retryAfterSeconds` also conflicts with shortening a long hint. Fixes reject malformed/nonfinite hints, preserve long
hints until the operator declines retrying, document development-only interceptor registration, and support
`X-DSM-Mock-Client` IDs. Inspection preserves counters; numeric settings are validated.

Full jitter zero and a cumulative wait budget conform to the PR's stated policy. Environment-provider defaults are a
useful integration choice, but a factory is also an idiomatic Angular functional interceptor API. Deduplicate DSM's
retry implementation after the improved ngx-lift package is released and adopted; replacing it immediately would make
DSM depend on APIs absent from its installed package.

## Validation

- Full `pnpm run validate`: passed; ngx-lift 731, clr-lift 238 and demo 206 tests (1175 total), plus seven tooling
  tests.
- Branch coverage: ngx-lift 90.44%, clr-lift 77.04%, demo 75.47%; thresholds met.
- `pnpm nx run demo-e2e:e2e`: 96 passed across Chromium, Firefox and WebKit.
- Packed-package consumer compilation and runtime imports: passed, with actual boolean declarations and provider API.
- DSM `data-service:build` with the freshly built declaration copied into a temporary DSM-local file: passed in strict
  Angular production mode. Installed dependency files and lockfiles were not edited.
- DSM focused tests: policy 4, region table 40, parent Advanced 23, VcfTmService 29; all passed.
- DSM PR branch: 56 core retry tests and three mock tests passed; core/server lint and builds passed. Existing lint
  warnings remain.

The DSM migration working tree already contained user changes; they remain uncommitted and are not included in the
isolated PR retry branch. npm publication, remote pushes and PR comments were not performed. Fresh dependency
installation, additional Angular majors, full DSM E2E and manual accessibility testing are outside these checks.

Code-review totals: Standards six original findings (highest impact: unsafe write retries and shortened server hints);
Spec four original findings (highest impact: violating the originating issue's required server wait). All have local
fixes.
