# Shared form-control compatibility

Status: **Draft API; delivery order decided by maintainer October 16, 2026**. Owner: clr-lift maintainers. Package:
clr-lift. Approval: Angular 21-first direction approved in the task; individual component APIs remain pending. Proposed
control exports are unavailable until implemented.

## Background

New controls must ship without waiting for Angular 22 or the Nx major upgrade. Existing `toSignalForm(FormGroup)`
retains Reactive Forms ownership and adds signal observations/submission helpers. Native Signal Forms owns a signal
model and field tree. See the [implemented facade source](../../../libs/ngx-lift/src/lib/signals/to-signal-form.ts) for
the current API.

## Terminology

**CVA** bridges Angular 21 ngModel/Reactive Forms to a value control. **Facade** means `toSignalForm` over that same
FormGroup. **Native field** means Angular Signal Forms integration, deferred until the platform upgrade.

## Goals

- G1: Ship new clr-lift value controls on Angular 21 with typed Reactive Forms and ngModel.
- G2: Preserve typed values, validation, reset, disabled/readonly and interaction semantics across integrations.
- G3: After the platform upgrade, support native signal fields across every new value control without redesigning
  values.

## Non-Goals

### Not now

Angular 22/Nx major upgrades, native Signal Forms imports/adapters, or converting FormGroup graphs to field trees.

### Outside this API

Replacing `toSignalForm`, domain persistence, or assigning form values to drawers, viewers, breadcrumbs and badges.

## Use cases and acceptance

| ID  | Actor and task                     | Initial state/action                    | Observable outcome                                     | Failure/recovery                            | Demo/test                     |
| --- | ---------------------------------- | --------------------------------------- | ------------------------------------------------------ | ------------------------------------------- | ----------------------------- |
| F1  | Bind ngModel                       | Prefill, edit, externally reset         | One user update; owner writes never echo               | Clear/reset restores documented empty value | Phase 1 ngModel host          |
| F2  | Edit typed FormGroup               | Validate, disable, reset, submit        | Correct value, dirty/touched/pending and updateOn      | Error visible without losing draft          | Phase 1 Reactive Forms host   |
| F3  | Observe via facade                 | Wrap F2's group in toSignalForm         | Same value and validity; explicit submission filtering | Reset/async validity reaches facade         | Phase 1 facade host           |
| F4  | Bind native field                  | After upgrade, repeat F1/F2 journeys    | Same serialized value and native field state           | Required/parse/async errors reach owner     | Phase 2 native host, deferred |
| F5  | Traverse composite                 | Move between input, pills and overlay   | Touch only when leaving composite                      | No premature blur commit                    | Keyboard/pointer E2E          |
| F6  | Reset/disable/destroy pending work | Start remote load then owner transition | Obsolete completion cannot overwrite new state         | Reenable/retry uses current owner state     | Race/cleanup tests            |

## Industry evidence and current gaps

Checked October 16, 2026: [Angular CVA](https://angular.dev/api/forms/ControlValueAccessor) separates owner writes, user
changes, touch and disabled propagation. Adopt this bridge for Angular 21. Angular's
[native custom-control contract](https://angular.dev/api/forms/signals/FormValueControl) informs the later integration;
compile against the selected upgraded release before committing to its exact binding syntax. Current key/value inputs
are a caller-owned FormArray editor, not a CVA. No generic lift CVA/native bridge exists today.

## Public API and examples

Each feature chooses one exact value: single key `V | null`, multiple keys `readonly V[]`, text `string`, or an ordered
key/value array. A control instance has one form owner. Search text and invalid drafts are separate from committed data.

```typescript
import {Component} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {toSignalForm} from 'ngx-lift';
import {ComboboxComponent} from 'clr-lift'; // proposed export

@Component({
  imports: [FormsModule, ReactiveFormsModule, ComboboxComponent],
  template: `
    <cll-combobox label="Owner" [options]="owners" [(ngModel)]="owner" name="owner" />
    <cll-combobox label="Owner" [options]="owners" [formControl]="group.controls.owner" />
    <p>Reactive value: {{ sf.fields.owner.value() }}</p>
    <button type="button" (click)="group.reset()">Reset</button>
  `,
})
export class FormModesExample {
  readonly owners = [{value: 'u1', label: 'Ada'}];
  owner: string | null = null;
  readonly group = new FormGroup({owner: new FormControl<string | null>(null)});
  readonly sf = toSignalForm(this.group);
}
```

The second control plus `sf` is the third integration example, still Reactive Forms. Submitted owner is `'u1'` or null;
facade omission options can deliberately change the payload. Phase 2 will add a separate compiled native-field example.

## Behavior and architecture

One internal value/interaction state backs the CVA now and the native bridge later. Keep any reusable bridge private
until real controls prove its shape. Owner writes never invoke `onChange`; accepted user edits invoke it once. Honor
`updateOn: 'change' | 'blur' | 'submit'` by reporting interaction to Angular. Required/pattern/min/max and parse errors
reach the owning form. Disabled blocks edits; readonly preserves inspection/focus where meaningful. Reset clears
uncommitted drafts. Pending work uses cancellation plus generation checks. Do not add native form dependencies to
Angular 21 package imports or public declarations.

## Clarity, accessibility, and localization

Use Clarity containers, labels, helper/error slots and tokens. Define composite focus boundaries including overlays.
Translate labels, errors, empty/loading states and announcements in every supported dictionary. Each feature owns its
keyboard/touch, dark/compact, RTL and narrow-layout behavior.

## Demo and validation plan

Phase 1 requires ngModel, typed Reactive Forms, and Reactive Forms + facade hosts with real imports, submission,
validation, reset, disabled and readonly. Test owner writes, no duplicate changes, async validation and `updateOn`.
Compile strict Angular 21 tarball consumers and check declared zoneless/ZoneJS modes; DOM tests do not prove SSR. Phase
2 repeats those checks and adds native field value/reset/availability/touch/pending/error propagation and real browser
submissions for every new value control listed in the [roadmap](../../component-roadmap.md).

## Compatibility, rollout, and risks

Deliver Angular 21 CVA controls first. The Angular/Nx major upgrade is deferred. After it, native signal-field support
is required across new value controls. A future release decision must define Angular 21 retention and package peers;
this document changes neither pins nor public APIs. Preserve the existing key/value FormArray API until its reviewed
migration is implemented. Ordinary Angular signal inputs/state are compatible with this policy.

## Review decisions and delivery

Settled: Angular 21 first; no native Signal Forms in phase 1; native field support required after upgrade. Pending:
feature value APIs, key/value coexistence strategy, and upgrade release/compatibility policy. Review each feature before
implementation; future native support must keep its serialized value stable or explicitly document a breaking change.

## Evidence

Source and manifest inspection on October 16, 2026. CVA and native upstream contracts checked separately. Examples use
proposed components and have not been compiled. No component implementation, browser run or Angular 22 consumer is
claimed by this documentation change.
