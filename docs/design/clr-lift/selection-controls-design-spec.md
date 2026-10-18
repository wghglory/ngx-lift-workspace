# Clarity selection and editable-input reuse

Status: **Reuse decision; new control proposals withdrawn**. Updated October 18, 2026. Owner: clr-lift maintainers. The
maintainer removed combobox and autocomplete from the new-component plan after reviewing current Clarity. This document
retains the existing link destination; it no longer proposes lift selection components or loader types.

## Decision and scope

Use `clr-combobox` for known-value selection and its editable mode for supported free-text/custom-item workflows. Do not
schedule lift combobox, multi-combobox or autocomplete exports. Prefer existing Clarity templates, forms and
localization, with application data coordination through existing ngx-lift query/resource APIs when needed.

Editable combobox and autocomplete are not universally equivalent. Clarity's editable single mode commits custom values
through its change path when no matching options remain; editable multiple mode creates a custom item on Enter with an
empty result set. An application needing every text edit committed as a string, a different blur/selection policy or
another unsupported interaction must demonstrate that gap before proposing a dedicated control. This is a reopening
criterion, not an autocomplete implementation commitment.

## Verified existing capabilities

The inspected `@clr/angular` release is 18.4.0, already installed in the workspace. Its combobox implementation matches
ng-clarity main at `11c39739984c3fc630ccabb796adb5cac111e69c`; these features do not require a platform upgrade:

- Single/multiple selection, removable selected pills, option groups, and custom option/selected-item templates.
- Identity mapping through `clrComboboxIdentityFn` for objects recreated by a data source.
- Editable values through `clrEditable`, plus `clrEditableResolverFn` to create a model object from typed text.
- Case/diacritic-insensitive local filtering, input/open events, loading/searching/empty states, and Clarity form
  errors.
- Select-all for currently visible loaded options and selected-pill overflow/expansion behavior.

Sources: [component API and handlers][component], [filtering][filter], [options/select-all][options], [editable resolver
example][resolver], and the [published Code & Examples page][docs]. Existing common strings are translated in the
library's Clarity integration; new application-owned messages still need all supported locales.

## Behavior and architecture

Clarity owns the rendered control, selection and overlay interactions. The form owns values and validation. The
application owns requests, query/context identity, debounce/cancellation policy, result limits, page cursors and retry.
An async example is not a component-owned request engine. Selection is not an excuse to introduce a second cache, retry
abstraction or another form owner.

For server-ranked results, render `clr-option` with public Angular iteration rather than assuming `clrOptionItems` can
disable its local substring filter. The upstream [identity test][tests] demonstrates that rendering composition.
Grouping and large-list keyboard behavior still need their own verification. Keep load-more actions outside listbox
options; visible select-all does not select every matching server record.

Native Clarity value semantics remain upstream behavior. In particular, the [multiple-selection model][multi] mutates
its array and uses null after last-item removal. Applications must model or map that value deliberately; the
[shared form contract](forms-compatibility-design-spec.md) for future lift controls does not silently change Clarity.

## Remaining gaps and verification items

| Area                             | Current evidence                                                                                                     | Disposition                                                                                                                       |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Virtualization and paging        | No built-in virtual viewport or bottom-reached output; keyboard navigation tracks rendered options                   | Verify an actual large-data flow; upstream work or a new renderer requires a prioritized blocked use case                         |
| Disabled options and readonly    | No first-class per-option disabled input or readonly selection contract in the inspected API                         | Prefer focused upstream enhancements when required; disabled and readonly are not interchangeable                                 |
| Search/filter/status convenience | Input/open/loading hooks exist; custom server filtering and error/retry/page policies remain application composition | Start with a recipe using existing query/resource tools; extract a helper only after demonstrated reuse                           |
| Limits and tokenization          | Editable values exist; hard selected-count limits and delimiter/paste parsing are not first-class APIs               | Require a concrete use case before expanding scope; pill overflow is not a selection limit                                        |
| IME, focus and accessibility     | Enter handlers need composition verification; selected-state semantics and composite focus need targeted assessment  | Validate real browser/assistive-technology journeys and report focused upstream defects; do not assume a replacement is necessary |

Evidence: [ClrOption inputs][option], [focus/keyboard implementation][focus], [component handlers][component], and
[filtering implementation][filter]. Competitor capabilities are useful comparisons rather than delivery requirements:
[NG-ZORRO Select][zorro] provides integrated virtualization/scroll-end/limits/tokenization; [MUI Autocomplete][mui] and
[React Aria ComboBox][reactaria] expose different composition and readonly APIs. Their request handling and
virtualization ownership differ; feature-table parity alone does not justify another control.

## Integration acceptance

When an actual application or demo integration is delivered, verify:

- ngModel, typed Reactive Forms and the existing toSignalForm facade without a second form owner.
- Prefill, object identity, clear/reset, disabled behavior, actual submitted values and any required readonly policy.
- Remote request cancellation, obsolete-result protection, errors/retry and bounded paging under the application's
  documented policy; no forced client filtering of server-ranked results.
- Keyboard/overlay focus, IME, narrow/light/dark rendering and runtime language changes. Follow the
  [accessibility and language acceptance contract](../../guides/accessibility-and-localization.md) for owned names,
  helper/error/loading text and announcements in every supported language.

This acceptance list is not a newly scheduled control or a claim of passing integration tests. Automated checks, manual
accessibility, independent human language acceptance and package publication remain separate gates.

## Reopening policy and delivery

A helper, wrapper or dedicated autocomplete requires a named consumer, a reproducible unmet use case, and evidence that
supported Clarity APIs or simple composition cannot meet it adequately. Review the smallest proposed solution before
implementation. Keep any shared mechanism private until independent consumers demonstrate the need.

The next planned new-control review is key/value input value/coexistence behavior, followed by the remaining
[component roadmap](../../component-roadmap.md). Angular 22 and the Nx major upgrade stay deferred; the forms contract
continues to apply to future value controls and its later native-field phase.

## Evidence

October 18 source and published-page inspection confirmed the released capabilities above. Chromium interaction
confirmed editable resolver item creation. A synthetic Enter marked isComposing still selected an option; this
identifies a focused validation concern, not a real OS IME acceptance result. No source implementation, new public
export, new rendered demo, complete Clarity accessibility assessment or installed form-host result is claimed here.

[component]:
  https://github.com/vmware-clarity/ng-clarity/blob/11c39739984c3fc630ccabb796adb5cac111e69c/projects/angular/forms/combobox/combobox.ts
[filter]:
  https://github.com/vmware-clarity/ng-clarity/blob/11c39739984c3fc630ccabb796adb5cac111e69c/projects/angular/forms/combobox/option-items.directive.ts
[options]:
  https://github.com/vmware-clarity/ng-clarity/blob/11c39739984c3fc630ccabb796adb5cac111e69c/projects/angular/forms/combobox/options.ts
[resolver]:
  https://github.com/vmware-clarity/ng-clarity/blob/11c39739984c3fc630ccabb796adb5cac111e69c/projects/website/src/app/documentation/demos/combobox/combobox-editable-multi.demo.ts
[docs]: https://clarity.design/documentation/combobox/code
[tests]:
  https://github.com/vmware-clarity/ng-clarity/blob/11c39739984c3fc630ccabb796adb5cac111e69c/projects/angular/forms/combobox/combobox.spec.ts
[multi]:
  https://github.com/vmware-clarity/ng-clarity/blob/11c39739984c3fc630ccabb796adb5cac111e69c/projects/angular/forms/combobox/model/multi-select-combobox.model.ts
[option]:
  https://github.com/vmware-clarity/ng-clarity/blob/11c39739984c3fc630ccabb796adb5cac111e69c/projects/angular/forms/combobox/option.ts
[focus]:
  https://github.com/vmware-clarity/ng-clarity/blob/11c39739984c3fc630ccabb796adb5cac111e69c/projects/angular/forms/combobox/providers/combobox-focus-handler.service.ts
[zorro]: https://ng.ant.design/components/select/en
[mui]: https://mui.com/material-ui/react-autocomplete/
[reactaria]: https://react-aria.adobe.com/ComboBox
