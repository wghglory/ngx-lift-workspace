# Reactive API review follow-ups Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the 12 remaining P2/P3 findings from `docs/reviews/upload-and-reactive-apis.md` after PRs #264–#268
fixed all four P1s and 19 other findings.

**Architecture:** Keep each fix at the public seam named in the review doc. Group changes by module so each task has its
own red/green cycle: `resourceAsync` operation ownership and scheduling, `computedAsync` equality, signal-form facade
types and submission helpers, then demo gating and polling callback types.

**Tech Stack:** Angular signals/forms, RxJS, TypeScript strict mode, Vitest, Nx.

**Spec:** `/Volumes/My/Work/ngx-lift-workspace/docs/reviews/upload-and-reactive-apis.md` (plus design specs linked from
each finding).

## Global Constraints

- Strict TypeScript; no `any`; DRY; JSDoc for exported symbols; Prettier formatted.
- Components must be standalone with OnPush; signal inputs/outputs.
- Tests must cover observable contracts, cancellation before/during/after ownership changes, and real Angular form
  bindings for CVA/validator/disabled/reset behavior.
- Use the repository-pinned Nx CLI and configured targets.
- Public type changes must keep the documented design-spec contract.

## Review Focus

- A synchronous producer emission that resets the resource must stop producer work, not just hide values. Test with a
  multi-value Observable that checks `subscriber.closed`.
- A throwing teardown must still settle the execution promise and apply reset/disposal state. Test reset and disposal
  with a throwing finalizer.
- An abort handler that destroys the owner or reads a signal must not start the next factory or add a reactive
  dependency. Test both cases separately.
- A pending parameter notification must not overwrite a later local write, while a later parameter change still reloads.
  Test both orderings.
- A zero-argument constant-error `ValidatorFn` must remain a validator, not be installed as a getter. Test with a real
  Angular tick.
- A submitted provisioning name must have a completed availability result for that exact name. Test immediate submit
  after typing a reserved name.

Each of these is pinned by a test in its owning task below.

---

### Task 1: resourceAsync operation ownership and scheduling

**Files:** Modify `libs/ngx-lift/src/lib/query/resource-async.ts`, test
`libs/ngx-lift/src/lib/query/resource-async.spec.ts`.

Interfaces: consumes existing `ResourceAsyncRef` API; produces no new public symbols.

- [ ] **Step 1:** Add a test where a multi-value Observable checks `subscriber.closed`, calls `reset()` from the first
      `next`, and assert exactly one value and a cancelled execution. Run the focused spec; expect FAIL.
- [ ] **Step 2:** Create a `Subscriber` before the producer, add it to `operation.subscription` before
      `source$.subscribe(subscriber)`. Run the test; expect PASS.
- [ ] **Step 3:** Add tests for reset and disposal with an Observable finalizer that throws; assert the execution
      promise settles, cancellation state applies, and the resource remains usable. Expect FAIL.
- [ ] **Step 4:** Make `stopOperation` settle through nested `try/finally` so abort, unsubscribe, state transition, and
      promise settlement all run even when a teardown throws. Expect PASS.
- [ ] **Step 5:** Add tests for an abort handler that calls `destroy()` and for a finalizer that reads a signal; assert
      no next factory starts and no reactive dependency is added. Expect FAIL.
- [ ] **Step 6:** Run outgoing cleanup in `untracked()` and recheck disposal plus generation before invoking the next
      factory, keeping the existing post-factory check. Expect PASS.
- [ ] **Step 7:** Add both orderings of a local override against a pending parameter change; assert the later local
      write wins and a subsequent parameter change still reloads. Expect FAIL.
- [ ] **Step 8:** Tag scheduled dependency effects so a superseded first-run notification is skipped without removing
      the dependency capture. Expect PASS.
- [ ] **Step 9:** Add a test asserting two `reload()` calls before the scheduler return `true`, then `false`, with one
      factory start. Expect FAIL.
- [ ] **Step 10:** Reserve a reload slot until it starts or is cancelled, clearing it in `cancelAll` and on consumption.
      Expect PASS.
- [ ] **Step 11:** Run the focused `ngx-lift` spec target and commit.

### Task 2: computedAsync absent-value equality

**Files:** Modify `libs/ngx-lift/src/lib/signals/computed-async.ts`, test
`libs/ngx-lift/src/lib/signals/computed-async.spec.ts`.

Interfaces: no signature changes; `equal` still consumes declared values.

- [ ] **Step 1:** Add strict consumer test reading before and after first emission with `(a, b) => a.id === b.id`;
      assert no `TypeError`. Expect FAIL.
- [ ] **Step 2:** Bypass the caller comparator when either side is the absent state, using identity equality for that
      transition. Expect PASS.
- [ ] **Step 3:** Run focused spec and commit.

### Task 3: signal-form facade types and submission helpers

**Files:** Modify `libs/ngx-lift/src/lib/models/to-signal-form.model.ts`,
`libs/ngx-lift/src/lib/signals/to-signal-form.ts`, `libs/ngx-lift/src/lib/signals/to-submit-value.ts`,
`libs/ngx-lift/src/lib/signals/form-bindings.ts`; tests in matching `.spec.ts` files.

Interfaces: `value` becomes the Angular enabled-value type; `rawValue` stays the raw type; `toSubmitValue` and
`bindValidators` signatures unchanged.

- [ ] **Step 1:** Add strict consumer and runtime assertions for a disabled non-nullable control with an enabled
      sibling; expect FAIL on type check.
- [ ] **Step 2:** Derive the enabled and raw value signals separately from Angular form types. Expect PASS.
- [ ] **Step 3:** Add tests for an initially throwing transform (facade construction succeeds, signal read throws), an
      initial call counter of one, and debounced edits. Expect FAIL.
- [ ] **Step 4:** Move the initial snapshot into the observable pipeline once and remove the eager `compute()` plus
      `startWith(null)`. Expect PASS.
- [ ] **Step 5:** Add a zero-arg constant-error `ValidatorFn` test through a real Angular tick, plus null-returning
      validator and reactive getter cases. Expect FAIL.
- [ ] **Step 6:** Resolve zero-arg functions by their result shape instead of arity alone. Expect PASS.
- [ ] **Step 7:** Add a raw object colliding with `value`/`status`/`valueChanges` beside a real control carrying the
      same payload; expect FAIL.
- [ ] **Step 8:** Detect genuine `AbstractControl` instances and preserve raw records. Expect PASS.
- [ ] **Step 9:** Run focused specs plus typecheck and commit.

### Task 4: demo availability gating and polling absence types

**Files:** Modify `apps/demo/src/app/ngx-lib/pages/signals/to-signal-form/to-signal-form.component.ts` and its spec;
`libs/ngx-lift/src/lib/operators/poll.operator.ts` and its spec.

Interfaces: polling callback overloads accept `Input | undefined` on timer reads.

- [ ] **Step 1:** Add a demo test typing `prod-db` and submitting immediately; assert no successful payload, then assert
      success after approval. Expect FAIL.
- [ ] **Step 2:** Gate the button and `onSubmit()` on a completed availability result matching the trimmed name. Expect
      PASS.
- [ ] **Step 3:** Add a strict consumer example where a plain `Subject<string>` is silent at the first timer tick and
      the callback handles `undefined`. Expect FAIL on type check.
- [ ] **Step 4:** Include `undefined` in the relevant callback parameter types and implementation signature. Expect
      PASS.
- [ ] **Step 5:** Run focused specs, typecheck, and commit.

### Task 5: whole-branch verification and PR

- [ ] **Step 1:** Run `pnpm run format:check`, `pnpm run lint`, `pnpm run typecheck`, `pnpm run test:ngx`,
      `pnpm run test:clr`, and the focused demo test target.
- [ ] **Step 2:** Dispatch a fresh code reviewer on `e0facfd7...HEAD`; fix Critical/Important findings and re-run
      affected checks until no open issues remain.
- [ ] **Step 3:** Push the branch and open a PR against `main` summarizing fixed findings and verification evidence.
