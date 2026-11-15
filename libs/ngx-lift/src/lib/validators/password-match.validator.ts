import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

import {isEmptyControlValue} from './validator-value.util';

/**
 * Creates a group validator that checks two controls hold the same value.
 *
 * Values are compared with strict equality and are not trimmed or normalized, so a trailing space
 * in either field is a mismatch. When either value is empty or a named control is absent, the
 * validator returns `null` and leaves `Validators.required` and other rules to report those
 * states. Attach it to the `FormGroup`, not to an individual control.
 *
 * The validator is pure: it returns `{passwordMismatch: true}` on the group and never calls
 * `setErrors` on child controls. Child controls therefore keep their own validity and errors;
 * display the mismatch from `group.hasError('passwordMismatch')`. The names are configurable
 * because confirmation fields are not always called `confirmPassword`.
 *
 * @param passwordControlName Name of the password control (defaults to `'password'`).
 * @param confirmPasswordControlName Name of the confirmation control (defaults to `'confirmPassword'`).
 * @returns A `ValidatorFn` for a `FormGroup`.
 *
 * @example
 * ```typescript
 * import {FormControl, FormGroup, Validators} from '@angular/forms';
 * import {passwordMatchValidator} from 'ngx-lift';
 *
 * const form = new FormGroup(
 *   {
 *     password: new FormControl('', [Validators.required]),
 *     confirmPassword: new FormControl('', [Validators.required]),
 *   },
 *   {validators: [passwordMatchValidator()]},
 * );
 * // form.hasError('passwordMismatch') === true when both values differ
 * ```
 */
export function passwordMatchValidator(
  passwordControlName = 'password',
  confirmPasswordControlName = 'confirmPassword',
): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const passwordControl = group.get(passwordControlName);
    const confirmPasswordControl = group.get(confirmPasswordControlName);

    if (!passwordControl || !confirmPasswordControl) {
      return null;
    }

    const password: unknown = passwordControl.value;
    const confirmation: unknown = confirmPasswordControl.value;

    if (isEmptyControlValue(password) || isEmptyControlValue(confirmation)) {
      return null;
    }

    return password === confirmation ? null : {passwordMismatch: true};
  };
}
