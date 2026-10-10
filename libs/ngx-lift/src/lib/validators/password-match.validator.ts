import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

/**
 * Validates that the password and confirmation password values match within a `FormGroup`.
 *
 * When both values exist and do not match, sets a `{ passwordMismatch: true }` error on the
 * confirmation control. Clears the error when the values match while preserving any other existing
 * validation errors on the control.
 *
 * @param passwordControlName Name of the password control (defaults to `'password'`).
 * @param confirmPasswordControlName Name of the confirmation control (defaults to `'confirmPassword'`).
 * @returns A `ValidatorFn` for use on a `FormGroup`.
 *
 * @example
 * ```typescript
 * const form = new FormGroup({
 *   password: new FormControl(''),
 *   confirmPassword: new FormControl(''),
 * }, { validators: [passwordMatchValidator()] });
 * ```
 */
export function passwordMatchValidator(
  passwordControlName = 'password',
  confirmPasswordControlName = 'confirmPassword',
): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const passwordCtrl = group.get(passwordControlName);
    const confirmPasswordCtrl = group.get(confirmPasswordControlName);

    if (!passwordCtrl || !confirmPasswordCtrl) {
      return null;
    }

    const password = passwordCtrl.value;
    const confirmPassword = confirmPasswordCtrl.value;

    const hasMismatchError = Boolean(password) && Boolean(confirmPassword) && password !== confirmPassword;

    const currentErrors = confirmPasswordCtrl.errors || {};
    const {passwordMismatch, ...otherErrors} = currentErrors;

    if (hasMismatchError) {
      confirmPasswordCtrl.setErrors({...otherErrors, passwordMismatch: true});
    } else if (passwordMismatch) {
      confirmPasswordCtrl.setErrors(Object.keys(otherErrors).length ? otherErrors : null);
    }

    return hasMismatchError ? {passwordMismatch: true} : null;
  };
}
