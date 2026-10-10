import {FormControl, Validators} from '@angular/forms';
import {beforeEach, describe, expect, it} from 'vitest';

import {TouchedAndInvalidPipe} from './touched-and-invalid.pipe';

describe('TouchedAndInvalidPipe', () => {
  let pipe: TouchedAndInvalidPipe;

  beforeEach(() => {
    pipe = new TouchedAndInvalidPipe();
  });

  it('should return false for null or undefined control', () => {
    expect(pipe.transform(null)).toBe(false);
    expect(pipe.transform(undefined)).toBe(false);
  });

  it('should return true if control is touched and invalid', () => {
    const control = new FormControl('', [Validators.required]);
    control.markAsTouched();
    expect(pipe.transform(control)).toBe(true);
  });

  it('should return false if control is untouched even when invalid', () => {
    const control = new FormControl('', [Validators.required]);
    expect(pipe.transform(control)).toBe(false);
  });

  it('should return false if control is touched and valid', () => {
    const control = new FormControl('valid text', [Validators.required]);
    control.markAsTouched();
    expect(pipe.transform(control)).toBe(false);
  });

  it('should filter by specific error key when provided', () => {
    const control = new FormControl('', [Validators.required]);
    control.markAsTouched();

    expect(pipe.transform(control, 'required')).toBe(true);
    expect(pipe.transform(control, 'minlength')).toBe(false);
  });
});
