import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

import {parseFiniteNumber} from './validator-value.util';

/**
 * Creates a group validator that rejects a minimum value greater than its maximum value.
 *
 * Both values are parsed as finite numbers, so numeric strings from text inputs are compared as
 * well as numbers from `input[type=number]`. When either control is empty, non-numeric, disabled,
 * or absent, the validator returns `null` and leaves `Validators.required` and other rules to
 * report those states. A disabled child keeps its own value but is excluded from the group's
 * value, so comparing it would leave an error the user cannot clear. Attach it to the `FormGroup`,
 * not to an individual control.
 *
 * The validator is pure: it returns `{minGreaterThanMax: true}` on the group and never calls
 * `setErrors` on child controls. Child controls therefore keep their own validity and errors;
 * display the range error from `group.hasError('minGreaterThanMax')`.
 *
 * @param minControlName Name of the minimum control (defaults to `'min'`).
 * @param maxControlName Name of the maximum control (defaults to `'max'`).
 * @returns A `ValidatorFn` for a `FormGroup`.
 *
 * @example
 * ```typescript
 * import {FormControl, FormGroup} from '@angular/forms';
 * import {numberRangeValidator} from 'ngx-lift';
 *
 * const range = new FormGroup(
 *   {
 *     min: new FormControl(10),
 *     max: new FormControl(5),
 *   },
 *   {validators: [numberRangeValidator()]},
 * );
 * // range.hasError('minGreaterThanMax') === true
 * ```
 */
export function numberRangeValidator(minControlName = 'min', maxControlName = 'max'): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const minControl = group.get(minControlName);
    const maxControl = group.get(maxControlName);

    if (!minControl || !maxControl || minControl.disabled || maxControl.disabled) {
      return null;
    }

    const min = parseFiniteNumber(minControl.value);
    const max = parseFiniteNumber(maxControl.value);

    if (min === null || max === null) {
      return null;
    }

    return min > max ? {minGreaterThanMax: true} : null;
  };
}
