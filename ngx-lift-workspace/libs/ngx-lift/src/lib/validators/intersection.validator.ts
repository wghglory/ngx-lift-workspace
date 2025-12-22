import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

/**
 * A custom validator function that checks for intersection between two form controls. The two controls' values must be arrays.
 *
 * @param {string} controlName1 - The name of the first form control.
 * @param {string} controlName2 - The name of the second form control.
 * @returns {ValidatorFn} A function that validates the form group and returns an error if there is an intersection.
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
