import {FormControl} from '@angular/forms';
import {describe, expect, it} from 'vitest';

import {jsonValidator} from './json.validator';

describe('jsonValidator', () => {
  const validator = jsonValidator();

  it('should return null for empty values', () => {
    expect(validator(new FormControl(''))).toBeNull();
    expect(validator(new FormControl(null))).toBeNull();
  });

  it('should return null for valid JSON strings', () => {
    expect(validator(new FormControl('{"key": "value"}'))).toBeNull();
    expect(validator(new FormControl('[1, 2, 3]'))).toBeNull();
    expect(validator(new FormControl('"string"'))).toBeNull();
    expect(validator(new FormControl('123'))).toBeNull();
    expect(validator(new FormControl('true'))).toBeNull();
  });

  it('should return { json: true } for invalid JSON strings', () => {
    expect(validator(new FormControl('{invalid: true}'))).toEqual({json: true});
    expect(validator(new FormControl('{'))).toEqual({json: true});
    expect(validator(new FormControl('not a json'))).toEqual({json: true});
  });
});
