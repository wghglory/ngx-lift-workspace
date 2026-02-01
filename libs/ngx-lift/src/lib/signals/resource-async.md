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
    @if (userRef.isLoading()) {
      <p>Loading user...</p>
    }
    @if (userRef.error(); as error) {
      <p class="error">Failed to load user: {{ error.message }}</p>
    }
    @if (userRef.value(); as userData) {
      <div>
        <h2>{{ userData.name }}</h2>
        <button (click)="userRef.reload()">Refresh</button>
      </div>
    }
  `,
})
export class UserProfileComponent {
  private http = inject(HttpClient);
  userId = signal(1);

  // Automatically fetches and refetches when userId changes
  userRef = resourceAsync(() => this.http.get<User>(`/api/users/${this.userId()}`));
}
```

---

## 📊 Comparison with Angular's `httpResource`

| Feature                     | `httpResource`         | `resourceAsync`                            | Notes                                                        |
| --------------------------- | ---------------------- | ------------------------------------------ | ------------------------------------------------------------ |
| **Signal-based**            | ✅                     | ✅                                         | Both use Angular Signals                                     |
| **Reactive dependencies**   | ✅                     | ✅                                         | Auto-refetch on dependency changes                           |
| **Status tracking**         | ✅                     | ✅                                         | `idle`, `loading`, `reloading`, `resolved`, `error`, `local` |
| **Manual reload**           | ✅ `reload()`          | ✅ `reload()` + `execute()`                | `execute()` for mutations                                    |
| **Lazy loading**            | ✅                     | ✅                                         | `lazy: true` option                                          |
| **Writable API**            | ✅ `set()`, `update()` | ✅ **`set()`, `update()`, `asReadonly()`** | Local state management                                       |
| **Cancellation strategies** | ❌                     | ✅ **switch, exhaust**                     | Fine-grained control                                         |
| **Error handling**          | Basic                  | ✅ **onError, throwOnError**               | Fallback values, custom logic                                |
| **HTTP-specific**           | ✅ (built for HTTP)    | ❌ (works with any Promise)                | More flexible                                                |
| **RxJS integration**        | Limited                | ✅ **Full Observable support**             | Works with any Observable                                    |
| **TypeScript generics**     | ✅                     | ✅                                         | Full type safety                                             |

### 🤔 When to Use Which?

**Use `httpResource` when:**

- You need Angular's official HTTP resource API
- You want a stable, battle-tested solution
- You're working with simple GET requests
- You don't need custom cancellation or error handling

**Use `resourceAsync` when:**

- ✨ You need **local state management** (optimistic updates, cache-first, form drafts)
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
| `local`     | Manual data   | `true`       | `false`       | **Set via set()/update()**      |

⚠️ **Important:** When an error occurs (even during `reloading`), the previous value is **cleared** and becomes
`undefined`. This matches Angular's `httpResource` behavior.

---

## 🆕 Writable Resource API (Local State Management)

`resourceAsync` returns a `WritableResourceRef` with methods for manual state management, matching Angular's
`WritableResource` API:

```typescript
interface WritableResourceRef<T, E = Error> extends ResourceRef<T, E> {
  set(value: T): void; // Set value manually → 'local' state
  update(updater: (value: T) => T): void; // Update with function → 'local' state
  asReadonly(): ResourceRef<T, E>; // Return read-only version
}
```

### ✨ Core Features

1. **`set(value: T)` Method**
   - Manually set resource value
   - Transitions to `'local'` status state
   - Cancels pending requests
   - Clears errors

2. **`update(updater: (value: T) => T)` Method**
   - Update value using function
   - Transitions to `'local'` status state
   - Supports chaining multiple updates
   - Handles undefined values correctly

3. **`asReadonly()` Method**
   - Returns read-only `ResourceRef`
   - No `set`/`update` methods
   - Shares state with original resource

4. **`'local'` Status State**
   - Indicates manually-set values
   - Distinguishes from server-fetched data
   - `hasValue()` returns `true` for `'local'` state

---

### Scenario A: Optimistic Updates

Update UI instantly before server confirmation, revert on error.

```typescript
export class TodoComponent {
  todoRef = resourceAsync(() => this.http.get<Todo>(`/api/todos/${this.todoId()}`));

  toggleComplete() {
    // Update UI immediately
    this.todoRef.update((todo) => ({...todo, completed: !todo.completed}));

    // Send to server
    this.http.put(`/api/todos/${this.todoId()}`, this.todoRef.value()).subscribe({
      error: () => {
        // Revert on error
        this.todoRef.update((todo) => ({...todo, completed: !todo.completed}));
      },
    });
  }
}
```

```html
<!-- Show saving indicator -->
@if (todoRef.status() === 'local') {
<span class="badge">Saving...</span>
}
```

### Scenario B: Cache-First Pattern

Show cached data immediately, fetch fresh data in background.

```typescript
export class UserProfileComponent {
  userRef = resourceAsync(() => this.http.get<User>(`/api/users/${this.userId()}`), {lazy: true});

  ngOnInit() {
    // Set cached data immediately
    const cachedUser = localStorage.getItem('user');
    if (cachedUser) {
      this.userRef.set(JSON.parse(cachedUser));
    }

    // Fetch fresh data in background
    this.userRef.reload();
  }
}
```

**State Flow:**

```
local (cached) → reloading → resolved (fresh)
     ↓              ↓            ↓
  CachedUser    CachedUser    FreshUser
```

### Scenario C: Form Drafts

Update resource as user types, save manually.

```typescript
export class ArticleEditorComponent {
  articleRef = resourceAsync(() => this.http.get<Article>(`/api/articles/${this.articleId()}`));

  onContentChange(newContent: string) {
    // Update draft as user types
    this.articleRef.update((article) => ({...article, content: newContent}));
  }

  saveArticle() {
    this.http.put(`/api/articles/${this.articleId()}`, this.articleRef.value()).subscribe();
  }

  discardChanges() {
    this.articleRef.reload(); // Reload from server
  }
}
```

```html
<!-- Show dirty indicator -->
@if (articleRef.status() === 'local') {
<span class="badge">Unsaved changes</span>
}
<button (click)="saveArticle()">Save</button>
<button (click)="discardChanges()">Discard</button>
```

### Scenario D: Read-Only Public API

Expose read-only resources while keeping write access private.

```typescript
export class UserStateService {
  private _userRef = resourceAsync(() => this.http.get<User>('/api/user'));

  // Public read-only access (no set/update)
  public readonly userRef = this._userRef.asReadonly();

  // Private write methods
  updateUser(updates: Partial<User>) {
    this._userRef.update((user) => ({...user, ...updates}));
  }
}
```

---

## 📖 Real-World Scenarios

### Scenario 1: Basic Data Fetching (Auto-load)

**Use Case:** Fetch user data on component init

```typescript
export class UserComponent {
  private http = inject(HttpClient);

  // Automatically starts loading when component initializes
  userRef = resourceAsync(() => this.http.get<User>('/api/user'));
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
  usersRef = resourceAsync(() => this.http.get<User[]>('/api/users'), {lazy: true});

  loadUsers() {
    this.usersRef.reload(); // Manual trigger
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
  userRef = resourceAsync(() => this.http.get<User>(`/api/users/${this.userId()}`));

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

  userRef = resourceAsync(() => this.http.get<User>('/api/user'), {
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
  searchResultsRef = resourceAsync(
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

  registrationRef = resourceAsync(() => this.http.post<Response>('/api/register', this.formData()), {
    behavior: 'exhaust', // Ignore new requests while loading
    lazy: true,
  });

  submit() {
    // If already submitting, this call is IGNORED
    this.registrationRef.execute();
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

  dataRef = resourceAsync(() => this.http.get<Data>('/api/data'));

  retry() {
    this.dataRef.reload(); // Retry the request
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

  dataRef = resourceAsync(() => this.http.get<Data>('/api/data'));

  refresh() {
    this.dataRef.reload();
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

  registrationRef = resourceAsync(() => this.http.post<Response>('/api/register', this.form()), {
    behavior: 'exhaust', // Prevent duplicate submissions
    lazy: true,
  });

  submit() {
    // Use execute() for semantic clarity (not reload())
    this.registrationRef.execute();
  }
}
```

```html
<form (ngSubmit)="submit()">
  <input [(ngModel)]="form().username" />
  <input type="password" [(ngModel)]="form().password" />
  <button [disabled]="registrationRef.isLoading()">
    @if (registrationRef.isLoading()) { Registering... } @else { Register }
  </button>
</form>

@if (registrationRef.error(); as error) {
<div class="error">{{ error.message }}</div>
} @if (registrationRef.value(); as response) {
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
  value: Signal<T>; // Always returns T (with initialValue fallback)
  error: Signal<E | null>;
  status: Signal<ResourceStatus>;
  isLoading: Signal<boolean>; // Signal (not method) - matches Angular
  isIdle: Signal<boolean>; // Signal (not method) - ngx-lift extension

  // Methods
  hasValue(): this is ResourceRef<Exclude<T, undefined>, E>; // Type predicate!
  reload(): boolean; // Returns true if initiated
  execute(): boolean; // Alias for reload() - ngx-lift extension
}
```

---

## 🔍 Type Narrowing with `hasValue()` - IT WORKS! ✅

**Breakthrough**: Type narrowing now works in both TypeScript code AND Angular templates!

By following Angular's `httpResource` architecture where `value` is `Signal<T>` (not `Signal<T | undefined>`), the type
predicate actually works.

### ✅ Type Narrowing in TypeScript Code

```typescript
export class UserComponent {
  userRef = resourceAsync(() => this.http.get<User>('/api/user'), {
    initialValue: undefined, // T = User | undefined
  });

  processUser() {
    // ✅ Type narrowing works!
    if (this.userRef.hasValue()) {
      const name = this.userRef.value().name; // No ! needed - type is User
      return name;
    }
    return null;
  }

  // ✅ Works in computed too
  userName = computed(() => {
    if (this.userRef.hasValue()) {
      return this.userRef.value().name; // Type is User, not User | undefined
    }
    return 'Loading...';
  });
}
```

### ✅ Type Narrowing in Templates

```html
<!-- ✅ Type narrowing works in templates! -->
@if (userRef.hasValue()) {
<p>{{ userRef.value().name }}</p>
<!-- No ! needed -->
}

<!-- ✅ Alternative patterns -->
@if (userRef.value(); as user) {
<p>{{ user.name }}</p>
} @if (userRef.status() === 'resolved' && userRef.hasValue()) {
<p>{{ userRef.value().email }}</p>
}
```

### How It Works

The key is that `value` is `Signal<T>`, not `Signal<T | undefined>`:

```typescript
interface ResourceRef<T> {
  value: Signal<T>; // Always returns T (with initialValue fallback)
  hasValue(): this is ResourceRef<Exclude<T, undefined>>; // Narrows T
}

// When hasValue() returns true, T is narrowed to Exclude<T, undefined>
// Since value is Signal<T>, value() now returns Exclude<T, undefined>!
```

The signal returns the loaded value if available, otherwise falls back to `initialValue`.

### Usage Patterns

```typescript
// ✅ Recommended: Provide initialValue
userRef = resourceAsync(
  () => this.http.get<User>('/api/user'),
  {initialValue: undefined}, // Makes T = User | undefined
);

// ✅ Alternative: Include undefined in type
userRef = resourceAsync<User | undefined>(() => this.http.get<User>('/api/user'));

// Type narrowing works in both cases
if (userRef.hasValue()) {
  userRef.value().name; // ✅ Type is User
}
```

---

## 🎨 Template Patterns

### Pattern 1: Loading → Success → Error

```html
@if (resourceRef.isLoading()) {
<div class="spinner">Loading...</div>
} @if (resourceRef.error(); as error) {
<div class="error">
  <p>{{ error.message }}</p>
  <button (click)="resourceRef.reload()">Retry</button>
</div>
} @if (resourceRef.value(); as data) {
<div class="content">
  <h2>{{ data.title }}</h2>
  <button (click)="resourceRef.reload()">Refresh</button>
</div>
}
```

---

### Pattern 2: Optimistic Updates (Show Stale During Reload)

```html
@if (resourceRef.status() === 'reloading') {
<div class="refreshing-indicator">
  <span>Updating...</span>
</div>
} @if (resourceRef.value(); as data) {
<div class="content" [class.refreshing]="resourceRef.status() === 'reloading'">
  <!-- Shows stale data during reload -->
  <h2>{{ data.title }}</h2>
</div>
}
```

---

### Pattern 3: Lazy Load Button

```html
@if (resourceRef.isIdle()) {
<button (click)="resourceRef.reload()">Load Data</button>
} @if (resourceRef.isLoading()) {
<div class="spinner">Loading...</div>
} @if (resourceRef.value(); as data) {
<div>{{ data.title }}</div>
}
```

---

### Pattern 4: Status Message Helper

```typescript
export class MyComponent {
  resourceRef = resourceAsync(/* ... */);

  statusMessage = computed(() => {
    switch (this.resourceRef.status()) {
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
saveActionRef = resourceAsync(
  () => this.http.post('/api/save', this.data()),
  { lazy: true }
);

save() {
  this.saveActionRef.execute(); // Clear intent: POST operation
}

// ❌ Confusing: "reload" implies GET
save() {
  this.saveActionRef.reload(); // Works, but misleading
}
```

---

### 2. Use `exhaust` for Submissions

```typescript
// ✅ Good: Prevents duplicate submissions
submitFormRef = resourceAsync(() => this.http.post('/api/submit', this.formData()), {
  behavior: 'exhaust', // Ignore rapid clicks
  lazy: true,
});
```

---

### 3. Use `switch` for Search

```typescript
// ✅ Good: Latest search wins
searchResultsRef = resourceAsync(
  () => this.http.get(`/api/search?q=${this.query()}`),
  {behavior: 'switch'}, // Cancel previous searches
);
```

---

### 4. Provide Fallback for Non-Critical Data

```typescript
// ✅ Good: Graceful degradation
recommendationsRef = resourceAsync(() => this.http.get<Item[]>('/api/recommendations'), {
  onError: () => [], // Empty array fallback
});
```

---

### 5. Handle Errors Explicitly

```typescript
// ✅ Good: User-friendly error handling
@if (resourceRef.error(); as error) {
  <div class="error">
    <p>{{ getErrorMessage(error) }}</p>
    <button (click)="resourceRef.reload()">Try Again</button>
  </div>
}
```

---

## 🐛 Common Pitfalls

### ❌ Pitfall 1: Forgetting `lazy: true` for Mutations

```typescript
// ❌ BAD: POST fires immediately on component init!
submitRef = resourceAsync(() => this.http.post('/api/submit', this.data()));

// ✅ GOOD: Waits for manual trigger
submitRef = resourceAsync(() => this.http.post('/api/submit', this.data()), {lazy: true});
```

---

### ❌ Pitfall 2: Assuming Data Persists on Error

```typescript
// ❌ BAD: Assumes data is still available after error
@if (resourceRef.value(); as data) {
  <div>{{ data.name }}</div>
}
// If error occurs, data is cleared! This won't show anything.

// ✅ GOOD: Handle error state explicitly
@if (resourceRef.error()) {
  <div class="error">Failed to load data</div>
}
@if (resourceRef.value(); as data) {
  <div>{{ data.name }}</div>
}
```

---

### ❌ Pitfall 3: Using `switch` for Submissions

```typescript
// ❌ BAD: User can cancel their own submission by clicking twice
submitRef = resourceAsync(
  () => this.http.post('/api/submit', this.data()),
  {behavior: 'switch', lazy: true}, // Second click cancels first!
);

// ✅ GOOD: Ignore duplicate clicks
submitRef = resourceAsync(() => this.http.post('/api/submit', this.data()), {behavior: 'exhaust', lazy: true});
```

---

## 🔬 Advanced Usage

### Working with Non-HTTP Promises

```typescript
// Works with ANY Promise, not just HTTP!
fileDataRef = resourceAsync(async () => {
  const file = await openFileDialog();
  const content = await file.text();
  return JSON.parse(content);
});
```

---

### Chaining Operations

```typescript
userDataRef = resourceAsync(async () => {
  const user = await firstValueFrom(this.http.get<User>(`/api/users/${this.userId()}`));

  const permissions = await firstValueFrom(this.http.get<Permissions>(`/api/permissions/${user.id}`));

  return {...user, permissions};
});
```

---

### Combining with RxJS Operators

```typescript
searchResultsRef = resourceAsync(() =>
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

### Advanced Patterns

- **[Nested Resources](./resource-async-advanced.md)** - Comprehensive guide for managing outer list + inner detail
  patterns

---

## 🆚 Migration from `httpResource`

```typescript
// BEFORE (Angular httpResource)
userRef = httpResource({
  url: () => `/api/users/${this.userId()}`,
  options: {method: 'GET'},
});

// AFTER (ngx-lift resourceAsync)
userRef = resourceAsync(() => this.http.get<User>(`/api/users/${this.userId()}`));

// Bonus: Now you have cancellation strategies and error handling!
userRef = resourceAsync(() => this.http.get<User>(`/api/users/${this.userId()}`), {
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

- ✅ **Local state management** (`set()`, `update()`, `asReadonly()`)
- ✅ **Cancellation strategies** (switch/exhaust)
- ✅ **Error handling** (fallbacks, custom logic)
- ✅ **State tracking** (idle/loading/reloading/resolved/error/local)
- ✅ **Reactive dependencies** (auto-refetch)
- ✅ **Type safety** (full TypeScript generics)

### 🎯 Common Use Cases at a Glance

| Use Case                 | Pattern                                     | Methods Used               |
| ------------------------ | ------------------------------------------- | -------------------------- |
| **Optimistic Updates**   | Update UI instantly, revert on error        | `update()`                 |
| **Cache-First Loading**  | Show cached data, fetch fresh in background | `set()` + `reload()`       |
| **Form Drafts**          | Track unsaved changes, save/discard         | `update()` + save logic    |
| **Nested Data**          | List items with individual detail states    | Map pattern + lazy loading |
| **Search**               | Cancel previous searches                    | `behavior: 'switch'`       |
| **Form Submit**          | Prevent duplicate submissions               | `behavior: 'exhaust'`      |
| **Error Recovery**       | Retry failed requests                       | `reload()`                 |
| **Graceful Degradation** | Fallback for non-critical data              | `onError` with fallback    |

### 🏆 Feature Parity with Angular's Resource API

`resourceAsync` provides **full feature parity** with Angular's `WritableResource` API, plus additional capabilities:

| Feature            | Angular Resource | resourceAsync  | Notes                          |
| ------------------ | ---------------- | -------------- | ------------------------------ |
| `value`            | ✅ Signal\<T\>   | ✅ Signal\<T\> | Matches exactly                |
| `status`           | ✅               | ✅ + `'local'` | Extended with local state      |
| `error`            | ✅               | ✅             | Generic error type             |
| `isLoading`        | ✅               | ✅             | Signal accessor                |
| `hasValue()`       | ✅               | ✅             | Type predicate                 |
| `reload()`         | ✅               | ✅             | Manual refetch                 |
| **`set(value)`**   | ✅               | ✅             | Manual value assignment        |
| **`update(fn)`**   | ✅               | ✅             | Functional updates             |
| **`asReadonly()`** | ✅               | ✅             | Read-only exposure             |
| `execute()`        | ❌               | ✅             | Semantic clarity for mutations |
| `isIdle`           | ❌               | ✅             | Lazy loading support           |
| Observable support | ⚠️ Limited       | ✅ Native      | Full RxJS integration          |
| `behavior` option  | ❌               | ✅             | switch/exhaust strategies      |
| `onError` handler  | ❌               | ✅             | Fallback values, custom logic  |

### 🔧 Technical Highlights

**Type Safety:**

```typescript
// Without initialValue - must handle undefined
userRef.update((user) => (user ? {...user, name: 'New'} : undefined));

// With initialValue - always safe
userRef.update((user) => ({...user, name: 'New'}));
```

**Status Transitions:**

```
idle → loading → resolved → set() → local → reload() → reloading → resolved
```

**Cancellation:**

- `set()/update()` automatically cancel pending requests
- Local state available immediately
- No race conditions

### 🎓 Interactive Examples

For hands-on examples of all these patterns, check out the demo app:

1. **Optimistic Updates** - Todo toggle with instant feedback
2. **Cache-First Loading** - Show cached data immediately
3. **Form Drafts** - Editable counter with save/discard
4. **Nested Resources** - Items list with per-row organization loading

Visit the demo at `apps/demo → Signals → resourceAsync` to see these patterns in action!

---

**Start simple, add complexity only when needed!** 🚀
