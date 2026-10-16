# Alerts and toast notifications

Status: Implemented (contract audit with open defects). Owner: clr-lift maintainers. Updated: October 16, 2026. Package:
clr-lift. Approval: existing APIs; maintainer confirmed developer-trusted localized HTML on October 16, 2026.

## Background

[AlertService](../../../libs/clr-lift/src/lib/components/alerts/alert.service.ts) and
[ToastService](../../../libs/clr-lift/src/lib/components/toast/toast.service.ts) retain application notifications for
their containers. Inline `AlertComponent` and documentation `CalloutComponent` have separate presentation roles.

## Terminology

An application alert is persistent until removed. A toast is transient with optional actions/timeout. A Symbol
identifies one notification. The container renders service state; creating a notification does not create an overlay by
itself.

## Goals

- G1: Show actionable application failures and transient outcomes with stable removal identity.
- G2: Keep service state and container interaction distinct, including keyboard-accessible actions.
- G3: Let developers place buttons/links inside localized HTML strings without defining Angular templates.

## Non-Goals

### Not now

A global error interceptor, durable queue, cross-tab sync, notification history or native form fields.

### Outside this API

HTTP retry ownership, domain error classification, and submitting forms.

## Use cases and acceptance

| ID  | Task                      | Initial state/action      | Outcome                                        | Failure/recovery                   | Demo/test                     |
| --- | ------------------------- | ------------------------- | ---------------------------------------------- | ---------------------------------- | ----------------------------- |
| N1  | Report persistent failure | Add alert with action     | Latest alert first; named action runs callback | Delete by Symbol or clear          | alert service/container tests |
| N2  | Show save outcome         | Add toast                 | Typed notification in mounted container        | Manual or timed close removes it   | toast service/component tests |
| N3  | Read/action toast         | Pointer or keyboard focus | Auto-close deferred during interaction         | Mixed focus/hover needs regression | gap register                  |

## Industry evidence and current gaps

Clarity alerts provide severity and close/action presentation. The maintainer explicitly retains developer-authored
localized HTML so translators can place an inline button/link anywhere in a sentence. The existing scoped
`targetSelector`/`onTargetClick` callback supports that contract without a template or slot renderer.
[Angular security guidance](https://angular.dev/best-practices/security) makes bypassing HTML sanitization a trust
boundary. Here it is an intentional developer-trusted HTML API, not an automatically sanitized text API.

## Public API and examples

```typescript
// Catalog value for settings.saveFailed:
// 'Could not save. <button type="button" class="btn btn-link retry-save">Try again</button> to continue.'
// Create in an injection context; retrySave is application-owned.
import {inject} from '@angular/core';
import {AlertService, TranslationService} from 'clr-lift';

const alerts = inject(AlertService);
const i18n = inject(TranslationService);
const alert = alerts.addAlert({
  content: i18n.translate('settings.saveFailed'),
  alertType: 'danger',
  targetSelector: '.retry-save',
  onTargetClick: () => retrySave(),
});
// alerts.deleteAlert(alert.id); alerts.clearAlerts();
```

Alert defaults are danger/app-level; content accepts developer-trusted HTML as string or SafeHtml. Callback functions
stay in TypeScript; the localized markup identifies the target. `targetSelector`/`onTargetClick` remain supported.
Structured `actions` are optional buttons in a separate action area, not a replacement for inline localization. Toast
convenience methods are success, warning, info and error; default type is info. Both services add newest first and
return created identity. They are UI services, not CVAs; forms can invoke them after submission.

## Behavior and architecture

AlertService exposes a computed signal and clears on injector destruction. The container renders content through
innerHTML after the intentional trust bypass. Developers own the markup and any interpolated data. Avoid executable HTML
including script tags, event attributes such as onclick/onerror, and javascript: URLs; omitting script tags alone is
insufficient. Escape user/server values as text before inserting them into trusted markup. TranslationService
interpolation does not perform HTML escaping. Do not pass arbitrary API error text directly as trusted alert content.
Click delegation is scoped to the current alert, handles nested targets and leaves callbacks outside the HTML string. An
added content string is a translation snapshot; changing language does not retranslate an existing service entry.

ToastService uses a BehaviorSubject; its container owns rendering/removal. ToastComponent defaults to 6-second timeout,
with nonpositive timeout disabling auto-close. It defers expiry by another full timeout while its interaction flag is
set. `closed` distinguishes manual close (`true`) from timer (`false`); destruction cancels its timer.

## Clarity, accessibility, and localization

Translated close labels and Clarity severities. Native action buttons provide keyboard semantics. Host owns message and
action translations. Alert container uses role=alert; repeated rapid additions need host-level announcement policy.
Toast hover/focus currently share one flag; leaving one interaction can clear protection for the other.

## Demo and validation plan

Existing alert/toast demos and adjacent specs cover inline buttons, nested delegated clicks, alert scoping, structured
actions, dismissal and timers. Preserve these tests and add localized inline-action examples, including translator
reordering and safely escaped runtime values. Add mixed hover/focus browser tests for the
[open toast fix](../implementation-gaps.md). Do not assert that this developer-trusted HTML path sanitizes hostile
markup automatically.

## Compatibility, rollout, and risks

Angular 21/Clarity; no new dependencies. Service scope controls sharing. Preserve the existing string/SafeHtml and
selector callback APIs. No TemplateRef, named-slot API, mandatory sanitizer or SafeHtml-only migration is required.
Developer-controlled dictionaries must keep markup separate from untrusted runtime data; review interpolation at the
caller boundary rather than silently stripping supported inline buttons.

## Review decisions and delivery

Settled by the maintainer: retain convenient localized HTML strings and TypeScript callbacks. The trust bypass is part
of that documented contract, not a blanket implementation defect. Any unsafe caller interpolation is a separate fix.
Track toast hover/focus independently and verify timeout behavior. Keep interactive API failures visible through alerts;
documentation callouts describe APIs.

## Evidence

Services, container template and ToastComponent inspected October 16, 2026. Findings are source-derived; no exploit,
browser acceptance or test execution is claimed in this docs PR.
