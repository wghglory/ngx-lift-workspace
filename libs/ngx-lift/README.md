# ngx-lift

A powerful Angular utility library designed to enhance and simplify your Angular development experience. ngx-lift
provides a comprehensive collection of utilities, operators, signals, pipes, and validators that streamline common
Angular development tasks.

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

## Quick Start

### Using Operators

```typescript
import {createAsyncState, poll} from 'ngx-lift';
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

  // Poll data at intervals
  dataState$ = poll({
    interval: 5000,
    pollingFn: () => this.http.get('/api/data'),
    initialValue: {loading: true, error: null, data: null},
  });
}
```

### Using Signal Utilities

```typescript
import {combineFrom, injectParams, injectQueryParams} from 'ngx-lift';

export class UserDetailComponent {
  // Inject route parameters as signals
  userId = injectParams('id');
  searchTerm = injectQueryParams('search');

  // Combine multiple sources into a signal
  vm = combineFrom({
    user: this.userService.getUser(this.userId()),
    filters: this.filtersSignal,
  });
}
```

### Using Pipes

```html
<!-- Convert bytes to human-readable format -->
<div>{{ fileSize | byteConverter }}</div>

<!-- Mask sensitive data -->
<div>{{ creditCard | mask: 'card' }}</div>

<!-- Join array elements -->
<div>{{ tags | arrayJoin: ', ' }}</div>
```

### Using Validators

```typescript
import {FormBuilder, Validators} from '@angular/forms';
import {dateRange, unique, url} from 'ngx-lift';

export class MyFormComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    website: ['', [Validators.required, url()]],
    dates: this.fb.group(
      {
        start: [''],
        end: [''],
      },
      {validators: dateRange()},
    ),
    tags: this.fb.array([], [unique()]),
  });
}
```

## Documentation

- **Demo Site**: [https://ngx-lift.netlify.app/](https://ngx-lift.netlify.app/)
- **Source Code**:
  [https://github.com/wghglory/ngx-lift-workspace/tree/main/libs/ngx-lift](https://github.com/wghglory/ngx-lift-workspace/tree/main/libs/ngx-lift)
- **GitHub Repository**:
  [https://github.com/wghglory/ngx-lift-workspace](https://github.com/wghglory/ngx-lift-workspace)

## Running Tests

Run the unit tests for ngx-lift:

```bash
nx test ngx-lift
```

## Contributing

We welcome contributions! If you encounter any issues, have feature requests, or would like to contribute code, please
check out our [contribution guidelines](https://github.com/wghglory/ngx-lift-workspace/CONTRIBUTING.md).

## License

**ngx-lift** is licensed under the MIT License.

## Acknowledgments

Thank you for using ngx-lift! We hope this library enhances your Angular development experience. If you have any
questions or feedback, please don't hesitate to reach out.

Happy coding! 🚀
