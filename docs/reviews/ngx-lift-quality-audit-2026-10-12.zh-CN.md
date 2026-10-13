# ngx-lift / clr-lift 全局质量审计与专业化路线图

审计日期：2026-10-12（Asia/Shanghai）。代码基线：`main`，`f8cb5b558b05d9673b3e584e3b62d5a803497fa2`。开始审计时工作区干净。

输入：用户提供的 Cursor《Code Quality Audit, Signal Architecture & Modernization
Roadmap》。本次交付是评估与方案文档，没有修改库、demo 或工作流的实现。

本报告保留审计时的基线结论；2026-10-13 的实现、最终验证及后续范围见[修复说明](../design/quality-audit-hardening.zh-CN.md)。

## 1. 结论与阅读顺序

项目已有很好的工程基础：Angular 21、zoneless demo、严格类型、1091 项单元测试、84 项三浏览器 E2E，以及分离的 query /
mutation 模型。它已明显超出 Cursor 文档所描述的阶段。下一步价值最大的工作是**修正已确认的边界错误，补齐国际化和质量门，让文档与公开 API 保持一致**，然后再扩展功能。

目前不能把“已有测试全部通过”解释为“全部质量门通过”：覆盖率检查实际失败；国际化存在缺键、硬编码和格式不同步；URL 校验存在明确误判；生产 demo 首屏为 4.61
MB。没有发现并复现足以在本报告中定为 P0 的运行时缺陷，也没有据此证明不存在更严重的问题。

建议先看第 2 节的验证结果、第 4 节的缺陷清单和第 5 节的国际化明细，再按第 11 节安排工作。完整外部依据见[行业对标研究](../research/ngx-lift-industry-reference-2026-10-12.zh-CN.md)；精确缺键列表见[国际化证据](ngx-lift-i18n-inventory-2026-10-12.json)。

证据等级：**已复现**＝本轮命令或最小探针得到结果；**代码确认**＝可以直接从当前实现确定；**待验证风险**＝有具体触发条件但未完成实际环境复现；**建议**＝产品或架构选择，不是 bug。P1 优先于新增功能，P2 下一轮处理，P3 按实际需求投入。优先级不代表安全漏洞评级。

## 2. 当前状态：实际执行结果

环境：Node `v24.18.0`，实际 pnpm `11.7.0`；仓库声明 `pnpm@10.5.2`。Angular `21.2.17`、Nx `22.7.5`、Vitest
`4.1.7`。库 manifest：`ngx-lift@21.2.0`、`clr-lift@21.1.0`。这些是本地声明与安装状态，不是 npm 已发布版本的查询结果。

执行了下列检查，均使用 `--skipNxCache`，没有复用昨日测试结论：

```bash
pnpm nx run-many -t test lint typecheck build --parallel=3 --skipNxCache
pnpm nx e2e demo-e2e --skipNxCache
pnpm nx run-many -t test --coverage --parallel=1 --skipNxCache
```

| 检查                     | 本轮结果                                                    | 解释                                                      |
| ------------------------ | ----------------------------------------------------------- | --------------------------------------------------------- |
| ngx-lift 单元测试        | 44 文件，698 项通过                                         | 不启用覆盖率时通过                                        |
| clr-lift 单元测试        | 25 文件，223 项通过                                         | 不启用覆盖率时通过                                        |
| demo 单元测试            | 73 文件，170 项通过                                         | 不启用覆盖率时通过                                        |
| lint / typecheck / build | 全部通过；Nx 涉及 4 项目                                    | 包含 demo-e2e lint；不是运行所有 inferred targets         |
| Playwright               | 84 项通过                                                   | Chromium / Firefox / WebKit，合计数；28 个用例 × 3 浏览器 |
| ngx-lift 覆盖率          | 分支 89.90%，行 95.01%                                      | 达到当前门槛                                              |
| clr-lift 覆盖率          | 分支 **73.58%**，行 91.55%                                  | 低于 75% 分支门槛，命令失败                               |
| demo 覆盖率              | 分支 **58.27%**，行 88.17%                                  | 低于 75% 分支门槛，命令失败                               |
| 生产 demo build          | initial total **4.61 MB**；estimated transfer **883.32 kB** | CLI 估算传输量，不是浏览器实测或 Core Web Vitals          |

文档完成后 `pnpm run format:check` 与 `git diff --check`
通过，新增文档的本地链接全部可解析；formatter 对工具扩展名的遗漏另见 Q19。

测试日志还有大量翻译缺失警告和 5 次 jsdom CSS parse 报错，但测试仍通过。这里不将 CSS
parse 日志直接认定为真实浏览器 CSS 缺陷；应隔离测试环境不支持的 CSS，并让意外 warning/error 可见。单元测试日志中翻译缺失警告达到 21,805 行，既说明 fixture 的字典注册不完整，也说明当前缺失日志会重复放大。

覆盖率补测应优先覆盖行为：clr-lift 的 `tooltip.util.ts` 分支 62.85%、`key-value-inputs.component.ts`
55.55%、`translation.service.ts` 73.17%；demo 的 language switcher 16.66%、playground
50.94%、poll 示例 6.25%。不要只新增“可以创建组件”测试来提高数量。

依赖审计本轮重新尝试：生产依赖 audit 在配置的镜像返回 HTTP 405；复制 manifest/lockfile 到隔离临时目录并指定官方 npm
registry 后，30 秒内无返回而终止。**审计仍不确定，未获得安全清除结论**，也不能将网络失败当成发现漏洞。详细状态保留在证据 JSON。

**验证边界**：本次没有核实线上部署、远程 CI、维护者审批或 npm 版本占用；没有做完整 SSR/hydration、读屏人工测试、性能基准或消费者迁移测试。依赖审计结果不能由单元测试推导。

## 3. 对 Cursor 文档的修正

| Cursor 结论                                                               | 当前核验                               | 应如何修正文档                                                                                                                                           |
| ------------------------------------------------------------------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| combineFrom / mergeFrom / computedAsync / resourceAsync 支持显式 Injector | 当前代码和测试已存在相关实现           | 保留，但写清 Injector 生命周期；不是脱离 Angular 的纯函数                                                                                                |
| computedAsync 用内部 value/error 状态维持错误恢复                         | 当前实现已采用该方式；流中错误转为事件 | 不再把它作为待做重构                                                                                                                                     |
| Observer `next` 中 throw 必然永久 teardown                                | 原因表述过于笼统                       | 区分 RxJS 通知回调异常、流的 error 通知、Angular effect 异常；以实际回归测试证明恢复                                                                     |
| distinctUntilChanged 保证 glitch-free                                     | **该保证不成立**                       | 它只去掉单个 source 连续相等值；combineLatest 仍可看到跨 source 的中间组合，尤其是 observable + signal 或多个分别适配的 signals                          |
| resourceAsync 是 Angular 原生 resource 的 drop-in precursor               | 未建立这种兼容保证                     | 它有自有状态、`execute`、`reactive`、并发和错误策略，必须逐项对照；不要承诺无成本替换                                                                    |
| 等待 Signal Forms，然后新增 controlValue/controlState                     | 已过时                                 | 当前 `form-signals.ts` 已有 controlValue、controlStatus、controlState、formState；还有 toSignalForm、bindIf、bindDisabled、toSubmitValue/formSubmitValue |
| resourceAsync 接下来增加 retry/polling                                    | 应先区分层次                           | 已有独立 poll / Kubernetes retry 和 QueryClient polling；明确各层职责再讨论扩展                                                                          |
| 测试 386 / 152 / 86                                                       | 已过时                                 | 用本轮 698 / 223 / 170，且单独报告覆盖率失败                                                                                                             |
| 引入 dsm-ui 的事务清理和领域 validators                                   | 未核实来源和可移植性                   | 本次没有审查 dsm-ui，不据粘贴文档认定代码已可复用；先做需求、来源及 API 契约评估                                                                         |
| 越多 console.log 越方便验证                                               | 对公共 demo 帮助有限                   | 用可见状态面板和可选 debug，避免用户必须开控制台                                                                                                         |

Angular 版本也要分清：项目运行 Angular 21；版本化 v21 文档将 resource 与 Signal
Forms 标为 experimental。当前官方 API 页标明 v22 起 stable，不应拿最新版官网的稳定承诺覆盖 v21 支持范围。[v21 resource](https://v21.angular.dev/api/core/resource)、[v21 form](https://v21.angular.dev/api/forms/signals/form)、[当前 form](https://angular.dev/api/forms/signals/form)。

## 4. 已有问题及处理方案

### Q01 · P1 · URL 校验误判【已复现】

位置：[url.util.ts](../../libs/ngx-lift/src/lib/utils/url.util.ts)、[const.ts](../../libs/ngx-lift/src/lib/const.ts)、[url.validator.ts](../../libs/ngx-lift/src/lib/validators/url.validator.ts)。`urlPattern/httpsPattern`
把域名后缀限为 1–6 个字符，并没有完整解析端口。

| 输入                         | 当前 isURL / isHttps | 内置 new URL |
| ---------------------------- | -------------------- | ------------ |
| `https://example.technology` | false / false        | 成功         |
| `https://[::1]/`             | false / false        | 成功         |
| `https://localhost:4200`     | false / false        | 成功         |
| `https://example.com:99999`  | true / true          | 抛 TypeError |

建议改为 URL 解析后检查 protocol、hostname 和明确的策略选项：是否允许 localhost、IP、credentials、相对路径、IDN。URL 可解析与业务允许访问是两种判断。至少修正长后缀与非法端口，公开 hostname 策略；补类型和迁移说明，因为原先被拒绝/接受的输入会改变。验收涵盖 IPv6、IDN、大小写、端口边界及业务拒绝规则。[WHATWG URL 标准](https://url.spec.whatwg.org/)。

### Q02 · P1 · 国际化不是完整覆盖【已复现 / 代码确认】

英文兜底字典缺 9 个使用中的唯一键，简体中文虽与英文键集一致，也没有覆盖这些缺键及字典外硬编码。其他语言覆盖率差异很大。具体名单、组件内置俄语缺失、格式和语言切换问题见第 5 节。验收不能只比较语言文件数量。

### Q03 · P1 · 覆盖率脚本与 CI 承诺不一致【已复现 / 代码确认】

三个 `vite.config.mts` 配置 75% 分支门槛，clr-lift 和 demo 当前失败。`.github/workflows/ci.yml` 明确使用
`--coverage=false`，因此 CI 的绿色不能证明覆盖率门已达成。`test:coverage` 在测试失败后，也不会继续运行展示摘要的 `&&`
后半段。

建议 CI 上传覆盖率，确保失败时也能展示报告。库保持风险导向门槛；demo 可经明确决策设定独立门槛，但不要悄悄降低数字来制造通过。`tools/vitest/show-coverage-summary.mjs`
缺报告时静默忽略、低于门槛只输出 warning，本身不是可靠 gate；注释中的 “Industry-standard
thresholds” 也没有通用标准依据，应改称项目策略。

### Q04 · P1 · 自定义 ESLint 规则静默失效，recommended 配置也无法消费【已复现】

位置：[eslint-plugin-label.mjs](../../tools/eslint-plugin/eslint-plugin-label.mjs)。有两个独立问题：

1. 包装器监听 `Element$1`，而当前安装的 Angular ESLint 21.4.0 上游规则监听 `Element`。用相同 Angular template parser
   lint `<label>Orphan</label>`，自定义规则返回零错误，上游规则报
   `A label component must be associated with a form element`；使用 demo 的实际 ESLint 配置也不报告 orphan
   label。这是当前质量规则失效，不能继续信任 lint 绿色代表 label 检查已完成。
2. `configs.recommended[].rules` 赋值为规则实现对象，ESLint 要求此处是规则 ID → severity/options。用
   `new ESLint({overrideConfigFile: true, overrideConfig: plugin.configs.recommended})` 加载后得到：

```text
Key "label-has-associated-control": Expected severity of "off", 0, "warn", 1, "error", or 2.
```

仓库根配置目前显式注册
`label/label-has-associated-control`，绕过了坏 preset，但不能解决 visitor 失效。修复 visitor 适配及 preset 的
`{'label/label-has-associated-control': 'error'}`；用 ESLint
RuleTester 验证根节点、Clarity 容器、嵌套模板和未关联 label，并在依赖升级时运行。父节点访问也应防御空值。

### Q05 · P1 · 工具文件来源说明与 MIT 项目声明冲突【代码确认】

同一个插件文件带有 `Broadcom Confidential` / `All Rights Reserved`
头部，并引用内部 GitHub 路径；仓库 manifest 声明 MIT。它是源码仓库中的工具，不等于已经打入 npm 库包。**本报告不据头部判定法律侵权**，但发布前需要确认文件来源及授权记录，或用公开上游 API 独立实现等价规则。不要仅删除头部就当作解决来源问题。

### Q06 · P1 · 生产 demo 首屏偏重【已复现 / 代码确认】

位置：[app.routes.ts](../../apps/demo/src/app/app.routes.ts)、[demo.l10n.ts](../../apps/demo/src/app/core/l10n/demo.l10n.ts)。所有演示页静态 import，11 个语言字典也一次加载。构建首屏 4.61
MB，预算 warning 5 MB / error 8 MB，能容纳当前较重结构。

建议改成路由级 `loadComponent`，语言字典按需加载，首页只保留导航和 quick
start。先记录 raw/gzip/brotli、冷启动导航和 LCP/INP，再逐步收紧预算；不要声称“拆入口后一定减少某个百分比”。Clarity
CSS、forge、highlight 和大量文档字符串应分别测量。

### Q07 · P1 · 公共 demo 的 API 表与实现漂移【代码确认】

例：[status-indicator-demo.component.ts](../../apps/demo/src/app/clr-lib/pages/status-indicator-demo/status-indicator-demo.component.ts)
宣称 `iconSize` 支持 number、默认 `'md'`，tooltipPosition 默认
`'tooltip-top-right'`；[实现](../../libs/clr-lift/src/lib/components/status-indicator/status-indicator.component.ts)
是 string、默认 `'sm'` 与 `'tooltip-bottom-right'`。这会直接误导复制使用。

建议 public API declaration
snapshot + 每项核心 API 的可编译最小消费示例；文档中的默认值、返回类型、错误状态、取消语义逐项核对。`ResourceStatus`
JSDoc 说 “extends ... with additional local”，也应按所支持 Angular 版本核对，避免把共同已有的状态描述为独有扩展。

### Q08 · P1 · computedAsync 默认错误值与泛型类型不一致【代码确认；兼容行为】

[computed-async.ts](../../libs/ngx-lift/src/lib/signals/computed-async.ts) 在无 `onError`、`throwOnError=false` 时返回
`state.error as T`。文档已明确这是兼容行为，不能当作新发现的回归；但消费者拿到 `Signal<number>`
后，实际失败值可能是 Error，静态类型不能保护调用方。

建议本轮强烈推荐提供 `onError` 或显式状态模型；下一次 major 增加 typed result
API 或改变默认错误契约，避免 Error 被当成数据。测试不仅验证恢复，还要验证消费者在失败路径上是否安全。不要在 patch 中直接改变旧行为。

### Q09 · P2 · FileReader 的 encoded 模式不能处理通用 Unicode【已复现原语 / 代码确认路径】

[file-reader.component.ts](../../libs/clr-lift/src/lib/components/file-reader/file-reader.component.ts) 先
`readAsText`，再直接 `btoa(value)`；`btoa('你好😀')` 抛
`InvalidCharacterError`。当前未编码模式已容错，不会因 Unicode 直接失败；encoded=true 仍失败。对任意二进制文件也没有字节保真保证。读失败向 form 写入一个空格的设计还应明确标注。

建议定义 text / binary 契约，使用 UTF-8
bytes 或 ArrayBuffer 做 base64，并提供严格反向解码。选择文件后先拒绝超限再读取；当前 maxSize 校验只标记错误，仍启动读取。验收中文/emoji、二进制 roundtrip、超限未读取、快速替换、销毁中止和 model-to-view 不回写。

### Q10 · P2 · dateRangeValidator 错误配置会静默放行【已复现】

[date-range.validator.ts](../../libs/ngx-lift/src/lib/validators/date-range.validator.ts)：合法 control value 配合
`{minDate: 'not-a-date'}`
或无效 maxDate，都返回 null，因为 NaN 比较为 false。建议在 factory 创建时校验边界日期及 min≤max，抛清晰配置错误；业务输入格式错误仍返回
`ValidationErrors`。同时明确 date-only 字符串、local timezone 和 timestamp 语义。

### Q11 · P2 · range 缺少有限值及容量契约【已复现 / 建议】

[range.util.ts](../../libs/ngx-lift/src/lib/utils/range.util.ts)：`range(0, Infinity, 1)` / `range(NaN)` 抛底层
`RangeError`；`range(0,3,0)` 返回
`[0,0,0]`。零 step 可能是有意的 lodash 兼容语义，不能未经决策改成错误。建议先明确 finite、零 step、反向 step、浮点及最大输出长度；对明显非法输入给稳定错误，防止异常大数组分配。

### Q12 · P2 · Tooltip 的静态提示与交互浮层语义混用【代码确认 / 待验证影响】

已经有 focus/blur、Escape、aria-describedby 及借用 ComponentRef 归还处理，应保留。问题是[模板](../../libs/clr-lift/src/lib/components/tooltip/tooltip.component.html)
在复杂内容分支使用 focus trap、关闭按钮，却仍
`role="tooltip"`。交互浮层应有独立 popover/dialog 行为契约，静态 tooltip 应让焦点留在 trigger；实际读屏影响需人工验证。

建议共享定位/内容生命周期实现，分开语义和交互 API，覆盖焦点恢复、Tab、Escape、多实例、滚动、RTL 和 viewport
collision。Tooltip APG 本身仍在讨论；WCAG
hover/focus 内容要求是更可靠的验收依据。[APG Tooltip](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/)、[WCAG 1.4.13](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html)。

### Q13 · P2 · Spinner 缺少独立的可访问加载语义【代码确认】

[spinner.component.html](../../libs/clr-lift/src/lib/components/spinner/spinner.component.html) 只有 CSS
div，没有 role、label 或状态公告能力。建议支持装饰模式和带本地化 label 的 `role="status"`
模式；由容器设置 aria-busy，避免每次动画或多个 spinner 重复公告。这是组件能力缺口，不等于所有调用页面都不合规。

### Q14 · P2 · Playground clipboard 拒绝路径未处理【代码确认】

[demo-playground.component.ts](../../apps/demo/src/app/shared/components/demo-playground/demo-playground.component.ts)
只处理 writeText 成功，没有 catch；复制失败无反馈，2 秒 timer 也没有 DestroyRef 清理。`navigator?.clipboard`
不能保护完全没有 navigator 全局的 SSR 调用路径。

建议检测浏览器环境，处理权限/非安全上下文失败，提供可选择源码的降级反馈；销毁清理 timer。源码与高亮 HTML 应分离，复制原文，不靠 DOM 反解析高亮字符串。补失败路径测试。

### Q15 · P2 · Tailwind 遗留与样式标准不一致【代码确认】

[code-block.component.html](../../apps/demo/src/app/shared/components/code-block/code-block.component.html) 仍有
`dark:bg-gray-950`、`dark:border-0`、`h-full`；项目文档已明确移除 Tailwind。建议清理无对应样式的 utility
classes，并针对浅色/深色、长代码行和窄屏做视觉验证，不重建另一套样式系统。

### Q16 · P1 · 发布与部署没有统一质量门【代码确认】

CI 没有独立 format/typecheck/coverage
job；E2E 只在定时或显式 dispatch 运行。publish 工作流重新 build/test，但未执行完整 lint/typecheck/coverage/tarball 消费检查；deploy-demo 独立于 CI，并可直接部署刚 push 的 main。不能因此认定已经发生坏发布，但这是流程缺口。

建议复用一个质量工作流，发布/部署与同 SHA 结果关联；关键交互 PR 至少跑 Chromium
smoke，发布前跑三浏览器和真实包消费。定义 summary job 的最终失败语义，不能仅依赖成功生成摘要。逐步加入 provenance /
trusted
publishing，同时核实具体 CLI 支持；无需为了写审计文档修改认证配置。[npm trusted publishing](https://docs.npmjs.com/trusted-publishers/)。

### Q17 · P2 · 工具链版本与 peer 范围过于宽松【代码确认】

实际 pnpm 11.7.0 与声明的 10.5.2 不一致，`devEngines.packageManager.onFail='ignore'`；`.npmrc` 还关闭 strict peer
checks。Angular peer `>=21`、Clarity `>=18`、RxJS `>=7.8.0` 表示允许未验证的未来 major；本地 Clarity
18.4 安装包自身 Angular peer 是 `^21.1.0 || 22`。

建议统一工具链，明确“支持并测试的版本”与“允许安装的范围”。CI 加最低/最高支持组合及严格 peer 安装的消费 fixture，再决定是否收窄 peer。不要因为数字不同就盲目全量升级或认定有漏洞。

### Q18 · P2 · 核心 API 模块面需要收口【代码确认 / 建议】

`signals/index.ts` 通过 export * 公开 `form-signals.ts` 中标作内部辅助的 `safeToSignal` /
`createControlEventStream`。`computedAsync` 使用 `@angular/core/primitives/signals`
的 createWatch，也应单独建立 Angular 版本兼容测试。root API 变得越大，维护和 SemVer 成本越高。

建议显式 export 列表、public API snapshot、stable/experimental/internal 分级。`clr-lift/services/index.ts` 还从生产 root
API 导出 MockTranslationService，适合评估迁往
`/testing`，并提升 mock 的字典行为，避免测试始终返回 TranslatedText 掩盖缺键。已公开的 symbol 不能突然删除；先弃用并在 major 迁移。函数式 validator 与
`UniqueValidator.unique()` 的类形式、文件命名差异是可统一的风格问题，优先保持旧调用可用。

### Q19 · P2 · format / validate 的工具覆盖不完整【已复现 / 代码确认】

`format:check` 的 glob 不含 js/mjs/cjs/yml；对 ESLint 插件单独执行 Prettier
check 实际失败，正常全仓 format:check 不会检查到它。`validate`
又会执行 format 和 lint:fix，具有写入行为，不适合当只读 CI 验证入口。建议区分 `validate` 与
`fix`，统一 formatter 扩展名范围，修改 YAML/工具代码时也检查格式。本次只格式化新增文档/JSON，没有替用户修复工具文件。

## 5. 国际化专项：具体漏掉了什么

### 5.1 字典键覆盖

统计方法：通过 TypeScript
transpile + 隔离执行读取静态 dictionary，按英语的 1398 个键比较。这里是**键存在率**，不代表翻译质量、可见页面覆盖率或译文经人工审校。

| 语言                                   | 已有键 | 缺少键 | 键存在率 |
| -------------------------------------- | -----: | -----: | -------: |
| en                                     |   1398 |      0 |     100% |
| zh-CN                                  |   1398 |      0 |     100% |
| zh-TW                                  |    778 |    620 |    55.7% |
| de                                     |    188 |   1210 |    13.4% |
| ru                                     |    178 |   1220 |    12.7% |
| es / fr / ja / ko / nl / pt-BR（各自） |    130 |   1268 |     9.3% |

8 个非中文语言在 `queryResource` 全缺 100 键、`mutateResource` 全缺 57 键、`resourceAsync` 全缺 84 键；`toSignalForm`
德语/俄语缺 79，其余六种缺 123。繁体中文新 query/mutation/form 字典已齐，但其他板块仍缺 620，说明增量翻译缺乏统一验收。

在现有同名键中，占位符 `{0}/{1}`
集合比对未发现不一致。相同英文值不自动等于漏翻译：技术名、selector 和品牌本来就可保留；需要人工审校。

### 5.2 英文兜底本身缺失的唯一键

静态扫描发现下列 9 键、10 个使用位置。提取覆盖 `literal | translate` 和
`.translate('literal')`，不完整覆盖动态拼接键及所有条件表达式，因此这是**已确认下限**。

| 键                                     | 位置                                                                     | 处理                                 |
| -------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------ |
| `statusIndicator.inputIconStatus`      | status-indicator-demo.component.ts:23                                    | 注册英语/简中及目标语言，核对 API 行 |
| `statusIndicator.inputIconSize`        | 同文件:29                                                                | 同上                                 |
| `statusIndicator.inputTooltip`         | 同文件:34                                                                | 同上                                 |
| `statusIndicator.inputTooltipPosition` | 同文件:40                                                                | 同上                                 |
| `tooltip.componentTypeExample`         | tooltip-demo.component.html:81                                           | 补标题/说明键                        |
| `common.save`                          | switch-map-with-async-state.component.html:33                            | 补通用按钮键                         |
| `idleDetection.configIdleDuration`     | utilities/idle-detection-demo.component.ts:62                            | 补配置说明键                         |
| `idleDetection.configTimeoutDuration`  | 同文件:67                                                                | 同上                                 |
| `common.submit`                        | if-validator.component.html:60；intersection-validator.component.html:58 | 补通用按钮键                         |

### 5.3 clr-lift 内置字典不一致

10 个组件字典中，各自已声明语言内部的键集齐全，但 **alerts / theme-toggle /
tooltip 没有 ru**；demo 语言选择器却提供俄语。因此这些库自带控制文案会回退英文。其他组件字典有俄语。建议建立统一 supportedLocales 和完整性检查；是否提供意大利语也统一产品声明，不必为了齐整而虚构已支持语言。

### 5.4 即使 en/zh-CN 键齐，仍存在硬编码

以下是人工确认的例子，未把品牌、代码名、状态枚举或样本 namespace 当作漏翻译：

- resource-async.component.html 大量英文说明，包括 read/mutation 选择、嵌套资源说明、`Not loaded`、API
  Reference；模板超过 900 行，需分块抽取。
- to-signal-form.component.html:320/322 的 `Master Password` / `Master password is required.`。
- user-datagrid.component.html:49/61–63 的 Refresh / First Name / Last Name / Email 等。
- clr-lift-home.component.html:67 的 Clarity setup 指引。
- language-switcher.component.html 的 `aria-label="Change Language"`，不能只翻译可见菜单而忽略读屏文案。

正则共找到 325 个 HTML 英文候选片段，其中包括技术名字和代码，不能把 325 全部报成缺陷数量。完整候选保留在 JSON，后续人工分类。

### 5.5 格式、脚本、运行时刷新还没统一

1. **格式不同步【代码确认】**：`app.config.ts` 固定
   `LOCALE_ID='en'`，只注册 en；TranslationService 切换文本语言不改变 DatePipe /
   ByteConverterPipe 的 locale。证书日期、首页日期和字节数格式可保持英语。建议 format
   API 显式接收响应式 locale；不要假定修改 DI 字符串会刷新已经构造的 pure pipe。
2. **语言标签不匹配【代码确认】**：ByteConverterPipe 单独用 case-sensitive 字典查找；`zh-cn`
   可回落 en，未与 TranslationService 的大小写/地区解析一致。
3. **简繁脚本回退【代码确认】**：TranslationService 对 `zh-Hant` 没有脚本级规则；demo 字典含 `zh`
   → 简中，所以可能显示简中。增加 canonical locale + script/region 映射，测试 zh-Hant、zh-HK、zh-TW、zh-Hans、zh-SG。
4. **document
   language【代码确认】**：index.html 固定 lang=en，语言切换器没有更新 documentElement.lang/dir。页面语言与读屏发音、RTL 是独立于翻译 pipe 的契约。
5. **字典加载不响应【代码确认】**：translations 是普通对象，加载字典没有 signal
   version；已缓存的 computed 描述不一定更新。对于未来 lazy locale load，必须有 dictionaryVersion / immutable reactive
   dictionary。
6. **切换后的描述【待验证风险】**：computed API 表会随语言信号更新；一次性 translate 得到的数组、wizard
   step、toast 文案不会自然重新计算。明确“当前页面立即切换”与“生成消息时快照”的区别，逐页做切换测试。
7. **复数与计时【建议】**：服务仅支持位置占位符，不支持 ICU
   plural/select；倒计时、证书 expiresIn 等需要复数和单位语义。Intl.DateTimeFormat/NumberFormat/PluralRules 与消息 adapter 分工，不通过英文串拼接实现。[ECMA-402](https://402.ecma-international.org/12.0/)。
8. **Clarity 自带文案【待验证风险】**：app.config 未看到 Clarity common
   strings 的语言适配；datagrid/pagination/close 等上游文案需独立检查，并通过上游公开服务切换，不能只维护 clr-lift 自己的 dictionary。
9. **错误消息与业务内容【建议】**：FileReader/证书底层 exception 原文、调用方传入 toast/action
   labels 不是组件能自动翻译的所有内容。提供稳定错误 code 和 message
   adapter，说明消费者责任，避免“所有字符串都自动翻译”的承诺。

建议验收：缺英文键直接失败；已承诺完整的语言缺键直接失败；部分语言显示明确完整度，而不是静默宣称全支持。浏览器依次测 en→zh-CN→zh-TW→de，保留当前页面状态，检查文本、API 描述、ARIA、日期和单位；再加入伪本地化、RTL、长字符串和 zh-Hant。注册/查找缺键日志按 key+locale 去重，开发严格模式可抛，生产走受控 fallback。

## 6. 架构边界与 API 一致性

建议保持下列分工，避免让每种工具都承载缓存、重试、状态和写入：

| 场景                      | 当前应优先选择              | 契约重点                                       |
| ------------------------- | --------------------------- | ---------------------------------------------- |
| 同步 signal 派生          | Angular computed            | 同步一致读取；无需 RxJS 适配                   |
| 异步派生且希望得到 signal | computedAsync               | 错误值策略、并发、initialValue、requireSync    |
| 组件局部异步读取          | resourceAsync               | params/loader 分离、取消、局部 set/reset、销毁 |
| 跨组件服务端状态          | queryResource + QueryClient | identity、freshness、GC、失效、共享 polling    |
| 显式写入                  | mutateResource              | 参数快照、并发、完成后的失效、失败语义         |
| 存量 Reactive Forms       | controlState / toSignalForm | emitEvent、动态控件、禁用、提交 sanitization   |
| Clarity 应用重复交互      | clr-lift                    | CVA、a11y、i18n、设计系统一致性                |

`resourceAsync` 当前是 880 行、toSignalForm 659 行、form-bindings
500 行，意味着生命周期和兼容逻辑已有显著维护成本；文件长不是独立 bug。只在更清晰的职责边界下拆：source
normalization、operation lifecycle、public facade、form binding
ownership。避免为了函数数目好看，拆成消费者必须理解的十几个浅模块。

需要建立全家族行为矩阵：初始 undefined/null、EMPTY、Observable 多次 next、complete、同步 throw、onError
throw、equal、读取错误、destroy、显式 Injector、PromiseLike、重入、取消语义。资源一侧区分“有值时刷新”与“失败后保留值”；表单一侧明确
`emitEvent:false` 的非自动同步限制。

### QueryClient 已做好的部分与剩余风险

当前代码已经有规范化 key、循环/非法值拒绝、请求 generation、成功时间、staleTime/gcTime、tag
index、共享最短 polling 间隔、observer 移除和可见性处理。这些应列为已有资产，不能照竞品 checklist 重复列为“待实现”。

待验证/产品契约问题：

- 相同 key 的 ensureEntry 会更新 loader，staleTime 取最小、gcTime 取最大、cancelOnNoObservers 取所有定义的交集。消费者必须知道这些合并规则；key 相同但 transport/auth 不同应被视为 key 建模错误，而非默默共享。
- observer 脱离后，历史定义可能继续影响 entry 选项；这是否符合期望需明确，建立 mount/unmount 多配置测试。
- tags 是 scoped relationships，**不自动给请求 key 加租户/用户隔离**。提供 query definition
  factory 范例，把 API/auth/tenant identity 放入 key，并演示 logout 清理。
- 目前 generic snapshot 的 T 由读取者指定，同 key 不同 T 静态上无法彻底保证一致。可评估 typed query definition / branded
  key。
- mutation 成功后 invalidateTags 若抛异常，会让 mutate Promise 表现为失败，即使服务端写成功；destroyed client、错误 tag
  mapper 等路径应测试并决定是否区分 write failure 与 post-success sync failure。
- 一个服务端成功写入不等于客户端 abort 能回滚；当前 mutateResource 的文档已明确这一点，应把同样契约放进 demo 的用户说明。

建议先加 diagnostics 和契约测试，不急于复制 TanStack 全部缓存机制、持久化或 optimistic
transaction 功能。[TanStack defaults](https://tanstack.com/query/latest/docs/framework/angular/guides/important-defaults)。

## 7. demo 是否简洁、高效、方便参考、consistent

**已有优点**：公共导航、API table、playground、state
inspector、浅深主题、11 语言选择器；query/mutation/企业表单有实际交互；文档标准明确了 overview / examples / API
reference 和 Clarity layout。开发者能看到比孤立代码片段更完整的行为。

**当前判断**：覆盖广，但核心长页面不够简洁；一致性机制存在，执行仍不完整。resource-async.component.ts
1170 行、HTML 超 900 行，computedAsync 示例数量多；实现、复制字符串、翻译字典同时维护，容易漂移。早上文档继续鼓励追加编号示例，会进一步放大这一成本。

建议每页采用固定阅读层次：

1. 什么时候用、什么时候直接用 Angular，以及稳定度/最低版本。
2. 20–40 行最小可复制例子，包括 imports/providers、初值和错误处理。
3. 一个主要交互 demo：预览、参数控件、状态面板、源码、reset。
4. 折叠高级场景：并发、取消、重试、生命周期、Injector；独立组件懒加载。
5. API reference：真实签名、默认值、返回类型、异常和销毁行为。
6. 常见陷阱、迁移、相关工具链接。

不要让新开发者先阅读完整企业集群创建流程才能理解 controlValue；同样也不要删除有价值的高级演示。将 quick
start 与完整 recipe 分开。

还应处理：

- **可复制性**：例子从真实可编译 source 派生，原始代码用于复制，高亮仅负责显示；不靠手工同步多个模板字符串。
- **确定性**：UserService 依赖 randomuser.me、RockStar 依赖 jsonplaceholder；公共网络失败会污染示例体验。默认使用本地 mock
  fixtures，HTTP 模式作为显式选项；E2E 对外部 API 做 route/mock，不把第三方可靠性当库正确性。
- **选择一致性**：toSignalForm 示例仍用 resourceAsync+lazy/exhaust 提交，项目又有专用 mutateResource。这个配置不是已确认会自动误提交的 bug；建议新用户的首选路径统一为 mutateResource，保留 resourceAsync.execute 的高级兼容说明。
- **浏览器友好**：导航搜索、分类、页面内 anchors、复制成功/失败、移动窄屏、刷新可保持链接；缺失路由用清晰 404，而非所有未知链接都返回库首页。
- **可观测性**：live state inspector 已存在，优先复用；debug 日志默认关闭，避免记录敏感表单值或完整响应。
- **性能**：路由懒加载、字典懒加载、延迟渲染高级 examples；保持 preview 展示核心功能即可。
- **可访问性**：代码 tab、折叠区域、copy 按钮、toast 公告和图标状态逐项键盘测试；自动 axe 扫描加人工读屏，不宣布自动扫描等于 WCAG 合规。

## 8. 成熟库对标：学习什么，避免重复建设什么

| 对标                                 | 值得学习                                         | 项目行动                                                      |
| ------------------------------------ | ------------------------------------------------ | ------------------------------------------------------------- |
| Angular 原生 resource / Signal Forms | 原生 read/cancel、显式版本状态、形式统一         | 做支持矩阵与 adapter spike；当前 21 API 与 22 API 分开        |
| ngxtension                           | 小接口、明确 source/Injector/requireSync 语义    | 建行为对照表和可编译例子；避免未经比较称为“超过竞品”          |
| TanStack Query                       | stale/GC、observer、共享请求、诊断与失效         | 强化 QueryClient 契约和 DevTools；先不照搬全部默认重试/持久化 |
| NgRx SignalStore                     | state / computed / methods 分工，可组合 features | 提供互操作 recipe；不让 ngx-lift 演变为完整客户端 store       |
| Angular CDK / Clarity                | overlay、焦点、表单、设计 token                  | 评估 tooltip 定位复用 CDK，保证现有借用内容 ownership         |
| APF / SemVer                         | 真实 exports、partial compilation、兼容版本      | tarball 消费测试、API diff、受测 peer matrix                  |
| WCAG / ECMA-402                      | 可验收的键盘/状态与本地化契约                    | a11y/i18n contract tests，文本与 locale 分层                  |

对标依据全部来自官方文档/源码，详见[研究附录](../research/ngx-lift-industry-reference-2026-10-12.zh-CN.md)。TanStack
Angular
adapter 当前官方 overview 仍声明 experimental；不能把它描述成完全稳定、无迁移风险的替代。[官方 overview](https://github.com/TanStack/query/blob/main/docs/framework/angular/overview.md)。

## 9. 值得引入的新内容

### 第一批：直接提高现有产品可靠性

- **i18n contract checker**：静态使用键、英语完整性、语言完整度、占位符、dictionary 注册；typed
  key 或 satisfies 约束；保留动态键显式 allowlist。
- **编译过的 examples 和 API snapshot**：从源文件生成展示代码，消费端用 package exports；验证示例随类型升级仍可用。
- **tarball consumer fixture**：最小外部 Angular 应用安装打包产物；检查 peer、typings、partial
  compilation、生产构建和一个 pipe/component/query；不依赖 workspace paths。
- **a11y E2E**：在已有 Playwright 上增加 axe 和关键键盘路径。先覆盖 tooltip/popover、file-reader、idle
  dialog、wizard、toast 和 code tabs。
- **query
  diagnostics**：observer 数、pending、最后成功时间、下次 polling/GC、tag 失效；开发模式 opt-in，脱敏且不强绑额外 UI 包。
- **兼容性 fixtures**：Zone/zoneless、真实 SSR/hydration、最低受支持 peer 组合；自有 async 工作如何处理 PendingTasks。[Angular zoneless](https://angular.dev/guide/zoneless)。

### 第二批：有测量或消费需求再引入

- Secondary entry points：优先评估
  `ngx-lift/forms`、`ngx-lift/query`、`clr-lift/certificate`、`clr-lift/testing`，再考虑更细的 signals/operators。现有 sideEffects=false 和 root
  barrel 并不意味着不能 tree shake；secondary entry
  point 主要改善模块/懒加载和可选依赖边界。用外部单 pipe 消费 bundle 对照证明收益。[APF](https://angular.dev/tools/libraries/angular-package-format)。
- Unicode/binary file utilities、duration/relative-time
  formatter：先统一 locale、单位和错误契约；ByteConverter 还应明确 1024 缩放却使用 KB/MB 的历史语义，是否提供 SI/IEC 选项。
- Typed query factory 与 NgRx adapter recipes：先验证多处应用有重复需求，再新增公开 symbol。
- Angular 22 迁移 spike：保留 Reactive Forms 桥接，比较 native Signal
  Forms 与企业动态控件场景；不要直接重写现有 21 支持链。

### 暂缓

事务 rollback engine、完整状态管理框架、全套企业网络 validators、无限查询/持久化/离线 mutation、第二套 UI design
system。只有真实使用场景、ownership 和长期维护者明确后才做。新 IP/CIDR/hostname/cron
validator 先评估成熟专用实现；不要继续以简单 regex 冒充完整行业协议支持。

## 10. 额外容易忽略的专业化问题

- **SSR 的声明与证据**：ThemeService 使用 DOCUMENT、QueryClient token 禁止服务端 background
  polling 是好的基础；并不覆盖所有浏览器全局、PendingTasks、hydration 文案差异和自定义 tooltip 渲染。
- **生命周期 ownership**：IdleDetectionService 是 root
  singleton，而 IdleDetectionComponent 销毁会 clearTimers。多个消费者同时存在是否互相干扰，需要用 mount/unmount 测试确定；设计 session
  owner 或显式实例 scope。
- **安全边界**：mask
  pipe 是显示脱敏，不是安全存储，短字符串默认原样显示；示例也不能把它当保证秘密不泄漏的机制。HTML 字符串通过 Angular
  sanitizer 的路径不直接报告成 XSS；要明确允许 HTML 的 API 范围并测试恶意输入。
- **证书能力**：现有 MD5/SHA1
  fingerprint 是兼容展示，不能推导为身份可信、chain/revocation 验证。可新增 SHA-256 展示，明确 certificateValidator 只是 PEM
  parse。当前 cert
  status 使用 Date.now 在 computed 内，不会仅随时间流逝自动重算；如承诺长时间打开的状态实时更新，应注入 clock 并测试过期边界。
- **SemVer**：isEmpty/isNotEmpty 类型收紧、combineFrom undefined、mergeFrom
  null 等消费端影响不能仅靠库内部测试发现。已有 MIGRATIONS 应与实际发布版本绑定；库版本不必为了与 Angular
  major 看齐而掩盖自己的破坏变更。
- **维护入口**：统一 README quick start、support matrix、changelog、deprecated API、security report
  channel、贡献流程；修复文档失效链接，根包/两库/demo 版本显示采用单一来源。
- **性能复杂度**：UniqueValidator 中 includes +
  array 收集在大数组可能变贵；isEqual 的 Set 深比对可能 O(n²)。用真实规模 profile 后优化；不要把输入规模很小的路径先重写。
- **日期契约**：differenceInDays 是 elapsed 24h 并 trunc，不是跨 DST 的 calendar-day
  difference；JSDoc 和 demo 的正负方向示例需要核对，提供明确示例，必要时拆出 calendarDayDifference。
- **审计可追溯**：每次结果记录 SHA、工具链、命令、退出码、未测范围；本报告不能变成长期自动显示“全绿”的静态 badge。

## 11. 执行路线图与完成条件

以下按工作包而非日历承诺排期；修复前先补能失败的行为测试，修复后执行受影响项目验证。建议尽量一次只改一个公共契约。

| 阶段              | 工作包                                                          | 建议 ownership                 | 完成条件                                          |
| ----------------- | --------------------------------------------------------------- | ------------------------------ | ------------------------------------------------- |
| A：先恢复可信基线 | Q01 URL、Q02 缺键、Q04 lint preset、Q07 API 漂移                | ngx utils / clr docs / tooling | 最小复现转回归；消费者文档与类型一致              |
| A：发布前处理     | Q05 文件来源、Q03 coverage、Q16 quality workflow                | maintainer / tooling           | 来源记录明确；质量门真实执行且失败可见            |
| B：国际化闭环     | 第 5 节 locale/script/ARIA、partial locale 策略                 | clr i18n / demo                | 完整语言缺键为零；切换 E2E；格式同步              |
| B：组件契约       | Q09 file、Q12 tooltip/popover、Q13 spinner、Q14 clipboard       | clr components / demo shell    | Unicode、超限、键盘、失败和销毁路径通过           |
| B：开发者体验     | Q06 lazy routes、Q15 styles、最小例子与 deterministic mocks     | demo                           | 首屏产物下降；无需外部 API 可演示；源码可复制运行 |
| C：产品架构       | typed errors、public exports、query definition/option semantics | ngx core                       | 明确稳定度、SemVer 和兼容迁移；契约测试齐         |
| C：消费信心       | tarball、peer matrix、Zone/zoneless、SSR/hydration              | release / integration          | 真实消费者路径有自动化证据                        |
| D：选择性扩展     | entry points、query diagnostics、22 adapter、Intl helpers       | 按需求确定                     | 有性能/需求收益，维护成本和退出策略明确           |

建议把每条转为 issue，字段为：证据等级、触发条件、受影响 API、目标行为、迁移影响、验收命令、负责人。不要用“优化架构”“提升专业度”这种无法验收的单条大任务替代。

完成标准：核心工具不仅有 happy
path，还覆盖失败/取消/销毁；公开 API 与编译示例同源；已承诺语言完整且格式一致；支持矩阵有真实消费测试；发布绑定同 SHA 的质量结果；性能改进有前后产物数据。这样能让下一轮新增功能建立在可信且易维护的基础上。

## 12. 证据附录与复现方式

已保留机器可读的[国际化缺键与候选文案](ngx-lift-i18n-inventory-2026-10-12.json)及[验证与探针摘要](ngx-lift-audit-evidence-2026-10-12.json)。完整日志本轮产生于
`/tmp/ngx-lift-quality-audit-{validation,e2e,coverage}.log`；它们是临时运行文件，不是长期仓库附件。

URL、range、dateRange 探针将当前 TS 源码 transpile 为 CommonJS 后执行，没有修改实现。Probe
JSON 中用描述字符串保存非有限输入，避免 JSON.stringify 把 Infinity/NaN 序列化为 null 引起误解。Unicode 项验证的是 btoa 原语加组件代码路径分析，没有声称新增独立组件端到端 roundtrip 已通过。

国际化重新核验应读取 `apps/demo/src/app/core/l10n/demo.l10n.*.ts`，以 en 为 baseline；扫描 literal
translate 使用，再对动态键、attributes 和字典外文案人工确认。更完整的 checker 应用 Angular template AST 和 TypeScript
AST，不能把本轮 regex 下限当最终覆盖率。

本次“审计完成”表示报告、验证和处理方案已交付，**不表示上述缺陷已经修复，也不表示项目获准发布**。
