# API specifications

[Documentation index](../README.md) · [Delivery roadmap](../priority-roadmap.md)

## Component planning and review

Start with the [component roadmap](../component-roadmap.md), [development workflow](component-development.md), and
[spec template](templates/component-design-spec.md). New controls first target Angular 21 ngModel and typed Reactive
Forms, including the existing toSignalForm facade. Native signal-field support is required after the deferred Angular/Nx
upgrade. Feature API examples remain drafts until reviewed and implemented.

## ngx-lift implemented contracts

| API                                                               | Canonical contract                                                    |
| ----------------------------------------------------------------- | --------------------------------------------------------------------- |
| queryResource, queryResources, QueryClient and Observable facades | [Query and cache](ngx-lift/query-resource-design-spec.md)             |
| mutateResource                                                    | [Writes and concurrency](ngx-lift/mutate-resource-design-spec.md)     |
| resourceAsync                                                     | [Independent async lifecycle](ngx-lift/resource-async-design-spec.md) |
| computedAsync                                                     | [Derived async signals](ngx-lift/computed-async-design-spec.md)       |
| Kubernetes retry operator and interceptor                         | [Retry policy](ngx-lift/k8s-retry-options.md)                         |
| Reactive Forms state, facade, bindings and submission             | [Reactive Forms](ngx-lift/reactive-forms-design-spec.md)              |
| IdleDetectionService and watch ownership                          | [Idle lifecycle](ngx-lift/idle-detection-design-spec.md)              |
| poll and Kubernetes list aggregation                              | [Polling and pagination](ngx-lift/polling-pagination-design-spec.md)  |

## clr-lift implemented contracts

| API                                                                | Canonical contract                                                      |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| TooltipDirective and owned/borrowed popup content                  | [Tooltip and popover](clr-lift/tooltip-design-spec.md)                  |
| FileReaderComponent CVA, encoding and read cancellation            | [File reader](clr-lift/file-reader-design-spec.md)                      |
| CertificateService, signpost and parsing validator                 | [Certificates](clr-lift/certificate-design-spec.md)                     |
| IdleDetectionComponent shared/scoped warning                       | [Idle warning](clr-lift/idle-warning-design-spec.md)                    |
| AlertService/ToastService and notification containers              | [Notifications](clr-lift/notifications-design-spec.md)                  |
| TimelineWizardComponent, base step and service                     | [Timeline wizard](clr-lift/timeline-wizard-design-spec.md)              |
| TranslationService and ThemeService                                | [Runtime presentation](clr-lift/runtime-presentation-design-spec.md)    |
| Legacy FormArray editor and additive immutable array-value control | [Key/value control contracts](clr-lift/key-value-inputs-design-spec.md) |
| QueryDevtoolsComponent and conditional root provider               | [Query inspector](clr-lift/query-devtools-design-spec.md)               |

## Review status and maintenance

The [gap register](implementation-gaps.md) records the check of every preexisting spec, source evidence and prioritized
implementation fixes. Proposed controls are linked from the [component roadmap](../component-roadmap.md); they are not
implemented APIs. Specs use the shared template's required topics, retaining accurate legacy detail and explicitly
marking inapplicable UI/forms concerns. The documentation learning briefs distinguish delivered demos from proposed
destinations. Simple pure helpers/pipes stay in public JSDoc and focused tests unless their state, resource or
compatibility contract warrants a separate spec.

These documents define behavior, error handling, cancellation, lifetime and supported scope. Public signatures and
regression tests remain in the libraries. Keep release changes in [CHANGELOG](../../CHANGELOG.md), publishing procedures
in [DEPLOYMENT](../DEPLOYMENT.md), and loading/localization/shared-service guidance in the
[integration guide](../guides/demo-and-library-integration.md).
