import {AbstractControl, FormArray, ValidationErrors, ValidatorFn} from '@angular/forms';

/**
 * Validator for checking uniqueness across multiple fields in a FormArray or FormGroup.
 *
 * This validator can be applied to a FormArray or FormGroup containing the controls to be validated.
 * It ensures that each control's value is unique among all other controls within the array or group.
 *
 * When duplicate values are found, the validator sets a `notUnique` error on all affected controls.
 * The error is automatically removed when the value becomes unique again.
 *
 * @example
 * ```typescript
 * // FormArray with unique values
 * const formArray = new FormArray([
 *   new FormControl('value1'),
 *   new FormControl('value2'),
 *   new FormControl('value1') // This will have notUnique error
 * ], [UniqueValidator.unique()]);
 *
 * // FormArray with custom key selector
 * const formArray = new FormArray([
 *   new FormGroup({
 *     id: new FormControl(1),
 *     name: new FormControl('Item 1')
 *   }),
 *   new FormGroup({
 *     id: new FormControl(2),
 *     name: new FormControl('Item 2')
 *   })
 * ], [UniqueValidator.unique(control => control.get('id'))]);
 * ```
 */
export class UniqueValidator {
  /**
   * Creates a validator function that checks for uniqueness of values across controls in a FormArray or FormGroup.
   *
   * The validator:
   * - Compares values using the provided key selector function
   * - Sets `notUnique` error on controls with duplicate values
   * - Automatically removes errors when values become unique
   * - Ignores null, undefined, empty strings, and 'NaN' values
   *
   * @template T - The type of the control value.
   * @param keySelector - A function to select the key control for comparison.
   *   Defaults to the control itself if not provided.
   *   This is useful when validating FormGroups where you want to check uniqueness of a specific field.
   * @returns A validator function that can be attached to a FormArray or FormGroup.
   */
  static unique<T>(
    keySelector: (control: AbstractControl) => AbstractControl<T> = (control: AbstractControl<T>) => control,
  ): ValidatorFn {
    return (formArray: AbstractControl): ValidationErrors | null => {
      if (!(formArray instanceof FormArray)) {
        return null;
      }

      const targetControls = formArray.controls.map(keySelector);
      const valueControlMap = new Map<T, AbstractControl<T>>();
      const invalidControls: AbstractControl<T>[] = [];

      for (const control of targetControls) {
        const value = control.value;

        if (value == null || String(value) === '' || String(value) === 'NaN') {
          continue;
        }

        const controlInMap = valueControlMap.get(value);

        if (controlInMap) {
          if (!invalidControls.includes(controlInMap)) {
            invalidControls.push(controlInMap);
          }

          invalidControls.push(control);
        } else {
          valueControlMap.set(value, control);
        }
      }

      const notUniqueError = {notUnique: true};

      // set errors manually for target controls
      for (const control of targetControls) {
        const errors = control.errors;

        if (invalidControls.includes(control)) {
          // set not unique error for invalid controls
          control.setErrors(errors === null ? notUniqueError : {...errors, ...notUniqueError});
        } else {
          // remove not unique errors for valid controls
          if (errors === null) {
            control.setErrors(null);
          } else {
            delete errors['notUnique'];
            control.setErrors(Object.keys(errors).length > 0 ? errors : null);
          }
        }
      }

      return invalidControls.length > 0 ? notUniqueError : null;
    };
  }
}
