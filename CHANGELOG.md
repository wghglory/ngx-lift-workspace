# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), using
[Semantic Versioning](https://semver.org/spec/v2.0.0.html), with explicit maintainer-approved compatibility exceptions
recorded for the affected releases.

## [Unreleased]

### Breaking compatibility notes

The upload/reactive API review fixes include the following incompatible corrections. No release version or new 21.x
compatibility exception is approved by these notes; follow the [version policy](docs/deployment.md#version-policy).

- `poll` callbacks receiving the `forceRefresh` input must accept `Input | undefined`, because the first timer tick can
  precede any source emission. Handle absence in `paramsBuilder` or the direct `pollingFn`. Zero-argument callbacks do
  not need to change.
- `SignalForm.value` now uses Angular's enabled-value type, `FormGroup<TControls>['value']`, with optional fields for
  disabled children. `rawValue` uses `ReturnType<FormGroup<TControls>['getRawValue']>`. Use field signals for individual
  controls or `rawValue()` for payloads that must include disabled controls; otherwise handle optional fields.
- Zero-argument validator callbacks remain installed as dispatchers even when initially returning `null`. Getter results
  still select the effective validators, but a null result does not require `control.validator === null`. Pass
  `[validator]` when `hasValidator` or validator removal needs the original callback identity. Existing one-argument
  `resolveValidators()` calls remain supported.
- `UploadComponent.disabledState` changes from a writable signal to a read-only derived signal. Consumers writing
  `disabledState.set()` must use the component's `disabled` input or the Angular form control's enable/disable API.
  Existing component input/output names and the chosen-file value contract remain supported.

See the [review index](docs/reviews/upload-and-reactive-apis.md) for the historical findings, fix disposition, and
validation boundaries.

## [21.7.0] (ngx-lift) / [21.6.0] (clr-lift) - 2026-11-25

**Release decision — November 25, 2026 (approved):** the maintainer approved the localization API changes below as a
separate 21.x compatibility exception. Both packages remain on Angular 21; 22.x stays reserved for the Angular 22
upgrade. This release is intentionally incompatible for consumers of the removed localization APIs. Publish `ngx-lift`
before `clr-lift`; complete installed-consumer verification and the publication dry run before publication.

**Development-tool deferral — November 25, 2026 (accepted):** the maintainer accepted deferring the two moderate
`@hono/node-server` and `qs` development-tool dependency findings tracked in
[issue #260](https://github.com/wghglory/ngx-lift-workspace/issues/260) and
[draft PR #261](https://github.com/wghglory/ngx-lift-workspace/pull/261) beyond this release. Both library manifests
have no runtime dependencies. Keep the follow-up open; this is a deferral rather than a verified dependency repair.
Normal release validation remains required.

### Fixed

- Upload queue treats every rejected chunk as a failure, including empty rejection reasons, and skips finalization until
  all chunks are acknowledged. Cancelling a transfer restores reported bytes to acknowledged chunks. Removing an active
  item also tolerates a synchronous adapter cleanup failure.
- Upload large-text browser coverage waits for the shared panel to become visible before measuring its geometry.
- Object filtering reads each own value once, preserving the exact value checked by a type guard. Widened options cannot
  incorrectly select positive narrowing, and reusable guards support literal-valued sources.
- `isEqual` accepts unrelated value shapes without explicit generic arguments, retaining explicit-generic compatibility.

### Added

- `ngx-lift` exports the transport-agnostic `UploadQueueService`, adapter and lifecycle contracts, chunk presets,
  progress signals, cancellation, phase-aware retry and promise-based completion.
- `clr-lift` adds the `cll-upload` file-selection form control and shared non-modal upload panel, with folder selection,
  localized file-type, size and per-selection count validation, keyboard controls, transfer telemetry and a minimized
  dock.
- Upload composition demos cover promises, HttpClient and query/mutation utilities. The application-owned S3 demo and
  transport guides explain whole-object PUT, cancellation, immutable destination settings and chunk sizing.
- `pickBy` now narrows retained values from explicit or inferred type guards. Literal negation and the deprecated
  `omitBy` alias exclude the guarded value type. Keys remain optional; boolean predicates retain `Partial<T>`.
- `clr-lift` exports `provideClrLiftI18n` and `ClrLiftI18nOptions` for bootstrap locale configuration. Resolution order
  is application locale → `LOCALE_ID` → browser locale on the browser platform → English.

### Changed — breaking, maintainer-approved 21.x exception

- `clr-lift` renames `TranslationService` to `ClrLiftI18nService` with no old alias. Applications importing
  `TranslationService` must rename the import.
- `ClrLiftI18nService` no longer reads or writes `clr-lift-lang`, `STORAGE_KEY_LANGUAGE` is removed, and `setLanguage`
  takes one argument. Applications own preference storage and pass the resolved locale through `locale` or
  `setLanguage()`; the demo uses `demo-language-preference.ts` as an example migration.
- The historical 21.6.0 note about `MockTranslationService` being exported is superseded: the test helper is now
  `MockClrLiftI18nService`, is not in the root barrel, and its old name is removed by this rename.
- `provideClrLiftI18n` and `ClrLiftI18nService` share one locale-resolution helper, so bootstrap and service defaults
  cannot drift. These incompatible changes are covered by the November 25 release decision above.

### Localization migration

- Replace `TranslationService` imports and injections with `ClrLiftI18nService`.
- Remove `STORAGE_KEY_LANGUAGE` imports and manage saved language preferences in the application. Pass the resolved
  locale to `provideClrLiftI18n({locale})` during bootstrap.
- Replace two-argument `setLanguage` calls with `setLanguage(locale)` and save preferences in application-owned code.
- Tests using the removed `MockTranslationService` root export should supply an application-owned test double or use the
  real `ClrLiftI18nService` when verifying localization behavior.

## [21.6.0] (ngx-lift) / [21.5.0] (clr-lift) - 2026-11-20

**Release decision — November 20, 2026 (approved):** both packages remain on 21.x while the supported platform remains
Angular 21; 22.x stays reserved for the Angular 22 upgrade. The `buildObjectPathBreadcrumbs` return-type change and the
removal of the datagrid selection directives in `clr-lift`, and the `dateRangeValidator` and `urlValidator` /
`httpsValidator` behavior changes in `ngx-lift`, are an explicit maintainer-approved exception to SemVer's major-bump
rule. This is not a claim of backward compatibility. Peer ranges stay unbounded; publish `ngx-lift` before `clr-lift`
and confirm strict installed consumers. This approval does not cover later incompatible changes; see the
[version policy](docs/deployment.md#version-policy).

### Added

- `ngx-lift` exports `addCalendarDays(date, days)` for nonmutating local-calendar arithmetic. Offsets must be safe
  integers; invalid dates and Date overflow throw. The date-range demo uses this export with Angular `formatDate`
  instead of private calendar/formatting helpers. See the
  [calendar-day arithmetic specification](docs/design/ngx-lift/local-calendar-utilities-design-spec.md).

- `ngx-lift` exports four Reactive Forms validator factories (`integerValidator`, `jsonValidator`,
  `fileExtensionValidator`, `sameValueValidator`) and two supporting types (`NamedFile`, `FileSelection`). Each factory
  allows empty values, returns one documented error key, and is pure — the group validator reports its error on the
  group, never calls `setErrors` on child controls, and ignores disabled child controls so that a disabled field cannot
  leave an unfixable group error. The [design specification](docs/design/ngx-lift/standard-validators-design-spec.md)
  records the API, the scope decisions from the PR #138 review, and the deferred proposals. Four localized demo pages
  document the validators with working playgrounds. API approval was recorded on 2026-11-16.
- `ngx-lift` exports `getValueByPath` and `deleteValueByPath` for safe, own-property dot-path reads and in-place
  deletes. `getValueByPath<T>` returns `T | undefined` when the path is missing, invalid or reaches prototype state;
  `deleteValueByPath` reports whether an own property was removed. Numeric array segments are supported. The
  [core utilities specification](docs/design/ngx-lift/core-utilities-design-spec.md) and a localized demo page document
  the contract.
- `ngx-lift` exports `downloadFile` for browser downloads from string or Blob content, with temporary URL and anchor
  cleanup. It starts a download without confirming the file was saved; see the
  [core utilities specification](docs/design/ngx-lift/core-utilities-design-spec.md).
- `clr-lift` also exports `BuildObjectPathResult`, `ObjectPathError`, `ObjectPathErrorCode`, `ObjectPathNavigation` and
  `EncodedObjectPathLocation` alongside `buildObjectPathBreadcrumbs`. `navigation` owns URL encoding and optional
  collection prefixing; the deprecated `hrefFor` path remains available.

### Breaking

The November 20, 2026 release decision above approves these 21.x compatibility exceptions.

- **`buildObjectPathBreadcrumbs` return type (`clr-lift`).** The helper no longer returns `readonly BreadcrumbItem[]`.
  It returns a discriminated `BuildObjectPathResult` (`{ok: true, items}` or `{ok: false, error}`) and settles invalid
  application input in the error branch instead of throwing. The array-returning shape was released in clr-lift 21.4.0;
  the new behavior belongs to this release.
- **Datagrid selection directives removed (`clr-lift`).** `DatagridSelectionAccessorDirective` and
  `DatagridSelectionBindingDirective` are no longer exported. `DatagridSelectionComponent` is the only CVA and
  value-control module. See [ADR-0003](docs/adr/0003-datagrid-selection-single-value-control.md).

### Migration

- Object-path breadcrumbs: check `result.ok` before reading `result.items`, and branch on `result.error.code` instead of
  catching construction exceptions. Prefer `navigation.destination` over `hrefFor`; the helper now owns encoding and
  collection prefixing.

  ```typescript
  const result = buildObjectPathBreadcrumbs({bucket, key, kind, emptySegmentLabel, navigation});
  if (result.ok) showTrail(result.items);
  else showError(result.error.code, result.error.message);
  ```

- Datagrid selection: remove the accessor/binding directives and bind the form directly to `cll-datagrid-selection`. A
  reusable picker accepts the page-owned control; read and submit selected keys from that same control. No mirrored
  `keys` model or synchronization helper is required.

### Fixed

- Validator demo pages and the
  [compatibility specification](docs/design/ngx-lift/standard-validators-design-spec.md#existing-validator-upgrade-compatibility)
  explain optional URL fields, required-field migration, and local calendar dates versus instants. The date page
  presents ordered examples for required/optional dates, one-sided and inclusive/exclusive bounds, and date-time
  comparisons. These notes clarify behavior in this release; they do not change validator logic.

- The floating query devtools launcher is now a 32px translucent button docked against the right viewport edge. Drag it
  away from footer controls and release to snap right; focused Up/Down and Home/End keys also reposition it. Placement
  survives reloads for the session and stays within the safe viewport after resizing. Hover/focus restores full opacity;
  dragging does not open the inspector. `provideQueryDevtools()` and inline launchers are unchanged.

- **`dateRangeValidator` (`ngx-lift`).** A date-only value or boundary (`YYYY-MM-DD`, the format produced by
  `<input type="date">`) is now read as the local calendar day it names instead of UTC midnight. The UTC parse resolved
  to the previous local day west of UTC, so a value the user had just picked could be rejected as too early (or accepted
  one day too late). Values that carry a time or an offset keep their instant semantics, and an impossible day such as
  `2026-02-31` still reports `invalidDate`. The demo date-range page derives its `min`/`max` hints from local calendar
  values for the same reason. **Migration:** this is an observable behavior change even though the signature is
  unchanged. Pass the `YYYY-MM-DD` string for calendar-day boundaries; `new Date('2024-01-01')` still means an instant
  (UTC midnight, the previous local day west of UTC), and a full ISO timestamp such as `'2024-01-01T09:00:00Z'` is the
  way to pin an exact moment.
- **`urlValidator` and `httpsValidator` (`ngx-lift`).** Empty values (`null`, `undefined`, `''`) are valid, matching the
  other ngx-lift validators and the
  [standard validators contract](docs/design/ngx-lift/standard-validators-design-spec.md). Previously empty input
  reported `invalidUrl`, which duplicated `Validators.required` and left an optional URL field permanently invalid. A
  whitespace-only value is still rejected. **Migration:** a field whose requiredness relied on the URL validator alone
  is now optional, so add `Validators.required` wherever empty input must still be rejected.
- Unit tests also run once in `America/New_York` in CI, so calendar-day and daylight-saving behavior is exercised
  instead of passing trivially on a UTC runner.

## [21.5.0] (ngx-lift) / [21.4.0] (clr-lift) - 2026-11-09

**Release decision — November 8, 2026 (approved and published on 2026-11-09):** both packages remain on 21.x while the
supported platform remains Angular 21; 22.x stays reserved for the Angular 22 upgrade. Package versions remain
independent. The `node-forge` certificate API removal and the `toSignalForm` error-propagation change are **behaviorally
breaking**. Shipping them in these 21.x minor releases is a second explicit, maintainer-approved exception to SemVer's
major-bump rule, not a claim of backward compatibility. The October 17, 2026 decision was not blanket approval for later
breaks and does not cover this release; see the [version policy](docs/deployment.md#version-policy).

The reviewed versions were published to the official npm registry on 2026-11-09. Remote tags, GitHub release records,
the publish workflow run, the PR E2E gate and packed-consumer checks are the release evidence. This section owns the
release notes and migration instructions; publication is a separate gate.

### Added

- `clr-lift` exports `BreadcrumbComponent` (`cll-breadcrumb`), `BreadcrumbItem` and `BreadcrumbLinkContext` for
  caller-owned navigation. Includes ordinary/SPA links, form-safe addressless actions, localized current-location
  semantics, and the inherited `--cll-breadcrumb-font-size` CSS property. The working database/server demo and
  [design specification](docs/design/clr-lift/breadcrumb-design-spec.md) document this first short-trail increment.
  Responsive collapse defaults to four actual items, preserves root/current, and adapts to container and typography
  changes. An anchored scrollable panel exposes all supplied ancestors and full labels without shifting content. The
  trail's font-size setting leaves the ancestor panel at Clarity's default typography and line spacing. Includes
  localized 30-level width/font/path-replacement demos and keyboard/focus handling. Above twenty hidden ancestors, a
  labeled local label/context filter preserves current context, supports empty-result recovery and announces matching
  counts. A separate 100-level supplied-item playground exercises filtering, language and layout changes.
- `clr-lift` exports `buildObjectPathBreadcrumbs`, `BuildObjectPathBreadcrumbsOptions` and `ObjectPathLocation` for
  synchronous exact-key bucket/prefix/object trails with caller-owned destinations and permitted roots. Includes a
  localized fixture-backed bucket browser and [usage/reference guide](docs/guides/object-path-breadcrumbs.md).
- `clr-lift` exports `DatagridSelectionComponent` (`cll-datagrid-selection`), `DatagridSelectionAccessorDirective` and
  `DatagridSelectionBindingDirective` for caller-written native Clarity datagrids inside Angular forms. Stable
  single/multiple keys survive filtering, paging, refreshed objects and owner writes; availability, native loading,
  disabled/readonly guards, composite focus, required validation and a reusable picker adapter are included. See the
  [design specification](docs/design/clr-lift/datagrid-selection-design-spec.md) and
  [acceptance record](docs/design/clr-lift/datagrid-selection-acceptance.md).
- `ngx-lift` exports `QueryResourceDisabledError` and `QueryResourceDisposedError`. `queryResource.execute()` rejects
  with one of these when its definition is `undefined` or the observer was destroyed; error messages and transport
  failures are unchanged. Installed-consumer verification covers both exports. See
  [Failure and recovery](docs/design/ngx-lift/query-resource-design-spec.md#failure-and-recovery).
- `mutateResource().mutate(args, options)` accepts optional per-call `onSuccess` / `onError` callbacks that receive the
  result or failure together with that invocation's arguments. Callback faults are isolated as developer diagnostics and
  never change the write outcome or its returned Promise. `onSettled` is deliberately not offered; use the returned
  Promise's `.finally()`. See
  [Per-call outcome callbacks](docs/design/ngx-lift/mutate-resource-design-spec.md#per-call-outcome-callbacks).
- The `queryResource` demo adds a runnable edit-form example. An effect initializes a stable reactive form when the
  query value changes, including same-entity refetches. Save reads the mutation ref's state.
- `clr-lift` exports `KeyValueControlComponent` (`cll-key-value-control`), `KeyValueEntry`, `KeyValueFieldConfig`,
  `KeyValueOption`, `keyValueErrors` and the related typed editor and validation helpers. This is an ordered array-value
  CVA for `ngModel`, typed Reactive Forms and `toSignalForm`, with text/select/typed editors, custom validation and
  unique-pair checks; the existing `cll-key-value-inputs` FormArray editor is unchanged. Delivered October 19, 2026; see
  the [design specification](docs/design/clr-lift/key-value-inputs-design-spec.md).
- `AlertComponent` (`cll-alert`) adds `closable`, a two-way `closed` model and a `closedChange` output, so callers can
  suppress dismissal, control the open/closed state and observe dismissal or reopening. `closable` defaults to `true`
  and the close label is localized; existing templates keep their visible close button.

### Breaking

- **Certificate APIs and dependency (`clr-lift`).** The `node-forge` peer dependency, the stateful `CertificateService`
  and its `CERTIFICATE_CLOCK` injection token were removed. Certificate parsing and fingerprinting now use synchronous,
  dependency-free browser APIs. The `CertificateComponent` `certificate` input and the exported parser expose the local
  `X509Certificate` type instead of `node-forge`'s `pki.Certificate`. The `CertificateClock` and `CertificateStatus`
  types remain exported. Consumers that injected the service, provided the token, typed against `pki.Certificate` or
  installed `node-forge` only for this library must migrate; see the
  [certificate design specification](docs/design/clr-lift/certificate-design-spec.md).

- **`toSignalForm` error propagation (`ngx-lift`).** The change recorded under Changed below throws at a signal read
  where it previously returned stale state. It is covered by the same approved compatibility exception.

### Migration

- Certificates: replace the service and token with the exported parser functions; the signpost no longer accepts a clock
  override (it uses the browser clock internally).

  ```typescript
  import {extractDerFromPem, parseCertificateFromPem, type X509Certificate} from 'clr-lift';

  // Before: certificateService.getCertificateFromPem(pem, pemEncoded)
  const certificate: X509Certificate = parseCertificateFromPem(pem, pemEncoded);

  // Before: certificateService.getCertificateHashes(pem, pemEncoded)
  // Use extractDerFromPem with the exported md5 / sha1 / sha256 digest functions.
  const der = extractDerFromPem(pem, pemEncoded);

  // Before: providers: [{provide: CERTIFICATE_CLOCK, useValue: clock}]
  // After: no clock override is exposed — the signpost uses the browser clock internally.
  //         Drop the provider; for tests, mock the browser clock (e.g. fake timers) instead.
  ```

- Peer ranges: the packages declare unbounded peers (`@angular/* >=21`, `@clr/angular >=18`, `rxjs >=7.8.0`,
  `ngx-lift >=21`); we verified on Angular 21 / Clarity 18 / RxJS 7, and later majors are unverified. Upgrade `ngx-lift`
  to 21.5.0 before installing `clr-lift` 21.4.0. Remove an explicit `node-forge` dependency if it was added only for
  `clr-lift`.
- `toSignalForm`: handle a terminal source error at the read site, or rebuild the facade with a healthy control. Stock
  Angular `FormGroup` / `FormControl` event streams do not error.

### Changed

- **Compatibility:** `toSignalForm` control and form signals now rethrow a terminal source Observable error when read,
  matching Angular `toSignal` instead of logging it and silently returning stale state. Reads of the affected signal and
  of signals derived from it keep rethrowing that error until the helper or facade is recreated; a signal that is never
  read reports nothing. Consumers that relied on the stale-value fallback must handle the error at the read site, or
  rebuild the facade with a healthy control. Stock Angular `FormGroup` / `FormControl` event streams do not error, so
  this concerns non-standard controls and failures inside the internal RxJS pipeline. Maintainer-approved in the
  2026-11-08 contract follow-up; see
  [Compatibility, rollout, and risks](docs/design/ngx-lift/reactive-forms-design-spec.md#compatibility-rollout-and-risks).
  The release decision above records the approval required for this change.
- **Release verification:** the isolated installed consumer now resolves from the official npm registry instead of the
  workspace mirror, derives its `jsdom`, `@types/node` and TypeScript versions from the workspace manifest, and allows
  more time for a fresh install. The publication workflow releases `ngx-lift` before `clr-lift` when both are selected.

### Deprecated

- `MockTranslationService` remains exported from the `clr-lift` root barrel for existing test suites, but it is a test
  helper and must not be used in application code. Register a dictionary on `TranslationService` instead. Removing it
  from the public barrel requires a separate breaking-release decision.
- `IdleDetectionModule` is deprecated in favour of `provideIdleDetectionConfig(...)`.
- `MutateResourceOptions.invalidatesTags` remains a deprecated alias for `invalidateTags`; the newer option takes
  precedence when both are supplied. Removal requires an explicit breaking-release decision.

### Fixed

- The `toSignalForm` demo API reference now matches the exported types, and packed-consumer verification covers dynamic
  control lifecycle behavior and error propagation in zoneless and ZoneJS modes.
- Documentation-only contract alignment: the `resourceAsync` spec now lists every shipped option and its exact callback
  semantics (including the removed `execute({onSuccess, onError})` shape), the query/mutation specs record the
  observer-level no-callback decision and the outcome tutorial. The mutation accessibility paragraph, `reload()` boolean
  wording and queued `concat` pending state are corrected. `MutateResourceRef.invalidationError` stays optional as a
  diagnostic-only signal, not a control-flow gate for submit handlers.
- The `mutateResource` demo includes a runnable per-call callback playground (success, failure and `.finally()` cleanup)
  that reuses existing translation keys; no new route, dictionary key or library-owned message was added.
- The 21.1.0 release notes described a `toSubmitValue` `pick` option and a `resourceAsync.execute({onSuccess, onError})`
  shape that were never shipped. Historical entries are preserved, but the current API surface is the authority:
  `ToSubmitValueOptions` offers `omit`, `omitEmptyStrings`, `omitNull`, `omitIf`, `includeDisabled`, `deep` and
  `transform`, and `execute()` accepts a value rather than callbacks. See the
  [reactive forms specification](docs/design/ngx-lift/reactive-forms-design-spec.md) and the
  [resourceAsync specification](docs/design/ngx-lift/resource-async-design-spec.md).
- The `clr-lift` README now names the releases that introduced `cll-breadcrumb`, `cll-key-value-control` and the query
  devtools, and both locale lists name the same eleven supported locales. The delivery roadmap cited the 21.5.0 / 21.4.0
  publication rather than the older 21.4.0 / 21.3.0 pair at release time; the roadmap is now the canonical status
  source.
- The private workspace root manifest version, the `commit-msg` hook and the Nx `sharedGlobals` cache inputs were
  aligned with the release process. Direct `publish:*` scripts that bypassed the reviewed-version gate were replaced
  with a read-only `release:check` preflight.

### Release boundary

- The current [acceptance contract](docs/guides/accessibility-and-localization.md) owns the independent language
  approval, the manual assistive-technology waiver and the automated-check boundary for this release. The waiver is not
  a passed assessment.
- SSR/hydration and a broad peer-version matrix are not established by the installed Angular 21.2 browser consumer.
- Dependency advisory triage and the 2026-11-10 WebKit shard 5 E2E timeouts remain separate follow-ups.
- These versions were published to the official npm registry on 2026-11-09. Remote tags, GitHub release records, the
  publish workflow run, the PR E2E gate and packed-consumer checks are the publication evidence.

## [21.4.0] (ngx-lift) / [21.3.0] (clr-lift) - 2026-10-18

**Release decision — October 17, 2026:** both packages remain on 21.x; 22.x is reserved for the Angular 22 upgrade. The
maintainer accepts the behavioral breaks below in these 21.x minor releases. This is an explicit exception to SemVer,
not backward-compatible behavior; see the [version policy](docs/deployment.md#version-policy).

The [release workflow](https://github.com/wghglory/ngx-lift-workspace/actions/runs/39095608373) passed full validation,
three-browser E2E and npm authentication, then published both packages to the official registry with the `latest` tag.
Fresh packed consumers and the publication dry run also passed before publication.

### Added

- `clr-lift` exports `QueryDevtoolsComponent`: a resizable nonmodal query panel with bounded data/error inspection,
  lowercase state badges, datagrid filtering/sorting/pagination and targeted refetch/copy actions.
- `provideQueryDevtools()` from `clr-lift/devtools` installs one floating root launcher; the production export is a
  no-op. `QueryClient.refetchQuery(key)` reuses an existing entry without creating queries or observers.
- Ordered delivery roadmap and installed Angular 21 query-consumer checks in zoneless and ZoneJS modes.
- `mutateResource` accepts `invalidateTags` as a static array or success-only `(result, args)` callback, matching
  `QueryClient.invalidateTags`. The previous `invalidatesTags` spelling remains a deprecated compatibility alias; the
  new option takes precedence when both are supplied, including an empty array.

### Breaking

- computedAsync now throws unhandled failures on reads instead of returning errors as T. Typed onError fallbacks remain
  data; callback exceptions throw on reads. The false throwOnError option is rejected, and initialized sources and
  fallbacks must match T. Include undefined explicitly in T when needed. Existing source recovery is preserved. See the
  migration below and the computedAsync design specification.
- IdleDetectionService interruption events no longer reset the active countdown phase. Ordinary user activity (mouse
  movement, keystrokes, clicks) leaves warning countdowns running; only explicit `resetTimer(true)` confirmation resets
  the countdown and starts a fresh idle cycle.

### Migration

- `computedAsync`: remove `throwOnError: false`. Provide a typed `onError` fallback when failures should produce data;
  otherwise handle a thrown read outside template evaluation. Include `undefined` in `T` if it is a valid fallback.

  ```typescript
  // In an Angular injection context; the loader is unchanged.
  const count = computedAsync(() => loadCount(), {initialValue: 0, onError: () => 0});
  const optional = computedAsync<number | undefined>(() => loadCount(), {
    initialValue: 0,
    onError: () => undefined,
  });
  ```

- Idle warnings: call `idleDetectionService.resetTimer(true)` only when the user explicitly confirms continuation.
  Ordinary activity and `resetTimer()` preserve an active warning countdown. Application-owned session renewal remains
  separate from resetting the UI timer.

### Changed

- Vitest/UI/coverage updated to 4.1.11; PostCSS minimum raised to 8.5.23, with scoped development-tool overrides.
  Angular and Nx upgrades are deferred to the maintainer; their pins match the existing main-branch baseline.

## [21.3.0] (ngx-lift) / [21.2.0] (clr-lift) - 2026-10-14

**Compatibility notice:** the maintainer selected minor versions for these recent APIs despite the removed
`observableLoader` export and changed FileReader encoding default. Migrate adapter imports to native loaders; set
`[textEncoding]="'latin1'"` for legacy encoded byte strings. clr-lift now requires ngx-lift `>=21.3.0 <22`. Publication
jobs and GitHub release records succeeded; mirrored registry metadata contains both published versions.

### Added

- Native `Observable<T> | PromiseLike<T>` loaders across query entry points, with first-value Observable settlement.
- `queryResources(items, definition, options?)` for homogeneous dynamic collections, with stable refs and typed
  `item()`.
- Opt-in read retries, total deadlines, focus/reconnect recovery and client-level terminal error reporting.
- Initial/refresh error signals, retry metadata, application configuration through `provideQueryClient`, and detached
  diagnostics.
- A separate queryResources demo, a progressive queryResource guide, Clarity controls and consistent state labels.
- Strict installed-package consumer coverage, including a mounted zoneless Angular query consumer for session isolation,
  cancellation, refresh recovery, collection lifecycle and scoped writes.

### Changed

- Query adapters no longer require the public `observableLoader` wrapper. This removes a public export; migrate to
  native loaders and select a release version with an explicit SemVer review. See
  [native loader contract](docs/design/ngx-lift/query-resource-design-spec.md).
- #143–#147 also contain retry-policy, validation, file encoding, localization, scoped-service and package-quality
  changes. See the API design specifications for their consumer contracts.

### Fixed

- Query observer/reporter exceptions cannot strand reads or replace transport results; deadlines and obsolete
  generations preserve settlement and publication boundaries.
- Query diagnostics use one clock/visibility sample and count unsettled logical reads, including retry waits.
- Public documentation now reflects actual mutation signals and tag invalidation. Shared optimistic rollback is
  deferred.

### Release boundary

These versions have published release records. Dependency advisory triage and independent language acceptance remain
separate follow-ups. Subsequent source changes belong under Unreleased and require a new release/version decision.
SSR/hydration and a broad peer-version matrix are not established by the browser consumer fixture.

## [21.2.0] (ngx-lift) / [21.1.0] (clr-lift) - 2026-10-12

### 🎉 Added

- **`ngx-lift` - Shared multi-observer query caching architecture (`QueryClient`, `queryResource`, `mutateResource`):**
  - **`QueryClient`**: Centralized multi-observer query cache manager providing request deduplication, stale time, cache
    time, manual/automatic invalidation, garbage collection, and query observer notifications
    ([#142](https://github.com/wghglory/ngx-lift/pull/142))
  - **`queryResource`**: Reactive signal resource integrated with `QueryClient`, supporting typed query keys, background
    revalidation and multi-subscriber sharing ([#142](https://github.com/wghglory/ngx-lift/pull/142))
  - **`mutateResource`**: Standardized mutation primitive for executing async writes, cache invalidations, and state
    tracking (`isLoading`, `status`, `value`, `error`) ([#142](https://github.com/wghglory/ngx-lift/pull/142))
  - **Observable facades**: `fetchQueryObservable` exposes one result and `observeQueryObservable` streams snapshots
    ([#142](https://github.com/wghglory/ngx-lift/pull/142))
  - **Query models & tokens**: Full TypeScript definitions (`QueryKey`, `QueryDefinition`, `MutateResourceOptions`,
    `QuerySnapshot`) and `QUERY_CLIENT` injection token ([#142](https://github.com/wghglory/ngx-lift/pull/142))
- **`ngx-lift` - Kubernetes resilience operators & interceptor:**
  - **`k8sRetryBackoff` operator**: Specialized RxJS operator that handles Kubernetes HTTP 429 (Too Many Requests)
    errors with exponential backoff and server-sent `Retry-After` header inspection
    ([#142](https://github.com/wghglory/ngx-lift/pull/142))
  - **`k8sRetryBackoffInterceptor`**: Angular HTTP interceptor for automatic, transparent Kubernetes 429 retry backoff
    across HTTP calls ([#142](https://github.com/wghglory/ngx-lift/pull/142))
  - **`kubernetesPagination` operator enhancements**: Built-in 429 retry support enabled by default
    (`{retryConfig: true}`), legacy HTTP parameter preservation, and robust continuation token handling
    ([#142](https://github.com/wghglory/ngx-lift/pull/142))
  - **`KubernetesStatus` model**: Type-safe parser and model definitions for Kubernetes status responses
    ([#142](https://github.com/wghglory/ngx-lift/pull/142))
- **`clr-lift` - Reactive localization architecture:**
  - **`TranslationService`**: Reactive internationalization service supporting dynamic runtime language switching,
    fallback locales, dictionary registration, and placeholder interpolation (`{param}`)
    ([#142](https://github.com/wghglory/ngx-lift/pull/142))
  - **`TranslatePipe`**: Template pipe for reactive inline translation lookups
    ([#142](https://github.com/wghglory/ngx-lift/pull/142))
  - **Component localization (`*.l10n.ts`)**: Built-in localized message bundles across all Clarity Lift components
    (`Alert`, `CertificateSignpost`, `FileReader`, `IdleDetection`, `KeyValueInputs`, `StatusIndicator`, `ThemeToggle`,
    `TimelineWizard`, `Toast`, `Tooltip`) ([#142](https://github.com/wghglory/ngx-lift/pull/142))

### 🔄 Changed

- **`resourceAsync` parameters & architecture:**
  - Structured separation between tracked reactive parameters and untracked network execution via `{params, loader}`
    ([#142](https://github.com/wghglory/ngx-lift/pull/142))
  - Relocated public query resources to dedicated `query/` path while maintaining unified root package exports
    ([#142](https://github.com/wghglory/ngx-lift/pull/142))
- **Emptiness utilities:**
  - `isEmpty` and `isNotEmpty` return `boolean` without unsound type narrowing on nullable empty collections (`[]`,
    `{}`) ([#142](https://github.com/wghglory/ngx-lift/pull/142))

### 🐛 Fixed

- **`resourceAsync` lifecycle & settlement:**
  - Prevented race conditions, dropped emissions, and zombie callbacks; superseded or reset `.execute()` calls reject
    with `ResourceAsyncCancelledError`, and executions on disposed resources reject with `ResourceAsyncDisposedError`
    ([#142](https://github.com/wghglory/ngx-lift/pull/142))
  - Subscriber isolation ensuring detached observers are not notified of subsequent cache revisions
    ([#142](https://github.com/wghglory/ngx-lift/pull/142))
- **`computedAsync` error recovery:**
  - Keeps reactive stream alive when inner source observable errors, restoring proper dependency tracking
    ([#142](https://github.com/wghglory/ngx-lift/pull/142))
- **`isEqual` cycle symmetry:**
  - Fixed symmetric circular object graph equality comparison to handle self-cycles and multi-node cycles symmetrically
    regardless of parameter order ([#142](https://github.com/wghglory/ngx-lift/pull/142))
- **`clr-lift` component lifecycles & memory cleanup:**
  - **`Tooltip`**: Corrected overlay positioning, focus management, manual visibility toggling, and cleanup on component
    destruction ([#142](https://github.com/wghglory/ngx-lift/pull/142))
  - **`FileReader`**: Fixed file input resetting, touched states, and memory cleanup
    ([#142](https://github.com/wghglory/ngx-lift/pull/142))
  - **`TimelineWizard`**: Fixed step transitions, lifecycle cleanup on unmount, and reactive step validation
    ([#142](https://github.com/wghglory/ngx-lift/pull/142))
  - **`Alerts`**: Fixed multi-alert container positioning and auto-dismissal timers
    ([#142](https://github.com/wghglory/ngx-lift/pull/142))

### 💥 Breaking Changes

- **Nullable collection emptiness predicates:**
  - `isEmpty()` and `isNotEmpty()` return `boolean` and no longer narrow nullable collections to non-empty types; check
    nullability (`items != null`) explicitly prior to accessing collection members.
- **Signal combinators initialization:**
  - `combineFrom()` without an initial value returns `undefined` until async sources emit.
  - `mergeFrom()` requires at least one synchronous emission or an explicit `{initialValue}` option for purely
    asynchronous streams; preserves explicit `null` initial values.
- **`resourceAsync` execution rejection:**
  - Cancelled or superseded `resourceAsync.execute()` calls reject with `ResourceAsyncCancelledError` instead of
    resolving to stale data.
- **Kubernetes pagination retry default:**
  - `kubernetesPagination` retries HTTP 429 status codes by default; opt out explicitly via `{retryConfig: false}`.

See the [API design specifications](docs/design/README.md) for contracts and examples.

## [21.1.1] - 2026-09-23

### 🎉 Added

- **`resourceAsync` enhancements:**
  - Added function overloads to accurately type `value()` as `Signal<T>` when `initialValue` or `defaultValue` is
    provided, and `Signal<T | undefined>` when omitted ([#135](https://github.com/wghglory/ngx-lift/pull/135),
    [#136](https://github.com/wghglory/ngx-lift/pull/136))
  - Added `defaultValue` option as an alias for `initialValue` matching Angular's `resource()` API
    ([#135](https://github.com/wghglory/ngx-lift/pull/135))
  - Updated JSDoc documentation and examples with complete type signatures and edge-case coverage
    ([#136](https://github.com/wghglory/ngx-lift/pull/136))

## [21.1.0] - 2026-09-20

### 🎉 Added

- **`toSignalForm`** - Comprehensive reactive signal facade for Angular reactive forms (`FormGroup`):
  - Dynamic type-safe signal access for control values (`sf.value.<field>()`), dirty state (`sf.dirty.<field>()`),
    touched state (`sf.touched.<field>()`), valid/invalid state (`sf.valid.<field>()`, `sf.invalid.<field>()`), pending
    state (`sf.pending.<field>()`), and errors (`sf.errors.<field>()`)
  - Form-level reactive signals: `value`, `valid`, `invalid`, `dirty`, `touched`, `pristine`, `pending`, `errors`
  - Declarative bindings:
    - `bindIf`: conditionally enable/disable form controls based on reactive boolean signals or predicates
    - `bindDisabled`: declaratively disable controls based on signals or predicates
    - `revalidate`: automatically re-run validation when dependent signals change
  - `toSubmitValue`: extract sanitized submit payloads with `omit` fields, `pick` fields, and nested group unwrapping
  - Automatic lifecycle cleanup tied to the active injection context (`DestroyRef`)
- **`resourceAsync` enhancements:**
  - `execute()` now returns a typed `Promise<T | null>` resolving upon mutation completion or rejecting on error
    ([#131](https://github.com/wghglory/ngx-lift/pull/131))
  - `reset()` method to restore the resource to its initial state or a specified custom value
    ([#131](https://github.com/wghglory/ngx-lift/pull/131))
  - Support for `onSuccess` and `onError` callbacks inside `execute({ onSuccess, onError })` for per-call mutation
    handling

### 🔄 Changed

- **Signal utilities:**
  - Decoupled manual injector requirements and improved reactivity across `computedAsync`, `resourceAsync`,
    `combineFrom`, and `mergeFrom` ([#129](https://github.com/wghglory/ngx-lift/pull/129))
  - Migrated workspace to zoneless change detection and modern Vitest environment
    ([#122](https://github.com/wghglory/ngx-lift/pull/122))

### 🐛 Fixed

- **`computedAsync`**: Keep reactive pipeline alive when inner source observable errors
  ([#128](https://github.com/wghglory/ngx-lift/pull/128))
- **`resourceAsync`**: Prevent dropped emissions when `reload()` is triggered rapidly during active requests
  ([#128](https://github.com/wghglory/ngx-lift/pull/128))

## [21.0.0] - 2026-05-28

### 💥 Breaking Changes

- **Angular 21 & Clarity 18 upgrade:** Upgraded workspace and peer dependencies to Angular 21, TypeScript 5.9, and
  Clarity 18 ([#118](https://github.com/wghglory/ngx-lift/pull/118),
  [#121](https://github.com/wghglory/ngx-lift/pull/121))

## [19.1.0] - 2026-02-07

### 🎉 Added

- **`resourceAsync`** - New reactive resource function for managing async operations with full state tracking
  - Automatic request cancellation when dependencies change
  - Manual `reload()` and `execute()` methods
  - Lazy loading support with `lazy: true` option
  - Error handling with fallback values via `onError` callback
  - Two behaviors: `switch` (default) and `exhaust`
  - Granular status tracking: `idle`, `loading`, `reloading`, `resolved`, `error`
  - Similar to Angular's `httpResource` but works with Observables, Promises, and sync values
- **`ResourceStatus`** - New type for resource status tracking
- **`createTrigger`** - New utility for creating manual trigger signals
- Migration tools and guide in `migration/` folder to help users upgrade from v1.x to v19.x

### 💥 Breaking Changes

- **`AsyncState` interface changed:**
  - **Property renamed:** `loading` → `isLoading`
  - **New property added:** `status: ResourceStatus` for granular state tracking
  - **Affects operators:** `createAsyncState`, `switchMapWithAsyncState`, `poll`

  **Before (v1.x):**

  ```typescript
  interface AsyncState<T, E = HttpErrorResponse> {
    loading: boolean;
    error: E | null;
    data: T | null;
  }

  // Usage
  if (state.loading) {
    /* ... */
  }
  ```

  **After (v19.x):**

  ```typescript
  interface AsyncState<T, E = HttpErrorResponse> {
    status: ResourceStatus;
    isLoading: boolean;
    error: E | null;
    data: T | null;
  }

  // Usage
  if (state.isLoading) {
    /* ... */
  }
  // Or use status for more granular control
  if (state.status === 'loading') {
    /* ... */
  }
  ```

  **Migration:**

  ```bash
  # Download migration script
  curl -o migrate-async-state.js https://raw.githubusercontent.com/wghglory/ngx-lift-workspace/main/migration/migrate-async-state.js

  # Run migration
  node migrate-async-state.js src

  # Or manual find/replace
  # Replace: state.loading
  # With: state.isLoading
  ```

  See [Migration Guide](./migration/README.md) for detailed instructions.

### 🔄 Changed

- **`createAsyncState`** operator now returns `AsyncState` with new interface
- **`switchMapWithAsyncState`** operator now returns `AsyncState` with new interface
- **`poll`** operator now returns `AsyncState` with new interface
- **`computedAsync`** enhanced with better error handling and documentation
- **`combineFrom`** improved type safety and error handling
- **`mergeFrom`** improved type safety and documentation

### 🐛 Fixed

- ESLint warnings in test files (type safety improvements)
- Non-null assertions in tests replaced with proper null checks

### 📚 Documentation

- Added comprehensive demo for `resourceAsync` with 7 interactive examples
- Enhanced JSDoc comments for all new APIs
- Updated README with `resourceAsync` documentation
- Added migration guide for AsyncState breaking change

---

## [1.10.3] - 2025-05-29

### 🐛 Fixed

- **`combineFrom`** can now be used with `input.required()` ([#95](https://github.com/wghglory/ngx-lift/issues/95))

## [1.10.2] - 2025-05-19

### 🐛 Fixed

- **clr-lift:** File reader now correctly marks as touched when initial control value is provided
  ([#92](https://github.com/wghglory/ngx-lift/issues/92))

## [1.10.1] - 2025-02-26

### 🔄 Changed

- Internal maintenance release

## [1.10.0] - 2025-02-26

### 🎉 Added

- Various enhancements and improvements ([#88](https://github.com/wghglory/ngx-lift/issues/88))

## [1.9.0] - 2024-12-23

### 🎉 Added

- **Kubernetes models and operator** for K8s resource management ([#85](https://github.com/wghglory/ngx-lift/issues/85))

## [1.8.0] - 2024-11-01

### 🔄 Changed

- Internal maintenance release

## [1.7.3] - 2024-10-09

### 🎉 Added

- **Idle detection utility and component** for tracking user inactivity

### 🐛 Fixed

- Timeline component missing imports

## [1.7.2] - 2024-09-20

### 💥 Breaking Changes

- **Minimum Angular version:** Now requires Angular 17+ (signals support)

### 🎉 Added

- **clr-lift components:**
  - Callout component for highlighted messages
  - Certificate signpost component
  - Timeline wizard component for multi-step flows ([#22](https://github.com/wghglory/ngx-lift/issues/22))
  - Key-value inputs component
  - Alert component with content projection
  - Toast notifications
  - Tooltip component ([#33](https://github.com/wghglory/ngx-lift/issues/33))
  - Status indicator component
  - Spinner component
  - File reader component
  - Theme toggle and theme service for dark mode ([#4](https://github.com/wghglory/ngx-lift/issues/4))
- **ngx-lift operators:**
  - `combineFrom` - Combine signals and observables
  - `combineLatestEager` - Combine observables with force option
  - `mergeFrom` - Merge signals and observables
  - `createNotifier` - Create event notifiers
  - `distinctOnChange` - Execute callback on value change
  - `poll` - Polling with configurable interval ([#32](https://github.com/wghglory/ngx-lift/issues/32))
  - `dgState` - Datagrid state management operator
- **ngx-lift signals:**
  - `computedAsync` - Async computed signals
  - `injectParams` - Reactive route parameters
  - `injectQueryParams` - Reactive query parameters
- **ngx-lift validators:**
  - `dateRangeValidator` - Validate date ranges
  - `intersectionValidator` - Validate array intersections
  - `uniqueValidator` - Validate unique values
  - `urlValidator` - Validate URLs
  - `httpsValidator` - Validate HTTPS URLs ([#28](https://github.com/wghglory/ngx-lift/issues/28))
  - `ifValidator` - Conditional validation ([#31](https://github.com/wghglory/ngx-lift/issues/31))
  - `ifAsyncValidator` - Conditional async validation ([#31](https://github.com/wghglory/ngx-lift/issues/31))
- **ngx-lift pipes:**
  - `isHttps` - Check if URL is HTTPS ([#28](https://github.com/wghglory/ngx-lift/issues/28))
  - `mask` - Mask sensitive data ([#29](https://github.com/wghglory/ngx-lift/issues/29))
  - `arrayJoin` - Join arrays ([#23](https://github.com/wghglory/ngx-lift/issues/23))
  - `byteConverter` - Convert bytes to human-readable format ([#23](https://github.com/wghglory/ngx-lift/issues/23))
  - `range` - Generate number ranges
- **ngx-lift utilities:**
  - `isIP`, `isFQDN`, `isURL`, `isHttps` - Network validation utilities
  - `isEmpty`, `isEqual`, `pickBy`, `omitBy` - Object/array utilities
  - `differenceInDays` - Date calculation utility
  - `logger` - Logging utility with generic types
  - Translation service for i18n
  - Locale data registration

### 🐛 Fixed

- Tooltip not displaying template reference variables
- Tooltip not showing when content is empty
- Alert not displaying inner error message
- Alert error handling when error is null
- Date range validator incorrectly validating empty inputs
- `switchMapWithAsyncState` loading state issue ([#30](https://github.com/wghglory/ngx-lift/issues/30))
- Unit test error messages ([#17](https://github.com/wghglory/ngx-lift/issues/17))

### 🔄 Changed

- Tooltip delay default value changed to 0ms
