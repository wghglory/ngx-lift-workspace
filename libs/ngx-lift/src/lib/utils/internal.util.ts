/**
 * Type guard that checks if a value is array-like (has a numeric length property).
 * Array-like objects include arrays, strings, NodeLists, and similar structures.
 *
 * @param value - The value to check.
 * @returns `true` if the value is array-like, `false` otherwise.
 *
 * @example
 * ```typescript
 * isArrayLike([1, 2, 3]); // true
 * isArrayLike('string'); // true
 * isArrayLike({length: 5}); // true
 * isArrayLike(null); // false
 * isArrayLike(() => {}); // false
 * ```
 */
export function isArrayLike(value: unknown): value is {length: number} {
  const length =
    typeof value === 'string'
      ? value.length
      : value !== null && typeof value === 'object' && 'length' in value
        ? value.length
        : undefined;
  return typeof length === 'number' && length >= 0 && length <= Number.MAX_SAFE_INTEGER;
}

/**
 * Checks if a value is a prototype object.
 * A prototype object is an object that is the prototype property of a constructor function.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a prototype object, `false` otherwise.
 *
 * @example
 * ```typescript
 * isPrototype(Array.prototype); // true
 * isPrototype(Object.prototype); // true
 * isPrototype({}); // false
 * ```
 */
export function isPrototype(value: unknown): boolean {
  if (value === null || (typeof value !== 'object' && typeof value !== 'function')) {
    return false;
  }
  const constructor = value.constructor;
  return typeof constructor === 'function' && constructor.prototype === value;
}
