/* eslint-disable @typescript-eslint/no-explicit-any */
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
export function isArrayLike(value: any): value is {length: number} {
  return (
    value != null &&
    typeof value !== 'function' &&
    typeof value.length === 'number' &&
    value.length >= 0 &&
    value.length <= Number.MAX_SAFE_INTEGER
  );
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
export function isPrototype(value: any): boolean {
  const Ctor = value?.constructor;
  return Ctor && Ctor.prototype === value;
}
