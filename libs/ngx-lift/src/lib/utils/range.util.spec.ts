import {range} from './range.util';

describe('range function', () => {
  it('should generate a range of numbers from start to end with default step and direction', () => {
    expect(range(1, 5)).toEqual([1, 2, 3, 4]);
    expect(range(5, 1)).toEqual([5, 4, 3, 2]);
  });

  it('should handle a single argument as end with start defaulting to 0', () => {
    expect(range(5)).toEqual([0, 1, 2, 3, 4]);
  });

  it('should generate a range with a specified step', () => {
    expect(range(1, 10, 2)).toEqual([1, 3, 5, 7, 9]);
    expect(range(10, 1, -2)).toEqual([10, 8, 6, 4, 2]);
  });

  it('should generate a range in reverse order when fromRight is true', () => {
    expect(range(1, 5, 1, true)).toEqual([4, 3, 2, 1]);
    expect(range(5, 1, -1, true)).toEqual([2, 3, 4, 5]);
  });

  it('should handle negative steps correctly', () => {
    expect(range(5, 1, -1)).toEqual([5, 4, 3, 2]);
    expect(range(1, 5, -1)).toEqual([]);
  });

  it('should handle zero step gracefully', () => {
    expect(range(1, 5, 0)).toEqual([1, 1, 1, 1]);
  });

  it('should handle negative steps and fromRight', () => {
    expect(range(0, 5, -1, true)).toEqual([]);
  });

  it('should handle zero-length ranges', () => {
    expect(range(5, 5)).toEqual([]);
  });
});

describe('range input limits', () => {
  it('rejects non-finite arguments with an actionable error', () => {
    for (const args of [[NaN], [0, Infinity], [0, 2, NaN], [0, 2, Infinity]]) {
      expect(() => range(args[0], args[1], args[2])).toThrow('finite');
    }
  });
  it('rejects unbounded allocation before constructing the result', () => {
    expect(() => range(0, 1_000_001)).toThrow('1,000,000');
  });
});
