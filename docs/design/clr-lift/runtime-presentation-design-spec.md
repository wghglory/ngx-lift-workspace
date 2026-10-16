# Runtime language and theme services

Status: Implemented (contract audit). Owner: clr-lift maintainers. Updated: October 16, 2026. Package: clr-lift.
Approval: existing APIs; human language acceptance remains separate.

## Background

[TranslationService](../../../libs/clr-lift/src/lib/services/translation.service.ts) coordinates dictionaries, locale,
document direction and Clarity strings.
[ThemeService](../../../libs/clr-lift/src/lib/components/theme-toggle/theme.service.ts) coordinates a light/dark signal
with document attributes and storage. The [integration guide](../../guides/demo-and-library-integration.md) owns
application setup.

## Terminology

Requested language differs from resolved dictionary locale. Component translation keys use a namespace. Theme is
document presentation, not an Angular form value or a component-local visual preference.

## Goals

- G1: Update mounted consumers when language/dictionaries change, with predictable fallback/interpolation.
- G2: Keep Clarity/document language, direction and theme aligned while tolerating unavailable storage.

## Non-Goals

### Not now

ICU/plural message parsing, remote translation loading, per-subtree document themes or OS theme following.

### Outside this API

Native field ownership, persistence authorization, human translation approval and SSR request isolation.

## Use cases and acceptance

| ID  | Task               | Initial state/action              | Outcome                                         | Failure/recovery                              | Demo/test                    |
| --- | ------------------ | --------------------------------- | ----------------------------------------------- | --------------------------------------------- | ---------------------------- |
| L1  | Switch locale      | Mounted component/dictionaries    | Text, html lang/dir and Clarity strings update  | Missing keys fall back to English then marker | translation.service.spec.ts  |
| L2  | Load feature later | Register dictionary after render  | Dictionary version invalidates translated reads | Repeated warnings deduplicated                | translation/pipe regressions |
| L3  | Switch theme       | Stored dark/light; storage throws | body cds-theme and signal remain usable         | Default light when storage invalid            | theme.service.spec.ts        |

## Industry evidence and current gaps

Installed Clarity CommonStringsService owns framework strings; adapt its public localize API with locale fallbacks. Intl
canonicalization provides normalized language tags. These mechanisms establish key/layout behavior; dictionary parity
cannot establish linguistic accuracy.

## Public API and examples

```typescript
// In an Angular injection context.
import {inject} from '@angular/core';
import {ThemeService, TranslationService} from 'clr-lift';

const i18n = inject(TranslationService);
i18n.setLanguage('fr');
const theme = inject(ThemeService);
theme.setTheme('dark');
```

Register dictionaries with loadTranslationsForComponent(namespace, dictionaries). translate/translateWithLanguage accept
numbered interpolation arguments. setLanguage persists by default; assigning language uses the nonpersisting path. Theme
writes should use setTheme so signal, DOM and storage agree; directly writing the public signal updates only that
signal.

## Behavior and architecture

Translation initial language comes from saved preference, navigator, then English. Resolve exact/case-insensitive
locale, Chinese script/region, base language, then an available dialect. Missing keys fall back to English and finally a
visible marker; warnings are deduplicated until dictionary changes. `{0}` substitution retains unresolved placeholders.
An effect applies canonical html lang/dir and Clarity defaults with locale overrides. Storage errors are caught. Theme
reads the document window's storage, accepts dark or defaults light, and writes body cds-theme. Multiple service
instances still target the same document; injector scope alone does not isolate document-level presentation.

## Clarity, accessibility, and localization

Document direction covers RTL languages; individual layouts still need verification. Translate component close/action
labels and Clarity common strings. Test long labels, zoom and light/dark contrast. The services have no CVA or native
signal-field API; controls consume their output regardless of form system.

## Demo and validation plan

Adjacent translation/pipe/theme tests cover fallbacks, late registration, direction and denied storage. Existing locale
tooling checks dictionary keys/placeholders. Runtime language switching and human review are separate gates; refer to
the roadmap rather than inventing sign-off here.

## Compatibility, rollout, and risks

Angular 21/Clarity/browser APIs; no new dependency. Defensive DOM/storage access does not prove SSR/hydration request
isolation. No cross-tab storage-event synchronization or system-preference listener is implemented.

## Review decisions and delivery

Preserve fallback and nonpersisting assignment behavior. Add new locale engines or request-local SSR policy only with an
approved consumer use case and evidence. Keep dictionary completeness distinct from human acceptance.

## Evidence

Current services and existing adjacent tests inspected October 16, 2026. No translation, theme or browser tests rerun.
