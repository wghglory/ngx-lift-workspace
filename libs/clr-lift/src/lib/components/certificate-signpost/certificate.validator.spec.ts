import {FormControl, Validators} from '@angular/forms';
import {describe, expect, it} from 'vitest';

import {certificatePem} from './certificate.fixture';
import {certificateValidator} from './certificate.validator';

describe('certificateValidator', () => {
  it.each(['', null, undefined])('allows empty %s so required remains caller-owned', (value) => {
    const control = new FormControl(value, certificateValidator());
    expect(control.errors).toBeNull();
    control.addValidators(Validators.required);
    control.updateValueAndValidity();
    expect(control.errors).toEqual({required: true});
  });

  it('accepts expired raw PEM: parsing does not establish current validity or trust', () => {
    expect(new FormControl(certificatePem, certificateValidator()).errors).toBeNull();
  });

  it('decodes base64 PEM only when requested', () => {
    const encoded = btoa(certificatePem);
    expect(new FormControl(encoded, certificateValidator(true)).errors).toBeNull();
    expect(new FormControl(encoded, certificateValidator()).errors).toHaveProperty('invalidCertificate');
    expect(new FormControl(certificatePem, certificateValidator(true)).errors).toHaveProperty('invalidCertificate');
  });

  it.each([false, true])('reports malformed PEM and recovers with shouldDecode=%s', (encoded) => {
    const control = new FormControl(encoded ? btoa('invalid PEM') : 'invalid PEM', certificateValidator(encoded));
    expect(control.errors).toHaveProperty('invalidCertificate');
    control.setValue(encoded ? btoa(certificatePem) : certificatePem);
    expect(control.errors).toBeNull();
  });

  it('reports malformed base64 as invalidCertificate', () => {
    expect(new FormControl('%%%', certificateValidator(true)).errors).toHaveProperty('invalidCertificate');
  });
});
