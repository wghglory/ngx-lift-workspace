import {describe, expect, it} from 'vitest';

import {getValueByPath} from './object.util';

describe('getValueByPath', () => {
  it('should retrieve shallow properties', () => {
    expect(getValueByPath({name: 'Alice'}, 'name')).toBe('Alice');
    expect(getValueByPath({count: 42}, 'count')).toBe(42);
  });

  it('should retrieve nested properties using dot paths', () => {
    const data = {
      spec: {
        dbOwner: {
          type: 'Admin',
        },
      },
      metadata: {
        tags: ['k8s', 'db'],
      },
    };

    expect(getValueByPath(data, 'spec.dbOwner.type')).toBe('Admin');
    expect(getValueByPath(data, 'metadata.tags')).toEqual(['k8s', 'db']);
  });

  it('should return undefined for missing paths or empty path strings', () => {
    const data = {user: {name: 'Bob'}};

    expect(getValueByPath(data, 'user.age')).toBeUndefined();
    expect(getValueByPath(data, 'invalid.path')).toBeUndefined();
    expect(getValueByPath(data, '')).toBeUndefined();
    expect(getValueByPath(data, '   ')).toBeUndefined();
  });

  it('should return undefined when object is null, undefined, or primitive', () => {
    expect(getValueByPath(null, 'user.name')).toBeUndefined();
    expect(getValueByPath(undefined, 'user.name')).toBeUndefined();
    expect(getValueByPath('string', 'some.prop')).toBeUndefined();
    expect(getValueByPath(123, 'some.prop')).toBeUndefined();
  });
});
