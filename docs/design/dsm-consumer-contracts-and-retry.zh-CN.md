# DSM 使用契约与 Kubernetes 重试改进

[英文设计说明](./dsm-consumer-contracts-and-retry.md)包含 API 契约、示例和官方参考资料。审查基于 ngx-lift
`6cc0ef0`、当前 `fix/quality-audit-hardening`，以及 DSM PR #2453
`62e1b33bf66f3173ebdbccb350beffec5a6efcba`。已读取 PR 实现和 TDMP-20455 原始需求，未修改远程 PR。

## isEmpty / isNotEmpty 的判断

旧的 `value is T` 不只是“帮助 true 分支排除 undefined”。它也承诺 false 分支没有 T。但
`[]`、`{}`、空 Map/Set 都是已定义的 T，同时会让 `isNotEmpty` 返回 false。因此恢复旧 overload 会把实际存在的数组推断为
`never`，或把可选空数组错误推断为 undefined。 `6cc0ef0`
返回 boolean 的改动是类型正确性修复，代价是消费者需要显式处理可空值。

处理方式：保留 boolean；DSM policy 的 TypeScript 和模板改用 `value != null && isNotEmpty(value)`；模板对这些数组使用
`value && isNotEmpty(value)`，符合模板 eqeqeq 规则。不增加 `!`、`as`
断言，不降低 strict 配置。扫描生产代码发现 23 处 emptiness 调用；主要是 policy 可选数组，另外有 retention 数组和 SQL
Server
computed。后两类只读取 boolean，无需修改。运行时的“空”语义保持兼容：0、false、函数等也视为空，不能当作通用 falsy 检查。Date、symbol 属性、跨 realm 容器等应采用符合业务对象含义的检查；本次没有扩展语义导致额外破坏。

包验证会实际编译打包后的 `.d.ts`：检查可空集合两分支、已定义空数组否定分支以及显式 null 检查。单靠运行 Vitest 的
`expectTypeOf` 不能证明 TypeScript 编译通过。

## Service、defer 与生命周期

你关于 Service 的纠正是对的：`queryResource`、`mutateResource`、`resourceAsync`
都支持 Service 和 Component。关键是注入上下文与资源归谁销毁。root
service 字段可能活到整个应用结束；service 工厂方法应接受调用方 Injector，尤其是事件处理器调用时。设计文档已修正这个示例，同时说明资源观察者与共享缓存不是同一个生命周期。

贴文对 defer 的两个说法需要纠正：

- `fetchQueryObservable` 已在内部 defer，所以不会在函数调用时立即 fetch。
- `http.get(url, {headers: getHeaders()})` 的请求等订阅，但 URL 和 getHeaders() 参数立即求值。

DSM 的外层 defer 仍有意义：订阅时才生成 targetOrigin、身份范围和 cache
key。保留 Observable 返回值兼容现有 RxJS 调用；无需为了使用共享 QueryClient 把 20 多处调用强制改成 Signal。

## 轮询与弹窗

之前父页面未绑定 pollingEnabled，默认 true 一直有效；表格自己的 toggle 弹窗也未暂停。已补父组件
`[pollingEnabled]="!isEditOrgModalOpen()"`，并在本地确认弹窗打开时关闭表格的 pollInterval。父组件的定时 reload 入口也会检查表格本地弹窗，避免绕过暂停。暂停后保留 rows 和观察者，关闭弹窗后恢复周期，保存动作仍可显式 reload。

暂停不是必须的正确性条件；它减少后台流量和交互期间的更新。已发出的请求仍可能完成，其他共享消费者或手动 invalidation 仍可能更新缓存。Angular 默认 QUERY_CLIENT 会处理 document
visibility；独立构造的 QueryClient 需要自己的可见性集成，不能说所有 QueryClient 都会自动暂停。父组件已有 RxJS
timer 也不归 QueryClient 的 visibility 管理。父 timer 和子表格周期刷新尚有重复，建议后续统一到单一轮询所有者，保留组织写入后立即刷新。

## 重试改进

ngx-lift 增加指数退避、equal/full/none
jitter、单次等待限制、每个订阅独立的累计等待预算、全局 provider，并保留工厂和 HttpContext 配置。默认 5 次总尝试，fallback 基数 1s、equal
jitter、hint 额外 jitter 最多 250ms，单次最多 30s、累计计划等待最多 60s。60s 不是墙钟总超时；网络耗时不包括在内。

默认只自动重试 GET/HEAD/OPTIONS/PUT/DELETE；POST/PATCH 必须显式配置并确认端点幂等性。每次重试通过 defer 重建下游拦截器，认证 token 可重新读取。重试拦截器须放在认证拦截器之前。重试操作符无法识别 HTTP
method，直接套在写请求上时仍由调用者承担幂等性判断。

重点修正：服务器说等 120s，客户端最多允许等 30s，应返回原错误，而不是截成 30s 提前请求。同时处理非法 Retry-After、过去日期、Infinity、字符串 JSON、取消等待和原错误身份。ngx-lift 不自动打印 URL，不把 dev
localStorage 或 mock-server 故障注入放进生产库。

## DSM PR #2453 的两个审查维度

Standards：没有查到违反仓库明确架构规范的点；确认了提前重试、默认 POST/PATCH、日志参数泄露、operator 忽略 enabled:false、mock 查看重置计数、漏解析字符串 body 等问题。

Spec：确认非法日期解析覆盖合法 body
hint、真实后端故障注入说明漏掉注册步骤，以及相同 IP 的并行客户端共享计数。原始 TDMP-20455 要求尊重 retryAfterSeconds；截短等待也与此冲突。

这些修复位于 `/tmp/dsm-pr2453-review` 的 `fix/pr2453-retry-hardening`
分支，独立于正在迁移资源的 DSM 工作区。mock 增加 X-DSM-Mock-Client 显式隔离、查看保留计数、数值校验，并补充开发环境注册说明。full
jitter 得到 0ms 不是独立 bug，已经受重试次数约束；本次保留 DSM 的 full
jitter 契约。待 ngx-lift 新 API 发布并升级依赖后再去掉 DSM 的重复实现，避免依赖尚未发布的接口。

## 验证状态

- `pnpm run validate` 全部通过：ngx-lift 731、clr-lift 238、demo 206，共 1175 单测；工具测试 7 项。
- 分支覆盖率分别为 90.44%、77.04%、75.47%，均通过阈值。
- Chromium / Firefox / WebKit 共 96 个 E2E 通过。
- 真实 tarball 的类型编译与运行时导入通过，包含 isNotEmpty 两分支和 provider 新 API。
- DSM data-service 使用新 boolean 声明的 Angular strict production 编译通过；未改安装包或 lockfile。
- DSM 聚焦测试：policy 4、region table 40、父 Advanced 23、VcfTmService 29，均通过。
- DSM PR 分支：core 重试 56、mock 3 个测试通过；core/server 构建与 lint 通过，既有 lint warnings 仍存在。

DSM 原资源迁移工作区已有用户修改，全部保留；本次该工作区的修改也保留为未提交状态。PR 重试修复在独立分支，不混合这些修改。未发布 npm 包，未推送、评论或合并远程 PR。未执行全量 DSM
E2E、全新依赖安装、多 Angular 主版本或人工读屏测试。

两轴原始审查统计：Standards 6 项，最严重为写入重试与提前请求；Spec
4 项，最严重为不遵守原始需求中的服务器等待。均已有本地修复。
