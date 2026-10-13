# ngx-lift / clr-lift 行业对标与标准参考

研究基准日：2026-10-12（Asia/Shanghai）。范围：Angular、ngxtension、TanStack
Query、NgRx、APF、WAI/WCAG、ECMA-402、npm 发布规范。本文只给出已核实的外部事实及据此推导的建议；除依赖清单和公开导出外，没有审查本地功能实现，不能据此认定某项本地 bug。动态官网可能继续更新，未标明发布时间的页面不等于基准日的历史快照。采用版本化 Angular
v21 文档及 ECMA-402 2025 固定版来降低版本错配。检索遇到标题为 ECMAScript
2027 的滚动草案，已排除，未用于当前标准结论；没有将未来发布日期或路线图当作已交付功能。

## 1. 最先澄清版本：项目的 Angular 21 与官网的 Angular 22

本地根 `package.json` 声明 Angular `21.2.17`；两个库的 Angular peer 范围从 `>=21`
开始。以下状态来自版本化文档、当前官方 API 页面与本地安装包声明，不能混为一个版本的承诺。

| API                 | Angular 21 证据                                        | 当前官方 API 状态  | 对项目的建议                                         |
| ------------------- | ------------------------------------------------------ | ------------------ | ---------------------------------------------------- |
| `resource`          | v21 文档标记 experimental                              | stable since v22.0 | v21 的相关公开封装必须说明上游实验性                 |
| `rxResource`        | 安装包 `types/rxjs-interop.d.ts:187` 标记 experimental | stable since v22.0 | 把上游版本差异限制在 adapter 内                      |
| `httpResource`      | 安装包 `types/http.d.ts` 标记 experimental 19.2        | stable since v22.0 | 先定义支持矩阵，再决定升级或替代                     |
| Signal Forms `form` | v21 文档标记 experimental since v21.0                  | stable since v22.0 | 21 分支保留成熟 Reactive Forms 路径，22 适配单独评估 |

来源：[v21 resource](https://v21.angular.dev/api/core/resource)、[v21 form](https://v21.angular.dev/api/forms/signals/form)、[resource](https://angular.dev/api/core/resource)、[rxResource](https://angular.dev/api/core/rxjs-interop/rxResource)、[httpResource](https://angular.dev/api/common/http/httpResource)、[form](https://angular.dev/api/forms/signals/form)。推导建议：发布文档分别标注“库 API 稳定度”“底层 Angular
API 稳定度”“实际测试过的 Angular 版本”；`>=21` 表示允许安装，不能代替未来所有 major 的兼容性证据。

## 2. 明确产品边界，降低重复实现成本

| 场景                        | 优先参考               | ngx-lift 的合理增值点                          |
| --------------------------- | ---------------------- | ---------------------------------------------- |
| 单个响应式读取及取消        | Angular resource 家族  | 一致的错误/状态、迁移 adapter、应用范例        |
| Observable 与 Signal 的组合 | ngxtension             | 更严格类型、团队需要的语义、生命周期保障       |
| 跨页面共享服务端状态        | TanStack Query         | Angular 原生的较小 API、清晰缓存契约及诊断能力 |
| 客户端业务状态及命令        | NgRx SignalStore       | 互操作示例或小型 adapter，避免自建另一套 store |
| Clarity 常见业务组件        | Clarity + WAI patterns | 可访问性、国际化、表单契约、整合质量           |

这是定位建议，不是要求引入表中全部依赖。先写“何时用本库/Angular 原生/外部库”的决策页，帮助开发者选择最少的概念。参考：[Angular resource](https://angular.dev/api/core/resource)、[ngxtension derivedAsync](https://ngxtension.dev/utilities/signal-async/derived-async/)、[TanStack Angular overview](https://github.com/TanStack/query/blob/main/docs/framework/angular/overview.md)、[NgRx SignalStore](https://ngrx.io/guide/signals/signal-store)。

## 3. Signal 工具：借鉴 ngxtension 的小接口和可解释语义

`derivedAsync`
支持 Promise、Observable 与普通值，提供 switch/merge/concat/exhaust 行为、initialValue、requireSync 和显式 Injector；文档标记 stable。
`derivedFrom` 合并 Signal/Observable 的数组或对象，并允许 RxJS
operators；同步首值、initialValue、注入上下文都有说明。[derivedAsync](https://ngxtension.dev/utilities/signal-async/derived-async/)、[derivedFrom](https://ngxtension.dev/utilities/signal-async/derived-from/)。

建议为 `computedAsync`、`combineFrom`、`mergeFrom`
建立语义表：同步首值、undefined 类型、错误是否抛出、complete 后状态、销毁、重入和每种并发策略。每个工具的首页应有最小复制示例、复杂示例、运行时/类型约束、清理行为、失败模式以及与 Angular 原生替代的区别。特别写清“忽略旧 Promise 的结果”与“终止网络请求”的差别；真实网络取消必须有 AbortSignal 或支持取消的底层 Observable，不能仅凭 switch 命名承诺。这些属于建议验收条件，尚未认定本地工具缺失或错误。

## 4. Angular resource 是读取机制，mutation 需要独立契约

Angular 官方明确将 `resource` 定位为 read
operations；参数变化或销毁时取消旧 load，可能提前中断 mutation。[v21 resource](https://v21.angular.dev/api/core/resource)。
`httpResource`
基于 HttpClient，因此可以使用拦截器和 HTTP 测试设施；这类互操作值得保留。[httpResource](https://angular.dev/api/common/http/httpResource)。

建议独立定义 mutation：命令何时开始、参数快照、重复提交策略、取消含义、幂等性、成功后的失效规则、乐观更新和回滚。提交接口应允许应用决定串行、并行或拒绝重入；不要让读取参数的自动变化隐式重复提交。对于“提交后刷新列表”，demo 应展示失败留在编辑状态、成功失效查询、旧响应不覆盖新写入这三条交互路径。

## 5. QueryClient：参考 TanStack 的生命周期，而非照搬默认值

TanStack 默认将缓存结果视为 stale；stale
query 在挂载、窗口重新聚焦或网络重连时可后台刷新；无 observer 后 inactive，默认 5 分钟 GC；失败默认重试 3 次；JSON 兼容数据使用 structural
sharing。[Important Defaults](https://tanstack.com/query/latest/docs/framework/angular/guides/important-defaults)。当前 Angular
adapter 的官方 overview 仍声明 experimental，提示 minor/patch 可能破坏兼容并建议锁定 patch；不能称为无风险的稳定替代。[官方 overview 源码](https://github.com/TanStack/query/blob/main/docs/framework/angular/overview.md)。

| 必须写明的本库契约            | 建议验收方式                                          |
| ----------------------------- | ----------------------------------------------------- |
| freshness 与 retention 的区别 | staleTime 到期不等于立即删数据；GC 从无 observer 开始 |
| key 的身份与隔离范围          | 对象键顺序、类型、undefined、租户/用户身份及注销清理  |
| 去重与取消的所有权            | 同 key 多 observer、最后一个 detach、同步回调 detach  |
| 旧请求与显式写入的优先级      | 旧 response 晚到不覆盖 setQueryData/新参数结果        |
| polling/retry 的生命周期      | 释放后无计时器；重试取消；不同 observer 选项可预测    |
| 失效与批量查询                | prefix/exact 语义、无 active observer 的处理、复杂度  |

以上为风险模型和测试建议，不能从竞品功能列表反推出本库已经存在对应缺陷。建议先增加受控 query 诊断：key、observer 数、最后成功时间、下次 GC、pending/retry；避免日志记录 token、完整响应或敏感身份。

## 6. NgRx 对标：公开状态只读，改变状态通过命令

SignalStore 用可组合 features 构建 state、computed、methods；可在组件、路由或 root 提供，默认保护 state 不受外部修改。[SignalStore](https://ngrx.io/guide/signals/signal-store)。建议 ngx-lift 暴露只读查询 Signal 及明确的 command，内部缓存/计时器保持私有；不要让消费者直接修改内部状态来“修复 loading”。推荐一个互操作 demo：SignalStore 管理筛选条件及业务命令，query 管理远端数据和缓存；各自承担生命周期，避免两份服务端数据互相同步。只有出现多处重复的互操作代码时才新增 adapter；不建议为了对标而增加核心硬依赖。

## 7. Zoneless、SSR 与 Hydration 应成为兼容性证据

Angular 指出 zoneless 下部分 NgZone stability
observables 不发射；SSR 异步工作若影响序列化，应通过 PendingTasks 告知 Angular；普通 Reactive
Forms 更新不会自动安排组件检测。[Zoneless](https://angular.dev/guide/zoneless)。建议验收矩阵涵盖：Zone 与 zoneless、同步/异步回调、销毁清理、真实 SSR
import/render、首屏 hydration、组件动态创建。重要异步读取以 try/finally 释放 PendingTasks；长期 polling 不应无限阻塞 SSR 稳定。不要把所有 NgZone.run/runOutsideAngular 无差别删除；官方说明它们兼容 zoneless，删除也可能影响仍使用 ZoneJS 的应用。[Zoneless](https://angular.dev/guide/zoneless)。

## 8. 包结构：secondary entry point 与 tree shaking 是不同问题

APF 规定 exports 描述入口、库采用 partial compilation，且通常声明 sideEffects；secondary entry
point 决定可独立懒加载的粒度，单一 FESM 的代码拆分受模块边界限制。[Angular Package Format](https://angular.dev/tools/libraries/angular-package-format)。因此“只有 root
barrel 就完全不能 tree shake”是错误推断。建议先用一个只导入单个 pipe 的外部消费应用测量，再决定入口拆分。可评估
`ngx-lift/query`、`ngx-lift/signals`、`ngx-lift/forms`、`clr-lift/certificate`、`clr-lift/testing`；目录里的 index.ts 本身不等于已发布 secondary
entry point。测试真实 tarball 的 import、typings、exports、partial
compilation、peer 安装和单功能 bundle，而不是只测 workspace TS path
alias。拆入口时保留已有 root 导出及迁移说明；优化证据应是消费端 bundle 差异和懒加载边界，不是源码文件数量。

## 9. 可访问性：用标准定义行为，然后测试交互

WCAG 2.2 应作为目标，例如 Keyboard、Focus Visible、Name/Role/Value、Status
Messages；自动扫描不等于完整合规。[WCAG quick reference](https://www.w3.org/WAI/WCAG22/quickref/)、[Playwright accessibility testing](https://playwright.dev/docs/accessibility-testing)。Tooltip
APG 建议 focus/hover 触发、Escape 关闭、焦点留在触发器、role=tooltip 和 aria-describedby；该 pattern 自身注明仍在讨论，不能把它叫作已达成共识的规范条文。[Tooltip Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/)。WCAG
1.4.13 对额外 hover/focus 内容要求可关闭、可悬停、保持显示，条件和例外应按原文判断。[Content on Hover or Focus](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html)。Modal 应处理初始焦点、Tab/Shift+Tab 循环、Escape 和关闭后的焦点恢复；combobox 需遵循选定 popup 类型对应的角色和键盘模型。[Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)、[Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)。建议 clr-lift 对 tooltip、idle 弹窗、可关闭 alert/toast、文件选择和表单控件分别建立 keyboard
E2E 与读屏人工记录；不要仅增加 aria 属性后宣布通过。

## 10. 国际化：翻译文本、格式、布局是三个不同契约

Angular 支持标记模板文本/属性、$localize 以及 ICU
plural/select；格式管线依据 locale。[Prepare for translation](https://angular.dev/guide/i18n/prepare)、[Format data based on locale](https://angular.dev/guide/i18n/format-data-locale)。ECMA-402
2025 定义 Intl.NumberFormat、DateTimeFormat、RelativeTimeFormat、PluralRules 等，能够按 locale 处理格式和复数规则。[ECMA-402 2025](https://402.ecma-international.org/12.0/)。建议独立提供 message
adapter 和 locale 配置：使用方可接 Angular
i18n 或运行时翻译系统；只改 LOCALE_ID 不能自动翻译任意硬编码文本。遗漏检查范围：可见按钮、aria-label、title、placeholder、empty/loading/error、校验信息、文件大小/单位、倒计时、证书日期、toast、键盘提示、demo 文案。复杂句子由完整 message/ICU 格式化，避免拼接“数字 + 英文单位”；日期明确 timezone，文件大小明确 SI/IEC 语义；Intl 不替应用决定字节单位换算规则。测试建议：en-US、zh-CN、一个有复杂复数规则的 locale、RTL、长译文及伪本地化；共享 locale 和 clock
fixture，检查 SSR 与浏览器首屏一致。

## 11. 专业发布标准：可验证的兼容性与可追溯的产物

SemVer 要求声明 public
API，兼容修复、兼容新增与破坏变更应映射相应版本；发布后的版本内容不应修改。[Semantic Versioning](https://semver.org/)。Angular 的 experimental
API 不享有相同稳定承诺，所以库发布说明应显式指出哪些接口依赖该状态。[Angular releases](https://angular.dev/reference/releases)。npm
provenance 记录构建来源和发布证明；trusted
publishing 用 OIDC 降低长期 token 依赖。它们提供来源证据，并不证明源码没有 bug。[Provenance](https://docs.npmjs.com/generating-provenance-statements/)、[Trusted publishing](https://docs.npmjs.com/trusted-publishers/)。建议增加 public
API diff、支持的 Angular/Clarity/Node 表、弃用周期、发布 changelog、tarball smoke
test、来源证明和安全报告渠道。质量门应验证已构建的同一产物；避免通过测试后重新构建另一份包再发布。升级清单和安全审计需要实际版本证据，不能把 outdated 等同 vulnerability。

## 12. 引入顺序与完成标准

| 顺序 | 推荐新增内容                             | 完成标准                                              |
| ---- | ---------------------------------------- | ----------------------------------------------------- |
| P0   | 支持矩阵、API 状态和行为契约             | 公开入口逐项说明版本、销毁、错误、并发语义            |
| P0   | a11y/i18n contract tests                 | 关键交互通过键盘测试；文案/ARIA 均可替换              |
| P1   | tarball consumer + zoneless/SSR fixture  | 声明支持的消费路径和渲染模式有 CI 证据                |
| P1   | query lifecycle diagnostics              | 重现去重、取消、失效、GC，无敏感内容泄漏              |
| P1   | API 驱动 demo 模板与来源文件引用         | 最小例子可复制运行，代码片段不随修改过期              |
| P2   | 基于测量的 secondary entry points        | 消费端 bundle/懒加载数据证明收益且兼容旧 import       |
| P2   | Angular 22 resource/Signal Forms adapter | 完成迁移 spike 和支持矩阵后发布，避免直接扩大核心依赖 |

上述优先级是行业证据推导的建议，应与主审计中的本地已确认问题和实际测试结果合并排序。
