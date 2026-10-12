import {QueryKey, QueryKeyValue} from './query.models';

/**
 * Canonical, typed JSON encoding without delimiter collisions or object-order differences.
 * @example
 * ```typescript
 * serializeQueryKey(['users', {page: 1, tenant: 'a'}]);
 * // Same result regardless of the parameter object's property order.
 * ```
 */
export function serializeQueryKey(key: QueryKey): string {
  if (!Array.isArray(key)) {
    throw new TypeError('A query key must be an array of JSON-compatible values.');
  }
  return JSON.stringify(normalizeValue(key, new Set()));
}

function normalizeValue(value: unknown, ancestors: Set<object>): QueryKeyValue {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value !== 'object' || value === null) {
    throw new TypeError('Query keys only support finite numbers, strings, booleans, null, arrays, and plain objects.');
  }
  if (ancestors.has(value)) {
    throw new TypeError('Query keys cannot contain circular references.');
  }
  ancestors.add(value);
  try {
    if (Object.getOwnPropertySymbols(value).length) {
      throw new TypeError('Query keys cannot contain symbol properties.');
    }
    if (Array.isArray(value)) {
      const result: QueryKeyValue[] = [];
      for (let i = 0; i < value.length; i++) {
        if (!Object.prototype.hasOwnProperty.call(value, i)) {
          throw new TypeError('Query keys cannot contain sparse arrays.');
        }
        const descriptor = Object.getOwnPropertyDescriptor(value, i);
        if (!descriptor || !('value' in descriptor)) {
          throw new TypeError('Query keys cannot contain accessors.');
        }
        result.push(normalizeValue(descriptor.value, ancestors));
      }
      return result;
    }
    const prototype = Object.getPrototypeOf(value);
    if (prototype !== Object.prototype && prototype !== null) {
      throw new TypeError('Query keys cannot contain dates or other class instances.');
    }
    const result: Record<string, QueryKeyValue> = Object.create(null);
    for (const key of Object.keys(value).sort()) {
      const descriptor = Object.getOwnPropertyDescriptor(value, key);
      if (!descriptor || !('value' in descriptor)) {
        throw new TypeError('Query keys cannot contain accessors.');
      }
      result[key] = normalizeValue(descriptor.value, ancestors);
    }
    return result;
  } finally {
    ancestors.delete(value);
  }
}
