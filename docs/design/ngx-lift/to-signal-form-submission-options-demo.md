# `toSignalForm` submission options demo

Status: implemented in the demo app, rebased onto the merged #204 main. Scope: documentation UI only; no library API
changes.

## Problem

`toSignalForm()` exposes a reactive `submitValue()` signal for one configured option set. The public
`toSubmitValue(form, options)` helper covers a second case that the existing page did not show: deriving several
differently sanitized payloads from the **same** `FormGroup`. Callers need to see how the six omission and pruning
switches — `includeDisabled`, `omitEmptyStrings`, `omitNull`, `omitIf`, `omit` and `deep` — change a payload before
choosing an option set for their facade.

## Practical use cases

1. A profile form keeps a disabled `region` for display. The API payload must include it while the Angular `form.value`
   omits it, so the caller needs `includeDisabled`.
2. A form has UI-only fields (`confirmEmail`), internal bookkeeping keys (`internalCode`), optional empty strings and
   nullable timestamps. Different endpoints require different sanitization, so one facade option set is not enough.
3. Nested groups and arrays contain the same optional fields as the top level. The caller must decide whether pruning is
   shallow (`deep: false`) or recursive.

## Proposed API examples

Reference only — this is the facade pattern already used elsewhere on the page, documented here for contrast. It is not
part of this playground's preview:

```ts
// One form, one facade, one reactive payload.
readonly sf = toSignalForm(this.form, {omitEmptyStrings: true});
readonly payload = this.sf.submitValue();
```

The playground instead runs the pure-helper path. Its TypeScript tab reproduces the live members verbatim
(`optionsForm`, `optionsControls`, `initialOptionsFormValue`, `initialOptionsFlags`, `optionsChanges`,
`optionsComparison`, `optionsInspectorState` and `resetOptions()`), so the displayed code is the code that executes.

## Option matrix

| Option             | Sample field                          | Effect on the sanitized payload                                |
| ------------------ | ------------------------------------- | -------------------------------------------------------------- |
| `includeDisabled`  | disabled `region`                     | keeps `eu-central-1`; off falls back to `form.value`           |
| `omitEmptyStrings` | `nickname`, `profile.city`, `tags[1]` | drops empty strings (top level, or recursively with `deep`)    |
| `omitNull`         | `deletedAt`, `profile.backupEmail`    | drops null values (top level, or recursively with `deep`)      |
| `omitIf`           | `internalCode`                        | drops keys matching the `key.startsWith('internal')` predicate |
| `omit`             | `confirmEmail`                        | drops the listed UI-only keys                                  |
| `deep`             | `profile`, `tags`                     | applies the same rules inside nested objects and arrays        |

`transform` is the remaining `ToSubmitValueOptions` member. It is a custom output mapper rather than an omission/pruning
switch, so it is out of scope for this lab (see Non-goals).

## Live preview

The preview shows `getRawValue()`, `form.value` and `toSubmitValue(form, options)` side by side, a state inspector
listing the keys surviving each stage, six native Clarity toggles bound with `formControlName`, and a Reset button. Two
representative sample values (`nickname` and `profile.city`) are editable so `valueChanges` is observable; the other
matrix fields stay constant to keep the comparison deterministic.

## Non-goals

- No change to `ToSignalFormOptions`, `ToSubmitValueOptions` or any exported symbol; `transform` is not demonstrated.
- No second facade per `FormGroup` and no dynamic facade recreation: overlapping wrappers have no tested teardown
  contract.
- No `emitEvent: false` mutations: they do not promise a signal update. `FormGroup.reset()` restores the values captured
  at construction, keeps the disabled control disabled, and emits through the tracked `valueChanges`/`statusChanges`
  streams.
- The TypeScript tab is not a second, self-contained example: it repeats the live member declarations verbatim and is
  parity-checked by the `optionsLabTs` contract in `tools/demo/demo-examples.test.mjs`. The HTML tab mirrors the live
  bindings (six toggles, Reset, three payload columns, inspector); a dedicated test in the same file checks those
  bindings. Localized headings and hint text are omitted from the HTML excerpt and called out in a comment.
- Exact gate counts and head revisions live in the PR body and CI artifacts, not in this document, so rebasing does not
  stale them.

## Language and accessibility acceptance

- Sixteen new `toSignalForm.optionsLab*` keys ship together in all eleven supported dictionaries (`en`, `de`, `es`,
  `fr`, `ja`, `ko`, `nl`, `pt-br`, `ru`, `zh-cn`, `zh-tw`); `validateDictionary` reports `errors: []`.
- API identifiers (`includeDisabled`, `getRawValue()`, `form.value`, `toSubmitValue(...)`) stay as untranslated code,
  consistent with the accessibility and localization guide.
- Every toggle has a programmatic label whose accessible name includes its localized option hint. Space is the native
  checkbox activation key and is exercised by the browser journey; Enter is not a checkbox activation key and is
  intentionally not claimed. Each section uses `aria-labelledby` pointing at a localized heading.
- Automated gates: component unit tests; browser journeys for keyboard interaction, all six option changes, reset and
  eleven-locale `!! Key` checks; `accessibility.spec.ts` scanning the route in light and dark `cds-theme`; and
  `signal-forms.spec.ts` scanning the all-options-enabled state in both themes with the complete WCAG A/AA tag set and
  no rule disabled.
- Independent native-speaker review of the eleven locales and independent assistive-technology acceptance remain
  separate human gates; automated results do not substitute for them.

## Verification

- `pnpm run validate` (format, tooling tests, translation checks, lint, typecheck, coverage, build, bundle check, packed
  consumers).
- `pnpm nx test demo` for the six new option assertions.
- `pnpm nx e2e demo-e2e -- signal-forms.spec.ts` and the target-route `accessibility.spec.ts` in Chromium and Firefox,
  including `expectAccessible` and the eleven supported locales. WebKit remains a CI gate because the rootless
  verification sandbox has no EGL/DRM device.
