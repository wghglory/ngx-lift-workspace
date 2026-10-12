import {isArrayLike, isPrototype} from './internal.util';

/**
 * Type guard that checks if a string value is empty.
 *
 * @param value - The string value to check.
 * @returns `true` if the value is an empty string, `false` otherwise.
 *
 * @example
 * ```typescript
 * isEmpty(''); // true
 * isEmpty('text'); // false
 * ```
 */
export function isEmpty(value: string): value is '';
export function isEmpty(value?: null | undefined): true;
/**
 * Check if a value is null, undefined, empty ArrayLike, Map, Set or empty object.
 * @param value The value to check.
 * @returns Whether the value is null, undefined, empty ArrayLike, Map, Set or empty object.
 */
export function isEmpty(value: unknown): boolean;
/**
 * Checks if a value is empty.
 *
 * Empty collections remain defined objects, so this check does not narrow them to null or undefined.
 * @param value - The value to check for emptiness. It can be of any type.
 * @return {boolean} `true` if the value is empty, `false` otherwise.
 */
export function isEmpty(value?: unknown): boolean {
  if (value === null || value === undefined) {
    // Handles null and undefined
    return true;
  }

  // Handle array-like objects (arrays, strings, jQuery-like collections)
  if (
    (Array.isArray(value) ||
      typeof value === 'string' ||
      (typeof value === 'object' && 'splice' in value && typeof value.splice === 'function')) &&
    isArrayLike(value)
  ) {
    return value.length === 0;
  }

  // Handle Maps and Sets
  if (value instanceof Map || value instanceof Set) {
    return value.size === 0;
  }

  // Handle objects
  if (typeof value === 'object') {
    // Check for prototype objects and non-enumerable properties
    if (isPrototype(value)) {
      return Object.getOwnPropertyNames(value).length === 0;
    }

    // Check for enumerable properties
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        return false;
      }
    }
    return true;
  }

  // All other types (numbers, booleans, functions, etc.)
  return true;
}

/**
 * Checks if a string value is not empty.
 *
 * @param value - The string value to check.
 * @returns `false` if the value is an empty string, `true` otherwise.
 */
export function isNotEmpty(value: ''): false;
export function isNotEmpty(value?: null | undefined): false;
/**
 * Checks if a string value is not empty.
 *
 * @param value - The string value to check.
 * @returns `true` if the value is a non-empty string, `false` otherwise.
 */
export function isNotEmpty(value: string): boolean;
/**
 * Checks if a value is not empty (not null, undefined, or empty collection).
 *
 * Returns boolean: an empty collection is still defined, so neither branch narrows nullability.
 *
 * @param value - The value to check.
 * @returns `true` if the value is not null, undefined, or empty, `false` otherwise.
 */
export function isNotEmpty(value: unknown): boolean;
/**
 * Checks if a value is not null, undefined, empty ArrayLike, Map, Set, or empty object.
 *
 * @param value - The value to check.
 * @return {boolean} Whether the value is not null, undefined, empty ArrayLike, Map, Set, or empty object.
 */
export function isNotEmpty(value?: unknown): boolean {
  return !isEmpty(value);
}
