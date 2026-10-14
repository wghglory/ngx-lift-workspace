# queryResource：评审反馈与实现调整

完整设计见 [英文设计文档](query-resource-design-spec.md)。

## 反馈结论

- **同步退订泄漏：部分成立。**
  首次订阅时，RxJS 会在订阅关闭后执行稍后返回的 teardown，回归测试证实首次同步销毁不会泄漏。但缓存删除后调用 `reload()`
  重新挂接时，teardown 已存在，同步销毁会早于新 handle 返回，确实造成观察者泄漏。现已在 `observeQuery`
  返回后检查销毁状态与 `subscriber.closed`，必要时立即释放 handle。
- **热缓存首次空白：成立。**
  现在观察 effect 执行前即可读取当前 key 对应的已有成功数据，包括 stale 缓存。stale 数据同步显示
  `reloading`，随后挂接观察者并重新验证，默认 `staleTime: 0`
  同样适用。禁用仍显示 idle；没有成功数据时显示 loading；切换 key 不会展示旧 key 的值。
- **共享策略不可逆：是现有设计约束。** 同一缓存条目生命周期内，`staleTime` 取最小值、`gcTime` 取最大值，
  `cancelOnNoObservers`
  仅在所有注册定义均启用时成立。观察者退出不会撤销策略。因此临时关闭取消的读取方会影响后续请求，直到缓存条目被移除；这是实际带宽与生命周期代价，调用方应集中维护同 key 定义和策略。后续如需解除锁存，应单独设计请求所有权，而不是只修改一个布尔值。
- **退出观察者的 loader 闭包：需要调用方遵守同 key 契约。** 最新注册定义提供 loader；imperative `fetchQuery`
  也可以注册定义。同 key 的 loader 必须表示可互换读取，且应捕获稳定参数。只按活跃观察者恢复 loader 的建议涉及新的所有权模型，不能单独解决 imperative
  caller 与已有请求的生命周期。

## Observable 支持

所有查询入口直接接受 `Observable<T> | PromiseLike<T>`
loader；内部统一 normalize，调度器使用 Promise，应用不需要公开适配器。Observable 取第一个值后 unsubscribe；空完成产生
`EmptyError`。teardown 抛错时请求仍会结束，错误后可以重试。 `isInitialLoading` 表示无成功数据时的读取，`isRefreshing`
表示保留旧值的刷新。 `fetchQueryObservable` 是单次快照；需要随失效持续更新时使用 `observeQueryObservable` 或
`queryResource`。

## 验证

回归测试先复现热缓存空白和重新挂接时的泄漏，再验证修复；另验证首次同步销毁不会泄漏。当前工作区 library 的 44 个测试文件、698 个测试全部通过；源码类型检查、测试类型检查和 lint 均通过。

新增回归测试覆盖零 freshness 与过期缓存的同步 hydration，以及恢复观察期间快速和同步重入
`reload()`：后者无需实现修改，已验证只产生一个替代观察者和一次共享请求，并正确退订。

最终评审新增 QueryClient 发布序号：观察者同步移除缓存、触发刷新或退订其他观察者时，旧批次停止投递，避免已移除数据再次出现或旧 resolved 状态覆盖新 reloading 状态。新增三项回归测试。
