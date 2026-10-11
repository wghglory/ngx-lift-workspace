# PR #142 异步与查询 API 迁移

[英文迁移说明](MIGRATION_ASYNC_QUERY.md)。本分支修正了已有公开类型契约，按语义化版本规则需要破坏性版本发布。

- `isEmpty()` / `isNotEmpty()`
  不再通过集合是否为空来收窄 nullability。空集合是已定义对象，旧谓词在某些分支会产生错误类型。使用
  `value != null && isNotEmpty(value)`；删除显式泛型调用。运行时空值判定保持原行为。
- 无初始值的 `combineFrom()` 在异步源首次发值前返回 `undefined`。无初始值的 `mergeFrom()`
  要求至少一个源同步发值，否则构造时抛错。异步源需提供 `initialValue`；修正后的 `mergeFrom()` 类型在初始值为 `null`
  时保留 `null`。
- 等待中的 `resourceAsync.execute()` 被替换、reset、本地覆盖或销毁后会拒绝为
  `ResourceAsyncCancelledError`；已销毁后的调用拒绝为 `ResourceAsyncDisposedError`。调用方需处理取消。推荐
  `{params, loader}` 捕获依赖，尤其是 exhaust 模式。
- 从 `ngx-lift` 公共入口导入 `resourceAsync`；内部源文件从 `signals/` 移到 `query/`。旧 callback
  overload 保留；新共享查询 API 见 [使用说明](../libs/ngx-lift/src/lib/query/query.zh-CN.md)。
- Kubernetes 分页默认重试 HTTP 429，使用 `{initialParams, retryConfig: false}`
  可禁用。聚合返回最后一页 metadata，并将缺失/null 的 `items` 规范为 `[]`。
- 原始 HTTP 参数名可为 `initialParams` / `retryConfig`，标量字符串仍按参数传递。若旧参数为 `retryConfig: false`，请包入
  `initialParams`，避免与新 retry option 歧义。

发布前应在下游应用验证类型修正与错误/取消处理，并选择包含这些迁移说明的 major 版本；当前 manifest 版本不能直接重复发布。
