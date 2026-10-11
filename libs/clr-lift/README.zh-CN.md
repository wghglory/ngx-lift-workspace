<div align="center">

# 🎨 clr-lift

**基于 VMware Clarity Design System 构建的企业级 Angular 组件、工具与操作符库**

[![npm version](https://img.shields.io/npm/v/clr-lift.svg?logo=npm)](https://www.npmjs.com/package/clr-lift)
[![npm downloads](https://img.shields.io/npm/dm/clr-lift.svg)](https://www.npmjs.com/package/clr-lift)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Angular](https://img.shields.io/badge/Angular-%3E%3D21.0.0-red.svg)](https://angular.dev)
[![Clarity](https://img.shields.io/badge/Clarity-%3E%3D18.0.0-blue.svg)](https://clarity.design)

[📖 在线文档](https://ngx-lift.netlify.app/clr-lift) • [🎮 在线示例](https://ngx-lift.netlify.app/clr-lift) •
[💻 GitHub 源码仓库](https://github.com/wghglory/ngx-lift-workspace) • [🇬🇧 English Documentation](README.md)

</div>

---

**clr-lift** 为 VMware **Clarity Design System**
提供了久经生产检验的企业级增强套件。它填补了原生 Clarity 在复杂业务场景下的空白，提供了解决 Datagrid 服务端请求抖动的状态流管理器、响应式反馈通知、异步向导组件、类型安全的文件输入控件、零配置明暗主题切换，以及内置 12+ 种主流国际语言的就绪本地化支持。

```html
<!-- 具备自动 HttpErrorResponse / Error 提取的增强告警组件 -->
<cll-alert [error]="userError()" [isLightweight]="true" />

<!-- 零配置明暗主题切换器 -->
<cll-theme-toggle />
```

---

## ⚡ 核心亮点

- ⚡ **无抖动 Datagrid 状态流** - `dgState` 智能区分搜索防抖与分页排序，彻底消除竞态请求与闪烁。
- 🔔 **响应式反馈体系** - 包含自动解构错误对象的 `cll-alert`、支持自定义动作按钮的 `AlertContainerComponent` 与全局
  `ToastService`。
- 🧙 **异步时间线向导** - `cll-timeline-wizard` 结合 Clarity Timeline，支持步骤级异步校验、守卫拦截与响应式状态流。
- 📝 **开箱即用表单控件** - 原生实现 `ControlValueAccessor` 的 `cll-file-reader`（拖拽与格式读取）与
  `cll-key-value-inputs`。
- 🌓 **零配置明暗主题** - `cll-theme-toggle` 一键无缝切换 Clarity 明暗主题，自带 `localStorage` 持久化与全局属性同步。
- 🌍
  **内置 12+ 种主流语言本地化** - 无需引入重型 i18n 第三方库，开箱即支持英语、简体中文、繁体中文、德语、西班牙语、法语、意大利语、日语、韩语、荷兰语、葡萄牙语等。
- 📦 **100% Standalone & Tree-Shakable** - 全面适配 Angular Signals 与 `OnPush` 变更检测策略，按需加载。

---

## 🚀 快速上手（60 秒）

### 1. 安装

```bash
npm install clr-lift ngx-lift @clr/angular @clr/ui
```

### 2. 引入样式

```scss
// styles.scss
@import '@clr/ui/clr-ui.min.css';
```

### 3. 在 Standalone 组件中使用

```typescript
import {Component, inject, signal} from '@angular/core';
import {AlertComponent, ToastService, ThemeToggleComponent} from 'clr-lift';

@Component({
  selector: 'app-dashboard',
  imports: [AlertComponent, ThemeToggleComponent],
  template: `
    <header class="flex justify-between p-4">
      <h2>集群管理控制台</h2>
      <cll-theme-toggle />
    </header>

    <main class="p-4">
      @if (errorMessage()) {
        <cll-alert [error]="errorMessage()" [clrAlertClosable]="true" />
      }

      <button class="btn btn-primary" (click)="notifySuccess()">发送通知</button>
    </main>
  `,
})
export class DashboardComponent {
  private toastService = inject(ToastService);
  readonly errorMessage = signal<string | null>(null);

  notifySuccess(): void {
    this.toastService.success('集群备份任务已成功创建！');
  }
}
```

---

## 🌟 核心场景实战

### 1. `dgState` — 告别 Datagrid 防抖与竞态烦恼

原生 Clarity 的 `(clrDgRefresh)` 会在每次过滤和分页时触发，容易造成界面闪烁与网络时序混乱。`dgState`
自动处理防抖、状态缓存与请求自动取消：

```typescript
import {Component, inject} from '@angular/core';
import {ClrDatagridStateInterface} from '@clr/angular';
import {dgState} from 'clr-lift';
import {UserService} from './user.service';

@Component({
  selector: 'app-users-grid',
  template: `
    <clr-datagrid (clrDgRefresh)="usersState.refresh($event)" [clrDgLoading]="usersState.isLoading()">
      <clr-dg-column>姓名</clr-dg-column>
      <clr-dg-column>邮箱</clr-dg-column>

      <clr-dg-row *clrDgItems="let user of usersState.data()?.items">
        <clr-dg-cell>{{ user.name }}</clr-dg-cell>
        <clr-dg-cell>{{ user.email }}</clr-dg-cell>
      </clr-dg-row>

      <clr-dg-footer>
        <clr-dg-pagination [clrDgTotalItems]="usersState.data()?.total ?? 0" />
      </clr-dg-footer>
    </clr-datagrid>
  `,
})
export class UsersGridComponent {
  private userService = inject(UserService);

  readonly usersState = dgState((state: ClrDatagridStateInterface) => this.userService.fetchUsers(state), {
    debounceTime: 300,
  });
}
```

### 2. `cll-timeline-wizard` — 声明式多步骤工作流

轻松构建具备步骤级异步验证的资源开通向导：

```html
<cll-timeline-wizard
  [steps]="wizardSteps"
  (finish)="onProvisionComplete($event)"
  (stepChange)="onStepNavigated($event)"
>
  <ng-template cllStepContent="credentials">
    <app-credentials-step [form]="credentialsForm" />
  </ng-template>

  <ng-template cllStepContent="network">
    <app-network-step [form]="networkForm" />
  </ng-template>
</cll-timeline-wizard>
```

### 3. `cll-file-reader` — 响应式表单文件读取器

无需手动监听 `<input type="file">` 原生事件或手动编写 Base64 / 文本解析：

```html
<clr-input-container>
  <label>上传 TLS 证书</label>
  <cll-file-reader [formControl]="certFileControl" accept=".pem,.crt" readAs="text" [maxSizeMb]="5" />
</clr-input-container>
```

---

## 🧩 组件与功能速查表

| 分类             | 导出项                         | 选择器 / 接口              | 核心说明                                                                       |
| :--------------- | :----------------------------- | :------------------------- | :----------------------------------------------------------------------------- |
| **表格状态**     | `dgState`                      | Operator / Utility         | 消除防抖闪烁、自动取消时序过时请求的服务端 Datagrid 响应式状态流。             |
| **反馈与通知**   | `AlertComponent`               | `cll-alert`                | 智能告警框，自动识别并提取 `Error` 与 `HttpErrorResponse` 详细错误信息。       |
|                  | `AlertContainerComponent`      | `cll-alert-container`      | 响应式多告警列表容器，支持由 `AlertService` 声明式推入自定义按钮与消息。       |
|                  | `ToastService`                 | 注入式服务                 | 全局轻量通知调度器，支持 `success`、`error`、`warning`、`info`。               |
|                  | `ToastContainerComponent`      | `cll-toast-container`      | Toast 挂载容器，支持配置弹出位置与倒计时自动关闭。                             |
|                  | `SpinnerComponent`             | `cll-spinner`              | 居中排版、多尺寸（`sm`、`md`、`lg`）、无障碍友好的加载指示器。                 |
|                  | `StatusIndicatorComponent`     | `cll-status-indicator`     | 业务运行状态指示器（`success`、`warning`、`error`、`pending` 等）。            |
| **导航流程**     | `TimelineWizardComponent`      | `cll-timeline-wizard`      | 结合时间线步骤、支持异步守卫与表单持久化的向导工作流。                         |
|                  | `PageContainerComponent`       | `cll-page-container`       | 统一规范的标准页面容器（含标题、面包屑、操作栏与内容区）。                     |
| **高级表单**     | `FileReaderComponent`          | `cll-file-reader`          | 实现 `ControlValueAccessor` 的文件拖拽解析控件（Text、DataURL、ArrayBuffer）。 |
|                  | `KeyValueInputsComponent`      | `cll-key-value-inputs`     | 动态键值对与环境变量编辑器，内置重名校验与响应式绑定。                         |
| **主题与多语言** | `ThemeToggleComponent`         | `cll-theme-toggle`         | Clarity 明暗主题切换器，自动处理持久化与主题变量同步。                         |
|                  | `TranslationService`           | 注入式服务                 | 内置轻量多语言服务，无需外部库即可在运行时动态切换 12+ 种企业语言。            |
|                  | `TranslatePipe`                | `translate`                | 组件内文本与提示信息的响应式翻译管道。                                         |
| **浮层与增强**   | `CalloutComponent`             | `cll-callout`              | 柔和边框的场景化提示容器。                                                     |
|                  | `CertificateSignpostComponent` | `cll-certificate-signpost` | 交互式 X.509 证书解析详情框，直观展示域名、有效期与签发机构。                  |
|                  | `TooltipDirective`             | `[cllTooltip]`             | 声明式富内容气泡提示指令。                                                     |

---

## 🌍 开箱即用的多语言本地化

`clr-lift` 中的所有交互文案、提示与占位符均已内置多国语言：

| 英语 (`en`)         | 简体中文 (`zh-CN`) | 繁体中文 (`zh-TW`)           | 德语 (`de`)     |
| :------------------ | :----------------- | :--------------------------- | :-------------- |
| **西班牙语 (`es`)** | **法语 (`fr`)**    | **意大利语 (`it`)**          | **日语 (`ja`)** |
| **韩语 (`ko`)**     | **荷兰语 (`nl`)**  | **葡萄牙语 (`pt`, `pt-BR`)** | **俄语 (`ru`)** |

可在运行时动态切换语言：

```typescript
const translationService = inject(TranslationService);

// 动态切换语言，界面中所有 clr-lift 组件立即无刷新响应更新
translationService.setLanguage('zh-CN');
```

---

## 🧪 单元测试

在业务单元测试中测试使用了 `clr-lift` 的组件：

```typescript
import {TestBed} from '@angular/core/testing';
import {TranslationService} from 'clr-lift';

beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [MyComponent],
    providers: [TranslationService],
  }).compileComponents();
});
```

---

## 📄 开源协议

MIT © [Guanghui Wang](https://github.com/wghglory)
