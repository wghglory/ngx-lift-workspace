# API specifications

[Documentation index](../README.md)

## Component planning and review

Start with the [component roadmap](../component-roadmap.md), [development workflow](component-development.md), and
[spec template](templates/component-design-spec.md). New controls first target Angular 21 ngModel and typed Reactive
Forms, including the existing toSignalForm facade. Native signal-field support is required after the deferred Angular/Nx
upgrade. Feature API examples remain drafts until reviewed and implemented.

## ngx-lift implemented contracts

| API                                                               | Canonical contract                                                                |
| ----------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| queryResource, queryResources, QueryClient and Observable facades | [Query and cache](ngx-lift/query-resource-design-spec.md)                         |
| mutateResource                                                    | [Writes and concurrency](ngx-lift/mutate-resource-design-spec.md)                 |
| resourceAsync                                                     | [Independent async lifecycle](ngx-lift/resource-async-design-spec.md)             |
| computedAsync                                                     | [Derived async signals](ngx-lift/computed-async-design-spec.md)                   |
| Kubernetes retry operator and interceptor                         | [Retry policy](ngx-lift/k8s-retry-options.md)                                     |
| Reactive Forms state, facade, bindings and submission             | [Reactive Forms](ngx-lift/reactive-forms-design-spec.md)                          |
| IdleDetectionService and watch ownership                          | [Idle lifecycle](ngx-lift/idle-detection-design-spec.md)                          |
| poll and Kubernetes list aggregation                              | [Polling and pagination](ngx-lift/polling-pagination-design-spec.md)              |
| getValueByPath, deleteValueByPath, downloadFile                   | [Object path and file download](ngx-lift/core-utilities-design-spec.md)           |
| Standard validators (approved)                                    | [Standard Reactive Forms validators](ngx-lift/standard-validators-design-spec.md) |

## clr-lift implemented contracts

| API                                                                | Canonical contract                                                      |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| TooltipDirective and owned/borrowed popup content                  | [Tooltip and popover](clr-lift/tooltip-design-spec.md)                  |
| FileReaderComponent CVA, encoding and read cancellation            | [File reader](clr-lift/file-reader-design-spec.md)                      |
| Certificate signpost and parsing validator                         | [Certificates](clr-lift/certificate-design-spec.md)                     |
| IdleDetectionComponent shared/scoped warning                       | [Idle warning](clr-lift/idle-warning-design-spec.md)                    |
| AlertService/ToastService and notification containers              | [Notifications](clr-lift/notifications-design-spec.md)                  |
| AlertComponent closable state and localized close button           | [Alert closable](clr-lift/alert-design-spec.md)                         |
| BreadcrumbComponent and object-path helper                         | [Breadcrumbs](clr-lift/breadcrumb-design-spec.md)                       |
| DatagridSelectionComponent value control                           | [Native grid selection](clr-lift/datagrid-selection-design-spec.md)     |
| TimelineWizardComponent, base step and service                     | [Timeline wizard](clr-lift/timeline-wizard-design-spec.md)              |
| ClrLiftI18nService and ThemeService                                | [Runtime presentation](clr-lift/runtime-presentation-design-spec.md)    |
| provideClrLiftI18n and bootstrap locale resolution                 | [Locale provider](clr-lift/locale-provider-design-spec.md)              |
| Legacy FormArray editor and additive immutable array-value control | [Key/value control contracts](clr-lift/key-value-inputs-design-spec.md) |
| QueryDevtoolsComponent and conditional root provider               | [Query inspector](clr-lift/query-devtools-design-spec.md)               |

## Proposed or paused contracts

| Area                        | Canonical draft                                                          |
| --------------------------- | ------------------------------------------------------------------------ |
| Badges and labels           | [Badges and labels](clr-lift/badge-design-spec.md)                       |
| YAML viewer/editor (paused) | [YAML editor](clr-lift/yaml-editor-design-spec.md)                       |
| Temporal controls           | [Temporal controls](clr-lift/temporal-controls-design-spec.md)           |
| Cascader and tree-select    | [Hierarchical selection](clr-lift/hierarchical-selection-design-spec.md) |
| Drawer                      | [Drawer](clr-lift/drawer-design-spec.md)                                 |
| Upload files                | [Upload files](clr-lift/upload-design-spec.md)                           |

## Supporting research and demo notes

| Topic                                | Document                                                                      |
| ------------------------------------ | ----------------------------------------------------------------------------- |
| Shared form-control compatibility    | [Forms compatibility](clr-lift/forms-compatibility-design-spec.md)            |
| YAML editor dependency research      | [YAML editor research](clr-lift/yaml-editor-research.md)                      |
| toSignalForm submission options demo | [Submission options demo](ngx-lift/to-signal-form-submission-options-demo.md) |

## Review status and maintenance

The canonical datagrid contract is [datagrid selection](clr-lift/datagrid-selection-design-spec.md); its
[complete examples](clr-lift/datagrid-selection-code-examples.md),
[detailed reference](clr-lift/datagrid-selection-reference.md),
[delivery plan](clr-lift/datagrid-selection-delivery-plan.md), and
[acceptance record](clr-lift/datagrid-selection-acceptance.md) are supporting documents. The
[acceptance contract](../guides/accessibility-and-localization.md) owns gate status and [CHANGELOG](../../CHANGELOG.md)
owns release history; outstanding implementation work is tracked in GitHub issues.

Proposed controls are linked from the [component roadmap](../component-roadmap.md); they are not implemented APIs. Specs
use the shared template's required topics, retaining accurate legacy detail and explicitly marking inapplicable UI/forms
concerns. The documentation learning briefs distinguish delivered demos from proposed destinations. Simple pure
helpers/pipes stay in public JSDoc and focused tests unless their state, resource or compatibility contract warrants a
separate spec.

These documents define behavior, error handling, cancellation, lifetime and supported scope. Public signatures and
regression tests remain in the libraries. Keep release changes in [CHANGELOG](../../CHANGELOG.md), publishing procedures
in the [deployment guide](../deployment.md), and loading/localization/shared-service guidance in the
[integration guide](../guides/demo-and-library-integration.md).
