# Deep object-path breadcrumbs

Owner: clr-lift maintainers. Package: clr-lift. Approval: feature API pending; template/contract coverage updated
October 16, 2026.

Status: **Draft; API approval pending**. Updated October 16, 2026. Proposed selectors are unavailable.

## Background

Object-store prefixes can be much deeper than an application's route hierarchy.

## Goals

- G1: Users can reach any ancestor without a long wrapping breadcrumb consuming the page.
- G2: Long, repeated or localized folder names remain identifiable on narrow screens.
- G3: Applications retain ownership of routing, exact object keys and authorization.

## Non-Goals

### Not now

a full file browser, arbitrary descendant search, drag/drop, rename, or a complete editable address bar.

### Outside this API

interpreting object-store keys as normalized filesystem paths or fetching folder permissions. Breadcrumb is navigation;
ngModel/CVA/Signal Forms do not describe its value. It can sit beside any form.

## Industry evidence and current gaps

[Clarity breadcrumbs](https://github.com/vmware-clarity/ng-clarity/blob/main/projects/angular/layout/breadcrumbs/breadcrumbs.ts)
already accepts items and supports expansion. [Material UI breadcrumbs](https://mui.com/material-ui/react-breadcrumbs/)
demonstrates collapsed ancestry and overflow. Extend Clarity composition only where a bounded, searchable
hidden-ancestor picker is needed; avoid building a replacement merely for separators or links.

## Use cases and acceptance

| ID  | Task                                     | Acceptance                                                                               |
| --- | ---------------------------------------- | ---------------------------------------------------------------------------------------- |
| B1  | Navigate a 30-level object prefix        | Root, recent ancestors and current item stay visible; every hidden ancestor is reachable |
| B2  | Choose between identically named folders | Full ancestor context appears in the hidden list; stable keys prevent ambiguity          |
| B3  | Use a narrow viewport or 200% zoom       | Width-aware collapse, readable current label and accessible full name                    |
| B4  | Open an ancestor in another tab          | Real supplied links preserve standard browser behavior                                   |
| B5  | Change route while overflow is open      | Close/dispose the old panel and restore focus only to a surviving trigger                |

## Public API and examples

Propose `ObjectPathBreadcrumbComponent` / `cll-object-path-breadcrumb`, `items` and `maxVisible=4`. Each item supplies
`{id, label, href}`; an application may use a navigation output when it cannot provide a link. The caller supplies the
exact ancestor path, including current item; no label-based path reconstruction.

```html
<!-- Proposed; import ObjectPathBreadcrumbComponent. -->
<cll-object-path-breadcrumb [items]="ancestors" [maxVisible]="4" />
```

Example items:
`[{id: 'bucket', label: 'Backups', href: '/objects'}, {id: 'prefix-1', label: 'prod', href: '/objects?prefix=prod%2F'}, {id: 'prefix-2', label: 'daily', href: '/objects?prefix=prod%2Fdaily%2F'}]`.
Root + overflow + the two nearest ancestors/current item is the default deep-path presentation; width can reduce visible
ancestors further. Overflow is a scrollable ancestor navigator, not an action command menu. For more than 20 hidden
items, offer local label/full-path filtering. Keep original ancestor order, show path context, and expose current item
as text with `aria-current="page"`. Filtering never removes the current path itself.

Do not decode/encode the path repeatedly, collapse repeated slashes, interpret `..`, or normalize Unicode without caller
policy. Empty segments and unusual object keys are valid input concerns; the caller constructs correct URLs. Labels
render as text. Use real anchors, localized names/separators, keyboard-accessible overflow, Escape and predictable focus
return.

## Demo and validation plan

Follow the [workflow](../component-development.md). Playground cases cover 1/4/30/100 levels, repeated names, long
labels, special characters, narrow layouts, keyboard, dark/compact/RTL, runtime language change, and route changes. Unit
tests cover collapse/filter/key behavior; three-browser E2E verifies every hidden ancestor and real link destinations.
No form-control wrappers are added. Pending: Clarity composition limit, width measurement strategy, default visible
count and search threshold. No navigation code or rendering/performance verification is delivered by this draft.

## Terminology

An item ID is caller identity, label is display text, href is a supplied navigation target, and an ancestor path is
ordered caller data. Object-store prefixes are not normalized local filesystem paths.

## Behavior and architecture

The caller owns the path and URL construction; the component owns collapse/filter/open state. On route/path change close
the old panel and disconnect width observers/listeners on destroy. No fetching or form value is introduced. Measure
width in the browser and define stable server markup before claiming SSR/hydration.

## Clarity, accessibility, and localization

Retain real link behavior, aria-current and reachable hidden ancestors. Translate overflow/filter/empty labels and
announce useful result counts without treating the ancestor navigator as a command menu. Verify RTL, zoom, long names
and focus return when a trigger disappears.

## Compatibility, rollout, and risks

Angular 21/Clarity composition is the initial target. No dependency or renderer choice approved. Width measurement and
100-level rendering remain unmeasured; bounded overflow DOM/cleanup must be demonstrated. Native field binding is
inapplicable to navigation.

## Review decisions and delivery

B1/B3 cover G1, B2/B3 cover G2, B4/B5 cover G3. Maintainers must review public Clarity collapse limits before approving
a separate searchable ancestor surface; preserve supplied object keys and URL bytes in either approach.

## Evidence

Checked against the current public exports and source at base `e4a43f9` on October 16, 2026. No proposed feature exports
or feature implementation exist; all feature demos/tests and measurements described here remain planned.
