<div align="center">

# 🎨 clr-lift

**Production-ready Angular components built on Clarity Design System**

[![npm version](https://img.shields.io/npm/v/clr-lift.svg?logo=npm)](https://www.npmjs.com/package/clr-lift)
[![npm downloads](https://img.shields.io/npm/dm/clr-lift.svg)](https://www.npmjs.com/package/clr-lift)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Angular](https://img.shields.io/badge/Angular-%3E%3D19.0.0-red.svg)](https://angular.io)
[![Clarity](https://img.shields.io/badge/Clarity-%3E%3D17.0.0-blue.svg)](https://clarity.design)

[📖 Documentation](https://ngx-lift.netlify.app/clr-lift) • [🎮 Live Demo](https://ngx-lift.netlify.app/clr-lift) •
[💻 Source Code](https://github.com/wghglory/ngx-lift-workspace/tree/main/libs/clr-lift)

</div>

---

A comprehensive Angular component library built on top of the **Clarity Design System**. **clr-lift** extends Clarity's
capabilities by providing a rich set of production-ready, reusable components, utilities, and operators that simplify
common development tasks.

**Why clr-lift?**

- 🎨 **15+ Components** - Alerts, toasts, wizards, spinners, and more
- 🏗️ **Built on Clarity** - Consistent with VMware Clarity Design System
- ♿ **Accessible** - WCAG compliant with ARIA support
- 🎯 **Type-Safe** - Full TypeScript support with strict mode
- 🌓 **Theme Support** - Light and dark mode out of the box
- 📦 **Tree-Shakable** - Import only what you need

## Features

### 🎨 Components

- **`cll-alert`** - Enhanced alert component with customizable types and styling
- **`cll-alerts`** - Alert container service for managing multiple alerts
- **`cll-callout`** - Callout component for highlighting important information
- **`cll-certificate-signpost`** - Certificate display and validation component
- **`cll-file-reader`** - File input component with drag-and-drop support
- **`cll-idle-detection`** - Idle detection component with configurable timeouts
- **`cll-key-value-inputs`** - Key-value pair input component for forms
- **`cll-page-container`** - Page layout container component
- **`cll-spinner`** - Loading spinner component
- **`cll-status-indicator`** - Status indicator component with various states
- **`cll-theme-toggle`** - Theme toggle component for light/dark mode
- **`cll-timeline-wizard`** - Timeline wizard component for multi-step flows
- **`cll-toast`** - Toast notification component
- **`cll-tooltip`** - Advanced tooltip component with rich content support

### 🔧 Operators

- **`dgState`** - Streamlines Clarity datagrid state management, making it easier to work with datagrid state changes

### 🛠️ Utilities

- **`convertToHttpParams`** - Converts Clarity datagrid state to HTTP query parameters
- **Datagrid Utilities** - Helper functions for working with Clarity datagrids

### 📦 Models

- **`PageQuery`** - Type for pagination query parameters
- **`Rde`** - Type for RDE (Resource Definition Entity) objects

### 🌐 Services

- **`TranslationService`** - Service for managing translations and i18n

### 🔤 Pipes

- **`translate`** - Translation pipe for displaying translated text

## Requirements

- **Angular**: >= 19.0.0
- **@clr/angular**: >= 17.0.0
- **@cds/core**: >= 6.0.0
- **ngx-lift**: >= 19.0.0
- **RxJS**: >= 7.8.0

## Installation

Install clr-lift and its peer dependencies:

```bash
npm install clr-lift @clr/angular @cds/core ngx-lift
# or
yarn add clr-lift @clr/angular @cds/core ngx-lift
# or
pnpm add clr-lift @clr/angular @cds/core ngx-lift
```

## 🚀 Quick Start

### Installation

```bash
npm install clr-lift @clr/angular @cds/core ngx-lift
# or
yarn add clr-lift @clr/angular @cds/core ngx-lift
# or
pnpm add clr-lift @clr/angular @cds/core ngx-lift
```

### Using the dgState Operator

**Simplified Datagrid State Management** - Streamline Clarity datagrid state handling:

```typescript
import {dgState, convertToHttpParams} from 'clr-lift';
import {BehaviorSubject, switchMap, share} from 'rxjs';
import {ClrDatagridStateInterface} from '@clr/angular';

export class UserDatagridComponent {
  private dgSource = new BehaviorSubject<ClrDatagridStateInterface | null>(null);
  private dgState$ = this.dgSource.pipe(dgState());

  usersState$ = this.dgState$.pipe(
    switchMap((state) => {
      const params = convertToHttpParams(state);
      return this.userService.getUsers(params);
    }),
    share(),
  );

  refresh(state: ClrDatagridStateInterface) {
    this.dgSource.next(state);
  }
}
```

### Using Components

**Standalone Components** - Import only what you need:

```typescript
import {Component} from '@angular/core';
import {AlertComponent, SpinnerComponent, PageContainerComponent, ToastService} from 'clr-lift';

@Component({
  selector: 'app-example',
  imports: [AlertComponent, SpinnerComponent, PageContainerComponent],
  template: `
    <cll-alert [type]="'success'" [closable]="true"> Operation completed successfully! </cll-alert>

    <cll-spinner [size]="'lg'"></cll-spinner>

    <cll-page-container>
      <h1>Page Content</h1>
    </cll-page-container>

    <button (click)="showToast()">Show Toast</button>
  `,
})
export class ExampleComponent {
  private toastService = inject(ToastService);

  showToast() {
    this.toastService.show({
      type: 'success',
      message: 'Operation completed!',
    });
  }
}
```

### Using File Reader Component

```html
<cll-file-reader
  [(ngModel)]="file"
  [accept]="'.pdf,.doc,.docx'"
  [maxSize]="5242880"
  [multiple]="false"
></cll-file-reader>
```

### Using Theme Toggle

```html
<cll-theme-toggle></cll-theme-toggle>
```

### Using Timeline Wizard

```html
<cll-timeline-wizard
  [steps]="wizardSteps"
  [currentStep]="currentStep"
  (stepChange)="onStepChange($event)"
></cll-timeline-wizard>
```

## 📚 Documentation

- **📖 Full Documentation**: [ngx-lift.netlify.app/clr-lift](https://ngx-lift.netlify.app/clr-lift)
- **🎮 Interactive Demo**: [Live Examples](https://ngx-lift.netlify.app/clr-lift)
- **💻 Source Code**: [GitHub Repository](https://github.com/wghglory/ngx-lift-workspace/tree/main/libs/clr-lift)
- **📦 npm Package**: [npmjs.com/package/clr-lift](https://www.npmjs.com/package/clr-lift)
- **🎨 Clarity Design System**: [clarity.design](https://clarity.design)

## 🎯 Use Cases

**clr-lift** is perfect for:

- 🎨 **UI Components** - Production-ready components for Clarity-based applications
- 📊 **Data Grids** - Simplified state management for Clarity datagrids
- 🔔 **Notifications** - Toast notifications and alerts
- 📝 **Forms** - Enhanced form components (file uploads, key-value inputs)
- 🧭 **Navigation** - Wizards, timelines, and multi-step flows
- 🎭 **Theming** - Easy theme switching between light and dark modes

## 🧪 Testing

Run the unit tests for clr-lift:

```bash
nx test clr-lift
```

Run tests with coverage:

```bash
nx test clr-lift --coverage
```

## 🤝 Contributing

We welcome contributions! Whether you're fixing bugs, adding features, or improving documentation, your help makes this
project better.

- 🐛 **Found a bug?** [Open an issue](https://github.com/wghglory/ngx-lift-workspace/issues/new?template=bug_report.md)
- 💡 **Have a feature request?**
  [Request a feature](https://github.com/wghglory/ngx-lift-workspace/issues/new?template=feature_request.md)
- 📝 **Want to contribute?** See our
  [Contributing Guidelines](https://github.com/wghglory/ngx-lift-workspace/blob/main/CONTRIBUTING.md)

## 📄 License

**clr-lift** is licensed under the [MIT License](https://opensource.org/licenses/MIT).

## 🙏 Acknowledgments

We would like to express our gratitude to the **Clarity Design System** maintainers and contributors for their
foundational work that enables the development of **clr-lift**.

## ⭐ Show Your Support

If this library helped you, please consider giving it a ⭐ on GitHub!

---

<div align="center">

**Made with ❤️ for the Angular and Clarity community**

[Report Bug](https://github.com/wghglory/ngx-lift-workspace/issues) •
[Request Feature](https://github.com/wghglory/ngx-lift-workspace/issues) •
[View Documentation](https://ngx-lift.netlify.app/clr-lift)

</div>
