# Tooltip 中文说明

英文 API 与代码示例：[README.md](README.md)。

## 内容与生命周期

- 字符串：展示 HTML 内容，Angular 按模板规则清理。
- `TemplateRef`：tooltip 创建 embedded view；切换/隐藏/销毁时清理。
- Component Type：tooltip 创建 component view，并负责销毁。
- `ComponentRef`：调用方已经创建的实例仍由调用方持有。tooltip 临时移动它的 DOM，关闭时还原有效节点，不销毁该实例。调用方负责 view
  attachment、持续变更检测、最终 `destroy()`。若调用方先销毁，tooltip 不会再渲染或恢复已销毁的 DOM。

希望 tooltip 管理创建与清理时优先传 Type 或 `TemplateRef`。传 `ComponentRef` 时按照英文示例使用
`ApplicationRef.attachView()`，并在调用方销毁时销毁它。

## 这次增强

tooltip 打开后，`cllTooltipContent`、`cllTooltipContentContext`、width 与 position 的响应式变化会更新显示，不需要先关再开。内容变化清理旧 view 和旧文字；不会把已经离开的 trigger 改回 hover。

普通文字点击保留 tooltip；按钮或链接内的图标点击能正常关闭；外部点击、Escape、scroll/resize 关闭过期内容。hide
delay 期间鼠标返回会取消隐藏。trigger 的原有 `aria-describedby` 会保留；关闭时只移除当前 tooltip 的 ID。

销毁 trigger 会取消定位/隐藏任务、detach app
view、清理 DOM/listener，并销毁 tooltip 自己创建的内容。单位测试覆盖真实 DOM 普通/控件点击、可见内容/context 更新、borrowed
ref 提前销毁、反复 show/hide 和 timer 清理。

这里验证了具体交互和生命周期，尚未做全面真实浏览器无障碍或视觉像素认证；交互型复杂内容的 focus/语义仍需结合具体应用检查。
