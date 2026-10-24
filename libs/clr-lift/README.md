<div align="center">

# 🎨 clr-lift

**Enterprise Angular components, utilities, and operators built on Clarity Design System**

[![npm version](https://img.shields.io/npm/v/clr-lift.svg?logo=npm)](https://www.npmjs.com/package/clr-lift)
[![npm downloads](https://img.shields.io/npm/dm/clr-lift.svg)](https://www.npmjs.com/package/clr-lift)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Angular](https://img.shields.io/badge/Angular-%3E%3D21.0.0-red.svg)](https://angular.dev)
[![Clarity](https://img.shields.io/badge/Clarity-%3E%3D18.0.0-blue.svg)](https://clarity.design)

[📖 Documentation](https://ngx-lift.vercel.app/clr-lift) • [🎮 Live Demo](https://ngx-lift.vercel.app/clr-lift) •
[💻 GitHub Repository](https://github.com/wghglory/ngx-lift-workspace)

</div>

---

**clr-lift** supercharges VMware's **Clarity Design System** with battle-tested enterprise primitives. It fills the gaps
in standard Clarity by delivering flicker-free datagrid state management, reactive notification systems, async
multi-step wizards, type-safe form controls, zero-config dark mode, and built-in localization.

```html
<!-- Enhanced Clarity alert with automatic Error/HttpErrorResponse extraction -->
<cll-alert [error]="userError()" [isLightweight]="true" />

<!-- Zero-config light/dark theme switcher -->
<cll-theme-toggle />
```

---

This README follows the main branch. Check the
[release history](https://github.com/wghglory/ngx-lift-workspace/blob/main/CHANGELOG.md) for availability in your
installed version; source changes under Unreleased are not yet on npm.

## ⚡ Highlights

- ⚡ **Flicker-Free Datagrids** - `dgState()` debounces filter changes and suppresses duplicate datagrid states. Pair it
  with `switchMap` to cancel superseded reads.
- 🔔 **Reactive Feedback Engine** - Signal-backed `cll-alert`, `AlertService`, and global `ToastService` with action
  buttons.
- 🧙 **Async Timeline Wizard** - `cll-timeline-wizard` with step-level async validation, guard hooks, and reactive
  progress.
- 📝 **Modern Form Controls** - `cll-file-reader` reads text through `ControlValueAccessor`; `cll-key-value-control`
  edits typed key/value arrays through ngModel, typed Reactive Forms and toSignalForm. `cll-key-value-inputs` edits a
  caller-owned `FormArray`. Neither uploads files to a server.
- 🌓 **Zero-Config Theming** - `cll-theme-toggle` seamlessly flips Clarity light/dark themes with instant `localStorage`
  persistence.
- 🌍 **Built-in Localization** - Component dictionaries include English, 简体中文, 繁體中文, Deutsch, Español, Français,
  Italiano, 日本語, 한국어, Nederlands, and Português out of the box.
- 📦 **100% Standalone & Tree-Shakable** - Built for Angular Signals and `OnPush` change detection.

---

## Breadcrumb navigation

Import `BreadcrumbComponent` and `BreadcrumbItem` from `clr-lift`. Supply a readonly list ordered from root to current
location. Ancestors with `href` render ordinary links; addressless ancestors emit their original item through
`(navigate)`. The final item always renders noninteractive current text. An empty list renders no landmark.

```html
<cll-breadcrumb [items]="items" ariaLabel="Database" />
```

```ts
const items: readonly BreadcrumbItem[] = [
  {id: 'database', label: 'Database', href: '/database'},
  {id: 'servers', label: 'Sql servers', href: '/database/servers'},
  {id: server.id, label: server.name},
];
```

Optional `context` supplies display detail; otherwise descriptions include the ordered display trail and localized
depth. IDs must be unique, labels nonblank and supplied destinations valid. Relative and http/https/mailto/tel/ftp
destinations are supported. Duplicate IDs, blank labels, blank navigation names and invalid URLs throw developer
diagnostics.

For SPA routing pass `[linkTemplate]="spaLink"`, with `<ng-template #spaLink let-item>` containing your real RouterLink
anchor. `BreadcrumbLinkContext` exposes the original item as `$implicit`. Import RouterLink in the host; clr-lift adds
no router peer. Style the consumer-owned anchor with inherited font size and line height. Use `display: block`,
`overflow: hidden` and `text-overflow: ellipsis` to keep its clickable bounds inside the available label width, and an
inset focus outline (`outline-offset: -2px`) so clipping preserves the focus indicator.

Set `--cll-breadcrumb-font-size` on an instance or ancestor, including through Angular
`[style.--cll-breadcrumb-font-size]="'1rem'"`. The default uses Clarity inline typography. See the canonical
specification below for responsive ancestry behavior.

`maxVisible` defaults to four actual path items, including root/current and excluding disclosure. Available width and
current typography can remove recent ancestors. The anchored nonmodal details panel preserves complete ordered ancestry,
full labels/context and ordinary link behavior without expanding the page. It also appears when truncation alone hides
text, including on a singleton. Keep supplied arrays immutable and stable between path replacements. Escape and explicit
close return to the trigger; external path replacement leaves route focus to the host. Measurement runs only in the
browser; unmeasured rendering uses the count ceiling. SSR/hydration support has not been exercised.

For exact bucket/prefix/object state, opt in to `buildObjectPathBreadcrumbs` with `BuildObjectPathBreadcrumbsOptions`
and `ObjectPathLocation`. It constructs stable IDs, display labels and exact cumulative contexts synchronously;
`hrefFor` owns destinations and `rootPrefix` excludes higher ancestors. Compose translated application items outside the
helper. See the [usage and reference guide](../../docs/guides/object-path-breadcrumbs.md) for scope, encoding, unusual
keys and API-response examples.

See the [working demo](https://ngx-lift.vercel.app/clr-lift/components/breadcrumb) and
[canonical design spec](../../docs/design/clr-lift/breadcrumb-design-spec.md).

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

### 3. Enable Clarity animation support

Clarity controls such as the datagrid inject Angular's animation builder. Install `@angular/animations` at the same
version as your app's `@angular/core`, then add its provider to your existing application configuration:

```typescript
import {ApplicationConfig} from '@angular/core';
import {provideAnimations} from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [provideAnimations()],
};
```

Pass `appConfig` to `bootstrapApplication(AppComponent, appConfig)` in `main.ts`. Keep your existing Router/HTTP
providers. Angular 21 marks this API deprecated, but current Clarity controls still require it; follow Clarity's
compatibility requirements when upgrading.

### 4. Use in Your Standalone Component

Mount one toast container in the application shell. This standalone root example displays a notification when its button
is clicked; no backend or application service is required.

```typescript
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {AlertComponent, ToastContainerComponent, ToastService, ThemeToggleComponent} from 'clr-lift';

@Component({
  selector: 'app-root',
  imports: [AlertComponent, ToastContainerComponent, ThemeToggleComponent],
  template: `
    <main cds-layout="vertical gap:md">
      <cll-theme-toggle />
      <cll-alert alertType="info" content="Ready to build with clr-lift." />
      <button type="button" class="btn btn-primary" (click)="notifySuccess()">Show notification</button>
    </main>
    <cll-toast-container />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private readonly toastService = inject(ToastService);

  notifySuccess(): void {
    this.toastService.success({title: 'Saved', description: 'Your changes were saved.'});
  }
}
```

For HTTP errors, bind an `Error` or `HttpErrorResponse` to `[error]`; use `content` for a text message. The animation
setup above also applies to the datagrid example below.

---

## 🌟 Flagship Features

### 1. `dgState` — Datagrid refresh streams

`dgState()` is an RxJS operator, not a resource factory. It delays changed filters by 500 ms and suppresses duplicate
states by default. The application owns requests, loading/error state, and subscription cleanup.

```typescript
import {AsyncPipe, JsonPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ClarityModule, ClrDatagridStateInterface} from '@clr/angular';
import {dgState} from 'clr-lift';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-grid-state',
  imports: [AsyncPipe, JsonPipe, ClarityModule],
  template: `
    <clr-datagrid (clrDgRefresh)="refresh$.next($event)">
      <clr-dg-column [clrDgField]="'name'">Name</clr-dg-column>
      <clr-dg-row><clr-dg-cell>Ada</clr-dg-cell></clr-dg-row>
    </clr-datagrid>
    <pre>{{ state$ | async | json }}</pre>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridStateComponent {
  readonly refresh$ = new BehaviorSubject<ClrDatagridStateInterface | null>(null);
  readonly state$ = this.refresh$.pipe(dgState());
}
```

Click the Name column heading to change sorting and display the emitted grid state. For server requests, follow the
[complete datagrid example](https://ngx-lift.vercel.app/clr-lift/operators/dgState).

### 2. `cll-timeline-wizard` — Component-based steps

The wizard takes `[timelineSteps]`, an array of `TimelineStep` configurations. Each step renders a component extending
`TimelineBaseComponent`; its Reactive Forms group owns validity and its `next$` owns optional async advancement.
`confirmed` precedes the final async action; `finished` follows success. Persisting from both outputs duplicates work.

Start with the [complete wizard demo](https://ngx-lift.vercel.app/clr-lift/components/timeline-wizard), including step
classes, required initial state, form setup and failure recovery. Content templates and `cllStepContent` are not APIs.

### 3. `cll-file-reader` — Read text into a form

Select a PEM/text file to read its text into the control. `maxSize` is in MiB; `acceptFiles` is a file-chooser hint. Set
`encoded` for base64 text, with UTF-8 by default or explicit `textEncoding="latin1"` for legacy byte strings. The
component does not upload files, return DataURLs/ArrayBuffers, or provide drag-and-drop handling.

```typescript
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {FileReaderComponent} from 'clr-lift';

@Component({
  selector: 'app-certificate-import',
  imports: [ReactiveFormsModule, FileReaderComponent],
  template: `
    <label for="certificate-file">Certificate file</label>
    <cll-file-reader controlId="certificate-file" [formControl]="content" acceptFiles=".pem,.crt" [maxSize]="5" />
    <pre>{{ content.value }}</pre>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificateImportComponent {
  readonly content = new FormControl('', {nonNullable: true});
}
```

---

## 🧩 Component & Operator Quick Reference

| Category           | Export                         | Selector / API             | Description                                                                                             |
| :----------------- | :----------------------------- | :------------------------- | :------------------------------------------------------------------------------------------------------ |
| **Datagrid**       | `dgState`                      | Operator / Utility         | RxJS state operator; debounces filters and optionally suppresses duplicates.                            |
| **Feedback**       | `AlertComponent`               | `cll-alert`                | Intelligent alert container with auto-unwrapping for `Error` and `HttpErrorResponse`.                   |
|                    | `AlertContainerComponent`      | `cll-alert-container`      | Multi-alert reactive stack controlled declaratively by `AlertService`.                                  |
|                    | `ToastService`                 | Injectable Service         | Global toast dispatcher supporting `success`, `error`, `warning`, `info`.                               |
|                    | `ToastContainerComponent`      | `cll-toast-container`      | Root toast overlay host with positioning and auto-dismiss timing.                                       |
|                    | `SpinnerComponent`             | `cll-spinner`              | Center-aligned, sized (`sm`, `md`, `lg`), accessible loading spinner.                                   |
|                    | `StatusIndicatorComponent`     | `cll-status-indicator`     | Semantic operational state badges (`success`, `warning`, `error`, `pending`).                           |
| **Navigation**     | `TimelineWizardComponent`      | `cll-timeline-wizard`      | Multi-step asynchronous wizard with timeline navigation and async step hooks.                           |
| **Navigation**     | `BreadcrumbComponent`          | `cll-breadcrumb`           | Caller-owned ordinary/SPA links, current-location text and addressless navigation; unreleased.          |
|                    | `PageContainerComponent`       | `cll-page-container`       | Standardized header, breadcrumb, action bar, and content responsive shell.                              |
| **Forms**          | `FileReaderComponent`          | `cll-file-reader`          | Text/base64 string CVA with size validation and read cancellation.                                      |
|                    | `KeyValueInputsComponent`      | `cll-key-value-inputs`     | Caller-owned FormArray editor with duplicate key validation; not a CVA.                                 |
|                    | `KeyValueControlComponent`     | `cll-key-value-control`    | Ordered array CVA with text/select/typed editors, custom validation, unique pairs and form integration. |
| **Theming & i18n** | `ThemeToggleComponent`         | `cll-theme-toggle`         | Light/dark theme switch with Clarity token synchronization & persistence.                               |
|                    | `TranslationService`           | Injectable Service         | Runtime language selection, dictionary registration and fallback.                                       |
|                    | `TranslatePipe`                | `translate`                | Reactive pipe for localized component labels and messages.                                              |
| **Overlays**       | `CalloutComponent`             | `cll-callout`              | Lightweight contextual notice box with subtle borders.                                                  |
|                    | `CertificateSignpostComponent` | `cll-certificate-signpost` | Interactive X.509 certificate inspector showing SAN, expiry, and issuer details.                        |
|                    | `TooltipDirective`             | `[cllTooltip]`             | Dynamic declarative popover tooltip.                                                                    |
| **Development**    | `QueryDevtoolsComponent`       | `cll-query-devtools`       | Resizable query panel with data/error inspection, row actions and a development-only root provider.     |

**Available in clr-lift 21.3.0:** the inspector and `clr-lift/devtools` entry point below are included in this release.
Upgrade from 21.2.0 before copying this setup. Register once in `app.config.ts`:

```typescript
import {ApplicationConfig} from '@angular/core';
import {provideQueryDevtools} from 'clr-lift/devtools';

export const appConfig: ApplicationConfig = {
  providers: [provideQueryDevtools()],
};
```

The development launcher opens a resizable, nonmodal bottom panel. Search/filter/sort/paginate queries, inspect data,
errors and tags, copy keys, and explicitly refetch one query. Data previews are bounded, expandable and read-only. With
ngx-lift 21.3, inspection is available; Refetch controls require a client exposing `refetchQuery`. Automatic snapshots
run only while open and unpaused. `provideQueryClient()` is needed only to customize client settings. The package's
production condition resolves to a no-op and excludes the inspector implementation.

For scoped clients or inline placement, import `QueryDevtoolsComponent` and use
`<cll-query-devtools [client]="scopedQueryClient" />`. The caller retains client ownership. `launcher="floating"`
selects the icon launcher. `[enabled]="true"` deliberately enables a direct component import outside development, as in
the documentation preview; that opt-in bypasses the provider's production exclusion. See the
[design spec](https://github.com/wghglory/ngx-lift-workspace/blob/main/docs/design/clr-lift/query-devtools-design-spec.md).

---

## 🌍 Built-in Localization

Library dictionaries cover English, Simplified/Traditional Chinese, German, Spanish, French, Italian, Japanese, Korean,
Dutch, Portuguese and Russian, with regional fallback. The demo maintains eleven language dictionaries; its locale
inventory differs from the library dictionaries. Key/placeholder checks establish dictionary completeness; independent
native-speaker acceptance remains separate. Applications own translations for their content and can register additional
dictionaries.

Switch language on the fly via `TranslationService`:

```typescript
// Inside a component/service injection context.
import {inject} from '@angular/core';
import {TranslationService} from 'clr-lift';

const translationService = inject(TranslationService);

// Change locale at runtime - all clr-lift components react immediately!
translationService.setLanguage('zh-CN');
```

---

## 🧪 Testing

When testing components that consume `clr-lift`, import the component under test. For example, a standalone alert needs
no application-specific provider:

```typescript
import {TestBed} from '@angular/core/testing';
import {beforeEach} from 'vitest';
import {AlertComponent} from 'clr-lift';

beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [AlertComponent],
  }).compileComponents();
});
```

---

## 📄 License

MIT © [Guanghui Wang](https://github.com/wghglory)

## Lifecycle and production contracts

See
[service scoping, clocks, localization and query diagnostics](https://github.com/wghglory/ngx-lift-workspace/blob/main/docs/guides/demo-and-library-integration.md)
for ownership and loading contracts.

See the [key/value usage and design spec](../../docs/design/clr-lift/key-value-inputs-design-spec.md#usage) for selects,
dependent options, typed values, validation and migration.
