# resourceAsync

A powerful Signal-based utility for managing asynchronous resources in Angular applications. Think of it as **Angular's
`httpResource` with superpowers** 🚀 - providing fine-grained control over request behaviors, cancellation strategies,
and error handling.

## 🎯 Quick Start

```typescript
import {Component, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {resourceAsync} from 'ngx-lift';

interface User {
  id: number;
  name: string;
}

@Component({
  selector: 'app-user-profile',
  template: `
    @if (user.isLoading()) {
      <p>Loading user...</p>
    }
    @if (user.error(); as error) {
      <p class="error">Failed to load user: {{ error.message }}</p>
    }
    @if (user.value(); as userData) {
      <div>
        <h2>{{ userData.name }}</h2>
        <button (click)="user.reload()">Refresh</button>
      </div>
    }
  `,
})
export class UserProfileComponent {
  private http = inject(HttpClient);
  userId = signal(1);

  // Automatically fetches and refetches when userId changes
  user = resourceAsync(() => this.http.get<User>(`/api/users/${this.userId()}`));
}
```

---

## 📊 Comparison with Angular's `httpResource`

| Feature                     | `httpResource`      | `resourceAsync`                | Notes                                               |
| --------------------------- | ------------------- | ------------------------------ | --------------------------------------------------- |
| **Signal-based**            | ✅                  | ✅                             | Both use Angular Signals                            |
| **Reactive dependencies**   | ✅                  | ✅                             | Auto-refetch on dependency changes                  |
| **Status tracking**         | ✅                  | ✅                             | `idle`, `loading`, `reloading`, `resolved`, `error` |
| **Manual reload**           | ✅ `reload()`       | ✅ `reload()` + `execute()`    | `execute()` for mutations                           |
| **Lazy loading**            | ✅                  | ✅                             | `lazy: true` option                                 |
| **Cancellation strategies** | ❌                  | ✅ **switch, exhaust**         | Fine-grained control                                |
| **Error handling**          | Basic               | ✅ **onError, throwOnError**   | Fallback values, custom logic                       |
| **HTTP-specific**           | ✅ (built for HTTP) | ❌ (works with any Promise)    | More flexible                                       |
| **RxJS integration**        | Limited             | ✅ **Full Observable support** | Works with any Observable                           |
| **TypeScript generics**     | ✅                  | ✅                             | Full type safety                                    |

### 🤔 When to Use Which?

**Use `httpResource` when:**

- You need Angular's official HTTP resource API
- You want a stable, battle-tested solution
- You're working with simple GET requests
- You don't need custom cancellation or error handling

**Use `resourceAsync` when:**

- ✨ You need **cancellation strategies** (switch/exhaust)
- ✨ You want **advanced error handling** (fallbacks, custom logic)
- ✨ You're working with **any Promise or Observable** (not just HTTP)
- ✨ You need **both `reload()` and `execute()`** for semantic clarity
- ✨ You want more control over request behavior

---

## 🎭 State Management

### Resource Status States

`resourceAsync` uses the same status model as Angular's `httpResource`:

```typescript
type ResourceStatus =
  | 'idle' // Not triggered yet (lazy: true only)
  | 'loading' // Initial fetch in progress
  | 'reloading' // Refetch in progress (has previous data)
  | 'resolved' // Success
  | 'error'; // Failed
```

### Value Behavior Matrix

| State       | `value()`     | `hasValue()` | `isLoading()` | Description                     |
| ----------- | ------------- | ------------ | ------------- | ------------------------------- |
| `idle`      | `undefined`   | `false`      | `false`       | Not triggered yet               |
| `loading`   | `undefined`   | `false`      | `true`        | Initial fetch, no previous data |
| `reloading` | Previous data | `true`       | `true`        | Refetching, shows stale data    |
| `resolved`  | Current data  | `true`       | `false`       | Success                         |
| `error`     | `undefined`   | `false`      | `false`       | **Failed - data cleared**       |

⚠️ **Important:** When an error occurs (even during `reloading`), the previous value is **cleared** and becomes
`undefined`. This matches Angular's `httpResource` behavior.

---

## 📖 Real-World Scenarios

### Scenario 1: Basic Data Fetching (Auto-load)

**Use Case:** Fetch user data on component init

```typescript
export class UserComponent {
  private http = inject(HttpClient);

  // Automatically starts loading when component initializes
  user = resourceAsync(() => this.http.get<User>('/api/user'));
}
```

**State Flow:**

```
loading → resolved
  ↓         ↓
undefined   User
```

---

### Scenario 2: Lazy Loading with Manual Trigger

**Use Case:** Load data only when user clicks a button

```typescript
export class LazyUserComponent {
  private http = inject(HttpClient);

  // Does NOT auto-load - waits for manual trigger
  users = resourceAsync(() => this.http.get<User[]>('/api/users'), {lazy: true});

  loadUsers() {
    this.users.reload(); // Manual trigger
  }
}
```

**State Flow:**

```
idle → loading → resolved
  ↓      ↓         ↓
(not    undefined  User[]
loaded)
```

---

### Scenario 3: Reactive Dependencies (Auto-refetch)

**Use Case:** Refetch when a dependency (e.g., `userId`) changes

```typescript
export class UserDetailComponent {
  private http = inject(HttpClient);
  userId = signal(1);

  // Auto-refetches when userId changes
  user = resourceAsync(() => this.http.get<User>(`/api/users/${this.userId()}`));

  loadUser(id: number) {
    this.userId.set(id); // Triggers automatic refetch
  }
}
```

**State Flow (userId changes from 1 → 2):**

```
resolved(user1) → reloading → resolved(user2)
      ↓              ↓            ↓
    User1          User1        User2
                (shows stale   (new data)
                 while loading)
```

---

### Scenario 4: Error Handling with Fallback

**Use Case:** Provide fallback data when API fails

```typescript
export class UserWithFallbackComponent {
  private http = inject(HttpClient);

  user = resourceAsync(() => this.http.get<User>('/api/user'), {
    onError: (error) => {
      console.error('Failed to load user:', error);
      // Return fallback user
      return {
        id: 0,
        name: 'Guest User',
        email: 'guest@example.com',
      };
    },
  });
}
```

**State Flow (API fails):**

```
loading → resolved (with fallback)
  ↓         ↓
undefined   GuestUser
```

---

### Scenario 5: Switch Cancellation (Latest Wins)

**Use Case:** Search as you type - cancel previous requests

```typescript
export class SearchComponent {
  private http = inject(HttpClient);
  searchTerm = signal('');

  // Previous searches are cancelled when searchTerm changes
  searchResults = resourceAsync(
    () => this.http.get<Result[]>(`/api/search?q=${this.searchTerm()}`),
    {behavior: 'switch'}, // Default behavior
  );

  search(term: string) {
    this.searchTerm.set(term); // Cancels previous request
  }
}
```

**Timeline:**

```
t=0ms:  User types "ang"  → Request A starts
t=100ms: User types "angu" → Request A CANCELLED, Request B starts
t=200ms: User types "angul" → Request B CANCELLED, Request C starts
t=500ms: Request C completes → Shows results for "angul"
```

---

### Scenario 6: Exhaust Cancellation (Prevent Duplicates)

**Use Case:** Form submission - prevent duplicate submissions

```typescript
export class RegistrationComponent {
  private http = inject(HttpClient);

  registration = resourceAsync(() => this.http.post<Response>('/api/register', this.formData()), {
    behavior: 'exhaust', // Ignore new requests while loading
    lazy: true,
  });

  submit() {
    // If already submitting, this call is IGNORED
    this.registration.execute();
  }
}
```

**Timeline:**

```
t=0ms:  User clicks submit   → Request starts
t=100ms: User clicks again    → IGNORED (still loading)
t=200ms: User clicks again    → IGNORED (still loading)
t=500ms: Request completes    → Ready for next submission
t=600ms: User clicks again    → New request starts
```

---

### Scenario 7: Error Recovery (Retry)

**Use Case:** User manually retries after error

```typescript
export class RetryComponent {
  private http = inject(HttpClient);

  data = resourceAsync(() => this.http.get<Data>('/api/data'));

  retry() {
    this.data.reload(); // Retry the request
  }
}
```

**State Flow (Initial fail → Retry → Success):**

```
loading → error → loading → resolved
  ↓        ↓        ↓         ↓
undefined undefined undefined Data
```

⚠️ **Note:** After error, status returns to `loading` (not `reloading`) because there's no previous successful data.

---

### Scenario 8: Error During Reload (Data Loss)

**Use Case:** Successful load → User refreshes → Refresh fails

```typescript
export class DataComponent {
  private http = inject(HttpClient);

  data = resourceAsync(() => this.http.get<Data>('/api/data'));

  refresh() {
    this.data.reload();
  }
}
```

**State Flow:**

```
1. loading    → value = undefined
2. resolved   → value = data1 ✅
3. reloading  → value = data1 (still showing)
4. error      → value = undefined ❌ (DATA CLEARED!)
5. loading    → value = undefined
6. resolved   → value = data1 ✅ (recovered)
```

⚠️ **Critical:** At step 4, even though we had `data1`, the error **clears** the value. This matches Angular's
`httpResource` behavior and forces proper error handling.

---

### Scenario 9: Mutations (POST/PUT/DELETE)

**Use Case:** Registration form submission

```typescript
export class RegistrationFormComponent {
  private http = inject(HttpClient);

  form = signal({
    username: '',
    password: '',
    email: '',
  });

  registration = resourceAsync(() => this.http.post<Response>('/api/register', this.form()), {
    behavior: 'exhaust', // Prevent duplicate submissions
    lazy: true,
  });

  submit() {
    // Use execute() for semantic clarity (not reload())
    this.registration.execute();
  }
}
```

```html
<form (ngSubmit)="submit()">
  <input [(ngModel)]="form().username" />
  <input type="password" [(ngModel)]="form().password" />
  <button [disabled]="registration.isLoading()">
    @if (registration.isLoading()) { Registering... } @else { Register }
  </button>
</form>

@if (registration.error(); as error) {
<div class="error">{{ error.message }}</div>
} @if (registration.value(); as response) {
<div class="success">Registration successful! Welcome {{ response.username }}</div>
}
```

---

## 🔧 API Reference

### `resourceAsync<T, E = Error>(fetchFn, options?)`

#### Parameters

**`fetchFn: () => Observable<T> | Promise<T>`**

- Function that returns an Observable or Promise
- Called immediately (or on `reload()` if `lazy: true`)
- Automatically tracks Signal dependencies inside `fetchFn`

**`options?: ResourceRefOptions<T, E>`**

```typescript
interface ResourceRefOptions<T, E = Error> {
  /**
   * Lazy loading: if true, does not execute until reload() is called
   * @default false
   */
  lazy?: boolean;

  /**
   * Cancellation behavior
   * - 'switch': Cancel previous requests when new one starts (default)
   * - 'exhaust': Ignore new requests while one is in progress
   * @default 'switch'
   */
  behavior?: 'switch' | 'exhaust';

  /**
   * Error handler: return a fallback value to recover from errors
   * If returns undefined, error is propagated normally
   */
  onError?: (error: E) => T | undefined;

  /**
   * If true, rethrows errors after handling
   * @default false
   */
  throwOnError?: boolean;
}
```

#### Returns `ResourceRef<T, E>`

```typescript
interface ResourceRef<T, E = Error> {
  // Signals
  value: Signal<T | undefined>;
  error: Signal<E | null>;
  status: Signal<ResourceStatus>;
  isLoading: Signal<boolean>;
  hasValue: Signal<boolean>;
  isIdle: Signal<boolean>;

  // Actions
  reload: () => void;
  execute: () => void; // Alias for reload(), better for mutations
}
```

---

## 🎨 Template Patterns

### Pattern 1: Loading → Success → Error

```html
@if (resource.isLoading()) {
<div class="spinner">Loading...</div>
} @if (resource.error(); as error) {
<div class="error">
  <p>{{ error.message }}</p>
  <button (click)="resource.reload()">Retry</button>
</div>
} @if (resource.value(); as data) {
<div class="content">
  <h2>{{ data.title }}</h2>
  <button (click)="resource.reload()">Refresh</button>
</div>
}
```

---

### Pattern 2: Optimistic Updates (Show Stale During Reload)

```html
@if (resource.status() === 'reloading') {
<div class="refreshing-indicator">
  <span>Updating...</span>
</div>
} @if (resource.value(); as data) {
<div class="content" [class.refreshing]="resource.status() === 'reloading'">
  <!-- Shows stale data during reload -->
  <h2>{{ data.title }}</h2>
</div>
}
```

---

### Pattern 3: Lazy Load Button

```html
@if (resource.isIdle()) {
<button (click)="resource.reload()">Load Data</button>
} @if (resource.isLoading()) {
<div class="spinner">Loading...</div>
} @if (resource.value(); as data) {
<div>{{ data.title }}</div>
}
```

---

### Pattern 4: Status Message Helper

```typescript
export class MyComponent {
  resource = resourceAsync(/* ... */);

  statusMessage = computed(() => {
    switch (this.resource.status()) {
      case 'idle':
        return 'Not loaded yet';
      case 'loading':
        return 'Loading...';
      case 'reloading':
        return 'Refreshing...';
      case 'resolved':
        return 'Data loaded!';
      case 'error':
        return 'Failed to load';
    }
  });
}
```

```html
<div class="status">{{ statusMessage() }}</div>
```

---

## ⚡ Best Practices

### 1. Use `execute()` for Mutations

```typescript
// ✅ Good: Semantic clarity
saveAction = resourceAsync(
  () => this.http.post('/api/save', this.data()),
  { lazy: true }
);

save() {
  this.saveAction.execute(); // Clear intent: POST operation
}

// ❌ Confusing: "reload" implies GET
save() {
  this.saveAction.reload(); // Works, but misleading
}
```

---

### 2. Use `exhaust` for Submissions

```typescript
// ✅ Good: Prevents duplicate submissions
submitForm = resourceAsync(() => this.http.post('/api/submit', this.formData()), {
  behavior: 'exhaust', // Ignore rapid clicks
  lazy: true,
});
```

---

### 3. Use `switch` for Search

```typescript
// ✅ Good: Latest search wins
searchResults = resourceAsync(
  () => this.http.get(`/api/search?q=${this.query()}`),
  {behavior: 'switch'}, // Cancel previous searches
);
```

---

### 4. Provide Fallback for Non-Critical Data

```typescript
// ✅ Good: Graceful degradation
recommendations = resourceAsync(() => this.http.get<Item[]>('/api/recommendations'), {
  onError: () => [], // Empty array fallback
});
```

---

### 5. Handle Errors Explicitly

```typescript
// ✅ Good: User-friendly error handling
@if (resource.error(); as error) {
  <div class="error">
    <p>{{ getErrorMessage(error) }}</p>
    <button (click)="resource.reload()">Try Again</button>
  </div>
}
```

---

## 🐛 Common Pitfalls

### ❌ Pitfall 1: Forgetting `lazy: true` for Mutations

```typescript
// ❌ BAD: POST fires immediately on component init!
submitAction = resourceAsync(() => this.http.post('/api/submit', this.data()));

// ✅ GOOD: Waits for manual trigger
submitAction = resourceAsync(() => this.http.post('/api/submit', this.data()), {lazy: true});
```

---

### ❌ Pitfall 2: Assuming Data Persists on Error

```typescript
// ❌ BAD: Assumes data is still available after error
@if (resource.value(); as data) {
  <div>{{ data.name }}</div>
}
// If error occurs, data is cleared! This won't show anything.

// ✅ GOOD: Handle error state explicitly
@if (resource.error()) {
  <div class="error">Failed to load data</div>
}
@if (resource.value(); as data) {
  <div>{{ data.name }}</div>
}
```

---

### ❌ Pitfall 3: Using `switch` for Submissions

```typescript
// ❌ BAD: User can cancel their own submission by clicking twice
submit = resourceAsync(
  () => this.http.post('/api/submit', this.data()),
  {behavior: 'switch', lazy: true}, // Second click cancels first!
);

// ✅ GOOD: Ignore duplicate clicks
submit = resourceAsync(() => this.http.post('/api/submit', this.data()), {behavior: 'exhaust', lazy: true});
```

---

## 🔬 Advanced Usage

### Working with Non-HTTP Promises

```typescript
// Works with ANY Promise, not just HTTP!
fileData = resourceAsync(async () => {
  const file = await openFileDialog();
  const content = await file.text();
  return JSON.parse(content);
});
```

---

### Chaining Operations

```typescript
userData = resourceAsync(async () => {
  const user = await firstValueFrom(this.http.get<User>(`/api/users/${this.userId()}`));

  const permissions = await firstValueFrom(this.http.get<Permissions>(`/api/permissions/${user.id}`));

  return {...user, permissions};
});
```

---

### Combining with RxJS Operators

```typescript
searchResults = resourceAsync(() =>
  this.http.get<Result[]>(`/api/search?q=${this.query()}`).pipe(
    map((results) => results.slice(0, 10)), // Take top 10
    catchError(() => of([])), // Fallback to empty array
  ),
);
```

---

## 📚 Related Utilities

- **`computedAsync`** - Computed signal for async operations (no reload)
- **`createAsyncState`** - RxJS operator for Observable → AsyncState
- **`poll`** - RxJS operator for periodic polling with AsyncState
- **`switchMapWithAsyncState`** - Combine switchMap with AsyncState tracking

---

## 🆚 Migration from `httpResource`

```typescript
// BEFORE (Angular httpResource)
user = httpResource({
  url: () => `/api/users/${this.userId()}`,
  options: {method: 'GET'},
});

// AFTER (ngx-lift resourceAsync)
user = resourceAsync(() => this.http.get<User>(`/api/users/${this.userId()}`));

// Bonus: Now you have cancellation strategies and error handling!
user = resourceAsync(() => this.http.get<User>(`/api/users/${this.userId()}`), {
  behavior: 'switch',
  onError: (error) => ({id: 0, name: 'Guest'}),
});
```

---

## 🎓 When to Use Each Pattern

| Your Need             | Use This                             | Why                   |
| --------------------- | ------------------------------------ | --------------------- |
| Fetch data on init    | `resourceAsync(() => ...)`           | Auto-executes         |
| Fetch on button click | `resourceAsync(..., { lazy: true })` | Manual trigger        |
| Search as you type    | `behavior: 'switch'`                 | Cancel stale searches |
| Form submission       | `behavior: 'exhaust'`                | Prevent duplicates    |
| Non-critical data     | `onError: () => fallback`            | Graceful degradation  |
| Critical errors       | `throwOnError: true`                 | Fail fast             |
| Reactive dependencies | Use Signals in `fetchFn`             | Auto-refetch          |

---

## 📖 Further Reading

- [Angular Signals Guide](https://angular.dev/guide/signals)
- [Angular httpResource API](https://angular.dev/api/core/httpResource)
- [RxJS Operators](https://rxjs.dev/api)
- [ngx-lift Documentation](https://github.com/wghglory/ngx-lift)

---

## 💡 Summary

`resourceAsync` is your **go-to utility** for managing async operations in Angular with **full control** over:

- ✅ **Cancellation strategies** (switch/exhaust)
- ✅ **Error handling** (fallbacks, custom logic)
- ✅ **State tracking** (idle/loading/reloading/resolved/error)
- ✅ **Reactive dependencies** (auto-refetch)
- ✅ **Type safety** (full TypeScript generics)

**Start simple, add complexity only when needed!** 🚀
