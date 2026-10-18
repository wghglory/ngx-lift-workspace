# Alerts and toast notifications

Status: Implemented (contract audit; toast fixes merged). Owner: clr-lift maintainers. Updated: October 17, 2026.
Package: clr-lift. Approval: existing APIs; maintainer confirmed developer-trusted localized HTML on October 16, 2026.

## Applicable contracts

Shared service lifetime, toast timers, rendered actions/focus and localization apply. Trusted HTML and caller
interpolation are explicit boundaries; notifications have no form value or query request identity.

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

| ID  | Task                      | Initial state/action      | Outcome                                        | Failure/recovery                 | Demo/test                      |
| --- | ------------------------- | ------------------------- | ---------------------------------------------- | -------------------------------- | ------------------------------ |
| N1  | Report persistent failure | Add alert with action     | Latest alert first; named action runs callback | Delete by Symbol or clear        | alert service/container tests  |
| N2  | Show save outcome         | Add toast                 | Typed notification in mounted container        | Manual or timed close removes it | toast service/component tests  |
| N3  | Read/action toast         | Pointer or keyboard focus | Auto-close deferred during interaction         | Independent hover/focus guards   | toast unit/browser regressions |

## Industry evidence and current gaps

Clarity alerts provide severity and close/action presentation. The maintainer explicitly retains developer-authored
localized HTML so translators can place an inline button/link anywhere in a sentence. The existing scoped
`targetSelector`/`onTargetClick` callback supports that contract without a template or slot renderer.
[Angular security guidance](https://angular.dev/best-practices/security) makes bypassing HTML sanitization a trust
boundary. Here it is an intentional developer-trusted HTML API, not an automatically sanitized text API.

## Developer learning journey and pedagogy plan

Prerequisites: Standalone Clarity setup; mount the relevant container before dispatching service notifications.

| Reader task                      | Learning outcome                                                | Destination / working example                                                                                                                                                               |
| -------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Show a toast or persistent alert | See the message and use its action/close control                | [/clr-lift/components/toast](https://ngx-lift.netlify.app/clr-lift/components/toast) and [/clr-lift/components/multi-alerts](https://ngx-lift.netlify.app/clr-lift/components/multi-alerts) |
| Recover a failed action          | Keep callbacks scoped and defer toast expiry during hover/focus | Same demos; this spec owns HTML and timeout contracts                                                                                                                                       |

Validation and delivery: Entry flows landed in #166; #155 proves mixed interaction/viewport repairs. Human announcement
and translation acceptance remain separate. The public API and behavior sections below own exact options and
limitations; examples introduce them after the first task.

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
Toast hover and focus-within must be tracked independently. Auto-close remains paused while either interaction is
active, including focus moving between buttons within one toast. Preserve the current full-interval retry policy at
expiry.

Toast containers are fixed to the viewport below the configured header offset. Entry/exit motion and long stacks must
not change document scroll dimensions or page layout. Bound vertical overflow inside the toast stack, keep narrow
viewport cards inside its available width, and preserve keyboard access to offscreen notifications. Page/body overflow
must remain under the host application's control.

## Demo and validation plan

Existing alert/toast demos and adjacent specs cover inline buttons, nested delegated clicks, alert scoping, structured
actions, dismissal and timers. Preserve these tests, including localized inline-action examples, translator reordering
and safely escaped runtime values. Mixed hover/focus and viewport regressions are merged in
[#155](https://github.com/wghglory/ngx-lift-workspace/pull/155); see the [gap register](../implementation-gaps.md). Do
not assert that this developer-trusted HTML path sanitizes hostile markup automatically.

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

### Toast interaction regression evidence

Independent hover/focus-within regressions pass in the 9-test toast unit suite. The two real demo interaction scenarios
pass in Chromium, Firefox and WebKit (6 checks). clr-lift tests, lint, typecheck and build and demo-e2e lint/typecheck
pass. Expiry still retries the full configured interval while interaction remains active.

The viewport regressions reproduce horizontal animation overflow and vertical stack growth before the fix. Fixed
container sizing passes 15 browser checks across Chromium, Firefox and WebKit, including 320px, 390px and desktop
widths, sampled animation times, eight-toast stacks and keyboard access. The fix changes toast containment only; it does
not set document/body overflow.
