# 全局质量审计修复说明

日期：2026-10-13（Asia/Shanghai）。分支：`fix/quality-audit-hardening`。起点为
`main@f8cb5b5`，原始审计及证据文档随分支保留。本文件记录实现与兼容决策，不将产品路线图或未完成的验证写成已交付功能。

## 本轮结果概览

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

---

## 逐项修复结果与边界（Q01–Q19 详述）

### Q01 · URL 校验与协议解析（P1）

- **审计问题与触发条件**：`urlPattern`/`httpsPattern` 原正则表达式将顶级域名（TLD）限制为 1–6 个字符，不支持长后缀（如
  `https://example.technology` 返回 false），无法解析 IPv6 格式的主机（如 `https://[::1]/`
  返回 false），且缺乏对端口数值有效性的校验（如 `https://example.com:99999` 返回 true，但在后续传给原生 `new URL()`
  时会抛出 `TypeError`）。
- **修复实现与变更**：
  - 在 `libs/ngx-lift/src/lib/utils/url.util.ts` 中实现基于 WHATWG 标准 `new URL` 的 `parseHttpUrl` 解析器；
  - 严格限制协议仅允许 `http:` 或 `https:`，校验 hostname 包含 `.` 或以 `[` 开头，且输入字符串不得含有未转义空白字符；
  - `isURL()` 和 `isHttps()` 重构为委托 `parseHttpUrl` 进行判断；
  - `libs/ngx-lift/src/lib/validators/url.validator.ts` 中的 `urlValidator` 与 `httpsValidator` 采用新的校验逻辑；
  - `libs/ngx-lift/src/lib/const.ts` 中保留 `urlPattern` 和 `httpsPattern` 正则常量导出以维持现有调用方的 API 符号兼容。
- **边界与兼容决策**：
  - **保留拒绝单标签主机的旧契约**：对于 `https://example` 或 `http://localhost:4200`
    等无点号且非 IPv6 的单标签主机，保持返回 `false`，以防与既有依赖该严格格式的表单校验产生行为冲突；
  - **语法有效性与网络可达策略分层**：URL 校验仅负责语法合规（WHATWG 标准），不假定业务访问策略（如私网 IP 拦截、域名白名单等应在业务层自行处理）；
  - **表单空值兼容**：空字符串或空控制值在 Validator 中返回 `null`，遵循 Angular 响应式表单常规契约，必填约束由
    `Validators.required` 负责。
- **验证证据**：`libs/ngx-lift/src/lib/utils/url.util.spec.ts` 补充长域名、IDN（如
  `https://例子.中国`）、IPv6、非法端口（`:99999`）、畸形协议（`https:/`）、非字符串输入的回归测试；`url.validator.spec.ts`
  4 项单测全部通过。
- **后续边界**：可配置的主机名解析策略（如显式允许 localhost 或局域网名称）留待后续作为参数化特性引入。

### Q02 · 国际化契约、响应式与质量门（P1）

- **审计问题与触发条件**：
  - 英文基线字典缺失 9 个实际在模板与组件中使用的唯一键，导致运行时退化为显示缺失占位符；
  - `clr-lift` 内置组件字典中，`alerts`、`theme-toggle`、`tooltip`
    缺少俄语（ru），而 demo 语言选择器提供俄语，导致控制文案回退为英文；
  - `TranslationService` 内部字典为普通对象，异步加载新字典后无法通知依赖此字典的 `computed` 和模板更新；
  - 缺少对 `zh-Hant`、`zh-HK` 等繁体脚本的规范回退逻辑；
  - 语言切换未同步修改 `document.documentElement` 的 `lang` 和 `dir` 属性；
  - 单元测试运行过程中缺失键日志重复输出达到 21,805 行，形成日志风暴；
  - `ByteConverterPipe` 固定使用构造注入时的 `LOCALE_ID`，无法响应语言动态切换。
- **修复实现与变更**：
  - 补齐英文（`demo.l10n.en.ts`）与简体中文（`demo.l10n.zh-cn.ts`）中缺失的全部 9 个键（包括
    `statusIndicator.*`、`tooltip.componentTypeExample`、`common.save`、`common.submit`、`idleDetection.*`）；
  - `libs/clr-lift/src/lib/components/` 下所有 `.l10n.ts` 补齐俄语（ru）翻译，实现 11 种企业语言无缺漏；
  - `TranslationService` 引入 `dictionaryVersion = signal(0)`
    响应式版本号，每次加载新字典即递增版本，`translateWithLanguage` 读取此 Signal 建立依赖；
  - 引入 `canonicalLocale` 与 `chineseLocale` 纯函数，精准识别 `zh-Hant` / `zh-TW` / `zh-HK` / `zh-MO` 映射到 `zh-TW`
    字典，`zh-Hans` / `zh-CN` / `zh-SG` 映射到 `zh-CN` 字典；
  - `TranslationService` 构造函数中使用 `effect` 监听 `locale()`，自动设置 `html[lang]` 与
    `html[dir]`（支持阿拉伯语、希伯来语等 RTL 识别）；
  - 引入 `warnings = new Set<string>()` 与 `warnOnce`，同一字典周期内每个缺失键和语言仅记录一次警告；
  - `ByteConverterPipe.transform` 增加可选 `locale` 形参，并内置完整的 11 种语言单位翻译（补全俄语等），使用
    `Intl.NumberFormat` 格式化；
  - 创建独立校验脚本 `tools/i18n/check-translations.mjs`，利用 Angular 编译器模板 AST 与 TypeScript AST 静态扫描所有
    `| translate` 与 `.translate()` 调用，与基准字典双向校验。
- **边界与兼容决策**：
  - **非核心语言部分翻译策略**：德、西、法、日、韩、荷、葡、俄等 8 种语言在 demo 导航菜单中以 `*`
    标识为部分支持，保留英文兜底可用性，不虚构未人工审校的机器翻译；
  - **原型安全**：内部字典初始化使用 `Object.create(null)`，杜绝 `__proto__` 原型污染风险。
- **验证证据**：`node tools/i18n/check-translations.mjs` 执行零错误；`tools/i18n/check-translations.test.mjs`
  4 项工具测试通过；`apps/demo-e2e/src/i18n.spec.ts` 跨语言切换与 DOM 属性验证通过。
- **后续边界**：**其他语言完整翻译仍列为后续工作**；Clarity 上游公共字符串（common
  strings）与 ICU 复数规则接入留作独立专项。

### Q03 · 覆盖率门槛与 CI 报告机制（P1）

- **审计问题与触发条件**：`vite.config.mts` 声明 75% 分支覆盖率门槛，但审计时 clr-lift (73.58%) 和 demo
  (58.27%) 低于门槛；旧脚本在测试失败时不执行 `&&` 后续的摘要输出；`.github/workflows/ci.yml` 显式设置
  `--coverage=false` 规避门禁；覆盖率摘要脚本在缺失报告时静默通过。
- **修复实现与变更**：
  - 维持 75% 分支覆盖率门槛不妥协，为
    `tooltip.directive.ts`、`file-reader.component.ts`、`spinner.component.ts`、`translation.service.ts`、`demo-playground.component.ts`、`language-switcher.component.ts`
    等关键逻辑补充深层行为测试；
  - 改造 `tools/vitest/run-coverage.mjs`，执行前强制清理旧 `coverage` 目录，无论单测退出码如何均保证运行
    `show-coverage-summary.mjs`，并保留测试或门槛检查的失败退出码；
  - `show-coverage-summary.mjs` 严格判断覆盖率报告是否存在，缺失或低于门槛时均强制将 `process.exitCode` 置为 1；
  - 在 `.github/workflows/quality.yml` 中执行全量验证，并通过 `if: always()`
    确保即使测试失败也能上传覆盖率报告 Artifact。
- **边界与兼容决策**：覆盖率测试聚焦业务行为、状态分支与异常恢复，坚决拒绝编写无断言的浅层“组件可实例化”用例。
- **验证证据**：`pnpm run test:coverage`
  执行后，ngx-lift 分支覆盖率达到 90.60%，clr-lift 达到 77.04%，demo 达到 75.47%，全项目行覆盖率均在 90% 以上。
- **后续边界**：后续可根据业务演进，针对关键底层核心模块单独设置更高的覆盖率策略（如 80%+）。

### Q04 · 自定义 ESLint 规则与 recommended 配置（P1）

- **审计问题与触发条件**：`tools/eslint-plugin/eslint-plugin-label.mjs` 监听 AST 选择器为
  `Element$1`，与当前安装的 Angular ESLint 21.4.0（使用 `Element`）不匹配，导致规则 visitor 静默不触发，orphan
  label 无法被检测；`plugin.configs.recommended` 将规则实现对象直接赋给 rules，导致标准 ESLint 消费时抛出格式配置错误。
- **修复实现与变更**：
  - 将 selector 修正为标准的 `Element`，对孤立 `<label>` 恢复报错；
  - 正确拦截 Clarity 的表单容器模式（如父级为 `clr-*-container` 或 `clr-*-wrapper`
    且内部包含合法的表单控件），对此类模式进行豁免；
  - 将 `plugin.configs.recommended` 规则配置格式修正为合法的 `{'label/label-has-associated-control': 'error'}`；
  - 增加测试套件
    `tools/eslint-plugin/label.test.mjs`，使用 ESLint 编程式 API 验证孤立 label 报错、Clarity 容器正常豁免、`for`
    属性关联以及 `@if` 嵌套控制流下的关联行为。
- **边界与兼容决策**：规则适配器完全基于公开的上游 Angular
  ESLint 规则元数据（`meta`）和 visitor 映射构建，不依赖内部私有路径。
- **验证证据**：`tools/eslint-plugin/label.test.mjs` 3 项测试全部通过；`pnpm run lint`
  在全项目 4 个工程（含 demo-e2e）中零警告通过。
- **后续边界**：随 Angular ESLint 后续 major 版本升级保持 visitor 签名同步回归。

### Q05 · 工具代码来源与开源协议合规（P1）

- **审计问题与触发条件**：`tools/eslint-plugin/eslint-plugin-label.mjs` 原有头部带有公司内部机密版权头（Broadcom
  Confidential / All Rights Reserved），并引用内部私有路径，与根目录 MIT LICENSE 及开源定位直接冲突。
- **修复实现与变更**：
  - 彻底替换该文件实现，去除内部版权头和私有路径引用；
  - 使用公开的 `@angular-eslint/eslint-plugin-template` 模块和通用 AST 遍历逻辑独立重写规则逻辑；
  - 声明符合 MIT 规范的开源项目文件说明。
- **边界与兼容决策**：重构实现保持逻辑自研与清晰透明，杜绝将任何企业私有专有实现混入公开源码。
- **验证证据**：代码审查与开源协议合规复核通过，文件头部合规规范。
- **后续边界**：维护者对后续新增工具与依赖保持协议复查。

### Q06 · 生产 Demo 首屏产物与按需加载（P1）

- **审计问题与触发条件**：`apps/demo/src/app/app.routes.ts` 中超过 30 个演示路由全部使用静态 `import`；`demo.l10n.ts`
  将 11 个语言字典在应用启动时同步打入初始 bundle；导致生产首屏高达 4.61 MB（预估传输 883.32 kB），构建预算被动放宽到 5
  MB / 8 MB。
- **修复实现与变更**：
  - `app.routes.ts` 中所有功能路由全面改为 `loadComponent: () => import(...)` 懒加载；
  - 实现 `demo-language-loader.ts`，首屏仅同步加载 `en` 字典，其余 10 种语言均在用户切换语言时通过动态 `import()`
    按需加载；
  - 在 `apps/demo/project.json` 中将构建预算严格收紧至：警告 3.5 MB、错误 4 MB。
- **边界与兼容决策**：保持各功能页面的完整演示与高级交互，不通过删减功能代码来虚构性能提升；首屏只包含核心外壳和基础引导。
- **验证证据**：生产构建 `nx build demo --configuration=production` 初始 bundle raw size 由 4.61 MB 降至 3.20
  MB（体积减少 30.6%），估算传输体积由 883.32 kB 降至 637.16 kB，完全符合收紧后的构建预算。
- **后续边界**：对于代码高亮工具（highlight.js）和证书操作依赖（node-forge）的按需懒加载可在后续持续优化。

### Q07 · 公共 API 文档与实现漂移对齐（P1）

- **审计问题与触发条件**：`StatusIndicatorDemo` 文档表格声称 `iconSize` 默认为 `'md'` 且支持 number、`tooltipPosition`
  默认为 `'tooltip-top-right'`，而组件源码实现默认为 `'sm'` 与 `'tooltip-bottom-right'`；`FileReaderDemo`
  属性表为写死的静态字符串，缺少 `textEncoding` 选项说明；`SpinnerDemo` 文档缺少新增的 `decorative`、`label`、`class`
  属性。
- **修复实现与变更**：
  - 修正 `StatusIndicatorDemoComponent` 中的类型定义与默认值，与 `StatusIndicatorComponent` 实现严格对齐；
  - 将 `StatusIndicatorDemo`、`FileReaderDemo`、`SpinnerDemo` 中的 API 属性表重构成响应式的
    `computed<ApiProperty[]>`，接入 `TranslationService` 动态国际化；
  - `FileReader` 属性表补充 `textEncoding`（可选 `'utf-8' | 'latin1'`，默认 `'utf-8'`）与文本编码边界说明；
  - `Spinner` 属性表同步更新 `decorative`（boolean，默认 true）、`label`（string）、`class`（string）及样式透传说明。
- **边界与兼容决策**：API 文档坚决以库的真实 TypeScript 类型和组件输入契约为准，不允许在文档中臆造未实现的功能。
- **验证证据**：API 演示表格单测全部通过；语言切换时 API 属性描述实时翻译更新。
- **后续边界**：后续可探索使用 API Extractor 自动生成 API 属性定义。

### Q08 · computedAsync 默认错误值与泛型契约（P1 / 兼容处理）

- **审计问题与触发条件**：在未配置 `onError` 且 `throwOnError: false`（默认状态）时，`computedAsync` 在异步操作失败后将
  `state.error` 强制断言为 `T` 写入 Signal。这虽然允许 Signal 在后续操作中恢复，但导致消费者拿到的 `Signal<T>`
  实际读取值可能是 `Error` 对象，静态类型无法保护调用方。
- **修复实现与变更**：
  - **维持现有运行时的兼容契约**：不在本次补丁/次版本修复中静默修改默认错误表现，以防破坏依赖既有恢复行为的存量代码；
  - 在 JSDoc、参数类型注释和 `docs/MIGRATIONS.md` 中增加显著指引，强烈推荐调用方显式提供 `onError: (error) => fallback`
    或指定 `throwOnError: true`；
  - 推荐需要明确 `idle / loading / error / value` 状态管理的业务直接使用 `resourceAsync`；
  - `computed-async.spec.ts` 补充针对错误捕获、恢复及显式错误处理选项的测试覆盖。
- **边界与兼容决策**：**不进行未协商的破坏性变更**。将默认返回 `Result<T, E>`
  或修改默认错误值契约的方案列入后续独立的 major 版本规划中。
- **验证证据**：`computed-async.spec.ts`
  51 项测试全部通过，覆盖各种并发模式（switch/merge/concat/exhaust）及错误恢复路径。
- **后续边界**：**基于 typed-result 的 major API 重构明确列为后续工作**。

### Q09 · FileReader 编码模式、Unicode 与容量控制（P2）

- **审计问题与触发条件**：`file-reader.component.ts` 在 `encoded=true` 模式下直接执行
  `btoa(value)`，在遇到中文字符或 emoji 时抛出 `InvalidCharacterError`；当文件大小超过 `maxSize`
  时，组件仅设置校验错误，仍会启动 FileReader 将大文件读入内存；读取失败时向表单控件写入单空格 `' '` 缺乏明确说明。
- **修复实现与变更**：
  - 增加 `textEncoding = input<'utf-8' | 'latin1'>('utf-8')` 输入属性；在 base64 编码路径使用 `TextEncoder`
    规范编码为 UTF-8 字节串再进行 base64 转换；提供 `'latin1'` 选项以兼容旧有单字节编码；
  - `writeValue` 在反向解码 base64 字符串时使用 `TextDecoder('utf-8', {fatal: true})`；
  - 文件选择事件中，若 `sizeInvalid()`
    成立，直接清空内容、触发表单校验变更，**立即 return 终止，不再调用 FileReader**，有效防御超大文件内存溢出；
  - 注入 `DestroyRef`，在组件销毁或用户重新选择文件时主动调用 `activeReader.abort()` 并解绑监听器；
  - 明确标注读取错误时写入单空格是为了与 required 验证器进行状态区分，同时清空旧数据并设置 `parseError`。
- **边界与兼容决策**：明确组件定位为**文本文件读取控件**，不承诺任意复杂二进制文件（如可执行程序、压缩包）的字节级保真；需要二进制流的应用应使用专用二进制上传组件。
- **验证证据**：`file-reader.component.spec.ts` 44 项测试全部通过，包含中文/emoji
  roundtrip、Latin-1 兼容、大文件拦截未读取、读取取消与销毁清理；Playwright E2E 3 浏览器全部通过。
- **后续边界**：复杂二进制文件的流式读取工具可根据后续业务需求评估。

### Q10 · dateRangeValidator 边界配置与校验契约（P2）

- **审计问题与触发条件**：当配置项传入非法日期（如 `{minDate: 'invalid-date'}`）或
  `minDate > maxDate`（倒置区间）时，由于 JavaScript 中 `NaN` 比较始终返回
  `false`，校验器会静默放行所有业务输入，造成校验失效。
- **修复实现与变更**：
  - 在 validator 工厂初始化阶段引入 `parseBoundary` 工具函数，解析 `minDate` 与 `maxDate`，若为非法日期立即抛出
    `TypeError`；
  - 依据 `compareTime` 选项（自然日比较或时间戳比较）比对两个边界，若 `minDate > maxDate` 立即抛出
    `RangeError('minDate must not be after maxDate.')`；
  - 业务输入（control value）若无法解析为合法日期，返回 `{invalidDate: true}`；空值返回 `null`（交由
    `Validators.required` 负责）。
- **边界与兼容决策**：配置错误（开发者代码错误）采取**快速失败（Fail-Fast）**抛错策略；用户输入的业务数据错误则返回标准的 Angular
  `ValidationErrors` 对象。
- **验证证据**：`date-range.validator.spec.ts`
  18 项单测全部通过，包含边界类型异常、区间倒置异常、inclusive/exclusive 及时间敏感性全量覆盖。
- **后续边界**：无。

### Q11 · range 工具函数有限值与容量安全（P2）

- **审计问题与触发条件**：传入 `Infinity`、`-Infinity` 或 `NaN` 会导致底层 `RangeError: Invalid array length`
  或进程挂起；传入巨大跨度可能触发超大内存分配；步长为 0 的行为未形成明确契约。
- **修复实现与变更**：
  - 严格校验 `start`、`end`、`step` 必须全部为有限数值（`Number.isFinite`），否则抛出明确的 `RangeError`；
  - 计算目标长度，若长度不是有限数或超过 1,000,000，抛出
    `RangeError('range cannot allocate more than 1,000,000 elements.')`；
  - 保留 `step === 0` 时重复 start 值的历史兼容契约（与 lodash 行为一致）。
- **边界与兼容决策**：将最大分配数组长度硬性限制在 100 万个元素内，防御内存耗尽攻击；保持零步长的既有语义兼容。
- **验证证据**：`range.util.spec.ts`
  10 项单测全部通过，覆盖有限数校验、零步长、负数步长、超限拦截及从右迭代（`fromRight`）。
- **后续边界**：对于超大规模序列，未来可评估提供基于 Generator 的惰性迭代器。

### Q12 · cllTooltip 静态提示与交互浮层语义分立（P2）

- **审计问题与触发条件**：`tooltip.directive.ts` 与 `tooltip.component.html`
  对纯文本提示和复杂交互内容（包含 Tab 焦点陷阱、关闭按钮）均使用
  `role="tooltip"`，违反 WAI-ARIA 规范（静态 tooltip 焦点应停留在宿主按钮，交互内容应为 dialog 或 popover）；缺少正确的无障碍属性绑定、Escape 键关闭与焦点恢复。
- **修复实现与变更**：
  - **角色与关系分离**：纯文本内容赋予 `role="tooltip"` 并设置 `aria-describedby`；交互型内容（TemplateRef /
    ComponentRef）赋予 `role="dialog"` 并设置 `aria-controls`；
  - 交互浮层打开时自动标记宿主元素 `aria-haspopup="dialog"` 与
    `aria-expanded="true"`；关闭时完整恢复宿主原有的对应属性；
  - 增加 `cllTooltipLabel` 输入属性作为交互对话框的无障碍名称（`aria-label`）；
  - 生命周期加固：监听 Escape 键关闭浮层并自动将焦点归还给触发器元素；滚动与尺寸调整时动态重新计算或安全关闭；
  - 浮层销毁时安全释放外部借用的 ComponentRef 视图节点（`releaseContent`），防止内存泄漏。
- **边界与兼容决策**：对外保持统一的 `cllTooltip` 指令名称不变，通过内容类型在内部自动适配语义角色，降低使用者迁移负担。
- **验证证据**：`tooltip.directive.spec.ts` 覆盖 ARIA 属性生成、属性恢复与生命周期；`apps/demo-e2e/src/tooltip.spec.ts`
  在 3 浏览器中验证键盘 Escape 关闭、焦点恢复及 DOM 属性断言。
- **后续边界**：未来可探索在底层引入 Angular CDK Overlay 进一步强化层叠上下文与定位策略。

### Q13 · cll-spinner 可访问加载语义与样式传递（P2）

- **审计问题与触发条件**：`spinner.component.html` 原仅为一个纯 CSS 的
  `<div>`，缺少无障碍角色、辅助技术公告以及可配置的文本标签；传递给组件的 `class`
  属性无法生效传递给内部真实的 spinner 元素。
- **修复实现与变更**：
  - 增加 `decorative = input(true, {transform: booleanAttribute})`；默认为装饰性（`role=null`, `aria-hidden="true"`）；
  - 提供 `[decorative]="false"` 选项：此时自动设置 `role="status"` 并应用 `aria-label`；
  - 增加 `label = input('')` 输入属性；未提供时自动回退为组件内置的多语言提示（`cll-spinner.loading`）；
  - 修复 `class = input('')`，将其合并至 `cssClasses` 计算属性中，确保外部传递的样式类能够正确渲染到视图上。
- **边界与兼容决策**：默认保持 `decorative: true`，防止内嵌在按钮或已包裹 `aria-busy` 的容器中时造成读屏器重复播报。
- **验证证据**：`spinner.component.spec.ts` 33 项单测全部通过；demo 页面提供装饰性与状态性双重示例。
- **后续边界**：更高级的语音即时播报（LiveAnnouncer）由消费方按需组织。

### Q14 · Demo Playground 剪贴板异常处理与销毁生命周期（P2）

- **审计问题与触发条件**：`demo-playground.component.ts` 的 `copyCurrentCode()` 仅编写了 `writeText` 成功回调，缺少
  `.catch()`
  处理；在用户拒绝剪贴板权限或非安全上下文（HTTP）环境下无任何响应；2 秒重置定时器在组件销毁时未清理，且未防御 SSR 场景下
  `navigator` 未定义的错误。
- **修复实现与变更**：
  - SSR 防护：检查 `typeof navigator === 'undefined'`，未定义时安全跳过并置 `copyFailed` 状态；
  - 异常捕获：添加 `.catch()`，失败时将 `copyFailed` 信号置为 true，通知界面显示复制失败提示；
  - 资源清理：利用 `DestroyRef` 在组件销毁时调用 `clearTimeout` 清除定时器；
  - 竞态防护：引入 `copyVersion` 版本号，防止连续点击导致前一次的定时器覆盖后续状态；
  - 复制原文：直接复制原始未高亮的代码字符串，仅在极端降级下才通过 DOM 解析纯文本。
- **边界与兼容决策**：提供直观轻量的反馈机制，不引入沉重外部剪贴板依赖。
- **验证证据**：`demo-playground.component.spec.ts` 补充针对拒绝权限、SSR 环境、定时器销毁清理的完整测试。
- **后续边界**：无。

### Q15 · 样式一致性与 Tailwind 遗留清理（P2）

- **审计问题与触发条件**：`code-block.component.html` 中残留 `dark:bg-gray-950`、`dark:border-0`、`h-full`
  等 Tailwind 遗留类名，违反项目关于全面拥抱 Clarity Design System、彻底移除 Tailwind 的规范；Spinner
  demo 的自定义 class 示例缺乏全局样式支撑。
- **修复实现与变更**：
  - 清理 `code-block.component.html` 中的无用 Tailwind 类名；
  - 在 `apps/demo/src/styles.scss` 中补充统一的 Clarity 浅色/深色主题下的 code block、preview box、layout 样式以及
    `.demo-spinner-space` 全局辅助类；
  - 严格使用 Clarity CSS 变量规范（`--clr-global-app-background` 等），杜绝硬编码颜色值。
- **边界与兼容决策**：仅清理确认失效的 Tailwind 残留类，不盲目剔除通用布局 class。
- **验证证据**：浅色/深色模式在 3 浏览器 E2E 中视觉与结构均正常展示。
- **后续边界**：维持对 Clarity tokens 的单一遵循。

### Q16 · 统一 CI/发布/部署质量门（P1）

- **审计问题与触发条件**：CI 工作流未执行 coverage 校验；E2E 仅在定时或手动调度时运行；publish 工作流缺少类型与覆盖率门禁；deploy-demo 独立且未绑定前置质量门。
- **修复实现与变更**：
  - 创建集中复用的质量门工作流 `.github/workflows/quality.yml`，统一执行 `pnpm run validate` 与 Playwright
    3 浏览器 E2E 测试；
  - CI（`ci.yml`）、发布（`publish.yml`）、Demo 部署（`deploy-demo.yml`）统一调用
    `quality.yml`，任何门禁失败立即阻断发布或部署；
  - 配置 `if: always()` 自动上传覆盖率与 E2E 测试报告 Artifact，确保排查证据长期留存。
- **边界与兼容决策**：质量工作流完全基于本地命令构建（`pnpm run validate` + `pnpm run e2e`），任何开发者本地可完全复现。
- **验证证据**：本地全流程验证退出码为 0；三浏览器 E2E 99 项全部通过。
- **后续边界**：远程分支保护策略中若有固定 Job 名称，需维护者同步核对。

### Q17 · 工具链声明与 Peer 依赖版本收口（P2）

- **审计问题与触发条件**：`package.json` 声明 `pnpm@10.5.2` 与实际安装环境 `11.7.0` 不一致，且带有
  `onFail: ignore`；两个库的 `peerDependencies` 对 Angular/Clarity/RxJS 使用宽松的 `>=`，允许未经测试的未来 major 版本。
- **修复实现与变更**：
  - `package.json` 统一声明 `"packageManager": "pnpm@11.7.0"`，并清理冲突的 `devEngines` 配置；
  - `libs/ngx-lift/package.json` 将 peerDependencies 严格限定在受支持 major：`@angular/*`: `>=21 <22`, `rxjs`:
    `>=7.8.0 <8`；
  - `libs/clr-lift/package.json` 将 peerDependencies 严格限定在：`@angular/*`: `>=21 <22`, `@clr/angular`: `>=18 <19`,
    `rxjs`: `>=7.8.0 <8`, `node-forge`: `>=1.3.0 <2`, `ngx-lift`: `>=21 <22`。
- **边界与兼容决策**：收窄 peerDependencies 是为了向消费者提供真实的兼容性保证；支持未来 Angular 22 / Clarity
  19 需在经过完整回归测试后发布新版本。
- **验证证据**：本地 pnpm 11.7.0 与 package.json 声明完全一致；`verify-packages.mjs` 打包验证通过。
- **后续边界**：Angular 22 与 Clarity 19 的支持矩阵扩展列为后续工作。

### Q18 · 核心 API 导出面收口与弃用标记（P2）

- **审计问题与触发条件**：`signals/index.ts` 导出了内部辅助函数 `createControlEventStream` 和 `safeToSignal`；`clr-lift`
  根入口导出了测试用的 `MockTranslationService`，容易被消费者在生产代码中误用。
- **修复实现与变更**：
  - 为 `createControlEventStream` 和 `safeToSignal` 增加 `@deprecated` JSDoc 说明，引导优先使用
    `controlState`、`formState` 或 `toSignalForm`；
  - 为 `MockTranslationService` 增加 `@deprecated` JSDoc 说明，提示应在测试中使用真实的 `TranslationService`
    配合 fixture 字典。
- **边界与兼容决策**：**不突然删除已有公开导出的 public
  symbol**，保证当前小版本的平滑向下兼容，计划在后续 major 版本中迁移至专用 secondary entry points（如 `/testing`）。
- **验证证据**：TypeScript 编译零错误；IDE 和生成的类型定义中包含清晰的废弃警告。
- **后续边界**：Secondary entry points 架构拆分列为后续独立重构。

### Q19 · Format 与 Validate 检查一致性（P2）

- **审计问题与触发条件**：`format:check` glob 遗漏了 js/mjs/cjs/yml，导致工具脚本与工作流文件未受格式约束；`validate`
  脚本原本包含写入操作（`format` 和 `lint:fix`），破坏了 CI 只读验证的契约。
- **修复实现与变更**：
  - 将 `format` 与 `format:check`
    的 glob 扩展为全格式覆盖：`"**/*.{ts,tsx,js,mjs,cjs,json,css,scss,md,html,yml,yaml}"`；
  - `validate`
    脚本重构为纯只读检查链：`pnpm run format:check && pnpm run test:tools && pnpm run i18n:check && pnpm run lint && pnpm run typecheck && pnpm run test:coverage && pnpm run build && pnpm run verify:packages`；
  - 增加专用的 `fix` 脚本执行写入：`pnpm run format && pnpm run lint:fix`。
- **边界与兼容决策**：格式检查范围明确排除 pnpm 管理的 `pnpm-lock.yaml`，防止工具冲突。
- **验证证据**：`pnpm run format:check` 检查通过，全仓代码遵循统一的 Prettier 风格。
- **后续边界**：无。

---

## 补充加固项（Kubernetes 重试与 DSM 消费者契约）

### Kubernetes 429 退避重试与拦截器加固

在质量审计基础上，针对企业集群 API 限流重试场景进行了全面加固：

1. **HTTP 方法安全白名单**：
   - 默认仅对幂等安全方法（`GET`, `HEAD`, `OPTIONS`, `PUT`, `DELETE`）进行自动 429 重试；
   - 对 `POST` / `PATCH` 写入操作，**默认不自动重试**；必须由调用方显式配置 `retryMethods`
     并确认端点具备幂等性或能够在写入执行前安全拦截。响应体中带有 `kind: Status`
     仅代表响应格式，无法证明写操作没有副作用。
2. **延迟与退避预算控制**：
   - 支持指数退避以及 `equal`（默认，避免立即重试）、`full`、`none`（确定性等待）三种抖动策略；
   - 增加 `minDelayMs`（最小延迟底线）与 `hintJitterMs`（服务端 hint 额外抖动，最多 250ms）；
   - 强制执行单次等待上限 `maxDelayMs`（默认 30s）与累计计划等待预算 `maxTotalDelayMs`（默认 60s）；
   - **关键修复**：当服务端 hint（如
     `Retry-After: 120`）超过客户端允许的最大等待时，**直接返回原错误，坚决不截断为 30s 提前重试**，严格尊重服务端限流意图。
3. **拦截器架构与请求链重建**：
   - `k8sRetryBackoffInterceptor` 与 `createK8sRetryBackoffInterceptor` 在每次重试时通过 `defer(() => next(req))`
     重新建立下游拦截器链，确保每次重试均能获取最新的认证 Token；
   - 提供 `provideK8sRetryBackoffConfig` 全局配置提供者与 `K8S_RETRY_BACKOFF_CONFIG` 逐请求覆盖/禁用机制；
   - 自动生成的日志标签剔除 query 字符串与 hash 片段，防止将敏感参数打入控制台日志。

### DSM 消费者契约与 `isEmpty` / `isNotEmpty` 判据

针对 DSM PR #2453 升级适配过程中暴露的泛型收窄问题进行了深度判定：

- **类型健全性保证**：旧版将空判断定义为 `value is T` 类型收窄，导致当传入已定义的空集合（如
  `[]`、`{}`、空 Map/Set）时，在否定分支中将合法对象错误推断为 `never` 或 `undefined`；
- **决策与契约**：维持 `isEmpty` 与 `isNotEmpty` 返回纯 `boolean` 的正确性；针对可空集合的收窄，推荐消费端采用
  `value != null && isNotEmpty(value)`，在 Angular 模板中推荐 `value && isNotEmpty(value)`；
- **打包验证守卫**：`tools/package/verify-packages.mjs` 中实际编译生成产物的
  `.d.ts`，验证严格模式下的分支推断，确保发布包的类型契约稳固。

### 运行时生命周期与环境隔离加固

- **组合语义与去重**：中英文与繁中 demo 明确将 `combineFrom` 定位为初始化去重与 `combineLatest`
  语义，说明其不提供跨来源的原子事务保证；同步 Signal 派生推荐直接使用 Angular 原生 `computed`。
- **写入与失效错误分离**：`mutateResource`
  在服务端写入成功后，即使随后的 tag 映射或缓存失效逻辑抛出异常，写入 Promise 仍然保持成功（resolve），避免错误触发破坏性的重复写入，仅通过可选的
  `invalidationError` 信号暴露同步失败。
- **表单重复提交防护**：`toSignalForm` 在企业表单提交场景中增加 `reactive: false`
  保护，回归断言确保提交后的输入编辑不会自动发起额外的新提交。
- **资源生命周期清理**：`poll` 示例在 `switchMap` 之后使用
  `takeUntilDestroyed`，组件销毁时彻底清理内层轮询与所有定时器。
- **真实 ESM 消费**：`verify-packages.mjs` 打包验证发现 `node-forge` 的命名导出在原生 Node
  ESM 下无法消费，调整为默认导入并对类型导入明确标注 `import type`。
- **E2E 端口与服务隔离**：Playwright E2E 测试默认独立运行于 4307 端口，关闭容易引发与其他本地服务冲突的
  `reuseExistingServer`，确保测试确定性。
- **Demo 确定性**：Demo 示例默认采用本地固化数据，外部实时接口需通过 `DEMO_LIVE_USERS` 环境变量显式开启；日期示例校正
  `differenceInDays` 的正负号与 24 小时 elapsed-day 契约。

---

## 使用与兼容示例

```html
<!-- 1. Spinner: 独立加载状态；省略 label 时使用组件内置的本地化加载提示 -->
<cll-spinner [decorative]="false" [label]="loadingMessage" />

<!-- 2. FileReader: 旧的 Latin-1 base64 数据继续按旧语义显式解码 -->
<cll-file-reader [encoded]="true" textEncoding="latin1" />

<!-- 3. Tooltip: 交互内容赋予 dialog 角色，并提供无障碍名称 -->
<button cllTooltip [cllTooltipContent]="detailsTemplate" cllTooltipLabel="Account details">Details</button>
```

```typescript
// 4. Kubernetes 429 退避重试操作符（具备方法限制与预算上限）
this.http.get('/api/v1/namespaces/default/pods').pipe(
  retryOnK8sBackoff({
    maxAttempts: 5,
    fallbackDelayMs: 1000,
    maxDelayMs: 30000,
    maxTotalDelayMs: 60000,
    logRetries: true,
  }),
);

// 5. 应用级配置 Kubernetes 重试拦截器
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([k8sRetryBackoffInterceptor])),
    provideK8sRetryBackoffConfig({
      maxAttempts: 3,
      fallbackDelayMs: 2000,
    }),
  ],
};
```

`byteConverter` 管道支持传入显式 `locale` 参数，证书日期与首页展示通过原生 `Intl`
使用当前语言；1024 缩放计算及历史单位名称未做非预期改变。控制错误推荐使用
`computedAsync(..., {onError: ...})`、`throwOnError: true` 或直接使用 `resourceAsync` 资源状态。

---

## 全量验证数据

本分支在本地环境进行了完整的无缓存全量验证（`Node v24.18.0`，`pnpm 11.7.0`）：

| 检查项                                | 最终结果                                          | 状态 |
| ------------------------------------- | ------------------------------------------------- | ---- |
| ngx-lift 单元测试                     | 44 文件 / 756 单测，分支覆盖率 **90.60%**         | 通过 |
| clr-lift 单元测试                     | 25 文件 / 238 单测，分支覆盖率 **77.04%**         | 通过 |
| demo 单元测试                         | 75 文件 / 206 单测，分支覆盖率 **75.47%**         | 通过 |
| 工具测试（ESLint 规则与 i18n 检查器） | 7 项 node:test 用例全部通过                       | 通过 |
| Playwright 三浏览器 E2E               | 33 场景 × 3 浏览器（**99 项全部通过**）           | 通过 |
| 代码格式校验（Prettier）              | 覆盖所有脚本、组件、样式、文档与 YAML             | 通过 |
| 代码质量校验（ESLint）                | 4 个项目（包含 demo-e2e lint）全部通过            | 通过 |
| TypeScript 类型检查（tsc）            | 3 个项目严格模式通过                              | 通过 |
| 国际化完整性（check-translations）    | 英文与简中 1461 键 100% 对应，组件 11 语言齐全    | 通过 |
| 真实打包消费验证（package-verify）    | 真实 tarball、exports、typings、runtime 检查通过  | 通过 |
| 生产首屏产物（production demo build） | 4.61 MB → 3.20 MB；估算传输 883.32 kB → 637.16 kB | 通过 |

验证命令：

```bash
pnpm run validate
pnpm nx e2e demo-e2e --skipNxCache
```

---

## 后续工作边界（Explicit Boundary）

根据项目定位与演进策略，以下范围**明确不属于本轮修复交付内容，列为后续工作**：

1. **其他语言完整翻译**：德语、西班牙语、法语、日语、韩语、荷兰语、巴西葡萄牙语、俄语等 8 种语言在 demo 演示页面中继续保留“基础导航 + 英文兜底”的部分翻译策略，并在语言选择器中明确标记。后续待专业本地化资源支持后再做全量翻译。
2. **Major API 重构**：
   - `computedAsync` 默认错误处理改用 `Result<T, E>` 或移除 `state.error as T`
     默认行为属于重大破坏性变更，保持兼容现有用法，留待下一个 major 版本进行系统性重构；
   - Secondary entry points（如
     `@ngx-lift/forms`、`@ngx-lift/query`、`@clr-lift/testing`）的拆分以及彻底移除已弃用符号，属于独立架构迁移工作包。
3. **Angular 22 与新版生态适配**：当前代码基线基于 Angular 21；Angular 22 的 stable resource 与 Signal
   Forms 原生支持将在未来 Angular 22 适配分支中系统性演进。
4. **Clarity 上游设计系统文案对接**：Clarity 自身的 common strings 动态多语言注入与复杂 ICU 复数规则解析留作独立需求。
5. **完整 SSR/Hydration 与读屏人工评测**：Clarity
   18.4 部分底层依赖（如 icon 注册）在纯 Node 环境下假定存在 DOM 全局变量，需等待上游设计系统完成完全的 SSR 脱敏支持。

---

## 工作区说明

- 原始审计报告 [2026-10-12 审计报告](../reviews/ngx-lift-quality-audit-2026-10-12.zh-CN.md) 与行业对标
  [2026-10-12 行业对标](../research/ngx-lift-industry-reference-2026-10-12.zh-CN.md)
  作为历史基线完整保留，未改写其原始记录；
- 机器可读的验证证据见 [2026-10-13 证据 JSON](../reviews/ngx-lift-hardening-evidence-2026-10-13.json)；
- CI 共享工作流已配置完成，远程发布与标签打标由仓库维护者根据发布计划触发。
