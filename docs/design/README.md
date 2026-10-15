# API specifications

[Documentation index](../README.md) · [Roadmap](priority-roadmap.md)

| API                                                               | Canonical contract                                           |
| ----------------------------------------------------------------- | ------------------------------------------------------------ |
| queryResource, queryResources, QueryClient and Observable facades | [Query and cache](query-resource-design-spec.md)             |
| mutateResource                                                    | [Writes and concurrency](mutate-resource-design-spec.md)     |
| resourceAsync                                                     | [Independent async lifecycle](resource-async-design-spec.md) |
| computedAsync                                                     | [Derived async signals](computed-async-design-spec.md)       |
| Kubernetes retry operator and interceptor                         | [Retry options](k8s-retry-options.md)                        |

These documents define behavior, error handling, cancellation, lifetime and supported scope. Public signatures and
regression tests remain in the libraries. Keep release changes in [CHANGELOG](../../CHANGELOG.md), publishing procedures
in [DEPLOYMENT](../DEPLOYMENT.md), and loading/localization/shared-service guidance in the
[integration guide](../guides/demo-and-library-integration.md).
