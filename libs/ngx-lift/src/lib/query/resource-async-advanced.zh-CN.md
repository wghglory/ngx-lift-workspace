# resourceAsync 嵌套资源与共享查询：中文说明

对应英文文档：[resource-async-advanced.md](./resource-async-advanced.md)。基础生命周期说明：[resource-async.zh-CN.md](./resource-async.zh-CN.md)。

## 每个子资源有自己的生命周期

列表每一行有独立的组织详情时，可以创建一个 `resourceAsync`，让每一行拥有自己的值、错误和加载状态：

```typescript
const organizationRef = resourceAsync(
  {
    params: () => selectedOrganizationId(),
    loader: (id, {abortSignal}) =>
      fetch(`/api/organizations/${id}`, {signal: abortSignal}).then((response) => response.json()),
  },
  {lazy: true, behavior: 'exhaust', preserveValueOnError: true, injector},
);
```

这里 `params` 只读取响应式参数；真正的请求由 `loader`
执行。loader 不追踪内部的 Signal 读取，影响请求的输入应全部通过 params 传入。

使用 `exhaust` 时，忙时参数变化不会偷偷创建 eager
Promise 或执行写操作，也不会丢失纯参数依赖。忙时变化会被丢弃；当前操作结束后不会自动执行被跳过的参数。

已有 factory 写法依然兼容，包括 factory 内合法的同步 Signal 写入。它有明确边界：如果忙时完全不调用 factory，就无法再次发现其依赖。因此可靠的响应式
`exhaust` 需要参数形式。

## 删除行时需要释放子资源

行被删除、筛选掉或替换时，管理它的代码应调用 `destroy()`，释放订阅与待执行操作。所属注入器销毁也会自动清理剩余资源。

`reset()` 用于回到 idle，资源以后还能使用；`destroy()`
表示永久退出。前者可重新 execute，后者不能继续执行。不要把永久销毁写成 reset，否则 eager 资源已知依赖未来改变时仍可能再次加载。

```typescript
const removed = organizationResources.get(organizationId);
removed?.destroy();
organizationResources.delete(organizationId);
```

需要在运行时创建资源时传入持有的 `injector`，并在非响应式上下文创建；不要直接在 computed 的求值中创建 Angular
effect 资源。

## 独立资源不等于共享缓存

两个行资源使用相同 id，并不会自动共享数据或请求。行内 Map 可复用当前组件创建的资源，但跨组件复用、标签失效、查询刷新与共享轮询需要独立的 query
client。

DSM 的设计用 `QueryClient` 管理 key、tag、请求合并与轮询，用增强的 `resourceAsync` 观察共享
`QuerySnapshot`。页面读取的是统一的查询状态；resourceAsync 自己的观察生命周期不再作为额外的页面 loading 状态。

这样同一个查询同时被旧 Observable 调用者和多个 Signal 视图观察时，仍可共享同一条请求；取消某一个观察者是否停止传输由共享 query 的策略决定。

## 子资源写操作与错误展示

```typescript
const saveRef = resourceAsync(() => http.patch('/api/organization', formValue()), {
  lazy: true,
  reactive: false,
  behavior: 'exhaust',
  injector,
});

await saveRef.execute();
```

`lazy` 不是持续的手动执行模式，默认第一次执行后仍有依赖追踪。写操作增加 `reactive: false`，才能避免修改表单自动发请求。

本地覆盖或 reset 取消 execute 时，Promise 以 `ResourceAsyncCancelledError` 拒绝；销毁时以 `ResourceAsyncDisposedError`
拒绝。需要 await 的调用者应处理这些结果。Observable 取消订阅、AbortSignal 取消请求都无法撤回已经被服务器接受的写入。

后台查询可启用 `preserveValueOnError: true`。模板分别检查 `hasValue()` 与
`error()`，让已有行继续显示并提示刷新失败。默认 `false` 保持原有行为。

## 本次验证

Node 24 下基础资源专项测试 108 / 108、ESLint 与库 TypeScript 检查通过。测试覆盖原有资源行为与新回归：已排队刷新被 reset
/ 本地值覆盖抑制、依赖仍可后续刷新、销毁后不再执行、背景错误保留值、AbortSignal、value 相等判断以及 Observable 完成时的 Promise 结算。英文基础文档与中文基础说明记录完整 API 契约。

嵌套资源样例仍需应用代码负责 Map 清理、共享策略与真正的 transport 取消；这次增强没有把这些业务规则隐式放入 resourceAsync。
