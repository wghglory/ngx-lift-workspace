# Design and implementation gaps

This is the active fix register for design contracts. Update an entry when its implementation and acceptance evidence
change. The original audit used base `e4a43f9` on October 16, 2026; follow-up implementation and validation evidence is
linked below. The [delivery roadmap](../priority-roadmap.md) owns scheduling; package specs own API behavior.
Implementation, merge and publication remain separate gates.

## Implementation fixes to prioritize

| ID / priority           | Source evidence and failure path                                                                                                                                                                                                   | Required change                                                                                                                                                                                                           | Acceptance before closing                                                                                                                                                                   |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F1 / Contract clarified | [AlertService](../../libs/clr-lift/src/lib/components/alerts/alert.service.ts) intentionally trusts developer-authored localized HTML and delegates scoped clicks. The maintainer requires inline buttons/links without templates. | Preserve string/SafeHtml plus targetSelector/onTargetClick. Document developer-owned markup and text-escaping of user/server interpolation. Inspect unsafe callers individually; no blanket sanitizer/template migration. | Existing inline-button and nested/scoped-click tests stay valid. Localized markup examples preserve placement and escaped runtime text; no promise of automatic hostile-HTML sanitization.  |
| F2 / Implemented        | [FileReaderComponent](../../libs/clr-lift/src/lib/components/file-reader/file-reader.component.ts) cancels pending reads on CVA/input disabling and rejects obsolete callbacks.                                                    | Preserve committed content and form interaction state; reenabling requires a fresh selection.                                                                                                                             | [#156](https://github.com/wghglory/ngx-lift-workspace/pull/156): CVA/input races, stale callbacks, recovery and rendered FormControl.disable regressions.                                   |
| F3 / Implemented        | [ToastComponent](../../libs/clr-lift/src/lib/components/toast/toast.component.ts) tracks hover/focus independently; its container confines animation and stack scrolling to the viewport.                                          | Keep full-interval timeout retries and keyboard access without changing page/body overflow.                                                                                                                               | [#155](https://github.com/wghglory/ngx-lift-workspace/pull/155): mixed interactions, timer teardown, sampled animation dimensions and narrow/long-stack browser checks.                     |
| F4 / Implemented        | [Pagination](../../libs/ngx-lift/src/lib/operators/kubernetes-pagination.operator.ts) rejects repeated/cyclic continuation tokens with per-subscription history.                                                                   | Configurable page/item caps were declined; use server paging for large UI lists.                                                                                                                                          | [#159](https://github.com/wghglory/ngx-lift-workspace/pull/159): repeated/cyclic tokens, initial cursor reuse, subscription/retry isolation, cancellation and valid-list ordering/metadata. |

F1 is a clarified trust contract, not a blanket library defect; the notification spec now records it. Developer-authored
markup must avoid script tags, executable event attributes and javascript: URLs. Untrusted interpolated values need text
escaping at the caller boundary. F2/F3 fixes and their regressions are delivered in #156/#155; F4 cursor-loop protection
and its regressions are delivered in #159. The linked PRs record exact-head review, CI and merge evidence; no npm
publication is implied.

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
limitations. F1 records the approved alert trust boundary; the focused F2–F4 implementations and evidence are linked
above. Broader form and native-field acceptance remains open below.

Keep simple pure helpers, pipes and display shells documented through exported JSDoc, package usage and focused tests
unless they acquire substantial state, asynchronous work, external resources or nontrivial compatibility policy. PRs
#137–#141 remain separate unmerged feature work; their proposed APIs are not part of this main-branch audit.

## Additional test and documentation gaps

- The exported
  [certificateValidator](../../libs/clr-lift/src/lib/components/certificate-signpost/certificate.validator.ts) has
  direct empty/raw/encoded/malformed and parse-only regressions in
  [#157](https://github.com/wghglory/ngx-lift-workspace/pull/157), alongside real parser and fixed DER digest tests. Its
  merge and CI evidence remain in that PR.
- [#158](https://github.com/wghglory/ngx-lift-workspace/pull/158) adds explicit shared-subscriber, final-unsubscribe
  request/timer/manual-trigger cleanup and fresh-resubscription assertions without changing poll production behavior.
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
