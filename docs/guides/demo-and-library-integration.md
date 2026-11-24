# Demo and library integration

Shared loading, localization and lifecycle contracts.

## Loading and package consumers

The demo prepares escaped source synchronously and loads highlight.js at the code-rendering boundary. Copying decodes
prepared source once, so literal entities and TypeScript generics survive. Failed highlighting still displays safe
source. Certificate examples load on interaction with keyboard focus transferred to the loaded trigger. The file-reader
demo imports certificate validation asynchronously and blocks submission while validation is pending or unavailable.
Public library certificate parsing and validation remain synchronous.

`pnpm run bundle:check` inspects production build metadata: neither heavyweight dependency may enter the initial static
import graph or the static graph of either certificate-related route. This prevents moving a dependency to a lazy route
from being mistaken for component-level deferred loading.

`pnpm run verify:packages` packs both libraries and tests isolated installs with strict peer dependency checks and no
automatic peer installation. The consumer compiles with strict TypeScript settings and runs public imports. See
[publishing](../deployment.md) for the dry-run and release procedure.

## User API examples

User cards and datagrids use `UserService` to request `https://randomuser.me/api`; portrait URLs come from the response.
Refresh and lazy-load actions issue new HTTP requests, and failures propagate to each example's error handling. There is
no automatic local-data replacement. Browser tests intercept HTTP at the network boundary; production demos always use
the live API. The resource error-fallback example intentionally uses a local avatar.

## Localization

All eleven demo dictionaries must contain every English key, including API descriptions. CI rejects missing or unknown
keys, blank text, changed interpolation placeholders, translation artifacts and changed quoted concurrency/status
options. Dictionaries load asynchronously; API tables recompute when the selected language or loaded dictionary changes.
Clarity common strings cover all upstream keys, with a test that detects new upstream strings.

Translations were AI-assisted and technically reviewed for API names, concurrency behavior, retry safety and
placeholders. Independent language acceptance for all eleven locales was approved on 2026-11-08; see the
[acceptance contract](accessibility-and-localization.md). Automated and technical review remain separate evidence.

Applications set the initial language once at bootstrap. An explicit locale comes from the application's own preference
source; without one the provider follows Angular's `LOCALE_ID`, then the browser locale on the browser platform, then
English. The provider never persists a language, and runtime changes are forwarded to the same service.

`app.config.ts` (bootstrap):

```typescript
import {ApplicationConfig} from '@angular/core';
import {provideClrLiftI18n} from 'clr-lift';

export const appConfig: ApplicationConfig = {
  providers: [provideClrLiftI18n({locale: 'de'})],
};
```

`language.service.ts` (runtime, inside an injection context):

```typescript
import {inject, Injectable} from '@angular/core';
import {ClrLiftI18nService} from 'clr-lift';

@Injectable({providedIn: 'root'})
export class LanguageService {
  private readonly translationService = inject(ClrLiftI18nService);

  use(lang: string): void {
    this.translationService.loadClarityCommonStrings(lang, {close: 'Custom close'});
    this.translationService.setLanguage(lang);
  }
}
```

Every switch resets against upstream and English defaults before applying base and exact locale overrides. Custom
partial locales therefore cannot retain strings from the previously selected language.

### Locale that arrives after an API call

Use `provideClrLiftI18n({locale})` only when the locale is known synchronously at bootstrap. When `LOCALE_ID` is the
only source and no pre-render override is needed, the provider is unnecessary: `ClrLiftI18nService` reads that token on
construction. When the locale comes from a preference API, keep `provideClrLiftI18n()` for the fallback and forward the
response with `setLanguage()`. An app initializer can await the request before bootstrap:

`app.config.ts` (excerpt; `PreferenceService` belongs to the application):

```typescript
import {ApplicationConfig, inject, provideAppInitializer} from '@angular/core';
import {provideClrLiftI18n, ClrLiftI18nService} from 'clr-lift';
import {PreferenceService} from './preference.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClrLiftI18n(),
    provideAppInitializer(() => {
      const translationService = inject(ClrLiftI18nService);
      return inject(PreferenceService)
        .getLanguage()
        .then((lang) => translationService.setLanguage(lang));
    }),
  ],
};
```

If blocking bootstrap is not acceptable, call `setLanguage(lang)` from the component that receives the response. Do not
pass `LOCALE_ID` into `locale`: the provider already uses that token as its fallback. See the
[README](../../libs/clr-lift/README.md#-built-in-localization) for an SSR-safe browser-locale example.

## Shared services and query diagnostics

```typescript
// A feature injector isolates the service from the application's root instance.
providers: [...provideIdleDetectionService({idleDurationInSeconds: 300})];

// Direct managed consumers release their ownership on destruction.
const release = idleDetectionService.watch();
destroyRef.onDestroy(release);

// A point-in-time snapshot; callers choose their own refresh schedule.
const diagnostics = queryClient.getDiagnostics();
```

A component can instead use `[scoped]="true"`. Shared idle instances share configuration; isolate different timeout
policies. The last managed owner clears timers, while an explicitly started `startWatching()` owner retains control
until `clearTimers()` or injector destruction. Initial component configuration is applied before watching starts.

Query diagnostics and shared cache policies are defined in the
[query contract](../design/ngx-lift/query-resource-design-spec.md).

## Compatibility

Derived signal error handling is defined in the
[computedAsync contract](../design/ngx-lift/computed-async-design-spec.md).

`IdleDetectionService.observeState()` replays the current warning/countdown state. Switching to a fresh scope clears the
previous modal and countdown; joining an already-counting shared service renders its current state immediately. Ordinary
activity resets only the idle phase. Once the warning opens, mouse movement, scrolling and keystrokes neither dismiss it
nor extend the countdown. "Keep me signed in" calls `resetTimer(true)`, closing every modal observing the same service
and starting a fresh idle cycle. Existing event APIs remain available; the state stream completes with its injector.
