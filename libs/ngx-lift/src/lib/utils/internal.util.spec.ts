import {describe, expect, it} from 'vitest';

import {isArrayLike, isPrototype} from './internal.util';

describe('internal value guards', () => {
  it('detects finite array-like lengths', () => {
    expect(isArrayLike([1, 2, 3])).toBe(true);
    expect(isArrayLike('string')).toBe(true);
    expect(isArrayLike({length: 5})).toBe(true);
    expect(isArrayLike(null)).toBe(false);
    expect(isArrayLike(() => undefined)).toBe(false);
    expect(isArrayLike({length: -1})).toBe(false);
    expect(isArrayLike({length: Number.POSITIVE_INFINITY})).toBe(false);
  });

  it('detects constructor prototypes', () => {
    expect(isPrototype(Array.prototype)).toBe(true);
    expect(isPrototype(Object.prototype)).toBe(true);
    expect(isPrototype({})).toBe(false);
    expect(isPrototype(null)).toBe(false);
    expect(isPrototype(42)).toBe(false);
  });
});
