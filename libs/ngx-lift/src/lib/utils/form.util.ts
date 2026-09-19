import {isSignal, Signal} from '@angular/core';
import {AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {of} from 'rxjs';

/**
 * Type for conditions accepted by `ifValidator` and `ifAsyncValidator`.
 * Can be a predicate function receiving the control, a Signal<boolean>, or a 0-arg boolean function.
 */
export type IfValidatorCondition = ((control: AbstractControl) => boolean) | Signal<boolean> | (() => boolean);

/**
 * Provides a conditional validator that applies the specified validator functions only if the condition is met.
 *
 * Supports both standard control predicates and modern Angular `Signal<boolean>` conditions.
 *
 * **Note on cross-control/signal validation:**
 * Angular forms only evaluate a control's validators when that control's own value changes.
 * When validating based on an external signal or another control, pair with `revalidateOnChange(control, source)`
 * so the control is automatically re-evaluated whenever the condition changes.
 *
 * @example
 * ```typescript
 * // Using a predicate:
 * ifValidator((ctrl) => ctrl.value?.length > 0, [Validators.email]);
 *
 * // Using a Signal condition paired with revalidateOnChange:
 * isUnlike = signal(false);
 * const validator = ifValidator(this.isUnlike, [Validators.required]);
 *
 * // Automatically revalidate when the signal updates:
 * revalidateOnChange(this.form.controls.reason, this.isUnlike);
 * ```
 *
 * @param condition A predicate function, a `Signal<boolean>`, or a boolean getter.
 * @param trueValidatorFn The validator function or array of validator functions to be applied when the condition is true.
 * @param falseValidatorFn Optional validator function or array of validator functions to be applied when false.
 * @returns A `ValidatorFn` that can be used with Angular Reactive Forms.
 */
export function ifValidator(
  condition: IfValidatorCondition,
  trueValidatorFn: ValidatorFn | ValidatorFn[],
  falseValidatorFn?: ValidatorFn | ValidatorFn[],
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isConditionMet = isSignal(condition) ? condition() : condition(control);

    if (!trueValidatorFn || !isConditionMet) {
      return composeValidators(control, falseValidatorFn);
    }

    return composeValidators(control, trueValidatorFn);
  };
}

/**
 * Provides a conditional async validator that applies the specified async validator function only if the condition is met.
 *
 * @param condition A predicate function, a `Signal<boolean>`, or a boolean getter.
 * @param validatorFn The async validator function to be applied conditionally.
 * @returns An `AsyncValidatorFn` that can be used with Angular Reactive Forms.
 */
export function ifAsyncValidator(condition: IfValidatorCondition, validatorFn: AsyncValidatorFn): AsyncValidatorFn {
  return (control: AbstractControl) => {
    const isConditionMet = isSignal(condition) ? condition() : condition(control);

    if (!validatorFn || !isConditionMet) {
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
): ValidationErrors | null {
  if (!validatorFn) {
    return null;
  }

  const validatorFns = Array.isArray(validatorFn) ? validatorFn : [validatorFn];
  return Validators.compose(validatorFns)?.(control) || null;
}
