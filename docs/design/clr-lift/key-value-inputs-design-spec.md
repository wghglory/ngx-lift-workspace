# Key/value inputs

Owner: clr-lift maintainers. Package: clr-lift. Updated October 23, 2026.

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

## Usage

### Start with text inputs

```typescript
import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {KeyValueControlComponent, KeyValueEntry} from 'clr-lift';

@Component({
  imports: [FormsModule, KeyValueControlComponent],
  template: `<cll-key-value-control [(ngModel)]="entries" [maxRows]="10" />`,
})
export class Example {
  entries: KeyValueEntry[] = [{key: 'team', value: 'data'}];
}
```

Keys and values are required and keys must be unique by default. Empty arrays are valid unless the owner adds `required`
or sets `minRows`. Initialize with `[{key: '', value: ''}]` if a blank first row is useful. The control does not add a
row on initialization or reset.

Row labels are screen-reader-only. The fieldset retains an accessible name through `label` (localized Labels by default)
without adding a visible heading. Removal uses a times icon with a localized, numbered accessible name. Add focuses the
new key; removal focuses the neighboring row's enabled key or value, then Add or the named group. Errors appear below
their own field after blur or submission, without shifting adjacent inputs. New rows and reset fields do not immediately
display errors. Localized Key/Value placeholders are supplied by default; field configuration can override them. Supply
`helper` for group guidance or field `helper` for more specific instructions.

`readonly KeyValueEntry[]` is accepted but not required. The editor copies incoming entries, emits new arrays and
entries, and copies nested string arrays. It never mutates the owner's array. The `readonly` component input is
different: it blocks interaction while retaining the value in form submission.

### Choose input or select independently

Import `KeyValueKeyConfig` and `KeyValueFieldConfig` alongside the control. The following configuration is an excerpt
from a component using the text-input example above:

```typescript
readonly keyConfig: KeyValueKeyConfig = {
  type: 'select',
  options: [{value: 'environment', label: 'Environment'}, {value: 'cost-center', label: 'Cost center'}],
};
readonly valueConfig: KeyValueFieldConfig = {
  type: 'select',
  options: [{value: 'production', label: 'Production'}, {value: 'staging', label: 'Staging'}],
};
```

```html
<cll-key-value-control [(ngModel)]="entries" [keyConfig]="keyConfig" [valueConfig]="valueConfig" />
```

Omit either config to keep that column as free text. Selects store `value`, never `label`. For `required: false`, an
enabled blank option clears the field. Required fields use an unselectable placeholder. Disabled choices cannot be
selected. Owner values that are no longer in the options remain visible and invalid until corrected. Changing the
options revalidates without deleting owner data.

Use `type: 'combobox'` for searchable local options. Clarity supplies the popup, search and keyboard navigation. Arrow
keys navigate choices, Enter selects, and Escape closes the popup. Selection is restricted to available options; typing
a search does not commit arbitrary text. The composite owns focus while interacting with its popup.

### Resolve values from keys

The tag examples use illustrative environment and cost-center catalogs. Real applications supply their own categories
and tags. A `KeyValueValueConfig` can be a pure function. Keep the resolver stable and replace configurations when
external options change; do not mutate option arrays in place.

```typescript
readonly valueConfig: KeyValueValueConfig = (key) => ({
  type: 'select',
  disabled: !['environment', 'cost-center'].includes(key),
  options: (key === 'cost-center' ? ['engineering', 'operations'] : ['production', 'staging'])
    .map(value => ({value, label: value})),
});
```

```html
<cll-key-value-control
  [(ngModel)]="entries"
  [keyConfig]="keyConfig"
  [valueConfig]="valueConfig"
  [resetValueOnKeyChange]="true"
/>
```

With `resetValueOnKeyChange`, user key changes reset the value to the new editor's empty value: `''`, `null` for
numbers, `false` for booleans or `[]` for arrays. Owner writes and reset never perform this dependent reset. Without the
flag, the old value remains visible; validation reports incompatibility. `excludeSelectedKeys` removes other rows' keys
from select/combobox choices and disables Add when all available keys are used. Free-text keys remain unrestricted.

### Tags, pair uniqueness and field validation

For categories that may appear more than once, set `uniqueKeys` to false and `uniquePairs` to true. The same category
with different values is allowed; an exact duplicate pair is invalid. No trimming or case folding occurs.

Each field config accepts synchronous Angular validators with localized messages:

```typescript
readonly keyConfig: KeyValueKeyConfig = {
  placeholder: 'Category',
  validators: [{
    validator: Validators.pattern(/^\S(?:.*\S)?$/),
    errorKey: 'pattern',
    message: 'Do not start or end with whitespace',
  }],
  messages: {duplicate: 'This category and tag are already present'},
};
```

Import `Validators` from `@angular/forms`. Validators receive a detached FormControl containing the field value. They
must be synchronous and must not mutate controls or rely on a parent/sibling control. Use the composite owner's
validator for cross-row or asynchronous rules. Keep the FormArray editor for applications needing independent async row
controls. Built-in message keys are `required`, `unique`, `duplicate`, `selection`, `type`, `min` and `max`. Caller
messages and option labels are caller-owned translations; library defaults support all library locales.

### Preserve typed configuration values

Use `KeyValueEntry<KeyValueValue>[]` when the value is not always a string:

```typescript
readonly entries = new FormControl<KeyValueEntry<KeyValueValue>[]>([
  {key: 'retries', value: 3},
  {key: 'enabled', value: false},
  {key: 'hosts', value: ['one.example', 'two.example']},
], {nonNullable: true});

readonly valueConfig: KeyValueValueConfig = (key) => {
  switch (key) {
    case 'retries': return {type: 'number', min: 1, max: 10};
    case 'enabled': return {type: 'boolean'};
    case 'hosts': return {type: 'array', helper: 'One item per line'};
    default: return {type: 'input'};
  }
};
```

This excerpt requires `FormControl`, `ReactiveFormsModule`, `KeyValueEntry`, `KeyValueValue` and `KeyValueValueConfig`.
Bind the control with `[formControl]="entries"`. Number edits emit numbers, cleared numbers emit null, booleans emit
booleans, and false is valid. The array editor uses one item per line; it preserves order and whitespace and emits an
empty array for empty text. Textarea edits normalize CRLF and lone CR to LF before splitting lines. Owner values are
validated without coercion. Arbitrary nested objects are unsupported.

### Forms, reset and submission

- `ngModel`: give the control a `name` inside an NgForm. Call `resetForm` with the desired initial array.
- Reactive Forms: use `FormControl<KeyValueEntry[]>` (or the typed union), `formControlName` and the owner's `reset()`.
  Non-nullable controls restore their default; nullable reset keeps the owner null and displays no rows.
- `toSignalForm`: create the facade from the same owning FormGroup. This is a Reactive Forms facade, not native Signal
  Forms. Choose `includeDisabled` explicitly when obtaining a submission payload.
- `updateOn: 'blur'` commits on departure from the whole editor; moving between row fields does not commit. `submit`
  follows Angular's form submission pipeline. Row feedback reflects drafts; the owner's validity reflects committed
  data.
- Disable the composite through its owning control. A disabled composite is omitted from an enabled parent's normal form
  value; `getRawValue()` includes it. A field config's `disabled` blocks edits and skips field validation, but its value
  remains in the entry. Readonly keeps focus and form inclusion while blocking changes and add/remove.

The control emits indexed errors under `keyValue.rows`, plus optional `minRows` and `maxRows`. Field errors preserve the
Angular validator payload. Add is blocked by readonly, disabled, maximum count or exhausted key choices. Invalid rows
remain editable; Add is not blocked solely by existing field errors.

Malformed owner data (such as a non-array, null entry, missing field or unsupported nested object) returns
`{keyValue: {rows: [], structure: true}}`. The editor shows an invalid-type message and blocks edits until the owner
supplies a supported array. It never drops malformed entries or rewrites the owner value. Null and undefined still
render as empty, subject to row-count constraints. Attaching an already touched owner reveals its field errors.

### Choose who owns the row controls

An array of data does not automatically become an Angular FormArray. A FormArray is explicitly constructed from child
controls; its generic parameter describes a child control, not a data entry:

```typescript
import {FormArray, FormControl, FormGroup} from '@angular/forms';

type TagRow = FormGroup<{
  key: FormControl<string>;
  value: FormControl<string>;
}>;

const tags = new FormArray<TagRow>([]);
tags.push(
  new FormGroup({
    key: new FormControl('environment', {nonNullable: true}),
    value: new FormControl('production', {nonNullable: true}),
  }),
);
// tags.at(0).controls.key is a FormControl<string>.
// tags.getRawValue() is [{key: 'environment', value: 'production'}].
```

This is an Angular form-model example; apply the application's validators when creating each row. A
`FormControl<KeyValueEntry[]>` instead holds the entire data array in one control. The CVA renders and validates its
internal fields, but does not expose them as caller-owned Angular controls.

| Application requirement                                                        | Preferred ownership                     |
| ------------------------------------------------------------------------------ | --------------------------------------- |
| Independent row validators, pending state, subscriptions, or metadata controls | FormArray                               |
| One value field with ngModel or a simple Reactive Forms binding                | Array-valued FormControl/CVA            |
| Existing code traverses row controls or keeps references to them               | Keep FormArray for incremental adoption |

Neither ownership model is a modernization requirement. See Angular's
[FormArray contract](https://angular.dev/api/forms/FormArray). Do not recreate a FormArray on every CVA value change:
that discards control identity and may lose touched state, subscriptions, or pending validation.

The current FormArray editor supports string key/value rows. It does not yet expose the CVA's typed field configuration,
so retaining FormArray alone does not supply feature parity. Proposed shared-renderer enhancements are recorded in the
[proposal below](#proposed-formarray-and-specialized-row-support); they are not available inputs.

### Choosing a migration boundary

Keep the existing FormArray API when row control identity, parent-aware validators or add/remove outputs are part of the
application's contract. For an array-value migration, initialize one control from the existing data and move field rules
into configuration. Replace smart initialization with an explicit initial empty entry. Map domain schemas to field
configs in the application; do not put application-specific parameter names or persistence into the library.

The interactive demo covers text/text, select/text, text/select, select/select, dependent choices, repeated-category
tags, and searchable typed configuration. The sections below record the full contract and validation status.

### Choose the initial row policy

For optional metadata, bind `[]` and leave `minRows` at zero. Add creates the first row. A blank draft row is a real
row, so its required fields make the owner invalid until completed or removed. It is not silently discarded on
submission.

For a required pair, initialize `[{key: '', value: ''}]` and set `[minRows]="1"`. The minimum prevents removing the last
row and validates an empty owner value; it does not insert rows during `writeValue`. Required field errors remain hidden
until blur, explicit owner touch, or submit.

Keep Add available while rows are incomplete. This lets users enter keys first, then values, and correct errors in their
preferred order. Row limits, unavailable key choices, disabled, and readonly still prevent adding. There is no universal
industry rule requiring validation-gated Add: this is the default chosen for these compact metadata editors. The
[MOJ add-another pattern](https://design-patterns.service.justice.gov.uk/components/add-another/) provides the relevant
repeating-group pattern, rather than a mandatory minimum-row policy.

### How disabled and readonly reach fields

The array-value component is one Angular control. Calling its owner's `disable()` (or binding disabled with ngModel)
invokes `setDisabledState`. A signal drives the parent fieldset, each field renderer, Clarity combobox disabled input,
and row action buttons. Templates apply native disabled properties; there is no imperative loop adding attributes and no
separate Angular FormControl for every internal field. Field-level config can additionally disable one field without
removing its value from the composite array. Caller-owned FormArray controls instead use Angular's normal recursive
`formArray.disable()` behavior.

Readonly is an independent component input, because HTML has no inherited readonly fieldset attribute. Text and number
inputs and textareas receive native readonly. Selects and comboboxes render a focusable readonly text input with the
selected label. Boolean controls expose aria-readonly and block mutation. Add/Delete and all mutation handlers are
blocked. Readonly retains the value in the enabled owner's submission and does not suppress the composite validator.

Both flags may be true: disabled takes precedence for interaction; readonly remains in effect if the owner is enabled
again. A product normally presents one effective editing mode, but the library must accept independently derived flags.
A disabled child is excluded from an enabled parent group's value. Angular's fully disabled group and getRawValue have
different inclusion rules; do not implement this by setting a disabled attribute only on the host element.

Required selects display a disabled, hidden empty placeholder, not a selectable Key/Value entry. Optional selects retain
an enabled empty choice for clearing. Plain localized Key/Value placeholders supplement numbered accessible labels;
placeholders never replace those labels.

When Add is disabled, its visible helper explains the applicable reason: disabled editor, readonly mode, maximum rows,
or no unused keys. The button references this text with aria-describedby; users do not need to hover to discover the
reason.

### Upgrade compatibility

Existing `cll-key-value-inputs` imports, selectors, inputs, outputs, FormArray ownership, validators, and value shape
stay unchanged. Its only visual change is localized Key/Value placeholders for empty fields. Applications do not need to
replace it when upgrading. Existing local application editors also remain unaffected by the new exported selector.

Only choosing to adopt `cll-key-value-control` requires an ownership migration: replace row-level FormArray bindings
with one array-valued FormControl or ngModel binding, map schema configuration and validators, and review any code that
inspects individual row controls. Per-row asynchronous validators and custom subscriptions should remain on the
FormArray integration until the application explicitly redesigns them. Support for typed fields and tag catalogs does
not make this a drop-in replacement for every application-specific editor.

### Check application compatibility before migrating

The legacy FormArray API remains available. Adopting the array-value control changes form ownership: update form
factories, code that traverses `controls`, row subscriptions/validators, reset/toggle behavior, and serialization
together. The new control does not recreate smart initialization; the owner supplies any initial blank row explicitly.

Check the installed package's peers and the application's lockfile together. The current package requires
`ngx-lift >=21.3.0 <22`; an application still resolving an older version must update that dependency as part of its
upgrade. Run the application's own build and integration tests with the packed or released packages.

Typed values alone do not guarantee identical editing behavior. This control's array editor uses newlines and preserves
whitespace and blank items, unlike a comma editor that trims and filters. Unknown schema selections remain visible and
invalid. Keep domain-specific conversion and validation in the application.

Neither delimiter is an accessibility requirement. Provide visible format guidance linked to the field, meaningful
labels, and actionable errors; see
[WCAG labels or instructions](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html). A comma parser
cannot preserve literal commas without escaping, and a newline parser cannot preserve embedded line breaks within an
item. For unrestricted strings, use an item-based editor or an explicitly defined escaping format. Do not silently trim
stored configuration values or discard unknown keys just to make the form valid.

Use an application adapter or retain a FormArray editor for policy rows that carry extra metadata, lock only selected
keys, show per-row warning content, or depend on removal callbacks. The current `keyConfig` applies to every key, and
`valueConfig` receives only the key. Disabled fields skip field validation, so disabling a field does not reproduce
readonly semantics.

When the application uses another localization framework, bridge its active locale to
`TranslationService.setLanguage(locale, false)` using the application's initialization/lifecycle conventions. Coordinate
Clarity common-string overrides and document language/direction ownership as well. Test a locale that differs from the
browser preference, runtime switching, and mounting a second editor. Field `messages`, placeholders, helpers and
`addText` accept caller translations; group errors, row names, remove text and announcements use library translations.
There is currently no component-level text-override or Add-appearance input.

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
provides copyable imports/template, live state, reset and submission. The advanced hosts demonstrate readonly/disabled,
validation, row limits and commit policy. The facade observes its original FormGroup and explicitly chooses
`includeDisabled: false`. Legacy usage remains discoverable on the same route.

## Public API reference

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
descriptive FormArray example titles without orphaned numbering.

Polish validation (2026-10-22): 359 library tests, 263 demo tests, 75 browser checks across three engines, all
locale/tooling checks, lint/types, production build and bundle checks, and packed-consumer verification passed. All nine
extracted examples compile with strict Angular templates. Local edits have not been deployed.

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

## October 23 review hardening contract

- Reject malformed owner values with `keyValue.structure: true` and an empty `rows` error list. Nullish values still
  render as empty. Non-arrays, missing entries/fields, non-string keys and unsupported nested values never throw or
  silently become valid. Preserve the owner value, show the localized invalid-type message, and block editing until the
  owner supplies a supported array.
- Restore error visibility when an already touched control is initially attached or replaces the owner. Fresh rows
  remain untouched and owner reset clears feedback.
- Only select and combobox keys restrict Add when configured choices are exhausted; omitted type means free text.
- Resolve displayed row configurations through computed state. Unrelated change detection does not allocate fresh
  configurations or rerun value resolvers.
- Focus the neighboring row's enabled key or value after deletion; fall back to enabled Add, then the named fieldset.
- Boolean editors use Clarity checkbox styling while retaining focusable readonly inspection and `aria-readonly`.
  Normalize CRLF and lone CR before splitting textarea input: WebKit exposed raw CRLF during input events in browser
  regression testing, even though reading the textarea afterward returned LF.

Local hardening validation: 375 clr-lift and 279 demo unit tests; 78 feature browser checks across Chromium, Firefox and
WebKit; library/demo lint without warnings; type checks and spec compilation; formatting; i18n/tooling checks;
production/bundle checks; and fresh packed Angular 21 consumers in zoneless and ZoneJS modes. The packed fixtures also
exercise malformed owner recovery and readonly boolean preservation. Two existing conditional-test lint warnings remain
in the unrelated `documentation-validation-rules.spec.ts`. Remote CI and independent human acceptance remain separate.

## Consumer adoption boundaries (October 23 review)

Preserving the existing FormArray API does not certify an application upgrade or make the new CVA a drop-in replacement
for every application-owned editor. Verify the packed package's peer requirements against each consumer lockfile; this
package currently requires `ngx-lift >=21.3.0 <22`. The peer range predates this feature. Installed Angular 21.2.25 and
Clarity 18.4 verification does not substitute for a build/runtime check against another consumer's resolved versions.

Migration must account for the caller's form factories, row-control traversal, reset/toggle initialization, validators,
submission mapping, translated wording and locale ownership. In particular:

- Repeated-category tags can use the CVA's `uniqueKeys=false`, `uniquePairs=true` and field validators/messages. Only
  callers choosing that ownership migration must move smart initialization and row-level lifecycle code. Existing
  FormArray ownership remains a supported choice, not technical debt that must be removed.
- Schema-based typed values are representable, but newline arrays preserve whitespace and blank items; migrating from
  comma-separated, trimmed and filtered input changes editing semantics. Unknown keys remain visible and invalid rather
  than being filtered out on load.
- Policy-aware rows with per-row readonly keys, compliance metadata, warning content or removal callbacks are not
  covered by the current CVA. `keyConfig` applies to all keys; `valueConfig` resolves by key only. A disabled field is
  not a substitute for readonly because it skips field validation. Keep an application adapter/FormArray implementation
  until the required generic extension is designed and verified.
- Applications with another translation service must synchronize locale ownership. This library's TranslationService
  also updates document lang/dir and Clarity common strings. Per-field messages and addText do not cover every group
  message, accessible label or announcement. Supplying only min/max wording would not solve that integration.

A configurable Add appearance and a complete text-override contract are possible follow-up APIs, not currently available
inputs. Consumer migration tests should establish the needed scope before adding those contracts. Start with a simple
metadata/tag flow and verify create, edit, toggle, reset, duplicate validation, submission and runtime language changes;
retain specialized policy editors until their additional requirements are met.

## Proposed FormArray and specialized row support

Status: design proposal, not implemented. The current CVA is not a drop-in replacement for all application editors.
Adding button styling and two container error overrides would not close the ownership and specialized-row gaps.

### Ownership and shared implementation

Keep both supported ownership models. A FormArray holds child controls and their identities, validators, pending,
dirty/touched state and subscriptions. An array-valued FormControl holds one composite value. Neither is universally
preferable; applications already using individual row controls should be able to retain them.

Build toward shared private field rendering, row layout, accessible messages and focus management, with separate
FormArray and CVA adapters. Share presentation without forcing the two adapters to share Angular lifecycle semantics.
Preserve existing selectors, string-based type aliases, defaults and initialization behavior. New FormArray capabilities
must be additive; the legacy editor does not currently have the CVA's field configuration support. Do not convert
between ownership models by clearing/rebuilding controls on every edit.

The FormArray adapter must bind existing controls directly, preserve owner validators and metadata, detach only its own
validators/subscriptions, and observe status/touch changes as well as values. Parent-aware and asynchronous field rules
remain ordinary Angular validators. Typed value rows require an additive type contract; widening the existing string
alias would break callers. Row creation must allow the owner to supply extra controls and validators.

### Reusable capabilities and application responsibilities

| Requirement                        | Library responsibility                                             | Application responsibility                                |
| ---------------------------------- | ------------------------------------------------------------------ | --------------------------------------------------------- |
| Repeated category/tag rows         | Pair uniqueness, accessible fields and row actions                 | Category catalog, reserved names and payload mapping      |
| Schema-driven values               | Input/select/combobox/number/boolean/array rendering               | Schema lookup and per-key rules                           |
| Lock original keys but edit values | Per-row, per-field readonly distinct from disabled                 | Decide which rows are original                            |
| Warning and helper content         | Typed row context and accessible content projection                | Compute policy state and translate its explanation        |
| Row removal                        | Stable row identity, event context and focus recovery              | Update application metadata or trigger domain actions     |
| Custom string-array syntax         | Explicit formatting policy or custom renderer                      | Choose delimiter, normalization and allowed item contents |
| Translation and button appearance  | Complete text customization contract and Clarity appearance option | Supply localized copy and presentation choice             |

The row context should expose stable identity, index, current entry, and caller-owned control where applicable. Use
typed accessors for nonstandard control names rather than renaming caller controls or storing policy metadata in the
generic CVA value. Reuse the existing value resolver where sufficient; do not replace its signature incompatibly. Use
projection for unusual warning content or field editors instead of adding a flag for every domain rule.

### Array editing and accessibility decisions

- Preserve the current newline mode by default. An opt-in comma mode with explicit trimming and empty-item filtering can
  match existing applications, but must document that unescaped commas cannot occur inside an item. Newline mode has the
  analogous embedded-line-break limitation. Neither is a general lossless string-array format.
- Draft configuration shape for review: `arrayFormat: {separator: 'comma', trimItems: true, omitEmptyItems: true}` on an
  array field config. This is not an exported API. Owner writes must not normalize data. Define how incompatible
  incoming items are represented and validated before implementing the mode; never silently rewrite them on load.
- Use item-based editing or an explicit escaping format for arbitrary strings. A token/chip editor is a separate
  interaction contract with navigation, removal, focus recovery and announcements; do not add decorative chips and
  assume accessibility is solved.
- Preserve unknown saved keys and report invalid selections. If an application intentionally removes obsolete keys, make
  that an explicit application transformation rather than a hidden side effect of rendering.
- Keep new drafts visually neutral until blur, owner touch or submission. Keep Add available for incomplete drafts in
  the new control. Preserve legacy defaults unless an explicit migration changes them. Optional lists may start empty;
  required lists need a row-count rule plus an explicitly initialized row if desired.
- Readonly must preserve values and validation. Disabled is not a substitute for locking an original key. Row warnings
  need textual meaning and field association, not color or an icon alone.

Primary-source comparisons inform these choices, not a claim that one delimiter is an industry standard:

- [Angular FormArray](https://angular.dev/api/forms/FormArray): adopt direct ownership of child controls where row
  lifecycle matters; reject mandatory conversion to one FormControl.
- [NG-ZORRO forms](https://ng.ant.design/components/form/en): adapt dynamic field composition and customizable
  validation/warning presentation; retain Angular form ownership.
- [Angular Material chips](https://github.com/angular/components/blob/main/src/material/chips/chips.md) and
  [React Aria TagGroup](https://react-aria.adobe.com/TagGroup): adapt keyboard and removal semantics if item editing is
  added; reject importing another design-system dependency merely to obtain chips.
- Existing Clarity combobox rendering remains the selection primitive. Share its tested focus and popup behavior across
  adapters rather than building another combobox implementation.
- [WCAG labels or instructions](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html): require clear
  input and format guidance. Choosing comma or newline syntax remains a product/data-model decision.

### Implementation order and acceptance

First prove the shared renderer through a caller-owned repeated-category FormArray without changing control identity,
validators, reset/toggle behavior or submission. Then add typed schema rows and explicit array formatting. Finally prove
specialized rows with extra metadata, nonstandard key control names, original-key readonly, warning content and removal
callbacks. These are three generic consumer fixtures, not product-specific library modes.

Before claiming migration readiness, verify row-level async validation and pending state, disabled inclusion, touch
timing, add/remove/reorder identity, reset, unknown saved values, delimiter edge cases and runtime locale switching.
Exercise keyboard interaction and error alignment in all supported browser engines, compile packed consumers in both
ZoneJS and zoneless modes, and run the adopting application's create/edit/toggle/submit flows. Existing runtime test
results above do not validate this proposed extension. Final public type names, renderer projection shape and complete
text-override contract remain design-review decisions.
