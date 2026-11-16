import {FormControl} from '@angular/forms';
import {describe, expect, it} from 'vitest';

import {integerValidator} from './integer.validator';

const validator = integerValidator();
const validate = (value: unknown) => validator(new FormControl(value));

describe('integerValidator', () => {
  it('allows empty values so a separate required rule can own them', () => {
    expect(validate(null)).toBeNull();
    expect(validate(undefined)).toBeNull();
    expect(validate('')).toBeNull();
  });

  it('accepts safe integer numbers', () => {
    expect(validate(0)).toBeNull();
    expect(validate(-42)).toBeNull();
    expect(validate(Number.MAX_SAFE_INTEGER)).toBeNull();
  });

  it('accepts signed integer strings and ignores surrounding whitespace', () => {
    expect(validate('0')).toBeNull();
    expect(validate('7')).toBeNull();
    expect(validate('+7')).toBeNull();
    expect(validate('-7')).toBeNull();
    expect(validate('  12  ')).toBeNull();
  });

  it('rejects decimal, exponent and hexadecimal notation', () => {
    for (const value of ['3.5', '1e3', '0x10', '1_000', '12.0']) {
      expect(validate(value), value).toEqual({invalidInteger: true});
    }
    expect(validate(3.5)).toEqual({invalidInteger: true});
  });

  it('rejects values that Number() would silently coerce to an integer', () => {
    for (const value of [true, false, [], '   ', '\t', {}, NaN, Infinity]) {
      expect(validate(value), String(value)).toEqual({invalidInteger: true});
    }
  });

  it('rejects integers outside the safe range', () => {
    expect(validate(Number.MAX_SAFE_INTEGER + 1)).toEqual({invalidInteger: true});
    expect(validate('9007199254740993')).toEqual({invalidInteger: true});
  });
});
