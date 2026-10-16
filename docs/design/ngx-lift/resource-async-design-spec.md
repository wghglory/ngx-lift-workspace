# Design Specification: `resourceAsync`

Status: Implemented (contract audit). Owner: ngx-lift maintainers. Updated: October 16, 2026. Package: ngx-lift.
Approval: existing API; this audit does not approve new behavior.

**Source:** [resource-async.ts](../../../libs/ngx-lift/src/lib/query/resource-async.ts)

**Regression tests:** [resource-async.spec.ts](../../../libs/ngx-lift/src/lib/query/resource-async.spec.ts)

---

## Background

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
         │ loader(id, {abortSignal})│ ◄─── Concurrency Policy (switch / exhaust)
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

## Public API and examples

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

| Property / Method | Type                           | Description                                                                                            |
| :---------------- | :----------------------------- | :----------------------------------------------------------------------------------------------------- |
| `value`           | `Signal<T>`                    | Current value. Returns `T \| undefined` if no default value was provided.                              |
| `status`          | `Signal<ResourceStatus>`       | Current status: `'idle' \| 'loading' \| 'reloading' \| 'resolved' \| 'error' \| 'local'`.              |
| `isLoading`       | `Signal<boolean>`              | `true` when status is `'loading'` or `'reloading'`.                                                    |
| `isIdle`          | `Signal<boolean>`              | `true` only when status is `'idle'`.                                                                   |
| `error`           | `Signal<E \| null>`            | Active error object, or `null`.                                                                        |
| `reload()`        | `() => boolean`                | Triggers a reload. Returns `true` if initiated, `false` if disposed or unneeded.                       |
| `execute()`       | `() => Promise<T>`             | Executes the resource and returns an awaitable native `Promise<T>`.                                    |
| `reset()`         | `() => void`                   | Aborts pending operations and transitions status back to `'idle'`.                                     |
| `set(value: T)`   | `(value: T) => void`           | Assigns a local value optimistically (sets status to `'local'`).                                       |
| `update(updater)` | `(fn: (prev: T) => T) => void` | Updates local value optimistically via transformer function.                                           |
| `destroy()`       | `() => void`                   | Permanently stops observation, aborts transport, and rejects pending executions. Idempotent.           |
| `asReadonly()`    | `() => ResourceRef<T, E>`      | Returns a read-only projection (without `set`/`update` methods).                                       |
| `hasValue()`      | Type Guard                     | Guard for a defined loaded/local value in an eligible status; initial fallback alone does not qualify. |

---

## Behavior and architecture

### 3.1 Concurrency Behaviors (`behavior`)

- **`switch` (Default)**: Cancels in-flight operations when parameters change or `reload()` is triggered.
- **`exhaust`**: Ignores new requests while an operation is in flight. An `execute()` call joins the active in-flight
  Promise.

### 3.2 Operation Cancellation Matrix

| Action               | Impact on In-Flight Work & `execute()` Promise                                                                        | Post-Condition                                                                  |
| :------------------- | :-------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------ |
| `reload()`           | In switch mode cancels active work; exhaust returns false while active/queued.                                        | Retains existing value into background reload.                                  |
| `execute()`          | In switch mode replaces work and clears to the configured initial/default fallback; exhaust joins active/queued work. | Returned Promise resolves to the fresh result.                                  |
| `set()` / `update()` | Aborts pending in-flight work; rejects pending `execute()` with `ResourceAsyncCancelledError`.                        | Status becomes `'local'`. Reactive dependencies can still fetch on next change. |
| `reset()`            | Aborts pending in-flight work; rejects pending `execute()` with `ResourceAsyncCancelledError`.                        | Status becomes `'idle'`. Lazy resources require explicit trigger.               |
| `destroy()`          | Aborts pending in-flight work; rejects pending `execute()` with `ResourceAsyncDisposedError`.                         | Resource is permanently disposed. Subsequent `execute()` rejects immediately.   |

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
- A defined `onError` fallback takes precedence over retention; returning undefined follows the failure path.

### 4.2 Signal Equality (`equal`)

- `equal` controls notifications from `value()`, not operation execution or `status()`.
- Undefined boundaries are safely handled using `Object.is`, preventing user-defined comparators like
  `(a, b) => a.id === b.id` from throwing during initial uninitialized states.

---

## 5. Advanced Patterns: Nested Resources

When rendering master-detail views or lists where each row loads independent asynchronous data:

### 5.1 Shared reads versus local resources

For finite cached row reads, use [queryResources](query-resource-design-spec.md#dynamic-collections): it reconciles
rows, deduplicates keys and disposes removed observers. A hand-built signal map plus manual subscriptions duplicates
those responsibilities and needs explicit request deduplication, transport cleanup, scope changes and stale-result
protection. The previous recommended example omitted these and has been removed.

Use child resourceAsync only when each row needs independent streaming/local set/update behavior. Resource ownership
must follow both row removal and the parent lifecycle; there is no automatic shared cache in resourceAsync.

### 5.3 Approach 2: Child `resourceAsync` with Row Cleanup

When child rows require full resource capabilities (`reload()`, `set()`, `preserveValueOnError`):

```typescript
const childResources = new Map<string, WritableResourceRef<OrgDetail | undefined>>();

function getOrCreateChild(orgId: string, injector: Injector): WritableResourceRef<OrgDetail | undefined> {
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

// Call getOrCreateChild(id, injector).reload() on expansion: lazy creation does not start loading.
// On parent teardown destroy every remaining ref and clear the map.
// Clean up deleted rows too:
function removeRow(orgId: string) {
  const ref = childResources.get(orgId);
  ref?.destroy();
  childResources.delete(orgId);
}
```

---

## 6. Scope and limitations

SSR hydration serialization and automatic optimistic rollback are not implemented. Callers own any rollback snapshots
used with local set/update operations. Planned work is tracked in the [roadmap](../../priority-roadmap.md); do not
assume future options are part of the public API.

## Terminology

An operation owns its cancellation token/subscription. Local state comes from set/update. Initial/default value is a
value() fallback; it alone does not imply hasValue() has observed a successful/local result.

## Goals

- G1: Own one local async resource with streaming and explicit execution controls.
- G2: Cancel obsolete work, retain data only under the documented policy and settle awaiting callers.

## Non-Goals

### Not now

Shared optimistic rollback and SSR serialization/hydration.

### Outside this API

Shared cache, coordinated cache polling, and server-side write cancellation.

## Use cases and acceptance

| ID  | Task                   | Initial state/action                 | Outcome                                       | Failure/recovery                                 | Demo/test                        |
| --- | ---------------------- | ------------------------------------ | --------------------------------------------- | ------------------------------------------------ | -------------------------------- |
| R1  | Load detail            | Pure params change                   | switch replaces, exhaust declines active work | Rejected execution on cancellation               | resource-async.spec.ts           |
| R2  | Refresh displayed data | Successful value then reload failure | Retained only with preserveValueOnError       | Retry or explicit fallback                       | resource demo; error regressions |
| R3  | Override locally       | Work pending then set/reset/destroy  | Old completion cannot overwrite state         | Awaiting calls settle with cancellation/disposal | lifecycle tests                  |

## Industry evidence and current gaps

[Angular resource](https://angular.dev/guide/signals/resource) separates reactive parameters and loading. Adapt that
ownership while retaining Observable streaming and local overrides. queryResources owns finite cached collections;
manual signal maps are not a replacement for its reconciliation/cancellation contract.

## Demo and validation plan

Use existing resourceAsync demos and adjacent lifecycle/type tests. Important assertions include queued executions,
exhaust dependency tracking, empty/streaming sources, callbacks, reset/local overrides and disposal. Future SSR claims
need real request isolation/PendingTasks/hydration consumers, beyond installed DOM tests.

## Compatibility, rollout, and risks

Angular 21 and RxJS; no new dependency. Injector lifetime owns effects; provide injector outside injection context.
Observable sources can emit repeatedly: execute resolves on an emission while observation continues until completion or
cancellation. Empty completion resolves the configured fallback/undefined. Initial/default fallback is also visible
after clearing the internal value; do not describe execute/reset as always exposing undefined.

## Clarity, accessibility, and localization

Headless API; it owns no control labels, focus or translations. Application UI distinguishes initial loading/error from
retained-data refresh where applicable. Forms invoke/observe this API without assigning it a CVA/native field value.

## Review decisions and delivery

This is an audit of shipped behavior. Proposed features and unresolved implementation work belong in the
[gap register](../implementation-gaps.md) and [roadmap](../../priority-roadmap.md); no new API is approved here.

## Evidence

Contract checked against source and existing regression assertions at base `e4a43f9` on October 16, 2026. Test pointers
identify existing coverage; no runtime suites were rerun for this documentation-only change. Release/CI evidence remains
in the corresponding PR and pipeline.
