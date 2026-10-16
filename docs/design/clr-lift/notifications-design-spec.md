# Alerts and toast notifications

Status: Implemented (contract audit with open defects). Owner: clr-lift maintainers. Updated: October 16, 2026. Package:
clr-lift. Approval: existing APIs; HTML trust-boundary change needs review.

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

Clarity alerts provide severity and close/action presentation. Adopt native Angular action buttons instead of encoding
all actions inside HTML. [Angular security guidance](https://angular.dev/best-practices/security) defines bypass trust
as an application trust decision. Current AlertService instead automatically bypasses sanitization for every string;
this is an open implementation defect, not a safe text contract.

## Public API and examples

```typescript
// In an Angular injection context; mount AlertContainerComponent in the application shell.
import {inject} from '@angular/core';
import {AlertService} from 'clr-lift';

const alerts = inject(AlertService);
const alert = alerts.addAlert({
  content: 'Could not save settings.',
  alertType: 'danger',
  actions: [{label: 'Retry', onClick: () => retrySave()}],
}); // retrySave is application-owned
// alerts.deleteAlert(alert.id); alerts.clearAlerts();
```

Alert defaults are danger/app-level; content accepts string or SafeHtml. Structured actions have text labels/callbacks;
legacy `targetSelector`/`onTargetClick` delegate clicks within content. Toast convenience methods are success, warning,
info and error; default type is info. Both services add newest first and return created identity. They are UI services,
not CVAs; forms can invoke them after submission.

## Behavior and architecture

AlertService exposes a computed signal and clears on injector destruction. Its container renders content through
innerHTML after the current automatic trust bypass. Until corrected, only application-trusted HTML belongs here;
external strings are not sanitized by this path. Preserve the distinction explicitly when reviewing the fix.
ToastService uses a BehaviorSubject; its container owns rendering/removal. ToastComponent defaults to 6-second timeout,
with nonpositive timeout disabling auto-close. It defers expiry by another full timeout while its interaction flag is
set. `closed` distinguishes manual close (`true`) from timer (`false`); destruction cancels its timer.

## Clarity, accessibility, and localization

Translated close labels and Clarity severities. Native action buttons provide keyboard semantics. Host owns message and
action translations. Alert container uses role=alert; repeated rapid additions need host-level announcement policy.
Toast hover and focus-within must be tracked independently. Auto-close remains paused while either interaction is
active, including focus moving between buttons within one toast. Preserve the current full-interval retry policy at
expiry.

## Demo and validation plan

Existing alert/toast demos and adjacent specs cover identity, actions, dismissal and timers. Add hostile-string
rendering and mixed hover/focus browser tests for the [open fixes](../implementation-gaps.md). Existing callback/unit
checks do not prove HTML safety or independent pointer/keyboard pause behavior.

## Compatibility, rollout, and risks

Angular 21/Clarity; no new dependencies. Service scope controls sharing. Correcting string sanitization may change HTML
callers; keep explicit caller-owned SafeHtml as the reviewed escape hatch and document migration.

## Review decisions and delivery

Prioritize removing the automatic HTML trust bypass. Separately track hover/focus state and verify timeout behavior.
Keep interactive API failures visible through alerts; documentation callouts describe APIs.

## Evidence

Services, container template and ToastComponent inspected October 16, 2026. Findings are source-derived; no exploit,
browser acceptance or test execution is claimed in this docs PR.

### Toast interaction regression evidence

Independent hover/focus-within regressions pass in the 9-test toast unit suite. The two real demo interaction scenarios
pass in Chromium, Firefox and WebKit (6 checks). clr-lift tests, lint, typecheck and build and demo-e2e lint/typecheck
pass. Expiry still retries the full configured interval while interaction remains active.
