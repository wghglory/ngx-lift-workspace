# Query 生产验收记录

完整验证、优先级状态及依赖风险表见 [英文记录](query-production-review.md)，行为契约见
[统一 query 规范](../design/query-resource-design-spec.zh-CN.md)。基线为 `main@5b196cf`。

## 结论

query 核心可用于有明确作用域、deadline 和 retry 策略的 Angular 浏览器业务。本 PR 改进 demo、文档和消费验证，不修改 query 引擎。本轮未发现新的阻塞运行时问题；这不代表整个库可以立即 npm 发布。依赖风险处理、独立人工语言验收、版本和凭据仍需完成。SSR/hydration、ZoneJS、完整 peer-version 矩阵没有因此得到证明。

## 已交付

- queryResource 按基础到高级组织，Clarity 控件、状态 label 与操作间距统一；失败说明改为表格与标签页。
- queryResources 有独立菜单与 lazy page，支持演示选择、排序、移除和局部失败恢复。
- 命名 callout 仅保留 `Query` / `Queries` / `Mutation` 句柄建议，删除冗余语法说明，标题与正文留出间距。
- 两处 NG8107 修复；README/changelog 与未发布迁移反映实际 API。
- query 设计分册合并为一对中英文规范，query review 合并为本记录；旧证据保留在 Git/原 PR，不复制成长篇档案。
- 独立 tarball DOM consumer 真正挂载 Angular 组件，覆盖会话隔离、取消、刷新恢复、集合、旧作用域 mutation 和销毁。

## 验证与优先级

本次会话的完整验证检查点：`pnpm run validate` 通过，包含 848 ngx-lift、262 clr-lift、235
demo 测试以及覆盖率、lint、类型、格式、i18n、构建、bundle 和严格独立消费者。生产产物上三浏览器共 126 项 E2E 通过；demo 测试源码类型检查通过。命名补充验证包含 12 段 TypeScript 编译、23 项相关单元测试和 24 项 query
E2E。最终远程结果以 PR checks 为准，不能用历史数量代替。

Priority 1 的发布工作流、独立消费者、重量依赖加载已交付；Priority
2 的语言/Clarity、诊断、scope/clock 工程已交付，人工语言签核仍开放。query 的异常隔离、失败 UI、有界重试、总 deadline、观察中的 focus/reconnect 恢复、终态报告已实现；自动 write
replay 与共享 rollback 没有实现。Priority 3 的 SSR/hydration、版本矩阵、entry
points 与 computedAsync 类型设计继续独立推进。

建议下一发布为 ngx-lift 22.0.0 / clr-lift
22.0.0，但本 PR 不修改版本或发布。已有 runtime 告警涉及 Angular（列出修复版本最高 21.2.24）和 node-forge（high，未列出修复版本）；官方 production
audit 在 45 秒上限后超时，不能记作通过。现有 4200 checkout 未修改；本轮预览为 4317 / 4318。
