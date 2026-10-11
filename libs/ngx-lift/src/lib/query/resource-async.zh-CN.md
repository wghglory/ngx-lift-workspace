# resourceAsync 生命周期增强说明

对应英文 API 文档：[resource-async.md](./resource-async.md)。实现：[resource-async.ts](./resource-async.ts)。这里记录本次已实现的行为与使用边界。

## 改了什么，为什么

这次增强保持现有零参数 factory 的使用方式，并解决执行取消、刷新错误与依赖追踪之间的几个实际问题。`resourceAsync`
管理一个资源的状态与生命周期；跨组件的共享缓存、标签失效和统一轮询仍由 DSM 的 `QueryClient` 管理。

主要变化：

- 新增 `params` / `loader` 形式，让纯参数依赖追踪与执行 HTTP / Promise 的动作分开。
- `execute()` 的 Promise 属于明确的一次操作。`reset()`、`set()`、`update()`
  或新执行取消它时立即拒绝，后续请求不会替它结算。
- `reset()` 和本地覆盖会抑制已经排队的手动刷新，避免旧刷新稍后覆盖本地值。
- 新增 `destroy()`，同时支持显式销毁和注入器自动销毁。
- 新增可选 `preserveValueOnError`；默认错误行为保持原样。
- factory / loader 接收 `abortSignal`，支持能响应取消的传输。
- 原本继承的 `equal` 选项现在真正控制 `value()` 通知。
- 空 Observable 的 `execute()` 返回默认值；未配置默认值时返回 `undefined`。

## 推荐写法：先捕获参数，再执行请求

```typescript
const userRef = resourceAsync(
  {
    params: () => ({id: userId()}),
    loader: ({id}, {abortSignal}) =>
      fetch(`/api/users/${id}`, {signal: abortSignal}).then((response) => response.json()),
  },
  {behavior: 'exhaust', preserveValueOnError: true},
);
```

只有 `params` 追踪 Signal。它必须是纯读取：不能发请求、创建会立即执行的 Promise 或写 Signal。`loader`
在接受新操作之后执行，并且其内部 Signal 读取不成为资源依赖。需要触发刷新的输入应全部放进 `params`。

`exhaust`
表示忙时丢弃新请求，不是把新参数排队：请求 1 进行中时参数变成 2，不执行 loader；请求 1 完成后不会自动执行参数 2。以后参数再次变化仍可触发请求。这解决了旧形式跳过 factory 时丢失依赖的问题。

原有形式继续支持：

```typescript
const userRef = resourceAsync(() => http.get<User>(`/api/users/${userId()}`));
```

旧 factory 直接在 Angular
effect 中执行，因此合法的同步 Signal 写入仍然兼容。对于任意 factory，库无法一边保证不执行其副作用，一边发现其 Signal 依赖。旧形式使用
`exhaust` 时，忙时跳过 factory 可能丢失依赖，之后需要显式 `reload()` / `execute()`；需要可靠的响应式 `exhaust`
时用新参数形式。

## 写操作：必须显式触发

```typescript
const saveRef = resourceAsync(() => http.post('/api/settings', formValue()), {
  lazy: true,
  reactive: false,
  behavior: 'exhaust',
});

await saveRef.execute();
```

`lazy: true` 只延迟第一次执行。默认首次触发后仍会跟随依赖变化。增加 `reactive: false`
后，编辑表单不会自动再次提交，只有显式触发才会执行。`exhaust`
可以让重复点击加入当前操作，但不能撤销服务端已经接受的写入。

## 取消与销毁的契约

| 操作                 | 对当前工作及 execute Promise 的影响 | 后续行为                                   |
| -------------------- | ----------------------------------- | ------------------------------------------ |
| `reload()`           | 默认替换旧操作；旧 execute 拒绝     | 保留已有值进入后台刷新                     |
| `execute()`          | 默认替换旧操作；开始前清除已有值    | Promise 返回当前操作结果                   |
| `set()` / `update()` | 取消请求，旧 execute 拒绝           | 状态为 `local`；已建立的响应式依赖仍可刷新 |
| `reset()`            | 取消请求，旧 execute 拒绝           | 回到 `idle`；lazy 资源需要重新显式触发     |
| `destroy()`          | 取消请求，待结算 execute 拒绝       | 永久停止观察，重复调用安全                 |

替换、重置与本地覆盖使用 `ResourceAsyncCancelledError`。销毁使用 `ResourceAsyncDisposedError`，之后 `execute()`
也会拒绝，`reload()` 返回 `false`，`reset()` 无操作，`set()` / `update()` 抛销毁错误。只读引用同样提供 `destroy()`。

`onSuccess` 在 execute Promise 成功结算前运行。回调主动 reset / 替换 / 销毁当前操作时，Promise 按取消处理；回调抛错按
`onError` / `throwOnError` 处理，并遵循默认清值或可选保留值策略，避免先成功结算再出现无人处理的错误。

Observable 取消通过取消订阅实现。Promise 本身不能被强制中止，只有 loader 使用 `abortSignal`
时底层请求才会停止；无论是否响应取消，旧结果不会再写入资源。

`exhaust` 加入一个尚未完成但已经发过最后一次值的 Observable 时，即使之后没有新的
`next`，完成事件也会结算新加入的 execute Promise，避免一直挂起。

首次 factory 还没执行就
`set()`，无法在不调用 factory 的情况下发现其依赖。新参数形式可只建立纯依赖、不执行 loader；旧形式需要显式刷新。已建立依赖之后，排队刷新被本地覆盖抑制也不会丢掉这些依赖。

## 后台错误与相等判断

`preserveValueOnError` 默认 `false`，保留旧版本出错清空已接收数据的行为；已配置的初始/默认值仍作为回退值。

设为 `true` 后，后台 `reload()` 出错保留成功数据或本地数据，但仍暴露 `status() === 'error'` 和
`error()`；保留的数据已定义时 `hasValue()` 为 `true`。`onError`
返回回退值的优先级更高。仅配置默认值、尚未收到数据时，`hasValue()` 不把默认值当作成功数据。

`equal` 只影响 `value()` 的变更通知，不跳过请求、状态变化或 `onSuccess`。涉及 `undefined` 的边界使用
`Object.is`，所以常见的 `(a, b) => a.id === b.id`
不会在初次加载前因参数未定义而报错。执行结果包括错误回退与流完成时都与公开 `value()` 的相等判断保持一致。

Observable 完成但从未发出值时：状态为 `resolved`，execute 返回 `defaultValue` / `initialValue`，没有默认值则返回
`undefined`。它不代表收到了一条定义的业务数据。

## 验证与边界

Node 24 验证通过：resourceAsync 专项测试 108 /
108（保留原有 80 项，新增 28 项），ESLint 与库 TypeScript 检查均通过。回归覆盖依赖跳过、显式写操作、同步 Signal 写入、取消、销毁、背景错误、AbortSignal、相等判断、空流、纯参数错误恢复、长流结算与 callback 错误/主动取消。

验证命令使用 Node 24：

```bash
pnpm nx test ngx-lift resource-async.spec.ts --run --skip-nx-cache
pnpm exec eslint libs/ngx-lift/src/lib/signals/resource-async.ts libs/ngx-lift/src/lib/signals/resource-async.spec.ts
pnpm exec tsc --project libs/ngx-lift/tsconfig.lib.json --noEmit
```

额外直接运行全库 `tsconfig.spec.json`
的检查最初发现 7 项既有测试类型错误，使用 HEAD 临时副本与相同依赖完整复现。computedAsync 的错误值测试已改为准确的联合类型，并通过独立类型检查；最终剩 6 项位于未修改的
`poll`、`start-with-tap`、`combine-from` 和 `merge-from`
测试。本次 resourceAsync 实现及测试没有新增类型错误。这与通过的库 TypeScript 检查及正式 Nx 验证分开记录。

该增强不提供全局缓存，也不保证所有 Promise 都能停止网络活动。DSM 的共享 query 用它观察缓存快照，统一查询状态由
`QueryClient` 决定，避免页面出现两套 loading 状态。包仅在本地构建试用，不发布 npm。
