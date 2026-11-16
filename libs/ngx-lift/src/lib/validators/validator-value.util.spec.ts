import {describe, expect, it} from 'vitest';

import {isEmptyControlValue, parseSafeInteger} from './validator-value.util';

describe('validator value predicates', () => {
  it('treats only null, undefined and empty string as empty', () => {
    expect(isEmptyControlValue(null)).toBe(true);
    expect(isEmptyControlValue(undefined)).toBe(true);
    expect(isEmptyControlValue('')).toBe(true);
    expect(isEmptyControlValue(' ')).toBe(false);
    expect(isEmptyControlValue(0)).toBe(false);
    expect(isEmptyControlValue(false)).toBe(false);
    expect(isEmptyControlValue([])).toBe(false);
  });

  it('parses signed decimal integers inside the safe range', () => {
    expect(parseSafeInteger(42)).toBe(42);
    expect(parseSafeInteger('-5')).toBe(-5);
    expect(parseSafeInteger(' 7 ')).toBe(7);
    expect(parseSafeInteger(Number.MAX_SAFE_INTEGER)).toBe(Number.MAX_SAFE_INTEGER);
  });

  it('rejects coerced or unsafe values', () => {
    expect(parseSafeInteger(1.5)).toBeNull();
    expect(parseSafeInteger('3.5')).toBeNull();
    expect(parseSafeInteger('1e3')).toBeNull();
    expect(parseSafeInteger('0x10')).toBeNull();
    expect(parseSafeInteger(true)).toBeNull();
    expect(parseSafeInteger([])).toBeNull();
    expect(parseSafeInteger(Number.MAX_SAFE_INTEGER + 1)).toBeNull();
  });
});
