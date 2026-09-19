import {TestBed} from '@angular/core/testing';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {describe, expect, it} from 'vitest';

import {formSubmitValue, toSubmitValue} from './to-submit-value';

describe('to-submit-value utilities', () => {
  it('should correctly sanitize a FormArray without converting it to an indexed object', () => {
    const array = new FormArray([
      new FormGroup({
        tag: new FormControl('v1'),
        internal: new FormControl('skip'),
      }),
      new FormGroup({
        tag: new FormControl('v2'),
        internal: new FormControl('skip'),
      }),
    ]);

    const submitVal = toSubmitValue(array, {
      omit: ['internal'],
    });

    expect(Array.isArray(submitVal)).toBe(true);
    expect(submitVal).toEqual([{tag: 'v1'}, {tag: 'v2'}]);
  });
  it('should omit specified keys with omit option', () => {
    const form = new FormGroup({
      username: new FormControl('alice'),
      password: new FormControl('secret123'),
      confirmPassword: new FormControl('secret123'),
    });

    const submitVal = toSubmitValue(form, {omit: ['confirmPassword']});
    expect(submitVal).toEqual({
      username: 'alice',
      password: 'secret123',
    });
  });

  it('should omit empty strings and nil values when enabled', () => {
    const data = {
      name: 'Bob',
      empty: '',
      nullVal: null,
      undefinedVal: undefined,
      zero: 0,
    };

    const submitVal = toSubmitValue(data, {
      omitEmptyStrings: true,
      omitNull: true,
    });

    expect(submitVal).toEqual({
      name: 'Bob',
      zero: 0,
    });
  });

  it('should deep sanitize nested objects and arrays', () => {
    const nested = {
      user: {
        name: 'Charlie',
        notes: '',
      },
      tags: [
        {id: 1, comment: ''},
        {id: 2, comment: 'valid'},
      ],
    };

    const submitVal = toSubmitValue(nested, {
      deep: true,
      omitEmptyStrings: true,
    });

    expect(submitVal).toEqual({
      user: {name: 'Charlie'},
      tags: [{id: 1}, {id: 2, comment: 'valid'}],
    });
  });

  it('should support custom transform function', () => {
    const data = {firstName: 'John', lastName: 'Doe'};
    const submitVal = toSubmitValue(data, {
      transform: (raw) => ({
        fullName: `${raw['firstName']} ${raw['lastName']}`,
      }),
    });

    expect(submitVal).toEqual({fullName: 'John Doe'});
  });

  it('should return a reactive signal with formSubmitValue', () => {
    TestBed.runInInjectionContext(() => {
      const form = new FormGroup({
        query: new FormControl('initial'),
        internalFlag: new FormControl(true),
      });

      const submitSig = formSubmitValue(form, {omit: ['internalFlag']});
      expect(submitSig()).toEqual({query: 'initial'});

      form.controls.query.setValue('updatedQuery');
      expect(submitSig()).toEqual({query: 'updatedQuery'});
    });
  });

  it('should sanitize array primitive values with omitEmptyStrings and omitNull', () => {
    const rawArray = ['angular', '', null, undefined, 'signals'];
    expect(
      toSubmitValue(rawArray as unknown as object, {
        omitEmptyStrings: true,
        omitNull: true,
      }),
    ).toEqual(['angular', 'signals']);

    const rawObject = {
      tags: ['angular', '', null, undefined, 'signals'],
    };
    expect(
      toSubmitValue(rawObject, {
        deep: true,
        omitEmptyStrings: true,
        omitNull: true,
      }),
    ).toEqual({
      tags: ['angular', 'signals'],
    });
  });
});
