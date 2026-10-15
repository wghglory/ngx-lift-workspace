# Key/value inputs

Status: **Draft; enhancements on hold** until the [forms contract](forms-compatibility-design-spec.md) and migration are
reviewed. Updated October 15, 2026. Proposed new APIs are not implemented.

## Background

The existing `KeyValueInputsComponent` requires `FormArray<KeyValueFormGroup>` and modifies it directly.

## Goals

- G1: Users edit repeatable metadata with reliable row identity, validation and focus.
- G2: Applications bind a normal typed value through all four form modes without exposing internal controls.
- G3: Existing consumers receive an explicit migration path instead of silent submission changes.

## Non-Goals

Not now: nested JSON editing, secret storage, drag sorting, and arbitrary typed value schemas. Outside this API:
deciding whether a domain allows duplicate keys, case folding, trimming, or empty values. An object/map is not the
primary value: it would silently lose duplicate rows before validation.

## Use cases

| ID  | Task                                                       | Acceptance                                                                                     |
| --- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| K1  | Enter labels or connection options                         | Ordered key/value rows; add focuses the new key; delete preserves a sensible neighboring focus |
| K2  | Correct duplicate or invalid keys                          | Per-row error and overall invalid state; no silent deduplication                               |
| K3  | Edit preloaded data and reset                              | Stable row identity during edits; reset restores the owner's value and state                   |
| K4  | Use native Signal Forms or Reactive Forms + `toSignalForm` | Same submitted array and validation outcome                                                    |
| K5  | Reach row limits or remove the last row                    | Explicit min/max behavior and accessible disabled actions                                      |

## Industry evidence and gap

Use Angular's [model design guidance](https://angular.dev/guide/forms/signals/models) and
[custom-control contract](https://angular.dev/guide/forms/signals/custom-controls) for owner/value boundaries.
[Material chips](https://material.angular.dev/components/chips/overview) informs removable-item focus/announcements; it
does not supply the key/value domain model. Existing Clarity inputs and error containers supply the visual shell. Unlike
a tags input, each row contains two editable fields with independently named errors.

## Proposed API and example

Propose `KeyValueEntry {key: string; value: string}` and value `readonly KeyValueEntry[]`, default empty array. Keep
`cll-key-value-inputs` in the next major and move its required `formArray` contract to an explicitly documented legacy
path or migration. Final compatibility choice is pending; preserve current exports until reviewed. New inputs should
start with `label`, `minRows=0`, optional `maxRows`, and `uniqueKeys=true` (exact case-sensitive match). Key/value
validators report indexed errors; trimming and domain normalization are caller decisions.

```typescript
import {Component} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {KeyValueInputsComponent, type KeyValueEntry} from 'clr-lift'; // entry type/value API proposed

@Component({
  imports: [ReactiveFormsModule, KeyValueInputsComponent],
  template: `<cll-key-value-inputs label="Labels" [formControl]="labels" />`,
})
export class LabelsExample {
  readonly labels = new FormControl<readonly KeyValueEntry[]>([{key: 'team', value: 'data'}], {nonNullable: true});
}
```

Submission is `[{key: 'team', value: 'data'}]`; converting to a map is explicit after validation. Internal UI row IDs
are stable and never leak into submitted values. User edits emit new arrays, never mutate caller data. Multi-field focus
stays within one composite control; moving between rows does not falsely report leaving the component. Duplicate errors
recompute on add/edit/delete; raw invalid drafts remain visible rather than being discarded.

## Demo, validation and delivery

Follow the [workflow](component-development.md): four form demos with required/duplicate errors, readonly/disabled,
min/max, reset, `toSignalForm` state and submission, all supported languages, Clarity theme/density and playground
source. Unit tests cover immutable updates, identity, duplicates, row limits and owner interactions. Three-browser E2E
covers add/delete focus, correction, reset and submit. Check repeated mount/disposal and translated accessible labels.
Review old `data` initialization and `smartMode` behavior before publishing a migration example; do not retain
accidental FormArray mutations as the new contract. Current enhancement work is paused; no source behavior was changed
here.
