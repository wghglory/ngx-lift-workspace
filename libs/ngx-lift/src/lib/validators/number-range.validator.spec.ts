import {FormControl, FormGroup, Validators} from '@angular/forms';
import {describe, expect, it} from 'vitest';

import {numberRangeValidator} from './number-range.validator';

describe('numberRangeValidator', () => {
  it('should return null when min <= max', () => {
    const form = new FormGroup(
      {
        min: new FormControl(5),
        max: new FormControl(10),
      },
      {validators: [numberRangeValidator()]},
    );

    expect(form.valid).toBe(true);
    expect(form.get('min')?.hasError('minGreaterThanMax')).toBe(false);
    expect(form.get('max')?.hasError('minGreaterThanMax')).toBe(false);
  });

  it('should return null when min === max', () => {
    const form = new FormGroup(
      {
        min: new FormControl(5),
        max: new FormControl(5),
      },
      {validators: [numberRangeValidator()]},
    );

    expect(form.valid).toBe(true);
  });

  it('should set minGreaterThanMax error on group and controls when min > max', () => {
    const form = new FormGroup(
      {
        min: new FormControl(20),
        max: new FormControl(10),
      },
      {validators: [numberRangeValidator()]},
    );

    expect(form.hasError('minGreaterThanMax')).toBe(true);
    expect(form.get('min')?.hasError('minGreaterThanMax')).toBe(true);
    expect(form.get('max')?.hasError('minGreaterThanMax')).toBe(true);
  });

  it('should clear minGreaterThanMax error when fixed while preserving other errors', () => {
    const form = new FormGroup(
      {
        min: new FormControl(20, [Validators.required]),
        max: new FormControl(10),
      },
      {validators: [numberRangeValidator()]},
    );

    expect(form.get('min')?.hasError('minGreaterThanMax')).toBe(true);

    form.get('min')?.setValue(5);
    form.updateValueAndValidity();

    expect(form.get('min')?.hasError('minGreaterThanMax')).toBe(false);
    expect(form.get('max')?.hasError('minGreaterThanMax')).toBe(false);
  });

  it('should support custom control names', () => {
    const form = new FormGroup(
      {
        lower: new FormControl(50),
        upper: new FormControl(10),
      },
      {validators: [numberRangeValidator('lower', 'upper')]},
    );

    expect(form.hasError('minGreaterThanMax')).toBe(true);
  });
});
