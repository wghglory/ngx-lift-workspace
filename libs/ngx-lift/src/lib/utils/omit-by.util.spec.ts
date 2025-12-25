import {omitBy} from './omit-by.util';

describe('omitBy function', () => {
  it('should omit properties based on the predicate', () => {
    const obj = {
      a: 1,
      b: 2,
      c: 3,
      d: 4,
    };

    const predicate = (value: number) => value % 2 === 0;

    const result = omitBy(obj, predicate);

    expect(result).toEqual({a: 1, c: 3});
  });

  it('should work correctly when all properties are omitted', () => {
    const obj = {
      a: 1,
      b: 2,
      c: 3,
      d: 4,
    };

    const predicate = () => true;

    const result = omitBy(obj, predicate);

    expect(result).toEqual({});
  });

  it('should work correctly when no properties are omitted', () => {
    const obj = {
      a: 1,
      b: 2,
      c: 3,
      d: 4,
    };

    const predicate = () => false;

    const result = omitBy(obj, predicate);

    expect(result).toEqual(obj);
  });

  it('should handle a predicate that always returns true', () => {
    const inputObject = {
      name: 'John',
      age: 25,
      city: 'New York',
      isActive: true,
    };

    const predicate = (value: unknown) => typeof value === 'string';

    const result = omitBy(inputObject, predicate);

    expect(result).toEqual({age: 25, isActive: true});
  });
});
