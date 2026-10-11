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

  it('should correctly compare NaN values', () => {
    expect(isEqual(NaN, NaN)).toBe(true);
    expect(isEqual(NaN, 0)).toBe(false);
    expect(isEqual(0, NaN)).toBe(false);
  });

  it('compares Map values instead of treating all maps as empty objects', () => {
    expect(isEqual(new Map([['key', 1]]), new Map([['key', 2]]))).toBe(false);
    expect(isEqual(new Map([['key', {value: 1}]]), new Map([['key', {value: 1}]]))).toBe(true);
  });

  it('compares Set contents independently of insertion order', () => {
    expect(isEqual(new Set([1, 2]), new Set([2, 1]))).toBe(true);
    expect(isEqual(new Set([1, 2]), new Set([1, 3]))).toBe(false);
  });

  it('compares RegExp patterns and flags', () => {
    expect(isEqual(/hello/i, /world/i)).toBe(false);
    expect(isEqual(/hello/i, /hello/g)).toBe(false);
    expect(isEqual(/hello/i, /hello/i)).toBe(true);
  });

  it('compares binary views by their type and contents', () => {
    expect(isEqual(new Uint8Array([1, 2]), new Uint8Array([1, 3]))).toBe(false);
    expect(isEqual(new DataView(new Uint8Array([1]).buffer), new DataView(new Uint8Array([2]).buffer))).toBe(false);
    expect(isEqual<unknown>(new Uint8Array([1]), new Int8Array([1]))).toBe(false);
  });

  it('handles cyclic object graphs without overflowing the stack', () => {
    const left: {value: number; self?: unknown} = {value: 1};
    const right: {value: number; self?: unknown} = {value: 1};
    left.self = left;
    right.self = right;
    expect(isEqual(left, right)).toBe(true);
    right.value = 2;
    expect(isEqual(left, right)).toBe(false);
  });

  it('does not equate distinct opaque objects with no enumerable properties', () => {
    expect(isEqual(Promise.resolve(1), Promise.resolve(2))).toBe(false);
    expect(isEqual(new File(['first'], 'file'), new File(['second'], 'file'))).toBe(false);
  });
});
