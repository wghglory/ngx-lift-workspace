/**
 * Retrieves a nested value from an object using a dot-notation path (e.g. `'spec.dbOwner.type'`).
 *
 * @template T Expected return type of the value at the target path.
 * @param obj The source object to read from.
 * @param path Dot-separated path to the nested property.
 * @returns The value at the specified path, or `undefined` if the path cannot be resolved.
 *
 * @example
 * ```typescript
 * const user = { profile: { details: { name: 'Alice' } } };
 * const name = getValueByPath<string>(user, 'profile.details.name'); // 'Alice'
 * const missing = getValueByPath(user, 'profile.avatar.url'); // undefined
 * ```
 */
export function getValueByPath<T = unknown>(obj: unknown, path: string): T | undefined {
  if (!obj || typeof obj !== 'object' || !path || !path.trim()) {
    return undefined;
  }

  const keys = path.split('.');
  let current: unknown = obj;

  for (const key of keys) {
    if (current == null || typeof current !== 'object') {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }

  return current as T | undefined;
}

/**
 * Deletes a nested property from an object based on a dot-notation path.
 * Modifies the object in place.
 *
 * @param obj The target object to modify.
 * @param path Dot-separated path to the property to delete.
 * @returns `true` if the property was successfully deleted, or `false` if the path could not be resolved.
 *
 * @example
 * ```typescript
 * const config = { server: { host: 'localhost', port: 8080 } };
 * deleteValueByPath(config, 'server.port');
 * // config is now { server: { host: 'localhost' } }
 * ```
 */
export function deleteValueByPath(obj: unknown, path: string): boolean {
  if (!obj || typeof obj !== 'object' || !path || !path.trim()) {
    return false;
  }

  const segments = path.split('.');
  let current = obj as Record<string, unknown>;

  for (let i = 0; i < segments.length - 1; i++) {
    const key = segments[i];

    if (!(key in current)) {
      return false;
    }

    const nextValue = current[key];
    if (typeof nextValue !== 'object' || nextValue === null) {
      return false;
    }

    current = nextValue as Record<string, unknown>;
  }

  const finalKey = segments[segments.length - 1];
  if (finalKey in current) {
    delete current[finalKey];
    return true;
  }

  return false;
}
