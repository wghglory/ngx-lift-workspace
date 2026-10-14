# Query 设计与生产约定

这是 `QueryClient`、`queryResource`、`queryResources`、两个 Observable facade 和 `provideQueryClient`
的统一说明。完整 API、示例和边界见 [英文规范](query-resource-design-spec.md)；当前验证见
[验收记录](../reviews/query-production-review.zh-CN.md)。mutation 的执行与并发约定保留在
[独立规范](mutate-resource-design-spec.zh-CN.md)，发布迁移统一放在 [MIGRATIONS](../MIGRATIONS.md)。

## 选择与命名

- 共享缓存、tag 失效或协调轮询：`queryResource`；动态独立查询集合：`queryResources`。
- 独立异步状态或流：`resourceAsync`；服务中的一次缓存结果：`fetchQueryObservable`；持续快照：`observeQueryObservable`。
- 显式写操作：`mutateResource`。
- 单个查询句柄为 `userQuery` / `databasesQuery`；集合为 `tenantQueries`；写句柄为 `createMutation`。 `user` / `tenant`
  留给解析后的数据，`createDatabase()` 是事件方法。

## 读取与集合

参数只捕获一次，key 包含所有影响响应的端点、过滤、分页和授权变量。返回 `undefined`
禁用观察者；切换 key 立即隐藏旧数据。Observable 取第一个值并取消订阅，空完成以 `EmptyError` 拒绝；PromiseLike 通过
`Promise.resolve`
同化。组件与服务可以创建资源，但生命周期归其 injector；服务方法不会自动建立注入上下文，创建视图资源时传入调用方 injector。

`queryResources(items, definition, options?)`
返回有序引用信号。排序保留 ref，删除立即隐藏行并在 effect 中释放观察者。新增行在 effect 调度后挂接。重复规范化 key 抛错；集合采用一种结果类型，未就绪项目先过滤。
`item()` 在成功前或失败后仍标识输入，每行独立失败、重试。请求没有并发上限，大集合使用分页、选择限制或批量接口。

## 缓存与取消

默认
`staleTime: 0`、`gcTime: 300_000`、`cancelOnNoObservers: false`、`maxEntries: 200`。同 key 的条目生命周期采用最短 freshness、最长 retention、全部定义同意才取消；消费者离开不会恢复旧策略，tags 到淘汰才移除。最新定义负责后续 loader/policy，已启动的逻辑读取冻结发起策略；polling 仅按活动观察者的最短间隔协调。

普通读取、刷新、轮询加入当前 pending；刷新只绕过已完成缓存。过期的成功数据挂载时立即可见并后台刷新。活动观察者和所有 pending 受保护，`maxEntries`
是可淘汰条目的软上限。最后观察者离开时只有显式取消策略才 abort；Promise 运输须转发 `abortSignal` 才能物理取消。有限
`fetchQueryObservable` 订阅不是独立取消所有者。显式移除/销毁取消当前和过期读取及其调度。

失效先切断所有受影响 generation 再重读；旧调用可完成但不能发布/报告到新 generation。scope 省略表示无作用域命名空间，不代表跨租户通配。重入通知使用 revision 和成员检查保护最新状态。

## 失败与恢复

- 初次失败：无值，`isInitialError()`，显式执行 Promise 拒绝；刷新失败保留数据和 `updatedAt`，使用 `isRefreshError()`。
- retry、总 deadline、focus/reconnect 恢复均默认关闭；重试包含初次 attempt，重新调用 loader，joiners 共享一个逻辑读取。
- deadline 包含同步 loading 发布、attempt 与等待，使用独立 elapsed clock，在接受/发布成功前再检查；超时抛
  `QueryTimeoutError`。
- 不缩短服务端最低等待以适应 deadline。策略回调异常单独诊断，保留原始运输错误；正常取消不产生新的用户错误报告。
- polling 等整个逻辑读取结束再安排下次；默认 Angular provider 在后台暂停、在服务端禁用后台轮询。
- focus/reconnect 只恢复被观察且 stale 的条目并合并 pending；不存在离线队列或暂停后重放。
- `onQueryError` 对当前终态逻辑读取报告一次；`onDiagnostic` 隔离 observer、retry policy 和 reporter 异常。

`provideQueryClient` 配置默认策略并保留 Angular 事件、ErrorHandler 和销毁。每条查询可用 `retry: false` /
`deadlineMs: false` 退出继承。避免 query 和 HTTP interceptor 叠加重试；有服务端 hint 时使用尊重最低等待的应用策略。

## 会话、写入与诊断

key/tag 包含不透明的会话/授权版本，不放凭据。退出先禁用观察者再移除旧作用域缓存，安装新认证上下文后启用读取。普通失效让旧调用继续完成，不能当退出清理。mutation 使用提交参数中的 scope，避免旧写入刷新新会话。写超时先确认服务器结果或采用幂等协议；`invalidationError`
表示写已成功，应刷新读而不是重写。

诊断不 fetch、不保活、不通知；key/tag 数组是副本，一个快照共用一次 clock/visibility 采样。request 数是未结算逻辑读取，含 retry
wait 和过期 generation；`isPending`
只指当前 generation。移除条目不计入指标；指标不代表真实 HTTP 订阅数。诊断导出时脱敏业务标识。

## 生产边界

已验证 Angular 21.2 zoneless 浏览器及严格独立安装的 tarball
DOM 消费，包括退出取消、会话隔离、刷新恢复、集合和作用域写入。没有因此证明 SSR/hydration、ZoneJS 或整个 peer-version 范围；服务端无 polling 也不等于正确的序列化/水合。自动重试、deadline、恢复触发器都要显式配置。持久化、无限查询、离线队列、共享回滚及全局调度按真实需求设计。工程可合入、可用于浏览器业务，与 npm 可发布是不同结论；依赖风险、语言验收、版本及凭据见统一验收记录。
