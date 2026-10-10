import {Pipe, PipeTransform} from '@angular/core';
import {AbstractControl} from '@angular/forms';

/**
 * An impure pipe that determines whether an Angular form control is currently both touched and invalid.
 * Optionally checks for a specific error key.
 *
 * @example
 * ```html
 * <!-- Display error block when username control is touched and invalid -->
 * @if (form.controls.username | touchedAndInvalid) {
 *   <span class="error">Please check the username field.</span>
 * }
 *
 * <!-- Check specifically for the 'required' error key -->
 * @if (form.controls.username | touchedAndInvalid:'required') {
 *   <span class="error">Username is required.</span>
 * }
 * ```
 */
@Pipe({
  name: 'touchedAndInvalid',
  pure: false,
})
export class TouchedAndInvalidPipe implements PipeTransform {
  /**
   * Determines if the control is touched and invalid, optionally matching a specific error key.
   *
   * @param control The `AbstractControl` to inspect.
   * @param errorKey Optional specific error key to verify.
   * @returns `true` if the control is touched and invalid (and contains the specified errorKey, if given).
   */
  transform(control: AbstractControl | null | undefined, errorKey?: string): boolean {
    if (!control) {
      return false;
    }

    const isTouchedAndInvalid = Boolean(control.touched && control.invalid);
    if (!isTouchedAndInvalid) {
      return false;
    }

    if (errorKey) {
      return Boolean(control.errors && errorKey in control.errors);
    }

    return true;
  }
}
