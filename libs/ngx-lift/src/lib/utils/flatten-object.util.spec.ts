import {describe, expect, it} from 'vitest';
import {flattenObject} from './flatten-object.util';

describe('flattenObject', () => {
  it('should return a flat object unchanged', () => {
    const input = {a: 1, b: 'hello'};
    expect(flattenObject(input)).toEqual({a: 1, b: 'hello'});
  });

  it('should flatten nested objects using dot separator by default', () => {
    const input = {
      user: {
        profile: {
          name: 'Bob',
          age: 40,
        },
        active: true,
      },
    };
    expect(flattenObject(input)).toEqual({
      'user.profile.name': 'Bob',
      'user.profile.age': 40,
      'user.active': true,
    });
  });

  it('should support custom separators', () => {
    const input = {
      db: {
        connection: {
          port: 5432,
        },
      },
    };
    expect(flattenObject(input, '', '/')).toEqual({
      'db/connection/port': 5432,
    });
  });

  it('should preserve arrays as terminal values', () => {
    const input = {
      tags: ['database', 'prod'],
      meta: {
        ids: [1, 2, 3],
      },
    };
    expect(flattenObject(input)).toEqual({
      tags: ['database', 'prod'],
      'meta.ids': [1, 2, 3],
    });
  });

  it('should handle empty objects and null/undefined values correctly', () => {
    expect(flattenObject({})).toEqual({});
    expect(flattenObject({a: null, b: undefined})).toEqual({a: null, b: undefined});
  });
});
