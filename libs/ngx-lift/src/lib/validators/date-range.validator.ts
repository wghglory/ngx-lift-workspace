import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

import {isEmptyControlValue} from './validator-value.util';

/** Matches the `YYYY-MM-DD` value produced by `<input type="date">`. */
const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Interface defining the options for the date range validator.
 */
interface DateRangeOptions {
  /**
   * The minimum allowed date. The control value must be greater than (or equal to, if `minInclusive` is true) this date.
   * Can be a Date object or a string that can be parsed by the Date constructor.
   */
  minDate?: Date | string | null;

  /**
   * The maximum allowed date. The control value must be less than (or equal to, if `maxInclusive` is true) this date.
   * Can be a Date object or a string that can be parsed by the Date constructor.
   */
  maxDate?: Date | string | null;

  /**
   * Whether the comparison for the minimum date can include the exact date.
   * If `true`, the control value can be equal to `minDate`.
   * If `false` (default), the control value must be strictly greater than `minDate`.
   */
  minInclusive?: boolean;

  /**
   * Whether the comparison for the maximum date can include the exact date.
   * If `true`, the control value can be equal to `maxDate`.
   * If `false` (default), the control value must be strictly less than `maxDate`.
   */
  maxInclusive?: boolean;

  /**
   * Whether to compare the time components as well.
   * If `true`, comparisons will include Date time components (hours, minutes, seconds, milliseconds).
   * If `false` (default), time parts will be ignored and only the local calendar day will be compared.
   */
  compareTime?: boolean;
}

/**
 * Creates a validator function that validates a date against a specified date range.
 *
 * The validator checks if the form control's date value falls within the specified range.
 * It supports:
 * - Minimum and maximum date constraints
 * - Inclusive or exclusive boundary comparisons
 * - Time-aware or date-only comparisons
 *
 * Date-only strings (`YYYY-MM-DD`, the format produced by `<input type="date">`) describe a
 * calendar day, so they are read as local days rather than as UTC midnight. Strings that carry a
 * time or an offset keep their instant semantics. With `compareTime: false` (default) both the
 * value and the boundaries are reduced to the local calendar day before comparison.
 *
 * @param options - The options for the date range validation.
 * @returns A validator function that validates a FormControl and returns an error object if the date is out of range,
 *   or `null` if the date is valid. Error objects contain:
 *   - `minDate`: ISO string of the minimum date (if value is too early)
 *   - `maxDate`: ISO string of the maximum date (if value is too late)
 *   - `invalidDate`: `true` (if the value cannot be parsed as a date)
 *
 * @example
 * ```typescript
 * // Date range with inclusive boundaries
 * const form = new FormGroup({
 *   startDate: new FormControl('', [
 *     dateRangeValidator({
 *       minDate: new Date('2024-01-01'),
 *       maxDate: new Date('2024-12-31'),
 *       minInclusive: true,
 *       maxInclusive: true
 *     })
 *   ])
 * });
 *
 * // Date-only comparison (ignores time)
 * const form = new FormGroup({
 *   appointment: new FormControl('', [
 *     dateRangeValidator({
 *       minDate: '2024-01-01',
 *       compareTime: false
 *     })
 *   ])
 * });
 * ```
 */
export function dateRangeValidator(options: DateRangeOptions): ValidatorFn {
  const minDate = parseBoundary(options.minDate, 'minDate');
  const maxDate = parseBoundary(options.maxDate, 'maxDate');
  if (
    minDate &&
    maxDate &&
    (options.compareTime ? minDate.getTime() > maxDate.getTime() : calendarDayKey(minDate) > calendarDayKey(maxDate))
  ) {
    throw new RangeError('minDate must not be after maxDate.');
  }
  return (control: AbstractControl): ValidationErrors | null => {
    // Empty values pass so that Validators.required owns the mandatory case.
    if (isEmptyControlValue(control.value)) {
      return null;
    }

    // Parse the selected date from the control value
    const selectedDate = parseDateValue(control.value);

    if (isNaN(selectedDate.getTime())) {
      return {invalidDate: true};
    }

    if (minDate) {
      let errorCondition = false;

      if (options.compareTime) {
        errorCondition = options.minInclusive
          ? selectedDate.getTime() < minDate.getTime()
          : selectedDate.getTime() <= minDate.getTime();
      } else {
        const diff = calendarDayKey(selectedDate) - calendarDayKey(minDate);
        errorCondition = options.minInclusive ? diff < 0 : diff <= 0;
      }

      if (errorCondition) {
        return {
          minDate: minDate.toISOString(),
        };
      }
    }

    if (maxDate) {
      let errorCondition = false;

      if (options.compareTime) {
        errorCondition = options.maxInclusive
          ? selectedDate.getTime() > maxDate.getTime()
          : selectedDate.getTime() >= maxDate.getTime();
      } else {
        const diff = calendarDayKey(selectedDate) - calendarDayKey(maxDate);
        errorCondition = options.maxInclusive ? diff > 0 : diff >= 0;
      }

      if (errorCondition) {
        return {
          maxDate: maxDate.toISOString(),
        };
      }
    }

    return null;
  };
}

/**
 * Ordinal key for a local calendar day, so comparisons never depend on the time of day, the
 * offset, or daylight-saving transitions.
 */
function calendarDayKey(date: Date): number {
  return date.getFullYear() * 10_000 + (date.getMonth() + 1) * 100 + date.getDate();
}

/**
 * Reads a value or a boundary without moving a calendar-day string to another day.
 *
 * `new Date('2024-01-15')` treats a date-only string as UTC midnight, which is the previous
 * local day everywhere west of UTC. A date-only value is therefore rebuilt from its local
 * calendar components. Values that carry a time or an offset keep their instant semantics, and
 * an impossible calendar day (`2024-02-31`) still produces an invalid date.
 */
function parseDateValue(value: Date | string | number): Date {
  const dateOnly = typeof value === 'string' ? DATE_ONLY_PATTERN.exec(value.trim()) : null;
  if (!dateOnly) {
    return new Date(value);
  }

  const [, year, month, day] = dateOnly;
  const parsed = new Date(Number(year), Number(month) - 1, Number(day));
  // The Date constructor maps the years 0-99 to 1900-1999; the pattern always carries four digits.
  parsed.setFullYear(Number(year));
  const roundTrips =
    parsed.getFullYear() === Number(year) &&
    parsed.getMonth() === Number(month) - 1 &&
    parsed.getDate() === Number(day);

  return roundTrips ? parsed : new Date(NaN);
}

function parseBoundary(value: Date | string | null | undefined, name: string): Date | null {
  if (value == null) return null;
  const date = parseDateValue(value);
  if (!Number.isFinite(date.getTime())) throw new TypeError(`${name} must be a valid date.`);
  return date;
}
