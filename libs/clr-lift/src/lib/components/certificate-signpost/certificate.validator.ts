import {AbstractControl, ValidationErrors} from '@angular/forms';
import {pki} from 'node-forge';

export function certificateValidator(shouldDecode = false): (control: AbstractControl) => ValidationErrors | null {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value) {
      try {
        pki.certificateFromPem(shouldDecode ? atob(control.value) : control.value);
      } catch (error) {
        return {invalidCertificate: error};
      }
    }

    return null;
  };
}
