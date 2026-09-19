import {isEqual} from './is-equal.util';

describe('isEqual function', () => {
  it('should return true for identical values', () => {
    const value = {name: 'John', age: 25};
    expect(isEqual(value, value)).toBe(true);
  });

  it('should return true for deeply equal objects', () => {
    const obj1 = {name: 'John', age: 25, address: {city: 'New York'}};
    const obj2 = {name: 'John', age: 25, address: {city: 'New York'}};
    expect(isEqual(obj1, obj2)).toBe(true);
  });

  it('should return false for different objects', () => {
    const obj1 = {name: 'John', age: 25};
    const obj2 = {name: 'Jane', age: 30};
    expect(isEqual(obj1, obj2)).toBe(false);
  });

  it('should return false for different nested objects', () => {
    const obj1 = {name: 'John', age: 25, address: {city: 'New York'}};
    const obj2 = {name: 'John', age: 25, address: {city: 'San Francisco'}};
    expect(isEqual(obj1, obj2)).toBe(false);
  });

  it('should return false for different lengths of arrays', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2, 3, 4];
    expect(isEqual(arr1, arr2)).toBe(false);
  });

  it('should return true for identical arrays', () => {
    const arr = [1, 2, 3];
    expect(isEqual(arr, arr)).toBe(true);
  });

  it('should return true for deeply equal arrays', () => {
    const arr1 = [1, {name: 'John'}, [true, false]];
    const arr2 = [1, {name: 'John'}, [true, false]];
    expect(isEqual(arr1, arr2)).toBe(true);
  });

  it('should correctly compare Date instances', () => {
    const d1 = new Date('2026-09-19T10:00:00Z');
    const d2 = new Date('2026-09-19T10:00:00Z');
    const d3 = new Date('2020-01-01T00:00:00Z');
    const invalid1 = new Date('invalid');
    const invalid2 = new Date('invalid');

    expect(isEqual(d1, d2)).toBe(true);
    expect(isEqual(d1, d3)).toBe(false);
    expect(isEqual(d1, {} as Date)).toBe(false);
    expect(isEqual({} as Date, d1)).toBe(false);
    expect(isEqual(invalid1, invalid2)).toBe(true);
  });
});
