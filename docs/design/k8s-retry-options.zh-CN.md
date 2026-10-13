# Kubernetes 429 重试配置与演示

[英文说明](./k8s-retry-options.md)列出了 API 与使用示例。

保留 Cursor 增加的 `isK8sStatusThrottled`、`retryStatusCodes`、`isRetryable`、`minDelayMs`
和可选结构化日志。默认仍仅重试 429，总共尝试 5 次，单次等待最多 30s、累计计划等待最多 60s；网络耗时不计入等待预算。

改进点：

- 默认方法维持 GET/HEAD/OPTIONS/PUT/DELETE。POST/PATCH 必须显式配置 `retryMethods`
  并确认端点幂等或执行前拒绝的契约。`kind: Status` 与 `reason: TooManyRequests`
  只证明响应格式，不能证明写入没有副作用。`isRetryable` 也不会自动扩大方法白名单。
- `minDelayMs` 对 equal/full/none 的 fallback 都有效，超过 `maxDelayMs`
  时拒绝配置；不改变服务器 hint。等待超过剩余预算时原样返回错误，不记录未执行的重试。
- 先检查状态码再执行额外 predicate；predicate 抛错时保留原错误。
- logger 抛错不终止请求恢复。自动标签去掉查询与片段；路径、自定义标签和原始 `error`
  仍可能包含敏感信息，调用者需选取安全字段并脱敏。

operator 页面补全配置表、状态码参数和真实等待日志。interceptor 页面增加三种 POST 场景：默认不重试、端点明确授权且符合 Kubernetes
predicate 时恢复、普通网关 429 被 predicate 拒绝。示例调用真实库拦截器，无需改应用全局 HTTP 配置。不要同时叠加 operator 与 interceptor，避免重试次数相乘。

## 验证

新增回归测试先复现默认写入重试、fallback
floor、logger 失败和 predicate 顺序问题；修复后聚焦测试通过。最终全量验证结果将在提交前补充。按要求删除
`docs/reviews/k8s-retry-backoff-comparison.md`，该审查文件不进入提交。
