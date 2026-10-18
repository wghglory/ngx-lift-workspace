# Idle detection lifecycle

Status: Implemented (contract audit). Owner: ngx-lift maintainers. Updated: October 17, 2026. Package: ngx-lift.
Approval: existing API; no behavior change approved here.

## Applicable contracts

Shared watch leases, browser event/timer ownership, reentrant transitions and injector disposal apply. UI strings and
confirmation focus belong to the warning component; no CVA or query cache is involved.

## Background

[IdleDetectionService](../../../libs/ngx-lift/src/lib/utils/idle-detection/idle-detection.service.ts) separates browser
activity monitoring from a [Clarity warning UI](../clr-lift/idle-warning-design-spec.md).

## Terminology

Idle interval precedes the warning countdown. A watch lease is a releasable consumer; manual watching persists until
`clearTimers()`. The warning countdown requires explicit confirmation to restart the idle interval.

## Goals

- G1: Share monitoring without one component unmount stopping other active consumers.
- G2: Preserve an active warning deadline through ordinary activity; explicit confirmation restarts it.

## Non-Goals

### Not now

SSR monitoring, wall-clock deadline correction, cross-tab activity coordination, or native Signal Forms.

### Outside this API

Server authentication/session expiry, logout, and authorization.

## Use cases and acceptance

| ID  | Task            | Initial state/action                        | Outcome                                              | Failure/recovery                              | Demo/test                      |
| --- | --------------- | ------------------------------------------- | ---------------------------------------------------- | --------------------------------------------- | ------------------------------ |
| I1  | Share service   | Two watches; release one                    | Remaining consumer keeps timer                       | Final release cleans resources                | idle-detection.service.spec.ts |
| I2  | Confirm warning | Countdown active; move pointer then confirm | Activity preserves countdown; explicit reset ends it | Timeout emits separately                      | service tests; clr idle E2E    |
| I3  | Observe late    | Subscribe during warning                    | Current countdown is available                       | Reentrant reset cannot publish obsolete ticks | service regressions            |

## Industry evidence and current gaps

The installed RxJS `BehaviorSubject` supplies current state; `Subject` streams expose transitions. Adapt this split so
late subscribers render correctly. Browser timers are scheduling mechanisms; background throttling means this API cannot
establish a server-enforced session deadline.

## Developer learning journey and pedagogy plan

Prerequisites: Angular injection/lifetime and the difference between idle, warning and timeout phases.

| Reader task                  | Learning outcome                                             | Destination / working example                                                                                                    |
| ---------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| Start and release monitoring | Observe an idle cycle without taking over other owners       | [/ngx-lift/utilities/idle-detection](https://ngx-lift.netlify.app/ngx-lift/utilities/idle-detection)                             |
| Confirm an active warning    | Use resetTimer(true) deliberately and release the last watch | [/clr-lift/components/idle-detection](https://ngx-lift.netlify.app/clr-lift/components/idle-detection); ownership contract below |

Validation and delivery: Both teaching flows landed in #172. Service/browser regressions do not prove a background-tab
server-enforced deadline. The public API and behavior sections below own exact options and limitations; examples
introduce them after the first task.

## Public API and examples

```typescript
// Component/service fields and teardown in an injection context.
import {DestroyRef, inject} from '@angular/core';
import {IdleDetectionService} from 'ngx-lift';

const idle = inject(IdleDetectionService);
const release = idle.watch();
inject(DestroyRef).onDestroy(release);
// Explicit user confirmation: idle.resetTimer(true);
```

Defaults: idle 19 minutes, warning 60 seconds. `setConfig` accepts seconds. `watch()` returns an idempotent release;
`startWatching()` starts manual ownership. `observeState()` replays `{isCountingDown, countdown}`; `onIdleEnd()`,
`onCountDown()` and `onTimeoutEnd()` expose transitions. `provideIdleDetectionService(config?)` creates injector scope.

## Behavior and architecture

Activity streams are throttled and reset idle time. During warning, `resetTimer()` preserves the countdown;
`resetTimer(true)` explicitly stops it. Each tick checks ownership after callbacks to prevent reentrant stale events.
The last lease releases timers/listeners unless manual ownership remains. `clearTimers()` is a service-wide stop;
individual consumers should release their lease. DestroyRef stops resources and completes current-state observation.

## Clarity, accessibility, and localization

Headless service has no form value or user strings. The warning UI owns focus, translated countdown and confirmation.

## Demo and validation plan

Use the Clarity idle demo and `apps/demo-e2e/src/clr-idle-detection.spec.ts`. Adjacent service tests exercise ownership,
reentrant reset, late subscription and cleanup. A real browser background-tab deadline check remains separate.

## Compatibility, rollout, and risks

Angular 21/RxJS; browser `document`/`window` are required once watching starts. Injecting the service does not establish
SSR support for starting monitoring. Invalid/zero duration policy is not a validated public scheduling contract.

## Review decisions and delivery

Preserve explicit warning confirmation and scoped ownership. Evaluate elapsed-time deadlines only as a separately
reviewed behavior change with hidden-tab acceptance.

## Evidence

Current source and adjacent regression tests inspected October 16, 2026; no timer/browser tests rerun here.
