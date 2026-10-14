# Priority 1 and 2 production contracts

This document records the loading, localization and lifecycle contracts completed for PR #147. Current validation and
release evidence are in [the production review](../reviews/pr-147-production-review-2026-10-14.md).
[简体中文说明](./priority-1-2-completion.zh-CN.md).

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
automatic peer installation. The consumer compiles with strict TypeScript settings and runs public imports. The
publication workflow defaults to a dry run, validates its inputs and builds both packages even for a selected-project
release. A dry run requires no npm token, creates no version commit or tag, and performs no publication.

## Localization

All eleven demo dictionaries must contain every English key, including API descriptions. CI rejects missing or unknown
keys, blank text, changed interpolation placeholders, translation artifacts and changed quoted concurrency/status
options. Dictionaries load asynchronously; API tables recompute when the selected language or loaded dictionary changes.
Clarity common strings cover all upstream keys, with a test that detects new upstream strings.

Translations were AI-assisted and technically reviewed for API names, concurrency behavior, retry safety and
placeholders. This is not independent native-speaker sign-off; linguistic approval remains an external acceptance item.

```typescript
translationService.loadClarityCommonStrings('de-DE', {close: 'Custom close'});
translationService.setLanguage('de-DE');
```

Every switch resets against upstream and English defaults before applying base and exact locale overrides. Custom
partial locales therefore cannot retain strings from the previously selected language.

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

Diagnostic keys are detached copies, and the total pending count includes obsolete transports still in flight. The demo
refreshes every second and stops on destruction. Real mounted consumers test shared keys with different stale, polling
and GC policies, destruction and independent scope keys. Shared keys continue to use the documented conservative
combined policy; scoping uses distinct query keys or clients.

Certificate clocks accept a callback returning Date or a timestamp. Signals satisfy that callback and drive reactive
status changes. Bind `[clock]="now"` or provide `CERTIFICATE_CLOCK`; custom clocks own their advancement. The default
browser clock advances every minute and cleans up with its injector. Each status evaluation samples the clock once.

## Compatibility

`computedAsync` implementation and types are unchanged. Its error-as-value typing debt belongs in a separately designed
major release or a separately named opt-in API. A Result wrapper would require consumers to unwrap values in
assignments, property reads, templates and previous-value callbacks. Changing the default to throwing would instead
change runtime error behavior. This PR makes neither change.
