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

Pagination automatically retries HTTP 429 status codes by default using server-provided delays or a fixed fallback
delay.

- Use `{initialParams, retryConfig: false}` if you need immediate error propagation without retry.
- The aggregate result carries the final page metadata, clears continuation tokens, and normalizes null or missing items
  to `[]`.
- Scalar parameters named `initialParams` or `retryConfig` remain supported alongside other HTTP parameters.
- A lone `{retryConfig: false}` is reserved as the retry opt-out shorthand. To send that boolean as an HTTP parameter,
  use `{initialParams: {retryConfig: false}}`.

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

## 3. Unreleased quality audit hardening (2026-10-13)

This branch has not been published. Review these consumer-facing changes before selecting a release version:

- HTTP(S) validation now parses absolute URLs. Long domain suffixes and IPv6 are accepted; invalid ports are rejected.
  Single-label hostnames remain rejected for compatibility. URL parsing does not implement an application access policy.
- `range` rejects non-finite inputs and output larger than 1,000,000 elements. Zero-step repetition remains supported.
  Invalid date-range boundaries now throw during validator creation instead of silently disabling constraints.
- FileReader encoded text defaults to UTF-8. Existing ASCII PEM/base64 remains unchanged. For legacy Latin-1 byte
  strings, set `[textEncoding]="'latin1'"`. This text reader does not provide binary-file roundtripping.
- Interactive tooltip content now exposes a named dialog, while text remains a tooltip. Consumers can set
  `cllTooltipLabel`; keyboard focus, Escape, scroll positioning and restored trigger attributes are covered by tests.
- Spinner stays decorative by default. Set `[decorative]="false"` to expose loading status; override `label` with a
  localized operation-specific message. The existing `class` input now forwards classes to the visible spinner.
- ByteConverter accepts an optional explicit locale: `bytes | byteConverter: locale`. The historical 1024 scaling and
  KB/MB labels are preserved; non-finite values return null.
- `mutateResource` reports post-success cache failures through optional `invalidationError`; successful server writes
  stay resolved even when tag mapping or cache synchronization fails. Observe that signal to offer a query refresh
  instead of retrying the write. Transport/write errors still reject as before.
- Internal form bridge helpers and the root-exported translation mock remain available, with deprecation guidance.
  `computedAsync` retains its legacy default error-as-value behavior. Use `onError` or `throwOnError`, or choose an
  explicit resource state; a typed result/default-error redesign belongs in a separately reviewed major release.
- Peer ranges now stop at the next major of Angular/Clarity/RxJS/forge/ngx-lift. Angular 22 requires a new tested
  compatibility update. The workspace pins pnpm 11.7.0 through a single package-manager declaration.
- `validate` is read-only; `fix` performs formatting and ESLint fixes. CI, publish and deploy use a shared quality
  workflow, with coverage and all three browsers. Package smoke checks consume real tarballs but reuse installed host
  dependencies; they do not prove fresh peer installation or SSR/hydration compatibility.

The UTF-8 default and narrower peer support need an explicit SemVer review; do not automatically treat this entire
branch as a patch release. See [Chinese implementation notes](design/quality-audit-hardening.zh-CN.md).
