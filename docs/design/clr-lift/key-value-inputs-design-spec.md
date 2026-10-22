# Key/value inputs

Owner: clr-lift maintainers. Package: clr-lift. Updated October 22, 2026.

Status: **October 22 expansion locally verified; publication and independent human acceptance pending**. The maintainer
requested the additive array-value control and Angular 21 delivery together with demos, accessibility, localization,
browser tests and installed-consumer checks. This scope preserves the existing caller-owned FormArray API. Native Signal
Forms remains deferred under the [forms contract](forms-compatibility-design-spec.md).

## Applicable contracts

Forms, ordered row identity, validation, composite focus and localization apply. No async lookup, cache or new runtime
dependency is needed. Angular owns commit timing, reset, form status, async validation and submission.

## Background

`KeyValueInputsComponent` (`cll-key-value-inputs`) requires `FormArray<KeyValueFormGroup>` and modifies that array. It
remains available with its existing initialization, singular `uniqueKey`, patterns, smart mode and outputs.
`KeyValueControlComponent` (`cll-key-value-control`) is an additive CVA for one ordered array value. Use the existing
editor when the application needs individual row controls, row async validators or existing add/remove outputs. Use the
new control when the application wants a normal FormControl or ngModel value. No selector overload or automatic
migration changes submission behavior.

## Goals

- G1: Edit ordered metadata with stable row identity, accessible errors and predictable add/delete focus.
- G2: Bind one array through Angular 21 ngModel, typed Reactive Forms and Reactive Forms + `toSignalForm`.
- G3: Preserve current FormArray consumers and document an explicit opt-in migration.

## Non-Goals

### Not now

Native Signal Forms, arbitrary nested objects, drag sorting, secret storage and remote option fetching.

### Outside this API

Persistence, trimming, case folding and conversion to maps. Duplicate rows must remain visible until corrected.

## Use cases and acceptance

| ID  | Task                        | Acceptance                                                                                                                         |
| --- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| K1  | Add, edit and delete labels | Fresh arrays; stable IDs during edits; added key receives focus; delete focuses the next/previous key or Add                       |
| K2  | Correct invalid rows        | Required key/value and exact case-sensitive duplicate errors include row indexes; correction preserves caller errors               |
| K3  | Prefill and reset           | Owner writes never echo; nullable reset displays no rows without rewriting null; non-null reset restores the owner default         |
| K4  | Use three form integrations | Same submitted array; real change/blur/submit pipelines, composite touch and explicit disabled payload policy                      |
| K5  | Constrain row count         | minRows validates without inventing rows; maxRows prevents addition and validates oversized owner values; removal respects minRows |
| K6  | Disable or inspect readonly | Disabled prevents all interactions without touch/change; readonly preserves focus and form inclusion while blocking mutation       |

## Industry evidence and current gaps

Primary references checked October 19, 2026; installed Angular 21.2.17 forms pipelines govern delivery.

| Source                                                                                          | Decision                                                                                                                |
| ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| [Angular CVA](https://angular.dev/api/forms/ControlValueAccessor) and installed forms pipelines | Adopt public change/touch/disabled callbacks; leave updateOn buffering to Angular                                       |
| [Clarity inputs](https://clarity.design/documentation/input), installed input markup            | Adapt Clarity control classes/tokens with native labels and explicit per-input error descriptions; no second form owner |
| [Material chips](https://material.angular.dev/components/chips/overview)                        | Adapt focus recovery after removal; reject chip semantics for two editable fields                                       |
| [NG-ZORRO forms](https://ng.ant.design/components/form/en)                                      | Adopt composed owner validation; reject a second externally managed row form for the value API                          |
| [React Aria TextField](https://react-aria.adobe.com/TextField)                                  | Adapt native labels, error associations and readonly inspection; retain Angular ownership                               |

## Developer learning journey and pedagogy plan

The existing route `/clr-lift/components/key-value-inputs` presents the value-control quick start followed by separately
labeled ngModel, Reactive Forms and facade hosts, then the original FormArray example and API reference. Every new host
provides copyable imports/template, live state, reset and submission. The advanced hosts demonstrate a second enabled
sibling, readonly/disabled, validation, row limits and commit policy. The facade observes its original FormGroup and
explicitly chooses `includeDisabled: false`. Legacy usage remains discoverable on the same route.

## Public API and examples

```typescript
import {Component} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {KeyValueControlComponent, type KeyValueEntry} from 'clr-lift';

@Component({
  imports: [ReactiveFormsModule, KeyValueControlComponent],
  template: `<cll-key-value-control label="Labels" [formControl]="labels" [maxRows]="10" />`,
})
export class LabelsExample {
  readonly labels = new FormControl<KeyValueEntry[]>([{key: 'team', value: 'data'}], {nonNullable: true});
}
```

`KeyValueEntry` defaults to string `key` and `value`; `KeyValueEntry<KeyValueValue>` supports typed values. Submission
is `[{key: 'team', value: 'data'}]`. Internal IDs never enter values. User changes emit a fresh array with fresh entries
and never mutate caller-owned data. Empty is `[]`; nullish owner initialization renders empty without normalizing the
owner. No initial smart row is synthesized.

| Input                 | Default           | Contract                                                                                            |
| --------------------- | ----------------- | --------------------------------------------------------------------------------------------------- |
| label                 | Translated Labels | Accessible fieldset legend; individual fields retain translated Key/Value labels                    |
| minRows               | 0                 | Nonnegative integer; empty arrays are valid unless constrained here or by owner required validation |
| maxRows               | undefined         | Optional nonnegative integer; owner values beyond this limit remain visible and invalid             |
| uniqueKeys            | true              | Exact case-sensitive equality; no trimming or deduplication                                         |
| readonly              | false             | Native readonly fields; Add/Delete blocked; value remains included                                  |
| helper                | empty string      | Caller-provided group help associated with every input                                              |
| keyConfig             | {}                | KeyValueKeyConfig: input, select or combobox and field rules                                        |
| valueConfig           | {}                | KeyValueValueConfig: field config or pure key-dependent resolver                                    |
| resetValueOnKeyChange | false             | Clear the value on user key changes using the new editor type; owner writes never reset it          |
| uniquePairs           | false             | Exact serialized key/value pair uniqueness, independent of uniqueKeys                               |
| excludeSelectedKeys   | false             | Exclude other selected keys from choices; disable Add when choices are exhausted                    |
| addText               | empty string      | Override the localized Add action                                                                   |

Field configuration supports `type`, `options: {value, label, disabled?}[]`, `placeholder`, `helper`, `required`,
`disabled`, numeric `min`/`max`, `validators: {validator: ValidatorFn, errorKey, message}[]`, and built-in error
`messages: Record<string, string>` overrides. `type` defaults to input; key configs restrict it to
input/select/combobox. Value configs additionally support number/boolean/array. Disabled fields block edits and skip
field validation but remain part of the serialized entry. This differs from disabling the entire owning control, which
Angular can omit from a parent form value. Unknown options stay visible and invalid; disabled options cannot be chosen.
Searchable choices hide disabled options. Type/option errors are reported without silently changing owner data.

Custom validators are synchronous and receive a detached FormControl containing the field value. They must not depend on
parent/sibling controls or mutate the control. Use an owner validator for cross-row rules and async validation. Boolean
false is valid; required arrays must contain at least one item. Array items retain whitespace and order.

Disabled state comes from the form owner through `setDisabledState`; there is no competing writable value or disabled
input. Angular's `required` directive or owner `Validators.required` handles the empty-array constraint. Each existing
row requires both fields by default; field configuration can make either optional. Synchronous field validators and
localized messages belong in keyConfig/valueConfig; use the legacy FormArray editor for independent async row controls.
Native CVA template binding does not guarantee FormControl generic-type matching; the exported value type provides
application-level typing.

## Behavior and architecture

The view stores rows with private stable IDs, typed editor fields and no internal Angular FormArray. Model writes
replace the view, preserving IDs by position where possible. User edits preserve row IDs, including duplicate keys;
add/delete uses IDs for DOM identity. Reset discards draft feedback and cancels pending focus work even for equal
values.

The component implements `NG_VALUE_ACCESSOR` and `NG_VALIDATORS`. Intrinsic errors use
`{keyValue: {rows: [{index, key?: {required?: true, unique?: true}, value?: {required: true}}], minRows?, maxRows?}}`.
Count errors contain `{required, actual}`. Validation uses the **owning committed value**, so blur/submit drafts do not
force a premature owner commit. Config changes notify Angular through `registerOnValidatorChange`. Caller sync and async
validators continue to compose. No owner `setErrors`, `setValue` or private pending flags are used.

Every accepted user edit, including invalid empty fields, reports one array. Add emits an empty row; deletion emits the
remaining rows; deletion to zero emits `[]`. Internal focus moves do not report touched. Focus leaving the composite
reports touch on every departure, including after reset, allowing Angular's blur/submit policies to work. Programmatic
disabling never reports touch. Reset/disable/destroy cancel queued focus/departure work. Readonly blocks mutations;
ordinary focus departure can still report touch. No async control work exists beyond focus scheduling.

## Demo and validation plan

Unit/integration coverage uses real Angular directives for all three hosts: silent owner writes, immutable edits,
nullable/non-null reset, repeated composite departures, change/blur/submit policies, disabled initial state, readonly,
limits, duplicate correction, composed sync/async validity and facade payload filtering. Browser tests repeat practical
journeys in Chromium, Firefox and WebKit, including removal focus, narrow dark/compact layouts, runtime language
switching, mount/disposal and translated errors. Installed tarballs are checked with strict Angular 21 types and
templates, then actual DOM interactions in zoneless and ZoneJS applications. Existing FormArray tests remain the
compatibility gate. Automated checks and independent human language/screen-reader acceptance are separate.

## Clarity, accessibility, and localization

Visible/announced inventory: default legend, Key, Value, Add, Delete, required, duplicate, minimum/maximum row messages,
and row-change announcements. Reuse the existing complete `key-value` dictionary for identical terms, preserving
`en-US`, `it`, `pt` aliases. Add owned messages in every library locale and all 11 demo locales. Names update at runtime
without rebuilding values. Native fieldset/legend and labels name the composite/fields; errors and helper IDs describe
the actual focusable inputs. aria-invalid reflects row drafts; count errors describe the group. Native buttons and
readonly/disabled inputs retain keyboard semantics. Polite status announces row counts after user add/delete only.

Use Clarity colors/control classes, flexible rows and logical spacing. Verify light/dark, compact, 390px reflow, zoom,
long translations and RTL. Searchable choices reuse Clarity combobox overlays and keyboard behavior. Automated DOM
checks do not certify SSR/hydration or manual assistive-technology acceptance.

## Compatibility, rollout, and risks

This is an additive Angular 21 feature with no new dependencies, package-peer changes or automatic migration. Native
signal fields follow the deferred platform upgrade. Migration replaces FormArray + `[data]` with one initialized
`FormControl<KeyValueEntry[]>`, imports the new component and binds `[formControl]` or `formControlName`. Transfer
synchronous field validators into configuration deliberately. Independent async row validators and add/remove outputs
remain available through the legacy FormArray API. FormArray controls are never passed into the new API. Clear/reset
semantics and explicit raw/filtered payload choice must be reviewed by each caller. No map conversion is automatic.

## Review decisions and delivery

Settled by this task: additive `cll-key-value-control`, fresh ordered entries, current consumers preserved, Angular 21
first, owner-controlled reset/disabled state, composite touch and Angular-owned updateOn timing. New control, demo,
dictionaries and validation evidence are one delivery scope. Release/publication, human language acceptance and manual
assistive-technology approval retain separate evidence gates.

## Previous implementation evidence (October 19)

Local checks on October 19, 2026:

- Library suite: 347 tests passed, including 16 new real-owner integration tests; legacy FormArray regressions pass. New
  control logic: 95.49% statements, 94.31% branches and 96.70% lines under V8 coverage.
- Demo suite: 263 tests passed. The first working value-control preview precedes the legacy API explanation.
- Feature E2E: 51 tests passed across Chromium, Firefox and WebKit, covering three form modes, all 11 locales, runtime
  switching, invalid correction, reset, focus, disabled/readonly and route disposal. Six additional accessibility checks
  passed using actual `clr-density="compact"`, narrow light/dark layouts and RTL. Full-page scans also exposed shared
  mobile-header target overlap and nonfocusable scrolling API tables; both are fixed without scan exclusions.
- Library/demo/browser and library/demo spec type checks pass. Three preexisting Query DevTools test assertions now use
  index-signature-safe access; its 32 tests and the new control's 16 tests pass together. Lint passes with no newly
  introduced warnings. Existing unrelated `documentation-validation-rules.spec.ts` conditional-test warnings remain.
  Translation parity/placeholder checks and tooling/example checks pass.
- Production library/demo builds and lazy dependency bundle checks pass. Fresh strict-peer tarball installation, strict
  TypeScript/Angular template compilation and actual installed DOM interactions pass in zoneless and ZoneJS processes
  under Angular 21.2.25. Workspace source and host tests use Angular 21.2.17. No workspace path aliases enter the
  isolated fixtures. Both legacy and additive selectors compile/render in the same consumer.

Tests/fixtures:
[form-owner tests](../../../libs/clr-lift/src/lib/components/key-value-control/key-value-control.component.spec.ts),
[browser journeys](../../../apps/demo-e2e/src/key-value-control.spec.ts),
[installed strict hosts](../../../tools/package/fixtures/key-value-hosts.ts) and
[installed DOM runner](../../../tools/package/fixtures/key-value-browser.mjs). The package check is part of the existing
`package-verify` target. The demo source checker inspects the extracted example template, so copyable snippets and
rendered bindings remain checked together.

Independent native-speaker approval, manual screen-reader/zoom assessment, dedicated large-scale measurements,
SSR/hydration, CI, merge and publication are not established by these local checks. The control targets small editable
metadata collections; applications choose maxRows for their use case. Native signal fields remain deferred.

## October 22 acceptance expansion

The default row uses two aligned fields and a times icon button. Key/Value row labels and the composite legend remain
available to assistive technology but are visually hidden. Optional help and errors occupy space below their own field;
unequal error heights never change the input baseline. Form submit/reset actions have their own spacing.

The array control accepts readonly owner arrays but emits fresh mutable arrays. `KeyValueEntry<T = string>` keeps simple
string consumers concise; typed configuration uses `KeyValueEntry<KeyValueValue>` where values can be string, number,
boolean, string array, or null. Array values are copied at the ownership boundary. No coercion is applied to owner
writes.

Approved incremental API:

- `keyConfig`: input, select, or searchable combobox, with options, placeholder, helper and validator/message pairs.
- `valueConfig`: field configuration or a pure key-dependent resolver; input/select/combobox/number/boolean/array
  editors.
- `resetValueOnKeyChange`: opt-in reset to the new editor's empty value; booleans reset to false, arrays to [], numbers
  to null and strings to ''. An explicit disabled field can wait for key selection.
- `uniquePairs`: independent from `uniqueKeys`; repeated keys with different values remain valid when only pairs are
  unique.
- `excludeSelectedKeys`: selected keys are excluded from other rows' choices, while the current row retains its option.
- Field validation supports required (default true), typed values, allowed choices, number bounds, and synchronous
  Angular validator/message pairs. Domain-specific validation and wording belong to the consumer. Owner async validators
  continue to run on the composite control; independent asynchronous row controls retain the existing FormArray
  integration.
- `addText` customizes the add action. Initial rows belong to the owner; initializing with one empty entry replaces
  smart initialization for the CVA. Existing FormArray controls, initialization and outputs remain compatible.

Acceptance recipes: input/input, select/input, input/select, select/select, dependent choices, repeated-category tags
with unique pairs and custom validators, and searchable schema keys with typed values. Include reset, disabled/readonly,
invalid owner data, selection changes and serialization. Preserve false and numeric values without string conversion. A
newline editor maps string arrays to one item per line; no implicit trimming or filtering of nonempty entries occurs.

Validation must cover all three form bridges, long errors and narrow layouts, keyboard selection/removal, runtime
language switching, typed installed consumers and browser checks. Earlier validation below describes the previous
implementation only and does not establish acceptance of this expansion.

### Source comparisons for the expansion

- [Clarity combobox](https://clarity.design/documentation/combobox): reuse the installed 18.4 control for search,
  selection, popup and keyboard behavior. Adapt field ownership and accessible error associations; no new selection
  engine.
- [Angular Material select](https://material.angular.dev/components/select/overview): adapt separate stored values and
  labels; use the existing native/Clarity controls instead of adding another design-system dependency.
- [NG-ZORRO forms](https://ng.ant.design/components/form/en): adopt independently configured fields and owner-managed
  dynamic rows; retain Angular's form state and validation composition instead of a second form framework.
- [React Aria combobox](https://react-aria.adobe.com/ComboBox/useComboBox): adapt explicit labeling and validation
  associations. Do not introduce React dependencies or remote-data infrastructure for local choices.

## October 22 validation evidence

- Compared rendered production and local controls. Default row labels and the group legend are screen-reader-only;
  removal uses the times icon; unequal error messages preserve input alignment and form actions have separate spacing.
- clr-lift: 357 unit/integration tests passed, including dependent resets, typed values, copied nested arrays, pair
  uniqueness, custom validation, invalid selection retention, Clarity selection, readonly and popup focus ownership.
  Library coverage: 93.07% statements, 84.43% branches. New renderer statement coverage: 96.61%.
- Demo: 263 tests passed. All nine runnable key/value snippets compiled with strict Angular templates.
- Browser: 69 checks passed across Chromium, Firefox and WebKit, including narrow layouts, error alignment, all
  input/select combinations, typed searchable configuration, keyboard selection/Escape, open-popup accessibility and
  runtime languages.
- Lint, library/demo/E2E typechecks, spec typecheck, translation completeness (all 11 demo locales and library aliases),
  tooling/example-format checks, production demo build and diff checks passed.
- Installed package verification passed with Angular 21.2.25 in zoneless and ZoneJS modes, including strict
  templates/types, numeric/boolean/array values and the existing FormArray integration.
- The installed Clarity 18.4 combobox needs explicit aria-controls while open and removal of a stale no-results active
  descendant when its popup disappears. The internal renderer supplies these associations; closed and open states pass
  accessibility scans. Popup ownership participates in the composite blur boundary.

These are local results. Remote CI, merge, publication/deployment, independent language review and manual
assistive-technology acceptance were not performed. Consumer applications were audited but not migrated.

### Follow-up interaction refinement

New fields remain visually neutral until their own blur, explicit owner touch or form submission. Validation still
computes immediately for form correctness. Revealing errors marks existing fields only; adding a row after prior touch
or submission does not show its errors prematurely. Reset clears field feedback; a dependent key change clears the new
value field's feedback. Popup interaction remains within the field focus boundary. Default placeholders use localized
Key/Value text without row numbers; an explicit field placeholder overrides them (including an intentional empty
string).

Form demos contain only the key/value control and regular-size actions; Submit uses btn-primary. Dependent select
recipes use an illustrative tag catalog: environment (production/staging/development) and cost-center
(engineering/operations/finance). Both two-select examples filter values by category and clear the old value on a key
change. These are application-owned sample tags, not fixed library restrictions.

Row action buttons retain the current field focus on pointer-down and move focus after their click action. This prevents
newly revealed blur feedback from moving Add or Delete between pointer-down and click, including in Firefox and WebKit.
Keyboard focus and activation remain native.

Follow-up validation (2026-10-22): 358 library tests, 263 demo tests, and 69 key/value browser checks across Chromium,
Firefox, and WebKit passed. Lint (warnings only), type checks, spec compilation, all-locale validation, tooling tests,
nine extracted demo snippet compilations, production build, bundle checks, and fresh packed Angular 21 consumers with
and without ZoneJS passed. Automated checks do not replace independent human language or assistive-technology review. No
publication or deployment was performed.

### Placeholder and documentation clarification

Use plain localized Key and Value placeholders while retaining numbered accessible labels. Required native selects
render an empty disabled, hidden placeholder option; it cannot be chosen as data. Optional selects retain an enabled
empty option so users can clear them. No synthetic Key 1 or Value 1 choices belong in application option lists.

Organize the demo as single-control form examples, editor recipes, caller-owned FormArray integration, and one API
reference. The distinction is form ownership, not two ways to edit a form. Keep empty lists valid by default; callers
initialize one blank row and set minRows=1 when a pair is mandatory. Do not synthesize rows during owner writes or
disable Add merely because another row is incomplete. Disabled and readonly remain independent inputs, with disabled
taking precedence for interaction when both are present.

Guidance sources: [MOJ Add another](https://design-patterns.service.justice.gov.uk/components/add-another/) supports
compact repeating groups; it does not establish a universal minimum-row or validation-gated Add rule. The row policy
above is our recommendation for metadata editors.
[HTML select](https://html.spec.whatwg.org/dev/form-elements.html#the-select-element) distinguishes placeholder labels
from actual choices. [WAI labels](https://www.w3.org/WAI/tutorials/forms/labels/) requires programmatic labels even when
visually hidden. [Angular CVA](https://angular.dev/api/forms/ControlValueAccessor) defines the setDisabledState bridge;
[HTML readonly](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/readonly) is a field-level
capability, not a container cascade.

Placeholder and page validation (2026-10-22): 359 library tests, 263 demo tests, and 72 browser checks passed. Required
and optional select placeholders, real-option selection in newly added rows, section order, all locales, and
accessibility are covered. Lint, type checks, production build, bundle checks, translation/tooling checks, and fresh
packed consumers passed. Publication and deployment remain unperformed.

### Disabled Add guidance and example cleanup

Explain a disabled Add action in visible, localized helper text associated with the button through aria-describedby.
Reasons, in priority order, are disabled owner, readonly mode, maximum row count, and exhausted available keys. Keep
native disabled semantics; do not hide the only explanation in a tooltip that keyboard users cannot reach. Generated
recipes omit unused imports and default boolean bindings, and contain at most one blank line between sections. Use
descriptive FormArray example titles without orphaned numbering. Public demo links prefer the existing Vercel host.

Polish validation (2026-10-22): 359 library tests, 263 demo tests, 75 browser checks across three engines, all
locale/tooling checks, lint/types, production build and bundle checks, and packed-consumer verification passed. All nine
extracted examples compile with strict Angular templates. Public links and package homepages use Vercel; local edits
have not been deployed.

### Pre-PR compatibility review

The existing FormArray component TypeScript/API is unchanged; its template adds localized placeholders only. The new
array-value editor has a different exported component and selector and requires explicit adoption. Packed-consumer
checks exercise legacy initialization, edits without input mutation, and Angular disable/enable in both ZoneJS and
zoneless applications. The review fixed ownership rebinding: replacing a FormControl must unsubscribe old touch events
and observe the replacement, so markAllAsTouched and markAsUntouched continue controlling field feedback.

PR review validation on main 1dccfcf (2026-10-22): 360 clr-lift, 883 ngx-lift, and 279 demo tests passed, along with 75
key/value browser checks across Chromium, Firefox, and WebKit. Lint (zero errors), all-project type checks, library spec
compilation, repository formatting, i18n/tooling checks, production build, bundle checks, and packed-consumer
verification passed. The original header overrides were omitted because main now owns responsive navigation. Independent
human language and assistive-technology acceptance, downstream application runtime acceptance, remote CI, merge, and
publication remain separate gates.
