# Date, time, date-time, ranges, and calendar

Owner: clr-lift maintainers. Package: clr-lift. Approval: feature API pending; template/contract coverage updated
October 17, 2026.

Status: **Draft; API approval pending**. Updated October 17, 2026. New selectors and types are proposed.

## Applicable contracts

Temporal values, parsing/validation, CVA, calendar keyboard/focus and localization apply. Date-only, wall-time and
instant semantics are separate; visible-range requests need cancellation, not a scheduling engine.

## Background

Temporal entry and calendar display need explicit value, locale and time-zone contracts before implementation.

## Goals

- G1: Users enter dates/times and bounded ranges with clear keyboard, parsing and validation behavior.
- G2: Applications preserve date-only meaning and explicitly choose a zone for instants.
- G3: Developers reuse date logic for a calendar view while keeping event visualization separate from value entry.
  Terminology: a calendar date has no time zone; a wall time has no date; an instant identifies one point in time.

## Non-Goals

### Not now

recurrence rules, scheduling engines, drag/drop events, non-Gregorian calendar systems, quarter/week pickers, or parsing
arbitrary natural language. Month/year shortcuts can follow actual consumer demand.

### Outside this API

backend scheduling, business holidays, authorization and server validation.

## Industry evidence and current gaps

| Reference                                                                          | Behavior to learn from                                        | Proposed decision                                                                                           |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| [NG-ZORRO DatePicker](https://ng.ant.design/components/date-picker/en)             | Range input, time selection, disabled dates/times and presets | Build on explicit value types; retain Clarity styles                                                        |
| [NG-ZORRO TimePicker](https://ng.ant.design/components/time-picker/en)             | Time-only selection and configurable steps                    | Provide a standalone time control before composing date-time                                                |
| [Material datepicker](https://material.angular.dev/components/datepicker/overview) | Range forms, adapters, locale and min/max                     | Separate display/parser concerns from serialized values                                                     |
| [React Aria DatePicker](https://react-aria.adobe.com/DatePicker)                   | Distinct calendar/zoned values and accessible interaction     | Require an explicit zone when choosing an instant                                                           |
| [NG-ZORRO Calendar](https://ng.ant.design/components/calendar/en)                  | Full/card views and date-cell content                         | Keep a bounded calendar view separate from recurrence/event editing                                         |
| Installed Clarity date input                                                       | Existing visual/form foundation                               | Verify public date composition before replacing it; it does not itself establish our full temporal contract |

## Use cases and acceptance

| ID  | Task                                   | Expected outcome and recovery                                                                       |
| --- | -------------------------------------- | --------------------------------------------------------------------------------------------------- |
| T1  | Enter an expiration date               | Date remains the same across browser time zones; typed invalid text stays visible with error        |
| T2  | Pick a daily wall time                 | Locale 12/24-hour presentation, canonical time-only value, no invented date                         |
| T3  | Schedule a one-time operation          | Select date then time and zone; store an unambiguous instant with the chosen zone                   |
| T4  | Filter by start/end dates              | Inclusive date endpoints and start <= end; partial entry stays draft until complete                 |
| T5  | Limit a maintenance interval           | Explicit instant min/max and disabled times; runtime constraint changes revalidate without clamping |
| T6  | Navigate a monthly operations calendar | Request the visible interval; distinguish selected date, visible month and events                   |
| T7  | Enter a DST gap/overlap                | Reject nonexistent local time; require explicit disambiguation for a repeated wall time             |

## Developer learning journey and pedagogy plan

Prerequisites: Angular 21 forms and date-only versus time-only versus zoned-instant terminology.

| Reader task                     | Learning outcome                                           | Destination / working example                  |
| ------------------------------- | ---------------------------------------------------------- | ---------------------------------------------- |
| Enter one date or time          | Keep serialized values stable and explain invalid drafts   | This spec, proposed picker examples            |
| Choose a range or zoned instant | Resolve ordering, constraints and DST ambiguity explicitly | This spec, proposed range/calendar cases T1–T7 |

Validation and delivery: All tutorials are planned. Parser/time-zone/API decisions precede compiled form examples, DST
regressions and real browser acceptance. The public API and behavior sections below own exact options and limitations;
examples introduce them after the first task.

## Public API and examples

Prefer separate controls with narrow types over one mode input returning a large union: `DatePickerComponent` /
`cll-date-picker`: ISO date `string | null` (`YYYY-MM-DD`); `TimePickerComponent` / `cll-time-picker`: ISO wall time
`string | null` (`HH:mm:ss`); `DateTimePickerComponent` / `cll-datetime-picker`:
`{instant: string; timeZone: string} | null`, instant in UTC ISO format; `DateRangePickerComponent` /
`cll-date-range-picker`: `{start: string; end: string} | null`, both dates. Review a separate date-time range control
after these contracts; do not overload date ranges with instant values.

Shared inputs: `label`, appropriately typed `min`/`max` (inclusive), `readonly`, and optional domain disabled-date/time
predicates. Time control proposes `minuteStep=1`, `secondStep=1`; hidden seconds commit `00` rather than retain
invisible data. Date-time zone must be supplied explicitly; never silently use the browser's zone. `Intl` handles
display; parser rules, accepted localized input and DST conversion need an explicit reviewed adapter/implementation
choice.

```typescript
import {Component} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {DatePickerComponent, TimePickerComponent, DateTimePickerComponent, DateRangePickerComponent} from 'clr-lift'; // proposed

@Component({
  imports: [
    ReactiveFormsModule,
    DatePickerComponent,
    TimePickerComponent,
    DateTimePickerComponent,
    DateRangePickerComponent,
  ],
  template: `
    <cll-date-picker label="Expiry" min="2026-10-15" [formControl]="expiry" />
    <cll-time-picker label="Daily start" [formControl]="start" />
    <cll-datetime-picker label="Run once" timeZone="Asia/Shanghai" [formControl]="runAt" />
    <cll-date-range-picker label="Report dates" [formControl]="range" />
  `,
})
export class TemporalExample {
  readonly expiry = new FormControl<string | null>(null);
  readonly start = new FormControl<string | null>('09:00:00');
  readonly runAt = new FormControl<{instant: string; timeZone: string} | null>(null);
  readonly range = new FormControl<{start: string; end: string} | null>(null);
}
```

## Behavior and architecture

Date-only values must not round-trip through `new Date('YYYY-MM-DD')` as an implicit local date. Time-only ranges
crossing midnight need a separate domain rule. Out-of-range values remain visible and invalid; do not silently reorder
or clamp. Parse drafts and incomplete ranges remain inside the control until a valid commit; parse/required errors still
reach the owning form. Clearing yields null. Reset discards draft state. Invalid min > max is a reported configuration
error. Date-range API endpoints are inclusive; converting to an exclusive backend filter belongs to the caller.

### Calendar view

Propose `CalendarComponent` / `cll-calendar`: optional selected value `string | null` (date), `viewDate` for visible
month, `events` for the visible interval, and `visibleRangeChange` to request new data. Navigation does not select a
date. An event has stable ID, title and date/instant data; the application maps instants into the supplied display zone.
No recurrence expansion or hidden background polling. Loading/error views are separate from day selection.

```html
<!-- Proposed; import CalendarComponent. fetchEvents is owned by the host application. -->
<cll-calendar [events]="events()" [viewDate]="month()" (visibleRangeChange)="fetchEvents($event)" />
```

## Clarity, accessibility, and localization

Use Clarity date containers and tokens, localized month/day names, locale week start, RTL, compact/light/dark and
accessible grid navigation. Support typed entry as well as picking. Give range endpoints separate names; announce
invalid times and restore input focus on dismissal. No trap when tabbing through a nonmodal calendar. Every value
control has the Angular 21 [form demos](forms-compatibility-design-spec.md). Calendar form integration applies to date
selection; display-only event navigation works without binding a form. Playground examples cover T1–T7, presets,
keyboard entry, min/max, disabled days/times, partial ranges, reset, UTC and DST zones, all supported languages.

Unit/type tests cover leap years, month ends, boundary equality, invalid dates, locale parsing, date-only zone
invariance, DST gaps/overlaps, constraints changing and round trips. Three-browser E2E covers keyboard/pointer entry,
errors, focus, form submission, runtime locale and zone changes. Calendar bounds work to the visible grid and collapses
excess events into an accessible per-day list; measure 10,000 supplied events and ensure hidden events do not create
unbounded DOM. Deliver date/time → date-time → date ranges → date-time ranges if approved → calendar, with shared
private date logic. Pending: exact value types, time-zone conversion dependency, locale parser, DST UX, range
confirmation and calendar demand. No controls, parser/DST spike, measurements, or new tests are delivered by this
document.

## Platform delivery requirement

Initial delivery supports Angular 21 ngModel, typed Reactive Forms, and Reactive Forms + `toSignalForm` where this
feature owns a value. Native signal-field integration is deferred until the platform upgrade, then required under the
[shared forms contract](forms-compatibility-design-spec.md). Display-only surfaces and form containers have no field
value of their own. This requirement does not make proposed exports available.

## Terminology

A calendar date has no zone; a wall time has no date; an instant identifies one point in time. A partial range is a
draft, not a valid committed endpoint pair. A display calendar does not own a form value unless selection is enabled.

## Compatibility, rollout, and risks

Angular 21 CVA first; native fields required after the platform upgrade for every value picker/range and selectable
calendar. Intl formats values but is not a complete localized parser or DST conversion engine. Maintainers must approve
that dependency/adapter decision before promising zoned entry; no parser dependency is approved here.

## Review decisions and delivery

T1/T2/T4 cover G1; T3/T5/T7 cover G2; T6 covers G3. Review parser/DST behavior before date-time implementation. Ship
useful date/time controls independently; calendar demand and event shape remain pending. Form owners must be able to see
parse errors even when invalid drafts are withheld from committed values.

## Demo and validation plan

The use cases and validation requirements above are planned acceptance, not executed coverage. Each first-delivery use
case needs a working Clarity playground and focused state/browser tests before its status changes to Verified.

## Evidence

Checked against the current public exports and source at base `e4a43f9` on October 16, 2026. No proposed feature exports
or feature implementation exist; all feature demos/tests and measurements described here remain planned.
