# resourceAsync：设计文档校正

完整设计见 [英文文档](resource-async-design-spec.md)。

最终 PR 评审确认 `resourceAsync` 的 `behavior` 仅支持 `switch` 与 `exhaust`。英文图示、行为列表与实现对照表中错误列出的
`concat` 已删除，API 表格中的 `T | undefined` 分隔符也已修正。`computedAsync` 和 `mutateResource`
的独立并发选项不受影响。

创建资源仍需 Angular injection context，或提供明确 injector。 `params` 捕获响应式参数，`loader` 执行请求并接收
`abortSignal`；取消、销毁、重置或本地覆盖会结算对应的等待操作。await `.execute()` 的调用方应处理取消或销毁错误。

源码、测试类型检查与生产构建已验证；完整 PR 验证与发布限制见 [PR #142 最终评审](../reviews/PR-142.zh-CN.md)。
