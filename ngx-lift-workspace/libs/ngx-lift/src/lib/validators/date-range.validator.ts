import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

import {differenceInDays} from '../utils/difference-in-days.util';

/**
 * Interface defining the options for the date range validator.
 */
interface DateRangeOptions {
  minDate?: Date | string; // Minimum allowed date
  maxDate?: Date | string; // Maximum allowed date
  minInclusive?: boolean; // Whether the comparison for the minimum date can include the exact date
  maxInclusive?: boolean; // Whether the comparison for the maximum date can include the exact date
  compareTime?: boolean; // Whether to compare the time as well. If true, comparisons will include Date time components; if false, time parts will be ignored
}

/**
 * Validates a date against a specified date range.
 *
 * @param {DateRangeOptions} options - The options for the date range validation.
 * @returns {ValidatorFn} A function that validates a FormControl and returns an error if the date is out of range.
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
