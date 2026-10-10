import {FormControl, FormGroup, Validators} from '@angular/forms';
import {describe, expect, it} from 'vitest';

import {passwordMatchValidator} from './password-match.validator';

describe('passwordMatchValidator', () => {
  it('should return null when passwords match', () => {
    const form = new FormGroup(
      {
        password: new FormControl('Secret123'),
        confirmPassword: new FormControl('Secret123'),
      },
      {validators: [passwordMatchValidator()]},
    );

    expect(form.valid).toBe(true);
    expect(form.get('confirmPassword')?.hasError('passwordMismatch')).toBe(false);
  });

  it('should set passwordMismatch error when passwords differ', () => {
    const form = new FormGroup(
      {
        password: new FormControl('Secret123'),
        confirmPassword: new FormControl('DifferentPassword'),
      },
      {validators: [passwordMatchValidator()]},
    );

    expect(form.hasError('passwordMismatch')).toBe(true);
    expect(form.get('confirmPassword')?.hasError('passwordMismatch')).toBe(true);
  });

  it('should not error when confirmation is empty', () => {
    const form = new FormGroup(
      {
        password: new FormControl('Secret123'),
        confirmPassword: new FormControl(''),
      },
      {validators: [passwordMatchValidator()]},
    );

    expect(form.valid).toBe(true);
  });

  it('should clear passwordMismatch when matched while keeping other errors', () => {
    const form = new FormGroup(
      {
        password: new FormControl('Secret123'),
        confirmPassword: new FormControl('Different', [Validators.minLength(5)]),
      },
      {validators: [passwordMatchValidator()]},
    );

    expect(form.get('confirmPassword')?.hasError('passwordMismatch')).toBe(true);

    form.get('confirmPassword')?.setValue('Secret123');
    form.updateValueAndValidity();

    expect(form.get('confirmPassword')?.hasError('passwordMismatch')).toBe(false);
  });
});
