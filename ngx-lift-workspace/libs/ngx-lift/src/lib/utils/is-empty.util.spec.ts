import {isEmpty, isNotEmpty} from './is-empty.util';

describe('isEmpty function', () => {
  it('should return true for empty string', () => {
    expect(isEmpty('')).toBe(true);
  });

  it('should return false for non-empty string', () => {
    expect(isEmpty('hello')).toBe(false);
  });

  it('should return true for empty set/map', () => {
    expect(isEmpty(new Set())).toBe(true);
    expect(isEmpty(new Map())).toBe(true);
  });

  it('should return false for non-empty set/map', () => {
    expect(isEmpty(new Set([1, 2, 3]))).toBe(false);
    expect(isEmpty(new Map([['key', 'value']]))).toBe(false);
  });

  it('should return true for empty array', () => {
    expect(isEmpty([])).toBe(true);
  });

  it('should return false for non-empty array', () => {
    expect(isEmpty([1, 2, 3])).toBe(false);
  });

  it('should return true for empty object', () => {
    expect(isEmpty({})).toBe(true);
  });

  it('should return false for non-empty object', () => {
    expect(isEmpty({key: 'value'})).toBe(false);
  });

  it('should return true for null or undefined', () => {
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(undefined)).toBe(true);
  });

  it('should return true for numbers, booleans, and functions', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(isEmpty(0 as any)).toBe(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(isEmpty(42 as any)).toBe(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(isEmpty(false as any)).toBe(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(isEmpty(true as any)).toBe(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(isEmpty((() => undefined) as any)).toBe(true);
  });

  it('should handle array-like objects with splice', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const arrayLike = {length: 0, splice: (): void => {}};
    expect(isEmpty(arrayLike)).toBe(true);

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const nonEmptyArrayLike = {length: 3, splice: (): void => {}};
    expect(isEmpty(nonEmptyArrayLike)).toBe(false);
  });
});

describe('isNotEmpty function', () => {
  it('should return false for empty string', () => {
    expect(isNotEmpty('')).toBe(false);
  });

  it('should return true for non-empty string', () => {
    expect(isNotEmpty('hello')).toBe(true);
  });

  it('should return false for empty set/map', () => {
    expect(isNotEmpty(new Set())).toBe(false);
    expect(isNotEmpty(new Map())).toBe(false);
  });

  it('should return true for non-empty set/map', () => {
    expect(isNotEmpty(new Set([1, 2, 3]))).toBe(true);
    expect(isNotEmpty(new Map([['key', 'value']]))).toBe(true);
  });

  it('should return false for empty array', () => {
    expect(isNotEmpty([])).toBe(false);
  });

  it('should return true for non-empty array', () => {
    expect(isNotEmpty([1, 2, 3])).toBe(true);
  });

  it('should return false for empty object', () => {
    expect(isNotEmpty({})).toBe(false);
  });

  it('should return true for non-empty object', () => {
    expect(isNotEmpty({key: 'value'})).toBe(true);
  });

  it('should return false for null or undefined', () => {
    expect(isNotEmpty(null)).toBe(false);
    expect(isNotEmpty(undefined)).toBe(false);
  });
});
