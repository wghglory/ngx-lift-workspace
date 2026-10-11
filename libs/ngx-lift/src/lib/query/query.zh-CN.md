# 共享查询与显式写操作

[英文 API 使用说明](query.md)。所有 API 均从 `ngx-lift` 导出。

- `queryResource` 通过应用级 `QueryClient` 共享服务端数据；独立本地异步状态使用 `resourceAsync`，写操作使用
  `mutationResource`。
- 在 definition factory 中读取 signal，捕获一份参数快照；loader 中的 signal 读取不参与依赖追踪。返回 `undefined`
  可禁用查询。
- key 必须包含影响响应的所有参数与授权 scope。同 key 必须代表同类型、同语义的数据。仅支持有限 JSON 值、普通对象和数组。
- `staleTime` 默认零，`gcTime` 默认五分钟。同 key 合并为最短 freshness、最长 retention。`execute()` / `reload()`
  强制刷新已完成数据，同时复用有效进行中的请求。
- 切换 key 后立即隐藏旧 scope 数据；后台刷新失败保留上次成功值。轮询由最短 observer
  interval 驱动，请求完成后再计时；页面隐藏时暂停，SSR 不轮询。
- 销毁一个 observer 不影响其他 observer 或共享读取。`removeQueries()`
  中止 transport 并清除 observer；resource 可通过显式 reload 恢复，Observable observer 正常 complete。
- 首个同步 snapshot 回调允许移除查询或销毁 client。实现会在回调后检查 attachment，避免旧 scope 启动请求；Observable
  adapter 在取得 handle 后再次检查，确保及时结束。
- tag 的 scope 相互隔离；无 `id`
  匹配该 scope 内同 type 的全部实体。invalidate 先分离旧 generation，再重新读取，防止写操作之前的响应覆盖新数据。
- mutation 默认并行；`exhaust` 复用进行中的调用，`concat`
  排队。参数应为不可变快照。成功后 invalidate，不等待后台 refetch；销毁不能撤销已提交的服务器写入。
- `observableLoader()` 保留 HttpClient 同步派发与取消行为，首个结果后 unsubscribe；空 Observable 拒绝为 `EmptyError`。

独立创建的 `QueryClient` 用完后需 `destroy()`。注入的 `QUERY_CLIENT`
随 injector 销毁，SSR 每次请求应使用独立 injector/client。
