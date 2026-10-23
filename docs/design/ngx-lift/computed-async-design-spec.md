# Design Specification: `computedAsync`

Status: Implemented (contract audit). Owner: ngx-lift maintainers. Updated: October 17, 2026. Package: ngx-lift.
Approval: existing API; this audit does not approve new behavior.

**Source:** [computed-async.ts](../../../libs/ngx-lift/src/lib/signals/computed-async.ts)

**Regression tests:** [computed-async.spec.ts](../../../libs/ngx-lift/src/lib/signals/computed-async.spec.ts)

---

## Applicable contracts

Reactive dependency capture, flattening, cancellation, typed error/fallback behavior and injector disposal apply. The
readonly signal owns no rendered UI, form value or shared query cache.

## Background

`computedAsync` derives an asynchronous operation (Observable, `PromiseLike<T>`, or synchronous value) into a read-only
Angular Signal.

Unlike `resourceAsync` (which produces a full-featured resource object with `status`, `isLoading`, `error`, `reload()`,
and local `set()` methods), `computedAsync` returns a **read-only signal**. The return type is `Signal<T | undefined>`
without a guaranteed initial value, or `Signal<T>` when initialization guarantees a value. Use it for derivations that
need a value rather than a resource lifecycle.

```
       [ Upstream Signals ]
                │
                ▼
       ┌─────────────────┐
       │  computedAsync  │ ◄─── Concurrency Policy (switch / merge / concat / exhaust)
       └────────┬────────┘
                │
                ▼
         [ Read-only Signal ]
```

---

## Developer learning journey and pedagogy plan

Prerequisites: Angular signals, Observable sources and injection-context initialization.

| Reader task                   | Learning outcome                                    | Destination / working example                                                                 |
| ----------------------------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Derive a changing local value | Explain when a dependency replaces its async source | [/ngx-lift/signals/computedAsync](https://ngx-lift.vercel.app/ngx-lift/signals/computedAsync) |
| Fail and recover              | Distinguish a typed fallback from a read-time throw | Same demo, examples 11/12; breaking correction below                                          |

Validation and delivery: The entry flow landed in #162. Existing runtime/type tests cover the contract; human
comprehension and the 21.x release gates remain separate. The public API and behavior sections below own exact options
and limitations; examples introduce them after the first task.

## Public API and examples

### 2.1 Basic Usage

Create the signal in an Angular injection context, or supply `options.injector`.

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
  return http.get<User>(`/api/users/${id}`);
});
```

HttpClient returns a cold Observable, so this request does not need an additional defer wrapper.

Reading a signal inside a later `.then()` callback, timer, or inner Observable subscription does not establish the
intended dependency.

---

## Behavior and architecture

### 3.1 Initial Values & `requireSync`

- Without `initialValue`, the signal initially returns `undefined`, and the first computation is scheduled inside an
  Angular effect.
- When `requireSync: true` is configured without an initial value, the factory executes immediately upon construction:
  - It accepts synchronous values or synchronous Observable emissions.
  - It rejects PromiseLike sources and Observables that do not emit synchronously.
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

- **Default (Throw on Read)**: An unhandled failure is thrown when the signal is read. This includes arbitrary rejection
  values such as objects, null and undefined; failures never masquerade as successful T values.
- **`onError` Fallback**:
  ```typescript
  const data = computedAsync(() => http.get<User>('/api/user'), {
    onError: (err) => defaultUser,
  });
  ```
- **`throwOnError: true`**: Invokes onError for side effects but throws on reads even if it returns a fallback. The
  former false option is rejected.
- **Fallback typing**: onError returns T. Include undefined in T explicitly when it is valid data. Initial-value
  overloads also require source results to match T; they cannot hide undefined emissions behind `Signal<T>`.

### 5.2 `previousValue` and `equal`

- `previousValue` passed to the factory comes from the last successful source value or fallback (`undefined` after
  unhandled errors).
- `equal` controls notifications from the output Signal. It does not prevent the factory from re-evaluating when
  dependencies change.

---

## 6. Breaking error/type correction

Previously, `state.error as T` returned arbitrary failures as success data; onError could also silently return undefined
behind `Signal<T>`. The existing API now throws unhandled failures on reads, retains successful typed fallbacks, and
throws callback failures on reads. `throwOnError: true` preserves its side-effect-then-throw behavior; false is no
longer accepted. Sources with initial values cannot silently emit undefined unless T includes it. No new public API is
needed.

[Angular toSignal](https://angular.dev/ecosystem/rxjs-interop#error-and-completion) also throws source failures on
reads. The implementation preserves per-source failure containment, dependency-driven recovery, cancellation and eager
Promise rejection handling.

**Release treatment:** the maintainer selected a 21.x compatibility exception on October 17; see the
[version policy](../../DEPLOYMENT.md#version-policy). The change remains behaviorally breaking. Existing default callers
that inspected error objects as data must catch failures or supply a typed fallback. Remove throwOnError:false; use
onError for fallback data or createAsyncState/resourceAsync/queryResource for explicit loading/error state. Calls
already handling source errors through catchError or createAsyncState preserve their successful data contract.

```typescript
const count = computedAsync(() => loadCount(), {initialValue: 0, onError: () => 0});
const optional = computedAsync<number | undefined>(() => loadCount(), {
  initialValue: 0,
  onError: () => undefined,
});
```

See the [roadmap](../../priority-roadmap.md) for planned work.

## Compatibility, rollout, and risks

The synchronous initialization path uses Angular's exported createWatch primitive. Recheck that contract when upgrading
Angular. Loading/reload UI belongs to resourceAsync or queryResource; planned extensions are tracked in the roadmap.

## Interactive examples

The [computedAsync demo](https://ngx-lift.vercel.app/ngx-lift/signals/computedAsync) compares a typed numeric fallback
with default read-time errors. Example 11 changes from 42 to fallback 0 and back to 42. Example 12 separates failing the
source from reading the signal: the UI catches the read in a button handler, displays the failure, and permits a
successful read after recovery. The raw throwing signal is not bound directly in the template.

## Terminology

A factory is evaluated when tracked dependencies change; a source is the returned value/Observable/PromiseLike. A
flattened subscription has a lifetime distinct from eagerly started factory work.

## Goals

- G1: Derive async values with explicit flattening and injector-owned cleanup.
- G2: Preserve accurate signal types and distinguish thrown failures from successful fallback values.

## Non-Goals

### Not now

A separate result API or new loading/status surface.

### Outside this API

Shared server cache, writes, reload controls and native form-field ownership.

## Use cases and acceptance

| ID  | Task               | Initial state/action                    | Outcome                                     | Failure/recovery                     | Demo/test                             |
| --- | ------------------ | --------------------------------------- | ------------------------------------------- | ------------------------------------ | ------------------------------------- |
| C1  | Derive changing ID | Rapid dependency changes in switch mode | Old source unsubscribed/ignored             | Later successful dependency recovers | computed-async.spec.ts                |
| C2  | Render fallback    | Source fails                            | Typed onError value                         | Callback failures throw on read      | demo examples 11/12; unit regressions |
| C3  | Require sync       | Construct with synchronous source       | Defined initial value or construction error | Cleanup on failure                   | requireSync type/runtime assertions   |

## Industry evidence and current gaps

[Angular toSignal](https://angular.dev/ecosystem/rxjs-interop#error-and-completion) throws source errors on reads. Adopt
that failure boundary while adding dependency-driven factories and flattening. Use resourceAsync/queryResource when
loading/error/reload state is needed; do not extend a readonly value signal into a second resource API.

## Demo and validation plan

Existing demo: `apps/demo/src/app/ngx-lib/pages/signals/computed-async/`. Adjacent runtime/type tests cover
initialization, arbitrary rejection values, fallback typing, each flattening mode and cleanup. The demo keeps a live
request failure visible through error UI rather than replacing failed HTTP reads with local success data.

## Clarity, accessibility, and localization

Headless API; it owns no control labels, focus or translations. Application UI distinguishes initial loading/error from
retained-data refresh where applicable. Forms invoke/observe this API without assigning it a CVA/native field value.

## Review decisions and delivery

This is an audit of implemented behavior, including the unreleased correction above. Proposed features and unresolved
implementation work belong in the [gap register](../implementation-gaps.md) and [roadmap](../../priority-roadmap.md); no
new API is approved here.

## Evidence

Contract checked against source and existing regression assertions at base `e4a43f9` on October 16, 2026. Test pointers
identify existing coverage; no runtime suites were rerun for this documentation-only change. Release/CI evidence remains
in the corresponding PR and pipeline.
