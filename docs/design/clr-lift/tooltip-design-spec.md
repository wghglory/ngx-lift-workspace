# Tooltip and interactive popover

Status: Implemented (contract audit). Owner: clr-lift maintainers. Updated: October 17, 2026. Package: clr-lift.
Approval: existing API; assistive-technology acceptance remains separate.

## Applicable contracts

Rendered tooltip/popover semantics, borrowed/owned content, overlay positioning and disposal apply. Forms can host the
trigger, but the directive has no form value or shared cache.

## Background

[TooltipDirective](../../../libs/clr-lift/src/lib/components/tooltip/tooltip.directive.ts) creates a body-mounted
[TooltipComponent](../../../libs/clr-lift/src/lib/components/tooltip/tooltip.component.ts), with owned or borrowed
content. This contract replaces the old source-folder usage README.

## Terminology

String content is a descriptive tooltip. Template/component content is an interactive popover with dialog semantics.
Owned views are created here; a supplied ComponentRef remains caller-owned.

## Goals

- G1: Show contextual text or interactive content through pointer and keyboard access.
- G2: Dispose overlay-owned resources and restore borrowed DOM without destroying caller views.

## Non-Goals

### Not now

A generic overlay framework, modal dialog replacement, or SSR/hydration support.

### Outside this API

Form values, caller component attachment/destruction, routing, and content localization.

## Use cases and acceptance

| ID  | Task                   | Initial state/action           | Outcome                                 | Failure/recovery                      | Demo/test                 |
| --- | ---------------------- | ------------------------------ | --------------------------------------- | ------------------------------------- | ------------------------- |
| T1  | Read hint              | Hover/focus trigger            | Named description via aria-describedby  | Escape closes; attributes restored    | tooltip.spec.ts           |
| T2  | Use interactive detail | Open template/component        | Dialog relationship, reachable controls | Focus/close restores usable trigger   | directive/component tests |
| T3  | Reuse caller component | Show, update, close repeatedly | DOM restored; caller view survives      | Destroyed caller view is not restored | ownership regressions     |

## Industry evidence and current gaps

Checked October 16, 2026: [WAI-ARIA tooltip](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/) keeps focus at the
trigger and excludes interactive popup controls. Adapt by distinguishing string tooltip from nonmodal dialog content.
Current behavior chooses semantics by content type, not by inspecting focusable descendants.

## Developer learning journey and pedagogy plan

Prerequisites: Clarity styling and a keyboard-focusable trigger; tooltip text differs from interactive popover content.

| Reader task                         | Learning outcome                                                    | Destination / working example                                                            |
| ----------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Focus a tooltip trigger             | Discover its description before reading the source                  | [/clr-lift/components/tooltip](https://ngx-lift.netlify.app/clr-lift/components/tooltip) |
| Open interactive content repeatedly | Preserve focus/content ownership and clean up the body-mounted view | Same demo; ownership and lifecycle cases below                                           |

Validation and delivery: The entry flow landed in #166. Unit/browser coverage is separate from manual
assistive-technology acceptance. The public API and behavior sections below own exact options and limitations; examples
introduce them after the first task.

## Public API and examples

```html
<!-- Host imports TooltipDirective. -->
<button type="button" cllTooltip="Refresh the list">Refresh</button>
<button type="button" cllTooltip [cllTooltipContent]="details" cllTooltipLabel="Refresh details">Details</button>
<ng-template #details><p>Refresh keeps existing results visible.</p></ng-template>
```

Content accepts string, TemplateRef, component type or ComponentRef. Defaults: hide delay 0 ms, width 240; placement
defaults from trigger position and collision checks. Inputs include content context, accessible label, width and
position. A borrowed ComponentRef keeps its original Angular owner; prefer template/type for overlay-owned content.

## Behavior and architecture

Create and attach one tooltip view while visible. Reactive content/context/width/position changes update it. Hover and
focus prevent delayed hiding. Escape/outside interaction closes; resize closes. Captured scroll repositions while
trigger/popover contains focus, otherwise closes. This corrects the removed README's claim that every scroll closes.
Teardown clears timers/listeners, detaches/destroys owned views, and restores borrowed DOM to its surviving original
position. A borrowed component receives change detection while rendered; its owner still attaches and destroys it.

## Clarity, accessibility, and localization

Clarity tooltip positioning/classes provide presentation. Existing trigger descriptions are preserved. Interactive
content uses aria-controls/haspopup/expanded and translated fallback dialog label; supply a meaningful feature label.
Verify focus return, long text, narrow viewport, dark/RTL and zoom. This is a form-adjacent overlay, not a form field.

## Demo and validation plan

Existing tooltip demo plus `apps/demo-e2e/src/tooltip.spec.ts`; adjacent directive/component tests cover borrowed views,
repeated open/close, focus, reactive inputs and cleanup. Remaining manual screen-reader/touch/zoom acceptance is tracked
in the [delivery roadmap](../../priority-roadmap.md). Do not infer those results from role assertions alone.

## Compatibility, rollout, and risks

Angular 21, existing CDK a11y and Clarity. Body-mounted browser DOM; no server rendering claim. Caller-rendered content
retains its own trust boundary; strings render as text. Native signal fields inside an interactive popover follow their
own controls' future policy, not a tooltip value API.

## Review decisions and delivery

Preserve ownership distinctions and existing dismissal behavior. Review any future tooltip/popover API split against
current callers before changing semantics.

## Evidence

Source and existing regressions inspected October 16, 2026. No browser, assistive-technology or lifecycle tests rerun
here.
