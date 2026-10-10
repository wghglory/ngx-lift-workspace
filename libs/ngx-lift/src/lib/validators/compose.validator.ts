import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

/**
 * A validation rule that pairs an Angular `ValidatorFn` with an error message or translation key.
 */
export interface ValidationRule {
  /** The validator function to execute. */
  validate: ValidatorFn;
  /** The error message string or translation key returned as the error value when this rule fails. */
  message: string;
}

/**
 * Composes multiple validators into a single `ValidatorFn` that returns `{ [errorKey]: message }`
 * for the first failing rule.
 *
 * Rules are evaluated sequentially. The first rule whose validator returns a non-null error wins.
 * Skips validation when the control value is empty (empty string, `null`, or `undefined`).
 * Use `Validators.required` separately when a value is mandatory.
 *
 * @param errorKey The single validation error key under which the failing message will be stored.
 * @param rules Ordered array of validation rules to evaluate.
 * @returns An Angular `ValidatorFn`.
 *
 * @example
 * ```typescript
 * import { Validators } from '@angular/forms';
 * import { composeValidators, noSpaceAllowed } from 'ngx-lift';
 *
 * const usernameValidator = composeValidators('usernameError', [
 *   { validate: Validators.minLength(3), message: 'Must be at least 3 characters' },
 *   { validate: Validators.maxLength(20), message: 'Must not exceed 20 characters' },
 *   { validate: noSpaceAllowed, message: 'Spaces are not allowed' },
 * ]);
 * ```
 */
export function composeValidators(errorKey: string, rules: ValidationRule[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value === null || value === undefined || value === '') {
      return null;
    }

    for (const rule of rules) {
      const error = rule.validate(control);
      if (error) {
        return {[errorKey]: rule.message};
      }
    }

    return null;
  };
}
