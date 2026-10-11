# Async and query migration for PR #142

This branch adds shared query APIs and corrects existing public type contracts. Consumers must review the following
changes before upgrading. These typing corrections require a breaking release under semantic versioning.

## Nullable collections and emptiness checks

`isEmpty()` and `isNotEmpty()` no longer narrow nullable collections to `null`, `undefined`, or a defined collection.
Empty defined objects can appear in the true branch of `isEmpty` and the false branch of `isNotEmpty`, so the former
predicates were unsound. Check nullability separately:

```typescript
import {isNotEmpty} from 'ngx-lift';

function process(items: string[] | null | undefined): void {
  if (items != null && isNotEmpty(items)) {
    console.log(items.length);
  }
}
```

Explicit generic calls such as `isNotEmpty<MyType>(value)` must become `isNotEmpty(value)`. The emptiness runtime
behavior is unchanged.

## Combined and merged signals

`combineFrom()` without an initial value can return `undefined` before asynchronous sources emit. Handle that state or
provide an initial value. `mergeFrom()` without an initial value requires a synchronous emission and throws if no source
emits synchronously. Supply an initial value for asynchronous-only sources. An explicit `null` initial value is now
correctly retained in the `mergeFrom()` return type.

```typescript
import {mergeFrom} from 'ngx-lift';

const state = mergeFrom([response$], {initialValue: [] as string[]});
```

## Async cancellation and public imports

Awaited `resourceAsync.execute()` calls reject with `ResourceAsyncCancelledError` when replaced, reset, locally
overridden, or destroyed during execution. Handle cancellation when awaiting operations. Calling a disposed resource
rejects with `ResourceAsyncDisposedError`. Prefer `{params, loader}` for tracked parameters and untracked transport,
particularly with `behavior: 'exhaust'`. Legacy callback overloads remain available; documented exhaust tracking
limitations remain.

Continue importing `resourceAsync` from the public `ngx-lift` entrypoint. Its internal source location moved from
`signals/` to `query/`; unsupported source-path imports must be updated. Shared `queryResource` / `mutationResource`
APIs are additive; see [usage and lifecycle](../libs/ngx-lift/src/lib/query/query.md).

## Kubernetes pagination

Pagination retries HTTP 429 by default; use `{initialParams, retryConfig: false}` to keep immediate error propagation.
The aggregate result now carries the final page metadata, including its cleared continuation token, and normalizes
missing or null `items` to `[]`. Scalar HTTP parameters named `initialParams` or `retryConfig` remain supported; wrap
parameters in `initialParams` when a legacy boolean `retryConfig: false` would be ambiguous with the new option.
