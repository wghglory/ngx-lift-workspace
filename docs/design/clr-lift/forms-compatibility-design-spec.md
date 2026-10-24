# Shared form-control compatibility

Status: **Shared contract reviewed; key/value phase 1 locally verified**. Updated October 19, 2026. Owner: clr-lift
maintainers. Package: clr-lift. Approval: the maintainer accepted shared-contract revision `1e3ae98` in chat review. The
examples below use existing Clarity APIs. Individual new-control APIs and their implementation evidence remain separate
gates.

## Applicable contracts

Value types, CVA ownership, validation, composite focus and pending-work cancellation apply. Angular 21 Reactive
Forms/ngModel and the toSignalForm facade are phase 1; native signal fields are a later platform gate.

## Background

New controls must ship without waiting for Angular 22 or the Nx major upgrade. Existing `toSignalForm(FormGroup)`
retains Reactive Forms ownership and adds signal observations/submission helpers. Native Signal Forms owns a signal
model and field tree. See the [implemented facade](../ngx-lift/reactive-forms-design-spec.md) for the current API.

## Terminology

**Owner** is the Angular control holding the submitted value and form status. **CVA** bridges its model writes, user
changes, touch and disabled state to the view. **Draft** is uncommitted text or search state. **Composite** includes a
control's inputs, selected-item actions and owned overlay, even when the overlay is outside its DOM subtree. **Facade**
means `toSignalForm` over the same FormGroup. **Native field** means Angular Signal Forms integration, deferred until
the platform upgrade.

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

| ID  | Actor and task                     | Initial state/action                    | Observable outcome                                     | Failure/recovery                               | Demo/test                     |
| --- | ---------------------------------- | --------------------------------------- | ------------------------------------------------------ | ---------------------------------------------- | ----------------------------- |
| F1  | Bind ngModel                       | Prefill, edit, externally reset         | One accepted user edit; owner writes never echo        | Clear uses empty value; reset uses owner value | Phase 1 ngModel host          |
| F2  | Edit typed FormGroup               | Validate, disable, reset, submit        | Correct value, dirty/touched/pending and updateOn      | Error visible without losing draft             | Phase 1 Reactive Forms host   |
| F3  | Observe via facade                 | Wrap F2's group in toSignalForm         | Same value and validity; explicit submission filtering | Reset/async validity reaches facade            | Phase 1 facade host           |
| F4  | Bind native field                  | After upgrade, repeat F1/F2 journeys    | Same serialized value and native field state           | Required/parse/async errors reach owner        | Phase 2 native host, deferred |
| F5  | Traverse composite                 | Move between input, pills and overlay   | Touch only when leaving composite                      | No premature blur commit                       | Keyboard/pointer E2E          |
| F6  | Reset/disable/destroy pending work | Start remote load then owner transition | Obsolete completion cannot overwrite new state         | Reenable/retry uses current owner state        | Race/cleanup tests            |
| F7  | Choose when edits reach the owner  | Use change, blur and submit policies    | Angular commits at the configured boundary             | Reset drops a buffered edit                    | Real Angular directive hosts  |
| F8  | Submit disabled/readonly fields    | Disable one child or keep it readonly   | Payload follows explicit owner serialization policy    | Reenable retains the committed value           | Reactive/facade host          |
| F9  | Correct an invalid draft           | Enter an unparseable value              | Owning form sees an intrinsic error without data loss  | Correction clears only the control's error     | Applicable parsing controls   |

G1 maps to F1–F3/F7; G2 to F1–F3/F5–F9; G3 to the deferred F4 matrix. These are planned acceptance cases, not results.

## Industry evidence and current gaps

Checked October 18, 2026. Installed Angular 21.2.17 source is the phase-1 behavioral baseline; current upstream docs can
also describe newer form integrations.

| Primary source / existing implementation                                                                                      | Observed behavior                                                                                 | Adopt, adapt, or reject                                                                                      |
| ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| [Angular CVA](https://angular.dev/api/forms/ControlValueAccessor), installed `@angular/forms` view/blur/submit pipelines      | CVA reports changes/touch; Angular buffers commits for `updateOn`                                 | Adopt; do not reproduce Angular's pending flags inside controls                                              |
| [Clarity combobox](https://clarity.design/documentation/combobox/api), installed `clr-angular-forms-combobox.mjs`             | Existing CVA, selection, labels and overlay behavior                                              | Reuse public APIs; verify composite focus rather than assuming every shared requirement is already satisfied |
| [Material custom field guide](https://github.com/angular/components/blob/main/guides/creating-a-custom-form-field-control.md) | Separates form-field presentation, focus/error state and the forms bridge                         | Adapt state ownership; keep Clarity presentation and omit newer native-field examples in phase 1             |
| [NG-ZORRO forms](https://ng.ant.design/components/form/en)                                                                    | Form presentation derives validation feedback from Angular controls                               | Adopt owner-driven errors; do not copy Ant styling or a second form model                                    |
| [React Aria forms](https://react-aria.adobe.com/forms)                                                                        | Associates labels/errors with fields and distinguishes controlled values from validation feedback | Adapt accessible feedback; Angular remains the validation/submission owner                                   |

Local starting points, inspected rather than newly certified:

- [File-reader](../../../libs/clr-lift/src/lib/components/file-reader/file-reader.component.ts) already implements CVA
  and intrinsic validation. Its `writeValue` does not emit changes; disable cancels pending reads. Its existing
  action-based touch behavior is not proof of the proposed composite-blur contract. Preserve its public behavior here.
- [Key/value inputs](../../../libs/clr-lift/src/lib/components/key-value-inputs/key-value-inputs.component.ts) require a
  caller-owned FormArray. A future value-control API must coexist with it or obtain separate migration approval.
- [toSignalForm](../../../libs/ngx-lift/src/lib/signals/to-signal-form.ts) observes/delegates to the original FormGroup;
  its [submission helper](../../../libs/ngx-lift/src/lib/signals/to-submit-value.ts) includes disabled values by
  default.
- No generic lift CVA/native bridge exists. Keep a shared mechanism private until implemented controls demonstrate
  reuse.

## Developer learning journey and pedagogy plan

Prerequisites: Angular 21 ngModel, typed Reactive Forms, and the existing facade. The shared behavior contract is
reviewed; future controls still require their own API and implementation acceptance.

| Reader task                           | Learning outcome                                                 | Destination / working example                         |
| ------------------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------- |
| Bind one value control                | Explain owner writes versus user changes and the submitted value | Example A: ngModel owner selection and submission     |
| Add typed validation and reset        | Separate clear, owner writes, reset and disabled values          | Example B: typed Reactive Forms; F2/F7/F8 hosts       |
| Observe the same form through signals | Preserve Angular ownership and choose payload filtering          | Example C: facade over Example B's FormGroup; F3 host |
| Add composite/async behavior          | Explain touch boundaries, drafts and obsolete requests           | Behavior table and F5/F6/F9; native F4 stays deferred |

Validation and delivery: The additive key/value control now has real delivery hosts and installed Angular 21 evidence.
Existing Clarity/facade examples do not certify other new controls or a native field bridge. The public API and behavior
sections below own exact options and limitations; examples introduce them after the first task.

## Public API and examples

Each feature chooses one exact value and documents its empty value:

| Kind                     | Form value                   | User clear      | Owner reset                                                    |
| ------------------------ | ---------------------------- | --------------- | -------------------------------------------------------------- |
| Single selection         | Primitive `V \| null`        | `null`          | Owner-supplied value/default, which may be a selected key      |
| Multiple selection       | `readonly V[]`               | New empty array | Owner-supplied array/default                                   |
| Text/completion          | `string`                     | `''`            | Owner-supplied string/default                                  |
| Ordered key/value editor | Feature-reviewed entry array | New empty array | Owner-supplied array/default; legacy FormArray stays supported |

A control instance has one form owner. Search text, highlighted options and invalid drafts are separate from committed
data. Do not combine ngModel and Reactive Forms or add a second writable value binding on the same instance. Copy
collection inputs before internal edits and emit a new array for accepted collection changes. Feature specs own key
identity, equality, ordering and intrinsic parse errors; this contract does not approve those APIs.

The examples use existing `ClrComboboxModule` and `ClrCommonFormsModule` from `@clr/angular`; no lift selection export
is proposed. Simple username strings keep displayed and submitted values identical. These are integration examples, not
certification that Clarity implements every requirement for future lift controls. Labels are explanatory English;
delivered UI must translate owned text under the [acceptance contract](../../guides/accessibility-and-localization.md).

### A. ngModel: select and submit one owner

```typescript
import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';
import {ClrComboboxModule, ClrCommonFormsModule} from '@clr/angular';

@Component({
  imports: [FormsModule, ClrComboboxModule, ClrCommonFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form #form="ngForm" (ngSubmit)="save(form)">
      <clr-combobox-container>
        <label>Owner</label>
        <clr-combobox [(ngModel)]="owner" name="owner" required>
          <clr-options>
            <clr-option *clrOptionItems="let option of owners" [clrValue]="option">{{ option }}</clr-option>
          </clr-options>
        </clr-combobox>
        <clr-control-error>Owner is required.</clr-control-error>
      </clr-combobox-container>
      <button type="submit">Save</button>
      <button type="button" (click)="form.resetForm({owner: null})">Reset</button>
    </form>
    <output>{{ submitted()?.owner }}</output>
  `,
})
export class NgModelOwnerExample {
  readonly owners = ['alice', 'bob'];
  owner: string | null = null;
  readonly submitted = signal<{owner: string | null} | null>(null);

  save(form: NgForm): void {
    form.control.markAllAsTouched();
    if (!form.valid) return;
    this.submitted.set({owner: this.owner});
  }
}
```

Selecting alice submits `{owner: 'alice'}`. Clear reports null and required validation blocks this example's save. The
reset button explicitly chooses null; it does not promise that every Angular reset means clear.

### B. Typed Reactive Forms: prefill, validate, reset and disable

```typescript
import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ClrComboboxModule, ClrCommonFormsModule} from '@clr/angular';

@Component({
  imports: [ReactiveFormsModule, ClrComboboxModule, ClrCommonFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="form" (ngSubmit)="save()">
      <clr-combobox-container>
        <label>Owner</label>
        <clr-combobox formControlName="owner">
          <clr-options>
            <clr-option *clrOptionItems="let option of owners" [clrValue]="option">{{ option }}</clr-option>
          </clr-options>
        </clr-combobox>
        <clr-control-error>Owner is required.</clr-control-error>
      </clr-combobox-container>
      <button type="submit">Save</button>
      <button type="button" (click)="form.reset()">Reset</button>
      <button type="button" (click)="form.controls.owner.disable()">Disable owner</button>
      <button type="button" (click)="form.controls.owner.enable()">Enable owner</button>
    </form>
    <output>{{ submitted()?.owner }}</output>
  `,
})
export class ReactiveOwnerExample {
  readonly owners = ['alice', 'bob'];
  readonly form = new FormGroup({
    owner: new FormControl<string | null>('alice', {nonNullable: true, validators: Validators.required}),
  });
  readonly submitted = signal<Partial<{owner: string | null}> | null>(null);

  save(): void {
    this.form.markAllAsTouched();
    if (!this.form.valid) return;
    this.submitted.set(this.form.getRawValue());
  }
}
```

The explicit `string | null` type allows user clear; `nonNullable: true` makes parameterless reset restore the initial
`'alice'` instead of null. `getRawValue()` deliberately retains disabled children. This one-field form becomes DISABLED
when its only control is disabled, so the validity guard blocks save. Use the F8 multi-field host to verify omission of
a disabled child from an enabled group's `value`.

### C. Signal observations over the same Reactive Form

Starting from Example B, import `toSignalForm` at module scope, add the `sf` field inside `ReactiveOwnerExample`, and
replace `save` with the method below. This is a separate delivery host, not a second form owner or a second control
binding. The partial submitted-payload type preserves omissions rather than replacing missing keys with null.

```typescript
import {toSignalForm} from 'ngx-lift';

readonly sf = toSignalForm(this.form, {includeDisabled: false});

save(): void {
  this.sf.markAllAsTouched();
  if (!this.form.valid) return;
  this.submitted.set(this.sf.submitValue());
}
```

Render `{{ sf.fields.owner.value() }}`, `{{ sf.fields.owner.touched() }}` and `{{ sf.status() }}` alongside the same
form. Selecting alice still submits `{owner: 'alice'}`. `sf.form` and `sf.controls.owner` refer to the original
owner/control. `sf.submitValue()` defaults to raw values, including disabled children; this example explicitly chooses
`form.value` semantics instead. An enabled group omits disabled children; Angular includes all children in a wholly
disabled group's `value`. The facade does not override that exception or make the payload valid automatically.
Filtering/transform options belong to the application's payload policy. Phase 2 adds a separate compiled native-field
example.

## Behavior and architecture

One internal value/interaction state backs the CVA now and the native bridge later. Keep any reusable bridge private
until real controls prove its shape. The component reports interaction; Angular owns dirty/touched, validation and
commit timing. Use public Angular interfaces; no control-private pending flags or forced owner value/status writes.

| Trigger                                                  | Required behavior                                                                                                                                     | Owner notification                                                                                      |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `writeValue` on setup, setValue, patchValue or reset     | Render the supplied value, discard obsolete drafts, invalidate stale work; accept nullish initialization for display without rewriting the owner      | No `onChange`, `onTouched` or user-change event                                                         |
| Accepted user edit/selection/clear                       | Update the view and report the serialized value once; highlighting/query edits alone do not select an entity                                          | One `onChange(value)` per accepted value change                                                         |
| Focus moves within the composite or to its owned overlay | Keep one logical focus boundary, including pointer and keyboard transitions                                                                           | No `onTouched`                                                                                          |
| User focus leaves the entire composite                   | Report departure after resolving the actual focus destination; return focus within the composite on Escape when appropriate                           | `onTouched()` on each departure, including after reset; Angular decides when touched becomes observable |
| `setDisabledState(true)`                                 | Block all edit paths, close the overlay, invalidate pending work, keep committed value; disabling is not a user clear or blur                         | No change/touch callback                                                                                |
| Readonly becomes true                                    | Block text edits, selection changes and removal; preserve meaningful focus/inspection and form inclusion; cancel work that could commit an edit       | No change callback; ordinary later user departure may report touch                                      |
| Owner reset                                              | Render the value Angular supplies (nullable default, non-null default or explicit value); cancel stale work even if the serialized value is unchanged | Angular resets pristine/touched; CVA does not infer reset solely from a null value                      |
| Destroy or superseded request                            | Unsubscribe/abort and invalidate the generation so an uncancelable completion cannot write later                                                      | No late callbacks, validator notifications or UI updates                                                |

**Commit timing:** call CVA `onChange` when the user accepts an edit for all `updateOn` modes. Angular buffers that
value for blur or submit; the control must not add its own competing buffer. With blur, moving to an option/pill is not
a commit boundary. Escape back to the input is not departure. `ngSubmit` runs after Angular synchronizes submit-mode
edits; read payloads there rather than in a Save click handler. Do not disable the submit action solely because the
pre-submit owner value is invalid: a buffered edit may make it valid on submit. A pending async validator blocks save
until a subsequent valid submission; this contract does not queue or automatically resubmit operations.

**Validation:** owner validators supply business constraints. Feature-owned parse/structural errors implement Angular's
Validator contract, compose with owner validators, and notify `registerOnValidatorChange` when those errors change. An
invalid draft must be visible to the owning form so it cannot silently submit an older valid value. Retaining the last
parseable value versus another explicit invalid representation is a feature API decision. A CVA alone does not forward
validators, required semantics, readonly state or network pending into Angular. Required/pattern/min/max must be
verified for each applicable value type, not inferred from matching input names.

**Async state:** remote search/loading is control UI state, not automatically `FormControl.pending`. Only owning-form
async validation creates that validation state. Angular owns validator cancellation; control-owned search/parsing work
owns its unsubscribe/AbortSignal and generation checks. Owner writes and disabled/readonly transitions cannot let late
results select, normalize or overwrite a value. A feature must separately define whether readonly permits read-only
lookup/inspection. No Angular native-form dependency enters phase-1 imports or declarations.

## Clarity, accessibility, and localization

Follow the [accessibility and language acceptance contract](../../guides/accessibility-and-localization.md) in both
libraries and the demo, including AI-generated work. Use Clarity containers, labels, helper/error slots and tokens;
connect names, descriptions, errors and invalid/readonly/disabled states to the actual focusable element. An outer label
or CVA implementation alone is insufficient. Define composite focus boundaries including overlays.

Inventory labels, help, required/parse/business errors, selected/unavailable labels, clear/remove actions,
empty/loading/failure/retry states, result counts and announcements. Complete all 11 supported demo locales and every
existing library locale/alias. Runtime language switching updates names/messages without resetting values, drafts,
active steps or focus. Feature acceptance covers keyboard/touch, light/dark/compact, zoom/reflow, long translations and
applicable RTL. Dictionary parity, AI review, human language approval and manual assistive-technology acceptance remain
separate evidence gates.

## Demo and validation plan

The
[key/value demo source](../../../apps/demo/src/app/clr-lib/pages/key-value-inputs-demo/key-value-inputs-demo.component.ts)
implements three separately discoverable phase-1 hosts corresponding to Examples A–C. Other value controls require the
same hosts with real public imports, copyable playground code, value/status/payload output, submission, validation,
reset, disabled and readonly. The facade host must use the same FormGroup, not an independent mirror. Add a second
enabled sibling for F8 serialization checks. The key/value hosts ship with its additive value control; the Clarity
examples alone do not satisfy the installed-consumer exit condition for other lift controls.

| Gate                     | Required assertion                                                                                                                                                    | Evidence required before marking delivered                                                                             |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Angular host integration | Setup/setValue/patchValue/reset do not echo; user edit reports once; nullable/non-null default reset, disabled initial state, enable and readonly behave as specified | Actual ngModel/FormControl directives, not only manually invoked CVA callbacks                                         |
| Commit/touch             | Repeat F5/F7 with change, blur and submit; pointer selection and portaled overlays; reset then leave again                                                            | Owning value, dirty/touched, change count and submitted payload assertions                                             |
| Validation/async         | Required, intrinsic errors and caller sync/async validators compose; invalid/pending save is blocked; reset/disable/destroy cannot apply stale work                   | Controlled requests/validators and generation/race tests; no fixed sleeps                                              |
| Payload                  | Enabled group value versus raw value, wholly disabled-group exception and explicit facade filtering                                                                   | F8 host; submitted data asserted after ngSubmit synchronization                                                        |
| Types/packages           | Feature value inference and rejected invalid inputs; identical public tarball in strict Angular 21 consumers, zoneless and ZoneJS                                     | Installed declarations/templates and actual host rendering; typed FormControl alone does not certify CVA binding types |
| Browser/language         | All three browsers; keyboard/overlay focus, repeated reset, narrow light/dark states, every locale and runtime switching                                              | Route/tab scans plus real interaction journeys and separate human acceptance records                                   |

Use existing validation commands/targets and each control's implementation/browser/installed-consumer gates. Phase 2
repeats the matrix and adds native-field value/reset/availability/touch/pending/error propagation and real submissions
for every new value control in the [roadmap](../../component-roadmap.md). DOM tests do not prove SSR/hydration.

## Compatibility, rollout, and risks

Deliver Angular 21 CVA controls first. The Angular/Nx major upgrade is deferred. After it, native signal-field support
is required across new value controls. A future release decision must define Angular 21 retention and package peers;
this document changes neither pins nor public APIs. Preserve the existing key/value FormArray API until its reviewed
migration is implemented. Ordinary Angular signal inputs/state are compatible with this policy.

## Review decisions and delivery

Settled: Angular 21 first; no native Signal Forms in phase 1; native field support required after upgrade.

The maintainer accepted owner-controlled reset/disabled state, public CVA callbacks with Angular-owned `updateOn`, a
composite touch boundary, intrinsic-validator composition and explicit payload filtering at revision `1e3ae98`. The
Clarity reuse examples preserve that shared contract without claiming Clarity already satisfies every requirement.
Feature value APIs, key/value coexistence strategy and the platform upgrade's release policy stay with their reviews.

The October 19 delivery implements additive `cll-key-value-control` alongside the existing FormArray interface. Its
[feature spec](key-value-inputs-design-spec.md#evidence) records all three delivered hosts and installed Angular 21
evidence. Other approved controls must supply the same integration proof. Keep any shared bridge private until real
controls prove its shape.

## Evidence

Source inspection on October 18, 2026 at base `f021fb6` (merged #179): installed Angular 21.2.17 forms pipelines,
installed Clarity combobox and the local file-reader, key/value and facade sources linked above. Current primary
Material, NG-ZORRO and React Aria references informed the adopt/adapt decisions. Installed Angular source governs the
first delivery phase. The revised ngModel/Reactive Forms examples and composed facade variant pass local strict Angular
21.2.17 template compilation with installed Clarity 18.4.0 and the built ngx-lift declarations. This compilation does
not prove runtime form behavior, a new installed-package consumer, or all of Clarity's accessibility semantics. The
October 19 additive key/value implementation and browser/package results are recorded in its
[feature evidence](key-value-inputs-design-spec.md#evidence); this does not certify other proposed controls.
Revision-specific checks and reviewer evidence belong in the PR; future component APIs and delivery evidence remain
separate.
