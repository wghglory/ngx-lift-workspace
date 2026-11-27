# Reactive utilities and forms code review

> Historical review of baseline `e0facfd7` (2026-11-26), with fixes recorded on 2026-11-27. Findings below describe that
> baseline, not outstanding defects. See the [review index](upload-and-reactive-apis.md) for fix disposition,
> compatibility notes, and verification boundaries. Architecture specs own current contracts.

This review records **8 historical findings**.

## computedAsync

### P2 · An object comparator receives an undeclared undefined value

Without an initial value, read the signal before the first emission, then emit an object. A comparator typed as
`(a, b) => a.id === b.id` compiled in strict TypeScript but threw a `TypeError` on the next read. The computed signal
passes the previous absent value directly to the caller's equality function. Bypass the comparator for transitions to or
from an absent value, or make the optional-value overload accurately type its arguments. Keep a strict consumer example
and a test that reads both before and after the first result.
[Initial signal state](../../libs/ngx-lift/src/lib/signals/computed-async.ts#L199) ·
[Comparator](../../libs/ngx-lift/src/lib/signals/computed-async.ts#L303)

## toSignalForm and submission helpers

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
