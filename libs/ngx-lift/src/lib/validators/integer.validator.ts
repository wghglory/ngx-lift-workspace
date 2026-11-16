import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

import {isEmptyControlValue, parseSafeInteger} from './validator-value.util';

/**
 * Creates a validator that accepts only safe integers.
 *
 * Accepts JavaScript numbers and signed decimal integer strings (surrounding whitespace is
 * ignored). Rejects decimal fractions, exponent and hexadecimal notation, booleans, arrays and
 * numbers outside the safe integer range, all of which `Number()` would silently coerce.
 * Empty values (`null`, `undefined`, `''`) are valid so that a value can be made mandatory with
 * `Validators.required` instead.
 *
 * @returns A `ValidatorFn` that returns `{invalidInteger: true}` for a non-integer value,
 * or `null` when the value is an integer or empty.
 *
 * @example
 * ```typescript
 * import {FormControl, Validators} from '@angular/forms';
 * import {integerValidator} from 'ngx-lift';
 *
 * const replicas = new FormControl('', [Validators.required, integerValidator()]);
 * // '3' and -2 are valid; '3.5', '1e3', '0x10' and true are invalid.
 * ```
 */
export function integerValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: unknown = control.value;

    if (isEmptyControlValue(value)) {
      return null;
    }

    return parseSafeInteger(value) === null ? {invalidInteger: true} : null;
  };
}
