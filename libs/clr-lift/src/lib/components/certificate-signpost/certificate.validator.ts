import {AbstractControl, ValidationErrors} from '@angular/forms';

import {parseCertificateFromPem} from './certificate-parser';

/** Checks PEM parsing only; does not verify signatures, certificate chains, revocation or trust. */
export function certificateValidator(pemEncoded = false): (control: AbstractControl) => ValidationErrors | null {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value) {
      try {
        parseCertificateFromPem(pemEncoded ? atob(control.value) : control.value, false);
      } catch (error) {
        return {invalidCertificate: error};
      }
    }

    return null;
  };
}
