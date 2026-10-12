# Design Specification: `mutateResource`

**Status**: Implemented & Production-ready  
**Module**: `libs/ngx-lift/src/lib/query/mutate-resource.ts`  
**Tests**: `libs/ngx-lift/src/lib/query/mutate-resource.spec.ts` (18 passing unit tests)

---

## 1. Vision & Architecture

`mutateResource` is designed exclusively for explicit asynchronous write operations (e.g., POST, PUT, PATCH, DELETE)
triggered by direct user interactions (such as button clicks or form submissions).

Unlike read queries (`queryResource`), which trigger automatically as reactive dependencies change, mutations execute
strictly on demand when `.mutate(args)` is called.

```
       [ User Action: Form Submit / Click ]
                         │
                         ▼
        ┌─────────────────────────────────┐
        │  mutateResource.mutate(payload) │
        └────────────────┬────────────────┘
                         │
              Concurrency Coordinator
           ┌─────────────┼─────────────┐
           ▼             ▼             ▼
       [exhaust]      [concat]     [parallel]
       (drop/join)    (queued)     (concurrent)
                         │
                         ▼
             Network Request Execution
                         │
           ┌─────────────┴─────────────┐
           ▼                           ▼
       [SUCCESS]                    [ERROR]
           │                           │
  Invalidate Tags              Update error() Signal
  Update value() Signal        Reject returned Promise
  Resolve returned Promise
```

---

## 2. API Contract & Concurrency Policies

### 2.1 Signatures

```typescript
export function mutateResource<TArgs, TResult, E = Error>(
  mutation: (args: TArgs) => Observable<TResult> | PromiseLike<TResult> | TResult,
  options?: MutateResourceOptions<TArgs, TResult>,
): MutateResourceRef<TArgs, TResult, E>;
```

Observable results use `firstValueFrom`; other results use `Promise.resolve` to assimilate Promises, custom thenables,
and synchronous values (including `undefined`). The internal rejection hook therefore always receives a real Promise.
Source failures still reject `mutate()` and do not invalidate tags.

### 2.2 Options & Configuration (`MutateResourceOptions`)

- **`concurrency?: 'parallel' | 'exhaust' | 'concat'`**:
  - **`parallel` (Default)**: Multiple submissions proceed independently and simultaneously.
  - **`exhaust`**: Drops duplicate submissions while a request is in flight. Returns the active in-flight Promise so
    callers can await the outcome without generating duplicate server side-effects.
  - **`concat`**: Queues incoming submissions sequentially in FIFO order.
- **`invalidatesTags?: (result: TResult, args: TArgs) => QueryTag[]`**: Function returning tags to invalidate upon
  successful write completion.
- **`injector?: Injector`**: Optional explicit Angular injector.

### 2.3 `MutateResourceRef<TArgs, TResult, E>` Surface

| Property / Method | Type                                | Description                                                              |
| :---------------- | :---------------------------------- | :----------------------------------------------------------------------- |
| `mutate(args)`    | `(args: TArgs) => Promise<TResult>` | Executes the mutation with arguments and returns a standard Promise.     |
| `value`           | `Signal<TResult \| undefined>`      | Result of the latest successful mutation.                                |
| `status`          | `Signal<ResourceStatus>`            | Current mutation status: `'idle' \| 'loading' \| 'resolved' \| 'error'`. |
| `isLoading`       | `Signal<boolean>`                   | `true` while any accepted mutation is pending.                           |
| `error`           | `Signal<E \| null>`                 | Error from the latest mutation failure.                                  |
| `reset()`         | `() => void`                        | Resets status back to `'idle'` and clears value/error.                   |

---

## 3. Operational Guarantees & Lifecycle

### 3.1 Unhandled Rejection Safety

The returned `Promise` from `mutate()` is internally chained with `.catch(() => undefined)` to prevent unhandled
rejection warnings in the browser console when callers fire-and-forget without `await`. Callers who do
`await resource.mutate()` still properly receive the rejection in their `try/catch` block.

### 3.2 Tag Invalidation Timing

Successful writes invalidate declared tags immediately without awaiting background query refetches. Observing queries in
the background will update their UI states smoothly.

### 3.3 Server Boundary & Argument Snapshots

Disposal or unmounting does not cancel an already accepted server-side write. Pass immutable argument snapshots to
prevent accidental mutations of request payloads while requests are pending. Queued `concat` mutations will not start
after resource disposal.

### 3.4 Placement & Double Invalidation Prevention (Point B)

Like `queryResource`, mutations can be defined either:

- **In an `@Injectable` Service**: As a domain action facade (e.g., `userService.updateUser`), centralizing API
  transport and tag invalidation logic across multiple components.
- **In a Component**: Local to a specific form or dialog where arguments and lifecycle are tightly coupled to the view.

_Avoid Double Invalidation_: If an underlying service layer already handles cache invalidation on write success, avoid
declaring duplicate invalidation tags in the calling component.

---

## 4. Code vs. Spec Gap Analysis

| Requirement / Spec Item         | Implementation in Code                      | Gap / Finding                                          | Assessment           |
| :------------------------------ | :------------------------------------------ | :----------------------------------------------------- | :------------------- |
| **Strict On-Demand Execution**  | Only executes via `mutate(args)`            | None. Never triggers on signal shifts.                 | ✅ Exact match       |
| **Concurrency Modes**           | Implemented `exhaust`, `concat`, `parallel` | None. Synchronous reentrancy tested.                   | ✅ Exact match       |
| **Tag Invalidation**            | Reads optional `QueryClient` via DI         | None. Safely degrades if QueryClient is omitted.       | ✅ Exact match       |
| **Unhandled Rejection Safety**  | Chained silent catch                        | None. Fire-and-forget calls do not log console errors. | ✅ Exact match       |
| **Optimistic Rollback Context** | Manual snapshot via `resource.set`          | Automated `onMutate` rollback hook not yet built.      | ⚠️ Planned next step |

---

## 5. Evolutionary Roadmap & Next Steps

1. **`onMutate` Rollback Context**:
   - Add an optional `onMutate?: (args: TArgs) => Promise<TContext> | TContext` hook providing a snapshot to `onError`
     for automatic cache rollback.
2. **Global In-Flight Mutation Counter**:
   - Expose a global `isMutating()` Signal on `QueryClient` to power top-level progress bars.
