# Reactive Forms signals, bindings, and submission

Status: Implemented (contract and demo follow-up). Owner: ngx-lift maintainers. Updated: November 12, 2026. Package:
ngx-lift. Approval: the error-propagation contract is approved in the 2026-11-08 follow-up plan; a parallel `error`
signal or an `onError` option remains out of scope.

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

| ID  | Task                                 | Initial state/action                  | Outcome                                                                | Failure/recovery                                      | Demo/test                                 |
| --- | ------------------------------------ | ------------------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------- |
| R1  | Observe existing group               | Edit, touch, validate, reset          | State follows control events                                           | Pending/error states remain distinct                  | to-signal-form demo; form-signals.spec.ts |
| R2  | Toggle conditional fields            | Mount, remove, remount                | Optional preservation restores value                                   | Missing proxies return undefined; named helpers throw | form-bindings.spec.ts; facade tests       |
| R3  | Prepare payload                      | Disabled field and FormArray          | Disabled included by default; arrays stay arrays                       | Omission is opt-in; inspect output before HTTP        | to-submit-value.spec.ts                   |
| R4  | Handle a failed control event stream | Read a signal after its source errors | Signal read rethrows the original source error; no stale-value success | Recreate the helper or facade with a healthy control  | form-signals.spec.ts; installed consumer  |

## Industry evidence and current gaps

[Angular typed forms](https://angular.dev/guide/forms/typed-forms) distinguishes `.value` from `.getRawValue()`. Adopt
that distinction; submission deliberately defaults to including disabled values. The installed Angular control event
stream drives state updates. The facade adds dynamic bindings, not a separate form owner.

For Observable failures, adopt Angular [`toSignal`](https://angular.dev/api/core/rxjs-interop/toSignal) semantics: the
source error is rethrown when the returned signal is read. Do not silently log and keep returning the last value. Do not
add a separate `error` signal or `onError` option: Angular's adapter has no such parallel channel, and an RxJS
Observable cannot resume after its terminal error. Consumers recreate the helper or facade to recover. This concerns
errors from the observed stream, not Angular validation errors exposed through `errors()`. React's
[`useSyncExternalStore`](https://react.dev/reference/react/useSyncExternalStore) likewise reads an external-store
snapshot synchronously; it does not define a separate asynchronous source-error signal. Clarity, Angular Material and
NG-ZORRO form controls present validation and field feedback, but do not change this library's Observable-to-Signal
contract.

**When an error can occur.** The observed sources are Angular's control event streams (`events`, `valueChanges`,
`statusChanges`) plus the library's own `map` / `distinctUntilChanged` / `debounceTime` pipeline. Angular's stock
`AbstractControl` implementations never call `error()` on these streams, so ordinary form usage never enters this path.
An error notification can only come from (1) a non-standard or substituted control whose event stream errors, or (2) an
exception thrown inside the pipeline — `getRawValue()` or `form.value` in `map`, a caller's `omitIf` or `transform`
callback in `formSubmitValue`, or the `isEqual` comparator. RxJS converts a thrown operator callback into an error
notification. Validation failures, rejected async validators and wrong options do not use this channel.

**Runtime effect and recovery.** An RxJS error is terminal: the subscription closes, so no later emission can clear it.
Angular's `computed` caches the thrown error, so every read of that signal — and of derived signals such as `valid`,
`dirty` and `rawValue` — keeps rethrowing the original error until the helper or facade is recreated with a healthy
control. Read from a template or effect, it surfaces through Angular's `ErrorHandler` and can break that render cycle.
If nobody reads the signal, the error is silent; the library no longer logs it. The original audit suggestion (C2) to
add an error signal or `onError` option is rejected: neither can recover from a terminated stream.

## Developer learning journey and pedagogy plan

Prerequisites: An existing Angular FormGroup and basic signals; Angular remains the form owner.

| Reader task                         | Learning outcome                                                  | Destination / working example                                                               |
| ----------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Observe and submit a local form     | Read value/validity and inspect the omitted-field payload         | [/ngx-lift/signals/toSignalForm](https://ngx-lift.vercel.app/ngx-lift/signals/toSignalForm) |
| Toggle and reset conditional fields | Preserve selected values and validation through control changes   | Same demo; bindings/submission contracts below                                              |
| Switch a validation policy          | Replace validators from a signal without losing the current value | Same demo; `bindValidators` playground and API reference                                    |

Validation and delivery: The teaching flow landed in #162. Form/proxy unit cases cover behavior; the strict installed
consumer remains the gate for packed public types and runtime behavior. The public API and behavior sections below own
exact options and limitations; examples introduce them after the first task.

## Public API and examples

```typescript
// Component fields, created in an Angular injection context.
import {FormControl, FormGroup} from '@angular/forms';
import {toSignalForm, toSubmitValue} from 'ngx-lift';

readonly group = new FormGroup({name: new FormControl('', {nonNullable: true})});
readonly sf = toSignalForm(this.group, {omitEmptyStrings: true});
// this.sf.fields.name.value(); this.sf.submitValue(); // reads rethrow a terminal stream error
// One-time snapshot including disabled values:
// toSubmitValue(this.group, {includeDisabled: true});
```

A terminal error in an observed control event stream is rethrown on every read of the affected signal and of its derived
signals. Recovery requires a new facade with a healthy control; see
[Compatibility, rollout, and risks](#compatibility-rollout-and-risks).

State helpers are `controlValue`, `controlStatus`, `controlState`, and `formState`. Bindings are `bindControlIf`,
`bindControlDisabled`, `bindControlValidators`, `revalidateOnChange`, and `watchControl`; the facade exposes
equivalents. Bind templates to original controls or enhanced control proxies, not `sf.fields` state bundles. Named
helper calls capture the current control; dynamic facade bindings resolve mounted targets during execution.

Validator binding has three public surfaces: the facade method, the enhanced control method and the standalone helper.
Each accepts one `ValidatorFn`, an array, `null`, a `Signal`, or a zero-argument getter and returns an `EffectRef`.

```typescript
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {bindControlValidators, toSignalForm} from 'ngx-lift';

readonly policyForm = new FormGroup({
  projectCode: new FormControl('', {nonNullable: true}),
  strict: new FormControl(false, {nonNullable: true}),
});
readonly policySf = toSignalForm(this.policyForm);

constructor() {
  // Named control: resolves the mounted target during each effect run.
  this.policySf.bindValidators('projectCode', () =>
    this.policySf.fields.strict.value()
      ? [Validators.required, Validators.minLength(6), Validators.pattern(/^[a-z0-9-]+$/)]
      : null,
  );
  // Equivalent on an enhanced control or as a standalone helper:
  // this.policySf.controls.projectCode.bindValidators(() => ...);
  // bindControlValidators(this.policyForm.controls.projectCode, () => ...);
}
```

`BindControlValidatorsOptions` defaults to `emitEvent: true` and `updateValueAndValidity: true`; `injector` defaults to
the current injection context. Each change calls `setValidators` with the entire active set, so previously attached
synchronous validators on that control are replaced. The control value and pristine/touched state are preserved, and
validity is recomputed immediately so error signals and rendered messages follow the policy.

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

### Validator-binding playground messages and accessible names

The playground owns the `toSignalForm.validators*` and `toSignalForm.apiBindValidators*` messages: title, description,
policy toggle label and helper, project-code label, placeholder, required/minimum-length/format validation errors,
strict and relaxed rule status, valid and invalid state badges, and the state inspector title and description. The reset
button reuses `toSignalForm.reset`. Every message ships in en, zh-CN, zh-TW, de, es, fr, ja, ko, nl, pt-BR and ru;
independent human language acceptance for these new strings is a separate gate.

The API guide cards are named after their APIs rather than numbered patterns: the section title is `Form API Guides`,
each card title leads with its API name, and `bindValidators` is the third card after `bindIf` and `bindDisabled`,
pointing to the interactive playground above. The `toSignalForm.apiGuide*` section and card titles plus the validator
card description ship in all eleven locales; independent human language approval for them is an open gate too.

A labelled `clrToggle` switches the policy with keyboard Space and a labelled `clrInput` accepts typed values, blur,
clearing and correction. Clarity containers own programmatic labels, descriptions and validation-error associations; IDs
are unique on the page. The active rule is a `role="status"` region that changes only when the policy changes. The
validity badge and state inspector are plain visible text and do not repeat announcements on every keystroke. Reset
restores the relaxed policy and an empty value. Automated accessibility scans, the keyboard journey, all-locale
rendering and both themes cover the changed UI; the manual assistive-technology waiver remains a waiver, not a pass.

## Demo and validation plan

Existing demo: `apps/demo/src/app/ngx-lib/pages/signals/to-signal-form/`. Regressions beside each source cover dynamic
mounting, proxy access, async status, debouncing, cross-control updates, arrays and signal-driven validator replacement.
A dedicated `bindValidators` playground replaces the validator set from a policy control and shows localized validation
errors, the announced active rule, a validity badge, a state inspector and reset. The five API reference tables are a
curated, type-accurate subset, including `sf.bindValidators`: parameters are shown separately from `sf.*` return
members, and `to-signal-form.model.ts` remains authoritative for the complete surface. A focused demo spec asserts exact
row names and types so the #145-era fictional rows cannot return. The browser suite covers the keyboard journey, API
rows, all supported locales and both themes. The strict installed-consumer fixture
`tools/package/fixtures/to-signal-form-browser.mjs` verifies packed public types, dynamic-control lifecycle, both
validator-binding surfaces and error propagation in zoneless and ZoneJS modes. Native fields are deferred.

## Compatibility, rollout, and risks

Angular 21 Reactive Forms and RxJS; no new runtime dependency. Debounced observations may lag a synchronous submit; use
a direct snapshot when current synchronous data is required. Do not treat a sanitized payload as validation.

**Migration:** the internal stream-to-signal helper previously logged a source error and kept the last value. Reads now
rethrow that error, matching `formSubmitValue`, which already used Angular `toSignal`. This is a behavioral change, not
a silent bug fix, and is recorded under `### Changed` in the changelog. Handle the error at the read site or recreate
the helper/facade with a healthy control; the library exposes no recovery channel. Stock Angular controls do not reach
this path. Independent human language and assistive-technology acceptance for the demo changes remain separate gates.

## Review decisions and delivery

Document current behavior first. Resolve overlapping facade ownership through a separate reviewed change if required; do
not silently claim independent wrappers. Follow the
[form-control policy](../clr-lift/forms-compatibility-design-spec.md). The audit's C2 suggestion to add an `error`
signal or `onError` option was rejected: an RxJS error terminates the stream, so neither can recover, and Angular's
adapter has no parallel channel.

## Evidence

Source and adjacent specs inspected on November 8, 2026. Signal reads propagate terminal source-stream errors in line
with Angular `toSignal`. `form-signals.spec.ts`, `to-submit-value.spec.ts`, `to-signal-form.spec.ts` and the packed
`to-signal-form-browser.mjs` fixture cover value/status/event/rawValue pipelines, caller callback failures, derived
signals, persistence, silence when unread and teardown in zoneless and ZoneJS modes. Independent human language approval
and a manual assistive-technology decision remain separate gates. This does not establish Angular 22 or native Signal
Forms acceptance.

Validator-binding demo evidence (November 12, 2026): `nx test demo` passes 306 unit cases including validator
replacement, error recovery and reset; `i18n-check` reports zero errors with 2335 keys complete in all eleven locales;
the production demo build succeeds; `signal-forms.spec.ts` passes 54 browser cases across Chromium, Firefox and WebKit,
covering the keyboard journey, API reference rows, API guide naming and order, all-locale rendering and light/dark
accessibility checks; the route-derived `accessibility.spec.ts` scans pass for this page in both themes. After
rebuilding `ngx-lift` and packing the tarball, `to-signal-form-browser.mjs` also passes the facade method and the
standalone helper in zoneless and ZoneJS modes. Independent human language approval for the new and rewritten strings is
not yet recorded, and the 2026-11-10 assistive-technology waiver is not a pass. Full `verify:packages` could not
complete because its isolated `pnpm install` cannot reach `registry.npmjs.org` in this environment (see the mirror
decision in G-45). The packed-consumer harness used the same rebuilt tarball and both rendering modes with workspace
dependencies linked locally.
