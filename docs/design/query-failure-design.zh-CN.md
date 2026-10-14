# Query 失败设计：有界请求、恢复入口和可用 UI

状态：正在实现。observer 异常隔离与 onDiagnostic 已实现；重试与 deadline 等策略接下来落地。2026-10-14 检查提交
`98d8918`。 [英文完整设计与 API 草案](query-failure-design.md) · [官方资料比较](query-failure-industry-research.md)

## 结论

现有工具已经有好的基础：直接接受 Observable /
PromiseLike、失败后可重新读取、刷新失败保留最后成功数据、动态列表独立错误状态、按 scope 失效，以及显式执行时的 Promise
rejection。缺口主要是失败隔离、统一恢复策略和状态表达，而不是再加一个 loader 适配器。

必须先修复本次复现的 observer 异常问题，再添加自动重试等功能。上一项同步 teardown 修复 `98d8918` 的 CI
16 项通过、2 项跳过，但这不代表新发现的失败路径也已安全。

## 差距与优先级

| 项目                      | 当前情况                                          | 建议                                       |
| ------------------------- | ------------------------------------------------- | ------------------------------------------ |
| observer 回调抛错         | 可能阻断 loader 启动并遗留 pending                | P0：隔离应用回调异常，单独上报             |
| 首次加载失败              | error 状态，可手动 reload/execute                 | 已有；补清晰的首次失败页面示例             |
| 刷新失败                  | 保留 value、hasValue、updatedAt，数据为 stale     | 已有；先展示内容，再显示刷新警告           |
| 动态列表部分失败          | B 方案按行保留各自状态                            | 已有；只重试失败行，不要求整个页面成功     |
| 顺序依赖失败              | 返回 undefined 可禁用子查询                       | 已有；显示父级错误，避免子级一直像在等待   |
| 自动 read retry           | 可在 RxJS loader 内处理，没有 QueryClient 策略    | P1：有界、可分类的共享重试，兼容 Promise   |
| 查询 deadline             | 无统一期限，NEVER / 不结算 Promise 可一直 pending | P1：可选总期限，超时结算并取消或隔离旧结果 |
| 错误集中上报              | 没有 cache 级终态失败 hook                        | P1：每个共享逻辑查询只报一次               |
| focus / reconnect         | 只有可见性控制的 polling，没有一般恢复策略        | P2：只刷新有观察者且 stale 的查询          |
| 失败状态 DX               | 有 loading 区分，没有明确的首次/刷新错误 flags    | 增加派生信号，保留原始错误                 |
| mutation retry / optimism | 无自动重试和共享乐观缓存更新                      | 默认保持不重试；有幂等与并发需求再设计     |
| 写成功、缓存同步失败      | invalidationError 与 write error 分离             | 已有；重读缓存，不重复提交写请求           |

实现依据： [QueryClient](../../libs/ngx-lift/src/lib/query/query-client.ts)、
[queryResource](../../libs/ngx-lift/src/lib/query/query-resource.ts)、
[mutateResource](../../libs/ngx-lift/src/lib/query/mutate-resource.ts)。

## 本次复现的正确性缺陷

公开的 `QueryClient.observeQuery` 回调在收到 `loading` 时抛错：

```text
attachmentError = "UI listener failed"
loaderCalls = 0
snapshot.status = "loading"
后续同 key fetch 在 20 ms Promise.race 中仍未结算
```

`startRequest` 先建立 pending，再调用 `publish`，最后才进入 loader 的 try/catch。 `publish`
直接调用外部 listener，所以外部 UI 异常会阻止传输启动。20
ms 是复现的观测窗口；结合控制流可确认未启动任何传输完成路径，remove/destroy 仍能取消该 pending。

独立复审也复现：listener 只在 resolved 时抛错，loader 已成功并缓存 42，但共享 fetch
Promise 却收到 UI 异常的 rejection。这类“缓存成功、调用失败”的矛盾也必须消除。

修复要求：

- 初始通知与后续通知都隔离每个 listener 的异常，继续通知其他观察者。
- UI / telemetry 错误不能改变传输成功与失败，也不能阻断 polling、GC、remove、destroy。
- 保留已有 revision、membership 和 generation 防护。
- 单独上报内部诊断；诊断回调自己抛错也不能破坏查询。
- 回归测试覆盖 initial/loading/resolved/error/removal 回调抛错、正常观察者、请求结算和重入。

这是已复现缺陷，不是“比行业库少一个可选功能”。本设计检查未修改生产代码。

## 开发者现在可以怎么用

页面状态应当按以下顺序判断：

1. 有可用数据：继续显示；status 为 error 时加刷新警告和 Retry。
2. 无数据且 status 为 error：首次加载失败面板。
3. 无数据且 isInitialLoading：首次 loading。
4. prerequisites 未满足：说明依赖条件，不能把 idle 当作成功空列表。

完整可编译组件示例见英文文档。判断失败用
`status() === 'error'`，不要只用 error 的 truthiness，因为 JavaScript 允许 reject(null/undefined)。 `E`
泛型只是类型声明，不会把运行时错误自动变成 Error。

`reload()` 返回是否接受刷新，不代表结果成功；失败通过 signals 展示。需要结果时用 `try/catch + await execute()`。有限
`fetchQueryObservable` 向订阅者发出 error；持续 `observeQueryObservable`
的请求失败存在 snapshot.error，不会终止观察流。配置错误仍可能让观察流失败。

不要用 `catchError(() => of([]))`
把真实故障伪装成成功空列表，除非空列表就是明确的业务 fallback。用 queryResources 的行级状态隔离部分失败；forkJoin /
Promise.all 是 fail-fast 组合，不是自动部分成功工具。依赖父级保留的旧数据是否允许继续读取子级，应由业务明确决定。

## API 设计建议

保持 `queryResource(() => definition)` 和原生 HttpClient
loader。在现有 QueryDefinition 上增加可选字段，不要求应用创建 loader adapter：

```typescript
interface QueryReadPolicy {
  retry?: false | QueryRetryOptions;
  deadlineMs?: number;
}

interface QueryRetryOptions {
  maxAttempts: number; // 包括首次请求
  shouldRetry: (error: unknown, context: QueryAttemptContext) => boolean;
  delayMs: number | ((error: unknown, context: QueryAttemptContext) => number);
}

interface QueryAttemptContext {
  key: QueryKey;
  attempt: number; // 从 1 开始
  elapsedMs: number;
}
```

这些是拟议类型，不是当前导出。代码实现和正式 API 注释使用英文；此处注释仅解释设计。客户端可提供 queryDefaults，definition 覆盖默认值；`retry: false`
能关闭继承的重试。mutation 的默认策略独立，默认不自动重试。

建议的信号：isInitialError、isRefreshError、updatedAt、failureCount、failureReason、nextRetryAt。错误 flags 根据 snapshot.status 和 snapshot.hasValue 派生，不靠数据或错误 truthiness。resource.hasValue() 另外承担排除 undefined 的类型收窄职责。

重试必须有明确契约：

- 每次 attempt 重新调用 loader；不能重新等待同一个 rejected Promise。
- maxAttempts 是有限正整数；3 表示总共最多调用 3 次 loader。
- 一个逻辑查询冻结 loader、参数、策略和 generation；同 key 调用者共享当前工作，由发起者决定该次执行策略，后来的调用者不能改写。用同一个定义工厂保持策略一致。
- 重试等待仍属于 loading/reloading，临时错误通过 failureReason 展示；终态失败才上报用户错误。
- 只对已确认安全的读取与临时错误启用；auth/validation/domain、abort、空流、cleanup 错误不默认重试。
- RxJS/interceptor 与 QueryClient 选择一个 retry owner，避免尝试次数乘法放大。
- cancel/remove/完成时清理重试与 deadline timer。现有 tag
  invalidation 允许旧调用者完成，因此旧请求仍保留自己的 retry/deadline，直到结算；只屏蔽其缓存发布、polling 所有权与过期错误上报。不能清掉 continuation
  timer 却让旧 Promise 永远 pending。
- shouldRetry/delayMs 每次调用都要验证；抛错、非 boolean 判断或非法延迟（NaN/Infinity/负数）结束重试，用原始请求错误结算，并单独上报策略错误。静态配置只能提前验证，无法代替动态回调检查。
- polling 等当前逻辑查询（含重试）完成，不启动竞争的重试循环。
- 已有 retryOnK8sBackoff 能处理有界 backoff 和 Retry-After，应复用其约束与测试经验。

deadlineMs 表示从逻辑读取建立到最终结算的总期限，包括 loader 和重试等待。超时产生可识别的 QueryTimeoutError、取消 Observable 并结算调用者。Promise 忽略 abort 时也必须让等待结束，并阻止迟到结果写入该次缓存。它作用于所有共享调用者；单个调用者外层 RxJS
timeout 只停止该调用者等待。不能为了适配 deadline 缩短服务器要求的 Retry-After；期限不足时结束请求。将来若需要“单次挂起后还能重试”，再增加独立 attemptTimeoutMs。研究稿列出了单次 timeout；主设计明确先实现更小的总 deadline
API。

JavaScript 无法抢占阻塞的同步 loader，后台 timer 也可能延迟。开始 attempt 和发布成功前都检查实际 elapsed，期限已到时在最早可执行边界结算。期限使用单调 elapsed 时钟，UI 日期用 wall-clock 时间戳。

客户端 onQueryError 对每个属于当前 generation 的逻辑读取终态失败只调用一次，按逻辑读取身份去重，不能只按 generation 去重：同 generation 的两次失败 poll/reload 各有一个事件。提供 key、attemptCount、hasValue、trigger；普通取消和旧结果不重复弹 toast。保留原错误对象，UI 提示与脱敏上报由应用决定；callback 必须隔离异常。

### 重试状态的明确转换

- 新逻辑读取：count = 0、reason = null、nextRetryAt = null，清除旧 error，保留成功数据。
- 失败后等待 retry：count 记录连续失败次数，reason 为最新原始失败，nextRetryAt 表示重试时刻。
- 新 attempt 开始：保留该次逻辑读取的 count/reason，清除 nextRetryAt。
- 恢复成功：count/reason/nextRetryAt 重置。
- 终态失败：保留失败次数与最后原因，清除 nextRetryAt，保留旧成功数据。
- 总期限到期：不伪造失败 attempt 数量，最终 reason/error 为 QueryTimeoutError，pending 必须清除。
- 显式取消：清除可见 retry 信息，await 调用者收到 abort，不把生命周期取消当作新用户错误。
- removed/disabled：idle 视图清除 metadata；禁用一个观察者不取消其他观察者的共享工作。
- 被失效代际替换的读取：自己的完成机制继续存在，但不再覆盖新状态或上报旧错误。

## 为什么不直接复制 React Query 全部行为

[TanStack Query](https://tanstack.com/query/latest/docs/framework/react/guides/query-retries)
默认客户端 3 次 retry，服务端 0；[RTK Query](https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#automatic-retries)
则需要显式 retry wrapper。默认值不是统一行业标准。

[SWR](https://swr.vercel.app/docs/error-handling)
允许 data 和 error 同时存在；ngx-lift 已经具备这种底层能力，需要把 DX 和示例做好。
[Angular HttpClient](https://angular.dev/guide/http/making-requests#timeouts) 的 HTTP
timeout 与包含组合查询、interceptor 等等待的 query deadline 是不同范围。

后续 focus/reconnect 只刷新 active
stale 查询，并去重已有请求。不能只加 isPaused 名字就声称支持离线排队恢复；真正有队列/恢复逻辑时再设计 fetchStatus。React
error boundary 属于框架 UI 集成，不是 Angular 必须复制的 API。

Mutation 丢失响应或 timeout 不代表服务端未执行。创建请求要有后端幂等键或结果查询才能安全重放。保留表单输入和提交参数；写成功后的 invalidationError 用 read
recovery，不提交第二次 write。共享 optimistic rollback 必须先解决并发覆盖问题，简单 pending
UI 往往足够。未来 mutation.reset 只重置展示，不能假装撤销已提交的操作。

## 落地顺序与验证

1. 修复 observer 异常隔离，补回归证明。
2. 增加基于现有 API 的失败模式 demo，所有 11 种语言都支持。
3. 再实现有界 read retry、总 deadline 和集中上报；Observable 与 Promise 同等测试。
4. 最后按需求增加 focus/reconnect、非破坏性 cancel；离线写回放与共享乐观更新延后。

本轮完成官方资料比较、源码检查、真实失败复现和设计文档。未新增 query 运行时 API。英文文档中的当前 API 组件示例通过 strict
TypeScript 检查，零诊断；Markdown 格式检查通过。

实施检查点：observer 隔离新增 5 项回归与原有 43 项 QueryClient 测试通过。
