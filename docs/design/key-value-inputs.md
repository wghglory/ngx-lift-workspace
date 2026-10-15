# Key/value input editors

[中文说明](./key-value-inputs.zh-CN.md)

`cll-key-value-inputs` edits a caller-owned `FormArray<KeyValueFormGroup>`. Each row retains two non-nullable string
controls, `key` and `value`. Existing templates default to two text inputs; no payload conversion or second form model
is required.

## Scenarios and scope

The design was checked against these DSM UI components:

| DSM component                                                       | Reusable behavior                                                                           |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `core-free-text-key-value-inputs` and legacy `lib-key-value-inputs` | Free-text tags, custom validation messages, repeated categories with unique key/value pairs |
| `core-key-value-inputs`                                             | Choose a key from a schema and edit its value; prevent duplicate key choices                |
| `core-db-allowed-parameters-input`                                  | Choose a permitted database parameter and enter a value                                     |

The library supplies independent input/select editors and dependent value options. DSM-specific policy checks, read-only
original parameters, exports, boolean/number/array schema editors, and backend option fetching remain application
responsibilities. This change does not migrate DSM callers or publish a package.

The implementation follows the Reactive Forms control model in
[Angular dynamic forms](https://angular.dev/guide/forms/dynamic-forms) and the label, helper, validation, and keyboard
behavior of [Clarity select](https://clarity.design/documentation/select). Native select controls are used for finite
option sets. Searchable remote catalogs need a dedicated combobox integration rather than treating typed search text as
a valid selection.

## Public configuration

```typescript
import {KeyValueFieldConfig, KeyValueValueConfig} from 'clr-lift';

const keyConfig: KeyValueFieldConfig = {
  mode: 'select',
  label: 'Property',
  options: [
    {value: 'environment', label: 'Environment'},
    {value: 'owner', label: 'Owner'},
  ],
};

const valueConfig: KeyValueValueConfig = (key) =>
  key === 'environment'
    ? {
        mode: 'select',
        options: [
          {value: 'prod', label: 'Production'},
          {value: 'staging', label: 'Staging'},
        ],
      }
    : {mode: 'input', placeholder: 'Team name'};
```

| Input                   | Contract                                                                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `keyConfig`             | `KeyValueFieldConfig`; defaults to `{}` (text input)                                                                                 |
| `valueConfig`           | A field configuration or a pure `(key: string) => KeyValueFieldConfig` resolver                                                      |
| `resetValueOnKeyChange` | Defaults to `false`; when enabled, clears the value and resets its touched/dirty state on a key change, retaining its disabled state |
| `uniqueKey`             | Defaults to `true`; validates every conflicting enabled key and disables occupied choices in other rows                              |
| `uniqueKeyValuePair`    | Defaults to `false`; rejects exact key/value duplicates. Set `uniqueKey` to `false` to allow different values under one category     |

Both field configurations accept `label`, `placeholder`, `helper`, `required` (default `true`), and `validators`. Each
custom validation contains a `ValidatorFn`, `errorKey`, and `message`. Custom messages override the built-in message for
the same error key. Existing `keyPattern`, `valuePattern`, helpers, sizing, button styling, and add/remove outputs
remain supported.

Select options use `{value: string, label: string, disabled?: boolean}`. Values must be unique and nonempty; `''` is
reserved for the empty choice. Labels never enter the submitted value. A disabled option cannot be selected through the
UI but does not invalidate an existing saved selection. A value absent from the option list stays visible and receives a
`selection` error, including programmatic changes. Updating options does not silently clear saved values.

Use immutable input updates for option/configuration changes. A value resolver is purely a function of its key; if its
external catalog changes, provide a new configuration/resolver reference, for example from an Angular `computed` signal.

## Form ownership and lifecycle

- The parent owns the array and its controls. Component validators are added alongside parent validators and removed
  when a row/array is detached or the component is destroyed. Async validation remains observable. Unrelated value
  fields are not revalidated when another key changes. Array status events also refresh the view, so Add becomes
  available after array-level async validation.
- `data` seeds an empty array once per component/array association. Prepopulated arrays take precedence. `smartMode`
  inserts one empty row only during that initial seeding. Neither operation marks the form dirty or emits a user add
  event. Later data changes do not overwrite edits; load records into the parent form explicitly or supply a new array
  instance.
- Use Angular `push`, `removeAt`, `setControl`, and ordinary control APIs with their default event emission for live
  synchronization. Batched silent changes require `array.updateValueAndValidity()` afterward.
- Uniqueness ignores disabled rows/fields and empty strings. Errors are computed without calling `setErrors` on sibling
  controls; peer revalidation clears both sides immediately. Arrays expose `notUnique` / `duplicatePair` errors as well
  as the affected controls. Pair comparison uses separate fields, avoiding delimiter collisions.
- Add is blocked while existing rows are invalid/pending, the array is disabled, or selectable unique keys are
  exhausted. A disabled row cannot be removed. User add/remove actions mark the array dirty; initialization does not.
- Add focuses the new key input/select. Delete focuses the next row, the previous row at the end, or Add if empty.
  Pending focus work is canceled on destruction. Every field has an associated label and unique component-scoped ID;
  delete buttons identify the row number. The layout wraps on narrow screens.

## Using toSignalForm

Create the Reactive Forms tree once, wrap the parent group with `toSignalForm(form)`, and pass the existing arrays to
the editor. Read `sf.value()`, `sf.valid()`, `sf.pending()`, and `sf.submitValue()` directly. Use `sf.bindDisabled` for
parent-driven editing controls and `sf.markAllAsTouched()` before validating submission. There is no component-specific
adapter.

The [demo component](../../apps/demo/src/app/clr-lib/pages/key-value-inputs-demo/key-value-inputs-demo.component.ts)
demonstrates all four combinations in one form, omits its editing toggle from `submitValue`, and captures a saved
snapshot only when enabled and valid. Restoring defaults explicitly recreates the initial rows and restores pristine,
untouched state, since `FormArray.reset()` alone does not restore removed rows.

## Validation

Focused component tests cover the four combinations, initialization, custom and parent validators, uniqueness and
disabled rows, option refreshes, dependent editor changes, array replacement, async completion, signal synchronization,
and focus. Demo tests cover submission, disabled bindings, and restoring defaults. Playwright exercises the actual
rendered controls and saved payloads.

Local checks completed on October 15, 2026:

| Check                                    | Result                                                                                                              |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Full `clr-lift` unit suite               | 27 files, 283 tests passed                                                                                          |
| Full demo unit suite                     | 80 files, 237 tests passed                                                                                          |
| Focused key/value component suite        | 27 tests passed                                                                                                     |
| Component-directory TypeScript coverage  | Lines 98.93%; branches 96.57%                                                                                       |
| Chromium, Firefox, WebKit                | 12 interaction, focus, label, and 390px viewport checks passed                                                      |
| Lint and application/library type checks | Passed                                                                                                              |
| Demo localization                        | All 11 locale dictionaries complete; no errors                                                                      |
| Production demo and library builds       | Passed                                                                                                              |
| Packed consumer verification             | Linked and fresh strict-peer installs passed, including the new public configuration types and `toSignalForm` usage |
| Changed-file formatting and whitespace   | Passed                                                                                                              |

The coverage command scopes V8 coverage to `src/lib/components/key-value-inputs/*.ts`; it is not a coverage claim for
the entire library.
