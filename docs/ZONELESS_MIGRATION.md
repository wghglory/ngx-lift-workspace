# Zoneless Angular & Vitest Migration Guide

This document summarizes the complete migration of the `ngx-lift-workspace` monorepo to a **fully zoneless runtime and
test environment**. All remnants of `zone.js` have been removed, and all 599+ unit tests have been successfully
refactored from `zone.js`-dependent helpers like `fakeAsync` and `tick()` to native **Vitest Fake Timers** and modern
Angular reactive APIs.

---

## 1. Core Objectives

- **Runtime Zoneless Performance**: Enable native Angular zoneless change detection using
  `provideZonelessChangeDetection()` in `app.config.ts` to reduce initial bundle sizes, speed up execution, and
  eliminate the performance overhead of tracking macro/microtasks via monkey-patched browser APIs.
- **Modern Testing Strategy**: Completely remove `zone.js` from `devDependencies` and polyfills. Transition all unit
  tests (UT) to native ESM/Vitest capabilities, avoiding heavy test-bed wrappers or custom compatibility layers.
- **No Deprecated APIs**: Align with Angular v20+ standards by using `TestBed.tick()` to execute pending reactive
  effects and synchronize the model to the UI, explicitly avoiding the deprecated `TestBed.flushEffects()`.

---

## 2. Key Migration Patterns

### A. Replacing `fakeAsync` with Vitest Fake Timers

In the legacy setup, `fakeAsync` was a wrapper that intercepted all asynchronous execution to run it synchronously on a
mock clock. In the zoneless Vitest setup, we use Vitest's native fake timers in the test setup.

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

### B. Triggering Signals and Effects with `TestBed.tick()`

Angular Signals, computed values, and effects require synchronization. In Zoneless testing, calling `TestBed.tick()`
forces Angular's reactive engine to execute pending effects and synchronize state with the UI.

- **Legacy Zone.js Pattern**:

  ```typescript
  it('should update effect', fakeAsync(() => {
    const sig = signal(1);
    const doubled = computed(() => sig() * 2);

    sig.set(2);
    TestBed.tick(); // Or flushEffects()
    expect(doubled()).toBe(4);
  }));
  ```

- **Modern Zoneless Vitest Pattern**:

  ```typescript
  it('should update effect', async () => {
    const sig = signal(1);
    const doubled = computed(() => sig() * 2);

    sig.set(2);
    TestBed.tick(); // Force reactive synchronization
    expect(doubled()).toBe(4);
  });
  ```

### C. Async Injection Contexts

Tests utilizing `TestBed.runInInjectionContext` with asynchronous assertions (such as awaiting timers or promises) must
make both the test block and the injection callback asynchronous, and prefix with `await`.

- **Legay Pattern**:

  ```typescript
  it('should work with trigger', fakeAsync(() => {
    TestBed.runInInjectionContext(() => {
      const trigger = createTrigger();
      trigger.next();
      tick(100);
      expect(trigger.value()).toBe(1);
    });
  }));
  ```

- **Modern Zoneless Vitest Pattern**:

  ```typescript
  it('should work with trigger', async () => {
    await TestBed.runInInjectionContext(async () => {
      const trigger = createTrigger();
      trigger.next();

      TestBed.tick();
      await vi.advanceTimersByTimeAsync(100);
      TestBed.tick();

      expect(trigger.value()).toBe(1);
    });
  });
  ```

---

## 3. Dealing with Complex Asynchronous Scenarios

### A. Testing Promise Resolution

Since native `Promise` chains are run as microtasks, they cannot be flushed using simple synchronous timer advancement.
We must utilize **`vi.advanceTimersByTimeAsync(delay)`** to allow the JavaScript event loop to cycle and resolve promise
resolutions/rejections seamlessly.

- **Correct Pattern**:

  ```typescript
  it('should resolve async data', async () => {
    const dataPromise = someService.fetchData(); // returns Promise

    TestBed.tick();
    await vi.advanceTimersByTimeAsync(100); // Wait for promise delay to run event loop
    TestBed.tick();

    expect(someService.data()).toEqual(expectedData);
  });
  ```

### B. Testing Synchronous / Direct Errors (`throwError`)

If an Observable immediately throws an error synchronously during change detection (e.g., using
`throwError(() => Error)`), you do not need asynchronous microtask flushing. Wrap the change detection or timer
execution block directly inside synchronous `expect().toThrow()`:

```typescript
it('should throw immediately', () => {
  TestBed.runInInjectionContext(() => {
    resourceAsync(() => throwError(() => new Error('API Error')), {
      throwOnError: true,
    });

    expect(() => {
      TestBed.tick(); // Triggers the reactive execution immediately
      vi.advanceTimersByTime(0); // Synchronously flushes macros
    }).toThrow('API Error');
  });
});
```

---

## 4. Developer Checklist for New Unit Tests

When writing new `.spec.ts` files or features in this monorepo, follow these rules:

1. **Setup Hooks**: Include `vi.useFakeTimers()` in `beforeEach` and `vi.useRealTimers()` in `afterEach` at the
   file-level or block-level if your test involves async flows.
2. **Make Test Callbacks Async**: Ensure any test utilizing asynchronous timers has an `async` spec block (e.g.
   `it('should work', async () => { ... })`).
3. **Say NO to `fakeAsync` / `tick()` Imports**: Ensure you do not import `fakeAsync` or `tick` from
   `@angular/core/testing` or `zone.js`.
4. **Use `TestBed.tick()`**: Whenever you change signals, inputs, or trigger observables that update signal state, use
   `TestBed.tick()` to force Angular's reactive system to synchronize. Do not use the deprecated
   `TestBed.flushEffects()`.
5. **Use Async Timer Helpers**: Use `await vi.advanceTimersByTimeAsync(delay)` for promises, and
   `vi.advanceTimersByTime(delay)` for purely synchronous timer advancement.
