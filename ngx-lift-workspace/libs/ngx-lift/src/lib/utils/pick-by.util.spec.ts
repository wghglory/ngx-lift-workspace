import {pickBy} from './pick-by.util';

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
});
