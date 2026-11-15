import {FormControl} from '@angular/forms';
import {describe, expect, it} from 'vitest';

import {jsonValidator} from './json.validator';

const validator = jsonValidator();
const validate = (value: unknown) => validator(new FormControl(value));

describe('jsonValidator', () => {
  it('allows empty values so a separate required rule can own them', () => {
    expect(validate(null)).toBeNull();
    expect(validate(undefined)).toBeNull();
    expect(validate('')).toBeNull();
  });

  it('accepts every JSON value type', () => {
    for (const value of ['{"enabled": true}', '[1, 2, 3]', '"text"', '42', '-1.5e2', 'true', 'false', 'null']) {
      expect(validate(value), value).toBeNull();
    }
  });

  it('accepts whitespace around a document and preserves the original control value', () => {
    const control = new FormControl(' \n {"nested": {"ok": true}} \n ');
    expect(validator(control)).toBeNull();
    expect(control.value).toContain('"nested"');
  });

  it('rejects malformed JSON text without throwing', () => {
    for (const value of ['{enabled: true}', '{"a":}', '[1,]', 'undefined', '   ']) {
      expect(validate(value), value).toEqual({invalidJson: true});
    }
  });

  it('rejects non-string non-empty values', () => {
    expect(validate({enabled: true})).toEqual({invalidJson: true});
    expect(validate(42)).toEqual({invalidJson: true});
    expect(validate([])).toEqual({invalidJson: true});
  });
});
