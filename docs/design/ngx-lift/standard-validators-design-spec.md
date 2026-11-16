# Standard Reactive Forms validators design specification

Status: Approved — maintainer API approval recorded 2026-11-16 (implementation and CI complete). Owner: Derek Wang.
Updated: 2026-11-16. Approval: granted for the four signatures, two supporting types and error keys in this pull
request. Package: ngx-lift. The contract is approved for release; publication and the independent language review of the
demo strings remain separate steps.

## Applicable contracts

This feature is a set of headless, synchronous Angular `ValidatorFn` factories. The contracts that apply are the
headless utility input/output contract, the Reactive Forms integration contract, and the demo UI's accessibility and
localization contract.

- **Value/form integration:** each function returns a `ValidatorFn`; single-control validators are attached to a
  `FormControl` and group validators to a `FormGroup`. Error keys are documented below. There is no CVA, no rendered
  value control, and no signal-field state to own.
- **Rendered UI:** the library owns no strings, labels, DOM, focus or ARIA. The demo pages own all visible messages, so
  the [acceptance contract](../../guides/accessibility-and-localization.md) applies to them: semantic Clarity controls,
  programmatic labels, keyboard journeys, announcements, light/dark and narrow layouts, and all 11 locales.
- **Reactive/async APIs:** not applicable. Validators are synchronous and pure; there is no subscription, race,
  cancellation or disposal.
- **Shared state/cache:** not applicable. No state survives a single validation call.
- **Other utilities:** input/output, platform (browser and SSR), and configuration validation are specified in
  [Behavior and architecture](#behavior-and-architecture). See also the
  [Reactive Forms contract](reactive-forms-design-spec.md) and the
  [forms compatibility contract](../clr-lift/forms-compatibility-design-spec.md).

## Background

PR #138 (opened 2026-10-10) proposed ten exports in eight validator modules plus eight demo pages. Main has since moved
to lazy `loadComponent` routes, fully translated demo pages, an 11-locale dictionary checker, and route-derived
accessibility and localization browser suites. Rebasing the PR produced a conflict in `app.routes.ts`; the initial
two-axis review found no design spec, no CHANGELOG entry, no translations, no E2E coverage, eager routes, Tailwind
classes, hardcoded English, and demo controls whose error keys and factory bindings did not match the library. Several
implementations also mutated child controls from inside a `ValidatorFn`.

The smallest useful delivery is a small, consistent set of validators that Angular does not already provide, with a
single error-key convention, pure semantics, rigorous unit tests, and one properly documented demo page per export. This
document replaces the missing specification and records the scope decisions from that review.

## Terminology

| Term              | Meaning in this API                                                                                     |
| ----------------- | ------------------------------------------------------------------------------------------------------- |
| Empty value       | `null`, `undefined` or `''`. Valid by default; `Validators.required` makes it mandatory.                |
| Pure validator    | Returns an error object or `null`; never calls `setErrors`, `setValue` or `markAsTouched`.              |
| Group-level error | An error on the `FormGroup` (`form.hasError(...)`); child controls keep their own independent validity. |
| Error key         | The single camelCase key in the returned `ValidationErrors`; the UI owns the translated message.        |
| File selection    | A `FileList`, an array of files, a single file, or a single file name as a string.                      |

## Goals

- **G1:** Application developers can validate integers, JSON text, file extensions, and two common cross-field
  relationships with one import each, without writing coercion-prone or side-effectful validators.
- **G2:** Every validator has a documented, stable error key and returns only that key, so error rendering and i18n stay
  entirely in the application. `ngx-lift` remains free of UI strings.
- **G3:** The demo app teaches each API with a working, localized, keyboard-accessible playground and a runnable
  example, and every new route is covered by the repository's route-derived scans.

## Non-Goals

### Not now

- DNS-1123 / Kubernetes resource-name validation (`dns1123SubdomainValidator`, `k8sNameValidator`): a domain-specific
  naming standard expressible with `Validators.pattern` plus `Validators.maxLength`. The PR's two implementations
  disagreed about case handling, and neither enforced the documented 63-character label limit. It deserves a separate
  Kubernetes-focused proposal with its own use cases, not a place in this general-purpose increment.
- Message composition (`composeValidators`, `ValidationRule`): `Validators.compose` already combines validators, and
  injecting a `message` string into a headless error object mixes UI/i18n concerns into the library. A private helper
  with the same name already exists in `libs/ngx-lift/src/lib/utils/form.util.ts`.
- Whitespace and ASCII pattern helpers (`noSpaceAllowed`, `onlyAsciiCharsAllowed`): one-line `Validators.pattern` calls.
  Their names read as predicates, their error keys describe the rule rather than the failure, and the ASCII regex
  admitted control characters. Documented as `Validators.pattern` recipes instead.
- Native Angular Signal Forms integration: deferred until the Angular/Nx platform upgrade, as recorded in the
  [component roadmap](../../component-roadmap.md). These validators are plain `ValidatorFn`s and work with the existing
  `toSignalForm` facade, which is still Reactive Forms.

### Outside this API

- JSON schema/type validation, password strength policy, file content or MIME inspection, asynchronous or server-side
  validation, and translation of error messages. Applications compose these with their own rules and dictionaries.

## Use cases and acceptance

| ID  | Actor and task                                    | Initial state             | Action                                 | Observable outcome                                        | Failure/recovery                                       | Demo/test                                                                 |
| --- | ------------------------------------------------- | ------------------------- | -------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------- |
| UC1 | Developer validates a replica count               | Empty required text field | Enter `3`, then `3.5`, then clear      | VALID, then `invalidInteger`, then `required`             | Correct the value; reset restores the empty state      | `/ngx-lift/validators/integer`, `integer.validator.spec.ts`               |
| UC2 | Developer validates a JSON payload editor         | Empty textarea            | Paste valid JSON, then malformed JSON  | VALID, then `invalidJson`                                 | Fix the syntax; the control value is untouched         | `/ngx-lift/validators/json`, `json.validator.spec.ts`                     |
| UC3 | Developer constrains an upload to `.png` / `.jpg` | No selection              | Choose an accepted and a rejected file | VALID, then `invalidFileExtension`                        | Choose a valid file; clear removes the selection       | `/ngx-lift/validators/file-extension`, `file-extension.validator.spec.ts` |
| UC4 | Developer validates a password confirmation       | Both fields empty         | Enter matching, then differing values  | No error, then group error `valuesMismatch`               | Child `required`/`minlength` errors stay intact        | `/ngx-lift/validators/same-value`, `same-value.validator.spec.ts`         |
| UC5 | Reader switches the demo language on any new page | English                   | Choose another supported locale        | All owned labels, errors and prose render translated text | Missing key never appears; long labels do not overflow | `localization-coverage.spec.ts`, `pnpm run i18n:check`                    |

## Industry evidence and current gaps

| Existing implementation / primary source                                                                                                                                                                              | Verified behavior                                                                                                                                                                                        | Adopt, adapt, or reject | Our gap and reason                                                                                                                        |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Angular 21 `Validators` (`@angular/forms`, installed dependency)                                                                                                                                                      | `compose`, `required`, `minLength`, `maxLength`, `min`, `max`, `pattern` cover composition, length, range and regex checks                                                                               | Adapt                   | Provides the `ValidatorFn`/`ValidationErrors` convention and empty-value semantics; no JSON, file-name or cross-field equality validator. |
| Angular Reactive Forms cross-field validation guidance (validator attached to a group)                                                                                                                                | Group validators read child controls and return errors on the group                                                                                                                                      | Adopt                   | PR #138 instead called `setErrors` on children, which can erase other errors and re-enter validation.                                     |
| ngx-lift existing validators (`date-range`, `intersection`, `unique`, `url`, `ifValidator`)                                                                                                                           | Mix of factories and bare functions; error keys are camelCase with `true` or structured values; empty values are generally valid                                                                         | Adapt                   | Adopt the `true` error values and `ValidatorFn` factories; keep the new error keys consistently `invalid*`/relationship-named.            |
| Clarity, Angular Material, NG-ZORRO component libraries                                                                                                                                                               | Publish rendered controls and form-field error presentation, not standalone validator functions                                                                                                          | Reject as a comparison  | No comparable headless API to adopt; presentation stays in the demo's Clarity containers.                                                 |
| Schema/validator libraries (Zod, Yup) and form libraries with resolver-based validation                                                                                                                               | Validate typed schemas with rich error objects and a resolver/DSL                                                                                                                                        | Reject the DSL          | A schema resolver would add a runtime dependency and a configuration language for four simple rules.                                      |
| Angular Reactive Forms cross-field guide, [GOV.UK Error summary](https://design-system.service.gov.uk/components/error-summary/), [W3C WAI User Notifications](https://www.w3.org/WAI/tutorials/forms/notifications/) | Cross-field errors are announced at form level and associated with the field through `aria-describedby`; Ant Design, React Hook Form and Angular Material also render the message on the dependent field | Adapt                   | Render one non-closable `cll-alert` and associate it with the confirmation control; do not duplicate the message in a second live region  |

No runtime dependency is added. Browser `JSON.parse`, `Number`, `String.prototype.endsWith` and structural file-name
access are sufficient; no DOM global is required at validation time.

## Developer learning journey and pedagogy plan

| Reader task / prerequisites                 | Learning outcome                                                                   | Destination / page type                                | Working example and expected result                                                   | Validation                                         |
| ------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------- | -------------------------------------------------- |
| Knows `FormControl`; needs an integer field | Attach `integerValidator()` and read `invalidInteger`                              | `/ngx-lift/validators/integer` (tutorial)              | Playground with required + integer rules, live status, clear action and complete code | Unit spec, browser E2E, both themes, all locales   |
| Needs to accept JSON text                   | Distinguish JSON syntax from schema validation                                     | `/ngx-lift/validators/json` (tutorial)                 | Paste valid/invalid payloads; see `invalidJson`; complete runnable example            | Unit spec, E2E                                     |
| Needs to constrain a file input             | Normalize extensions and handle a `FileList` or a name string                      | `/ngx-lift/validators/file-extension` (how-to)         | Choose files, see the rejected name, compound-suffix example                          | Unit spec, E2E                                     |
| Knows `FormGroup`; needs cross-field rules  | Understand group-level errors, purity and `form.hasError(...)`                     | `/ngx-lift/validators/same-value` (how-to + reference) | Two controls, live group error, reset, custom control-name example                    | Unit spec, E2E                                     |
| Needs an exact signature or error key       | Look up required arguments, empty-value behavior and error keys without a tutorial | API Reference section at the end of each page          | Signature code block, parameter list for factories with parameters, and returns list  | `documentation-standards.md`, example-format check |

## Public API and examples

Four functions and two supporting types are exported from `ngx-lift`. The functions are factories (call them) and allow
empty values. Every error object contains exactly one key with value `true`.

| Export                                                                                 | Applies to    | Error key              | Rejects                                                                   |
| -------------------------------------------------------------------------------------- | ------------- | ---------------------- | ------------------------------------------------------------------------- |
| `integerValidator(): ValidatorFn`                                                      | `FormControl` | `invalidInteger`       | Non-safe-integer values, decimals, exponent/hex strings, booleans, arrays |
| `jsonValidator(): ValidatorFn`                                                         | `FormControl` | `invalidJson`          | Non-string values and text that `JSON.parse` cannot parse                 |
| `fileExtensionValidator(allowedExtensions: string \| readonly string[]): ValidatorFn`  | `FormControl` | `invalidFileExtension` | Any selected file whose name does not end with an allowed suffix          |
| `sameValueValidator(firstControlName: string, secondControlName: string): ValidatorFn` | `FormGroup`   | `valuesMismatch`       | Two non-empty values that differ under strict equality                    |

Supporting types exported by `file-extension.validator.ts` (not factories, no error keys):

| Type            | Purpose                                                                                                          |
| --------------- | ---------------------------------------------------------------------------------------------------------------- |
| `NamedFile`     | Structural `{readonly name: string}` shape; `File` satisfies it without a browser dependency.                    |
| `FileSelection` | `FileList \| readonly NamedFile[] \| NamedFile \| string \| null`; the accepted `FormControl` value for uploads. |

Both are part of the public surface and are listed in the CHANGELOG; they were added because `FileSelection` gives
consumers a typed control value and because the validator reads only `name`.

Minimal example (imports and setup are complete):

```typescript
import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {integerValidator, jsonValidator} from 'ngx-lift';

@Component({
  selector: 'app-settings-form',
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form">
      <label for="replicas">Replicas</label>
      <input id="replicas" formControlName="replicas" />
      <label for="payload">Payload</label>
      <textarea id="payload" formControlName="payload"></textarea>
    </form>
  `,
})
export class SettingsFormComponent {
  form = new FormGroup({
    replicas: new FormControl('', [Validators.required, integerValidator()]),
    payload: new FormControl('', [Validators.required, jsonValidator()]),
  });
}
```

Advanced example (group validator, custom control names, file selection, submitted data):

```typescript
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FileSelection, fileExtensionValidator, sameValueValidator} from 'ngx-lift';

const credentials = new FormGroup(
  {
    newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    repeatedPassword: new FormControl('', [Validators.required]),
  },
  {validators: [sameValueValidator('newPassword', 'repeatedPassword')]},
);
const attachment = new FormControl<FileSelection>(null, [
  Validators.required,
  fileExtensionValidator(['.png', 'jpg', '.tar.gz']),
]);

// credentials.hasError('valuesMismatch') and attachment.hasError('invalidFileExtension') are
// the values the view renders. On submit, read form.getRawValue(); validators never change control values.
```

**Form applicability.** These are headless utilities, not value controls: there is no CVA and no value type to bridge.
They work with Angular 21 `ngModel` (as validators supplied by the application) and typed Reactive Forms as shown.
Reactive Forms observed through the existing `toSignalForm` facade is still Reactive Forms and needs no new API. Native
signal-field support is required for new value controls after the deferred platform upgrade; it is not applicable to
these `ValidatorFn`s and is recorded as a non-goal here rather than claimed as supported.

## Behavior and architecture

- **Purity:** every implementation is a pure function of `control.value` (or of the named child controls of a group). No
  implementation calls `setErrors`, `setValue`, `markAsTouched` or `updateValueAndValidity`. Group errors therefore
  never overwrite a child's `required` or `minlength` errors and cannot re-enter validation.
- **Empty values:** `null`, `undefined` and `''` are valid. Applications use `Validators.required` for mandatory fields.
  A whitespace-only string is not empty: `integerValidator` and `jsonValidator` reject it.
- **Numeric parsing:** `validator-value.util.ts` is an internal, non-exported helper. `parseSafeInteger` accepts safe
  integers and signed decimal integer strings. Surrounding whitespace on a numeric string is ignored, so `'  12  '` is
  an integer; a whitespace-only string is not empty and is rejected. Hexadecimal strings, booleans, arrays, `NaN` and
  `Infinity` are never silently coerced to `0`.
- **File selection:** the validator reads only the `name` property. `FileList`, arrays, single files and single name
  strings are accepted; suffixes are lowercased, may be written with or without a leading dot, and may be compound
  (`.tar.gz`). An empty selection is valid. Configuration errors throw when the factory is called, so a broken
  configuration cannot ship as a validator that always fails.
- **Group validator:** `group.get(name)` accepts nested paths. A missing, disabled or empty control produces `null`; the
  caller's other validators own those states. A disabled child keeps its own value but is excluded from the group's
  value, so comparing it would leave an error the user cannot clear.
- **Lifecycle, SSR and security:** no subscriptions, timers, globals, DOM APIs, network access or mutable module state.
  `FileList` is only a TypeScript type; no `File` constructor is invoked, so server-side rendering is safe. `JSON.parse`
  is used for syntax only and never evaluates input. No new runtime dependency is introduced.

## Clarity, accessibility, and localization

The library owns no visible or announced strings. Every message below is owned by a demo page, defined in all 11
supported dictionaries (`en`, `zh-CN`, `zh-TW`, `de`, `es`, `fr`, `ja`, `ko`, `nl`, `pt-BR`, `ru`), and rendered through
`TranslatePipe`. API names, error keys and code samples remain untranslated identifiers.

### Message inventory

| Category                         | Keys / source                                                                                                                                                              | Rendered by                                        | Independent language review                  |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | -------------------------------------------- |
| Section headings                 | `common.liveDemo`, `common.examples`, `common.apiReference`                                                                                                                | `<h2>`                                             | pre-approved shared keys, no new strings     |
| Example headings                 | `standardValidators.example1`, `standardValidators.example2`                                                                                                               | `<h3>`                                             | pending (new strings)                        |
| Page overviews, playground prose | `<ns>.overview`, `<ns>.playgroundTitle`, `<ns>.playgroundDescription`, `<ns>.example1Desc`, `<ns>.example2Desc`                                                            | `<p>`, `app-demo-playground` inputs                | pending (new strings)                        |
| Programmatic control labels      | `<ns>.firstLabel`, `<ns>.secondLabel` (group page)                                                                                                                         | `<label for>`                                      | pending (new strings)                        |
| Required error                   | `common.required`                                                                                                                                                          | `clr-control-error *clrIfError="'required'"`       | pre-approved shared key                      |
| Validator errors                 | `<ns>.firstError`, `<ns>.groupError`, `sameValueValidator.minLengthError`                                                                                                  | `clr-control-error` and a non-closable `cll-alert` | pending (new strings)                        |
| File selection errors and names  | `fileExtensionValidator.firstError`; file names are caller data                                                                                                            | `role="status"` region and `<ul>`                  | error text pending; names are not UI strings |
| Status announcements             | `standardValidators.statusValid`, `.statusInvalid`, `.statusDisabled`                                                                                                      | `<output aria-live="polite">`                      | pending (new strings)                        |
| Action labels                    | `common.clear`, `standardValidators.disableForm`, `standardValidators.enableForm`                                                                                          | `<button>`                                         | clear pre-approved; toggle labels pending    |
| API reference prose              | `common.signature`, `common.parameters` (parameterized factories only), `common.returns`, `<ns>.summary`, `<ns>.paramFirst`, `.paramSecond` (where applicable), `.returns` | `<h4>`, `<p>`, `<ul>`                              | pending (new strings)                        |

`<ns>` is one of `integerValidator`, `jsonValidator`, `fileExtensionValidator`, `sameValueValidator`. Independent
language reviewer: not yet assigned; approval date: not recorded. This is an open gate, not a completed acceptance step.

- Each page uses `cll-page-container`, Clarity form containers with programmatic `<label for>` bindings, `cds-layout`
  spacing and `app-demo-playground`; no Tailwind utility classes.
- The cross-field error is announced once by a non-closable, small `cll-alert` (`role="alert"`), inside a stable wrapper
  with `data-testid` and an ID. The confirmation control sets `aria-describedby` to that ID only while the group error
  exists, so assistive technology reads the message when the field receives focus without rendering a second visible
  message or a duplicate live region. Clarity keeps ownership of `aria-invalid` on child controls.
- The password page also renders the `minlength` child error so UC4 shows that group and child errors coexist. Each
  control keeps a unique ID, visible focus, keyboard operation, and a translated error message.
- Reset/clear and disable/enable actions are available on all four pages, with unit tests for the state changes; long
  translated labels are exercised by the 11-locale route-derived scans. Light/dark themes, narrow (390px) layouts, and
  runtime language switching are covered by the route-derived browser suites and the new E2E locale-switch test.
- The file page also clears and disables its native `input[type=file]`. Reactive Forms does not bind file inputs, so a
  reset without clearing the DOM value would keep the old selection visible and leave the input interactive while the
  form is disabled. The clear and disabled states have unit and browser coverage.
- The four pages intentionally repeat the same small form/state scaffolding; `documentation-standards.md` requires page
  structure to stay consistent, so no shared demo base class is introduced.
- **Independent human acceptance:** automated dictionary, accessibility, keyboard and consumer checks are recorded in
  [Evidence](#evidence). Independent language review remains an open gate; the 2026-11-10 maintainer waiver covers
  manual assistive-technology assessment, and no human language approval is claimed for these new strings.

## Demo and validation plan

| Use case | Demo route                            | Unit tests                         | Browser coverage                                                                                                          |
| -------- | ------------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| UC1      | `/ngx-lift/validators/integer`        | `integer.validator.spec.ts`        | `standard-validators.spec.ts`                                                                                             |
| UC2      | `/ngx-lift/validators/json`           | `json.validator.spec.ts`           | `standard-validators.spec.ts`                                                                                             |
| UC3      | `/ngx-lift/validators/file-extension` | `file-extension.validator.spec.ts` | `standard-validators.spec.ts`                                                                                             |
| UC4      | `/ngx-lift/validators/same-value`     | `same-value.validator.spec.ts`     | `standard-validators.spec.ts`                                                                                             |
| UC5      | every route above                     | `pnpm run i18n:check`              | `standard-validators.spec.ts` (locale presets + runtime switch), `localization-coverage.spec.ts`, `accessibility.spec.ts` |

All routes are lazy (`loadComponent`) so the route-derived inventory adds them to the accessibility, localization and
layout scans automatically. Each page shows real control state, required and validator errors, a clear/reset action, and
a complete runnable example with imports. Focused checks during development are `pnpm nx test ngx-lift`,
`pnpm nx test demo`, `pnpm run i18n:check`, `pnpm run lint`, `pnpm run typecheck`, and `pnpm run format:check`; release
validation is `pnpm run validate` plus `pnpm nx run demo-e2e:e2e`, following [the command reference](../../commands.md).
Coverage thresholds stay at the three `vite.config.mts` values.

## Compatibility, rollout, and risks

- **Dependencies:** none added. Alternatives (schema libraries, file-type sniffing packages) were rejected because
  browser APIs cover the use cases and add installation, bundle, licensing and maintenance cost.
- **Platform:** Angular 21 and the existing `@angular/forms` peer range. No entry-point, package `exports` or build
  change. Single-control validators work in SSR; `fileExtensionValidator` references `FileList` only as a type.
- **Compatibility:** additive exports only; no existing public API changes. Error keys are new and therefore have no
  consumers. The removed PR #138 exports were never merged, so there is no migration.
- **Bundle:** four small pure functions plus one internal helper; no lazy-loading requirement and no bundle risk.
- **Risks:** group-level errors are less ergonomic than an error placed on the confirmation control; mitigated by one
  non-closable `cll-alert` announced with `role="alert"` and an `aria-describedby` association on the confirmation
  control. `JSON.parse` accepts any JSON value, so schema checking remains the caller's job. Rollback is the removal of
  the four exports and demo routes, with no data or persisted state involved.
- **API approval:** recorded by the maintainer on 2026-11-16 for the four signatures, two supporting types and error
  keys. Owner: Derek Wang.

## Review decisions and delivery

| Decision                                       | Alternative                                       | Recommendation                                                              |
| ---------------------------------------------- | ------------------------------------------------- | --------------------------------------------------------------------------- |
| Keep 4 validators, drop 6 exports from PR #138 | Ship all 10 original exports                      | Keep the focused set; record the rest as "Not now" with reasons             |
| Pure group-level errors                        | `setErrors` on children (original PR)             | Pure; child errors and validity belong to their own validators              |
| `invalid*` error keys with `true` values       | PR's mixed `notInteger`/`json`/`invalidExtension` | Consistent keys; the UI owns translated messages                            |
| One demo page per export, all locales          | One consolidated page or English-only pages       | Per-API pages match the existing Validators nav and docs standards          |
| Strict integer/JSON/file parsing               | `Number()` coercion and `split('.').pop()`        | Strict; tests cover the coercion and compound-suffix traps                  |
| One `cll-alert` plus `aria-describedby`        | Duplicate visible error on the confirmation field | One announced message; no duplicate live region or wording drift            |
| Generic `sameValueValidator` name              | Domain-specific `passwordMatchValidator`          | Name the capability; required control-name arguments make any pair explicit |

Increments: (1) this specification and API proposal; (2) library implementation, unit tests and exports; (3) spec index,
CHANGELOG, demo pages, routes, navigation and dictionaries; (4) browser E2E and the second review round; (5) a third
review follow-up covering disabled-child group semantics, the native file-input clear/disable flow, the public API
documentation and the associated regression tests; (6) a fourth review follow-up that narrows the public surface to four
factories and renders the cross-field error with `cll-alert` plus `aria-describedby`; (7) a fifth review follow-up that
generalizes the cross-field validator to `sameValueValidator` with required `firstControlName` and `secondControlName`
arguments and the `valuesMismatch` error key. Evidence below is updated with actual results; planned checks are not
evidence.

## Evidence

Scope: rebased branch `feat/form-validators` onto `main` (`fc114be`), full staged diff versus `main`, 2026-11-15. These
are the recorded local results, not claimed CI results. The 2026-11-16 third- and fourth-review follow-up results are
recorded separately below.

| Check                                                                      | Result                                                                                                                                              |
| -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm run i18n:check`                                                      | Pass — 2417 keys; all 11 dictionaries complete; every used key exists in English                                                                    |
| `pnpm run typecheck`, `pnpm run lint`, `pnpm run format:check`             | Pass                                                                                                                                                |
| `node tools/demo/format-examples.mjs`, `git diff --check HEAD`             | Pass (two-space example indentation, no whitespace errors)                                                                                          |
| `pnpm nx test ngx-lift`, `pnpm nx test demo`, `pnpm run test:coverage`     | Pass — 4 new validator specs, 4 demo component specs; coverage thresholds unchanged                                                                 |
| `pnpm run test:tools`, `pnpm run bundle:check`, `pnpm run verify:packages` | Pass                                                                                                                                                |
| `pnpm nx build ngx-lift`, `pnpm nx build demo --configuration=production`  | Pass                                                                                                                                                |
| `pnpm nx run demo-e2e:e2e --args="src/standard-validators.spec.ts …"`      | Firefox: 6/6 passed (4 journeys, locale presets, runtime switch, `expectAccessible`). Chromium/WebKit: could not launch locally                     |
| `pnpm run validate`                                                        | Not completed — blocked at `demo:build:production` by the environment `safe-delete` bulk-cleanup guard; re-running the build target alone succeeded |

### Third review follow-up (2026-11-16)

Scope: the follow-up diff on `feat/138-standard-validators` against `d9888cc`, covering disabled-child group semantics,
the native file-input clear/disable flow, public API documentation, JSDoc tags and regression tests. Local results:
`pnpm nx test ngx-lift` (59 files / 951 tests) and `pnpm nx test demo` (90 files / 343 tests) pass;
`pnpm run format:check`, `pnpm run i18n:check`, `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:tools`,
`node tools/demo/format-examples.mjs`, `pnpm nx build ngx-lift`, `pnpm nx build demo --configuration=production`,
`pnpm run bundle:check`, `pnpm run verify:packages` and `git diff --check` pass.

`pnpm run validate` reached `test:coverage`: the container's `safe-delete` bulk-cleanup guard blocks removal of stale
`coverage/` output, and after that output is moved aside unrelated timing-sensitive demo specs fail under coverage
instrumentation. The same demo suite passes without coverage, and the coverage job is skipped on the PR path. Browser
E2E cannot launch locally: Firefox now fails with a missing `libgtk-3.so.0`, while Chromium and WebKit remain
unavailable (fontconfig), so the extended `standard-validators.spec.ts` assertions are CI gates. Nx Cloud remote cache
is unavailable (organization disabled, HTTP 401); these are local results. Independent language review remains an open
gate; the 2026-11-10 maintainer waiver covers manual assistive-technology assessment. Maintainer API approval was
recorded later on 2026-11-16 (see below).

### Fourth review follow-up (2026-11-16)

Scope: the maintainer's decision to render cross-field errors with one `cll-alert` associated through
`aria-describedby`, and to narrow the public surface to four validator factories. The removed route, page, exports,
internal helper, dictionary keys, example code, unit specs and browser assertions are gone from the branch; no new
translation keys or runtime dependencies were introduced. Local results: `pnpm nx test ngx-lift` (58 files / 945 tests)
and `pnpm nx test demo` (89 files / 340 tests) pass; `pnpm run i18n:check` (2417 keys), `pnpm run format:check`,
`node tools/demo/format-examples.mjs`, `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:tools`,
`pnpm nx build ngx-lift`, `pnpm nx build demo --configuration=production`, `pnpm run bundle:check`,
`pnpm run verify:packages` and `git diff --check` pass. `standard-validators.spec.ts` now has 6 tests; the browser
matrix remains a CI gate because Chromium and WebKit cannot launch locally (fontconfig) and Firefox is missing
`libgtk-3.so.0`. Nx Cloud remote cache is unavailable (HTTP 401).

Limitations and open gates: Chromium and WebKit abort with `Fontconfig error: Cannot load default config file` and
`FATAL: SkFontMgr_FontConfigInterface.cpp:163 Not implemented` in this container, so the three-browser matrix and the
route-derived `accessibility.spec.ts` / `localization-coverage.spec.ts` runs are CI gates, not local passes. Independent
language review of the new strings, CI, merge and publication are separate gates; none is claimed as passed. The
2026-11-10 maintainer waiver covers manual assistive-technology assessment but does not cover these new strings.
Maintainer API approval was recorded later on 2026-11-16 (see below).

### API approval (2026-11-16)

The maintainer approved this specification, including the four validator factories (`integerValidator`, `jsonValidator`,
`fileExtensionValidator`, `sameValueValidator`), the supporting types (`NamedFile`, `FileSelection`) and the error keys
(`invalidInteger`, `invalidJson`, `invalidFileExtension`, `valuesMismatch`). The API is no longer a proposed contract;
release and publication remain separate steps. Independent language review of the new demo strings is still an open
gate, and the 2026-11-10 maintainer waiver continues to cover manual assistive-technology assessment only.
