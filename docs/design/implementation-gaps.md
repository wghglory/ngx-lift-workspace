# Active design and implementation gaps

This register owns current design-contract gaps and delivery gates. The [delivery roadmap](../priority-roadmap.md) owns
scheduling; package specifications own API behavior. Implementation, merge, publication and human acceptance remain
separate gates.

## Alert trust contract

[AlertService](../../libs/clr-lift/src/lib/components/alerts/alert.service.ts) intentionally trusts developer-authored
localized HTML and delegates scoped clicks. Preserve string/SafeHtml plus `targetSelector` / `onTargetClick`, and keep
inline buttons/links without templates. Document developer-owned markup and text escaping of untrusted interpolated
values; inspect unsafe callers individually. Existing inline-button, nested and scoped-click tests remain the acceptance
boundary. No blanket sanitizer or template migration is approved.

PRs #137–#141 and #134 remain open for independent review; see the [gap register](../gap-register.md).

## Delivery gates still open

1. Review each proposed component API before implementation; the Angular 21-first policy does not approve selectors.
2. Demonstrate ngModel, typed Reactive Forms and the existing `toSignalForm(FormGroup)` facade for each new value
   control. Preserve the current key/value FormArray API until an explicit migration/coexistence plan is implemented.
3. After the deferred Angular/Nx upgrade, require native field value/reset/availability/touch/validation/pending and
   async-work acceptance across every new value control. Review file-reader and wizard integration in the same sweep.
4. Extend installed consumers when public form/proxy/overlay contracts change. The existing verifier exercises query
   lifecycles and selected imports; it does not prove every form-control integration or SSR/hydration.
5. Keep automated checks, independent human language acceptance, manual assistive-technology decisions, CI, merge and
   publication as separate evidence gates. See the [acceptance contract](../guides/accessibility-and-localization.md).

Keep simple pure helpers, pipes and display shells documented through exported JSDoc, package usage and focused tests
unless they acquire substantial state, asynchronous work, external resources or nontrivial compatibility policy.

## Architecture deepening backlog

These are friction statements for future work, not approved interface changes. D2 is the highest-leverage starting
point. Each item needs its own spec and maintainer review before implementation.

| ID  | Friction                                                                                                                                 | Deepening direction                                                                                                                                                              |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | Shallow pure-helper cluster in `libs/ngx-lift/src/lib/utils`: one-line wrappers each own a barrel export and a standalone spec.          | Collapse the negation into `pickBy`, keep the public export surface narrow, and retain JSDoc plus focused tests for simple helpers.                                              |
| D2  | Localization registration leaks across 11 demo dictionaries, an aggregator, a lazy loader and library modules with divergent keys.       | Introduce one registration adapter with one key convention; collapse the aggregator and loader into that interface. Verify with `pnpm run i18n:check` and complete dictionaries. |
| D3  | `buildObjectPathBreadcrumbs` exposes a thick interface while URL encoding, navigation-root prefixing and error recovery live in callers. | Fold caller string logic into the module and own the error contract at the deepened interface; keep the breadcrumb browser and library specs.                                    |
| D4  | Datagrid selection adapter rewrites NgControl ownership across three modules, and `selection-id.service.ts` is shallow.                  | Deepen into one value-control module only after an explicit decision to reopen ADR-0002.                                                                                         |
| D5  | Packaged-consumer fixtures duplicate demo page setup, so object-path option changes must be made twice.                                  | Extract a shared consumer harness reused by the demo and packaged verification.                                                                                                  |
