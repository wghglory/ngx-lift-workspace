# Documentation refinement roadmap

Status: proposed follow-up sequence, October 17, 2026. This is a delivery inventory, not a claim of site-wide adoption.

## Current scope and gap

PR #161 delivered the query learning path and documentation standards. PR #162 applies the entry-flow work to six more
feature templates: `resourceAsync`, `computedAsync`, `toSignalForm`, `dgState`, the timeline wizard and key/value
inputs. Its theme and retry changes only reposition introductory prose; their complete learning paths remain pending.

The inventory below includes **55 feature-entry templates**, plus **two library homepages**. The query-guide template
serves seven routes, so template counts are not route counts. Query work covers four of these templates; #162's focused
entry-flow work covers six more. The other 45 templates still require individual editorial review, including existing
playgrounds and pages receiving only introductory changes. Some already lead with a useful preview; that does not prove
that their explanation, setup, examples and reference are complete.

The inventory was collected from feature templates containing `cll-page-container`, with both library homepages checked
separately. Code-block/playground counts were used to find candidates, not to assign automatic quality scores. Source
inspection confirmed specific obstacles: `poll` places five code blocks before its first Start button; `toast` places
three setup/action blocks before its controls; `injectParams` presents six examples without a guided route interaction.
Conversely, `spinner` already shows live output before each snippet and needs a smaller review, not a structural
rewrite.

## Proposed PR sequence

Finish and validate #162 first. Then deliver these in order, with an independently useful outcome per PR. The larger
review groups explicitly split into small PRs; do not batch the whole catalog into one rewrite.

| Batch | Scope                                                                            | Reader outcome                                                                                                                                                      |
| ----- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | `ngx-lift` and `clr-lift` homepages / getting started                            | Install, configure required providers/styles, and follow a working example before historical compatibility tables. Link directly to task-oriented learning paths.   |
| 2     | `combineFrom`, `mergeFrom`, `createTrigger`, `injectParams`, `injectQueryParams` | Change a signal or URL and understand the resulting value before concurrency, injection-context or transformation details.                                          |
| 3     | `createAsyncState`, `poll`, `switchMapWithAsyncState`, `combineLatestEager`      | Understand one async read, pending/error recovery, cancellation and polling ownership through small examples.                                                       |
| 4     | Toasts, multiple alerts, status indicator, tooltip                               | Trigger the visible behavior, see the required setup, then learn lifetime, accessibility and advanced options.                                                      |
| 5a    | File reader, conditional validation, uniqueness                                  | Use a caller-owned form; see invalid input, error display, correction and clearing.                                                                                 |
| 5b    | Date range, intersection and URL validators                                      | Understand each rule through valid/invalid input before advanced options and reference.                                                                             |
| 6a    | Kubernetes pagination and both retry pages                                       | Follow one request scenario before advanced pagination/retry policies; retain endpoint safety and cancellation contracts.                                           |
| 6b    | `distinctOnChange`, `logger`, `startWithTap`                                     | Understand emission/side-effect behavior through precise input/output traces.                                                                                       |
| 7     | Existing Clarity playgrounds, certificate, idle controls, theme and layout       | Audit first-use setup and progressive examples. Split remaining changes into feedback/layout and certificate/lifecycle PRs of at most four pages each.              |
| 8     | Five pipe pages and datagrid conversion utility                                  | Keep reference-sized pages concise: import, example input/output, use case, then options. Split into pipe and request-conversion PRs if needed.                     |
| 9     | Seven utility pages                                                              | Audit behavior and naming; use short examples for pure helpers and a dedicated lifecycle explanation for idle detection. Split into small helper and lifecycle PRs. |

Batch numbers are proposed delivery order, not reserved GitHub PR numbers or promises that these changes are already
implemented. The next implementation PR should be Batch 1, followed by Batch 2. If a batch uncovers a runtime defect,
record it and separate the behavior fix from editorial changes.

## Shared acceptance criteria

- Begin with what the API helps the reader do and the problem it removes. State prerequisites and required setup.
- A tutorial's first meaningful action comes before advanced architecture, comparisons and state matrices.
- Keep visible example behavior and displayed source consistent. TypeScript contains logic/setup; HTML contains the
  template when both tabs exist. Code is shown initially, and the caret reflects actual visibility.
- Clearly label focused excerpts. A starter must include required imports and setup, or link directly to them.
- Add a mental model only where it explains otherwise surprising behavior. Pure pipes/helpers do not need a five-stage
  tutorial or an artificial interactive playground.
- Keep API reference reachable with stable routes/anchors. Naming and domain organization belong in a focused guide.
- Preserve useful safety, accessibility and lifecycle notes beside the relevant operation.
- Validate affected examples, translations, narrow layouts, keyboard interaction and important failure/recovery paths.
  Run relevant unit/coverage, tooling, type/lint and build gates; use browser checks for changed interactions.
- Track implementation, automated verification, newcomer comprehension, native-language review and remote CI separately.
  A reordered page or passing screenshot does not establish that a first-time reader can follow it.

## Page inventory

Source links identify the exact template to review. “Entry flow implemented” describes the current scope of #162;
“pending review” does not imply every existing example is wrong.

| Page / template                                                                                                                                             | Current scope                         | Batch | Next action                                                                                               |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- | ----- | --------------------------------------------------------------------------------------------------------- |
| [alert-demo](../apps/demo/src/app/clr-lib/pages/alert-demo/alert-demo.component.html)                                                                       | Pending review/refinement             | 7     | Audit existing examples for first-use setup and error recovery.                                           |
| [callout-demo](../apps/demo/src/app/clr-lib/pages/callout-demo/callout-demo.component.html)                                                                 | Pending review/refinement             | 7     | Audit concise usage and when a documentation callout is appropriate.                                      |
| [certificate-demo](../apps/demo/src/app/clr-lib/pages/certificate-demo/certificate-demo.component.html)                                                     | Pending review/refinement             | 7     | Put the certificate interaction ahead of long PEM setup; preserve deferred parsing.                       |
| [clr-datagrid-util](../apps/demo/src/app/clr-lib/pages/clr-datagrid-util/clr-datagrid-util.component.html)                                                  | Pending review/refinement             | 8     | Lead with one input state and its exact converted request parameters.                                     |
| [dg-state](../apps/demo/src/app/clr-lib/pages/dg-state/dg-state.component.html)                                                                             | Entry flow implemented in #162        | —     | Verify after merge; this is not a claim that every advanced example has been rewritten.                   |
| [file-reader-demo](../apps/demo/src/app/clr-lib/pages/file-reader-demo/file-reader-demo.component.html)                                                     | Pending review/refinement             | 5a    | Verify upload, validation failure, clearing and form value ownership.                                     |
| [idle-detection-demo](../apps/demo/src/app/clr-lib/pages/idle-detection-demo/idle-detection-demo.component.html)                                            | Pending review/refinement             | 7     | Explain activity, warning and expiry before advanced timing options.                                      |
| [key-value-inputs-demo](../apps/demo/src/app/clr-lib/pages/key-value-inputs-demo/key-value-inputs-demo.component.html)                                      | Entry flow implemented in #162        | —     | Verify after merge; this is not a claim that every advanced example has been rewritten.                   |
| [multi-alerts-demo](../apps/demo/src/app/clr-lib/pages/multi-alerts-demo/multi-alerts-demo.component.html)                                                  | Pending review/refinement             | 4     | Present add/dismiss actions before service setup details.                                                 |
| [page-container-demo](../apps/demo/src/app/clr-lib/pages/page-container-demo/page-container-demo.component.html)                                            | Pending review/refinement             | 7     | Audit existing playgrounds and required layout setup.                                                     |
| [spinner-demo](../apps/demo/src/app/clr-lib/pages/spinner-demo/spinner-demo.component.html)                                                                 | Pending review/refinement             | 7     | Preserve existing preview-first examples; review accessible labeling and loading context.                 |
| [status-indicator-demo](../apps/demo/src/app/clr-lib/pages/status-indicator-demo/status-indicator-demo.component.html)                                      | Pending review/refinement             | 4     | Show actual state changes, then their mappings and configuration.                                         |
| [theme-toggle-demo](../apps/demo/src/app/clr-lib/pages/theme-toggle-demo/theme-toggle-demo.component.html)                                                  | Introductory placement only in #162   | 7     | Introductory prose changed in #162; audit setup, persistence and events next.                             |
| [timeline-wizard-demo](../apps/demo/src/app/clr-lib/pages/timeline-wizard-demo/timeline-wizard-demo.component.html)                                         | Entry flow implemented in #162        | —     | Verify after merge; this is not a claim that every advanced example has been rewritten.                   |
| [toast-demo](../apps/demo/src/app/clr-lib/pages/toast-demo/toast-demo.component.html)                                                                       | Pending review/refinement             | 4     | Put the first toast action and required container setup together.                                         |
| [tooltip-demo](../apps/demo/src/app/clr-lib/pages/tooltip-demo/tooltip-demo.component.html)                                                                 | Pending review/refinement             | 4     | Show hover and keyboard focus before placement/options.                                                   |
| [k8s-retry-backoff-interceptor](../apps/demo/src/app/ngx-lib/pages/interceptors/k8s-retry-backoff-interceptor/k8s-retry-backoff-interceptor.component.html) | Introductory placement only in #162   | 6a    | Separate global setup from request overrides and retry simulation.                                        |
| [combine-latest-eager](../apps/demo/src/app/ngx-lib/pages/operators/combine-latest-eager/combine-latest-eager.component.html)                               | Pending review/refinement             | 3     | Show when each input subscribes and when combined output appears.                                         |
| [create-async-state](../apps/demo/src/app/ngx-lib/pages/operators/create-async-state/create-async-state.component.html)                                     | Pending review/refinement             | 3     | Lead with pending, success, failure and retry in one small stream.                                        |
| [distinct-on-change](../apps/demo/src/app/ngx-lib/pages/operators/distinct-on-change/distinct-on-change.component.html)                                     | Pending review/refinement             | 6b    | Use input/output traces to explain meaningful changes.                                                    |
| [k8s-retry-backoff](../apps/demo/src/app/ngx-lib/pages/operators/k8s-retry-backoff/k8s-retry-backoff.component.html)                                        | Introductory placement only in #162   | 6a    | Keep method-safety guidance; simplify the first retry scenario.                                           |
| [kubernetes-pagination](../apps/demo/src/app/ngx-lib/pages/operators/kubernetes-pagination/kubernetes-pagination.component.html)                            | Pending review/refinement             | 6a    | Separate a first paginated read from continuation/cycle contracts.                                        |
| [logger](../apps/demo/src/app/ngx-lib/pages/operators/logger/logger.component.html)                                                                         | Pending review/refinement             | 6b    | Show labeled stream output and safe diagnostic usage.                                                     |
| [poll](../apps/demo/src/app/ngx-lib/pages/operators/poll/poll.component.html)                                                                               | Pending review/refinement             | 3     | Move an owned start/stop/refresh example before advanced polling recipes.                                 |
| [start-with-tap](../apps/demo/src/app/ngx-lib/pages/operators/start-with-tap/start-with-tap.component.html)                                                 | Pending review/refinement             | 6b    | Show subscription-time side effects before variations.                                                    |
| [switch-map-with-async-state](../apps/demo/src/app/ngx-lib/pages/operators/switch-map-with-async-state/switch-map-with-async-state.component.html)          | Pending review/refinement             | 3     | Demonstrate replacement/cancellation before operator reference.                                           |
| [array-join-pipe](../apps/demo/src/app/ngx-lib/pages/pipes/array-join-pipe/array-join-pipe.component.html)                                                  | Pending concise-reference review      | 8     | Show input → output, required import and one use case before options; add interaction only when it helps. |
| [byte-converter-pipe](../apps/demo/src/app/ngx-lib/pages/pipes/byte-converter-pipe/byte-converter-pipe.component.html)                                      | Pending concise-reference review      | 8     | Show input → output, required import and one use case before options; add interaction only when it helps. |
| [is-https-pipe](../apps/demo/src/app/ngx-lib/pages/pipes/is-https-pipe/is-https-pipe.component.html)                                                        | Pending concise-reference review      | 8     | Show input → output, required import and one use case before options; add interaction only when it helps. |
| [mask-pipe](../apps/demo/src/app/ngx-lib/pages/pipes/mask-pipe/mask-pipe.component.html)                                                                    | Pending concise-reference review      | 8     | Show input → output, required import and one use case before options; add interaction only when it helps. |
| [range-pipe](../apps/demo/src/app/ngx-lib/pages/pipes/range-pipe/range-pipe.component.html)                                                                 | Pending concise-reference review      | 8     | Show input → output, required import and one use case before options; add interaction only when it helps. |
| [mutate-resource](../apps/demo/src/app/ngx-lib/pages/query/mutate-resource/mutate-resource.component.html)                                                  | Query learning path delivered in #161 | —     | Preserve; human comprehension and translation acceptance remain separate.                                 |
| [query-guides](../apps/demo/src/app/ngx-lib/pages/query/query-guides/query-guides.component.html)                                                           | Query learning path delivered in #161 | —     | Preserve; human comprehension and translation acceptance remain separate.                                 |
| [query-resource](../apps/demo/src/app/ngx-lib/pages/query/query-resource/query-resource.component.html)                                                     | Query learning path delivered in #161 | —     | Preserve; human comprehension and translation acceptance remain separate.                                 |
| [query-resources](../apps/demo/src/app/ngx-lib/pages/query/query-resources/query-resources.component.html)                                                  | Query learning path delivered in #161 | —     | Preserve; human comprehension and translation acceptance remain separate.                                 |
| [combine-from](../apps/demo/src/app/ngx-lib/pages/signals/combine-from/combine-from.component.html)                                                         | Pending review/refinement             | 2     | Add a small signal-composition interaction before async recipes.                                          |
| [computed-async](../apps/demo/src/app/ngx-lib/pages/signals/computed-async/computed-async.component.html)                                                   | Entry flow implemented in #162        | —     | Verify after merge; this is not a claim that every advanced example has been rewritten.                   |
| [create-trigger](../apps/demo/src/app/ngx-lib/pages/signals/create-trigger/create-trigger.component.html)                                                   | Pending review/refinement             | 2     | Verify the first trigger/reload interaction and show matching source.                                     |
| [inject-params](../apps/demo/src/app/ngx-lib/pages/signals/inject-params/inject-params.component.html)                                                      | Pending review/refinement             | 2     | Guide route changes and display transformed parameter values.                                             |
| [inject-query-params](../apps/demo/src/app/ngx-lib/pages/signals/inject-query-params/inject-query-params.component.html)                                    | Pending review/refinement             | 2     | Guide URL query changes and explain missing/default values.                                               |
| [merge-from](../apps/demo/src/app/ngx-lib/pages/signals/merge-from/merge-from.component.html)                                                               | Pending review/refinement             | 2     | Explain merge versus combination with changing inputs and visible output.                                 |
| [resource-async](../apps/demo/src/app/ngx-lib/pages/signals/resource-async/resource-async.component.html)                                                   | Entry flow implemented in #162        | —     | Verify after merge; this is not a claim that every advanced example has been rewritten.                   |
| [to-signal-form](../apps/demo/src/app/ngx-lib/pages/signals/to-signal-form/to-signal-form.component.html)                                                   | Entry flow implemented in #162        | —     | Verify after merge; this is not a claim that every advanced example has been rewritten.                   |
| [difference-in-days](../apps/demo/src/app/ngx-lib/pages/utilities/difference-in-days/difference-in-days.component.html)                                     | Pending utility-specific review       | 9     | Verify examples, edge cases and when to use the helper; keep simple functions short.                      |
| [idle-detection-demo](../apps/demo/src/app/ngx-lib/pages/utilities/idle-detection-demo/idle-detection-demo.component.html)                                  | Pending review/refinement             | 7     | Explain activity, warning and expiry before advanced timing options.                                      |
| [is-empty](../apps/demo/src/app/ngx-lib/pages/utilities/is-empty/is-empty.component.html)                                                                   | Pending utility-specific review       | 9     | Verify examples, edge cases and when to use the helper; keep simple functions short.                      |
| [is-equal](../apps/demo/src/app/ngx-lib/pages/utilities/is-equal/is-equal.component.html)                                                                   | Pending utility-specific review       | 9     | Verify examples, edge cases and when to use the helper; keep simple functions short.                      |
| [is-promise](../apps/demo/src/app/ngx-lib/pages/utilities/is-promise/is-promise.component.html)                                                             | Pending utility-specific review       | 9     | Verify examples, edge cases and when to use the helper; keep simple functions short.                      |
| [pick-by](../apps/demo/src/app/ngx-lib/pages/utilities/pick-by/pick-by.component.html)                                                                      | Pending utility-specific review       | 9     | Verify examples, edge cases and when to use the helper; keep simple functions short.                      |
| [url](../apps/demo/src/app/ngx-lib/pages/utilities/url/url.component.html)                                                                                  | Pending utility-specific review       | 9     | Verify examples, edge cases and when to use the helper; keep simple functions short.                      |
| [date-range-validator](../apps/demo/src/app/ngx-lib/pages/validators/date-range-validator/date-range-validator.component.html)                              | Pending review/refinement             | 5b    | Put valid/invalid date interaction before date-format variants.                                           |
| [if-validator](../apps/demo/src/app/ngx-lib/pages/validators/if-validator/if-validator.component.html)                                                      | Pending review/refinement             | 5a    | Show the condition enabling/disabling validation and recovery.                                            |
| [intersection-validator](../apps/demo/src/app/ngx-lib/pages/validators/intersection-validator/intersection-validator.component.html)                        | Pending review/refinement             | 5b    | Make the cross-field rule and correction visible before reference.                                        |
| [unique-validator](../apps/demo/src/app/ngx-lib/pages/validators/unique-validator/unique-validator.component.html)                                          | Pending review/refinement             | 5a    | Show duplicate input, caller-owned form errors and correction.                                            |
| [url-validator](../apps/demo/src/app/ngx-lib/pages/validators/url-validator/url-validator.component.html)                                                   | Pending review/refinement             | 5b    | Show valid/invalid input and supported URL rules.                                                         |

The two additional onboarding entries are
[ngx-lift home](../apps/demo/src/app/ngx-lib/pages/ngx-lift-home/ngx-lift-home.component.html) and
[clr-lift home](../apps/demo/src/app/clr-lib/pages/clr-lift-home/clr-lift-home.component.html), both in Batch 1.

## Related delivery records

- [Query learning path](query-documentation-plan.md)
- [Signal and Clarity follow-up](documentation-learning-paths-plan.md)
- [Documentation standards](DOCUMENTATION_STANDARDS.md)
