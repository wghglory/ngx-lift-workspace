# Alert closable design specification

Status: Draft (API review pending). Owner: clr-lift maintainers. Updated: 2026-11-07. Approval: pending. Package:
clr-lift. All proposed symbols and examples are unavailable until implemented and verified. For existing APIs, use
Status: Implemented (contract audit) once verified.

## Applicable contracts

This change is a rendered-UI addition to the existing `AlertComponent` (`cll-alert`). Clarity tokens, keyboard/focus,
accessible names, responsive layout, and localization apply. There is no form value: `cll-alert` is a display component,
so the forms contract does not apply. The change reuses the same `alert.close` dictionary entry already used by
`cll-alert-container` (service-based alerts).

## Background

`cll-alert` is a thin wrapper over Clarity's `clr-alert`. Today it does not bind `clrAlertClosable`, `clrAlertClosed`,
or `clrCloseButtonAriaLabel` (see `libs/clr-lift/src/lib/components/alert/alert.component.ts` and `.html`). Because
Clarity's `clrAlertClosable` defaults to `true`, the close button already renders — but with Clarity's built-in English
common string as the accessible name, not the repository's localized `alert.close`. The service-based
`cll-alert-container` already wires all three correctly
(`libs/clr-lift/src/lib/components/alerts/alert-container.component.html`), so this spec brings the standalone wrapper
to parity and exposes explicit, documented control.

## Terminology

- **Closable**: a close ("×") control is rendered; the user can dismiss the alert.
- **Closed**: the alert is removed from the view. In Clarity, `clr-alert` uses `@if (!_closed)` so closing removes the
  alert element from the DOM until reopened.
- **Reopen**: setting the controlled `closed` state back to `false` shows the alert again.

## Goals

- G1: Let developers opt in/out of the close button on `cll-alert` (`closable`).
- G2: Let the host observe the user dismissing the alert (`closedChange`) and reopen it programmatically (`[(closed)]`).
- G3: Provide a localized, screen-reader-visible name for the close button in all supported languages.

## Non-Goals

### Not now

- A custom close button visual (keep Clarity's native "×" styling).
- Auto-dismiss timers or toast-like expiry (owned by `ToastService`, not `AlertComponent`).
- Service/container changes: `cll-alert-container` already supports close and is out of scope.

### Outside this API

- HTTP retry ownership, domain error classification, and submitting forms remain outside `cll-alert`.

## Use cases and acceptance

| ID  | Actor and task          | Initial state/action               | Action                   | Observable outcome                                                    | Failure/recovery | Demo/test                     |
| --- | ----------------------- | ---------------------------------- | ------------------------ | --------------------------------------------------------------------- | ---------------- | ----------------------------- |
| UC1 | Dev shows default alert | `<cll-alert [content]="msg" />`    | Inspect close button     | Close button visible; accessible name localized (`alert.close`)       | n/a              | alert-demo example; unit/a11y |
| UC2 | Dev hides close button  | `[closable]="false"`               | Inspect                  | No close button; alert stays visible                                  | n/a              | alert-demo example; unit      |
| UC3 | User closes alert       | Closable alert rendered            | Click/Enter on close     | Alert removed from view; `closedChange` emits `true`; `closed`=`true` | n/a              | unit + E2E + a11y             |
| UC4 | Host reopens alert      | `[(closed)]` bound; user closed it | Host sets `closed=false` | Alert appears again; `closedChange` emits `false`                     | n/a              | unit                          |
| UC5 | Keyboard/screen reader  | Closable alert rendered            | Tab to button, Enter     | Button focusable, visible focus, announced as localized "Close"       | n/a              | E2E + a11y scan (light/dark)  |

## Industry evidence and current gaps

| Existing implementation / primary source                                                                           | Verified behavior                                                                                                                                                                                                                                                                                                           | Adopt, adapt, or reject | Our gap and reason                                                                                                                                |
| ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Clarity `clr-alert` (local `@clr/angular` 18.4.0 / fesm2022; `clr-angular-emphasis-alert.d.ts`)                    | `clrAlertClosable` default **true**; `clrAlertClosed` two-way default `false`; `clrAlertClosedChange` emits `true` on close, `false` on reopen; `clrCloseButtonAriaLabel` default is Clarity's built-in "Close alert"; close button only rendered when `closable`; `@if(!_closed)` removes the alert from the DOM on close. | Adopt                   | `cll-alert` never bound these; default already closable but aria-label was unlocalized.                                                           |
| NG-ZORRO `nz-alert` (web search of official doc)                                                                   | `nzCloseable` (optional, no close button by default); `nzCloseText` custom close label; `nzOnClose` callback on close (returning `false` cancels removal); `nzAfterClose`.                                                                                                                                                  | Adapt                   | We expose an explicit `closable` default `true` (matching current Clarity behavior) and a `closedChange` output instead of a cancelable callback. |
| Angular Material (no standalone alert; closest patterns are `MatSnackBar` dismiss action and `mat-chip` removable) | Dismissible surfaces expose a button with an `aria-label` and an `(removed)`/`dismissed` event; no boolean "alert" component.                                                                                                                                                                                               | Reference only          | Confirms the close-button + accessible-name + dismissal-event pattern, which we already follow via Clarity.                                       |

Research note: live fetches to `clarity.design` and `raw.githubusercontent.com` were blocked in this environment; the
Clarity facts above are taken directly from the installed `@clr/angular` type declarations and compiled FESM source in
`node_modules`, which is authoritative for the pinned version. NG-ZORRO facts are from search-result excerpts of the
official documentation.

## Developer learning journey and pedagogy plan

Prerequisites: standalone Clarity setup; import `AlertComponent` from `clr-lift`.

| Reader task                             | Learning outcome                              | Destination / working example          | Validation                         |
| --------------------------------------- | --------------------------------------------- | -------------------------------------- | ---------------------------------- |
| Make an alert closable                  | See the close button and dismiss the alert    | alert-demo "Closable alert" playground | Browser: click close removes alert |
| Control close / reopen programmatically | Bind `[(closed)]` and react to `closedChange` | Same demo (advanced snippet)           | Unit: set `closed=false` reopens   |

## Public API and examples

```typescript
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AlertComponent} from 'clr-lift';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AlertComponent],
  templateUrl: './example.html',
})
export class AlertClosableExampleComponent {}
```

```html
<!-- Default: close button visible (closable defaults to true) -->
<cll-alert alertType="info" content="You can dismiss me." />

<!-- Hide the close button -->
<cll-alert alertType="info" content="Persistent notice." [closable]="false" />

<!-- Controlled close + reopen -->
<cll-alert alertType="warning" [content]="msg" [(closed)]="dismissed" (closedChange)="onDismiss($event)" />
<button type="button" (click)="dismissed = false">Show again</button>
```

Inputs/outputs added to `AlertComponent`:

| Name           | Kind       | Type      | Default | Description                                                                          |
| -------------- | ---------- | --------- | ------- | ------------------------------------------------------------------------------------ |
| `closable`     | `input()`  | `boolean` | `true`  | Whether to render the close button. Defaults to `true` to preserve current behavior. |
| `closed`       | `model()`  | `boolean` | `false` | Controlled open/closed state. `false` shows, `true` closes. Supports `[(closed)]`.   |
| `closedChange` | `output()` | `boolean` | —       | Emits `true` when the user closes the alert, `false` when it is reopened.            |

The close button's accessible name binds to the localized `alert.close` entry (already defined in
`libs/clr-lift/src/lib/components/alerts/alert.l10n.ts` and loaded via
`TranslationService.loadTranslationsForComponent('alert', alertTranslations)`). This replaces the previous unlocalized
Clarity default.

## Behavior and architecture

`cll-alert` composes `clr-alert` and only forwards properties and relays the event; it adds no service or state layer:

- `[clrAlertClosable]="closable()"` forwards the flag.
- `[clrAlertClosed]="closed()"` and `(clrAlertClosedChange)="closed.set($event)"` make `closed` a controlled, two-way
  state. Clarity removes the alert from the DOM when `closed` becomes `true`.
- `[clrCloseButtonAriaLabel]="'alert.close' | translate"` localizes the button name.
- `closedChange` re-emits Clarity's `clrAlertClosedChange` so hosts can observe dismiss/reopen without binding the
  model.

Defaults keep current behavior: `closable=true` matches Clarity's default, so existing usages that did not set
`closable` continue to show a close button, now with a localized name. `query-devtools` also uses `AlertComponent`; its
default behavior is unchanged (closable), and its close-button name simply becomes localized (an improvement, not a
break). No new dependency or Clarity feature is introduced.

## Clarity, accessibility, and localization

- Close button is a native `<button type="button">` with `class="close"`, keyboard-focusable, Enter/Space activates
  `close()`. Keep that; do not add custom interaction.
- Provide a localized `aria-label` via `alert.close` for every supported locale: **en, zh-CN, zh-TW, de, es, fr, ja, ko,
  nl, pt-BR, ru**. The `alert.l10n.ts` dictionary already covers these; verify completeness with `pnpm run i18n:check`.
- Visible focus and contrast follow Clarity's existing `.close` styling; verify in light and dark themes.
- Closing removes the alert from the DOM; if the alert was announced via `role="alert"` on inner text, reopening
  re-announces. No extra live-region wiring is required for the standalone case.

## Demo and validation plan

- Add a "Closable alert" playground to `apps/demo/src/app/clr-lib/pages/alert-demo/` showing default close,
  `[closable]="false"`, and a `[(closed)]` reopen example.
- Add an `alertInputs` row for `closable` (type `boolean`, default `true`) in `alert-demo.component.ts`.
- Add demo dictionary keys (example title/description, `closable` input description) across all 11 locales.
- Unit tests (`alert.component.spec.ts`): default close button visible; `[closable]="false"` hides it; clicking close
  emits `closedChange(true)` and sets `closed`; setting `closed=false` reopens; close button has localized `aria-label`.
- Browser E2E + accessibility scan: close button present, focusable, `aria-label` localized, no light/dark regression.

## Compatibility, rollout, and risks

- Supported: Angular `>=21`, Clarity `>=18` (current pin 18.4.0). No peer change.
- Default `closable=true` is backward compatible for rendering; the only observable change is the close button's
  accessible name switching from Clarity's English default to the repository's localized `alert.close`. This is a
  localization improvement, not a breaking change.
- Risk: a host that visually depended on Clarity's exact English "Close alert" string via screenshot tests — low
  likelihood; mitigated by keeping the visual icon/position identical. Acceptance owner: clr-lift maintainers.

## Review decisions and delivery

Open for maintainer review:

- Default `closable=true` (preserves current rendering) — recommended.
- `closed` as `model()` with `closedChange` output — recommended for controlled reopen.

## Evidence

Draft only. No validation has been run yet.
