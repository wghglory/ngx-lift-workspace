/* eslint-disable @typescript-eslint/no-explicit-any */

import {isArrayLike, isPrototype} from './internal.util';

export function isEmpty(value: string): value is '';
/**
 * Check if a value is null, undefined, empty ArrayLike, Map, Set or empty object.
 * @param value The value to check.
 * @returns Whether the value is null, undefined, empty ArrayLike, Map, Set or empty object.
 */
export function isEmpty<T extends object | ArrayLike<any> | Map<any, any> | Set<any>>(
  value: T | null | undefined,
): value is null | undefined;
/**
 * Checks if a value is empty.
 *
 * @param {any} value - The value to check for emptiness. It can be of any type.
 * @return {boolean} `true` if the value is empty, `false` otherwise.
 */
export function isEmpty(value?: any): boolean {
  if (value === null || value === undefined) {
    // Handles null and undefined
    return true;
  }

  // Handle array-like objects (arrays, strings, jQuery-like collections)
  if (
    (Array.isArray(value) || typeof value === 'string' || typeof (value as any).splice === 'function') &&
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

export function isNotEmpty(value: ''): false;
export function isNotEmpty(value: string): value is Exclude<string, ''>;
export function isNotEmpty<T extends object | ArrayLike<any> | Map<any, any> | Set<any>>(
  value: T | null | undefined,
): value is T;
/**
 * Checks if a value is not null, undefined, empty ArrayLike, Map, Set, or empty object.
 *
 * @param {any} value - The value to check.
 * @return {boolean} Whether the value is not null, undefined, empty ArrayLike, Map, Set, or empty object.
 */
export function isNotEmpty(value?: any): boolean {
  return !isEmpty(value);
}
