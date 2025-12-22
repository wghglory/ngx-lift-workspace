import {AbstractControl, AsyncValidatorFn, ValidatorFn, Validators} from '@angular/forms';
import {of} from 'rxjs';

/**
 * Provides a conditional validator that applies the specified validator functions only if the condition is met.
 *
 * @param condition A function that determines whether the validators should be applied.
 * @param trueValidatorFn The validator function or an array of validator functions to be applied when the condition is true.
 * @param falseValidatorFn Optional. The validator function or an array of validator functions to be applied when the condition is false.
 * @returns A validator function that can be used with Angular Reactive Forms.
 */
export function ifValidator(
  condition: (control: AbstractControl) => boolean,
  trueValidatorFn: ValidatorFn | ValidatorFn[],
  falseValidatorFn?: ValidatorFn | ValidatorFn[],
): ValidatorFn {
  /**
   * @param control The AbstractControl to validate.
   * @returns Validation errors if the condition is met; otherwise, null.
   */
  return (control: AbstractControl): Validators | null => {
    if (!trueValidatorFn || !condition(control)) {
      return composeValidators(control, falseValidatorFn);
    }

    return composeValidators(control, trueValidatorFn);
  };
}

/**
 * Provides a conditional async validator that applies the specified async validator function only if the condition is met.
 *
 * @param condition A function that determines whether the async validator should be applied.
 * @param validatorFn The async validator function to be applied conditionally.
 * @returns An async validator function that can be used with Angular Reactive Forms.
 */
export function ifAsyncValidator(
  condition: (control: AbstractControl) => boolean,
  validatorFn: AsyncValidatorFn,
): AsyncValidatorFn {
  /**
   * @param control The AbstractControl to validate asynchronously.
   * @returns An observable that emits validation errors if the condition is met; otherwise, emits null.
   */
  return (control: AbstractControl) => {
    if (!validatorFn || !condition(control)) {
      return of(null);
    }

    return validatorFn(control);
  };
}

/**
 * Composes and applies the provided validators to the given AbstractControl.
 *
 * @param control The AbstractControl to validate.
 * @param validatorFn The validator function or an array of validator functions to be applied.
 * @returns Validation errors if the validators are applicable; otherwise, null.
 */
function composeValidators(
  control: AbstractControl,
  validatorFn: ValidatorFn | ValidatorFn[] | undefined,
): Validators | null {
  if (!validatorFn) {
    return null;
  }

  const validatorFns = Array.isArray(validatorFn) ? validatorFn : [validatorFn];
  return Validators.compose(validatorFns)?.(control) || null;
}
