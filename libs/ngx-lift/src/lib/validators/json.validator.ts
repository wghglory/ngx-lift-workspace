import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

import {isEmptyControlValue} from './validator-value.util';

/**
 * Creates a validator that accepts a string containing syntactically valid JSON text.
 *
 * `JSON.parse` defines the accepted grammar, so objects, arrays, strings, numbers, `true`,
 * `false` and `null` are all valid JSON values. Combine this validator with a shape check when a
 * specific schema is required. Non-string, non-empty values are invalid because the control is
 * expected to hold JSON text. Empty values (`null`, `undefined`, `''`) are valid so that a value
 * can be made mandatory with `Validators.required` instead.
 *
 * @returns A `ValidatorFn` that returns `{invalidJson: true}` when parsing fails,
 * or `null` when the value is valid JSON text or empty.
 *
 * @example
 * ```typescript
 * import {FormControl, Validators} from '@angular/forms';
 * import {jsonValidator} from 'ngx-lift';
 *
 * const payload = new FormControl('', [Validators.required, jsonValidator()]);
 * // '{"enabled": true}' is valid; '{enabled: true}' is invalid.
 * ```
 */
export function jsonValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: unknown = control.value;

    if (isEmptyControlValue(value)) {
      return null;
    }

    if (typeof value !== 'string') {
      return {invalidJson: true};
    }

    try {
      JSON.parse(value);
      return null;
    } catch {
      return {invalidJson: true};
    }
  };
}
