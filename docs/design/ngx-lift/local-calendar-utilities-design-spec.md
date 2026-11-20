# Local calendar utilities design specification

Status: Implemented (unreleased); API reviewed. Owner: ngx-lift maintainers. Updated: 2026-11-20. Package: ngx-lift.
Approval: the maintainer explicitly requested the spec and both APIs in
[PR #240](https://github.com/wghglory/ngx-lift-workspace/pull/240) on 2026-11-20. That instruction also authorizes the
spec and implementation in the same PR instead of separate PRs. It does not authorize publication.

## Problem, consumer evidence and admission

Applications need a date input boundary such as five calendar days from a supplied reference date. Repeating local
component formatting or adding 86,400,000 milliseconds risks UTC day shifts, input mutation and daylight-saving errors.
A maintainer-owned application's log-archive retention form already computes a calendar-day maximum using a date
library; its shared form utilities also format local date-time input values. This is observed downstream evidence, not
an authorization to migrate that application or to change elapsed-hour retention policies. The existing date-range demo
independently duplicates local-day addition and formatting in its executable code and displayed examples.

The maintainer requested these two exports specifically; no date library, timezone service or picker is added.

| Symbol              | Consumer                                                                   | Native API / existing export                                                                                                                                                 | Other admission checks                                                                                                                                         | Verdict         |
| ------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| `addCalendarDays`   | Calendar-day retention maximum and date-range input boundaries             | `setDate` mutates; this contract copies, validates safe-integer offsets and rejects overflow. `differenceInDays` measures elapsed 24-hour periods and is not an alternative. | Domain-neutral; public Date APIs only; no globals, DOM, timers, dependencies, owned UI messages or form state. Fits the Angular 21 date/time correctness work. | Proceed to spec |
| `toLocalDateString` | Local date input bounds and the date portion of local date-time formatting | `toISOString` uses UTC; locale display formatting is not the fixed HTML date format. No existing export provides this validated contract.                                    | Same safety, localization, lifecycle and package checks as above; no additional entry point.                                                                   | Proceed to spec |

## Industry evidence and decisions

Sources checked 2026-11-20. These comparisons concern headless date operations, not a proposal for another picker.

| Primary source                                                                                                                          | Evidence and decision                                                                                                                                                                |
| --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [JavaScript setDate](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setDate)                     | Adopt local-calendar arithmetic; explicitly retain native DST gap/overlap normalization. Adapt by copying first and validating input/output. A calendar day is not a fixed 24 hours. |
| [JavaScript toISOString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString)             | Reject UTC ISO slicing for local calendar input values.                                                                                                                              |
| [Angular Material NativeDateAdapter](https://github.com/angular/components/blob/main/src/material/core/datetime/native-date-adapter.ts) | Adopt the explicit calendar-day vocabulary; avoid requiring a Material adapter/provider for two pure functions.                                                                      |
| [Clarity Date Picker](https://clarity.design/documentation/datepicker/code)                                                             | Keep Clarity responsible for picker UI and localized presentation; these utilities own native Date arithmetic and a machine-readable date string.                                    |
| [NG-ZORRO DatePicker](https://ng.ant.design/components/date-picker/en)                                                                  | Keep component selection and date formatting infrastructure separate; no NG-ZORRO dependency or component wrapper.                                                                   |
| [React native input](https://react.dev/reference/react-dom/components/input)                                                            | Preserve ordinary string input values; no framework-specific form bridge is required for a headless formatter.                                                                       |

## Goals and non-goals

- Generate readable native date-input boundaries from one caller-owned reference Date.
- Centralize local-calendar correctness, input validation and nonmutation without runtime dependencies.
- Keep existing validators and elapsed-time utilities unchanged.

No parsing, localized display formatting, timezone selection, business-day/month/year arithmetic, clock ownership,
Temporal polyfill, date-time formatter, calendar component or forms value accessor is included. A Date supplied by the
caller already represents an instant; neither API reverses UTC parsing done before the call.

## Public API and contracts

```typescript
export function addCalendarDays(date: Date, days: number): Date;
export function toLocalDateString(date: Date): string;
```

Both are synchronous, exported from the existing ngx-lift root. They use the host's local timezone, accept valid native
Date instances (including cross-realm Dates), never read the current clock themselves, and never mutate input. They are
deterministic for the supplied input and host timezone. SSR needs no browser APIs, but differing server/client timezones
can produce differing calendar dates; the application owns that boundary.

### addCalendarDays

Clone the input instant, then adjust its local day-of-month by a positive, negative or zero safe-integer offset.
Month/year rollover and leap years follow native Date behavior. Zero returns a distinct Date with the exact original
instant, including during a repeated DST hour. Preserve local time components where possible; native Date resolves
nonexistent/repeated local times using its normal compatible disambiguation. A timezone transition can skip a calendar
label entirely; this API does not promise to manufacture an unavailable wall-clock date.

A non-Date input throws TypeError. An invalid Date, a non-safe-integer offset (including NaN, infinities and fractions),
or a result outside the Date range throws RangeError. No string/number date coercion or offset rounding is performed.
The result retains the native Date range; the formatter has a narrower four-digit positive-year contract.

### toLocalDateString

Read the input's local year/month/day and return exactly `YYYY-MM-DD`, independent of UI language. Pad years 1–99
without the Date constructor's 1900 offset. Reject local years outside 1–9999 with RangeError so output is a positive,
four-digit HTML date, not a signed expanded year or year zero. Invalid Date throws RangeError; non-Date throws
TypeError. Time components are omitted, not rounded. No Date is constructed from a string by this function.

## Use cases and acceptance

| ID  | Task                        | Action and observable outcome                                                                           | Failure/recovery                                                                      | Evidence plan                               |
| --- | --------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------- |
| UC1 | Calendar-day input interval | Add 1 and 5 days to one reference, format both, pass strings to validator/native min/max                | Correct invalid reference/offset; no partial mutation                                 | Date-range demo and utility tests           |
| UC2 | Day addition across DST     | Add/subtract one local calendar day; keep wall time where it exists even if elapsed time is 23/25 hours | Native gap normalization is documented; exact duration callers use timestamps instead | New York spring/fall timezone checks        |
| UC3 | Local input string          | Format dates around UTC day boundaries and early years to local YYYY-MM-DD                              | Invalid/out-of-range years throw                                                      | UTC, New York, Shanghai and Honolulu checks |
| UC4 | Caller ownership            | Zero offset clones exactly; positive/negative calls leave input unchanged                               | No hidden clock, locale, mutation or global side effects                              | Unit/type and installed-consumer checks     |

```typescript
import {addCalendarDays, dateRangeValidator, toLocalDateString} from 'ngx-lift';

const today = new Date();
const min = toLocalDateString(addCalendarDays(today, 1));
const max = toLocalDateString(addCalendarDays(today, 5));
const validator = dateRangeValidator({minDate: min, maxDate: max, minInclusive: true, maxInclusive: true});
```

## Demo, forms, accessibility and language

Reuse the existing Clarity date-range page; replace executable and displayed private helpers with these exports. Keep
its native date/date-time fields, form validation, labels, keyboard/focus behavior and reset interaction. These are
headless utilities with no CVA, signals or Reactive Forms ownership. Their strings are machine-readable dates, not
localized display text. Code identifiers/comments stay English; no new visible/announced messages are needed. Existing
page explanations remain in all eleven locales. Independent human language approval of recent page copy remains open;
the existing manual AT waiver stays a waiver. Automated scans do not establish either human acceptance record.

## Validation, compatibility and delivery

Additive APIs; no migration or version bump is performed by this increment. Publish in the next approved 21.x minor
release with the existing validator notes. Record in the component roadmap alongside current date/time correctness work
without advancing the deferred picker/calendar scope. No runtime dependency or secondary entry point is added.

Before claiming local completion, run utility unit/type tests, fresh-process timezone coverage (UTC, New York, Shanghai,
Honolulu), root-export/packed-consumer verification, library and demo lint/typecheck/build, translation and
embedded-example checks, and relevant browser journeys. Preserve separate statuses for local checks, remote CI, human
acceptance, merge and publication. Unit tests must cover month/year rollover, leap days, negative/zero offsets, DST
transitions, invalid dates/offsets, Date overflow, year padding/range, cross-realm Dates and input nonmutation.

## Review decisions

The explicit maintainer instruction supersedes the earlier request for additional consumer evidence and the default
separate-PR sequence for this bounded scope. The admission table records the actual downstream evidence and the
correctness guarantees beyond native mutation/UTC formatting. Spec review recommended approval before implementation in
this PR on 2026-11-20 with no blocking contract findings. Implementation/review/check results must be recorded in the
PR, not inferred from this plan.

## Implementation and local evidence

- Source: [addCalendarDays](../../../libs/ngx-lift/src/lib/utils/add-calendar-days.util.ts) and
  [toLocalDateString](../../../libs/ngx-lift/src/lib/utils/to-local-date-string.util.ts), exported by the existing root
  utility barrel. No dependency was added.
- [Utility tests](../../../libs/ngx-lift/src/lib/utils/local-calendar.util.spec.ts) exercise the specified boundaries,
  including fresh processes in UTC, New York, Shanghai, Honolulu and Apia. The full ngx-lift suite passed 986 tests
  across 63 files on 2026-11-20.
- Both libraries and the demo passed lint/typecheck/build; translation, embedded-example and production bundle checks
  passed. The existing validation-documentation browser suite passed 12 tests across Chromium, Firefox and WebKit.
- The [packed-consumer verifier](../../../tools/package/verify-packages.mjs) asserts both root exports, strict public
  types, runtime date formatting and nonmutation. Its isolated peer-install result is recorded in PR #240 separately.
- Spec review and implementation review found no blocking findings. These are engineering records; they do not claim
  remote CI completion, human language acceptance, merge or publication.
