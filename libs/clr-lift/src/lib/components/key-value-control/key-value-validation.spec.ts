import {describe, expect, it} from 'vitest';

import type {KeyValueFieldConfig} from './key-value-entry.type';
import {
  copyFieldValue,
  emptyFieldValue,
  fieldValueError,
  isKeyValueEntries,
  keyValueErrors,
  resolveValueConfig,
} from './key-value-validation';

describe('key-value validation helpers', () => {
  it('resolves fixed and key-dependent configs', () => {
    const fixed: KeyValueFieldConfig = {type: 'number'};
    expect(resolveValueConfig(fixed, 'any')).toBe(fixed);
    expect(resolveValueConfig((key) => ({type: key === 'count' ? 'number' : 'input'}), 'count')).toEqual({
      type: 'number',
    });
  });

  it('creates typed empty values and detaches arrays', () => {
    expect(emptyFieldValue({type: 'boolean'})).toBe(false);
    expect(emptyFieldValue({type: 'array'})).toEqual([]);
    expect(emptyFieldValue({type: 'number'})).toBeNull();
    expect(emptyFieldValue({})).toBe('');
    const values = ['a'];
    const copy = copyFieldValue(values);
    expect(copy).toEqual(values);
    expect(copy).not.toBe(values);
    expect(copyFieldValue('text')).toBe('text');
  });

  it('reports type and array-format mismatches', () => {
    expect(fieldValueError('bad', {type: 'number'})).toBe('type');
    expect(fieldValueError(['a\nb'], {type: 'array'})).toBe('arrayFormat');
    expect(fieldValueError([], {type: 'array'})).toBeNull();
    expect(fieldValueError(5, {type: 'number'})).toBeNull();
  });

  it('guards entry structure', () => {
    expect(isKeyValueEntries([{key: 'a', value: 'b'}])).toBe(true);
    expect(isKeyValueEntries([{key: 1, value: 'b'}])).toBe(false);
    expect(isKeyValueEntries(null)).toBe(false);
  });

  it('reports row-count and uniqueness errors', () => {
    expect(keyValueErrors([], {minRows: 1})).toMatchObject({keyValue: {minRows: {required: 1, actual: 0}}});
    expect(keyValueErrors({key: 'a', value: 'b'})).toMatchObject({keyValue: {structure: true}});
    expect(keyValueErrors([{key: 'a', value: 'b'}])).toBeNull();
  });
});
