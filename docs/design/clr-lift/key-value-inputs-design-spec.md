# Key/value inputs

Owner: clr-lift maintainers. Package: clr-lift. Approval: feature API pending; template/contract coverage updated
October 16, 2026.

Status: **Draft enhancement API**. Updated October 16, 2026. Angular 21 first under the
[forms contract](forms-compatibility-design-spec.md); feature API review remains pending. Proposed APIs are unavailable.

## Background

The existing `KeyValueInputsComponent` requires `FormArray<KeyValueFormGroup>` and modifies it directly.

## Goals

- G1: Users edit repeatable metadata with reliable row identity, validation and focus.
- G2: Applications bind a normal typed value through the Angular 21 form integrations without exposing internal
  controls.
- G3: Existing consumers receive an explicit migration path instead of silent submission changes.

## Non-Goals

### Not now

nested JSON editing, secret storage, drag sorting, and arbitrary typed value schemas.

### Outside this API

deciding whether a domain allows duplicate keys, case folding, trimming, or empty values. An object/map is not the
primary value: it would silently lose duplicate rows before validation.

## Use cases and acceptance

| ID  | Task                                           | Acceptance                                                                                     |
| --- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| K1  | Enter labels or connection options             | Ordered key/value rows; add focuses the new key; delete preserves a sensible neighboring focus |
| K2  | Correct duplicate or invalid keys              | Per-row error and overall invalid state; no silent deduplication                               |
| K3  | Edit preloaded data and reset                  | Stable row identity during edits; reset restores the owner's value and state                   |
| K4  | Use ngModel or Reactive Forms + `toSignalForm` | Same submitted array and validation outcome                                                    |
| K5  | Reach row limits or remove the last row        | Explicit min/max behavior and accessible disabled actions                                      |

## Industry evidence and current gaps

Use Angular's [CVA contract](https://angular.dev/api/forms/ControlValueAccessor) for Angular 21 owner/value boundaries.
[Material chips](https://material.angular.dev/components/chips/overview) informs removable-item focus/announcements; it
does not supply the key/value domain model. Existing Clarity inputs and error containers supply the visual shell. Unlike
a tags input, each row contains two editable fields with independently named errors.

## Public API and examples

Propose `KeyValueEntry {key: string; value: string}` and value `readonly KeyValueEntry[]`, default empty array. Preserve
the current `cll-key-value-inputs` FormArray API for Angular 21 callers. A separate additive value-control selector or
an explicitly approved breaking release is required; this draft does not authorize replacing the existing selector
contract. New inputs should start with `label`, `minRows=0`, optional `maxRows`, and `uniqueKeys=true` (exact
case-sensitive match). Key/value validators report indexed errors; trimming and domain normalization are caller
decisions.

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

## Demo and validation plan

Follow the [workflow](../component-development.md): three Angular 21 integration demos with required/duplicate errors,
readonly/disabled, min/max, reset, `toSignalForm` state and submission, all supported languages, Clarity theme/density
and playground source. Unit tests cover immutable updates, identity, duplicates, row limits and owner interactions.
Three-browser E2E covers add/delete focus, correction, reset and submit. Check repeated mount/disposal and translated
accessible labels. Review old `data` initialization and `smartMode` behavior before publishing a migration example; do
not retain accidental FormArray mutations as the new contract. Feature API approval remains pending; the
migration-dependent hold is lifted. No source behavior changed here.

## Platform delivery requirement

Initial delivery supports Angular 21 ngModel, typed Reactive Forms, and Reactive Forms + `toSignalForm` where this
feature owns a value. Native signal-field integration is deferred until the platform upgrade, then required under the
[shared forms contract](forms-compatibility-design-spec.md). Display-only surfaces and form containers have no field
value of their own. This requirement does not make proposed exports available.

## Terminology

An entry is ordered user data; UI row identity is not its submitted key. The existing FormArray editor and the proposed
immutable array value control are distinct contracts, not interchangeable overloads.

## Behavior and architecture

### Existing Angular 21 contract

[Source](../../../libs/clr-lift/src/lib/components/key-value-inputs/key-value-inputs.component.ts) and adjacent tests
show required `formArray`, singular `uniqueKey=true`, optional key/value patterns, helpers, size, smartMode and
add/remove outputs. On initialization, nonempty `data` is appended to the supplied array, not applied as a resetting
value. Otherwise smartMode adds one empty row. Created rows require both key and value. Add/delete mutates the
caller-owned FormArray and revalidates key uniqueness; focus targets the added row and the focus timer is canceled on
destruction. Unique validator attachment and initial data happen in ngOnInit; live input changes are not a verified
reconfiguration contract. There is no CVA, ngModel binding, native field binding, minRows/maxRows or select editor
export in this baseline.

### Proposed value control

The immutable value/row/touch rules above apply to the proposed enhancement only. Preserve ordered invalid drafts and
keep caller FormArray mutations out of the new bridge. K1/K2 cover G1; K3/K4 cover G2/G3; K5 covers row constraints.

## Clarity, accessibility, and localization

Existing Clarity input containers and translated add/remove labels stay supported. The proposal still needs full
composite touch, neighboring focus after delete and announced row errors. The old FormArray API is not evidence that
those proposed behaviors already work. Cover all dictionaries, RTL, long labels and keyboard-only editing.

## Compatibility, rollout, and risks

Initial delivery is Angular 21. The example importing KeyValueEntry with the current selector is a provisional API
sketch; it does not compile against today's exports. Prefer an additive selector if the old required FormArray API
cannot coexist unambiguously; approve its name before implementation. Native fields follow the platform upgrade.

## Review decisions and delivery

Maintainers must choose additive selector versus an explicit breaking-release migration before implementing the
value-control example. Retain existing initialization and singular input names for current callers. Review optional
empty values and duplicate policy rather than silently changing the current required validators.

## Evidence

Checked against the current public exports and source at base `e4a43f9` on October 16, 2026. The existing FormArray
editor is implemented; the proposed value-control API and its acceptance tests are not.
