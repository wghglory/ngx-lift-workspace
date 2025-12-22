import {AbstractControl, ValidationErrors} from '@angular/forms';

import {httpsPattern, urlPattern} from '../const';

export function urlValidator(control: AbstractControl): ValidationErrors | null {
  if (!urlPattern.test(control.value)) {
    return {invalidUrl: true};
  }
  return null;
}

export function httpsValidator(control: AbstractControl): ValidationErrors | null {
  if (!httpsPattern.test(control.value)) {
    return {invalidUrl: true};
  }
  return null;
}
