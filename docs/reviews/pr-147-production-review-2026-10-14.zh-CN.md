# PR #147 生产审查与 Priority 1、2 交付

目标为 `feat/extended-priority-2-backlog` 的 PR #147，原始提交 `6549690`，基线 `b8459ed`。完整矩阵、使用入口与验证证据见
[英文报告](./pr-147-production-review-2026-10-14.md)。#146 的独立实验不属于本次交付。

## 已完成的工程工作

- P1.1：核验 main 的 CI、CodeQL、部署与制品；发布工作流默认 dry run，跳过凭据、Git 修改和实际发布。最终分支状态以
  [PR checks](https://github.com/wghglory/ngx-lift-workspace/pull/147/checks) 为准。
- P1.2：tarball 在独立消费者中严格安装 peer，禁用自动补装，执行严格类型和运行时导入验证。
- P1.3：高亮在渲染组件异步加载；两个证书相关页面异步加载解析或校验。生产构建检查静态依赖图，保留库的同步 API。
- P2.1：11 种语言各 1,641 键，包含原先硬编码的 130 条 API 描述；表格响应语言切换和字典加载，移除部分支持标记。校验占位符、API 标识、枚举与异常翻译残留。
- P2.2：11 套 Clarity 原生文案覆盖全部 122 个上游键，切换时恢复基线，再应用区域覆盖。
- P2.3：诊断 key 深拷贝、pending 请求总数正确；面板每秒刷新且销毁清理；真实多组件测试覆盖共享配置、轮询、GC 与作用域。
- P2.4：Idle 所有权按消费者释放，最后一个托管所有者才清理；显式 scope、初始配置、响应式 Clock 和默认时钟清理均有回归。

额外修复：复制代码时保留原始泛型、实体与运算符；证书异步校验 PENDING/失败时禁止提交，解析器加载后同步发出校验结果，避免 Clarity 提交时重复校验造成假 PENDING。证书 Clock 每次仅采样一次，Clarity 切换不残留旧语言。

## 必须保留的证据边界

翻译由 AI 辅助，并审查了技术语义、重试安全和 API 字面量。**未取得独立母语人工签核**，因此原始 P2.1 的“人工审校”验收仍开放；不能把键数齐全当作该签核已完成。

独立安装通过、CI 通过、可实际发布是不同门禁。官方 npm audit 请求 60 秒超时，依赖审计仍未验证。dry
run 不验证实际 npm 凭据，也没有发布任何包或合并 PR。本地完整 validate、三项目 spec 类型检查、1,247 个单测与 102 个跨浏览器 E2E 全部通过。三个项目分支覆盖率为 90.57%、79.27%、76.99%。国际化与生产 bundle 检查通过，严格独立消费者验证通过。最终远程结果记录在 PR 描述与 checks 中。

## 下一步与 computedAsync

先取得语言签核，并确认最终 revision CI；合并后核验 main CI/部署。实际发布前完成审计、版本与凭据验证。
[生产契约说明](../design/priority-1-2-completion.zh-CN.md) 包含 scope、Clock、diagnostics 与加载边界。

`computedAsync`
实现和类型保持不变。错误被当作 T、onError 返回 undefined 与 initialValue 重载之间的类型债务保留到独立 major 或新命名 API。Result 包装会要求现有赋值、属性读取、模板和 previous-value 回调解包；默认抛错会改变运行时行为；本次均未引入。

## 已确认的依赖风险

GitHub main 上有 96 条现存 Dependabot 告警：4 critical、40 high、44 medium、8
low，其中 81 条开发依赖、15 条运行时依赖，部分在 manifest 和 lockfile 中重复。本 PR 未修改 lockfile。node-forge 的 RSA 签名验证告警尚未列出修复版本；当前证书帮助方法只解析 PEM 和计算指纹，不调用该签名验证路径，但不能据此证明整个依赖树安全。实际发布前须完成告警评估、修复与审计。
