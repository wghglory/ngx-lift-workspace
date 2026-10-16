# API specifications

[Documentation index](../README.md) · [Roadmap](../priority-roadmap.md)

## Component planning and review

Start with the [component roadmap](../component-roadmap.md), [development workflow](component-development.md), and
[spec template](templates/component-design-spec.md). New component proposals are **drafts**, separate from the
implemented API contracts below. The component roadmap links every draft and records Angular 21-first delivery and the
deferred platform upgrade.

## Existing API contracts

| API                                                               | Canonical contract                                                    |
| ----------------------------------------------------------------- | --------------------------------------------------------------------- |
| queryResource, queryResources, QueryClient and Observable facades | [Query and cache](ngx-lift/query-resource-design-spec.md)             |
| mutateResource                                                    | [Writes and concurrency](ngx-lift/mutate-resource-design-spec.md)     |
| resourceAsync                                                     | [Independent async lifecycle](ngx-lift/resource-async-design-spec.md) |
| computedAsync                                                     | [Derived async signals](ngx-lift/computed-async-design-spec.md)       |
| Kubernetes retry operator and interceptor                         | [Retry options](ngx-lift/k8s-retry-options.md)                        |

These documents define behavior, error handling, cancellation, lifetime and supported scope. Public signatures and
regression tests remain in the libraries. Keep release changes in [CHANGELOG](../../CHANGELOG.md), publishing procedures
in [DEPLOYMENT](../DEPLOYMENT.md), and loading/localization/shared-service guidance in the
[integration guide](../guides/demo-and-library-integration.md).
