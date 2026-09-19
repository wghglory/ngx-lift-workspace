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

  it('should preserve primitive values from a single FormControl', () => {
    const numCtrl = new FormControl(42);
    expect(toSubmitValue(numCtrl)).toBe(42);

    const strCtrl = new FormControl('test-val');
    expect(toSubmitValue(strCtrl)).toBe('test-val');

    const emptyCtrl = new FormControl('');
    expect(toSubmitValue(emptyCtrl, {omitEmptyStrings: true})).toBeUndefined();
  });

  it('should respect includeDisabled: false option', () => {
    const form = new FormGroup({
      enabledField: new FormControl('enabled'),
      disabledField: new FormControl('disabled'),
    });

    form.controls.disabledField.disable();

    // Default includeDisabled: true includes disabled controls
    expect(toSubmitValue(form)).toEqual({
      enabledField: 'enabled',
      disabledField: 'disabled',
    });

    // includeDisabled: false omits disabled controls
    expect(toSubmitValue(form, {includeDisabled: false})).toEqual({
      enabledField: 'enabled',
    });
  });

  it('should conditionally omit fields with custom omitIf predicate', () => {
    const form = new FormGroup({
      keep: new FormControl('visible'),
      removeMe: new FormControl('temp-flag'),
      score: new FormControl(-1),
    });

    const submitVal = toSubmitValue(form, {
      omitIf: (value, key) => key === 'removeMe' || value === -1,
    });

    expect(submitVal).toEqual({
      keep: 'visible',
    });
  });

  it('should support debounced formSubmitValue', async () => {
    vi.useFakeTimers();
    try {
      TestBed.runInInjectionContext(() => {
        const form = new FormGroup({
          search: new FormControl('abc'),
        });

        const submitSig = formSubmitValue(form, {debounceTime: 200});
        expect(submitSig()).toEqual({search: 'abc'});

        form.controls.search.setValue('def');
        // Before debounce duration:
        expect(submitSig()).toEqual({search: 'abc'});

        vi.advanceTimersByTime(200);
        expect(submitSig()).toEqual({search: 'def'});
      });
    } finally {
      vi.useRealTimers();
    }
  });

  it('should preserve File, Blob, Date, and custom class instances without corrupting them into plain objects', () => {
    class Certificate {
      constructor(public raw: string) {}
    }

    const testDate = new Date('2026-09-19T10:00:00Z');
    const testBlob = new Blob(['test content'], {type: 'text/plain'});
    const testCert = new Certificate('cert-payload');

    const form = new FormGroup({
      date: new FormControl(testDate),
      blob: new FormControl(testBlob),
      cert: new FormControl(testCert),
      name: new FormControl('Test'),
    });

    const submitVal = toSubmitValue(form, {deep: true});

    expect(submitVal.date).toBe(testDate);
    expect(submitVal.blob).toBe(testBlob);
    expect(submitVal.cert).toBe(testCert);
    expect(submitVal.name).toBe('Test');
  });
});
