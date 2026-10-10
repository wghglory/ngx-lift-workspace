/**
 * Retrieves a nested value from an object using a dot-separated path.
 *
 * @param obj The source object.
 * @param path Dot-separated path (e.g. `'metadata.creationTimestamp'`, `'user.name'`).
 * @returns The resolved value, or `undefined` if the path cannot be resolved.
 *
 * @example
 * ```typescript
 * getValueByPath({ user: { profile: { age: 25 } } }, 'user.profile.age'); // 25
 * getValueByPath({ name: 'Alice' }, 'name'); // 'Alice'
 * getValueByPath(null, 'user.name'); // undefined
 * ```
 */
export function getValueByPath(obj: unknown, path: string): unknown {
  if (!path || path.trim() === '') {
    return undefined;
  }

  const keys = path.split('.');
  let value: unknown = obj;

  for (const key of keys) {
    if (value == null || typeof value !== 'object') {
      return undefined;
    }
    value = (value as Record<string, unknown>)[key];
  }

  return value;
}
