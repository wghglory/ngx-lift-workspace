<div align="center">

# ⚡ ngx-lift

**Powerful Angular utilities to supercharge your development workflow**

[![npm version](https://img.shields.io/npm/v/ngx-lift.svg?logo=npm)](https://www.npmjs.com/package/ngx-lift)
[![npm downloads](https://img.shields.io/npm/dm/ngx-lift.svg)](https://www.npmjs.com/package/ngx-lift)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Angular](https://img.shields.io/badge/Angular-%3E%3D21.0.0-red.svg)](https://angular.dev)

[📖 Documentation](https://ngx-lift.netlify.app) • [🎮 Live Demo](https://ngx-lift.netlify.app) •
[💻 Source Code](https://github.com/wghglory/ngx-lift-workspace/tree/main/libs/ngx-lift)

</div>

---

A comprehensive Angular utility library designed to enhance and simplify your Angular development experience.
**ngx-lift** provides a battle-tested collection of utilities, operators, signals, pipes, and validators that streamline
common Angular development tasks and boost productivity.

**Why ngx-lift?**

- 🚀 **Production-Ready** - Used in real-world applications
- 📦 **Tree-Shakable** - Import only what you need
- 🎯 **Type-Safe** - Full TypeScript support with strict mode
- ⚡ **Modern** - Built for Angular with Signals support
- 🧪 **Well-Tested** - Comprehensive test coverage
- 📚 **Well-Documented** - Extensive documentation and examples

This README follows the main branch. Check the
[release history](https://github.com/wghglory/ngx-lift-workspace/blob/main/CHANGELOG.md) for availability in your
installed version; source changes under Unreleased are not yet on npm.

## Features

### 🚀 RxJS Operators

- **`combineLatestEager`** - Combines observables with eager initial values
- **`createAsyncState`** - Transforms observables into async state objects with loading/error/data
- **`distinctOnChange`** - Executes callbacks when observable values change
- **`kubernetesPagination`** - Handles Kubernetes-style pagination with automatic HTTP 429 retry backoff
- **`logger`** - Logging operator for debugging RxJS streams
- **`poll`** - Polling operator with configurable intervals and manual refresh triggers
- **`retryOnK8sBackoff`** - Retries on HTTP 429 ("storage is (re)initializing") with backoff based on `Retry-After`
  header or `details.retryAfterSeconds`
- **`startWithTap`** - Combines `startWith` and `tap` operators
- **`switchMapWithAsyncState`** - Combines `switchMap` with async state management

### 🌐 HTTP Interceptors

- **`k8sRetryBackoffInterceptor`** - Functional HTTP interceptor (`HttpInterceptorFn`) for retrying Kubernetes HTTP 429
  responses with backoff
- **`createK8sRetryBackoffInterceptor`** - Factory to create an interceptor with custom default backoff settings
- **`K8S_RETRY_BACKOFF_CONFIG`** - HttpContext token to customize or bypass 429 retry on specific requests

### ⚡ Signal Utilities

- **`combineFrom`** - Combines Observables and Signals into a Signal (like `combineLatest`)
- **`computedAsync`** - Creates computed signals from async sources (Observables, Promises)
- **`createTrigger`** - Creates a trigger signal for manual updates
- **`injectParams`** - Injects route parameters as signals
- **`injectQueryParams`** - Injects query parameters as signals
- **`mergeFrom`** - Merges Observables and Signals into a Signal (like `merge`)
- **`resourceAsync`** - 🆕 Reactive resource for managing async operations with reload, cancellation, and full state
  tracking (similar to Angular's `httpResource`)
- **`toSignalForm`** - 🆕 Reactive signal facade for Angular `FormGroup` with strongly-typed field signals, dynamic
  control bindings (`bindIf`, `bindDisabled`, `bindValidators`, `revalidate`), and clean sanitized submission value
  (`submitValue`)

### 🔄 Query & Caching

- **`QueryClient`** - Shared transport and cache manager coordinating request deduplication, cache invalidation via
  scoped tags, garbage collection, and multi-observer polling
- **`queryResource`** - Reactive Signal adapter connecting Angular views to shared cached queries with automatic
  deduplication, stale-while-revalidate, and coordinated polling
- **`queryResources`** - Dynamic collections of independent query observers, preserving refs on reorder and exposing
  per-row loading, failure and recovery state
- **`mutateResource`** - Explicit writes with mutation state, parallel/exhaust/concat concurrency and scoped tag
  invalidation. Shared optimistic cache updates and rollback are not implemented
- **Observable services** - `fetchQueryObservable` emits one cached read; `observeQueryObservable` streams live
  snapshots

### 🔧 Pipes

- **`arrayJoin`** - Joins array elements with a separator
- **`byteConverter`** - Converts bytes to human-readable format (KB, MB, GB, etc.)
- **`isHttps`** - Checks if a URL uses HTTPS protocol
- **`mask`** - Masks sensitive data (e.g., credit cards, emails)
- **`range`** - Generates an array of numbers within a range

### ✅ Validators

- **`dateRangeValidator`** - Validates date ranges in forms
- **`intersectionValidator`** - Validates array intersections
- **`UniqueValidator`** - Validates unique values in arrays
- **`urlValidator` / `httpsValidator`** - Validate URL format

### 🛠️ Utilities

- **Form Utilities** - Helper functions for working with Angular forms
- **Idle Detection** - Service and utilities for detecting user idle state
- **URL Utilities** - Functions for URL manipulation and validation
- **Object Utilities** - `isEmpty`, `isEqual`, `isPromise`, `omitBy`, `pickBy`
- **Date Utilities** - `differenceInDays` and other date helpers
- **Range Utilities** - Functions for generating number ranges

### 📦 Models

- **`AsyncState`** - Async operation state with `status`, `isLoading`, `data` and `error` fields
- **`ResourceStatus`** - Type alias for resource status states
- **Kubernetes Models** - Types for Kubernetes object metadata and conditions

## Requirements

- **Angular**: >= 21.0.0
- **RxJS**: >= 7.8.0

## Installation

```bash
npm install ngx-lift
# or
pnpm add ngx-lift
# or
yarn add ngx-lift
```

### Historical migration from v1.x to v19.x

**Important:** v19.0.0 includes a breaking change to the `AsyncState` interface:

- `loading` property renamed to `isLoading`
- New `status` property added

**Automated Migration:**

We provide a migration script to automatically update your code:

```bash
# Quick one-liner (downloads and runs migration)
curl -sSL https://raw.githubusercontent.com/wghglory/ngx-lift-workspace/main/migration/download-and-migrate.sh | bash -s -- src

# Or manual download and run
curl -o migrate-async-state.js https://raw.githubusercontent.com/wghglory/ngx-lift-workspace/main/migration/migrate-async-state.js
node migrate-async-state.js src

# Preview changes first (dry run)
node migrate-async-state.js src --dry-run
```

See the [Migration Guide](https://github.com/wghglory/ngx-lift-workspace/blob/main/migration/README.md) for detailed
instructions and manual migration steps.

## 🚀 Quick Start

### Installation

```bash
npm install ngx-lift
# or
yarn add ngx-lift
# or
pnpm add ngx-lift
```

These complete standalone components use local fixtures, so the first task needs no backend. Replace a loader with
`HttpClient` only after configuring `provideHttpClient()` and your endpoint. Create signal/form helpers in an Angular
injection context, such as component field initializers.

### Display async state

The AsyncPipe owns the subscription. The preview shows loading, then Ada; `createAsyncState` represents a source error
as state rather than throwing it into the template.

```typescript
import {AsyncPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {createAsyncState} from 'ngx-lift';
import {delay, of} from 'rxjs';

@Component({
  selector: 'app-async-example',
  imports: [AsyncPipe],
  template: `
    @if (state$ | async; as state) {
      @if (state.isLoading) {
        <p>Loading...</p>
      }
      @if (state.error) {
        <p role="alert">Could not load the user.</p>
      }
      <p>{{ state.data?.name }}</p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsyncExampleComponent {
  readonly state$ = of({name: 'Ada'}).pipe(delay(300), createAsyncState());
}
```

For an owned periodic read, use `poll({interval: 5000, pollingFn: () => of({name: 'Ada'})})` in place of that stream.
The subscription starts polling; its final unsubscribe releases requests and timers. See the
[polling tutorial](https://ngx-lift.netlify.app/ngx-lift/operators/poll) for start, stop and refresh.

### Load a local reactive resource

Change the ID to replace the pending read. This resource owns its lifecycle; use `queryResource` below when observers
must share requests and cached data.

```typescript
import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {resourceAsync} from 'ngx-lift';
import {delay, of} from 'rxjs';

@Component({
  selector: 'app-resource-example',
  template: `
    <button type="button" (click)="userId.set(userId() + 1)">Next user</button>
    @if (user.isLoading()) {
      <p>Loading...</p>
    }
    @if (user.error()) {
      <p role="alert">Could not load the user.</p>
    }
    <p>{{ user.value()?.name }}</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceExampleComponent {
  readonly userId = signal(1);
  readonly user = resourceAsync(() => of({name: `User ${this.userId()}`}).pipe(delay(300)));
}
```

For a readonly async value without loading/reload state, use
[computedAsync](https://ngx-lift.netlify.app/ngx-lift/signals/computedAsync). Unhandled failures throw when reading its
signal; supply a typed `onError` fallback when recovery should produce data. The
[API selection guide](https://ngx-lift.netlify.app/ngx-lift/query/choosing) compares the async primitives.

### Observe an existing Reactive Form

Edit the username to change the submit preview. The confirmation field stays in the form but is omitted from the
payload. `toSignalForm` observes this FormGroup; it does not create a native Signal Forms field tree.

```typescript
import {JsonPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {toSignalForm} from 'ngx-lift';

@Component({
  selector: 'app-form-example',
  imports: [JsonPipe, ReactiveFormsModule],
  template: `
    <form [formGroup]="form">
      <label for="username">Username</label>
      <input id="username" formControlName="username" />
      <label for="confirmation">Confirmation</label>
      <input id="confirmation" formControlName="confirmation" />
    </form>
    <p>Valid: {{ sf.valid() }}</p>
    <pre>{{ sf.submitValue() | json }}</pre>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormExampleComponent {
  readonly form = new FormGroup({
    username: new FormControl('Ada', {nonNullable: true, validators: [Validators.required]}),
    confirmation: new FormControl('', {nonNullable: true}),
  });
  readonly sf = toSignalForm(this.form, {omit: ['confirmation']});
}
```

Continue with [conditional controls and validation](https://ngx-lift.netlify.app/ngx-lift/signals/toSignalForm).

### Share cached reads

A key identifies one response. Another observer with the same key shares the client entry and in-flight read. Reloading
retains previous data while refreshing; the starter distinguishes initial loading from that background state.

```typescript
import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {queryResource} from 'ngx-lift';
import {delay, of} from 'rxjs';

@Component({
  selector: 'app-query-example',
  template: `
    <button type="button" (click)="userId.set(userId() + 1)">Next user</button>
    <button type="button" (click)="user.reload()">Refresh</button>
    @if (user.isInitialLoading()) {
      <p>Loading...</p>
    }
    @if (user.isRefreshing()) {
      <p>Refreshing...</p>
    }
    @if (user.error()) {
      <p role="alert">Could not load the user.</p>
    }
    <p>{{ user.value()?.name }}</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueryExampleComponent {
  readonly userId = signal(1);
  readonly user = queryResource(() => {
    const id = this.userId();
    return {key: ['users', id], loader: () => of({name: `User ${id}`}).pipe(delay(300)), staleTime: 60_000};
  });
}
```

Follow the [query learning path](https://ngx-lift.netlify.app/ngx-lift/query/overview) for errors, saves, collections,
keys, invalidation, and diagnostics. `QUERY_CLIENT` has a root factory; `provideQueryClient(options)` customizes it.

### Use pipes and validators

Import standalone pipe classes such as `ByteConverterPipe`, `MaskPipe`, and `ArrayJoinPipe` into the component using
them. Masking takes an options object: `mask: {unmaskedPrefixLength: 0, unmaskedSuffixLength: 4}`; it has no card mode.
Use exported validators such as `urlValidator` directly in a FormControl's validators array. Start with the complete
[pipe examples](https://ngx-lift.netlify.app/ngx-lift/pipes/mask) and
[validator examples](https://ngx-lift.netlify.app/ngx-lift/validators/url), including imports and reset behavior.

Route-dependent helpers need a routed component and Router providers; follow the
[route parameter tutorial](https://ngx-lift.netlify.app/ngx-lift/signals/injectParams) instead of constructing them
outside a route.

## 📚 Documentation

- [Async & Query Design Specifications](https://github.com/wghglory/ngx-lift-workspace/blob/main/docs/design/README.md)
  - [resourceAsync Design Spec](https://github.com/wghglory/ngx-lift-workspace/blob/main/docs/design/ngx-lift/resource-async-design-spec.md)
  - [queryResource & QueryClient Design Spec](https://github.com/wghglory/ngx-lift-workspace/blob/main/docs/design/ngx-lift/query-resource-design-spec.md)
  - [mutateResource Design Spec](https://github.com/wghglory/ngx-lift-workspace/blob/main/docs/design/ngx-lift/mutate-resource-design-spec.md)
  - [computedAsync Design Spec](https://github.com/wghglory/ngx-lift-workspace/blob/main/docs/design/ngx-lift/computed-async-design-spec.md)

- **📖 Full Documentation**: [ngx-lift.vercel.app](https://ngx-lift.vercel.app/)
- **🎮 Interactive Demo**: [Live Examples](https://ngx-lift.vercel.app/)
- **💻 Source Code**: [GitHub Repository](https://github.com/wghglory/ngx-lift-workspace/tree/main/libs/ngx-lift)
- **📦 npm Package**: [npmjs.com/package/ngx-lift](https://www.npmjs.com/package/ngx-lift)

## 🎯 Use Cases

**ngx-lift** is perfect for:

- 🔄 **Async State Management** - Simplify loading/error/success states
- 📡 **Data Polling** - Poll APIs at intervals with manual refresh support
- 🛣️ **Route Management** - Access route params and query params as signals
- 📝 **Form Validation** - Advanced validators for complex forms
- 🔧 **Data Transformation** - Pipes for common data formatting needs
- ⚡ **Signal Integration** - Combine Observables and Signals seamlessly

## 🧪 Testing

Run the unit tests for ngx-lift:

```bash
pnpm nx test ngx-lift
```

Run tests with coverage:

```bash
pnpm nx test ngx-lift --coverage
```

## 🤝 Contributing

We welcome contributions! Whether you're fixing bugs, adding features, or improving documentation, your help makes this
project better.

- 🐛 **Found a bug?** [Open an issue](https://github.com/wghglory/ngx-lift-workspace/issues/new?template=bug_report.md)
- 💡 **Have a feature request?**
  [Request a feature](https://github.com/wghglory/ngx-lift-workspace/issues/new?template=feature_request.md)
- 📝 **Want to contribute?** See our
  [Contributing Guidelines](https://github.com/wghglory/ngx-lift-workspace/blob/main/CONTRIBUTING.md)

## 📄 License

**ngx-lift** is licensed under the [MIT License](https://opensource.org/licenses/MIT).

## ⭐ Show Your Support

If this library helped you, please consider giving it a ⭐ on GitHub!

---

<div align="center">

**Made with ❤️ for the Angular community**

[Report Bug](https://github.com/wghglory/ngx-lift-workspace/issues) •
[Request Feature](https://github.com/wghglory/ngx-lift-workspace/issues) •
[View Documentation](https://ngx-lift.netlify.app)

</div>

## Lifecycle and production contracts

See
[service scoping, clocks, localization and query diagnostics](https://github.com/wghglory/ngx-lift-workspace/blob/main/docs/guides/demo-and-library-integration.md)
for ownership and loading contracts.

For the query learning path, session isolation recipe, tested consumer scope and release boundary, see the
[query production guide](https://github.com/wghglory/ngx-lift-workspace/blob/main/docs/design/ngx-lift/query-resource-design-spec.md).
The demos for [queryResource](https://ngx-lift.netlify.app/ngx-lift/query/queryResource) and
[queryResources](https://ngx-lift.netlify.app/ngx-lift/query/queryResources) are separate pages. These links describe
the current source; deployment and npm publication are separate steps.
