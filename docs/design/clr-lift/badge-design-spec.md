# Badges and labels: reuse before extension

Owner: clr-lift maintainers. Package: clr-lift. Approval: feature API pending; template/contract coverage updated
October 17, 2026.

Status: **Draft; composition recommendation**. Updated October 17, 2026.

## Applicable contracts

Rendered status, accessible text and localization apply. Clarity composition is synchronous; no form value, request
identity or shared cache is introduced.

## Background

Clarity provides separate badge and label primitives; the requested examples need a reuse/gap decision before a new API.

## Goals

- G1: Users distinguish numeric counts, status dots and textual categories in a consistent Clarity interface.
- G2: Applications avoid a redundant component when Clarity already satisfies the use case. Terminology: badge conveys a
  count/indicator; label conveys a text category. A label can contain a badge.

## Non-Goals

### Not now

a general notification service, animated counters or a new color system.

### Outside this API

a form value. Badges/labels have no ngModel, CVA or native Signal Forms binding.

## Industry evidence and current gaps

The installed Clarity 18.4 package includes badge/label exports, and its website source includes labels with badges.
[NG-ZORRO Badge](https://ng.ant.design/components/badge/en) provides reference cases for counts, overflow and dots.
Adopt the distinctions and accessibility outcomes while retaining Clarity appearance.

## Use cases and acceptance

| ID  | Task                                 | Recommended behavior                                                                             |
| --- | ------------------------------------ | ------------------------------------------------------------------------------------------------ |
| N1  | Show a resource/category tag         | Existing Clarity label                                                                           |
| N2  | Show a numeric count                 | Existing Clarity badge; apply an explicit overflow display such as 99+ in the host               |
| N3  | Show a label with a count            | Compose the existing label and badge                                                             |
| N4  | Place an unread-count/dot on an icon | Verify Clarity positioning and accessible naming; add a small wrapper only if a real gap remains |
| N5  | Convey severity without a number     | Include accessible status text; color alone is insufficient                                      |

## Developer learning journey and pedagogy plan

Prerequisites: Angular templates and existing Clarity badges/labels.

| Reader task                  | Learning outcome                                     | Destination / working example           |
| ---------------------------- | ---------------------------------------------------- | --------------------------------------- |
| Choose a badge or label      | Explain count versus status without relying on color | This spec, Clarity composition examples |
| Handle long/localized status | Keep the label understandable at narrow widths       | Use cases and proposed demo plan        |

Validation and delivery: N1–N5 remain planned demo acceptance. A lift wrapper and its tutorial require a demonstrated
Clarity gap and API review. The public API and behavior sections below own exact options and limitations; examples
introduce them after the first task.

## Public API and examples

```html
<!-- Existing Clarity CSS composition; no proposed clr-lift export is required. -->
<span class="label">Backups <span class="badge">5</span></span>
```

If icon anchoring is required, a later proposed `cll-badge` could accept `count`, `max`, `showZero` and dot mode.
Approve its name and exact need before implementing. Define zero/negative/noninteger counts, localized overflow and
accessible full count. Decorative duplicates should be hidden from screen readers; meaningful status belongs in the
host's accessible name/description. Avoid a live announcement on every rapid count change.

## Demo and validation plan

Add Clarity-styled composition examples, including zero, overflow, long labels, icon anchors, theme/compact/RTL and all
supported languages, with playground HTML. No form demos are necessary for a display-only composition; explain this in
the demo. If a wrapper is approved, unit/E2E tests must cover actual accessible output and clipping on an interactive
host. Current decision recommendation: document/reuse Clarity first and defer a new API. No new badge code or demo is
delivered.

## Terminology

Badge is count/indicator, label is category text, and host accessible name communicates the full status/count.
Composition uses existing Clarity primitives; a cll-badge wrapper remains an unapproved proposal.

## Behavior and architecture

Current recommendation is static host composition: no lift service, observer, cache or lifecycle is needed. If icon
anchoring/overflow is approved, separate raw count from displayed overflow and define zero/invalid count handling before
implementation. Avoid HTML interpretation of caller labels.

## Clarity, accessibility, and localization

Use text with severity, preserve full count in the host accessible description, and hide decorative duplication.
Localize category/overflow labels; direction/theme/compact/zoom checks belong to actual host examples. A status dot
needs a text equivalent. Native form fields are inapplicable.

## Compatibility, rollout, and risks

Reuse the installed Angular 21-compatible Clarity badge/label styles; no new export/dependency or peer change. A wrapper
adds maintenance cost only if a consumer proves missing behavior. Existing composition is available; proposed wrapper
names/options are not.

## Review decisions and delivery

N1/N2/N3/N5 cover G1; reuse across N1–N5 covers G2. Maintainers should accept composition first and require a named
icon-anchor/overflow gap before approving a wrapper. Keep the full accessible count when displaying 99+.

## Evidence

Checked against the current public exports and source at base `e4a43f9` on October 16, 2026. Clarity composition is
available; no clr-lift badge wrapper or new acceptance tests exist.
