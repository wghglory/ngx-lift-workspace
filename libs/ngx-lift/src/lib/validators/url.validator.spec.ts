// validators.spec.ts

import {AbstractControl, FormControl, ValidationErrors} from '@angular/forms';

import {httpsValidator, urlValidator} from './url.validator';

describe('Url Validators', () => {
  let control: AbstractControl;

  beforeEach(() => {
    control = new FormControl('');
  });

  describe('urlValidator', () => {
    it('should return null for a valid URL', () => {
      control.setValue('http://www.example.com');
      const result: ValidationErrors | null = urlValidator(control);
      expect(result).toBeNull();
    });

    it('should return {invalidUrl: true} for an invalid URL', () => {
      control.setValue('invalid-url');
      const result: ValidationErrors | null = urlValidator(control);
      expect(result).toEqual({invalidUrl: true});
    });
  });

  describe('httpsValidator', () => {
    it('should return null for a valid HTTPS URL', () => {
      control.setValue('https://www.example.com');
      const result: ValidationErrors | null = httpsValidator(control);
      expect(result).toBeNull();
    });

    it('should return {invalidUrl: true} for an invalid HTTPS URL', () => {
      control.setValue('http://invalid-https-url.com');
      const result: ValidationErrors | null = httpsValidator(control);
      expect(result).toEqual({invalidUrl: true});
    });
  });
});
