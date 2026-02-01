# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [19.0.0] - TBD

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
