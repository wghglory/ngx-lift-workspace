# `provideClrLiftI18n` design specification

Status: Implemented (contract audit) — scope approved by the maintainer, pending merge. Owner: clr-lift maintainers.
Updated: 2026-11-24. Package: clr-lift. Scope approval evidence: the maintainer explicitly asked for spec and code in
one PR and then directed the persistence, precedence, rename, async-locale docs, and review fixes in
[PR #257](https://github.com/wghglory/ngx-lift-workspace/pull/257). The approved scope is one bootstrap provider with a
single `locale` option, a one-argument runtime setter, the service rename, and documentation; no other public symbol is
added. Merge and publication remain separate decisions.

## Applicable contracts

This is a DI/bootstrap utility, not a rendered component and not a form value control. The form contract does not apply;
there is no value, CVA, validation, or focus state. The
[accessibility and localization contract](../../guides/accessibility-and-localization.md) applies only to the strings
clr-lift already owns: this API adds no new visible or announced message, so no new dictionary entries are required. The
headless/utility portion of the contract applies to input resolution, side effects, cleanup, SSR, and tests.

## Admission decision

Applied 2026-11-24 against [admission criteria](../../../.agents/skills/lift-design/references/admission-criteria.md).
Symbol under review: `provideClrLiftI18n(options?: ClrLiftI18nOptions): EnvironmentProviders`.

| Test                | Result         | Evidence                                                                                                                                                                                                                                                      |
| ------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Consumer            | Pass           | A real application consuming `clr-lift` components can read its language from a host preference or its own i18n service; the library currently has no declarative seam for that value. Use cases are named outside the demo app.                              |
| Native API          | Pass           | Angular's `LOCALE_ID` and `provideEnvironmentInitializer` cannot seed `ClrLiftI18nService`, register its dictionaries, or sync `ClrCommonStringsService`. The provider adds resolution policy and pre-render synchronisation, not a wrapper around one token. |
| Existing export     | Pass           | `ClrLiftI18nService.setLanguage()` is imperative and runs after construction; no provider, `InjectionToken`, or app initializer exists in `libs/clr-lift`. `provideQueryDevtools` is unrelated.                                                               |
| Domain coupling     | Pass           | The only option is a locale tag; no application-specific preference key, service, or entity is encoded.                                                                                                                                                       |
| Private API         | Pass           | Uses only public Angular DI APIs, public `LOCALE_ID`, `PLATFORM_ID`, and public `ClrLiftI18nService` methods.                                                                                                                                                 |
| Global side effects | Pass (adapted) | Reuses the existing root `ClrLiftI18nService` effect that writes `html[lang]`/`html[dir]`; the provider itself adds no DOM, style, storage, or console side effect and has no timers or subscriptions to dispose.                                             |
| Timing and purity   | Pass           | Resolution is a pure function of options, `LOCALE_ID`, platform, and `navigator`, executed once before first render; no delay or polling.                                                                                                                     |
| Accessibility       | Pass           | No keyboard, focus, or announcement behavior is introduced. Existing `html[lang]`/`[dir]` updates continue to drive assistive-technology language and RTL layout.                                                                                             |
| Language            | Pass           | No new string is added. Eleven existing dictionaries and the Clarity common-string table remain unchanged.                                                                                                                                                    |
| Dependency          | Pass           | No new runtime dependency; `@angular/core` and `@clr/angular` are already peers.                                                                                                                                                                              |
| Fit                 | Pass           | Extends the existing clr-lift i18n entry point; no new secondary entry point, no bundle impact beyond a small provider file.                                                                                                                                  |

Verdict: **Proceed to spec**. The admission test that needed adaptation is global side effects: the provider relies on
the already-approved root service effect rather than adding its own.

## Background

clr-lift ships `ClrLiftI18nService` with eleven dictionaries, an impure `TranslatePipe`, and synchronisation of
Clarity's `ClrCommonStringsService`. Its initial language previously came from `localStorage['clr-lift-lang']`, then
`navigator.language`, then `en`; `setLanguage(lang, persist = true)` wrote that key, and Angular's `LOCALE_ID` was not
read. An application therefore had no declarative way to align clr-lift with its own language source, and clr-lift could
display a different language from the rest of the page on first render. This API supplies that bootstrap seam while
leaving application-owned content translations with the application. Following Angular Material, neither the provider
nor the service persists a language: the application owns preference storage and passes the resolved locale to the
library.

## Terminology

- **Application locale** — an explicit locale supplied by the application, typically from a user preference or its i18n
  service.
- **Angular locale** — the `LOCALE_ID` token, used by Angular date/number formatting and by Clarity's datepicker.
- **Browser locale** — `navigator.language`, used only when no application or Angular locale is available and only on
  the browser platform.
- **Active language** — the value held by `ClrLiftI18nService.currentLanguage`; drives all clr-lift dictionaries and the
  Clarity common strings.

## Goals

- G1: An application can set clr-lift's active language at bootstrap from its own preference source, with no flash of a
  different language.
- G2: The provider follows the Angular `LOCALE_ID` convention before the browser setting, and uses `navigator.language`
  only as a fallback on the browser platform.
- G3: Runtime language selection continues to work through one documented call, with the application owning persistence.

## Non-Goals

### Not now

- Bundling an application i18n library into clr-lift or subscribing to an application's language observable inside the
  provider; applications forward changes with `setLanguage()`.
- Persisting a language from library code. Neither the provider nor `ClrLiftI18nService` reads or writes `localStorage`;
  applications store their own preference and pass it back through `locale` or `setLanguage()`.
- Replacing Angular's `LOCALE_ID` or registering CLDR data. Applications that need locale-aware dates still follow the
  Angular/Clarity pattern.

### Outside this API

- Translating application-owned labels, content, validation messages, and backend text.
- Deciding which language is a user's preference; that is application policy.

## Use cases and acceptance

| ID  | Actor and task                      | Initial data/state                                        | Action                                           | Observable outcome                                                                            | Failure/recovery                                                                        | Demo/test                |
| --- | ----------------------------------- | --------------------------------------------------------- | ------------------------------------------------ | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------ |
| UC1 | App with a stored preference starts | Preference `fr`                                           | `provideClrLiftI18n({locale: 'fr'})`             | clr-lift strings and Clarity common strings are French before first render; `html[lang]="fr"` | Unsupported tag falls back per existing `resolveLanguage`/`resolveClarityStrings` rules | `i18n-providers.spec.ts` |
| UC2 | App using Angular locale starts     | `LOCALE_ID = 'ja'`, browser `de-DE`                       | `provideClrLiftI18n()`                           | Active language is `ja`; Angular locale wins over the browser                                 | Angular default `en-US` applies when the app provides no locale                         | `i18n-providers.spec.ts` |
| UC3 | No application or Angular locale    | `navigator.language = 'de-DE'`                            | Resolver with no `LOCALE_ID`                     | Active language is `de-DE` on the browser                                                     | No browser or locale: `en`                                                              | `i18n-providers.spec.ts` |
| UC4 | Server-side render                  | Server `navigator.language = 'de-DE'`, `LOCALE_ID = 'ja'` | `provideClrLiftI18n()` with server `PLATFORM_ID` | Active language is `ja`; server host locale is ignored                                        | Absent `navigator` on server also uses `LOCALE_ID`                                      | `i18n-providers.spec.ts` |
| UC5 | User switches language at runtime   | Active `en`                                               | `translationService.setLanguage('zh-CN')`        | Pipes and Clarity strings update immediately; no preference storage written                   | Invalid/empty tag is ignored by `setLanguage`                                           | `i18n-providers.spec.ts` |
| UC6 | App manages its own preference      | Any previously stored value under `clr-lift-lang`         | `provideClrLiftI18n({locale: 'fr'})`             | Active language is `fr`; neither provider nor service reads or writes that key                | Storage is never touched by clr-lift                                                    | `i18n-providers.spec.ts` |
| UC7 | Preference arrives from an API      | Locale unknown at bootstrap                               | `provideClrLiftI18n()` then `setLanguage(lang)`  | Fallback language renders first, then all clr-lift strings switch when the response arrives   | An app initializer can await the response before bootstrap to avoid the fallback flash  | README/integration guide |

## Industry evidence and current gaps

Checked 2026-11-24. URLs are primary sources.

| Existing implementation / primary source                                                                                                                                                     | Verified behavior                                                                                                                                                    | Adopt, adapt, or reject                                               | Our gap and reason                                                                                               |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Angular Clarity — https://clarity.design/documentation/internationalization and https://github.com/vmware-clarity/ng-clarity/blob/main/projects/angular/utils/i18n/common-strings.service.ts | `ClrCommonStringsService.localize(Partial<ClrCommonStrings>)`; no `provideClarity*` function; datepicker injects `LOCALE_ID` and the app registers CLDR data         | Adapt ownership boundary; reject imperative-only bootstrap            | clr-lift already owns 11 Clarity string tables; a provider makes the one-time merge deterministic before render. |
| Angular Material — https://material.angular.dev/components/datepicker and https://material.angular.dev/guide/i18n                                                                            | `MAT_DATE_LOCALE` defaults to `LOCALE_ID`; provider overrides at bootstrap; `DateAdapter.setLocale()` changes locale at runtime. The library does not persist locale | Adopt token precedence, runtime method, and no library persistence    | clr-lift needs the same bootstrap/runtime split for message dictionaries; today it has only the runtime half.    |
| Angular core — https://angular.dev/guide/i18n and `LOCALE_ID`                                                                                                                                | `LOCALE_ID` is the app-wide locale token; CLDR data is registered by the app                                                                                         | Adopt as the primary automatic source                                 | An explicit application locale still takes priority for apps with a separate i18n service.                       |
| NG-ZORRO — http://ng-zorro.github.io/docs/i18n/en                                                                                                                                            | `NZ_I18N` token provides copy; `NzI18nService.setLocale(en_US)` changes it at runtime                                                                                | Adopt token + service split                                           | Confirms a provider is additive to the existing service API.                                                     |
| MUI — https://mui.com/guides/localization and https://mui.com/x/react-data-grid/localization/                                                                                                | Locale text configured globally via `createTheme`/`ThemeProvider` and per component via `localeText`; no library-owned persistence                                   | Reject theme coupling; adapt the global default + local override idea | Angular apps use DI, not a theme object; `loadClarityCommonStrings` already covers local overrides.              |

## Developer learning journey and pedagogy plan

| Reader task / prerequisites                                      | Learning outcome                       | Destination / page type                          | Working example and expected result                                                                                  | Validation                                                                |
| ---------------------------------------------------------------- | -------------------------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Bootstrap an Angular app with clr-lift; know what `LOCALE_ID` is | Seed clr-lift from a stored preference | `libs/clr-lift/README.md`, Built-in Localization | `provideClrLiftI18n({locale: 'fr'})` in `appConfig.providers`; alert/tooltip strings render in French on first paint | Unit test asserts active language and Clarity strings before first render |
| Rely on the Angular locale                                       | Explain precedence over the browser    | README example                                   | `provideClrLiftI18n()` with `LOCALE_ID = 'ja'` wins over `navigator.language = 'de-DE'`                              | Unit test sets both sources                                               |
| Add a language selector                                          | Switch at runtime without reloading    | README example                                   | `inject(ClrLiftI18nService).setLanguage(code)` from the selector handler                                             | Unit test observes `currentLanguage` and Clarity keys after the call      |

No new demo route is added: the existing demo language switcher already exercises runtime switching, and the bootstrap
sources are covered by unit tests. Demo prose in all eleven locales is unchanged.

## Public API and examples

Proposed and implemented in this PR:

```typescript
export interface ClrLiftI18nOptions {
  locale?: string;
}

export function provideClrLiftI18n(options?: ClrLiftI18nOptions): EnvironmentProviders;
```

Resolution order: explicit `locale` → `LOCALE_ID` → `navigator.language` (browser platform only) → `en`. Empty or
whitespace-only option values are ignored. The provider calls `setLanguage(language)`, and neither it nor
`ClrLiftI18nService` writes `localStorage`. Angular always provides `LOCALE_ID` (default `en-US`); the browser and final
`en` steps are defensive fallbacks.

Minimal Angular-locale example:

```typescript
import {ApplicationConfig} from '@angular/core';
import {provideClrLiftI18n} from 'clr-lift';

export const appConfig: ApplicationConfig = {
  providers: [provideClrLiftI18n()],
};
```

Preference-driven application with dynamic switching:

```typescript
export const appConfig: ApplicationConfig = {
  providers: [provideClrLiftI18n({locale: resolvePreference()})],
};

// In the application's language selector:
const translationService = inject(ClrLiftI18nService);
translationService.setLanguage(code);
```

Passing `LOCALE_ID` into `locale` is redundant: the provider already reads that token. `locale` is for a value that
**differs** from `LOCALE_ID`. When the locale arrives after an API call, omit `locale` and forward the response with
`setLanguage()`; a `provideAppInitializer` can await the request before bootstrap. The README and integration guide own
the consumer examples for that case.

Form integration: none. This API owns no value and performs no validation.

## Behavior and architecture

`provideClrLiftI18n` returns `makeEnvironmentProviders([provideEnvironmentInitializer(...)])`. The initializer injects
`ClrLiftI18nService`, optional `LOCALE_ID`, and `PLATFORM_ID`; reads `navigator.language` only when
`isPlatformBrowser(PLATFORM_ID)` is true; resolves the language; then calls `setLanguage(language)` and
`syncClrCommonStrings(language)` synchronously. The explicit sync avoids a first-render window where Clarity's native
strings would still be English while clr-lift pipes already use the new language. The existing root-service effect keeps
strings aligned on later changes.

There is no subscription, timer, persistence write, or returned handle; the initializer is one-shot. SSR is supported by
ignoring a server host's `navigator` entirely. Invalid locale tags keep the existing canonicalisation and English
fallback semantics; the provider never throws for a bad tag.

## Clarity, accessibility, and localization

No new owned strings, no new keyboard/focus journeys, and no new ARIA labels. The provider reuses `ClrLiftI18nService`'s
existing `html[lang]` and `html[dir]` effect, which is the mechanism assistive technology uses to select a voice and RTL
layout. Eleven dictionaries are unchanged; `pnpm run i18n:check` must still pass. Independent human language acceptance
is not part of this change because no message text changed in this PR; the upload-copy change in the base branch is a
separate increment with its own review record. Manual assistive-technology review remains waived by the maintainer
decision recorded in the acceptance contract.

## Demo and validation plan

- Focused unit tests for all six use cases, including precedence, server platform, invalid tag, and persistence
  independence.
- `pnpm nx test clr-lift`, `pnpm run i18n:check`, `pnpm run lint`, `pnpm run typecheck`, `pnpm run format:check`,
  `pnpm run build:libs`, `pnpm run verify:packages`, and `git diff --check HEAD`.
- The installed-package smoke test imports and invokes `provideClrLiftI18n` with `ClrLiftI18nOptions` from the packed
  `clr-lift` package.
- No browser E2E change: no visible component or interaction was added. The existing language-switcher E2E continues to
  cover runtime changes.

## Compatibility, rollout, and risks

The provider is additive and tree-shakeable, with no peer range change or new dependency. Removing library-owned
persistence is a **breaking behavior change**: `STORAGE_KEY_LANGUAGE` is removed, `setLanguage` takes one argument, and
applications that relied on `clr-lift-lang` must read their own preference storage and pass it through `locale` or
`setLanguage()`. The demo does this explicitly with `demo-language-preference.ts`. The service is also renamed from
`TranslationService` to `ClrLiftI18nService` with **no old alias**: applications importing `TranslationService` from
`clr-lift` must rename the import. The dsm-ui application has no such import today, so it is unaffected. These breaking
changes need a major release decision by the maintainers. Risk: callers may expect the browser setting to win over
`LOCALE_ID`; it does not, by decision of the maintainer. Applications that want browser language should provide
`LOCALE_ID` from `navigator.language`, matching Angular guidance.

## Review decisions and delivery

Decision: keep one provider with a single `locale` option. Alternatives considered: a `language$` input that subscribes
inside the provider (rejected because `setLanguage()` already provides the runtime seam and a subscription would add
disposal semantics), a `persist` option (rejected: Angular Material does not persist locale and the application owns
preference storage), and `useBrowserLanguage` (rejected: the maintainer chose `LOCALE_ID` before browser). Recommended
option is the recorded API above. Implementation is one increment: provider, export, tests, README guidance, the
application setup section of the integration guide, the installed-package smoke test, and this spec.

### Spec review record (2026-11-24)

Applied all [review aspects](../../../.agents/skills/spec-review/references/review-aspects.md):

| Aspect                | Verdict          | Evidence                                                                                                                                                                                                                   |
| --------------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Admission             | Pass             | Admission table above; no core test fails.                                                                                                                                                                                 |
| Consumer evidence     | Pass             | Named use cases for applications with a preference source or Angular locale, outside the demo.                                                                                                                             |
| Industry comparison   | Pass             | Clarity, Angular Material, Angular core, NG-ZORRO and MUI rows with 2026-11-24 URLs.                                                                                                                                       |
| API design            | Pass             | One provider, one option; no dual-mode parameter.                                                                                                                                                                          |
| Contracts             | Pass             | Typed signature, no-op on empty option; additive provider with breaking i18n changes recorded in Compatibility.                                                                                                            |
| Form applicability    | Pass             | Explicit no-value/no-CVA statement.                                                                                                                                                                                        |
| Accessibility         | Pass             | No new UI; existing `html[lang]`/`[dir]` effect retained.                                                                                                                                                                  |
| Language              | Pass             | No new string or dictionary change.                                                                                                                                                                                        |
| Dependency and bundle | Pass             | No new runtime dependency or entry point.                                                                                                                                                                                  |
| Lifecycle and safety  | Pass             | One-shot initializer, SSR guard, no storage or global DOM mutation.                                                                                                                                                        |
| Tests and demos       | Waiver requested | Bootstrap sources are covered by unit tests, not a new demo page; the modes cannot coexist in one app and the existing demo switcher covers runtime changes. Owner: maintainers decide at PR review; no waiver is assumed. |
| Evidence separation   | Pass             | Automated checks, human language acceptance and the existing AT waiver are separate.                                                                                                                                       |
| Codebase gaps         | Pass             | Spec indexed from `docs/design/README.md` and cross-linked from `runtime-presentation-design-spec.md`.                                                                                                                     |
| Fit and sequence      | Pass             | Roadmap position: additive i18n bootstrap utility with breaking i18n changes recorded in Compatibility. Release decision: no version bump in this PR; a major release decision is still required before publication.       |

Disposition: **Scope approved** by the maintainer instructions recorded in the header. No blocking finding. This
self-review does not grant merge or publication approval.

### Diff and PR comment record (2026-11-24)

- Two-axis diff review of the first commit found three Standards hard findings and six Spec findings; all were fixed in
  the follow-up commit (failure branches, docs imports/labels, waiver wording, command name, README persistence,
  increment scope). Judgement-call smells were deliberately retained: the resolver is intentionally a pure function.
- Maintainer inline comments: remove localStorage persistence and follow Material's locale precedence. Both were
  adopted: `ClrLiftI18nService` no longer reads or writes `clr-lift-lang`, `setLanguage` takes one argument, and the
  provider resolves `locale` → `LOCALE_ID` → browser. A further industry-standard review found the legacy service
  storage still present; that is removed in this PR, with the demo owning its preference storage.
- Bot findings: server `navigator` misuse (fixed with `PLATFORM_ID`), missing installed-provider smoke test (fixed in
  `verify-packages.mjs`), pending approval (process note, no code), upload copy outside this increment (spec wording
  clarified after rebase), local/internal references in public docs (replaced with primary-source URLs), and missing
  JSDoc tags (added `@param`/`@returns`).
- A second industry-standard review found the legacy service persistence and a non-decisive SSR test. Both are fixed:
  `ClrLiftI18nService` has no storage or `persist` parameter, the demo owns its preference, and a server-platform test
  with no Angular locale proves the platform guard. JSDoc was added to the exported resolver.
- Third review: the README's browser-locale snippet read `navigator` on the server in a shared config, and the demo
  ignored a preference previously saved under `clr-lift-lang`. Both are fixed: the snippet uses `isPlatformBrowser`, and
  the app-owned demo reader treats the old key as a migration fallback while writing only the new key. Consumer docs now
  cover API-provided locales, when `provideClrLiftI18n` is unnecessary, and why `LOCALE_ID` should not be passed into
  `locale`.
- Maintainer request: rename `TranslationService` to `ClrLiftI18nService` without an old alias. Applied across source,
  tests, guides, API docs and the installed-package smoke test; dsm-ui was verified to have no import of the old symbol.
  `CHANGELOG.md` keeps the historical 21.6.0 names and has an `[Unreleased]` note superseding them.
- Final review: fixed the approval record, CHANGELOG migration entry, incomplete code examples, release wording, the
  untested "absent `navigator`" SSR branch, duplicated locale resolution, and local names that did not match their
  class. Shared resolution now lives in `locale-resolution.ts`; both the provider and the service call it.
- Follow-up bot comments: E2E locale seeding now uses `demo-lang` instead of the retired library key, the demo
  preference helpers have `@returns`/`@param` tags, and the spec no longer calls the whole change additive.

## Evidence

Recorded on 2026-11-24 after the rebase onto `main`. Local automated verification, not merge approval, human language
acceptance, CI, or publication:

- `pnpm nx test clr-lift --skip-nx-cache`: 43 files, 581 tests passed; `i18n-providers.spec.ts` 13/13 passed.
- `pnpm nx test demo --skip-nx-cache`: 92 files, 349 tests passed.
- `pnpm run build:clr`, `pnpm run verify:packages` (including the installed-provider smoke test), `pnpm run test:tools`,
  `pnpm run i18n:check`, `pnpm run lint`, `pnpm run typecheck`, `pnpm run format:check`, and `git diff --check HEAD`:
  all passed.
- An earlier full run showed one unrelated `query-devtools.component.spec.ts` timeout; the test passed on re-run. E2E
  and CI gates remain separate. No message text changed in this PR, so no human language review was needed here.
