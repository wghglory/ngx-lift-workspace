# Object path and file download utilities

Dated approvals below are historical evidence; current acceptance boundaries live in the
[acceptance contract](../../guides/accessibility-and-localization.md).

Status: Implemented; CI is green on `0c10110` and repeats on every push, while independent language approval remains an
open human gate. The independent manual assistive-technology assessment was waived by the maintainer on 2026-11-10; that
waiver is a decision, not a passed assessment. Owner: ngx-lift maintainers. Updated: 2026-11-15. Approval: maintainer
directive of 2026-11-14, limited to `getValueByPath`, `deleteValueByPath` and `downloadFile`; see
[Review decisions](#review-decisions-and-delivery). Package: ngx-lift. These three exports are implemented in the
library; the remaining utilities proposed in PR #137 were rejected and are not available.

## Applicable contracts

These are synchronous, headless utilities. The relevant contracts are input/output behavior, browser platform and SSR
boundaries, security of caller-supplied paths, and resource cleanup. Rendered-UI requirements apply only to the two demo
pages, which follow the
[accessibility and language acceptance contract](../../guides/accessibility-and-localization.md).

- Value/form integration: not applicable. Neither utility is a form value, a CVA, nor a forms bridge. They can be called
  from form code, but they own no value, validity, touched state or submission payload; no artificial form API is added.
- Reactive/async APIs: not applicable. Both functions are synchronous. `downloadFile` schedules a browser task only to
  revoke a blob URL; it has no promise, cancellation, stale-result or observer semantics.
- Shared state/cache: not applicable. No identity, freshness, retention or scope isolation is owned.
- Other utilities: dot-path parsing, own-property traversal, prototype safety, DOM/Blob availability, object URL
  lifetime, and browser download semantics.
- Clarity/UI: applies to the demo pages only — Clarity containers and tokens, `cds-layout`, keyboard/focus, programmatic
  labels, light/dark, responsive and RTL layout, and all supported locales.

The [forms compatibility spec](../clr-lift/forms-compatibility-design-spec.md) is referenced only to record why no form
integration is proposed; no native Signal Forms binding is implied.

## Background

Application code that displays nested API payloads needs to read a caller-supplied path, and export/save features need
to turn an in-memory string or `Blob` into a browser download. Existing `ngx-lift` object helpers (`isEmpty`, `isEqual`,
`pickBy`, `omitBy`) do not traverse paths or start downloads. PR #137 proposed ten public symbols across five modules
without a spec or API review; review found no consumer for several of them and concrete correctness/security problems.
This document records the retained, narrowed scope. Source evidence: `libs/ngx-lift/src/lib/utils/object-path.util.ts`,
`file-download.util.ts`, their specs, and `libs/ngx-lift/src/lib/utils/index.ts`.

## Terminology

- **Path**: a dot-separated string of own-property segments, e.g. `spec.dbOwner.type`. Numeric segments address array
  indices. Bracket notation, escaping and wildcards are not supported.
- **Own property**: a property present on the object itself, checked with `Object.hasOwn`; inherited properties are
  never read or deleted.
- **Unsafe segment**: `__proto__`, `prototype` or `constructor`; these are rejected before traversal.
- **Object URL**: a browser `blob:` URL from `URL.createObjectURL`, which must be released with `URL.revokeObjectURL`.
- **Download**: the browser action started by clicking a hidden anchor with a `download` attribute. Starting a download
  does not prove that a file was saved.

## Goals

- G1: Developers read or remove an own nested value from an untrusted path without reaching prototypes, and get an
  explicit `undefined` / `false` outcome for missing, malformed or unsafe paths.
- G2: Applications start a client-side download from a string or `Blob`, with validated arguments, no lingering DOM node
  or object URL, and a safe no-op on the server or in hosts without object URLs.
- G3: Demo pages teach both APIs in every supported locale and pass the repository's automated accessibility, language,
  keyboard and browser gates.

## Non-Goals

### Not now

- Bracket notation, wildcard paths, path escaping, deep `set`/`merge`, immutable deletion, flattening, JWT decoding and
  Kubernetes quantity parsing. PR #137 drafts for `flattenObject`, JWT claims and `quantityToScalar` were removed; each
  needs its own use cases, consumer evidence and API review before it returns.
- Download progress, cancellation, save confirmation, Content-Disposition handling, streamed or remote files, and
  `showSaveFilePicker` integration.
- Native Signal Forms integration. Angular 21 remains the baseline; signal-field support is a post-upgrade gate for
  value controls, not for headless helpers.

### Outside this API

Authentication, token verification, backend file generation, filesystem access, server-side rendering of downloads, and
browser permission or user download settings.

## Use cases and acceptance

| ID  | Actor and task                            | Initial data/state                         | Action                                      | Observable outcome                                                    | Failure/recovery                                           | Demo/test                                                              |
| --- | ----------------------------------------- | ------------------------------------------ | ------------------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------- |
| UC1 | Developer reads a nested API field        | `{spec: {dbOwner: {type: 'sqlServer'}}}`   | `getValueByPath(obj, 'spec.dbOwner.type')`  | `'sqlServer'`; source object unchanged                                | Missing path → `undefined`                                 | `object-path.util.spec.ts`; object-path demo resolved value            |
| UC2 | Developer removes a nested setting        | `{server: {host, port}}`                   | `deleteValueByPath(obj, 'server.port')`     | `true`, own property removed in place                                 | Missing/invalid/unsafe path or locked property → `false`   | `object-path.util.spec.ts`; object-path demo delete/reset journey      |
| UC3 | Untrusted path cannot reach prototypes    | Plain object with inherited keys           | Read/delete with `__proto__`, `constructor` | `undefined` / `false`; `Object.prototype` unchanged                   | No recovery needed; rejection is the contract              | `object-path.util.spec.ts` prototype and pollution tests               |
| UC4 | Array index path                          | `{items: ['a', 'b']}`                      | Read/delete `items.0`                       | Value read / own index deleted, array length preserved                | Repeated delete → `false`                                  | `object-path.util.spec.ts`                                             |
| UC5 | User exports generated JSON               | File name and content bound to a demo form | Click the download button                   | Hidden anchor clicked, blob URL revoked on the next task, no DOM left | Empty name → `RangeError`; unsupported host or SSR → no-op | `file-download.util.spec.ts`, `file-download.ssr.spec.ts`, demo E2E    |
| UC6 | Developer supplies a typed `Blob`         | `new Blob([...], {type: 'text/csv'})`      | `downloadFile(blob, 'users.csv')`           | The same `Blob` is used; its MIME type is preserved                   | Invalid content → `TypeError`                              | `file-download.util.spec.ts`                                           |
| UC7 | Reader learns the API in another language | Any of the 11 supported locales            | Open either demo route, switch language     | All owned visible/announced strings render translated, no `!! Key`    | Dictionary parity and browser scans catch missing keys     | `i18n:check`, `localization-coverage.spec.ts`, `accessibility.spec.ts` |

Keyboard and touch: both demo pages use native Clarity inputs and buttons; tab order reaches every control, the download
button is activatable by keyboard, focus remains visible, and long translated labels must not cause horizontal overflow
at 390 px. Empty results, invalid paths and empty file names have explicit visible feedback.

## Industry evidence and current gaps

| Existing implementation / primary source                                                                                        | Verified behavior                                                                                                                                                           | Adopt, adapt, or reject                                                                                                                           | Our gap and reason                                                                                              |
| ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| [Lodash `get` / `unset` / `has` / `hasIn`](https://lodash.com/docs/4.17.15) (checked 2026-11-14)                                | Provides path getters/removers and separates own-path checks (`has`) from inherited-path checks (`hasIn`); supports a much richer path grammar and a default value argument | Adapt: keep a single dot-path grammar and own-only traversal; reject the extra path DSL and default-value option                                  | Local consumers need a small, dependency-free helper; a path DSL enlarges the public surface without a use case |
| [MDN `URL.createObjectURL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static) (checked 2026-11-14) | Creates a blob URL for a `Blob`/`MediaSource`; explicitly requires `URL.revokeObjectURL()` to release it; unavailable in Service Workers due to memory-leak risk            | Adopt: create one URL per call and revoke it on the next task                                                                                     | A fixed 150 ms delay was arbitrary and untested; a deterministic next-task revoke is easier to verify           |
| [MDN `<a download>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a#download) (checked 2026-11-14)      | `download` suggests a filename, works for same-origin, `blob:` and `data:` URLs, and browser behavior varies with user settings; the method does not confirm a saved file   | Adopt: hidden anchor + `download`; document that saving is not observable                                                                         | The earlier demo implied a download result was verified; the API must state it only starts the browser action   |
| Existing `ngx-lift` `pickBy` / `omitBy` / `isEmpty`                                                                             | One-line pure helpers with focused specs and barrel exports; documented through public JSDoc                                                                                | Adapt: collapse `omitBy` negation into `pickBy(source, predicate, {negate: true})` with a deprecated alias; keep the public export surface narrow | One module and one focused spec for the filter helper, with prototype-safe traversal                            |
| FileSaver.js-style wrappers and JWT/K8s helper libraries                                                                        | Extra runtime dependency or domain-specific parsing with their own trust boundaries                                                                                         | Reject                                                                                                                                            | Browser APIs cover both use cases; no approved consumer justifies installation, bundle or maintenance cost      |

## Developer learning journey and pedagogy plan

| Reader task / prerequisites                    | Learning outcome                                         | Destination / page type                             | Working example and expected result                                                 | Validation                                         |
| ---------------------------------------------- | -------------------------------------------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------- |
| Know TypeScript objects; read one nested field | Explain own-only traversal and what `undefined` means    | `/ngx-lift/utilities/object-path` (reference)       | Type `user.profile.contact.email`; the resolved value and sample object update live | Unit specs, E2E read and unsafe-path journeys      |
| Know forms/events; remove a nested key         | Explain in-place mutation, `false` results and reset     | `/ngx-lift/utilities/object-path` (playground)      | Enter a delete path, apply delete, observe status, reset the sample                 | Unit specs, E2E delete/reset/repeat journeys       |
| Know `Blob`; export in-memory data             | Explain argument validation, MIME handling and SSR no-op | `/ngx-lift/utilities/file-download` (playground)    | Edit file name/content, activate the download button, observe localized status      | Unit specs, Node SSR spec, E2E validation feedback |
| Need the exact API contract                    | Look up signatures, parameters, returns and errors       | Both pages' API reference sections and public JSDoc | Copyable signatures and examples render from the installed package                  | `typecheck`, `bundle:check`, `verify:packages`     |

Code blocks are developer diagnostics and API identifiers; they stay in English by contract. All surrounding teaching
text, labels, statuses and API-table descriptions are localized. Advanced material (prototype-safe paths, blob URL
lifetime) is presented as short notes after the first complete working task.

## Public API and examples

All three symbols are exported from the `ngx-lift` root entry point through `lib/utils/index.ts`.

| Symbol                        | Signature                                                                                    | Returns                                      | Errors / no-op                                                                        |
| ----------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------- |
| `getValueByPath<T = unknown>` | `(obj: unknown, path: string) => T \| undefined`                                             | Own value at path, else `undefined`          | Invalid source, blank/malformed/unsafe path, inherited key → `undefined`              |
| `deleteValueByPath`           | `(obj: unknown, path: string) => boolean`                                                    | `true` only when an own property was deleted | Missing/locked/inherited/unsafe path → `false`; never throws for locked keys          |
| `downloadFile`                | `(content: string \| Blob, fileName: string, mimeType = 'text/plain;charset=utf-8') => void` | Nothing (fire-and-forget)                    | Empty `fileName` → `RangeError`; bad content → `TypeError`; SSR/no object URL → no-op |

Minimal example (compiles against the public package):

```typescript
import {getValueByPath, deleteValueByPath, downloadFile} from 'ngx-lift';

const config = {server: {host: 'localhost', port: 8080}};
const host = getValueByPath<string>(config, 'server.host'); // 'localhost'
deleteValueByPath(config, 'server.port'); // true; config.server.port is gone
downloadFile(JSON.stringify(config), 'config.json', 'application/json');
```

Realistic advanced example — a caller-supplied path from a table filter and a generated CSV blob:

```typescript
import {getValueByPath, downloadFile} from 'ngx-lift';

function exportColumn(rows: Record<string, unknown>[], path: string): void {
  // Caller-controlled path: unsafe segments resolve to undefined rather than prototype state.
  const column = rows.map((row) => String(getValueByPath(row, path) ?? ''));
  const csv = ['value', ...column].join('\n');
  downloadFile(new Blob([csv], {type: 'text/csv'}), 'export.csv');
}
```

Identity and empty behavior: `getValueByPath` never mutates its input and returns the exact stored reference.
`deleteValueByPath` mutates the target in place, including arrays (deleting an index leaves a hole and preserves
`length`). `downloadFile` creates one `Blob` for string content, one hidden anchor and one blob URL per call; it does
not sanitize the file name beyond rejecting blank values, and does not verify a saved file. Type behavior is asserted
with `expectTypeOf` in the specs.

Form applicability: these are not form values and no ngModel/Reactive Forms/`toSignalForm` example is claimed. A form
can bind the path string or file name with ordinary Angular controls; the helpers are called from the submit handler.
Native signal-field support is not required for headless helpers.

## Behavior and architecture

`object-path.util.ts` keeps a private `UNSAFE_SEGMENTS` set, a private `isRecord` guard and a private `splitPath`
parser; only the two functions are exported. `splitPath` rejects blank paths, empty/whitespace-only segments and unsafe
segments before any traversal. Both functions use `Object.hasOwn` at every step, so getters on the prototype chain are
never invoked. `deleteValueByPath` wraps the final `delete` in a `try`/`catch` so non-configurable properties yield
`false` instead of a strict-mode exception. No recursion, no async work and no external state are used. The object-path
demo page does not duplicate this path grammar: it calls both exports and renders their `undefined` / `false` outcomes,
so the browser journeys exercise the library contract.

`file-download.util.ts` first returns when `window` or `document` is absent, so server rendering is always a no-op,
including for invalid arguments. On a browser host it then validates `fileName` and `content` synchronously, and only
afterwards checks that `URL.createObjectURL` and `URL.revokeObjectURL` are functions; a host without those helpers is a
no-op for valid arguments. It creates one `Blob` for string content and a hidden anchor, clicks it once inside
`try`/`finally`, removes the anchor synchronously, and revokes the URL in a `setTimeout(…, 0)` callback. The private DOM
mechanism is not exposed. The function is synchronous and owns no lifecycle; repeated calls create independent URLs.

Security/resource limits: prototype-related segments are refused, so a caller-supplied path cannot traverse or mutate
prototype state. File names are caller-owned and are not escaped; browsers normalize `/` and `\` and may adjust illegal
characters. The API does not read remote URLs, does not verify signatures or tokens, and does not retain the blob after
the next task. SSR behavior is an explicit no-op, not a hydration contract.

## Clarity, accessibility, and localization

Library utilities own no visible strings. Error messages are developer diagnostics (`RangeError` / `TypeError`) and are
not product UI, so they are not translated. Demo pages own all visible and announced messages; the inventory uses two
namespaces in `apps/demo/src/app/core/l10n/`:

| Namespace        | Owned messages                                                                                                                                                                                 |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `objectPath.*`   | Overview, playground title/description, sample heading, read/delete path labels, resolved value heading, action buttons, path rejection, delete success/failure, reset, API table descriptions |
| `downloadFile.*` | Overview, playground title/description, file name/content labels, download button, empty-name error, started status, API table descriptions                                                    |

Both namespaces are complete for `en, zh-CN, zh-TW, de, es, fr, ja, ko, nl, pt-BR, ru`, including placeholders such as
`{0}` and any `<code>` API identifiers. Shared headings reuse `common.*` keys. The object-path page title and sidebar
label list both exports (`getValueByPath & deleteValueByPath`, following the existing `pickBy & omitBy` page); the
download sidebar label is `downloadFile`. These are exact public API identifiers, so they stay in English by contract;
no untranslated prose is added to the navigation. The dictionaries are checked by `pnpm run i18n:check`;
`localization-coverage.spec.ts` visits every demo route for every locale and asserts no missing key, no `!! Key` marker
and no horizontal overflow at a narrow viewport. Runtime language switching is covered by the same suite.

Demo controls are native Clarity inputs and buttons inside `cll-page-container` with `cds-layout`. Every rendered
control has a programmatic label (`for`/`id` or `aria-label`), unique IDs within the page, visible focus, and a keyboard
path to all actions. Status changes use a live region so the read/delete result and download feedback are announced
once, not on every render. Light/dark and the 390 px narrow viewport are covered by the route-derived
`accessibility.spec.ts` and `localization-coverage.spec.ts` scans. Compact density, RTL direction and long translated
labels are covered by explicit light/dark tests in the two new utility E2E specs at a 390 px viewport. Contrast uses
Clarity tokens; no custom colored status badges are introduced.

Independent human language approval and manual assistive-technology assessment are separate records. The project-wide
manual AT waiver (2026-11-10) is not a pass for automated checks; human language review for these new strings remains an
open gate recorded in the PR.

## Demo and validation plan

| Use case | Demo                                                           | Automated evidence                                                                                             |
| -------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| UC1–UC4  | `/ngx-lift/utilities/object-path` with `app-demo-playground`   | `object-path.util.spec.ts`, `apps/demo-e2e/src/utilities-object-path.spec.ts`                                  |
| UC5–UC6  | `/ngx-lift/utilities/file-download` with `app-demo-playground` | `file-download.util.spec.ts`, `file-download.ssr.spec.ts`, `apps/demo-e2e/src/utilities-file-download.spec.ts` |
| UC7      | Both routes across all locales                                 | `i18n:check`, `accessibility.spec.ts`, `localization-coverage.spec.ts`, `i18n.spec.ts`                         |

The demos show real value/state, reset, invalid and unsafe paths, empty file names, disabled submission while a name is
blank, readonly output and a realistic advanced example. Invalid and unsafe paths flow through the library and render
the generic empty-value / nothing-removed outcomes; the usage notes explain prototype safety. Tests cover own vs.
inherited properties, unsafe segments, non-configurable properties, array indices, type assertions, DOM cleanup, URL
revocation after a failed click, argument validation, hosts without object URL helpers and a real Node (SSR)
environment. The two new Playwright specs are configured for Chromium, Firefox and WebKit with role-based selectors for
controls and semantic regions for readouts, and no timing sleeps; local browser execution is blocked by missing host
libraries, so CI runs that matrix on every push (see [Evidence](#evidence)). Installed public-package verification uses
`pnpm run bundle:check` and `pnpm run verify:packages`; no new runtime dependency is introduced, so there is no
optional-installation or bundle-isolation question. No dedicated scale benchmark is warranted for two O(path-length)
helpers.

## Compatibility, rollout, and risks

No runtime dependency is added. Browser alternatives (`Blob`, `URL.createObjectURL`, `URL.revokeObjectURL`, anchor
`download`, `Object.hasOwn`) are native and available on the supported Angular 21 baseline; targets are `es2022` with
`dom` libs. A dependency such as FileSaver.js or lodash would add installation, transitive, bundle and maintenance cost
without an approved use case, so it is rejected.

The three exports are additive from the root entry point; no existing export, peer range or secondary entry point
changes. Removing them is a rollback: delete the two modules, their barrel exports and the two demo routes. Bundle
impact is two small functions with no imports. Migration examples are not needed because no prior public API existed.
SSR/hydration remains a documented no-op for downloads; Node DOM tests are not proof of SSR rendering, and this spec
does not claim hydration support.

| Risk                                                    | Owner / treatment                                                                  |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Caller expects bracket notation or inherited properties | Documented as rejected; revisit only with a named consumer and API review          |
| Browser ignores `download` for cross-origin URLs        | Out of scope; the helper only creates same-origin `blob:` URLs                     |
| Browser adjusts the suggested file name                 | Documented; no sanitization is promised                                            |
| Human language approval for new demo strings            | Independent reviewer; recorded separately from automated dictionary/browser checks |
| `downloadFile` cannot confirm the file was saved        | Documented as fire-and-forget; demos state "started", not "saved"                  |

## Review decisions and delivery

| Decision                                          | Alternatives                                                        | Outcome                                                                                                                                  |
| ------------------------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Keep only three of PR #137's ten proposed exports | Merge all five modules; close the whole PR                          | Maintainer directive 2026-11-14: keep object-path and downloadFile; remove `flattenObject`, JWT claims/helpers and K8s quantity parsing  |
| Reject inherited/prototype path traversal         | lodash-like full path DSL with `hasIn` support                      | Rejected; own-only traversal with explicit unsafe-segment rejection                                                                      |
| Revoke blob URL on the next task                  | Fixed 150 ms timeout; caller-owned revoke handle                    | Next-task revoke; deterministic and tested, no new public handle                                                                         |
| Validate arguments synchronously                  | Silent no-op for blank names / wrong content                        | `RangeError` / `TypeError` on browser hosts; SSR is always a no-op, and a host without object URL helpers is a no-op for valid arguments |
| Spec for simple helpers                           | JSDoc only                                                          | Spec required here because path safety, SSR and resource lifetime are non-trivial contracts                                              |
| Demo delegates path rejection to the library      | Demo-owned `UNSAFE_SEGMENTS` predicate                              | 2026-11-15 review: removed the duplicated predicate so the browser journeys exercise the exported helpers                                |
| Show the first task once                          | Repeat one snippet in the playground and in a static Examples block | 2026-11-15 review: the playground TypeScript tab is the single minimal example; the Examples section holds the advanced example          |

Delivery increments: (1) narrow exports and fix implementations with unit/type/SSR tests; (2) localized, accessible demo
pages with 11 dictionaries; (3) browser E2E, accessibility, localization, bundle and installed-consumer checks. Each
increment builds independently. CI, maintainer API approval, human language acceptance, merge and publication remain
separate gates.

Review follow-up (2026-11-15): a two-axis review of PR #137 found documentation-standard breaches and spec/code
mismatches. The follow-up removes the duplicated minimal example from both pages, adds imports and runnable setup to
both advanced examples, replaces `$any` casts with typed template references, names both exports in the object-path page
title and sidebar label, removes the demo's duplicate path-safety predicate, extracts the shared localized API-parameter
helper, aligns the download preview with its displayed call, adds the missing platform no-op unit tests, and switches
the new E2E specs to role-based selectors with explicit compact/RTL coverage. Independent human language approval is
still open and is recorded separately from these automated checks.

## Evidence

Local verification on 2026-11-15, branch `pr-137-rebase` on `origin/main` (`cc8e4be`), after the review follow-up.

| Check                                   | Command                                                                                                                                              | Result                                                                                                                                                                                                                                                                                                                                                                                            |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Library and demo quality                | `pnpm nx run-many -t lint,typecheck,test,build --projects=ngx-lift,demo --skipNxCache`                                                               | Passes on 2026-11-15: ngx-lift 54 files / 921 tests, demo 85 files / 321 tests, both builds. The 10 s hook timeouts in unrelated query/idle-detection specs remain intermittently reproducible under parallel load; a clean full-suite run and isolated runs of the changed specs both pass.                                                                                                      |
| E2E spec quality                        | `pnpm nx run-many -t lint,typecheck --projects=demo-e2e --skipNxCache`                                                                               | Passes; the 10 lint warnings are pre-existing in other specs, none in the two new utility specs.                                                                                                                                                                                                                                                                                                  |
| Dictionary parity                       | `pnpm run i18n:check`                                                                                                                                | 2368 keys complete in all 11 locales (33 new keys), no placeholder, identifier or missing-key errors.                                                                                                                                                                                                                                                                                             |
| Tooling, formatting and whitespace      | `pnpm run test:tools`, `pnpm run format:check`, `git diff --check`                                                                                   | All pass, including the demo-example formatter (33 tooling tests).                                                                                                                                                                                                                                                                                                                                |
| Bundle isolation                        | `pnpm run bundle:check`                                                                                                                              | Passes; lazy highlighting and deferred parsing unchanged.                                                                                                                                                                                                                                                                                                                                         |
| Browser E2E and accessibility scans     | New `utilities-object-path.spec.ts`, `utilities-file-download.spec.ts`, plus route-derived `accessibility.spec.ts` / `localization-coverage.spec.ts` | **Not executable locally** (Chromium, Firefox and WebKit all fail to launch in this container), but CI supplied the evidence on 2026-11-15: the full `quality` matrix is green on `0c10110` (`lint-typecheck`, `test`, `build`, CodeQL and every chromium/firefox/webkit E2E shard), covering the role-based journeys and the compact/RTL/long-label tests. Each further push re-runs the matrix. |
| Installed-consumer package verification | `pnpm run verify:packages`                                                                                                                           | **Still open; not re-run in this pass.** Previously blocked before consuming the packages by a reproducible registry peer mismatch in the fresh-consumer harness: `@clr/angular@18.5.1` requires `@clr/ui@18.5.1` while the installer selected `@clr/ui@18.5.0`. Unrelated to these exports; Nx cache can mask it in CI.                                                                          |

Nx Cloud remote caching is unavailable in this environment (organization disabled, HTTP 401); every target above was run
with `--skipNxCache`, so these results are local and uncached.

Independent human language approval for the 33 new demo strings remains open and must be recorded separately in the PR.
The 2026-11-10 manual AT waiver is a maintainer decision, not an open assessment or a passed one, and does not waive any
automated scan. Automated checks never replace the human language gate.

## Predicate narrowing increment (2026-11-24)

Scope authorized by the maintainer request to enhance `pickBy` and `omitBy` and open a PR. This increment adds value
type-guard overloads to existing exports; own enumerable string keys, prototype safety, and the `omitBy` deprecation
remain unchanged. No new export or dependency is introduced. Release classification must account for the
source-compatibility caveat below. This PR does not publish a package or change peer ranges.

### Admission and comparison

The motivating consumer is typed policy retention-bound serialization in DSM UI: filtering
`{min: number | null, max: number | null}` must produce optional numeric bounds without casts. The deprecated inverse
helper needs equivalent narrowing for existing consumers; new code uses negated `pickBy`.

| Symbol             | Consumer / native / existing export                                                         | Domain / private APIs / effects / timing            | Accessibility / language / dependency / fit                                 | Verdict         |
| ------------------ | ------------------------------------------------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------------------------------- | --------------- |
| `pickBy` overloads | Real form payload; native entries/fromEntries lose key/value types; enhance existing export | Generic, public TypeScript types, pure, synchronous | No rendered changes, messages or dependencies; existing utility entry point | Proceed to spec |
| `omitBy` overload  | Compatibility counterpart to the same consumer; no new export                               | Same pure implementation and public types           | Alias remains deprecated; no new adoption encouraged                        | Proceed to spec |

Checked 2026-11-24:
[TypeScript predicates](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates) and
[inferred predicates](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-5.html) establish the
value-guard model. [Remeda pickBy/omitBy](https://remedajs.com/docs/#pickBy) supports value narrowing: adopt the idea,
without adding a dependency or adopting its different symbol-key semantics. Clarity, Angular Material, NG-ZORRO and
React UI components are outside this headless compile-time contract; no rendering integration is proposed.

### Contract, use cases and examples

- A value guard returning `value is S` yields `Partial<{[K in keyof T]: T[K] & S}>` in positive mode.
- Literal `{negate: true}` and the legacy alias yield `Partial<{[K in keyof T]: Exclude<T[K], S>}>`.
- Positive narrowing accepts omitted options or explicit `negate: false`; widened/empty options do not guarantee
  direction. Boolean predicates and runtime boolean negation retain `Partial<T>`; the runtime option cannot guarantee a
  direction.
- Properties stay optional, including known numeric properties. A guard may select a subset of a value type, and key
  callbacks may reject individual properties. No required-key preservation or key-predicate inference is promised.
- Type predicates are trusted like TypeScript's native filtering; dishonest guards are not validated at runtime.
- Readonly modifiers, literal types, heterogeneous objects and unknown dictionaries retain appropriate property types.
- Empty matches produce `{}`; input remains unchanged; predicate errors propagate. Each own property is read once, and
  the exact value inspected by the guard is copied, including for getters or callback mutations. Existing SSR and O(n)
  behavior stay unchanged, with no timers, DOM, lifecycle or state ownership.

```typescript
import {pickBy} from 'ngx-lift';

const bounds: {min: number | null; max: number | null} = {min: 0, max: null};
const numeric = pickBy(bounds, (value): value is number => typeof value === 'number');
// {min?: number; max?: number}; runtime {min: 0}
const nonNull = pickBy(bounds, (value): value is null => value === null, {negate: true});
// {min?: number; max?: number}; runtime {min: 0}
```

The learning path is existing boolean filtering, then explicit/inferred guards, then inverse filtering. The existing
pick-by demo continues to demonstrate unchanged runtime behavior. This type-only increment is demonstrated through
compiler-checked examples and unit tests rather than a new rendered demo. No form control/CVA, browser interaction,
localization, accessibility assessment or human language acceptance is affected.

### Pre-implementation review and acceptance

Reviewed scope: this section, before implementation; maintainer authorization is the current enhancement request.
Admission, consumer evidence, industry comparison, API design, contracts, form applicability, accessibility, language,
dependency/bundle, lifecycle/safety, tests/demos, evidence separation, codebase gaps and fit/sequence: Pass for the
limited value-narrowing scope above. No new barrel, platform, roadmap sequence or runtime behavior is needed. No
blocking findings. Required evidence: type assertions and rejected assignments, runtime guard/inverse/empty/zero cases,
unchanged source and prototype tests, library lint/typecheck/build, and a strict consumer against packed declarations.
Automated evidence, CI, maintainer review, merge and package publication remain separate gates.

Validation for this increment: all 63 ngx-lift spec files / 991 tests passed, including 14 filter tests. Library lint,
production typecheck and production package build passed. Focused spec compilation under strict TypeScript passed. The
consumer fixture fails against baseline declarations (nullable bounds) and passes against the packed public package with
`strict: true` and `skipLibCheck: false`. It is also wired into the existing fresh-consumer package gate. The whole
spec-project TypeScript command reports unrelated diagnostics in existing pagination, logger, range, file-download and
object-path specs; this increment does not change those files. The full multi-package/browser gate was not run locally
for this compile-time increment. CI, maintainer review, merge and publication are pending.

### Review follow-up: broad guards, options, getters and equality

The maintainer requested `isEqual` cleanup and review fixes. `isEqual` accepts independently inferred input types
through `isEqual<T, U = T>(left: T, right: U)` without call-site generic arguments; defaulting the second type preserves
explicit one-type-argument calls. Deep-comparison runtime behavior is unchanged. The motivating consumer compares
computed assignment data with a stored view model of a different structural type. This is a generic comparison contract,
with no dependency, rendering, lifecycle or form-control changes. Admission and API review: enhance the existing export;
no new helper is warranted. Existing equality runtime tests and strict packed consumer calls cover heterogeneous
object/primitive inputs and explicit-generic compatibility.

Review fixes require `negate: false` when a supplied options object opts into positive narrowing; empty/widened options
fall back conservatively. Reusable guards can classify a supertype of the source's literal values while the callback
must still accept every source value. Source-aware overloads retain contextual typing for inline callbacks. The loop
snapshots each own value once so getters or callback mutation cannot replace a validated value before copying it. These
fixes supersede the earlier runtime-unchanged statement only for repeated property reads. CodeRabbit's reported
configuration warning is addressed by keeping the tone instructions within its stated 250-character limit.

Follow-up validation: 63 files / 998 tests passed, including the new getter, hidden-options, literal reusable-guard and
heterogeneous equality cases. Strict compilation of both changed specs, library lint, production typecheck/build and
strict packed-declaration consumer compilation passed. CodeRabbit tone text is below 250 characters. Remote CI must
validate the pushed revision separately.

### Compatibility assessment after merging current main

No exports, explicit generic signatures or boolean-callback forms are removed. `isEqual` retains its existing explicit
one-type-argument form and widens ordinary calls, with unchanged comparison behavior. However, stronger inferred return
types can break source that writes an excluded value into a filtered result, for example assigning `null` to a numeric
bound after filtering. This is intentional type tightening, not a claim of universal source compatibility. Callers
needing a wider mutable result can annotate a wider result type, use the existing explicit source type argument, or use
a boolean-returning predicate. The strict package consumer checks both old forms and the new rejected write. Reading
each property once also changes observable behavior for stateful getters or callbacks that mutate the source; the copied
value is now the validated value. Plain-data filtering is unchanged. Strict SemVer consumers should treat these
source/edge-behavior changes as requiring a major release unless maintainers explicitly approve a documented
compatibility exception. No release authorization or version bump is implied by this PR.

The merge-time cross-library build caught an inference regression from the earlier `unknown` equality overload:
clr-lift's `dgState` RxJS operator factory inferred `Observable<unknown>`. The final single signature uses independent
generics with `U = T`, preserving heterogeneous comparisons, explicit one-type-argument calls, and contextual RxJS
operator inference. The packed-consumer fixture includes the operator-factory pattern; both library builds must pass.

Merged-main validation: ngx-lift 65 files / 1043 tests and clr-lift 42 files / 568 tests passed. Both libraries' lint,
production typecheck and builds passed. Focused strict spec compilation and the packed-declaration consumer, including
the RxJS factory and existing explicit-source-type filtering calls, passed. Browser and full package-verification suites
were not rerun locally; CI applies to the pushed merge revision.

### Second review: union sources and optional properties

Review found two blockers: `T[keyof T]` only described shared keys of union sources and could infer a `never` guard
while retaining a number at runtime; required `Record` constraints also dropped broad-guard narrowing for optional
literal properties. The callback value type now distributes over every source member. Reusable-guard inference is
separate from an intersected callback constraint that accepts all source values, without requiring optional properties
to exist. Own-value access is asserted to the distributive value union at the implementation boundary; enumeration
cannot produce a different declared property-value type. Focused compiler/runtime regressions and the packed-consumer
fixture cover positive, inverse and alias filtering, and reject a callback accepting common discriminants only.

Second-round validation: all 65 ngx-lift files / 1046 tests passed, as did both libraries' lint, typecheck/build,
focused strict spec compilation and the strict packed-declaration consumer. Independent standards and spec reviewers
approved the updated implementation with no remaining blockers; the spec reviewer separately checked exact optional
property types and rejected unsafe callback/union assignments. These are local review approvals, not a GitHub maintainer
approval, merged state or publication. CI must check the pushed revision.

### Overloaded callback domain safety

Attached review feedback found that intersecting a narrow value guard with a separate all-values boolean signature can
match different overloads of one callback. The narrow signature could then hide strings retained by the boolean
signature. The reusable-guard overload now requires `[PropertyValue<T>] extends [V]` for the same signature supplying
`S`; a separate boolean overload cannot satisfy that domain check. Callbacks with narrower guard domains fall back to
`Partial<T>`. Compiler and packed-consumer regressions retain a string accepted by an overloaded callback and reject a
numeric payload assignment; existing union/optional, ordinary boolean and contextual callback checks remain required.

Feedback validation: 1048 ngx-lift tests passed, both libraries passed lint/typecheck/build, both changed specs compiled
strictly, and the updated packed public-declaration consumer passed strict checks with `skipLibCheck: false`. Both
independent reviewers approved the fix; the spec reviewer separately verified exact optional-property typing and both
overload orders. Review and CI state before this fix do not establish approval of the next pushed revision.
