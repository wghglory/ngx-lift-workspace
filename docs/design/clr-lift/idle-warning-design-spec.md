# Idle warning component

Status: Implemented (contract audit). Owner: clr-lift maintainers. Updated: October 16, 2026. Package: clr-lift.
Approval: existing API; no new session policy.

## Background

[IdleDetectionComponent](../../../libs/clr-lift/src/lib/components/idle-detection/idle-detection.component.ts) projects
the [ngx-lift idle lifecycle](../ngx-lift/idle-detection-design-spec.md) into a Clarity confirmation dialog.

## Terminology

Shared mode leases the injected service. Scoped mode constructs an instance tied to the component injector. Confirming
the warning explicitly extends UI idle time; a timeout output lets the application decide the next action.

## Goals

- G1: Show the current countdown even when a warning observer attaches late.
- G2: Keep shared consumers independent on teardown and support an isolated local warning.

## Non-Goals

### Not now

Cross-tab session coordination and native field binding.

### Outside this API

Authentication/logout, server session extension, and any form value.

## Use cases and acceptance

| ID  | Task            | Initial state/action                       | Outcome                                                 | Failure/recovery                          | Demo/test                    |
| --- | --------------- | ------------------------------------------ | ------------------------------------------------------- | ----------------------------------------- | ---------------------------- |
| W1  | Confirm warning | Countdown visible; activate keep-signed-in | Dialog closes and explicit reset restarts idle interval | Ordinary activity cannot dismiss deadline | clr-idle-detection.spec.ts   |
| W2  | Share warning   | Two components; destroy one                | Other lease continues                                   | Destroy final consumer releases timers    | idle-detection-scope.spec.ts |
| W3  | Isolate demo    | scoped=true, short intervals               | Root session remains independent                        | Scope change releases previous lease      | component scope tests        |

## Industry evidence and current gaps

Installed Clarity modal supplies the visual dialog shell; compose it around service state rather than creating another
timer in the template. The core service's state observable addresses late subscribers. Browser throttling still limits
deadline accuracy; this UI cannot enforce authentication expiry.

## Public API and examples

```html
<!-- Host imports IdleDetectionComponent; expireSession is application-owned. -->
<cll-idle-detection
  [scoped]="true"
  [idleDurationInSeconds]="60"
  [timeoutDurationInSeconds]="30"
  (timeout)="expireSession()"
/>
```

`scoped=false` by default. Omitted durations retain service configuration. `timeout` emits after warning expiration;
keep-signed-in calls `resetTimer(true)`, not an HTTP extension API. In shared mode supplied duration inputs update the
shared injected service, so multiple competing configurations should be avoided.

## Behavior and architecture

Initialization acquires a watch lease. Reactive scope/config changes switch service subscriptions and release the old
lease. State drives open/countdown; timeout closes and emits. Destruction releases only this component's watch. The
scoped service is tied to the component injector; shared service lifetime remains injector-owned.

## Clarity, accessibility, and localization

Translated title/countdown/actions and Clarity modal semantics. Verify initial/return focus, keyboard confirmation,
countdown announcements and translated layout. Countdown updates should not overwhelm screen readers.

## Demo and validation plan

Existing idle demo/E2E and adjacent component/scope tests cover countdown, confirmation, shared/scoped ownership and
repeated mounting. Manual assistive-technology acceptance remains in the delivery roadmap.

## Compatibility, rollout, and risks

Angular 21, Clarity and browser idle service. No SSR monitoring claim. Drawer/form projection does not turn this dialog
into a value control; the deferred native-field sweep does not add a warning form value.

## Review decisions and delivery

Preserve explicit confirmation semantics. Coordinate shared service configuration in the application; use scoped mode
for local demonstrations with shortened intervals.

## Evidence

Source and existing scope/E2E assertions inspected October 16, 2026; no tests or manual accessibility run here.
