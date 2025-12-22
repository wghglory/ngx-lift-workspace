import {AbstractControl, FormArray, ValidationErrors, ValidatorFn} from '@angular/forms';

/**
 * Validator for checking uniqueness across multiple fields in a FormArray or FormGroup.
 *
 * This validator can be applied to a FormArray or FormGroup containing the controls to be validated.
 * It ensures that each control's value is unique among all other controls within the array or group.
 */
export class UniqueValidator {
  /**
   * Validator function to be attached to a FormArray or FormGroup.
   *
   * This validator checks for uniqueness of each control's value within the array or group.
   *
   * @param keySelector A function to select the key control for comparison (default is the control itself).
   * @typeparam T The type of the control value.
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
