import type {AbstractControl, ValidationErrors} from '@angular/forms';
import {certificateValidator} from 'clr-lift';

/** Runs the synchronous public validator after its parser dependency has been loaded. */
export function validateCertificate(control: AbstractControl): ValidationErrors | null {
  return certificateValidator()(control);
}
