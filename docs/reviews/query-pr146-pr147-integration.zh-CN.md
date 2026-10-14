# Query #146 / #147 整合复审

2026-10-14。[英文完整审查](query-pr146-pr147-integration.md)。

## 合并顺序

建议 **#146 先、修正后的 #147 后**。#146 固定原生 Observable / PromiseLike、共享 retry /
deadline、失败信号与恢复生命周期；#147 在这个基础上增加诊断与完整 demo 本地化。两者功能互补。准备中的 #147 分支包含 #146 的准确 head
`6128d54`，先验证实际组合。原 #147 head 为 `a168da7`，共同基线为 `b8459ed`。

两个 PR 各自 CI
green 不能证明组合安全。本次有 16 个冲突文件，已保留两套 query 回归、新 API、11 种语言、响应式 API 表和严格字典检查。没有恢复 deprecated
wrapper 或 defineQuery。

## 已发现并修复

- **P1 demo：inspector 没有实际渲染。** 原来的 playground-preview / playground-actions 不匹配组件的 preview /
  inspector 投影。改用支持的 slot 与 badgeText，增加实际投影组件测试和全语言浏览器检查，确保表格与刷新按钮存在且可用。
- **P2 诊断时刻不一致。** GC 倒计时读取 now 后，freshness 又读取一次；aggregate
  visibility 也重复采样。现在完整快照只采样一次 clock / visibility，各 entry 使用同一时刻。回归覆盖两个公开入口。
- **P2 指标语义不准确。** requestCount / pendingRequestCount 统计待结算逻辑读取，包含 retry
  backoff 和旧 generation，不能宣称正在执行 HTTP。isPending 仅表示当前代际；旧读取未结束时可为 false。移除条目不再统计，remove/destroy 取消对应读取。新增 failureCount
  / nextRetryAt 展示当前读取进度。
- **P2 独立安装验证不足。** fresh strict tarball consumer 现在验证原生 Observable、两个 Observable
  facade、provider、单体/集合 resource、item 类型推断、失败信号与诊断类型，不只验证 linked 工作区。

诊断新增 6 项回归先出现 4 失败、2 通过；修复后全通过。覆盖没有 HTTP
subscription 的重试等待、当前代际完成后旧读取继续 retry，以及等待期间 remove/destroy。#146 的同步 teardown、observer 隔离、deadline 和过期结果防护继续保留。

## 独立的 idle scope 修复

非 query 补充检查发现 P2：已打开的弹窗切换 service 后继续显示旧状态；新组件挂接到正在倒计时的共享 service 时又收不到过去的事件。用 observeState() 重放实际 service 状态，切换后立即同步；共享活动重置也关闭同 service 的其他弹窗。3 项真实组件回归先全部失败，修复后通过；另补 10 项 service 回归，覆盖状态重放、释放、销毁，以及同步回调 reset/release/clear 后不继续安装 timer 或发送旧 countdown；过期状态批次不会覆盖其他 observer 已收到的 reset。单独提交，保留 query 整合审查边界。

## 诊断使用边界

两个 get 方法不发请求、不通知 observer、不延长缓存、不修改状态；key 和 tags 是独立副本。调用方自己安排刷新与销毁。Inspector 读取 injected
root client，失败和 Observable service 示例拥有独立 client，不能误认为统计整页所有 client。界面说明已支持全部语言。

requestCount 为旧读取加当前读取；failureCount /
nextRetryAt 只反映当前逻辑读取。数据成功恢复后清空重试 metadata，终态失败保留实际失败次数。不存在离线队列或“暂停后重放”能力。对外导出诊断时按业务脱敏 key。

全局配置使用 provideQueryClient，Observable 直接返回 HttpClient 结果。自动 read retry / deadline /
focus/reconnect 默认关闭；mutation 不自动重放。B 方案 queryResources 已覆盖动态列表，无需现在同时增加 A。

## 验证与发布

最终组合 `pnpm run validate` 通过：ngx-lift 838、clr-lift
259 与完整 demo 单元测试；覆盖率门禁、源码类型、lint、完整字典检查、tooling、production
builds、bundle 依赖门禁与严格独立包安装。三项目源码和 spec 类型检查通过。冻结源码后 120 项 Chromium/Firefox/WebKit
E2E 全通过，含所有语言 inspector 的实际投影和刷新。独立 tarball
consumer 还执行原生 Observable、有限 retry、诊断与 deadline rejection。合并前仍需当前 head 的远程 CI 完成。原 #147
review 明确为历史证据；先前 publication dry run 未执行本组合，不替代当前检查。未执行 npm 发布，audit / advisory
triage 仍是独立发布门禁。
