# Design and implementation gaps

This is the active fix register for design contracts. Update an entry when its implementation and acceptance evidence
change. Reviewed against base `e4a43f9` on October 16, 2026; source/test inspection is not a fresh test execution. The
[delivery roadmap](../priority-roadmap.md) owns scheduling; package specs own API behavior.

## Implementation fixes to prioritize

| ID / priority | Source evidence and failure path                                                                                                                                                                                                                                                                                                     | Required change                                                                                                                                                           | Acceptance before closing                                                                                                                 |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| F1 / High     | [AlertService.alerts](../../libs/clr-lift/src/lib/components/alerts/alert.service.ts) applies bypassSecurityTrustHtml to every string, then the [container](../../libs/clr-lift/src/lib/components/alerts/alert-container.component.html) binds innerHTML. External error/message strings can cross Angular's sanitization boundary. | Remove automatic string trust bypass; preserve Angular sanitization and deliberate caller-supplied SafeHtml. Document any HTML compatibility impact.                      | Render an injected event-handler payload and verify no execution; retain safe markup, explicit trusted content and keyboard action tests. |
| F2 / Medium   | [FileReaderComponent](../../libs/clr-lift/src/lib/components/file-reader/file-reader.component.ts) setDisabledState changes only isDisabled. Active reader.onload checks reader identity, then calls onChange/fileChange even after disable.                                                                                         | Define disable as invalidating/aborting pending read; cover both Angular disabled state and disabled input. Preserve owner reset and previous value semantics explicitly. | Start a controlled read, disable before completion, release old callback: no owner/output change. Reenable and select again successfully. |
| F3 / Medium   | [ToastComponent.mouseOver/focus](../../libs/clr-lift/src/lib/components/toast/toast.component.ts) assign the same disableAutoClose flag. Pointer leave can clear it while keyboard focus remains, or blur while hovered.                                                                                                             | Track hover and focus independently; pause auto-close while either is active. Keep timeout/restart policy explicit.                                                       | Both mixed interaction orders, leave one modality, advance expiry: toast stays until both protections end; teardown cancels timer.        |
| F4 / Medium   | [Pagination expand/reduce](../../libs/ngx-lift/src/lib/operators/kubernetes-pagination.operator.ts) follows every nonempty continue token and retains all items without a loop/page/item guard. A faulty endpoint can repeat forever; page limit does not bound aggregate memory.                                                    | Reject repeated/nonprogressing tokens; review configurable total page/item bounds and a clear terminal error. Keep large UI lists on server paging.                       | Repeated token, cycle, configured page/item boundary, cancellation, per-page retry and unchanged valid-list ordering/metadata.            |

F1 should be fixed first. F2/F3 are user-visible lifecycle/accessibility failures. F4 is robustness work for endpoints
that do not guarantee finite, progressing pagination. These are implementation recommendations; this PR changes docs and
guidance only. No runtime fix, exploit execution or new regression pass is claimed.

## Existing specifications checked against implementation

| Specification                                                  | Observed implementation                                                                                          | Gap or correction and disposition                                                                                                                                                         |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Query/cache](ngx-lift/query-resource-design-spec.md)          | QueryClient and signal/Observable resources are implemented, including scoped clients and injector disposal.     | Corrected mandatory component placement, unmeasured 80/20 advice, synchronous-refetch wording and the rxMethod package. Added goals, acceptance, lifecycle scope and evidence boundaries. |
| [resourceAsync](ngx-lift/resource-async-design-spec.md)        | Local streaming resource with switch/exhaust, fallback values and cancellation.                                  | Corrected exhaust/hasValue/fallback wording; removed unsafe manual subscription-cache recommendation. Fixed lazy child typing/start/parent cleanup guidance.                              |
| [mutateResource](ngx-lift/mutate-resource-design-spec.md)      | Latest accepted invocation owns publication; server success survives invalidation faults.                        | Added missing invalidationError, client/static tags, exact status type, concrete write examples and ordering semantics. No runtime mismatch found in these inspected contracts.           |
| [computedAsync](ngx-lift/computed-async-design-spec.md)        | Read-time errors, typed fallback, requireSync and four flattening modes exist.                                   | Added missing goals, use cases, comparisons, form applicability and validation metadata. Breaking release decision remains open, not a new API requirement.                               |
| [Kubernetes retry](ngx-lift/k8s-retry-options.md)              | Method allowlist, minimum hints, budgets and deferred interceptor calls exist.                                   | Expanded options note into a design contract with source/test pointers and cancellation/retry ownership. Write safety still requires endpoint evidence.                                   |
| [Shared forms](clr-lift/forms-compatibility-design-spec.md)    | CVA is available; toSignalForm wraps FormGroup. No common new-control/native bridge exists.                      | Replaced migration-first/native-immediate policy with Angular 21 delivery and mandatory native fields after upgrade. Component API approval remains pending.                              |
| [Selection](clr-lift/selection-controls-design-spec.md)        | No proposed lift selectors/types are exported. Existing Clarity primitives are the starting point.               | Marked all feature use cases planned; wrapper spike, paging/caps and native-field follow-up remain open. No feature implementation to certify.                                            |
| [Key/value](clr-lift/key-value-inputs-design-spec.md)          | Required caller FormArray, singular uniqueKey, required key/value rows, initial data append and smartMode exist. | Documented current behavior separately from proposed immutable array/CVA API. Preserve current consumers; choose additive selector or explicit breaking migration before coding.          |
| [YAML](clr-lift/yaml-editor-design-spec.md)                    | No lift viewer/editor/parser exports. Research is dependency evidence only.                                      | Split base text acceptance from future engine/validation/sync gates; native fields follow upgrade. Keep useful engine/CSP research.                                                       |
| [Temporal controls](clr-lift/temporal-controls-design-spec.md) | No proposed picker/range/calendar exports.                                                                       | Parser, DST conversion and value/validation decisions remain pending; added explicit Angular 21 and later native-field gates.                                                             |
| [Object paths](clr-lift/object-path-breadcrumb-design-spec.md) | No proposed breadcrumb export.                                                                                   | Added width-observer/SSR/focus cleanup ownership and goal mapping; Clarity gap/spike is still unverified.                                                                                 |
| [Hierarchy](clr-lift/hierarchical-selection-design-spec.md)    | No proposed cascader/tree-select exports.                                                                        | Added request/context/bounds ownership; named consumer, child paging/search and renderer decisions remain pending.                                                                        |
| [Drawer](clr-lift/drawer-design-spec.md)                       | No drawer export.                                                                                                | Added guard-error recovery, overlay lifetime/SSR boundary and embedded-form phase distinction. Projection is not native-field support.                                                    |
| [Badges](clr-lift/badge-design-spec.md)                        | Clarity composition exists; no cll-badge wrapper.                                                                | Retained reuse recommendation; added state/accessibility/compatibility boundaries. Wrapper requires a demonstrated remaining gap.                                                         |

## Previously missing complex contracts

The [specification index](README.md) now includes Reactive Forms facade/bindings/submission, idle service, polling and
pagination, tooltip/popover, file reader, certificate parsing/status/validator, idle warning, notifications, timeline
wizard, and runtime language/theme services. Each names source, ownership, current behavior, acceptance pointers and
limitations. The file-reader/notifications/pagination contracts retain F1–F4 as open implementation work.

Keep simple pure helpers, pipes and display shells documented through exported JSDoc, package usage and focused tests
unless they acquire substantial state, asynchronous work, external resources or nontrivial compatibility policy. PRs
#137–#141 remain separate unmerged feature work; their proposed APIs are not part of this main-branch audit.

## Additional test and documentation gaps

- The exported
  [certificateValidator](../../libs/clr-lift/src/lib/components/certificate-signpost/certificate.validator.ts) has no
  direct library test. Add empty/raw/encoded/malformed cases and prove its parse-only semantics.
- Poll tests cover triggers/error recovery but lack explicit shared-subscriber and last-unsubscribe cancellation
  assertions. Add these before changing its share/exhaust lifecycle.
- Corrected idle configuration JSDoc to require explicit resetTimer(true) during a warning; ordinary interaction
  preserves the countdown. This aligns the source documentation with the existing implementation.

## Delivery gates still open

1. Review each proposed component API before implementation; the Angular 21-first policy does not approve selectors.
2. Demonstrate ngModel, typed Reactive Forms and the existing toSignalForm facade for each new value control. Preserve
   the current key/value FormArray API until its explicit migration/coexistence plan is implemented.
3. After the deferred Angular/Nx upgrade, require native field value/reset/availability/touch/validation/pending and
   async-work acceptance across every new value control. Review file-reader and wizard integration in the same sweep.
4. Extend installed consumers when public form/proxy/overlay contracts change. The existing verifier exercises query
   lifecycles and selected imports; it does not prove every form-control integration or SSR/hydration.
5. Keep manual accessibility, native-speaker language acceptance, CI, merge and publication as separate evidence gates.
