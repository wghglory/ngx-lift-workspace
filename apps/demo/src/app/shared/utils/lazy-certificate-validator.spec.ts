import {FormControl} from '@angular/forms';
import {afterEach, describe, expect, it, vi} from 'vitest';

import {lazyCertificateValidator} from './lazy-certificate-validator';

afterEach(() => {
  vi.doUnmock('./certificate-tools');
  vi.resetModules();
});

describe('lazy certificate validation', () => {
  it('reports unavailable validation when the parser chunk fails to load', async () => {
    vi.doMock('./certificate-tools', () => {
      throw new Error('Chunk load failed');
    });
    expect(await lazyCertificateValidator()(new FormControl('certificate'))).toEqual({
      certificateValidationUnavailable: true,
    });
  });
  it('revalidates synchronously after loading, so Clarity can submit a valid form', async () => {
    const validate = vi.fn().mockReturnValue(null);
    vi.doMock('./certificate-tools', () => ({validateCertificate: validate}));
    const control = new FormControl('first', {asyncValidators: lazyCertificateValidator()});
    expect(control.pending).toBe(true);
    await vi.dynamicImportSettled();
    expect(control.valid).toBe(true);
    control.setValue('second');
    expect(control.valid).toBe(true);
    expect(validate).toHaveBeenLastCalledWith(control);
    validate.mockImplementation(() => {
      throw new Error('Parser unavailable');
    });
    control.updateValueAndValidity();
    expect(control.errors).toEqual({certificateValidationUnavailable: true});
  });
});
