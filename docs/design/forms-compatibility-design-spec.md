# Shared form-control compatibility

Status: **Draft**. Approval pending. Updated October 15, 2026. Proposed contract for the next major; examples are design
sketches, not available exports.

## Background and terminology

New controls need one value contract across established Angular forms and native Signal Forms. Existing `toSignalForm`
takes a `FormGroup`, retains that group's ownership, and adds signal state/submission helpers. Native Signal Forms uses
a signal model and a field tree; these concepts must remain distinct in docs and APIs.

## Goals

- G1: Applications can use the same value-control behavior with each supported form system.
- G2: Developers retain typed values, standard validation/reset/disabled semantics, and simple templates.
- G3: Existing Reactive Forms consumers can use `toSignalForm` without a component-specific adapter.

## Non-Goals

Not now: automatically converting an application's entire FormGroup graph to Signal Forms, or replacing `toSignalForm`.
Outside this API: assigning form values to navigation/display components such as breadcrumbs, badges, and drawers.
Read-only viewers are display APIs; editors and selection-enabled calendars have explicit value contracts.

## Use cases

| ID  | Task                                           | Expected behavior                                                                 |
| --- | ---------------------------------------------- | --------------------------------------------------------------------------------- |
| F1  | Bind a small settings control with ngModel     | User changes update once; external changes/reset render without a user event      |
| F2  | Edit a typed FormGroup                         | Disabled, validation, touched/dirty, reset and `updateOn` match Angular contracts |
| F3  | Observe the same FormGroup with `toSignalForm` | `sf.fields` and `sf.submitValue()` reflect actual form state                      |
| F4  | Bind a native Signal Forms field               | Value, availability, validation, touch and reset flow through the native contract |
| F5  | Move focus between input, pills and overlay    | Touch occurs when leaving the composite, with no premature blur commit            |
| F6  | Disable/reset/destroy while work is pending    | Pending work cannot overwrite the new state; resources are released               |

## Evidence and proposed design

[Angular's custom-control guide](https://angular.dev/guide/forms/signals/custom-controls) describes model-based value
controls; [FormValueControl](https://angular.dev/api/forms/signals/FormValueControl) is stable since v22.0. The selected
release's installed declarations are authoritative when compiling examples; live guides and API pages can drift.
Material's
[autocomplete integration](https://github.com/angular/components/blob/main/src/material/autocomplete/autocomplete.md) is
a reference for supporting Angular forms without multiplying consumer-facing adapters.

Use a native value-control surface and a CVA bridge backed by the same internal state. Keep any reusable bridge private
until multiple concrete controls prove its shape. Do not add a new public forms framework. Each control documents one
exact type: single selection `V | null`, multiple selection `readonly V[]`, text `string`, etc. Only one form owner
binds a control instance; simultaneous ngModel/reactive/native bindings are unsupported.

Writes from the owner never call CVA `onChange`; user changes call it exactly once. Reset, disabled/readonly, pending,
validation errors, focus and touched must work with real rendered hosts. Internal search terms are separate from the
value. Respect Reactive Forms `updateOn: 'change' | 'blur' | 'submit'`; report interaction rather than forcing owner
validation. Native bindings use the release's `FormValueControl` value model and state/touch surface.
Required/pattern/min/max and component parse errors must reach the owning form without duplicating conflicting
validators.

## API review examples

The proposed control class below stands for a real component from its feature spec. Imports and binding syntax are part
of review; compile all examples against the selected Angular 22 package before approving the implementation.

```typescript
import {Component, signal} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {form, FormField} from '@angular/forms/signals';
import {toSignalForm} from 'ngx-lift';
import {ComboboxComponent} from 'clr-lift'; // proposed export

@Component({
  imports: [FormsModule, ReactiveFormsModule, FormField, ComboboxComponent],
  template: `
    <cll-combobox label="Owner" [options]="owners" [(ngModel)]="owner" name="owner" />
    <cll-combobox label="Owner" [options]="owners" [formControl]="group.controls.owner" />
    <p>Reactive value observed through toSignalForm: {{ sf.fields.owner.value() }}</p>
    <button type="button" (click)="group.reset()">Reset reactive form</button>
    <cll-combobox label="Owner" [options]="owners" [formField]="nativeForm.owner" />
  `,
})
export class FormModesExample {
  readonly owners = [{value: 'u1', label: 'Ada'}];
  owner: string | null = null;
  readonly group = new FormGroup({owner: new FormControl<string | null>(null)});
  readonly sf = toSignalForm(this.group);
  readonly nativeModel = signal<{owner: string | null}>({owner: null});
  readonly nativeForm = form(this.nativeModel);
}
```

The second control plus `sf` demonstrates Reactive Forms + `toSignalForm`; it does not create a separate native form.
The shipping demo must offer four clearly identified examples, each with validation, reset, disabled/readonly, submitted
value, and code. Feature demos use their real value types and meaningful validators.

## Compatibility and validation gates

Recommend native Angular 22 support in a new major while maintaining the 21.x release line. Confirm that policy before
editing package ranges. Test strict tarball consumers and both zoneless and ZoneJS where declared supported. Do not
claim SSR/hydration support based on a DOM fixture; document the boundary and test browser-only engines lazily.

The platform spike must end with a recorded compatibility decision before new controls are implemented: Angular 22-only
major, or explicitly supported/tested Angular 21 and 22 package surfaces. If migration is postponed, keep the new
native-form controls pending by default. A requested 21.x backport can reuse value state and CVA without importing the
22-only contract into that consumer's public declarations; approve its separate scope and prove it with strict installed
consumers. Do not add dual-major adapters speculatively or promise a backport merely because a component has a CVA.

Unit/type coverage: typed null/empty/multiple values, owner writes, duplicate event prevention, errors, composite touch,
pending transitions, reset, disable, `updateOn`, teardown and no retained owner subscriptions. Browser coverage:
submit/reset in all four hosts, keyboard/touch overlays, labels/errors, language/theme changes, repeated mount/unmount.
Use Clarity page containers and playground code tabs. Translate all demo and control strings.

## Review decisions and evidence

Pending: Angular 22-only major versus dual-major support; exact native binding names in the chosen release; which
private bridge behavior is worth sharing. Approve this contract before resuming key/value enhancements or implementing
selection. No new form-control behavior, Angular 22 installation, compiled example, or consumer test was delivered by
this spec.
