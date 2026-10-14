# Query 失败设计：有界请求、恢复入口和可用 UI

状态：已实现，2026-10-14 完整本地验证通过。 [英文完整设计与 API](query-failure-design.md) ·
[官方资料比较](query-failure-industry-research.md)

## 已落地的 API

原生 Observable / PromiseLike loader 使用同一套生命周期，不需要 adapter。

- `QueryDefinition.retry`：默认关闭。显式传 `maxAttempts`、同步 `shouldRetry` 和
  `delayMs`；次数包含首次请求，每次重新调用 loader。
- `QueryDefinition.deadlineMs`：默认关闭。总期限覆盖 loader、重试等待和最终结算；`false` 可关闭客户端继承值。
- `provideQueryClient(options)`：设置 `queryDefaults` 和上报 hook，同时保留 Angular
  ErrorHandler、浏览器事件和 DestroyRef 清理。SSR 每次请求独立 injector/client，无浏览器监听或后台 polling。
- `refetchOnFocus` /
  `refetchOnReconnect`：默认关闭，可在客户端或单个 observer/resource 配置。只恢复有观察者且 stale 的查询，共享 pending 去重；hidden 时不处理 focus。
- `isInitialError` /
  `isRefreshError`：区分首次失败与保留数据的刷新失败。按 snapshot.hasValue/status 判断，支持成功 undefined 与 reject(null) 等情况。
- `updatedAt` / `failureCount` / `failureReason` / `nextRetryAt`：可展示最后成功时间和重试进度。
- `onQueryError`：每个当前代际的逻辑读取终态失败只上报一次，不按 observer 数量重复。普通生命周期取消与过期代际不报用户错误。
- `onDiagnostic`：observer、retry-policy、error-reporter 的应用回调异常单独上报，不改变传输结果。回调抛错或异步 rejection 都隔离；诊断回调自身失败走非递归 host 上报。
- B 方案 `queryResources` 保持每行独立状态、稳定 ref；新增推断类型的
  `row.item()`，失败时不需要解析 key 就能找到原输入。A 方案仍延后。

正式英文类型与可运行 provider 示例见英文文档。`retry: false` 关闭继承重试；`deadlineMs: false`
关闭继承期限。无需 deprecated helper 或 Observable loader wrapper。

## 修复的正确性缺陷

历史基线 `98d8918` 中，loading listener 抛错会导致 loader 未启动、共享 pending 无法完成；resolved
listener 抛错可能造成缓存成功但调用 Promise 失败。现已隔离初始和后续通知，继续健康 observer、请求、polling 与清理，并保留 revision
/ membership / generation 防护。

之前的同步 Observable 返回 teardown 抛错也已修复：等 subscribe
setup 完成后才结算，逃逸到订阅边界的 cleanup 错误阻止成功缓存；原传输错误优先。RxJS 内部主动吞掉的 operator 错误仍按 RxJS 行为处理。

## 重试与期限契约

一个逻辑读取冻结 loader、参数、策略和 generation。同 key 调用者共享当前工作，后来的 joiner 不修改正在执行的策略。静态非法配置在安装 pending 前拒绝；动态 predicate
/ delay 抛错、非 boolean 或非法延迟结束重试，保留原始传输错误并上报策略诊断。

重试期间仍为 loading/reloading，failureCount 记录失败尝试次数，failureReason 保留原始失败，nextRetryAt 为 wall-clock 重试时间。新 attempt 清除 nextRetryAt；成功清空重试 metadata；终态失败保留失败次数和原因。新逻辑读取重置旧错误并保留成功数据。

总期限使用单调 elapsed 时钟，UI/cache 时间使用 wall clock。超时抛出
`QueryTimeoutError`，取消 Observable 并结算调用者；Promise 忽略 abort 时也不能让共享等待永远 pending 或迟到结果写入缓存。第一次失败前超时的 failureCount 为 0；之前有失败时保留实际次数，timeout.cause 保留此前失败。JavaScript 无法抢占同步阻塞代码，在最早可执行边界检查期限。

移除、取消和完成清理 timers。tag
invalidation 允许旧调用者完成，因此旧请求保留自己的 retry/deadline 直到结算，但不能发布新缓存、拥有新 polling 或上报旧失败。不能清 continuation
timer 却让旧 Promise 挂起。polling 等完整逻辑读取结束。

选择 QueryClient 或 RxJS/interceptor 中的一个 retry
owner，避免尝试次数放大。只对确认安全的读取与可分类临时错误启用；不要缩短服务端 Retry-After 以适应 deadline，剩余期限不足应终止。attempt
timeout 与总 deadline 不同，本次只实现总 deadline。

## 页面与 mutation 模式

有数据时继续显示，再用 isRefreshError 提示刷新失败和 Retry；无数据时用 isInitialError 显示首次错误。依赖未满足时说明 prerequisites，idle 不代表成功空列表。避免用 catchError(()
=> of([])) 隐藏故障。

`reload()` 返回是否接受刷新，失败由 signals 展示。需要成功结果时 `try/catch + await execute()`。`fetchQueryObservable`
单次结果后完成或 error；`observeQueryObservable` 持续发 snapshot，请求失败不终止观察流。

点击提交并通过 mutation signals 展示状态时用 `void createMutation.mutate({...})`；后续动作依赖结果时用
`try/catch + await`。保留表单输入和不可变的提交参数快照。写 timeout
/ 丢响应不证明服务端没有执行，只有幂等键或操作结果查询才能支持安全重放。写成功但 invalidationError 时只恢复读取，不再次提交写请求。

暂不实现离线队列、共享 optimistic rollback、mutation reset 或 nondestructive
cancelQueries。这些需要明确的并发、所有权和恢复契约，不能仅添加 isPaused 就声称离线恢复。

## 验证

失败 demo 覆盖首次恢复、刷新保留数据、Observable 与 Promise 重试、总期限取消、部分失败行、observer 诊断隔离、mutation 输入保留与 scoped 刷新；所有新增文本支持 11 种语言，72 个 queryExamples
keys 无缺失或占位符错误。

完整本地验证通过：ngx-lift 826、clr-lift 243、demo
218 项单元测试；覆盖率门禁、源码与测试类型检查、lint、格式、i18n/tooling、production
builds 和独立 tarball 消费者安装；117 项 Chromium/Firefox/WebKit
E2E。独立运行时与 spec 复审没有具体 blocker。提交后仍需检查该 head 的远程 CI。

依赖 audit 未确认通过；未执行 npm 发布。代码验证、PR CI 与发布门禁分别报告。
