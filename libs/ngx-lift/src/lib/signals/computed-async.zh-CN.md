# computedAsync：实现、修复与使用说明

对应英文说明：[computed-async.md](./computed-async.md)，实现：[computed-async.ts](./computed-async.ts)。

`computedAsync` 把普通值、Observable 或 Promise 转成只读 Angular Signal。它根据 factory
**同步读取**的 Signal 重新计算。需要独立的 loading/error 状态或手动执行时，应使用 `resourceAsync`。

## 已完成的修复

本次保持已有调用方式与四种 `behavior`，没有新增 AbortSignal API，也没有重写异步调度框架。

- `requireSync`
  初始化后，原来 effect 为了建立依赖会再调用一次 factory，即使随后丢弃结果，也可能额外启动请求。现在同步初始化本身就捕获依赖，effect 不再重复调用 factory；只有请求参数变化才重新计算。
- 同步初始化失败时，原来已经订阅的异步 Observable 会一直保留到 injector 销毁。现在构造失败立即取消订阅。
- `onError` 自身抛异常，原来会经 RxJS 形成未捕获异常。现在保存这个异常，按 `throwOnError`
  决定读取时的行为，后续成功请求仍可恢复。
- 最新 factory 同步抛错时，原来的旧 `switch`
  流仍可能覆盖新错误或 fallback。现在同步错误进入同一套 source 策略，旧流被取消，不会继续更新当前结果。
- `concat` 尚未订阅的 Promise、`exhaust` 丢弃的 Promise，原来拒绝后可能触发 unhandled
  rejection。现在所有已经创建的 Promise 都及时建立错误处理，同时保留队列中的失败结果。
- 保留 factory 写入服务 Signal 的兼容行为，例如 `loading.set(true)`。把 factory 放进普通 `computed` 会触发
  `NG0600`，因此普通调用直接在 effect 内执行，不要求已有 factory 改成纯函数。

## 初始化和参数快照

普通调用最初返回 `undefined`，第一次计算由 Angular effect 调度。`initialValue` 可提供初始值。

没有已定义的 `initialValue` 时，`requireSync: true`
会立即运行初始化：普通值或同步 Observable 可以直接提供初值；Promise 或没有同步发出已定义值的 Observable 会失败。同步 source 错误遵循错误策略；立即初始化的 factory 自身抛错会直接使构造失败，并清理订阅。

```typescript
const count = signal(1);
const doubled = computedAsync(() => of(count() * 2), {requireSync: true});
```

首次 effect 之前参数已经变化，也会正确处理新参数，而不是跳过这一份请求。同时指定 `initialValue` 和 `requireSync`
时，初始值立即可读，第一次正常获取仍会运行。

仅需要立即初始化的 `requireSync` 路径使用 Angular 正式导出的底层 `createWatch` API，来自
`@angular/core/primitives/signals`。它允许写 Signal，并在第一次执行时捕获动态依赖；后续仍由 Angular
effect 调度，参数未真正变化时不重复执行。初始化失败或 injector 销毁会清理 watcher 与订阅。

这增加了对 Angular 底层导出 API 的耦合，升级 Angular 时需要重新验证。实现没有读取私有节点属性，也没有使用 `ɵ`
导出；普通路径保持原来的 effect 语义。

异步操作之前应同步捕获参数，保证依赖和请求使用同一份值：

```typescript
const result = computedAsync(() => {
  const id = userId();
  return defer(() => http.get<User>(`/api/users/${id}`));
});
```

只在后续
`then`、timer 或 Observable 订阅内读取 Signal，不能可靠建立所需的请求依赖。提前捕获参数也避免排队中的请求在真正执行时读取已经变化的值。

## 四种模式的真实边界

| 模式      | Observable                           | Promise                                             |
| --------- | ------------------------------------ | --------------------------------------------------- |
| `switch`  | 取消旧订阅，使用新 source            | 忽略旧结果；旧 Promise 的底层工作仍可能继续         |
| `merge`   | 并行订阅，每次发值都可更新结果       | 按完成顺序更新；较早请求晚到也可能覆盖较新结果      |
| `concat`  | 等前一个 source 完成后，再订阅下一个 | 结果按 source 顺序处理，但 Promise 可能早已并行启动 |
| `exhaust` | 当前 source 未完成时，忽略新订阅     | 丢弃新结果，但新 Promise 的底层工作可能已经开始     |

所有模式都会在依赖变化时调用 factory。`concat` / `exhaust`
控制的是订阅，不能保证 factory 本身不执行。需要延迟网络操作时，应返回没有立即副作用的冷 Observable；一个一直不完成的 Observable 会长期占用 concat
/ exhaust。

injector 销毁后，活动订阅取消，队列不再启动，后续参数变化和 Promise 迟到结果不再更新 Signal。取消 `HttpClient`
Observable 通常可终止客户端请求，但普通 Promise 不会自动停止，客户端取消也不等于撤销服务器已经接受的写入。

## 错误不是默认“读取时抛出”

已有默认行为是 **把错误对象作为 Signal 的 value**。没有 `onError`、没有 `throwOnError`
时，读取 Signal 不会抛异常。泛型不会自动补上错误类型，需要使用这种行为时可显式写成 `User | Error`：

```typescript
const data = computedAsync<User | Error>(() => http.get<User>('/api/user'));
```

`onError` 可以返回 fallback。启用 `throwOnError: true` 时，异常仅在读取 Signal 时抛出；`onError`
的返回值被忽略。如果 handler 再抛错，该异常会成为当前失败，不会经 RxJS 形成未捕获异常。handler 内读取的其他 Signal 不会意外变成请求依赖。后续成功计算会恢复。

## previousValue 与 equal

factory 的 `previousValue` 来自上次保存的 source 值；未处理的错误状态后为
`undefined`，fallback 则算作值。这次读取不会建立依赖，所以一次响应到达不会自己触发下一次请求。

`equal` 控制输出 Signal 的通知，可保留之前相等的值或引用，但不会阻止参数变化后重新计算 factory。 `previousValue`
仍来自 source 保存值，不是输出比较器保留的旧引用。比较器应保持纯函数，并考虑初始 `undefined` 与应用采用的错误值。

## 验证结果

`computed-async.spec.ts` 的 **49 项测试通过**，包括原有行为和新增的初始化、服务 loading
Signal 写入、动态依赖增删、参数比较不变时不重发、订阅和错误回调依赖隔离、取消、错误恢复、四种模式销毁、Promise 迟到/排队/丢弃与 equality 回归。

库的类型检查与本测试文件的独立类型检查也通过。原有默认错误测试把 `number | undefined` 强转成 `Error`，本次改为明确声明
`number | Error`，与实际默认行为一致。额外的全库测试文件类型检查仍报告其他未修改文件的 6 处既有错误，位于
`poll`、`start-with-tap`、`combine-from` 和 `merge-from` 测试；这些错误不属于本次新增。

```bash
pnpm nx test ngx-lift --args='src/lib/signals/computed-async.spec.ts'
```

这些是本地自动测试；不代表任意 Promise 可以真正取消，也不代表服务器端写入能够回滚。源代码和示例保持英文，本文件用于解释实际完成的改动与限制。
