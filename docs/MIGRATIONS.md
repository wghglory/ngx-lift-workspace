# ngx-lift Migration Guides

This document consolidates migration guides and breaking change notes across major architectural milestones of
`ngx-lift`.

---

## Table of Contents

1. [Async & Shared Query Architecture (PR #142)](#1-async--shared-query-architecture-pr-142)
2. [Zoneless Angular & Native Vitest Migration](#2-zoneless-angular--native-vitest-migration)

---

## 1. Async & Shared Query Architecture (PR #142)

This milestone introduces shared multi-observer query caching (`queryResource`, `QueryClient`, `mutateResource`) and
corrects strict typing contracts across existing primitives.

### A. Nullable Collections and Emptiness Predicates

`isEmpty()` and `isNotEmpty()` no longer incorrectly narrow nullable collections to `null`, `undefined`, or a defined
collection. Empty defined collections (`[]`, `{}`) evaluate to `true` for `isEmpty` and `false` for `isNotEmpty`, so
previous type predicates were unsound.

Always check nullability explicitly:

```typescript
import {isNotEmpty} from 'ngx-lift';

function process(items: string[] | null | undefined): void {
  if (items != null && isNotEmpty(items)) {
    console.log(items.length);
  }
}
```

_Note_: Explicit generic parameters such as `isNotEmpty<MyType>(value)` are no longer accepted; use `isNotEmpty(value)`.
Runtime emptiness evaluation remains identical.

---

### B. Combined and Merged Signals

- **`combineFrom()`**: Without an explicit `initialValue`, `combineFrom()` returns `undefined` before asynchronous
  sources produce their first emission. Handle that state or pass an `{initialValue}` option.
- **`mergeFrom()`**: Without an explicit `initialValue`, `mergeFrom()` requires at least one source to emit
  synchronously during creation; otherwise it throws an initialization error. Always provide `{initialValue}` for purely
  asynchronous streams. An explicit `null` initial value is now strictly preserved in the return type.

```typescript
import {mergeFrom} from 'ngx-lift';

const state = mergeFrom([response$], {initialValue: [] as string[]});
```

---

### C. `resourceAsync` Lifecycle, Cancellation, and Strict Imports

1. **Cancellation Handling**:
   - Awaited `.execute()` calls reject with `ResourceAsyncCancelledError` when replaced by subsequent emissions,
     manually reset, overridden locally via `.set()`, or when the component is destroyed.
   - Calling `.execute()` on a disposed resource rejects with `ResourceAsyncDisposedError`.
2. **Parameters Separation**:
   - Prefer `{params, loader}` for tracked parameters and untracked network execution, especially with
     `behavior: 'exhaust'`.
3. **Public Imports**:
   - Always import `resourceAsync` from `'ngx-lift'`. Internal source modules were relocated from `signals/` to
     `query/`. Deep imports to internal source paths are unsupported.

---

### D. Kubernetes Pagination Operator

Pagination automatically retries HTTP 429 status codes by default with exponential backoff.

- Use `{initialParams, retryConfig: false}` if you need immediate error propagation without retry.
- The aggregate result carries the final page metadata, clears continuation tokens, and normalizes null or missing items
  to `[]`.
- Scalar parameters named `initialParams` or `retryConfig` remain supported.

---

## 2. Zoneless Angular & Native Vitest Migration

`ngx-lift-workspace` operates as a **fully zoneless runtime and test environment**. All dependencies on `zone.js` have
been eliminated.

### Core Architecture

- **Runtime Zoneless Performance**: Enabled via `provideZonelessChangeDetection()` in `app.config.ts`, reducing bundle
  size and eliminating monkey-patched browser overhead.
- **Modern Testing Strategy**: All unit tests run on native ESM and Vitest without `zone.js` wrappers.
- **Reactive Synchronization**: Uses `TestBed.tick()` to execute pending reactive effects and synchronize views,
  strictly avoiding deprecated `TestBed.flushEffects()`.

### Key Migration Patterns for Tests

#### Replacing `fakeAsync` / `tick` with Vitest Fake Timers

- **Legacy Zone.js Pattern**:

  ```typescript
  it('should wait for timeout', fakeAsync(() => {
    let flag = false;
    setTimeout(() => {
      flag = true;
    }, 100);
    tick(100);
    expect(flag).toBe(true);
  }));
  ```

- **Modern Zoneless Vitest Pattern**:
  ```typescript
  import {beforeEach, afterEach, vi} from 'vitest';

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should wait for timeout', async () => {
    let flag = false;
    setTimeout(() => {
      flag = true;
    }, 100);
    await vi.advanceTimersByTimeAsync(100);
    expect(flag).toBe(true);
  });
  ```

#### Synchronizing Angular Signals and Effects

In a zoneless environment, Angular effects run asynchronously. Use `TestBed.tick()` to flush pending Signal effects:

```typescript
it('should react to signal changes', () => {
  fixture.componentRef.setInput('data', 'new value');
  TestBed.tick(); // flushes reactive signal effects
  expect(component.derivedValue()).toBe('new value');
});
```
