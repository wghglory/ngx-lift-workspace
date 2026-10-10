import {FormControl} from '@angular/forms';
import {describe, expect, it} from 'vitest';

import {integerValidator} from './integer.validator';

describe('integerValidator', () => {
  const validator = integerValidator();

  it('should return null for empty values', () => {
    expect(validator(new FormControl(''))).toBeNull();
    expect(validator(new FormControl(null))).toBeNull();
    expect(validator(new FormControl(undefined))).toBeNull();
  });

  it('should return null for valid integer numbers and numeric strings', () => {
    expect(validator(new FormControl(42))).toBeNull();
    expect(validator(new FormControl(0))).toBeNull();
    expect(validator(new FormControl(-10))).toBeNull();
    expect(validator(new FormControl('123'))).toBeNull();
    expect(validator(new FormControl('-5'))).toBeNull();
  });

  it('should return { notInteger: true } for decimal numbers and non-numeric strings', () => {
    expect(validator(new FormControl(3.14))).toEqual({notInteger: true});
    expect(validator(new FormControl('3.14'))).toEqual({notInteger: true});
    expect(validator(new FormControl('abc'))).toEqual({notInteger: true});
  });
});
