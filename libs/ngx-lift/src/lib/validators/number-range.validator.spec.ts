import {FormControl, FormGroup, Validators} from '@angular/forms';
import {describe, expect, it} from 'vitest';

import {numberRangeValidator} from './number-range.validator';

const range = (min: unknown, max: unknown, validator = numberRangeValidator()) =>
  new FormGroup({min: new FormControl(min), max: new FormControl(max)}, {validators: [validator]});

describe('numberRangeValidator', () => {
  it('reports min > max on the group and clears it when corrected', () => {
    const form = range(10, 5);
    expect(form.errors).toEqual({minGreaterThanMax: true});

    form.controls.max.setValue(20);
    expect(form.errors).toBeNull();
    expect(range(10, 10).errors).toBeNull();
    expect(range(-5, 0).errors).toBeNull();
  });

  it('compares numeric strings from text inputs', () => {
    expect(range('10', '5').errors).toEqual({minGreaterThanMax: true});
    expect(range(' 2.5 ', '3').errors).toBeNull();
    expect(range('1e2', '50').errors).toEqual({minGreaterThanMax: true});
  });

  it('leaves incomplete, non-numeric and missing controls to other rules', () => {
    expect(range('', 5).errors).toBeNull();
    expect(range(5, null).errors).toBeNull();
    expect(range('abc', 5).errors).toBeNull();
    expect(range('0x10', 5).errors).toBeNull();
    expect(numberRangeValidator()(new FormControl(1))).toBeNull();
    expect(numberRangeValidator('missing', 'max')(range(10, 5))).toBeNull();
  });

  it('ignores disabled child controls instead of reporting an unfixable group error', () => {
    const form = range(10, 5);
    expect(form.errors).toEqual({minGreaterThanMax: true});

    form.controls.max.disable();
    expect(form.controls.max.value).toBe(5);
    expect(form.value).toEqual({min: 10});
    expect(form.errors).toBeNull();

    form.controls.max.enable();
    expect(form.errors).toEqual({minGreaterThanMax: true});

    form.controls.min.disable();
    expect(form.errors).toBeNull();

    const initiallyDisabled = new FormGroup(
      {min: new FormControl({value: 10, disabled: true}), max: new FormControl(5)},
      {validators: [numberRangeValidator()]},
    );
    expect(initiallyDisabled.errors).toBeNull();
  });

  it('supports custom control names', () => {
    const form = new FormGroup(
      {start: new FormControl(9), end: new FormControl(2)},
      {validators: [numberRangeValidator('start', 'end')]},
    );
    expect(form.errors).toEqual({minGreaterThanMax: true});
  });

  it('never mutates child errors', () => {
    const form = new FormGroup(
      {
        min: new FormControl(-1, [Validators.min(0)]),
        max: new FormControl(5, [Validators.required]),
      },
      {validators: [numberRangeValidator()]},
    );

    expect(form.errors).toBeNull();
    expect(form.controls.min.errors).toEqual({min: {min: 0, actual: -1}});
    expect(form.controls.max.errors).toBeNull();

    form.controls.min.setValue(10);
    expect(form.errors).toEqual({minGreaterThanMax: true});
    expect(form.controls.min.errors).toBeNull();
    expect(form.controls.max.errors).toBeNull();
    expect(form.controls.max.touched).toBe(false);
  });
});
