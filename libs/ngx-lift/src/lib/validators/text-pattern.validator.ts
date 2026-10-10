import {AbstractControl, ValidationErrors} from '@angular/forms';

// eslint-disable-next-line no-control-regex
const ASCII_CHARS_ONLY_REGEX = /^[\x00-\x7F]*$/;

/**
 * Validates that the control value does not contain any spaces or tab characters.
 *
 * Skips empty values (`null`, `undefined`, or `''`).
 *
 * @param control The Angular form control to validate.
 * @returns `{ noSpaceAllowed: true }` if whitespace is present, or `null` if valid.
 *
 * @example
 * ```typescript
 * const username = new FormControl('', [Validators.required, noSpaceAllowed]);
 * ```
 */
export function noSpaceAllowed(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (typeof value === 'string' && (value.includes(' ') || value.includes('\t'))) {
    return {noSpaceAllowed: true};
  }
  return null;
}

/**
 * Validates that the control value contains only ASCII characters (code points `\x00` to `\x7F`).
 *
 * Skips empty values (`null`, `undefined`, or `''`).
 *
 * @param control The Angular form control to validate.
 * @returns `{ onlyAsciiCharsAllowed: true }` if non-ASCII characters are present, or `null` if valid.
 *
 * @example
 * ```typescript
 * const hostname = new FormControl('', [onlyAsciiCharsAllowed]);
 * ```
 */
export function onlyAsciiCharsAllowed(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (typeof value === 'string' && value && !ASCII_CHARS_ONLY_REGEX.test(value)) {
    return {onlyAsciiCharsAllowed: true};
  }
  return null;
}
