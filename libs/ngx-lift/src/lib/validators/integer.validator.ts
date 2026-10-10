import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

/**
 * Validates that the control value is an integer.
 *
 * Allows empty values (`null`, `undefined`, and `''`) so mandatory validation can be handled
 * separately via `Validators.required`.
 *
 * @returns A `ValidatorFn` returning `{ notInteger: true }` when invalid, or `null` when valid.
 *
 * @example
 * ```typescript
 * const countControl = new FormControl('', [Validators.required, integerValidator()]);
 * ```
 */
export function integerValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value === null || value === undefined || value === '') {
      return null;
    }

    const numValue = Number(value);

    if (isNaN(numValue) || !Number.isInteger(numValue)) {
      return {notInteger: true};
    }

    return null;
  };
}
