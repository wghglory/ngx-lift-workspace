import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

/**
 * Validates that the control value is a syntactically valid JSON string.
 *
 * Skips validation for empty values (`null`, `undefined`, or `''`). Use `Validators.required` separately
 * when required.
 *
 * @returns A `ValidatorFn` returning `{ json: true }` when parsing fails, or `null` when valid.
 *
 * @example
 * ```typescript
 * const payloadControl = new FormControl('{"enabled": true}', [jsonValidator()]);
 * ```
 */
export function jsonValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value || typeof value !== 'string') {
      return null;
    }

    try {
      JSON.parse(value);
      return null;
    } catch {
      return {json: true};
    }
  };
}
