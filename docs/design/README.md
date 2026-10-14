# Async and query design specifications

| API                                                                  | Contract                                                                                                             |
| -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `queryResource`, `queryResources`, `QueryClient`, Observable facades | [Query design and production contracts](query-resource-design-spec.md) · [中文](query-resource-design-spec.zh-CN.md) |
| `mutateResource`                                                     | [Explicit writes and concurrency](mutate-resource-design-spec.md) · [中文](mutate-resource-design-spec.zh-CN.md)     |
| `resourceAsync`                                                      | [Independent async lifecycle](resource-async-design-spec.md) · [中文](resource-async-design-spec.zh-CN.md)           |
| `computedAsync`                                                      | [Derived async signals](computed-async-design-spec.md)                                                               |

The query spec covers selection, naming, collections, cache, cancellation, failure/recovery, configuration, lifecycle,
session isolation, diagnostics and supported production scope. It is the single query entry point.

Validation, earlier priority completion and open release conditions are recorded in the
[current query review](../reviews/query-production-review.md) and its
[Chinese companion](../reviews/query-production-review.zh-CN.md). Published/unreleased consumer changes belong in
[MIGRATIONS](../MIGRATIONS.md), not in additional design proposals.

Related contracts: [Kubernetes retry options](k8s-retry-options.md),
[DSM consumer retry contracts](dsm-consumer-contracts-and-retry.md),
[Priority 1/2 cross-library contracts](priority-1-2-completion.md). Broader quality audit records remain separate from
query design.
