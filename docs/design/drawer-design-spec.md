# Drawer

Status: **Draft; API approval pending**. Updated October 15, 2026. New symbols are proposed.

## Background

Detail and edit panels need shared overlay behavior that works with embedded forms and controls.

## Goals

- G1: Users inspect details or edit a related object while retaining page context.
- G2: Keyboard and assistive-technology users receive predictable focus, dismissal and dialog semantics.
- G3: Embedded form controls and their overlays work in the panel without changing their own APIs.

## Non-Goals

Not now: arbitrary nested drawers, a new navigation router, multi-window management or a wizard framework. Outside this
API: owning/submitting the embedded form. Drawer contains forms; its open state is not a form value.

## Industry evidence and gap

[NG-ZORRO Drawer](https://ng.ant.design/components/drawer/en) illustrates placements, close controls and content/footer
composition. Compare [Material sidenav](https://material.angular.dev/components/sidenav/overview) for persistent
navigation versus a transient detail panel. Use Clarity modal, buttons and tokens as the visual/focus reference, and CDK
overlay/focus public APIs as needed. A side-positioned modal still has to satisfy modal interaction requirements.

## Use cases

| ID  | Task                                     | Acceptance and recovery                                                                   |
| --- | ---------------------------------------- | ----------------------------------------------------------------------------------------- |
| D1  | Inspect object details beside a list     | Nonmodal mode keeps the page operable and has a named panel/close action                  |
| D2  | Edit settings in a modal drawer          | Background inert, focus trapped, initial and return focus correct                         |
| D3  | Close a dirty edit                       | Application can defer closure, confirm asynchronously and keep focus if cancellation wins |
| D4  | Open combobox/calendar inside the drawer | Nested overlay remains operable; Escape dismisses the top layer first                     |
| D5  | View on a phone or switch route          | Responsive width and deterministic teardown; return focus only to a connected element     |

## Proposed API and example

Propose `DrawerComponent` / `cll-drawer`: `open` model, required `title`, `modal=true`, logical `placement='end'`, and
`size='medium'` with documented responsive tokens. Header/body/footer slots follow existing projection conventions. All
user dismissal paths use one optional `canClose(reason)` boolean/Promise guard; guard denial leaves the drawer open.
Route teardown is disposal, not a promise to prevent router navigation; the application owns its route-leave guard.

```html
<!-- Proposed; import DrawerComponent. editOpen is a signal, confirmClose is owned by the application. -->
<cll-drawer title="Edit settings" [(open)]="editOpen" [canClose]="confirmClose">
  <!-- Any supported form system and Clarity controls can be projected here. -->
</cll-drawer>
```

Close reason distinguishes close button, Escape and backdrop. Concurrent dismissal attempts share one pending guard;
destroying/reopening invalidates a late result. Programmatic owner close is authoritative and does not recursively
invoke the guard. Document whether Escape/backdrop can be disabled; always provide an accessible close path. Modal mode
uses dialog semantics with `aria-modal`, focus trapping, inert background and restored focus. Nonmodal mode has no modal
assertion, inert background or focus trap. Account for scroll locking, reduced motion and screen-reader title. Use
Clarity spacing/colors and logical placement for RTL. Width stays within viewport; long body scrolls independently.

## Demo, tests and review decisions

Follow the [workflow](component-development.md). Playground demonstrates modal/nonmodal, all embedded form modes, dirty
guard cancel/failure, nested selection overlays, narrow layouts and runtime theme/language changes. Translate actions,
titles and announcements in every supported language. Unit tests cover guards and generations. Three-browser E2E covers
focus cycling/return, Escape priority, backdrop, scroll locking and repeated open/destroy with no orphaned overlays.
Pending: guard rejection UX, projection slot names, sizes and modal default. No drawer behavior was implemented or
tested.
