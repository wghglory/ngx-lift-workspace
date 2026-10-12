# Design Specification: `computedAsync`

**Status**: Implemented & Production-ready  
**Module**: `libs/ngx-lift/src/lib/signals/computed-async.ts`  
**Tests**: `libs/ngx-lift/src/lib/signals/computed-async.spec.ts` (51 passing unit tests)

---

## 1. Vision & Architecture

`computedAsync` derives an asynchronous operation (Observable, `PromiseLike<T>`, or synchronous value) into a read-only
Angular Signal.

Unlike `resourceAsync` (which produces a full-featured resource object with `status`, `isLoading`, `error`, `reload()`,
and local `set()` methods), `computedAsync` returns a **pure `Signal<T>`**. It is intended for computed derivations
where consumers only require the computed value itself.

```
       [ Upstream Signals ]
                │
                ▼
       ┌─────────────────┐
       │  computedAsync  │ ◄─── Concurrency Policy (switch / merge / concat / exhaust)
       └────────┬────────┘
                │
                ▼
         [ Signal<T> ] (Pure, composable read-only signal)
```

---

## 2. API Contract & Core Capabilities

### 2.1 Basic Usage

```typescript
import {inject, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {computedAsync} from 'ngx-lift';

const http = inject(HttpClient);
const userId = signal(1);

// Derives a read-only Signal from an async HTTP request
const user = computedAsync(() => http.get<User>(`/api/users/${userId()}`));
```

### 2.2 Parameter Capture Before Async Boundaries

Capture all reactive parameters synchronously before crossing asynchronous boundaries:

```typescript
const result = computedAsync(() => {
  const id = userId(); // synchronously captured dependency
  return defer(() => http.get<User>(`/api/users/${id}`));
});
```

Reading a signal inside a later `.then()` callback, timer, or inner Observable subscription does not establish the
intended dependency.

---

## 3. Initialization & Angular Primitives

### 3.1 Initial Values & `requireSync`

- Without `initialValue`, the signal initially returns `undefined`, and the first computation is scheduled inside an
  Angular effect.
- When `requireSync: true` is configured without an initial value, the factory executes immediately upon construction:
  - It accepts synchronous values or synchronous Observable emissions.
  - It rejects asynchronous Promises or Observables that do not emit synchronously.
  - Construction errors clean up subscriptions immediately.

### 3.2 Low-Level Primitives & `createWatch`

Factories can write service signals (such as `loading.set(true)`) while synchronously capturing request parameters.

- The ordinary path executes directly in an Angular effect (avoiding NG0600 "writing to signals inside computed"
  exceptions).
- The `requireSync` immediate path uses the low-level exported `createWatch` API from `@angular/core/primitives/signals`
  to capture dynamic dependencies immediately on creation, delegating subsequent executions to an Angular effect.
- Cleanup occurs with the owning injector or upon construction failure.

---

## 4. Flattening Behaviors & Cancellation

| Mode                   | Observable Subscriptions                                                          | Promise Results                                                                |
| :--------------------- | :-------------------------------------------------------------------------------- | :----------------------------------------------------------------------------- |
| **`switch` (Default)** | Unsubscribes previous source before subscribing to the new one.                   | Ignores the older result; underlying work may continue.                        |
| **`merge`**            | Subscribes concurrently; every emission updates the signal value.                 | Publishes results in arrival order (older responses can overwrite newer ones). |
| **`concat`**           | Waits for active source to complete before subscribing to the next queued source. | Publishes in source order; Promises may run concurrently.                      |
| **`exhaust`**          | Ignores new subscriptions while the active source is running.                     | Ignores new results while active.                                              |

The factory runs when dependencies change in every mode. `concat` and `exhaust` control subscription timing, not factory
execution. To defer network work until a source is accepted, return a cold Observable without eager side effects.

---

## 5. Error Policies & Equality

### 5.1 Error Handling Strategies

- **Default (Error as Value)**: The default behavior returns the error object as the signal value (does not throw when
  read). Typings should reflect `User | Error`.
- **`onError` Fallback**:
  ```typescript
  const data = computedAsync(() => http.get<User>('/api/user'), {
    onError: (err) => defaultUser,
  });
  ```
- **`throwOnError: true`**: Re-throws the captured error when the signal is read.

### 5.2 `previousValue` and `equal`

- `previousValue` passed to the factory comes from the last resolved source value (`undefined` after unhandled errors).
- `equal` controls notifications from the output Signal. It does not prevent the factory from re-evaluating when
  dependencies change.

---

## 6. Code vs. Spec Gap Analysis

| Requirement / Spec Item            | Implementation in Code                 | Gap / Finding                                           | Assessment     |
| :--------------------------------- | :------------------------------------- | :------------------------------------------------------ | :------------- |
| **Pure Signal Return**             | Returns `Signal<T>`                    | None. Seamlessly composable with native `computed()`.   | ✅ Exact match |
| **All Flattening Behaviors**       | `switch`, `merge`, `concat`, `exhaust` | None. Full emission and queuing behaviors tested.       | ✅ Exact match |
| **Avoid NG0600 on Dynamic Writes** | Scheduled effects + `createWatch`      | None. Prevents signal write conflicts.                  | ✅ Exact match |
| **Injector Disconnection**         | Integrated with `DestroyRef`           | None. Cancels subscriptions and watcher on unmount.     | ✅ Exact match |
| **Unhandled Rejection Safety**     | Promise rejection handlers attached    | None. Discarded promises do not trigger console errors. | ✅ Exact match |

---

## 7. Evolutionary Roadmap & Next Steps

1. **Angular `createWatch` Upgrade Stability**:
   - Maintain continuous monitoring of Angular's `@angular/core/primitives/signals` exports across major Angular version
     bumps.
2. **Clear Architecture Guidance**:
   - Guide developers to use `resourceAsync` when buttons, loading spinners, or reload methods are needed, reserving
     `computedAsync` for pure derived state streams.
