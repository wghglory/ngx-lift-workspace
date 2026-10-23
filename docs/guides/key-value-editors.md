# Key/value editors

Use `cll-key-value-control` when a form field should contain an ordered array of entries. It works with `ngModel`, typed
Reactive Forms and `toSignalForm`. Use `cll-key-value-inputs` when your application already owns a FormArray and needs
individual row controls. Both components remain supported.

## Start with text inputs

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

## Choose input or select independently

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

## Resolve values from keys

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

## Tags, pair uniqueness and field validation

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

## Preserve typed configuration values

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

## Forms, reset and submission

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

## Choose who owns the row controls

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
[design spec](../design/clr-lift/key-value-inputs-design-spec.md#proposed-formarray-and-specialized-row-support); they
are not available inputs.

## Choosing a migration boundary

Keep the existing FormArray API when row control identity, parent-aware validators or add/remove outputs are part of the
application's contract. For an array-value migration, initialize one control from the existing data and move field rules
into configuration. Replace smart initialization with an explicit initial empty entry. Map domain schemas to field
configs in the application; do not put application-specific parameter names or persistence into the library.

The interactive demo covers text/text, select/text, text/select, select/select, dependent choices, repeated-category
tags, and searchable typed configuration. The [design spec](../design/clr-lift/key-value-inputs-design-spec.md) records
the full contract and validation status.

## Choose the initial row policy

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

## How disabled and readonly reach fields

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

## Upgrade compatibility

Existing `cll-key-value-inputs` imports, selectors, inputs, outputs, FormArray ownership, validators, and value shape
stay unchanged. Its only visual change is localized Key/Value placeholders for empty fields. Applications do not need to
replace it when upgrading. Existing local application editors also remain unaffected by the new exported selector.

Only choosing to adopt `cll-key-value-control` requires an ownership migration: replace row-level FormArray bindings
with one array-valued FormControl or ngModel binding, map schema configuration and validators, and review any code that
inspects individual row controls. Per-row asynchronous validators and custom subscriptions should remain on the
FormArray integration until the application explicitly redesigns them. Support for typed fields and tag catalogs does
not make this a drop-in replacement for every application-specific editor.

## Check application compatibility before migrating

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
