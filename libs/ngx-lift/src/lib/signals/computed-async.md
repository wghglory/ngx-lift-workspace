# computedAsync

`computedAsync` derives a read-only Angular signal from a value, Observable, or Promise. It tracks the signals read
synchronously by the factory and updates when those dependencies change. Use `resourceAsync` when you also need explicit
loading/error signals or manual execution.

```typescript
const userId = signal(1);
const user = computedAsync(() => http.get<User>(`/api/users/${userId()}`));
```

Call it in an injection context, or pass `{injector}`. The injector owns the effect and all source subscriptions.

## Initialization and parameter capture

Without an `initialValue`, the signal initially returns `undefined`; its first ordinary computation runs in an Angular
effect. `initialValue` supplies a value until that computation emits.

`requireSync: true` without a defined initial value runs the initializer immediately. It accepts a synchronous value or
synchronous Observable emission, and rejects a Promise or an Observable that has not emitted a defined value
synchronously. Synchronous source errors follow the configured error policy. A factory that throws during this immediate
initializer throws from construction. Failed construction immediately releases its subscriptions.

```typescript
const count = signal(1);
const doubled = computedAsync(() => of(count() * 2), {requireSync: true});
// doubled() === 2 immediately
```

The immediate initializer captures its reactive dependencies without calling the factory again to register the effect. A
dependency changed before the first effect is processed as a new computation. If `initialValue` and `requireSync` are
both supplied, the initial value is returned immediately and the first normal computation still runs.

Factories can write service signals, such as `loading.set(true)`, while synchronously capturing request parameters. The
ordinary path executes directly in an Angular effect. Only immediate `requireSync` initialization uses the exported
low-level `createWatch` API from `@angular/core/primitives/signals`; it permits writes, captures dynamic dependencies
immediately, and delegates subsequent scheduling to an Angular effect. It is disposed with the injector or when
construction fails. This introduces a low-level Angular API dependency that must be checked when upgrading Angular. It
does not access private node fields or `ɵ` exports.

Capture parameters before crossing an asynchronous boundary:

```typescript
const result = computedAsync(() => {
  const id = userId();
  return defer(() => http.get<User>(`/api/users/${id}`));
});
```

Reading a signal only inside a later `then`, timer, or Observable subscription does not establish the intended request
dependency. Capturing `id` also ensures a queued request keeps the parameters that created it.

## Source policies and cancellation

| `behavior`         | Observable subscriptions                                                         | Promise results                                                              |
| ------------------ | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `switch` (default) | Unsubscribe the old source before subscribing to the new source                  | Ignore the old result; the underlying work continues                         |
| `merge`            | Subscribe concurrently; every emission may update the value                      | Publish each result as it arrives, including an older request arriving later |
| `concat`           | Wait for the active source to complete, then subscribe to the next queued source | Publish in source order; the Promises may already be running concurrently    |
| `exhaust`          | Ignore new subscriptions until the active source completes                       | Ignore new results while active; the new eager work may already have started |

The factory runs when dependencies change in every mode. `concat` and `exhaust` control subscriptions, not factory
execution. To defer network work until a source is accepted, return a cold Observable; constructing that Observable
should have no eager side effects. A long-lived Observable that never completes keeps concat/exhaust occupied.

Created Promise rejections are handled even if concat has not subscribed yet or exhaust discards the Promise. This
prevents an unhandled rejection without converting a queued error into a successful value.

Destroying the injector unsubscribes active sources, discards queued subscriptions, and stops future computations. Late
Promise results do not update the signal. Unsubscribing can cancel `HttpClient` Observables; it does not cancel an
already running native Promise or undo a submitted server write. No `AbortSignal` API is added to `computedAsync`.

## Errors and recovery

The existing default behavior is to return the **error object as the signal value**. It does not throw when read. The
generic signature does not automatically add an error type; include it when using that default behavior.

```typescript
const data = computedAsync<User | Error>(() => http.get<User>('/api/user'));
```

Use `onError` for a fallback, or `throwOnError: true` to throw only when reading the signal:

```typescript
const data = computedAsync(() => http.get<User>('/api/user'), {
  onError: () => undefined,
});

const requiredData = computedAsync(() => http.get<User>('/api/user'), {
  throwOnError: true,
});
```

With `throwOnError`, an `onError` callback may observe the failure but its return value is ignored. If the callback
throws, that callback error becomes the stored failure. It does not escape through RxJS or terminate future
computations. Signal reads in the handler do not become request dependencies.

Synchronous factory failures and asynchronous source failures use the same source policy. For example, a failed new
`switch` computation unsubscribes the older source, so its late emission cannot overwrite the latest error or fallback.
A later successful computation recovers without rebuilding the signal.

## Previous values and equality

The factory receives the last stored value as `previousValue`; after an unhandled error state it receives `undefined`.
Fallback values count as stored values. This read is untracked, so accepting an emission does not itself start another
request.

`equal` controls the returned signal's consumer notifications and may retain an older equal value/reference. It does not
prevent parameter changes from evaluating the factory. `previousValue` follows the stored source value rather than a
reference retained by the output comparator. Keep comparators pure and account for initial `undefined` and any error
values used by your application.

## Validation

`computed-async.spec.ts` contains 49 passing tests, including initialization reuse and cleanup, factory signal writes,
dynamic/equal request dependencies, callback dependency isolation, changed parameter snapshots, callback failures,
switch error cancellation, queued/discarded Promise rejection handling, all four Observable disposal policies, late
Promise suppression, previous values, equality, and recovery.

The library typecheck and an isolated typecheck of this spec also pass. The default-error test now declares
`number | Error` explicitly, replacing an existing incompatible cast. A workspace-wide spec typecheck still reports six
unchanged errors in other specs (`poll`, `start-with-tap`, `combine-from`, and `merge-from`).

```bash
pnpm nx test ngx-lift --args='src/lib/signals/computed-async.spec.ts'
```

These are local tests; they do not establish backend rollback or cancellation of arbitrary Promise work.
