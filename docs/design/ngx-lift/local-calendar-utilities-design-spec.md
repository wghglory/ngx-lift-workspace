# Calendar-day arithmetic design specification

Status: Implemented (unreleased); API reviewed. Owner: ngx-lift maintainers. Updated: 2026-11-20. Package: ngx-lift.
Approval: the maintainer approved calendar-day arithmetic in
[PR #240](https://github.com/wghglory/ngx-lift-workspace/pull/240) on 2026-11-20. Spec and implementation share that PR
under the [development workflow](../component-development.md#design-before-implementation). Publication remains a
separate gate.

## Problem, consumer evidence and admission

Applications need a date input boundary such as five calendar days from a supplied reference date. Repeating local
component formatting or adding 86,400,000 milliseconds risks UTC day shifts, input mutation and daylight-saving errors.
A maintainer-owned application's log-archive retention form already computes a calendar-day maximum using a date
library; its shared form utilities also format local date-time input values. This is observed downstream evidence, not
an authorization to migrate that application or to change elapsed-hour retention policies. At admission, the date-range
demo also duplicated local-day addition and formatting in its executable code and displayed examples.

The final scope contains only `addCalendarDays`. The maintainer withdrew the unreleased `toLocalDateString` proposal on
2026-11-20 because Angular `formatDate` already covers the formatting task. No date library, timezone service or picker
is added.

| Symbol              | Consumer                                                                   | Native API / existing export                                                                                                                                                 | Other admission checks                                                                                                                                         | Verdict                         |
| ------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| `addCalendarDays`   | Calendar-day retention maximum and date-range input boundaries             | `setDate` mutates; this contract copies, validates safe-integer offsets and rejects overflow. `differenceInDays` measures elapsed 24-hour periods and is not an alternative. | Domain-neutral; public Date APIs only; no globals, DOM, timers, dependencies, owned UI messages or form state. Fits the Angular 21 date/time correctness work. | Proceed to spec                 |
| `toLocalDateString` | Local date input bounds and the date portion of local date-time formatting | Angular `formatDate` already produces the required local `YYYY-MM-DD` input string; another public formatter is unnecessary.                                                 | Same safety, localization, lifecycle and package checks as above; no additional entry point.                                                                   | Reject — use Angular formatDate |

## Industry evidence and decisions

Sources checked 2026-11-20. These comparisons concern headless date operations, not a proposal for another picker.

| Primary source                                                                                                                            | Evidence and decision                                                                                                                                                                                                             |
| ----------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [JavaScript setDate](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setDate)                       | Adopt local-calendar arithmetic; explicitly retain native DST gap/overlap normalization. Adapt by copying first and validating input/output. A calendar day is not a fixed 24 hours.                                              |
| [JavaScript toISOString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString)               | Reject UTC ISO slicing for local calendar input values.                                                                                                                                                                           |
| [JavaScript toLocaleDateString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString) | Keep locale-sensitive human display formatting native. Output can vary even within a locale, so it is not the fixed date-input serialization contract.                                                                            |
| [Angular formatDate](https://angular.dev/api/common/formatDate)                                                                           | A valid alternative in Angular applications: `formatDate(date, 'yyyy-MM-dd', 'en-US')` uses local time when timezone is omitted. Use the existing Angular formatter instead of introducing another public date-formatting helper. |
| [Angular Material NativeDateAdapter](https://github.com/angular/components/blob/main/src/material/core/datetime/native-date-adapter.ts)   | Adopt the explicit calendar-day vocabulary; avoid requiring a Material adapter/provider for one pure function.                                                                                                                    |
| [Clarity Date Picker](https://clarity.design/documentation/datepicker/code)                                                               | Keep Clarity responsible for picker UI and localized presentation; the utility owns native Date arithmetic; Angular owns date-string formatting.                                                                                  |
| [NG-ZORRO DatePicker](https://ng.ant.design/components/date-picker/en)                                                                    | Keep component selection and date formatting infrastructure separate; no NG-ZORRO dependency or component wrapper.                                                                                                                |
| [React native input](https://react.dev/reference/react-dom/components/input)                                                              | Preserve ordinary string input values; no framework-specific form bridge is required for a headless formatter.                                                                                                                    |

Use native locale-sensitive APIs for human-readable date display, and Angular `formatDate(date, 'yyyy-MM-dd', 'en-US')`
for local date-input strings. `en-US` supplies formatting data; it does not select a US timezone. Omitting the timezone
argument uses the host timezone. No new formatter is exported.

## Goals and non-goals

- Generate readable native date-input boundaries from one caller-owned reference Date.
- Centralize calendar-day arithmetic, input validation and nonmutation without runtime dependencies.
- Keep existing validators and elapsed-time utilities unchanged.

No parsing, localized display formatting, timezone selection, business-day/month/year arithmetic, clock ownership,
Temporal polyfill, date-time formatter, calendar component or forms value accessor is included. A Date supplied by the
caller already represents an instant; the utility does not reverse UTC parsing done before the call.

## Public API and contracts

```typescript
export function addCalendarDays(date: Date, days: number): Date;
```

The function is synchronous and exported from the existing ngx-lift root. It uses the host's local timezone, accepts
valid native Date instances (including cross-realm Dates), never reads the current clock itself, and never mutates
input. It is deterministic for the supplied input and host timezone. SSR needs no browser APIs, but differing
server/client timezones can produce differing calendar dates; the application owns that boundary.

### addCalendarDays

Clone the input instant, then adjust its local day-of-month by a positive, negative or zero safe-integer offset.
Month/year rollover and leap years follow native Date behavior. Zero returns a distinct Date with the exact original
instant, including during a repeated DST hour. Preserve local time components where possible; native Date resolves
nonexistent/repeated local times using its normal compatible disambiguation. A timezone transition can skip a calendar
label entirely; this API does not promise to manufacture an unavailable wall-clock date.

A non-Date input throws TypeError. An invalid Date, a non-safe-integer offset (including NaN, infinities and fractions),
or a result outside the Date range throws RangeError. No string/number date coercion or offset rounding is performed.
The result retains the full native Date range. Date formatting is outside this API.

## Use cases and acceptance

| ID  | Task                        | Action and observable outcome                                                                           | Failure/recovery                                                                      | Evidence plan                           |
| --- | --------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | --------------------------------------- |
| UC1 | Calendar-day input interval | Add 1 and 5 days to one reference, format both, pass strings to validator/native min/max                | Correct invalid reference/offset; no partial mutation                                 | Date-range demo and utility tests       |
| UC2 | Day addition across DST     | Add/subtract one local calendar day; keep wall time where it exists even if elapsed time is 23/25 hours | Native gap normalization is documented; exact duration callers use timestamps instead | New York spring/fall timezone checks    |
| UC3 | Caller ownership            | Zero offset clones exactly; positive/negative calls leave input unchanged                               | No hidden clock, locale, mutation or global side effects                              | Unit/type and installed-consumer checks |

```typescript
import {formatDate} from '@angular/common';
import {addCalendarDays, dateRangeValidator} from 'ngx-lift';

const today = new Date();
const min = formatDate(addCalendarDays(today, 1), 'yyyy-MM-dd', 'en-US');
const max = formatDate(addCalendarDays(today, 5), 'yyyy-MM-dd', 'en-US');
const validator = dateRangeValidator({minDate: min, maxDate: max, minInclusive: true, maxInclusive: true});
```

## Demo, forms, accessibility and language

Reuse the existing Clarity date-range page; replace private day-addition helpers with `addCalendarDays` and use Angular
`formatDate` for formatted values. Keep its native date/date-time fields, form validation, labels, keyboard/focus
behavior and reset interaction. This is a headless utility with no CVA, signals or Reactive Forms ownership. Angular
formats the machine-readable date strings; this utility owns no strings. Code identifiers/comments stay English; no new
visible/announced messages are needed. Existing page explanations remain in all eleven locales. Independent human
language approval of recent page copy remains open; the existing manual AT waiver stays a waiver. Automated scans do not
establish either human acceptance record.

## Validation, compatibility and delivery

Additive API; no migration or version bump is performed by this increment. Publish in the next approved 21.x minor
release with the existing validator notes. Record in the component roadmap alongside current date/time correctness work
without advancing the deferred picker/calendar scope. No runtime dependency or secondary entry point is added.

Before claiming local completion, run utility unit/type tests, fresh-process timezone coverage (UTC, New York, Shanghai,
Honolulu), root-export/packed-consumer verification, library and demo lint/typecheck/build, translation and
embedded-example checks, and relevant browser journeys. Preserve separate statuses for local checks, remote CI, human
acceptance, merge and publication. Unit tests must cover month/year rollover, leap days, negative/zero offsets, DST
transitions, invalid dates/offsets, Date overflow, cross-realm Dates and input nonmutation.

## Review decisions

The maintainer explicitly authorized the bounded API scope and delivery in one PR. The
[development workflow](../component-development.md#design-before-implementation) permits combined spec/implementation
PRs while retaining admission, spec review and scoped approval before implementation. The admission table records
observed downstream evidence and correctness guarantees beyond native mutation/UTC formatting. Spec review recommended
approval before implementation on 2026-11-20 with no blocking contract findings. Implementation/review/check results are
recorded in PR #240 separately from this design record.

## Implementation and local evidence

- Source: [addCalendarDays](../../../libs/ngx-lift/src/lib/utils/add-calendar-days.util.ts), exported by the existing
  root utility barrel. No dependency was added.
- [Utility tests](../../../libs/ngx-lift/src/lib/utils/local-calendar.util.spec.ts) exercise the specified boundaries,
  including fresh processes in UTC, New York, Shanghai, Honolulu and Apia. The current verification results are recorded
  in PR #240; historical results for the withdrawn formatter are not evidence for this revision.
- Both libraries and the demo passed lint/typecheck/build; translation, embedded-example and production bundle checks
  passed. The existing validation-documentation browser suite passed 12 tests across Chromium, Firefox and WebKit.
- The [packed-consumer verifier](../../../tools/package/verify-packages.mjs) asserts the root export, strict public
  types, runtime day addition and nonmutation. Its isolated peer-install result is recorded in PR #240 separately.
- Spec review and implementation review found no blocking findings. These are engineering records; they do not claim
  remote CI completion, human language acceptance, merge or publication.
