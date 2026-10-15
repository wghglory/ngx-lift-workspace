<div align="center">

# 🎨 clr-lift

**Enterprise Angular components, utilities, and operators built on Clarity Design System**

[![npm version](https://img.shields.io/npm/v/clr-lift.svg?logo=npm)](https://www.npmjs.com/package/clr-lift)
[![npm downloads](https://img.shields.io/npm/dm/clr-lift.svg)](https://www.npmjs.com/package/clr-lift)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Angular](https://img.shields.io/badge/Angular-%3E%3D21.0.0-red.svg)](https://angular.dev)
[![Clarity](https://img.shields.io/badge/Clarity-%3E%3D18.0.0-blue.svg)](https://clarity.design)

[📖 Documentation](https://ngx-lift.netlify.app/clr-lift) • [🎮 Live Demo](https://ngx-lift.netlify.app/clr-lift) •
[💻 GitHub Repository](https://github.com/wghglory/ngx-lift-workspace)

</div>

---

**clr-lift** supercharges VMware's **Clarity Design System** with battle-tested enterprise primitives. It fills the gaps
in standard Clarity by delivering flicker-free datagrid state management, reactive notification systems, async
multi-step wizards, type-safe form controls, zero-config dark mode, and built-in 12+ language localization.

```html
<!-- Enhanced Clarity alert with automatic Error/HttpErrorResponse extraction -->
<cll-alert [error]="userError()" [isLightweight]="true" />

<!-- Zero-config light/dark theme switcher -->
<cll-theme-toggle />
```

---

## ⚡ Highlights

- ⚡ **Flicker-Free Datagrids** - `dgState` eliminates search debounce lag and race conditions in server-side datagrids.
- 🔔 **Reactive Feedback Engine** - Signal-backed `cll-alert`, `AlertService`, and global `ToastService` with action
  buttons.
- 🧙 **Async Timeline Wizard** - `cll-timeline-wizard` with step-level async validation, guard hooks, and reactive
  progress.
- 📝 **Modern Form Controls** - Native `ControlValueAccessor` components: `cll-file-reader` (drag-and-drop file upload)
  & `cll-key-value-inputs`.
- 🌓 **Zero-Config Theming** - `cll-theme-toggle` seamlessly flips Clarity light/dark themes with instant `localStorage`
  persistence.
- 🌍 **Built-in 12+ Language Localization** - Zero external dependencies needed; supports English, 简体中文, 繁體中文,
  Deutsch, Español, Français, Italiano, 日本語, 한국어, Nederlands, and Português out of the box.
- 📦 **100% Standalone & Tree-Shakable** - Built for Angular Signals and `OnPush` change detection.

---

## 🚀 Quick Start (60 Seconds)

### 1. Install

```bash
npm install clr-lift ngx-lift @clr/angular @clr/ui
```

### 2. Add Clarity Styles

```scss
// styles.scss
@import '@clr/ui/clr-ui.min.css';
```

### 3. Use in Your Standalone Component

```typescript
import {Component, inject, signal} from '@angular/core';
import {AlertComponent, ToastService, ThemeToggleComponent} from 'clr-lift';

@Component({
  selector: 'app-dashboard',
  imports: [AlertComponent, ThemeToggleComponent],
  template: `
    <header class="flex justify-between p-4">
      <h2>Cluster Overview</h2>
      <cll-theme-toggle />
    </header>

    <main class="p-4">
      @if (errorMessage()) {
        <cll-alert [error]="errorMessage()" [clrAlertClosable]="true" />
      }

      <button class="btn btn-primary" (click)="notifySuccess()">Dispatch Notification</button>
    </main>
  `,
})
export class DashboardComponent {
  private toastService = inject(ToastService);
  readonly errorMessage = signal<string | null>(null);

  notifySuccess(): void {
    this.toastService.success('Cluster backup initiated successfully!');
  }
}
```

---

## 🌟 Flagship Features

### 1. `dgState` — Server-Driven Datagrids without the Headache

Clarity's default `(clrDgRefresh)` fires on every filter and pagination tick, causing jarring UI flickers and
out-of-order race conditions. `dgState` manages debouncing, state caching, and cancellation automatically:

```typescript
import {Component, inject} from '@angular/core';
import {ClrDatagridStateInterface} from '@clr/angular';
import {dgState} from 'clr-lift';
import {UserService} from './user.service';

@Component({
  selector: 'app-users-grid',
  template: `
    <clr-datagrid (clrDgRefresh)="usersState.refresh($event)" [clrDgLoading]="usersState.isLoading()">
      <clr-dg-column>Name</clr-dg-column>
      <clr-dg-column>Email</clr-dg-column>

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

### 2. `cll-timeline-wizard` — Declarative Multi-Step Workflows

Build complex provisioning wizards with per-step asynchronous validation:

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

### 3. `cll-file-reader` — Native Form-Controlled File Ingestion

No need to mess with native `<input type="file">` change events or manual Base64 reading:

```html
<clr-input-container>
  <label>Upload TLS Certificate</label>
  <cll-file-reader [formControl]="certFileControl" accept=".pem,.crt" readAs="text" [maxSizeMb]="5" />
</clr-input-container>
```

---

## 🧩 Component & Operator Quick Reference

| Category           | Export                         | Selector / API             | Description                                                                               |
| :----------------- | :----------------------------- | :------------------------- | :---------------------------------------------------------------------------------------- |
| **Datagrid**       | `dgState`                      | Operator / Utility         | Flicker-free reactive datagrid state manager with debounce & race-condition cancellation. |
| **Feedback**       | `AlertComponent`               | `cll-alert`                | Intelligent alert container with auto-unwrapping for `Error` and `HttpErrorResponse`.     |
|                    | `AlertContainerComponent`      | `cll-alert-container`      | Multi-alert reactive stack controlled declaratively by `AlertService`.                    |
|                    | `ToastService`                 | Injectable Service         | Global toast dispatcher supporting `success`, `error`, `warning`, `info`.                 |
|                    | `ToastContainerComponent`      | `cll-toast-container`      | Root toast overlay host with positioning and auto-dismiss timing.                         |
|                    | `SpinnerComponent`             | `cll-spinner`              | Center-aligned, sized (`sm`, `md`, `lg`), accessible loading spinner.                     |
|                    | `StatusIndicatorComponent`     | `cll-status-indicator`     | Semantic operational state badges (`success`, `warning`, `error`, `pending`).             |
| **Navigation**     | `TimelineWizardComponent`      | `cll-timeline-wizard`      | Multi-step asynchronous wizard with timeline navigation and async step hooks.             |
|                    | `PageContainerComponent`       | `cll-page-container`       | Standardized header, breadcrumb, action bar, and content responsive shell.                |
| **Forms**          | `FileReaderComponent`          | `cll-file-reader`          | `ControlValueAccessor` drag-and-drop file ingestion (Text, DataURL, ArrayBuffer).         |
|                    | `KeyValueInputsComponent`      | `cll-key-value-inputs`     | Dynamic key-value label/environment variable editor with duplicate key validation.        |
| **Theming & i18n** | `ThemeToggleComponent`         | `cll-theme-toggle`         | Light/dark theme switch with Clarity token synchronization & persistence.                 |
|                    | `TranslationService`           | Injectable Service         | Built-in localization service supporting 12+ enterprise locales without external libs.    |
|                    | `TranslatePipe`                | `translate`                | Reactive pipe for localized component labels and messages.                                |
| **Overlays**       | `CalloutComponent`             | `cll-callout`              | Lightweight contextual notice box with subtle borders.                                    |
|                    | `CertificateSignpostComponent` | `cll-certificate-signpost` | Interactive X.509 certificate inspector showing SAN, expiry, and issuer details.          |
|                    | `TooltipDirective`             | `[cllTooltip]`             | Dynamic declarative popover tooltip.                                                      |

---

## 🌍 Built-in Localization

All interactive messages, placeholders, and labels in `clr-lift` are fully localized in:

| English (`en`)     | 简体中文 (`zh-CN`)    | 繁體中文 (`zh-TW`)            | Deutsch (`de`)     |
| :----------------- | :-------------------- | :---------------------------- | :----------------- |
| **Español (`es`)** | **Français (`fr`)**   | **Italiano (`it`)**           | **日本語 (`ja`)**  |
| **한국어 (`ko`)**  | **Nederlands (`nl`)** | **Português (`pt`, `pt-BR`)** | **Русский (`ru`)** |

Switch language on the fly via `TranslationService`:

```typescript
const translationService = inject(TranslationService);

// Change locale at runtime - all clr-lift components react immediately!
translationService.setLanguage('zh-CN');
```

---

## 🧪 Testing

`clr-lift` is built with 100% test focus. When testing components that consume `clr-lift`:

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

## 📄 License

MIT © [Guanghui Wang](https://github.com/wghglory)

## Lifecycle and production contracts

See [service scoping, clocks, localization and query diagnostics](../../docs/guides/demo-and-library-integration.md) for
ownership and loading contracts.
