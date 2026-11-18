import {AbstractControl, ValidationErrors} from '@angular/forms';

import {isHttps, isURL} from '../utils/url.util';
import {isEmptyControlValue} from './validator-value.util';

/**
 * Validator function that checks if a form control value is a valid URL.
 *
 * Empty values (`null`, `undefined`, `''`) are valid so that a URL can be made mandatory with
 * `Validators.required` instead, matching the other ngx-lift validators. A whitespace-only string
 * is not empty and is rejected.
 *
 * @param control - The form control to validate
 * @returns `null` if the value is a valid URL or empty, or an error object with `invalidUrl: true` if invalid
 *
 * @example
 * ```typescript
 * const form = new FormGroup({
 *   website: new FormControl('', [Validators.required, urlValidator])
 * });
 * ```
 */
export function urlValidator(control: AbstractControl): ValidationErrors | null {
  if (isEmptyControlValue(control.value)) {
    return null;
  }
  return isURL(control.value) ? null : {invalidUrl: true};
}

/**
 * Validator function that checks if a form control value is a valid HTTPS URL.
 *
 * Empty values (`null`, `undefined`, `''`) are valid so that a URL can be made mandatory with
 * `Validators.required` instead, matching the other ngx-lift validators. A whitespace-only string
 * is not empty and is rejected.
 *
 * @param control - The form control to validate
 * @returns `null` if the value is a valid HTTPS URL or empty, or an error object with `invalidUrl: true` if invalid
 *
 * @example
 * ```typescript
 * const form = new FormGroup({
 *   secureUrl: new FormControl('', [Validators.required, httpsValidator])
 * });
 * ```
 */
export function httpsValidator(control: AbstractControl): ValidationErrors | null {
  if (isEmptyControlValue(control.value)) {
    return null;
  }
  return isHttps(control.value) ? null : {invalidUrl: true};
}
