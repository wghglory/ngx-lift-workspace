import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

import {isEmptyControlValue} from './validator-value.util';

/**
 * Creates a group validator that checks two controls hold the same value.
 *
 * Values are compared with strict equality and are not trimmed or normalized, so a trailing space
 * in either field is a mismatch. When either value is empty, a named control is absent, or a named
 * control is disabled, the validator returns `null` and leaves `Validators.required` and other
 * rules to report those states. A disabled child keeps its own value but is excluded from the
 * group's value, so comparing it would leave an error the user cannot clear. Attach it to the
 * `FormGroup`, not to an individual control.
 *
 * The validator is pure: it returns `{valuesMismatch: true}` on the group and never calls
 * `setErrors` on child controls. Child controls therefore keep their own validity and errors;
 * display the mismatch from `group.hasError('valuesMismatch')`. Both control names are required,
 * so the validator works for any pair of fields such as passwords, PINs, or email confirmation.
 *
 * @param firstControlName Name of the first control to compare.
 * @param secondControlName Name of the second control to compare.
 * @returns A `ValidatorFn` for a `FormGroup`.
 *
 * @example
 * ```typescript
 * import {FormControl, FormGroup, Validators} from '@angular/forms';
 * import {sameValueValidator} from 'ngx-lift';
 *
 * const form = new FormGroup(
 *   {
 *     password: new FormControl('', [Validators.required]),
 *     confirmPassword: new FormControl('', [Validators.required]),
 *   },
 *   {validators: [sameValueValidator('password', 'confirmPassword')]},
 * );
 * // form.hasError('valuesMismatch') === true when both values differ
 * ```
 */
export function sameValueValidator(firstControlName: string, secondControlName: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const firstControl = group.get(firstControlName);
    const secondControl = group.get(secondControlName);

    if (!firstControl || !secondControl) {
      return null;
    }

    if (firstControl.disabled || secondControl.disabled) {
      return null;
    }

    const firstValue: unknown = firstControl.value;
    const secondValue: unknown = secondControl.value;

    if (isEmptyControlValue(firstValue) || isEmptyControlValue(secondValue)) {
      return null;
    }

    return firstValue === secondValue ? null : {valuesMismatch: true};
  };
}
