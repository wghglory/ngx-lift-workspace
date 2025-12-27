# clr-lift

A comprehensive Angular component library built on top of the Clarity Design System. clr-lift extends Clarity's
capabilities by providing a rich set of reusable components, utilities, and operators that simplify common development
tasks.

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

## Quick Start

### Using the dgState Operator

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

```typescript
import {Component} from '@angular/core';
import {ClrLiftModule} from 'clr-lift';

@Component({
  selector: 'app-example',
  imports: [ClrLiftModule],
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
  showToast() {
    // Use toast service to show notifications
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

## Documentation

- **Demo Site**: [https://ngx-lift.netlify.app/clr-lift](https://ngx-lift.netlify.app/clr-lift)
- **Source Code**:
  [https://github.com/wghglory/ngx-lift-workspace/tree/main/libs/clr-lift](https://github.com/wghglory/ngx-lift-workspace/tree/main/libs/clr-lift)
- **GitHub Repository**:
  [https://github.com/wghglory/ngx-lift-workspace](https://github.com/wghglory/ngx-lift-workspace)
- **Clarity Design System**: [https://clarity.design](https://clarity.design)

## Running Tests

Run the unit tests for clr-lift:

```bash
nx test clr-lift
```

## Contributing

We welcome contributions! If you encounter any issues, have feature requests, or would like to contribute code, please
check out our [contribution guidelines](https://github.com/wghglory/ngx-lift-workspace/CONTRIBUTING.md).

## License

**clr-lift** is licensed under the MIT License.

## Acknowledgments

We would like to express our gratitude to the Clarity Design System maintainers and contributors for their foundational
work that enables the development of **clr-lift**.

---

Feel free to explore the **clr-lift** library and enhance your Clarity-based Angular applications! If you have any
questions or concerns, please don't hesitate to reach out to us.

Happy coding! 🚀
