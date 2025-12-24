import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

/**
 * Creates a validator function that checks for intersection between two form controls within a FormGroup.
 * Both controls' values must be arrays. The validator sets an error on both controls if they have any common values.
 *
 * This is useful for scenarios where you need to ensure two arrays don't share any elements,
 * such as preventing duplicate selections in multi-select scenarios.
 *
 * @template T - The type of elements in the arrays (defaults to `string`).
 * @param controlName1 - The name of the first form control in the FormGroup.
 * @param controlName2 - The name of the second form control in the FormGroup.
 * @returns A validator function that validates the FormGroup and returns an error object with `intersection: true`
 *   if there is an intersection between the two arrays, or `null` if there is no intersection.
 *
 * @example
 * ```typescript
 * const form = new FormGroup({
 *   selectedUsers: new FormControl(['user1', 'user2']),
 *   excludedUsers: new FormControl(['user3', 'user4']),
 * }, {
 *   validators: [intersectionValidator('selectedUsers', 'excludedUsers')]
 * });
 *
 * // If selectedUsers contains 'user1' and excludedUsers also contains 'user1',
 * // both controls will have an error: { intersection: true }
 * ```
 */
export function intersectionValidator<T = string>(controlName1: string, controlName2: string): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const control1 = formGroup.get(controlName1);
    const control2 = formGroup.get(controlName2);

    if (!control1 || !control2) {
      return null; // If either control is undefined or null
    }

    const value1 = control1.value;
    const value2 = control2.value;

    // Assuming both values are arrays
    if (!Array.isArray(value1) || !Array.isArray(value2)) {
      return null;
    }

    const intersection = value1.filter((value: T) => value2.includes(value));

    if (intersection.length > 0) {
      control1.setErrors({intersection: true});
      control2.setErrors({intersection: true});
      return {intersection: true};
    } else {
      control1.setErrors(null);
      control2.setErrors(null);
      return null;
    }
  };
}
