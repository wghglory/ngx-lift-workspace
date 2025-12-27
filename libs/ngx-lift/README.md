<div align="center">

# ⚡ ngx-lift

**Powerful Angular utilities to supercharge your development workflow**

[![npm version](https://img.shields.io/npm/v/ngx-lift.svg?logo=npm)](https://www.npmjs.com/package/ngx-lift)
[![npm downloads](https://img.shields.io/npm/dm/ngx-lift.svg)](https://www.npmjs.com/package/ngx-lift)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Angular](https://img.shields.io/badge/Angular-%3E%3D19.0.0-red.svg)](https://angular.io)

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
- ⚡ **Modern** - Built for Angular 19+ with Signals support
- 🧪 **Well-Tested** - Comprehensive test coverage
- 📚 **Well-Documented** - Extensive documentation and examples

## Features

### 🚀 RxJS Operators

- **`combineLatestEager`** - Combines observables with eager initial values
- **`createAsyncState`** - Transforms observables into async state objects with loading/error/data
- **`distinctOnChange`** - Executes callbacks when observable values change
- **`kubernetesPagination`** - Handles Kubernetes-style pagination
- **`logger`** - Logging operator for debugging RxJS streams
- **`poll`** - Polling operator with configurable intervals and manual refresh triggers
- **`startWithTap`** - Combines `startWith` and `tap` operators
- **`switchMapWithAsyncState`** - Combines `switchMap` with async state management

### ⚡ Signal Utilities

- **`combineFrom`** - Combines Observables and Signals into a Signal (like `combineLatest`)
- **`computedAsync`** - Creates computed signals from async sources (Observables, Promises)
- **`createTrigger`** - Creates a trigger signal for manual updates
- **`injectParams`** - Injects route parameters as signals
- **`injectQueryParams`** - Injects query parameters as signals
- **`mergeFrom`** - Merges Observables and Signals into a Signal (like `merge`)

### 🔧 Pipes

- **`arrayJoin`** - Joins array elements with a separator
- **`byteConverter`** - Converts bytes to human-readable format (KB, MB, GB, etc.)
- **`isHttps`** - Checks if a URL uses HTTPS protocol
- **`mask`** - Masks sensitive data (e.g., credit cards, emails)
- **`range`** - Generates an array of numbers within a range

### ✅ Validators

- **`dateRange`** - Validates date ranges in forms
- **`intersection`** - Validates array intersections
- **`unique`** - Validates unique values in arrays
- **`url`** - Validates URL format

### 🛠️ Utilities

- **Form Utilities** - Helper functions for working with Angular forms
- **Idle Detection** - Service and utilities for detecting user idle state
- **URL Utilities** - Functions for URL manipulation and validation
- **Object Utilities** - `isEmpty`, `isEqual`, `isPromise`, `omitBy`, `pickBy`
- **Date Utilities** - `differenceInDays` and other date helpers
- **Range Utilities** - Functions for generating number ranges

### 📦 Models

- **`AsyncState`** - Type for managing async operation states
- **Kubernetes Models** - Types for Kubernetes object metadata and conditions

## Requirements

- **Angular**: >= 19.0.0
- **RxJS**: >= 7.8.0

## Installation

Install ngx-lift using your preferred package manager:

```bash
npm install ngx-lift
# or
yarn add ngx-lift
# or
pnpm add ngx-lift
```

## 🚀 Quick Start

### Installation

```bash
npm install ngx-lift
# or
yarn add ngx-lift
# or
pnpm add ngx-lift
```

### Using Operators

**Async State Management** - Transform observables into loading/error/data states:

```typescript
import {createAsyncState} from 'ngx-lift';
import {HttpClient} from '@angular/common/http';

export class UserComponent {
  private http = inject(HttpClient);

  // Create async state from HTTP request
  usersState$ = this.http.get<User[]>('/api/users').pipe(
    createAsyncState({
      next: (users) => console.log('Loaded users:', users),
      error: (err) => console.error('Error:', err),
    }),
  );
}
```

**Polling** - Poll data at configurable intervals:

```typescript
import {poll} from 'ngx-lift';

export class DataComponent {
  private http = inject(HttpClient);

  // Poll data every 5 seconds
  dataState$ = poll({
    interval: 5000,
    pollingFn: () => this.http.get('/api/data'),
    initialValue: {loading: true, error: null, data: null},
  });
}
```

### Using Signal Utilities

**Route Parameters as Signals** - Access route params reactively:

```typescript
import {injectParams, injectQueryParams, combineFrom} from 'ngx-lift';

export class UserDetailComponent {
  // Inject route parameters as signals (Angular 19+)
  userId = injectParams('id');
  searchTerm = injectQueryParams('search');

  // Combine Observables and Signals into a single Signal
  vm = combineFrom({
    user: this.userService.getUser(this.userId()),
    filters: this.filtersSignal,
  });
}
```

### Using Pipes

**Template Pipes** - Ready-to-use pipes for common transformations:

```html
<!-- Convert bytes to human-readable format (KB, MB, GB) -->
<div>{{ fileSize | byteConverter }}</div>
<!-- Output: "1.5 MB" -->

<!-- Mask sensitive data (credit cards, emails, etc.) -->
<div>{{ creditCard | mask: 'card' }}</div>
<!-- Output: "**** **** **** 1234" -->

<!-- Join array elements with separator -->
<div>{{ tags | arrayJoin: ', ' }}</div>
<!-- Output: "angular, typescript, rxjs" -->
```

### Using Validators

**Advanced Form Validators** - Powerful validators for complex scenarios:

```typescript
import {FormBuilder, Validators} from '@angular/forms';
import {dateRange, unique, url} from 'ngx-lift';

export class MyFormComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    // URL validation
    website: ['', [Validators.required, url()]],

    // Date range validation (end must be after start)
    dates: this.fb.group(
      {
        start: [''],
        end: [''],
      },
      {validators: dateRange()},
    ),

    // Unique values in array
    tags: this.fb.array([], [unique()]),
  });
}
```

## 📚 Documentation

- **📖 Full Documentation**: [ngx-lift.netlify.app](https://ngx-lift.netlify.app/)
- **🎮 Interactive Demo**: [Live Examples](https://ngx-lift.netlify.app/)
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
nx test ngx-lift
```

Run tests with coverage:

```bash
nx test ngx-lift --coverage
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
