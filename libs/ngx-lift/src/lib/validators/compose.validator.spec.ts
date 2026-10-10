import {FormControl, Validators} from '@angular/forms';
import {describe, expect, it} from 'vitest';

import {composeValidators} from './compose.validator';

describe('composeValidators', () => {
  const validator = composeValidators('myError', [
    {validate: Validators.minLength(3), message: 'Too short'},
    {validate: Validators.maxLength(10), message: 'Too long'},
  ]);

  it('should return null for empty values', () => {
    const control = new FormControl('');
    expect(validator(control)).toBeNull();

    control.setValue(null);
    expect(validator(control)).toBeNull();
  });

  it('should return null when all composed rules pass', () => {
    const control = new FormControl('validVal');
    expect(validator(control)).toBeNull();
  });

  it('should return the error message for the first failing rule', () => {
    const control = new FormControl('ab');
    expect(validator(control)).toEqual({myError: 'Too short'});
  });

  it('should return the error message for the second failing rule if first passes', () => {
    const control = new FormControl('veryLongValueThatFails');
    expect(validator(control)).toEqual({myError: 'Too long'});
  });
});
