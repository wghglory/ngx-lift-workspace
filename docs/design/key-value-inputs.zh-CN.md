# Key/value 编辑器优化

[English design](./key-value-inputs.md)

## 目标和场景

增强现有 `cll-key-value-inputs`，覆盖 input/input、select/input、input/select、select/select 四种组合。保留
`FormArray<KeyValueFormGroup>`，key 和 value 都是非空类型的字符串控件；不配置新选项时仍是双文本框。

对照了 dsm-ui 的自由文本标签组件、schema 属性编辑器和数据库参数编辑器：

- 标签支持同一分类下的不同值，通过 `uniqueKey=false`、`uniqueKeyValuePair=true` 禁止完全重复的组合。
- 固定 key 列表可使用 select；唯一 key 模式会禁用其他行已选的候选项。
- value 可以独立选择文本输入或下拉选择，也可以根据 key 返回不同配置。
- DSM 专属策略校验、原始参数只读、导出，以及 boolean/number/array 类型的 schema 编辑仍由业务层负责。本次不修改 dsm-ui 调用方，也不发布 npm 包。

采用 Angular Reactive
Forms 的单一控件模型和 Clarity 原生 select 的键盘、标签及校验提示能力。大规模远端搜索目录应采用专门的 combobox 集成；当前 select 面向有限候选集。

## 使用方式

```html
<cll-key-value-inputs
  [formArray]="form.controls.settings"
  [keyConfig]="keyConfig"
  [valueConfig]="valueConfig"
  [resetValueOnKeyChange]="true"
/>
```

`keyConfig` 和 `valueConfig` 支持 `mode`、`label`、`placeholder`、`helper`、 `required`、`validators`。select 的
`options` 为 `{value, label, disabled?}[]`；显示名称与存储值分离。option value 必须唯一且非空，空字符串表示尚未选择。

`valueConfig` 还支持纯函数 `(key: string) => KeyValueFieldConfig`。关联选择时显式启用
`resetValueOnKeyChange`：key 变化后清空旧 value 并重置其 touched/dirty，保留 disabled 状态。默认关闭，兼容自由文本编辑。

自定义校验通过 `{validator, errorKey, message}` 声明。同名错误优先显示自定义文案。已有
`keyPattern`、`valuePattern`、辅助文案、宽度及输出事件继续可用。

## 状态与生命周期

- 父表单始终拥有 FormArray 和控件。组件仅添加、移除自己的校验器，保留父表单的同步和异步校验；无关 key 变化不会重启其他 value 字段的异步校验。同时监听数组状态事件，保证数组级异步校验完成后 Add 按钮及时刷新。
- `data` 对同一个组件与 FormArray 的关联仅初始化一次，且不追加到已有行。 `smartMode`
  只在初始为空时创建一行。初始化不标记 dirty，也不触发用户新增事件。后续数据加载由父表单明确更新，或传入新的 FormArray。
- 动态增删、替换行使用 Angular 的默认事件发送。批量 `emitEvent:false` 操作后，调用 `array.updateValueAndValidity()`
  统一同步状态。
- 唯一性校验跳过 disabled 行/字段和空字符串；纠正或删除重复项后，两侧错误立即清除。key/value 分别比较，避免使用字符串拼接产生冲突。
- 已保存但已不在候选集中的值仍显示，并产生 `selection`
  错误；更新选项不会偷偷清除用户数据。disabled 选项禁止新选择，但不会使已保存的该值失效。
- 选项配置通过新对象引用更新；若 resolver 依赖外部目录，目录变化时也须传入新的配置或函数引用，例如用 `computed` 生成。
- 表单 disabled、存在无效或 pending 行、唯一 key 选项耗尽时禁止新增；disabled 行禁止删除。用户增删会标记 dirty。新增定位到新行 key；删除后定位到相邻行或 Add。

## toSignalForm demo

[示例组件](../../apps/demo/src/app/clr-lib/pages/key-value-inputs-demo/key-value-inputs-demo.component.ts)
在一个父表单中展示四种组合，并直接使用仓库现有 `toSignalForm`：

- `sf.bindDisabled()` 关联“启用编辑”开关和四个 FormArray。
- `sf.valid()`、`sf.pending()`、`sf.dirty()` 等状态实时展示。
- `sf.submitValue()` 排除仅用于界面的 editing 字段，提交时保存有效数据快照。
- 恢复默认值会明确恢复初始行，再重置 pristine/untouched；不依赖 `FormArray.reset()` 恢复已经删除的行。

## 验证

2026-10-15 本地验证结果：

| 检查                        | 结果                                                                                   |
| --------------------------- | -------------------------------------------------------------------------------------- |
| clr-lift 全量单元测试       | 27 个文件、283 个测试通过                                                              |
| demo 全量单元测试           | 80 个文件、237 个测试通过                                                              |
| key/value 组件定向测试      | 27 个测试通过                                                                          |
| 组件目录 TypeScript 覆盖率  | 行覆盖率 98.93%，分支覆盖率 96.57%                                                     |
| Chromium、Firefox、WebKit   | 共 12 个交互、焦点、标签及 390px 窄屏检查通过                                          |
| lint 和应用/库类型检查      | 通过                                                                                   |
| 多语言字典检查              | 11 种 demo 语言完整，无错误                                                            |
| demo 和库的 production 构建 | 通过                                                                                   |
| 打包消费验证                | 链接消费方和严格 peer 安装的新消费方均通过，包含新配置类型与 `toSignalForm` 的编译契约 |
| 改动文件的格式和空白检查    | 通过                                                                                   |

覆盖率仅针对 `src/lib/components/key-value-inputs/*.ts`，不代表整个 clr-lift 的覆盖率。
