import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

import {differenceInDays} from '../utils/difference-in-days.util';

/**
 * Interface defining the options for the date range validator.
 */
interface DateRangeOptions {
  /**
   * The minimum allowed date. The control value must be greater than (or equal to, if `minInclusive` is true) this date.
   * Can be a Date object or a string that can be parsed by the Date constructor.
   */
  minDate?: Date | string;

  /**
   * The maximum allowed date. The control value must be less than (or equal to, if `maxInclusive` is true) this date.
   * Can be a Date object or a string that can be parsed by the Date constructor.
   */
  maxDate?: Date | string;

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
   * If `false` (default), time parts will be ignored and only the date portion will be compared.
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
  return (control: AbstractControl): ValidationErrors | null => {
    // if control doesn't have any value, pass validation. Developer should use Angular required validator.
    if (!control.value) {
      return null;
    }

    // Parse the selected date from the control value
    const selectedDate = new Date(control.value);

    if (isNaN(selectedDate.getTime())) {
      return {invalidDate: true};
    }

    const minDate = options.minDate ? new Date(options.minDate) : null;
    const maxDate = options.maxDate ? new Date(options.maxDate) : null;

    if (minDate) {
      let errorCondition = false;

      if (options.compareTime) {
        errorCondition = options.minInclusive
          ? selectedDate.getTime() < minDate.getTime()
          : selectedDate.getTime() <= minDate.getTime();
      } else {
        const diff = differenceInDays(selectedDate, minDate);
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
        const diff = differenceInDays(selectedDate, maxDate);
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
