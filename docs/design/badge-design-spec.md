# Badges and labels: reuse before extension

Status: **Draft; composition recommendation**. Updated October 15, 2026.

## Background

Clarity provides separate badge and label primitives; the requested examples need a reuse/gap decision before a new API.

## Goals

- G1: Users distinguish numeric counts, status dots and textual categories in a consistent Clarity interface.
- G2: Applications avoid a redundant component when Clarity already satisfies the use case. Terminology: badge conveys a
  count/indicator; label conveys a text category. A label can contain a badge.

## Non-Goals

Not now: a general notification service, animated counters or a new color system. Outside this API: a form value.
Badges/labels have no ngModel, CVA or native Signal Forms binding.

## Industry evidence

The installed Clarity 18.4 package includes badge/label exports, and its website source includes labels with badges.
[NG-ZORRO Badge](https://ng.ant.design/components/badge/en) provides reference cases for counts, overflow and dots.
Adopt the distinctions and accessibility outcomes while retaining Clarity appearance.

## Use cases

| ID  | Task                                 | Recommended behavior                                                                             |
| --- | ------------------------------------ | ------------------------------------------------------------------------------------------------ |
| N1  | Show a resource/category tag         | Existing Clarity label                                                                           |
| N2  | Show a numeric count                 | Existing Clarity badge; apply an explicit overflow display such as 99+ in the host               |
| N3  | Show a label with a count            | Compose the existing label and badge                                                             |
| N4  | Place an unread-count/dot on an icon | Verify Clarity positioning and accessible naming; add a small wrapper only if a real gap remains |
| N5  | Convey severity without a number     | Include accessible status text; color alone is insufficient                                      |

## API example and extension boundary

```html
<!-- Existing Clarity CSS composition; no proposed clr-lift export is required. -->
<span class="label">Backups <span class="badge">5</span></span>
```

If icon anchoring is required, a later proposed `cll-badge` could accept `count`, `max`, `showZero` and dot mode.
Approve its name and exact need before implementing. Define zero/negative/noninteger counts, localized overflow and
accessible full count. Decorative duplicates should be hidden from screen readers; meaningful status belongs in the
host's accessible name/description. Avoid a live announcement on every rapid count change.

## Demo, tests and decision

Add Clarity-styled composition examples, including zero, overflow, long labels, icon anchors, theme/compact/RTL and all
supported languages, with playground HTML. No form demos are necessary for a display-only composition; explain this in
the demo. If a wrapper is approved, unit/E2E tests must cover actual accessible output and clipping on an interactive
host. Current decision recommendation: document/reuse Clarity first and defer a new API. No new badge code or demo is
delivered.
