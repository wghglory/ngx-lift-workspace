import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

/**
 * Validates that the minimum value is less than or equal to the maximum value within a `FormGroup`.
 *
 * When both values are valid numbers and `min > max`, assigns a `{ minGreaterThanMax: true }` error
 * to both specified controls. Clears the error when the condition is resolved, preserving any other
 * existing errors on the controls.
 *
 * @param minControlName Name of the minimum control in the FormGroup (defaults to `'min'`).
 * @param maxControlName Name of the maximum control in the FormGroup (defaults to `'max'`).
 * @returns A `ValidatorFn` for use on a `FormGroup`.
 *
 * @example
 * ```typescript
 * const rangeForm = new FormGroup({
 *   min: new FormControl(10),
 *   max: new FormControl(5),
 * }, { validators: [numberRangeValidator('min', 'max')] });
 * ```
 */
export function numberRangeValidator(minControlName = 'min', maxControlName = 'max'): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const minCtrl = group.get(minControlName);
    const maxCtrl = group.get(maxControlName);

    if (!minCtrl || !maxCtrl) {
      return null;
    }

    const min = minCtrl.value;
    const max = maxCtrl.value;

    const isMinValid = typeof min === 'number' && !isNaN(min);
    const isMaxValid = typeof max === 'number' && !isNaN(max);

    const hasRangeError = isMinValid && isMaxValid && min > max;

    const updateError = (ctrl: AbstractControl, hasError: boolean): void => {
      const currentErrors = ctrl.errors || {};
      const {minGreaterThanMax, ...otherErrors} = currentErrors;

      if (hasError) {
        ctrl.setErrors({...otherErrors, minGreaterThanMax: true});
      } else if (minGreaterThanMax) {
        ctrl.setErrors(Object.keys(otherErrors).length ? otherErrors : null);
      }
    };

    updateError(minCtrl, hasRangeError);
    updateError(maxCtrl, hasRangeError);

    return hasRangeError ? {minGreaterThanMax: true} : null;
  };
}
