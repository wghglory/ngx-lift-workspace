# Upload and reactive API code review

> Follow-up implementation (2026-11-27): the report below describes the historical `e0facfd7` baseline. PRs #264–#268
> address 19 findings, including all four P1s. PR #269 addresses the remaining 12, including the two gaps identified
> during its follow-up review:
>
> - **P2, local resource overrides:** direct factories now snapshot the versions of their observed signal dependencies
>   when `set()`, `update()`, or `reset()` supersedes queued work. The discarded factory is not invoked; a later
>   dependency change still executes normally. Explicit `{params, loader}` behavior is retained.
> - **P2, zero-argument validators:** initially-null callbacks remain installed as validation dispatchers, so ordinary
>   revalidation can produce errors later. Reactive getters can still return validators, arrays, or null. A null result
>   clears effective validation; `control.validator` may retain a dispatcher. Use `[validator]` when original validator
>   identity is needed by Angular APIs such as `hasValidator`.
>
> Both gaps were reproduced before their fixes. Regression coverage includes same-turn orderings, computed equality,
> multiple and dynamic dependencies, reentrant local writes, eager factories, nullable validators, facade bindings, and
> getter transitions. The internal dependency bridge uses Angular's exported signal primitives, available at the Angular
> 21 baseline; check it during framework upgrades. Automated validation is separate from human acceptance, merging, and
> package publication.

Reviewed the workspace at `e0facfd7` on 2026-11-26. The review started with the headless upload queue, Clarity picker,
panel, and demo transports, then followed `queryResource`, `queryResources`, `mutateResource`, `resourceAsync`,
`computedAsync`, and `toSignalForm` through their implementations, tests, and public contracts. It also includes one
related finding in the standalone polling operator. The review identified 31 findings in these paths (4 P1, 22 P2, and 5
P3).

**Fix first.** Two upload paths can send files after the user's selection is no longer valid. A cold thenable can start
twice during one resource execution, and a nested form can enter a validation loop on an ordinary edit. All four
reproduced using public entry points.

| Priority | Triage meaning                                                                                                                                                                                 |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1       | Address first. A supported interaction can send a file to the wrong destination, start a discarded upload, execute external work twice, or enter recursive validation during an ordinary edit. |
| P2       | Schedule a correctness fix. A specific input, lifecycle transition, or call order produces wrong data, a stalled caller, or an unusable control.                                               |
| P3       | Follow up on diagnostic accuracy, example quality, or an efficiency improvement.                                                                                                               |

## 1. Upload files

### P1 · A pending folder drop can move to a different destination

Drop a folder while adapter A and scope A are bound. Switch both bindings to B while the directory reader is pending,
then let it finish. The probe observed one initiation on B and zero on A. The picker captures a selection version before
the await but reads the adapter and scope afterward. The spec says a scope change affects new selections only. Capture
the destination at drop time or discard the pending selection on a destination change. Keep the two-adapter test and
assert that B receives no file from A's drop.
[Drop handler](../../libs/clr-lift/src/lib/components/upload/upload.component.ts#L184) ·
[Destination lookup](../../libs/clr-lift/src/lib/components/upload/upload.component.ts#L223) ·
[Scope contract](../design/clr-lift/upload-design-spec.md#L1087)

### P1 · Resetting the form can still start the discarded upload

A real Reactive Forms host reset its control synchronously from `valueChanges` when a file was selected. The control
ended with an empty array, yet the adapter ran and the queue reported success. The picker calls the CVA change handler
and emits `filesChange` before it enqueues and records ownership. During those callbacks, `writeValue` can clear the
selection while there is still nothing to remove from the queue. Check the selection version after synchronous user
callbacks and before committing transport. Exercise both a form reset and a `filesChange` handler that clears the
picker. [Selection and enqueue](../../libs/clr-lift/src/lib/components/upload/upload.component.ts#L270) ·
[Owner reset](../../libs/clr-lift/src/lib/components/upload/upload.component.ts#L324) ·
[Form contract](../design/clr-lift/upload-design-spec.md#L690)

### P2 · Concurrent chunk failures can retry a permanent rejection

With two chunks in flight, the first failed with `retryable: true` and the second with `retryable: false`. Both chunks
were sent a second time. Each worker records only the first failure in a shared slot, and that failure decides whether
every outstanding chunk is retried. Preserve the non-retryable outcome when concurrent requests disagree. Test both
settlement orders and assert that the permanently rejected chunk is sent once and its error is available to the caller.
[Chunk workers and retry](../../libs/ngx-lift/src/lib/upload/upload-queue.service.ts#L439) ·
[Retry contract](../design/clr-lift/upload-design-spec.md#L896)

### P2 · The picker can enable itself while its form control is disabled

The `disabled` input and `setDisabledState` write to one linked signal. With both sources disabled, clearing the input
binding enabled the native picker while `FormControl.disabled` remained true. Track the two sources separately and
derive the effective disabled state from both. Bind a real control and toggle each source independently. Check the
native file input, folder button, and drop path.
[Input state](../../libs/clr-lift/src/lib/components/upload/upload.component.ts#L83) ·
[CVA setter](../../libs/clr-lift/src/lib/components/upload/upload.component.ts#L171)

### P2 · Unreadable folder entries disappear from a successful batch

A directory containing a readable file and a file whose browser read callback failed produced one successful upload, a
valid control, and no rejection output. Both file-read and directory-read failures become empty arrays. A failure on a
later directory page is therefore indistinguishable from reaching the end. Preserve readable siblings and report the
failed path or directory beside the picker. Test a failed file and a failed second page. The current helper test
explicitly expects the failed file to disappear.
[Folder traversal](../../libs/clr-lift/src/lib/components/upload/drop-files.ts#L38) ·
[Existing skip test](../../libs/clr-lift/src/lib/components/upload/drop-files.spec.ts#L103)

### P2 · A server-reported failure displays English in a translated panel

With French active, an adapter returning a status of `error` displayed “Server reported a failed upload.” The queue
creates that English message, and the renderer prefers any readable message over its translated fallback. Give this
library-owned outcome a localized message that distinguishes a failed server job from an unavailable status check.
Preserve adapter-authored details. Test the rendered row and its announcement in a second locale.
[Queue error](../../libs/ngx-lift/src/lib/upload/upload-queue.service.ts#L520) ·
[Panel message selection](../../libs/clr-lift/src/lib/components/upload/upload-panel-window.component.ts#L275)

### P3 · Chunk scheduling allocates a worklist proportional to the file's chunk count

Before sending even the first chunk, the queue enumerates every unacknowledged number into an array. It repeats the full
scan after a retry. Peak scheduling memory and time to first request therefore grow with total chunk count even when
concurrency is one. This matters most for custom small chunk sizes. Use a shared next-number cursor that skips
acknowledged chunks. Verify request order, retained acknowledgements, and bounded work before the first dispatch. This
is a source-level performance finding.
[Pending chunk allocation](../../libs/ngx-lift/src/lib/upload/upload-queue.service.ts#L431)

## 2. queryResource and queryResources

| Priority | Finding and observed consequence                                                                                                                                                                                                                                                                                                                                                                                               | Correction and regression case                                                                                                                                                                   |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| P2       | **A required polling input breaks component construction.** Passing `input.required<number>()` as `pollInterval` produced Angular error `NG0950`. The field initializer reads the input before Angular binds it. [Initial interval](../../libs/ngx-lift/src/lib/query/query-resource.ts#L114)                                                                                                                                  | Read the interval at first observer attachment, then track later changes. Use a real host binding and check both the first interval and a subsequent update.                                     |
| P2       | **A collection row can execute its previous loader.** Replace an item with the same key and updated loader inputs, then call its retained row's `execute()` before the next Angular tick. The old loader runs and its result enters the cache. Row definitions are refreshed by the reconciliation effect. [Retained row update](../../libs/ngx-lift/src/lib/query/query-resources.ts#L68)                                     | Resolve the latest definition for imperative execution. Change the item, immediately execute, and assert the new result with the same row identity and one observer.                             |
| P2       | **Destroying a collection during reconciliation can leave its replacement observer alive.** Replace A with B and let A's transport teardown call `collection.destroy()`. The collection returned zero rows, while diagnostics reported one active observer. Disposal sees the old map because reconciliation publishes the new one after teardown. [Map replacement](../../libs/ngx-lift/src/lib/query/query-resources.ts#L79) | Transfer ownership of new refs before invoking outgoing teardowns, or dispose them on reentry. After the Angular tick, require zero observers and zero loader calls for B.                       |
| P2       | **Disposal before first attachment can strand an execution.** Create a ref with `cancelOnNoObservers: true`, call `execute()`, then `destroy()` in the same turn. A never-completing Observable stayed subscribed and its execution promise stayed pending. The imperative fetch starts before the ref has a detachable observer. [Execution](../../libs/ngx-lift/src/lib/query/query-resource.ts#L225)                        | Give the immediate execution an owner under the cancellation policy. Test destruction before the first effect and with another observer sharing the key, so a surviving owner keeps its request. |
| P2       | **Removing a query can erase its replacement's tag membership.** During `removeQueries()`, the old transport's teardown recreated the same tagged key. Subsequent `invalidateTags()` missed the live replacement. The outgoing entry deletes the shared key from the tag index after abort callbacks run. [Removal order](../../libs/ngx-lift/src/lib/query/query-client.ts#L765)                                              | Retire the outgoing tag membership before callbacks can create a replacement. Recreate the key from teardown, invalidate its tag, and require one new load.                                      |
| P2       | **Last-observer cancellation can abort a new observer's request.** A transport teardown attached a same-key observer while the client iterated the live request set. The new request joined that set and was aborted despite having an active observer. [Cancellation loop](../../libs/ngx-lift/src/lib/query/query-client.ts#L153)                                                                                            | Capture the outgoing requests before aborting them. Assert that the replacement observer receives its result and its signal remains live.                                                        |
| P3       | **Manual recovery is reported as initial loading.** After `removeQueries()`, a failed `ref.execute()` reached `onQueryError` with trigger `initial`. Reattachment starts the fetch before the manual path joins it. [Recovery](../../libs/ngx-lift/src/lib/query/query-resource.ts#L230) · [Trigger assignment](../../libs/ngx-lift/src/lib/query/query-client.ts#L136)                                                        | Carry the manual trigger through recovery. Assert one request and a `manual` error diagnostic.                                                                                                   |

## 3. mutateResource

| Priority | Finding and observed consequence                                                                                                                                                                                                                                                                                                                                                                                                                             | Correction and regression case                                                                                                                                                          |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P2       | **A queued mutation can wait forever after owner destruction.** In `concat` mode, destroying the owner clears the count but leaves queued promises chained to the active write. When the first write stays pending, the second caller and its `onError` never settle, although its transport can no longer start. [Disposal](../../libs/ngx-lift/src/lib/query/mutate-resource.ts#L130) · [Queue](../../libs/ngx-lift/src/lib/query/mutate-resource.ts#L215) | Track accepted calls that have yet to start. Reject those on disposal while letting the active write finish. Assert the queued rejection and callback before resolving the first write. |
| P3       | **Reentrant exhaust joins reverse callback order.** When the first transport synchronously calls `mutate()` again, the join registers its callback before the initiating caller. The observed order was second, first. [Callback registration](../../libs/ngx-lift/src/lib/query/mutate-resource.ts#L213) · [Call-order contract](../design/ngx-lift/mutate-resource-design-spec.md#L392)                                                                    | Register the initiating outcome observer before starting the transport. Check one write, shared promise identity, and callbacks in invocation order.                                    |
| P3       | **The design's cleanup example creates an unhandled rejection.** `void mutate(...).finally(...)` discards the new promise created by `finally`. A failed write rejects that derived promise even though the library observes the original one. [Example](../design/ngx-lift/mutate-resource-design-spec.md#L172) · [Second occurrence](../design/ngx-lift/mutate-resource-design-spec.md#L377)                                                               | Show an awaited `try/catch/finally` or handle the derived rejection. Exercise the example with a rejected write and assert cleanup runs once.                                           |

## 4. resourceAsync

### P1 · One execution can start a cold thenable twice

A direct factory returning a supported `PromiseLike` whose work starts in `then` recorded **two starts for one
`execute()`**. The factory path attaches a rejection observer via `Promise.resolve(source)`, then passes the original
thenable to RxJS `from`, causing a second assimilation. A cold HTTP client can therefore issue two requests and expose
only one result. Normalize the thenable once and reuse that native promise for rejection handling and observation. Count
starts in a test with a custom thenable alongside the native Promise, synchronous value, and Observable cases.
[Factory rejection hook](../../libs/ngx-lift/src/lib/query/resource-async.ts#L640) ·
[Source subscription](../../libs/ngx-lift/src/lib/query/resource-async.ts#L692)

| Priority | Finding and observed consequence                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Correction and regression case                                                                                                                                                                                             |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P2       | **Reset during a synchronous emission fails to stop the producer.** An Observable that checked `subscriber.closed` produced all 16 test values after its first `onSuccess` called `reset()`. The parent gains the child subscription only after `subscribe()` returns. Later values are hidden, but producer work and side effects continue. [Subscription ownership](../../libs/ngx-lift/src/lib/query/resource-async.ts#L698)                                                                  | Attach a closable subscriber to the operation before entering the producer. The same probe should produce one value and reject the pending execution as cancelled.                                                         |
| P2       | **A throwing teardown strands the execution promise.** If an Observable finalizer throws during `reset()`, `unsubscribe()` exits before settlement and before the reset state is applied. [Cancellation](../../libs/ngx-lift/src/lib/query/resource-async.ts#L569)                                                                                                                                                                                                                               | Ensure promise settlement, state transition, and remaining cleanup run even when teardown fails. Exercise reset and disposal with a throwing finalizer.                                                                    |
| P2       | **Teardown can start a factory after disposal or introduce a new reactive dependency.** On replacement, an abort handler that called `destroy()` still allowed the next eager factory to run. Separately, a signal read by a finalizer became a dependency of the resource. Changing only that signal produced loader IDs `[1, 2, 2]`. [Replacement](../../libs/ngx-lift/src/lib/query/resource-async.ts#L631) · [Late disposal check](../../libs/ngx-lift/src/lib/query/resource-async.ts#L653) | Run outgoing cleanup untracked and recheck disposal and generation before invoking the next factory. Keep separate tests for the abort handler and the logging-only signal read.                                           |
| P2       | **An already-scheduled parameter change can overwrite a later local value.** After the initial load, `id.set(2)` followed by `ref.set(99)` yielded `2` on the next tick. The established dependency effect still runs for the earlier change. [Dependency effect](../../libs/ngx-lift/src/lib/query/resource-async.ts#L758) · [Local override](../../libs/ngx-lift/src/lib/query/resource-async.ts#L846)                                                                                         | Preserve the later local write through pending notifications and allow subsequent parameter changes to reload. Test both orderings against the [override contract](../design/ngx-lift/resource-async-design-spec.md#L192). |
| P3       | **Exhaust accepts two queued reloads.** Two calls to `reload()` before the scheduler runs both returned true. The guard covers a queued `execute()` but the first `reload()` does not reserve the same slot. [Reload guard](../../libs/ngx-lift/src/lib/query/resource-async.ts#L798)                                                                                                                                                                                                            | Record the accepted reload until it starts or is cancelled. Assert return values `true`, then `false`, and one factory start.                                                                                              |

## 5. computedAsync

### P2 · An object comparator receives an undeclared undefined value

Without an initial value, read the signal before the first emission, then emit an object. A comparator typed as
`(a, b) => a.id === b.id` compiled in strict TypeScript but threw a `TypeError` on the next read. The computed signal
passes the previous absent value directly to the caller's equality function. Bypass the comparator for transitions to or
from an absent value, or make the optional-value overload accurately type its arguments. Keep a strict consumer example
and a test that reads both before and after the first result.
[Initial signal state](../../libs/ngx-lift/src/lib/signals/computed-async.ts#L199) ·
[Comparator](../../libs/ngx-lift/src/lib/signals/computed-async.ts#L303)

## 6. toSignalForm and submission helpers

### P1 · Editing a sibling can recursively revalidate a nested field

With `sf.revalidate('address.zip', 'address')`, changing `address.street` caused six synchronous calls to ZIP validation
before the probe stopped the recursion. Updating ZIP validity emits a parent form event. Angular creates a fresh address
value object, so the reference comparison treats the target's own validation as another source change. A second probe
reached the same depth with `sf.revalidate('target', 'n')` after setting `n` to `NaN`.

Guard the target update against synchronous reentry and use `Object.is` for scalar comparisons. Test both cases with a
cap on nested calls, and verify that an independent later edit still triggers validation.
[Path subscription and change check](../../libs/ngx-lift/src/lib/signals/to-signal-form.ts#L525) ·
[Target update](../../libs/ngx-lift/src/lib/signals/to-signal-form.ts#L550)

| Priority | Finding and observed consequence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Correction and regression case                                                                                                                                                            |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P2       | **A disabled control's value is typed as present.** In an enabled group with a disabled non-nullable string control, TypeScript accepts `sf.value().name` as a string while the property is absent. `value` and `rawValue` share the raw result type. [Facade declarations](../../libs/ngx-lift/src/lib/models/to-signal-form.model.ts#L399)                                                                                                                                                                                                            | Derive the enabled-value and raw-value types separately from Angular. Check a disabled child alongside an enabled sibling in both a strict consumer and a runtime test.                   |
| P2       | **Submission transforms can throw during facade construction.** The initial `compute()` runs outside the observable error channel. On success, `startWith` also runs it again by default before any edit. On initial failure, the component cannot even obtain the facade whose signal is documented to throw on read. [Pipeline and initialization](../../libs/ngx-lift/src/lib/signals/to-submit-value.ts#L197) · [Error contract](../../libs/ngx-lift/src/lib/signals/to-submit-value.ts#L172)                                                       | Compute the initial snapshot once inside the observable pipeline. Test an initially throwing transform, an initial call counter, and debounced edits.                                     |
| P2       | **A valid zero-argument validator is mistaken for a validator factory.** `const banned: ValidatorFn = () => ({banned: true})` compiles. Passing it to `sf.bindValidators` caused an Angular tick to throw because the returned errors object was installed as a validator. [Arity check](../../libs/ngx-lift/src/lib/signals/form-bindings.ts#L95)                                                                                                                                                                                                      | Resolve validator and reactive-getter forms without relying solely on function arity. Cover a constant-error validator, a validator returning null, and a reactive getter.                |
| P2       | **Raw submission data can be reduced to a scalar.** The public sibling helper `toSubmitValue({status: 'approved', value: 7, valueChanges: 2})` returned `7`. Its control detector checks three ordinary property names, so a raw object loses its other fields before transformation. [Control detection](../../libs/ngx-lift/src/lib/signals/to-submit-value.ts#L12)                                                                                                                                                                                   | Identify genuine Angular controls and keep raw records intact. Test the colliding raw object alongside a real control containing the same payload.                                        |
| P2       | **The provisioning demo accepts a name while its availability check is pending.** With otherwise valid inputs, entering the reserved name `prod-db` and submitting immediately produced a successful demo payload. The button allows a missing availability result, and the handler checks only synchronous form validity. [Submission state](../../apps/demo/src/app/ngx-lib/pages/signals/to-signal-form/to-signal-form.component.ts#L435) · [Handler](../../apps/demo/src/app/ngx-lib/pages/signals/to-signal-form/to-signal-form.component.ts#L537) | Require an available result for the current trimmed name at submission, or use an Angular async validator. Test an immediate submit after editing and a successful submit after approval. |

## Adjacent API consistency

**P2 · The standalone polling overloads promise an input that the first timer tick may omit.** A plain `Subject<string>`
can be silent when the timer fires. In that case `paramsBuilder` or the direct `pollingFn` receives `undefined`,
although its public parameter is typed as `string`. Code such as `input.trim()` can compile and send the initial poll
into its error state. The polling spec explicitly documents this timing, and an existing reconnect test observes the
undefined input. Include absence in the relevant callback types and add a strict consumer example covering the first
tick. [Overloads and dispatch](../../libs/ngx-lift/src/lib/operators/poll.operator.ts#L89) ·
[Polling contract](../design/ngx-lift/polling-pagination-design-spec.md#L78) ·
[Reconnect test](../../libs/ngx-lift/src/lib/operators/poll.operator.spec.ts#L422)

## Verification

- The repository-pinned Nx/Vitest targets passed **323 headless tests in eight files** covering upload models and queue
  plus all six named APIs, and **76 Clarity upload tests in three files** covering the picker, drop traversal, and
  panel. The adjacent polling suite passed **18 tests**.
- Temporary Angular/Vitest probes exercised the reported upload, query, mutation, async resource, and form scenarios.
  They used controlled promises, Observable teardown, real Angular form bindings, and explicit effect ticks as
  appropriate. The form type examples also compiled under strict TypeScript. The chunk scheduling improvement and the
  discarded `finally` example come from source inspection.
- Verification covers local library behavior and the cited demo scenario. Browser end-to-end runs, production
  transports, and package publication were outside this review. The deliverable is this report.
