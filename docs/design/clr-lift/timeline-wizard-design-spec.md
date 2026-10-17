# Timeline wizard lifecycle and form ownership

Status: Implemented (contract audit). Owner: clr-lift maintainers. Updated: October 17, 2026. Package: clr-lift.
Approval: existing API; no new workflow framework proposed.

## Applicable contracts

Dynamic view lifetime, Reactive Forms ownership, async advancement, stale-result cleanup and rendered step focus apply.
The wizard hosts forms rather than owning a CVA value; it has no shared query cache.

## Background

[TimelineWizardComponent](../../../libs/clr-lift/src/lib/components/timeline-wizard/timeline-wizard.component.ts)
creates step components and coordinates forms/async advancement through a per-wizard
[service](../../../libs/clr-lift/src/lib/components/timeline-wizard/timeline-wizard.service.ts).

## Terminology

A step extends TimelineBaseComponent. Its `form` is a FormGroup or null; `next$` performs accepted advancement work.
`live` retains mounted step instances. Confirmation is an attempt event; finished means final next$ succeeded.

## Goals

- G1: Preserve step data while moving backward/forward and synchronize it before an async action.
- G2: Block invalid/pending steps, expose advancement failure and dispose dynamically created resources.

## Non-Goals

### Not now

Native field-tree steps, dynamic step reordering contracts, nested wizards or persistent drafts.

### Outside this API

Server write rollback, route guards, validation rules, and a single CVA value for the whole wizard.

## Use cases and acceptance

| ID  | Task               | Initial state/action            | Outcome                                    | Failure/recovery                                | Demo/test                         |
| --- | ------------------ | ------------------------------- | ------------------------------------------ | ----------------------------------------------- | --------------------------------- |
| W1  | Advance valid form | Edit then immediately Next      | Current form data captured before action   | Invalid/pending blocks and marks fields touched | timeline-wizard.component.spec.ts |
| W2  | Retry step         | next$ fails then retry succeeds | Error state then next/finished             | No duplicate action while processing            | async regression tests            |
| W3  | Navigate back      | live false/true                 | Recreated patched form / retained instance | Timers/subscriptions removed on disposal        | component tests; timeline E2E     |

## Industry evidence and current gaps

Installed Clarity timeline supplies current/processing/success/error presentation; the lift shell owns dynamic Angular
components and async transitions. Angular FormGroup remains the validity/data owner. A native Signal Forms step has no
implemented integration with this base class yet.

## Developer learning journey and pedagogy plan

Prerequisites: Clarity setup, TimelineStep configuration and step components extending TimelineBaseComponent.

| Reader task              | Learning outcome                                                          | Destination / working example                                                                            |
| ------------------------ | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Complete two local steps | See required validation, navigation and final submitted data              | [/clr-lift/components/timeline-wizard](https://ngx-lift.netlify.app/clr-lift/components/timeline-wizard) |
| Retry async advancement  | Keep entered values after failure and distinguish confirmed from finished | Same demo; live/non-live and failure lifecycle contracts below                                           |

Validation and delivery: The entry flow landed in #162. Use wizard unit/E2E cases; native-field steps and human
focus/announcement acceptance remain separate. The public API and behavior sections below own exact options and
limitations; examples introduce them after the first task.

## Public API and examples

```html
<!-- Host imports TimelineWizardComponent; steps supply TimelineStep entries and step component classes. -->
<cll-timeline-wizard
  [timelineSteps]="steps"
  [live]="false"
  (confirmed)="reviewSubmission($event)"
  (finished)="closeAfterSuccess()"
  (canceled)="cancel()"
/>
```

Inputs include required timelineSteps, live=false, and confirmButtonText translation key. Each step provides state,
title, component and data; optional ID takes precedence over title for service lookup. Start with one current/error/
processing step. Base `formValueToData()` returns form.value; override for payloads needing disabled values or custom
shaping. `dataToFormValue()` converts incoming data for patchValue. Cold next$ sources defer work until subscription.

## Behavior and architecture

The component scopes TimelineWizardService, so independent wizards do not share mutable steps. Next synchronously
captures data, marks processing and subscribes to the current next$. A last-step confirmed event precedes async success;
finished emits after success. Do not persist the same operation from both outputs. Errors set step error/description.
Non-live navigation destroys prior views/subscriptions and creates/patches the next view. Live mode hides/reuses
index-keyed views. Data edits are debounced 300 ms, while Next/Previous synchronously flush current data. DestroyRef
cancels patch timers and subscriptions. Cancelling the wizard emits an event; the host closes/destroys it.

## Clarity, accessibility, and localization

Clarity timeline/action layout and translated navigation labels. Hosts localize titles, descriptions and errors. Verify
focus after step changes, error announcements, compact/RTL, long titles and keyboard access separately from form
validity tests. Child controls keep their own CVA/form accessibility contracts.

## Demo and validation plan

Existing timeline demo and `apps/demo-e2e/src/timeline-wizard.spec.ts`; adjacent tests cover live/non-live navigation,
pending/invalid forms, data flush, failed actions, scoped service and teardown. Future native step support needs actual
native-field validity/submission tests; a projected native input alone does not update `stepInvalid`.

## Compatibility, rollout, and risks

Angular 21 Reactive Forms; toSignalForm may observe each step's same group. The wizard itself is a form container. Step
state/data remain mutable service state; runtime reorder or replacing a live step list is not a verified contract. An
empty/no-current list can throw from service currentStep; validate the host configuration.

## Review decisions and delivery

Preserve existing confirmation/finished event timing. After the platform upgrade review a step validity/submission seam
for native fields without requiring a second form owner. Approve that API before changing the base class.

## Evidence

Component, base class, service, adjacent tests and E2E inspected October 16, 2026. No wizard/browser tests rerun here.
