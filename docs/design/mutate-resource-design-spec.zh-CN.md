# mutateResource：统一处理 PromiseLike 与同步结果

完整 API 设计见 [英文设计文档](mutate-resource-design-spec.md)。

评审指出 `.catch()` 直接作用于非标准 thenable 会失败，回归测试确认此问题。原实现类型仅声明
`Observable<TResult> | Promise<TResult>`，但英文设计文档已经声明支持
`PromiseLike<TResult> | TResult`，因此本次同时统一运行时与公开类型。

`mutation` 现在可返回 `Observable<TResult> | PromiseLike<TResult> | TResult`。Observable 继续使用
`firstValueFrom`；其他结果使用 `Promise.resolve` 转为真正的 Promise，之后再注册内部 rejection handler，避免对没有
`.catch()` 的 thenable、同步值或 `undefined` 调用 `.catch()`。Observable 分支保留即时 rejection
handler，维护已有同步错误处理行为。

新增回归测试覆盖 thenable 成功与失败、同步数值、同步 `undefined`。成功仍按原逻辑使 tags 失效；失败仍拒绝
`mutate()`、记录错误且不触发失效。写入完成策略与并发策略不变。

验证命令：`pnpm nx run ngx-lift:test --run`、 `pnpm nx run-many -t typecheck lint -p ngx-lift`、
`pnpm nx exec -p ngx-lift -- pnpm exec tsc --noEmit -p tsconfig.spec.json`。

验证结果：689 个 library 测试全部通过，包含 18 个 mutation 测试；源码和测试类型检查、lint 均通过。
