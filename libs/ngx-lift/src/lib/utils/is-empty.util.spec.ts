import {isEmpty, isNotEmpty} from './is-empty.util';

it('does not narrow either branch of a nullable collection emptiness check', () => {
  const classify = (items: string[] | null | undefined) => {
    if (isNotEmpty(items)) {
      expectTypeOf(items).toEqualTypeOf<string[] | null | undefined>();
      return 'nonempty';
    } else {
      expectTypeOf(items).toEqualTypeOf<string[] | null | undefined>();
      return 'empty';
    }
  };
  expect(classify([])).toBe('empty');
  expect(classify(null)).toBe('empty');
  expect(classify(undefined)).toBe('empty');
  expect(classify(['item'])).toBe('nonempty');
});

describe('isEmpty function', () => {
  it('does not narrow an empty collection to null or undefined', () => {
    const value: number[] = [];
    if (isEmpty(value)) {
      expectTypeOf(value).toEqualTypeOf<number[]>();
      expect(value.length).toBe(0);
    }
  });

  it('preserves the exact result for null and undefined', () => {
    expectTypeOf(isEmpty(null)).toEqualTypeOf<true>();
    expectTypeOf(isEmpty(undefined)).toEqualTypeOf<true>();
  });

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
    expect(isEmpty(0)).toBe(true);
    expect(isEmpty(42)).toBe(true);
    expect(isEmpty(false)).toBe(true);
    expect(isEmpty(true)).toBe(true);
    expect(isEmpty(() => undefined)).toBe(true);
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
  it('supports an explicit nullability check before checking emptiness', () => {
    const value: number[] | undefined = [1, 2];
    if (value != null && isNotEmpty(value)) {
      expectTypeOf(value).toEqualTypeOf<number[]>();
      expect(value.length).toBe(2);
    }
  });

  it('does not narrow an empty collection away in the false branch', () => {
    const value: number[] = [];
    if (!isNotEmpty(value)) {
      expectTypeOf(value).toEqualTypeOf<number[]>();
      expect(value.length).toBe(0);
    }
  });

  it('preserves the exact result for null and undefined', () => {
    expectTypeOf(isNotEmpty(null)).toEqualTypeOf<false>();
    expectTypeOf(isNotEmpty(undefined)).toEqualTypeOf<false>();
  });

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
