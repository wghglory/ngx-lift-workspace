# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [21.2.0] (ngx-lift) / [21.1.0] (clr-lift) - 2026-10-12

### 🎉 Added

- **`ngx-lift` - Shared multi-observer query caching architecture (`QueryClient`, `queryResource`, `mutateResource`):**
  - **`QueryClient`**: Centralized multi-observer query cache manager providing request deduplication, stale time, cache
    time, manual/automatic invalidation, garbage collection, and query observer notifications
    ([#142](https://github.com/wghglory/ngx-lift/pull/142))
  - **`queryResource`**: Reactive signal resource integrated with `QueryClient`, supporting typed query keys, background
    revalidation, multi-subscriber sharing, and optimistic updates
    ([#142](https://github.com/wghglory/ngx-lift/pull/142))
  - **`mutateResource`**: Standardized mutation primitive for executing async writes, cache invalidations, and
    optimistic cache updates with full lifecycle tracking (`isPending`, `isSuccess`, `isError`, `data`, `error`)
    ([#142](https://github.com/wghglory/ngx-lift/pull/142))
  - **`queryObservable`**: Adapter for bridging RxJS Observables into `QueryClient` queries with first-value resolution
    and shared-request cancellation ([#142](https://github.com/wghglory/ngx-lift/pull/142))
  - **Query models & tokens**: Full TypeScript definitions (`QueryKey`, `QueryOptions`, `MutationOptions`, `QueryState`)
    and `QUERY_CLIENT` injection token ([#142](https://github.com/wghglory/ngx-lift/pull/142))
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

See [the migration guide](docs/MIGRATIONS.md) for detailed upgrade steps and code samples.

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
