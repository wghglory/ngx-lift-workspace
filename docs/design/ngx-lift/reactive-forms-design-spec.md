# Reactive Forms signals, bindings, and submission

Status: Implemented (contract audit). Owner: ngx-lift maintainers. Updated: October 17, 2026. Package: ngx-lift.
Approval: existing API; this audit does not approve new behavior.

## Applicable contracts

Typed Reactive Forms, control/proxy identity, validation/pending state, submission shaping and injector cleanup apply.
The facade is headless and does not create native signal fields, rendered controls or shared query state.

## Background

Applications need reactive form state, conditional controls and explicit submission shaping while retaining Angular's
FormGroup. Sources: [facade](../../../libs/ngx-lift/src/lib/signals/to-signal-form.ts),
[state](../../../libs/ngx-lift/src/lib/signals/form-signals.ts),
[bindings](../../../libs/ngx-lift/src/lib/signals/form-bindings.ts), and
[submission](../../../libs/ngx-lift/src/lib/signals/to-submit-value.ts).

## Terminology

The facade observes Reactive Forms; it is not a native Signal Forms field tree. Raw values include disabled controls;
submission values apply caller-selected omission/transformation. A mounted control belongs to the supplied FormGroup.

## Goals

- G1: Observe typed value/status/interaction state without replacing existing form controls.
- G2: Mount controls, bind availability/validators and watch dependencies with owner-scoped cleanup.
- G3: Produce explicit payloads that retain arrays and handle disabled/omitted values predictably.

## Non-Goals

### Not now

Native Signal Forms integration, conversion of existing groups, or a second validation framework.

### Outside this API

CVA implementation, HTTP submission, server validation, and automatic rollback of domain data.

## Use cases and acceptance

| ID  | Task                      | Initial state/action         | Outcome                                          | Failure/recovery                                      | Demo/test                                 |
| --- | ------------------------- | ---------------------------- | ------------------------------------------------ | ----------------------------------------------------- | ----------------------------------------- |
| R1  | Observe existing group    | Edit, touch, validate, reset | State follows control events                     | Pending/error states remain distinct                  | to-signal-form demo; form-signals.spec.ts |
| R2  | Toggle conditional fields | Mount, remove, remount       | Optional preservation restores value             | Missing proxies return undefined; named helpers throw | form-bindings.spec.ts; facade tests       |
| R3  | Prepare payload           | Disabled field and FormArray | Disabled included by default; arrays stay arrays | Omission is opt-in; inspect output before HTTP        | to-submit-value.spec.ts                   |

## Industry evidence and current gaps

[Angular typed forms](https://angular.dev/guide/forms/typed-forms) distinguishes `.value` from `.getRawValue()`. Adopt
that distinction; submission deliberately defaults to including disabled values. The installed Angular control event
stream drives state updates. The facade adds dynamic bindings, not a separate form owner.

## Developer learning journey and pedagogy plan

Prerequisites: An existing Angular FormGroup and basic signals; Angular remains the form owner.

| Reader task                         | Learning outcome                                                | Destination / working example                                                               |
| ----------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Observe and submit a local form     | Read value/validity and inspect the omitted-field payload       | [/ngx-lift/signals/toSignalForm](https://ngx-lift.vercel.app/ngx-lift/signals/toSignalForm) |
| Toggle and reset conditional fields | Preserve selected values and validation through control changes | Same demo; bindings/submission contracts below                                              |

Validation and delivery: The teaching flow landed in #162. Form/proxy unit cases cover behavior; installed consumers for
new controls remain a separate gate. The public API and behavior sections below own exact options and limitations;
examples introduce them after the first task.

## Public API and examples

```typescript
// Component fields, created in an Angular injection context.
import {FormControl, FormGroup} from '@angular/forms';
import {toSignalForm, toSubmitValue} from 'ngx-lift';

readonly group = new FormGroup({name: new FormControl('', {nonNullable: true})});
readonly sf = toSignalForm(this.group, {omitEmptyStrings: true});
// this.sf.fields.name.value(); this.sf.submitValue();
// One-time snapshot including disabled values:
// toSubmitValue(this.group, {includeDisabled: true});
```

State helpers are `controlValue`, `controlStatus`, `controlState`, and `formState`. Bindings are `bindControlIf`,
`bindControlDisabled`, `bindControlValidators`, `revalidateOnChange`, and `watchControl`; the facade exposes
equivalents. Bind templates to original controls or enhanced control proxies, not `sf.fields` state bundles. Named
helper calls capture the current control; dynamic facade bindings resolve mounted targets during execution.

## Behavior and architecture

An injector owns effects/subscriptions; pass `options.injector` outside injection context. Proxies preserve bound
Angular methods and cache per-control state. The facade wraps add/remove/setControl to invalidate topology reads and
restores methods on owner destruction. Use one facade owner per FormGroup: overlapping facade wrappers have no tested
out-of-order disposal contract. Bindings return EffectRef for early disposal. Control-value observation defaults to
emitted events; mutations using `emitEvent: false` do not promise a signal update.

Submission defaults: `includeDisabled=true`; omission/deep traversal are opt-in. Objects recurse into nested
objects/arrays with deep=true. A top-level FormArray/raw array always sanitizes its elements recursively, preserving
array structure. Empty-string/null filtering can compact array indices. Dates, File/Blob and class instances are
retained rather than traversed as plain objects. A transform owns its output shape. Top-level submission options
override their legacy nested counterparts.

## Clarity, accessibility, and localization

Headless APIs supply no labels or strings. Host Clarity controls own error presentation, focus, announcements and
translations. The facade preserves the form system used by Angular 21 controls.

## Demo and validation plan

Existing demo: `apps/demo/src/app/ngx-lib/pages/signals/to-signal-form/`. Regressions beside each source cover dynamic
mounting, proxy access, async status, debouncing, cross-control updates and arrays. Add a strict installed-consumer
fixture before claiming the complete dynamic/proxy contract outside workspace aliases. Native fields are deferred.

## Compatibility, rollout, and risks

Angular 21 Reactive Forms and RxJS; no new runtime dependency. Debounced observations may lag a synchronous submit; use
a direct snapshot when current synchronous data is required. Do not treat a sanitized payload as validation.

## Review decisions and delivery

Document current behavior first. Resolve overlapping facade ownership through a separate reviewed change if required; do
not silently claim independent wrappers. Follow the
[form-control policy](../clr-lift/forms-compatibility-design-spec.md).

## Evidence

Source and adjacent specs inspected on October 16, 2026; tests were not rerun for this documentation change. Coverage
pointers describe existing assertions, not an Angular 22 or native Signal Forms acceptance result.
