# Design Specification: `resourceAsync`

**Status**: Implemented & Production-ready  
**Module**: `libs/ngx-lift/src/lib/query/resource-async.ts`  
**Tests**: `libs/ngx-lift/src/lib/query/resource-async.spec.ts` (110 passing unit tests)

---

## 1. Vision & Architecture

`resourceAsync` is the fundamental reactive async primitive in `ngx-lift`. It bridges asynchronous data sources
(Observables, Promises, async functions, or synchronous values) into Angular Signals with explicit lifecycle tracking,
fine-grained concurrency control, automatic cleanup, and bidirectional local state management.

```
       [ Signal Dependencies / Context ]
                     │
                     ▼
         ┌───────────────────────┐
         │ params() (Pure Read)  │
         └───────────┬───────────┘
                     │ passes pure param
                     ▼
         ┌───────────────────────┐
         │ loader(id, { signal })│ ◄─── Concurrency Policy (switch / exhaust / concat)
         └───────────┬───────────┘
                     │
     ┌───────────────┴───────────────┐
     ▼                               ▼
[value: Signal<T>]          [status, isLoading, error Signals]
[set(v), update(fn)]        [reload(), execute(), reset(), destroy()]
```

While `queryResource` manages application-scoped, multi-observer shared caches and coordinated background polling
through `QueryClient`, **`resourceAsync` manages the complete lifecycle of a single component- or service-scoped
asynchronous resource**.

---

## 2. API Contract & Type Architecture

### 2.1 Dual Calling Conventions

#### Form 1: Definition Object (Recommended for reactive parameters & exhaust)

```typescript
userRef = resourceAsync(
  {
    params: () => ({id: this.userId()}),
    loader: ({id}, {abortSignal}) => fetch(`/api/users/${id}`, {signal: abortSignal}).then((res) => res.json()),
  },
  {behavior: 'exhaust', preserveValueOnError: true},
);
```

- **Pure Parameter Capture**: Only `params` tracks Signal dependencies. It executes inside an Angular computed Signal
  and must remain pure.
- **Untracked Execution**: `loader` receives the captured parameter snapshot and executes untracked. Signal reads within
  `loader` do not create dependencies.
- **Reliable `exhaust` Tracking**: When `behavior: 'exhaust'` drops a parameter change because a request is in flight,
  dependency tracking survives. A subsequent parameter change after completion will start a new request. Dropped changes
  are not queued.

#### Form 2: Direct Source Function (Concise for single-stream components)

```typescript
userRef = resourceAsync(({abortSignal}) => fetch('/api/user', {signal: abortSignal}).then((res) => res.json()));
```

- Existing zero-argument and single-argument factories run inside an Angular effect. Synchronous Signal writes (e.g.,
  `loading.set(true)`) remain supported.
- _Boundary note_: An arbitrary function cannot be inspected for dependencies without executing its side effects. For
  reliable reactive `exhaust` behavior without eager execution, use Form 1 (`params` / `loader`).

---

### 2.2 Strict Non-Nullable Overload System

To align with Angular's `resource()` and `httpResource()` APIs, `resourceAsync` provides strict compile-time overloads
based on fallback value configuration:

```typescript
// 1. With initialValue or defaultValue -> Guaranteed Signal<T> (never undefined)
export function resourceAsync<T, E = Error>(
  sourceFn: (context: ResourceAsyncContext) => Observable<T> | PromiseLike<T> | T,
  options: ResourceRefOptionsWithInitialValue<T, E> | ResourceRefOptionsWithDefaultValue<T, E>,
): WritableResourceRef<T, E>;

// 2. Without initialValue or defaultValue -> Accurate Signal<T | undefined>
export function resourceAsync<T, E = Error>(
  sourceFn: (context: ResourceAsyncContext) => Observable<T> | PromiseLike<T> | T,
  options?: ResourceRefOptionsWithoutInitial<T, E>,
): WritableResourceRef<T | undefined, E>;
```

---

### 2.3 `WritableResourceRef<T, E>` Surface

| Property / Method | Type                           | Description                                                                                  |
| :---------------- | :----------------------------- | :------------------------------------------------------------------------------------------- |
| `value`           | `Signal<T>`                    | Current resource value. Returns `T                                                           | undefined` if no default value was provided. |
| `status`          | `Signal<ResourceStatus>`       | Current status: `'idle' \| 'loading' \| 'reloading' \| 'resolved' \| 'error' \| 'local'`.    |
| `isLoading`       | `Signal<boolean>`              | `true` when status is `'loading'` or `'reloading'`.                                          |
| `isIdle`          | `Signal<boolean>`              | `true` only when status is `'idle'`.                                                         |
| `error`           | `Signal<E \| null>`            | Active error object, or `null`.                                                              |
| `reload()`        | `() => boolean`                | Triggers a reload. Returns `true` if initiated, `false` if disposed or unneeded.             |
| `execute()`       | `() => Promise<T>`             | Executes the resource and returns an awaitable native `Promise<T>`.                          |
| `reset()`         | `() => void`                   | Aborts pending operations and transitions status back to `'idle'`.                           |
| `set(value: T)`   | `(value: T) => void`           | Assigns a local value optimistically (sets status to `'local'`).                             |
| `update(updater)` | `(fn: (prev: T) => T) => void` | Updates local value optimistically via transformer function.                                 |
| `destroy()`       | `() => void`                   | Permanently stops observation, aborts transport, and rejects pending executions. Idempotent. |
| `asReadonly()`    | `() => ResourceRef<T, E>`      | Returns a read-only projection (without `set`/`update` methods).                             |
| `hasValue()`      | Type Guard                     | Narrowing guard: returns `true` if `value()` is defined.                                     |

---

## 3. Concurrency, Lifecycle & Cancellation

### 3.1 Concurrency Behaviors (`behavior`)

- **`switch` (Default)**: Cancels in-flight operations when parameters change or `reload()` is triggered.
- **`exhaust`**: Ignores new requests while an operation is in flight. An `execute()` call joins the active in-flight
  Promise.
- **`concat`**: Queues incoming executions sequentially.

### 3.2 Operation Cancellation Matrix

| Action               | Impact on In-Flight Work & `execute()` Promise                                                 | Post-Condition                                                                  |
| :------------------- | :--------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------ |
| `reload()`           | Replaces old operation; pending `execute()` rejects with `ResourceAsyncCancelledError`.        | Retains existing value into background reload.                                  |
| `execute()`          | Replaces old operation; clears previous value before starting.                                 | Returned Promise resolves to the fresh result.                                  |
| `set()` / `update()` | Aborts pending in-flight work; rejects pending `execute()` with `ResourceAsyncCancelledError`. | Status becomes `'local'`. Reactive dependencies can still fetch on next change. |
| `reset()`            | Aborts pending in-flight work; rejects pending `execute()` with `ResourceAsyncCancelledError`. | Status becomes `'idle'`. Lazy resources require explicit trigger.               |
| `destroy()`          | Aborts pending in-flight work; rejects pending `execute()` with `ResourceAsyncDisposedError`.  | Resource is permanently disposed. Subsequent `execute()` rejects immediately.   |

### 3.3 Cancellation Transport Contract

- **Observables**: Cancellation unsubscribes from the source Observable.
- **Promises**: Promises cannot be force-aborted natively; work stops only if the underlying loader honors
  `context.abortSignal`. In either case, stale results from cancelled operations are discarded.
- **Server Writes**: Cancellation cannot undo a mutation that has already been accepted by the server.

---

## 4. Error Policies & Equality Comparison

### 4.1 Value Retention on Error (`preserveValueOnError`)

- Default is `false`: Failed reloads clear previous data back to `defaultValue` or `undefined`.
- When set to `true`: Background reloads that fail retain previously loaded or local data while setting
  `status() === 'error'` and exposing `error()`. `hasValue()` remains `true` if the retained data is defined.
- An `onError` fallback function takes precedence over retention.

### 4.2 Signal Equality (`equal`)

- `equal` controls notifications from `value()`, not operation execution or `status()`.
- Undefined boundaries are safely handled using `Object.is`, preventing user-defined comparators like
  `(a, b) => a.id === b.id` from throwing during initial uninitialized states.

---

## 5. Advanced Patterns: Nested Resources

When rendering master-detail views or lists where each row loads independent asynchronous data:

### 5.1 Pattern Comparison

```
                         Nested Data Architecture
                                    │
               ┌────────────────────┴────────────────────┐
               ▼                                         ▼
   Approach 1: Hybrid Pattern                Approach 2: Child resourceAsync
 (resourceAsync list + Signal Map)          (Each row owns full resourceAsync)
               │                                         │
- Cleanest mental model                  - Full status/reloading signals per row
- No extra injector management           - Requires explicit destroy() on row removal
- Ideal for 90% of list-detail views     - Ideal when rows have complex local mutations
```

### 5.2 Approach 1: Hybrid Pattern (Recommended)

Use `resourceAsync` for the outer list, and maintain inner item loading states via a light reactive Map:

```typescript
@Component({ ... })
export class ProjectListComponent {
  private http = inject(HttpClient);
  private orgDetailsState = signal<Record<string, AsyncState<Organization>>>({});

  projectsRef = resourceAsync(() => this.http.get<Project[]>('/api/projects'));

  loadOrg(orgId: string) {
    if (this.orgDetailsState()[orgId]?.data) return; // cache check
    this.orgDetailsState.update(s => ({ ...s, [orgId]: { isLoading: true, error: null, data: null } }));
    this.http.get<Organization>(`/api/organizations/${orgId}`).subscribe({
      next: (data) => this.orgDetailsState.update(s => ({ ...s, [orgId]: { isLoading: false, error: null, data } })),
      error: (error) => this.orgDetailsState.update(s => ({ ...s, [orgId]: { isLoading: false, error, data: null } })),
    });
  }
}
```

### 5.3 Approach 2: Child `resourceAsync` with Row Cleanup

When child rows require full resource capabilities (`reload()`, `set()`, `preserveValueOnError`):

```typescript
const childResources = new Map<string, WritableResourceRef<OrgDetail>>();

function getOrCreateChild(orgId: string, injector: Injector): WritableResourceRef<OrgDetail> {
  let ref = childResources.get(orgId);
  if (!ref) {
    ref = resourceAsync(
      {
        params: () => orgId,
        loader: (id, {abortSignal}) => fetchOrg(id, abortSignal),
      },
      {injector, lazy: true, preserveValueOnError: true},
    );
    childResources.set(orgId, ref);
  }
  return ref;
}

// CRITICAL: Clean up deleted rows to prevent leaks
function removeRow(orgId: string) {
  const ref = childResources.get(orgId);
  ref?.destroy();
  childResources.delete(orgId);
}
```

---

## 6. Code vs. Spec Gap Analysis

| Requirement / Spec Item             | Implementation in Code                 | Gap / Finding                                          | Assessment     |
| :---------------------------------- | :------------------------------------- | :----------------------------------------------------- | :------------- |
| **Pure params & loader separation** | `ResourceAsyncDefinition<P, T>`        | None. Pure tracking is strictly enforced.              | ✅ Exact match |
| **All Concurrency Behaviors**       | `switch`, `exhaust`, `concat`          | None. Reentrant calls and scheduling verified.         | ✅ Exact match |
| **AbortSignal Propagation**         | `AbortController` linked per execution | None. Emits on cancellation, destruction, and reset.   | ✅ Exact match |
| **Background Value Retention**      | `preserveValueOnError: boolean`        | None. Previous data retained with error status.        | ✅ Exact match |
| **Type-Safe Nullability**           | Function overloads on `defaultValue`   | None. Precise `Signal<T>` vs `Signal<T \| undefined>`. | ✅ Exact match |
| **Lifecycle Destruction**           | `destroy()` & `DestroyRef` hook        | None. Disposes injector-level and explicit resources.  | ✅ Exact match |

---

## 7. Evolutionary Roadmap & Next Steps

1. **SSR Hydration Key**:
   - Introduce an optional `hydrationKey?: string` to serialize server-rendered state and eliminate client-side refetch
     flickers.
2. **Optimistic Rollback Hook**:
   - Provide an automatic rollback snapshot callback within `set()` / `update()` for easy recovery on subsequent
     mutation errors.
