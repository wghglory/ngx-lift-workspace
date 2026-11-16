import {FormControl, FormGroup, Validators} from '@angular/forms';
import {describe, expect, it} from 'vitest';

import {passwordMatchValidator} from './password-match.validator';

const formWith = (password: unknown, confirmation: unknown) =>
  new FormGroup(
    {password: new FormControl(password), confirmPassword: new FormControl(confirmation)},
    {validators: [passwordMatchValidator()]},
  );

describe('passwordMatchValidator', () => {
  it('reports a mismatch on the group and clears it when corrected', () => {
    const form = formWith('secret', 'secre');
    expect(form.errors).toEqual({passwordMismatch: true});

    form.controls.confirmPassword.setValue('secret');
    expect(form.errors).toBeNull();
  });

  it('leaves empty values to a separate required rule', () => {
    expect(formWith('', '').errors).toBeNull();
    expect(formWith('secret', '').errors).toBeNull();
    expect(formWith(null, undefined).errors).toBeNull();
  });

  it('compares without trimming or coercing values', () => {
    expect(formWith('secret', 'secret ').errors).toEqual({passwordMismatch: true});
    expect(formWith(1, '1').errors).toEqual({passwordMismatch: true});
    expect(formWith(1, 1).errors).toBeNull();
  });

  it('ignores disabled child controls instead of reporting an unfixable group error', () => {
    const form = formWith('secret', 'other');
    expect(form.errors).toEqual({passwordMismatch: true});

    form.controls.confirmPassword.disable();
    expect(form.controls.confirmPassword.value).toBe('other');
    expect(form.errors).toBeNull();

    form.controls.confirmPassword.enable();
    expect(form.errors).toEqual({passwordMismatch: true});

    form.controls.password.disable();
    expect(form.errors).toBeNull();

    const initiallyDisabled = new FormGroup(
      {
        password: new FormControl('secret'),
        confirmPassword: new FormControl({value: 'other', disabled: true}),
      },
      {validators: [passwordMatchValidator()]},
    );
    expect(initiallyDisabled.errors).toBeNull();
  });

  it('supports custom control names and tolerates missing controls', () => {
    const form = new FormGroup(
      {pin: new FormControl('1234'), repeatPin: new FormControl('1235')},
      {validators: [passwordMatchValidator('pin', 'repeatPin')]},
    );
    expect(form.errors).toEqual({passwordMismatch: true});
    expect(passwordMatchValidator('pin', 'missing')(form)).toBeNull();
    expect(passwordMatchValidator()(new FormControl('secret'))).toBeNull();
  });

  it('never mutates child errors', () => {
    const form = new FormGroup(
      {
        password: new FormControl('secret123', [Validators.required]),
        confirmPassword: new FormControl('other', [Validators.minLength(8)]),
      },
      {validators: [passwordMatchValidator()]},
    );

    expect(form.errors).toEqual({passwordMismatch: true});
    expect(form.controls.confirmPassword.errors).toEqual({
      minlength: {requiredLength: 8, actualLength: 5},
    });
    expect(form.controls.confirmPassword.touched).toBe(false);

    form.controls.confirmPassword.setValue('secret123');
    expect(form.errors).toBeNull();
    expect(form.controls.confirmPassword.errors).toBeNull();
  });
});
