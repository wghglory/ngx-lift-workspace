import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

import {httpsPattern, urlPattern} from '../const';

/**
 * Validator function that checks if a form control value is a valid URL.
 *
 * @param control - The form control to validate
 * @returns `null` if the value is a valid URL, or an error object with `invalidUrl: true` if invalid
 *
 * @example
 * ```typescript
 * const form = new FormGroup({
 *   website: new FormControl('', urlValidator)
 * });
 * ```
 */
export function urlValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value || !urlPattern.test(control.value)) {
    return {invalidUrl: true};
  }
  return null;
}

/**
 * Validator function that checks if a form control value is a valid HTTPS URL.
 *
 * @param control - The form control to validate
 * @returns `null` if the value is a valid HTTPS URL, or an error object with `invalidUrl: true` if invalid
 *
 * @example
 * ```typescript
 * const form = new FormGroup({
 *   secureUrl: new FormControl('', httpsValidator)
 * });
 * ```
 */
export function httpsValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value || !httpsPattern.test(control.value)) {
    return {invalidUrl: true};
  }
  return null;
}
