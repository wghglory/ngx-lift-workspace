# 全局质量审计修复说明

日期：2026-10-13（Asia/Shanghai）。分支：`fix/quality-audit-hardening`。起点为
`main@f8cb5b5`，原始审计及证据文档随分支保留。本文件记录实现与兼容决策，不将产品路线图或未完成的验证写成已交付功能。

## 本轮结果

优先修复确定的错误，并建立后续能够阻止复发的质量门。库和 demo 的状态、文本与契约保持分层：库不默认引入另一套 store，demo 的部分语言明确标识，已有公共 symbol 不突然删除。

| 审计项              | 处理                   | 具体结果与边界                                                                                                                                                     |
| ------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Q01 URL             | 修复                   | HTTP(S) 实际解析，长域名/IPv6/非法端口回归；保留拒绝单标签主机的旧契约                                                                                             |
| Q02 i18n            | 修复核心缺陷并建立验收 | 英语兜底缺键、主要硬编码、API 描述、俄语控件标签补齐；字典版本响应式、脚本回退、文档 lang/dir、格式 locale、缺键日志去重、原型安全；其他 demo 语言保留部分翻译策略 |
| Q03 coverage        | 修复                   | 维持 75% 分支门槛，补行为测试；失败时仍展示摘要，缺失报告不静默成功                                                                                                |
| Q04 ESLint          | 修复                   | 公开上游 rule adapter，正常 visitor 与合法 preset；验证真实 Clarity 控件及孤立 label                                                                               |
| Q05 来源头部        | 替换实现               | 用公开 Angular ESLint rule 与 parser AST 独立实现适配，移除对私有内部代码的引用；不是仅删文件头                                                                    |
| Q06 demo 加载       | 修复                   | 路由/语言懒加载；构建预算从 5/8 MB 收紧至 3.5/4 MB；保留高级场景                                                                                                   |
| Q07 API 漂移        | 修复已确认项           | StatusIndicator 默认值与类型修正；FileReader 表格改为响应式并说明文本编码；Spinner 新能力与真实 class 输入同步文档                                                 |
| Q08 computedAsync   | 兼容处理               | 保留既有错误默认行为，迁移指南要求显式 onError/throwOnError；默认 typed-result 重设计留作独立 major，不在修复中悄悄改变                                            |
| Q09 FileReader      | 修复                   | UTF-8 base64 roundtrip、Latin-1 兼容选项、超限读取提前拒绝、错误清除旧文本；仍是文本组件，不承诺二进制保真                                                         |
| Q10 日期边界        | 修复                   | factory 校验无效/倒置范围，参数边界拷贝；业务输入仍返回 ValidationErrors                                                                                           |
| Q11 range           | 修复                   | 有限值与最大分配校验；保留零 step 行为                                                                                                                             |
| Q12 tooltip/popover | 修复                   | 文本 tooltip / 交互 named dialog、对应 ARIA 关系、保留调用方属性、focus/scroll/blur/Escape 生命周期与焦点归还回归                                                  |
| Q13 spinner         | 修复                   | decorative 默认兼容，显式 status 模式、本地化默认 label、自定义 class 真实生效                                                                                     |
| Q14 clipboard       | 修复                   | 拒绝/不可用反馈，销毁后不写状态，清除计时器；保留旧高亮字符串兼容路径                                                                                              |
| Q15 样式            | 修复已确认项           | CodeBlock 遗留 Tailwind 类清理，spinner 示例采用真实全局样式；不把所有相似命名类当成 Tailwind 删除                                                                 |
| Q16 发布质量门      | 修复配置               | CI/publish/deploy 共用质量工作流，完整 coverage、类型、format、工具、i18n、tarball 与三浏览器；尚未执行远程工作流或发布                                            |
| Q17 工具/peer       | 收口                   | pnpm 11.7.0 单一声明，去掉冲突的 devEngines；peer 限定当前 major，需 SemVer/兼容性复核后发布                                                                       |
| Q18 public API      | 兼容处理               | 内部辅助与 mock 加弃用说明，保留既有导出；secondary entry points 和移除 symbol 属于后续独立迁移                                                                    |
| Q19 validate/format | 修复                   | validate 只读，fix 单独写入；formatter 覆盖工具/YAML，排除 pnpm 管理的 lockfile 格式                                                                               |

## 补充发现与修复

- **组合语义说明**：中英/繁中 demo 移除错误的跨来源原子更新保证，改为初始化去重与 combineLatest 语义；同步 Signal 派生推荐 computed。
- **写入与失效错误分离**：服务端写入成功后，tag mapper 或已销毁 QueryClient 的异常不再使 mutate
  Promise 拒绝；通过可选 invalidationError 信号单独暴露同步失败，避免错误触发写入重试。
- **表单重复提交**：`lazy: true` 不会关闭第一次执行后的响应式跟踪。企业表单提交增加
  `reactive: false`，回归断言提交后编辑不再发起新提交。新业务写入优先使用 mutateResource。
- **poll
  demo 生命周期**：主动启动的订阅在 switchMap 之后使用 takeUntilDestroyed，销毁会取消内层 polling；快速刷新 timers 也随页面清理。
- **真实 ESM 消费**：tarball 检查发现 node-forge named
  exports 无法在原生 ESM 下消费，改为兼容默认导入并将 pki 纯类型导入明确标记。
- **误测其他服务**：本机 4200 上有另一个 DSM 应用，旧 reuseExistingServer 会误测。E2E 默认独立 4307、拒绝自动复用；显式 BASE_URL 才用于外部站点。
- **demo 确定性**：用户示例默认使用本地 fixtures，外部 HTTP 通过 DEMO_LIVE_USERS 显式启用；日期示例更正 differenceInDays 的负号与 elapsed-day 契约。

## 使用与兼容

```html
<!-- 独立加载状态；省略 label 时使用组件内置的本地化加载提示 -->
<cll-spinner [decorative]="false" [label]="loadingMessage" />
<!-- 旧的 Latin-1 base64 数据继续按旧语义解码 -->
<cll-file-reader [encoded]="true" textEncoding="latin1" />
<!-- 交互内容的可访问名称 -->
<button cllTooltip [cllTooltipContent]="details" cllTooltipLabel="Account details">Details</button>
```

`byteConverter` 可传显式 locale，证书和首页日期通过 Intl 使用当前语言；1024 缩放及历史单位命名没有悄悄改变。控制错误使用
`computedAsync(..., {onError: ...})`、throwOnError 或资源状态，不把默认错误对象误当业务数据。

UTF-8 默认与 peer 上限变化需要公开迁移及版本评估；ASCII
PEM 数据不变，旧 Latin-1 可以显式保留。详见[英文迁移说明](../MIGRATIONS.md)。

## 验证

最终 `pnpm run validate` 和完整 E2E 均通过：

| 检查                                               | 最终结果                                          |
| -------------------------------------------------- | ------------------------------------------------- |
| ngx-lift                                           | 44 文件 / 707 单测，分支覆盖率 90.03%             |
| clr-lift                                           | 25 文件 / 238 单测，分支覆盖率 77.04%             |
| demo                                               | 75 文件 / 206 单测，分支覆盖率 75.47%             |
| 工具回归                                           | 7 项 node:test 通过                               |
| 三浏览器 E2E                                       | 96 项全部通过                                     |
| format / lint / typecheck / build / i18n / tarball | 全部通过                                          |
| 生产首屏                                           | 4.61 MB → 3.20 MB；估算传输 883.32 kB → 636.61 kB |

覆盖率没有降门槛；语句、函数、行门槛也通过。性能数据来自 production
build，未伪称为 LCP/INP 实测。工作流 YAML 已解析、文档本地链接检查及 git diff --check 通过。部分增量检查使用 Nx build
cache，覆盖率和最终 E2E 均强制重跑；真实 tarball 消费目标本轮实际执行。

验证命令：

```bash
pnpm run validate
pnpm nx e2e demo-e2e --skipNxCache
```

新增工具测试与 i18n checker 由 Nx root targets 执行；coverage
wrapper 清除旧报告、保留失败码并显示摘要。打包验证使用真实 tgz 的 exports、d.ts 和 runtime
import，复用当前安装依赖，Clarity runtime import 提供浏览器 DOM。这不等同于 fresh peer
install 或完整 SSR/hydration 测试。

## 后续边界

其他 demo 语言仍是部分翻译；英文/简中完整键集不等同所有高级静态文档已翻译。Clarity 上游 common
strings 的全语言适配、复杂复数/ICU、人工读屏、Angular 22 支持、完整 SSR/hydration、typed-result 默认、secondary entry
points、query diagnostics 仍需独立工作包。当前 Clarity 18.4 的 icon 模块在原生 Node
import 时访问 document；本轮没有用 DOM fixture 通过来宣称 SSR 支持已解决。没有进行发布、远程 CI 审批或依赖安全清除。

## 工作区说明

原始审计附件保留为 2026-10-12 的基线，未把旧数据改写成当前状态。新修复验证摘要见
[2026-10-13 evidence](../reviews/ngx-lift-hardening-evidence-2026-10-13.json)。检测到 `is-empty.util.ts`
的非本轮并行改动，已保留，没有计入本轮修复成果；现有测试和 typecheck 通过不代表穷尽验证了该改动的消费者类型契约。CI
required-check 名称随共享工作流调整，若远程分支保护固定旧 job 名称，需要维护者同步检查；本轮没有核实或修改远程规则。
