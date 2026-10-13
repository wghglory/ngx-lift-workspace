import {AbstractControl, ValidationErrors} from '@angular/forms';
import forge from 'node-forge';

export function certificateValidator(shouldDecode = false): (control: AbstractControl) => ValidationErrors | null {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value) {
      try {
        forge.pki.certificateFromPem(shouldDecode ? atob(control.value) : control.value);
      } catch (error) {
        return {invalidCertificate: error};
      }
    }

    return null;
  };
}
