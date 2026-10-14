import type {AsyncValidatorFn} from '@angular/forms';
import {of} from 'rxjs';

/** Loads certificate validation at the form boundary without changing the public synchronous library API. */
export function lazyCertificateValidator(): AsyncValidatorFn {
  let validate: (typeof import('./certificate-tools'))['validateCertificate'] | undefined;
  return (control) => {
    if (validate) {
      // Clarity revalidates on submit. Once loaded, synchronous emission avoids a spurious PENDING state.
      try {
        return of(validate(control));
      } catch {
        return of({certificateValidationUnavailable: true});
      }
    }
    return import('./certificate-tools')
      .then(({validateCertificate}) => {
        validate = validateCertificate;
        return validateCertificate(control);
      })
      .catch(() => ({certificateValidationUnavailable: true}));
  };
}
