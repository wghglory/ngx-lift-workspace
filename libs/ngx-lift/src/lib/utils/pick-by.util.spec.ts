import {omitBy, pickBy} from './pick-by.util';

describe('pickBy function', () => {
  it('should pick properties based on the given condition', () => {
    const inputObject = {
      name: 'John',
      age: 25,
      city: 'New York',
      isActive: true,
    };

    const predicate = (value: unknown, key: string) => typeof value === 'string' || key === 'isActive';

    const result = pickBy(inputObject, predicate);

    expect(result).toEqual({
      name: 'John',
      city: 'New York',
      isActive: true,
    });
  });

  it('should return an empty object if no properties satisfy the condition', () => {
    const inputObject = {
      age: 25,
      isActive: true,
    };

    const predicate = (value: unknown) => typeof value === 'string' && value.length > 10;

    const result = pickBy(inputObject, predicate);

    expect(result).toEqual({});
  });

  it('should handle an empty input object', () => {
    const inputObject = {};
    const predicate = () => true;

    const result = pickBy(inputObject, predicate);

    expect(result).toEqual({});
  });

  it('should handle a predicate that always returns true', () => {
    const inputObject = {
      name: 'John',
      age: 25,
      city: 'New York',
      isActive: true,
    };

    const predicate = () => true;

    const result = pickBy(inputObject, predicate);

    expect(result).toEqual(inputObject);
  });

  it('preserves an own __proto__ data property without changing the result prototype', () => {
    const source: Record<string, unknown> = JSON.parse('{"__proto__":{"unexpected":true},"safe":1}');
    const result = pickBy(source, () => true);
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    expect(Object.hasOwn(result, '__proto__')).toBe(true);
    expect(result['__proto__']).toEqual({unexpected: true});
  });

  it('negates the predicate when options.negate is true', () => {
    const input = {a: 1, b: 2, c: 3, d: 4};

    expect(pickBy(input, (value) => value % 2 === 0, {negate: true})).toEqual({a: 1, c: 3});
    expect(pickBy(input, () => true, {negate: true})).toEqual({});
    expect(pickBy(input, () => false, {negate: true})).toEqual(input);
  });

  it('preserves prototype safety when negating', () => {
    const source: Record<string, unknown> = JSON.parse('{"__proto__":{"unexpected":true},"safe":1}');
    const result = pickBy(source, () => false, {negate: true});
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    expect(Object.hasOwn(result, '__proto__')).toBe(true);
    expect(result['__proto__']).toEqual({unexpected: true});
  });

  it('keeps the deprecated omitBy alias equivalent to negated pickBy', () => {
    const input = {name: 'John', age: 25, city: 'New York', isActive: true};
    const predicate = (value: unknown) => typeof value === 'string';

    expect(omitBy(input, predicate)).toEqual(pickBy(input, predicate, {negate: true}));
    expect(omitBy(input, predicate)).toEqual({age: 25, isActive: true});
  });
});
