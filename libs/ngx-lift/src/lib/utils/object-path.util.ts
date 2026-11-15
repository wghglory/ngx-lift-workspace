/**
 * Path segments that reach an object's prototype instead of its own data. Both operations reject
 * them so a caller-supplied path can never traverse or mutate prototype state.
 */
const UNSAFE_SEGMENTS = new Set(['__proto__', 'prototype', 'constructor']);

type ObjectRecord = Record<string, unknown>;

function isRecord(value: unknown): value is ObjectRecord {
  return typeof value === 'object' && value !== null;
}

/**
 * Splits a dot-notation path into safe, own-property segments.
 *
 * Empty and whitespace-only segments are rejected because they silently resolve to `undefined`
 * on read and to a no-op on delete. Prototype-related segments are rejected for security.
 */
function splitPath(path: string): string[] | undefined {
  if (typeof path !== 'string' || !path.trim()) {
    return undefined;
  }

  const segments = path.split('.');
  if (segments.some((segment) => !segment.trim() || UNSAFE_SEGMENTS.has(segment))) {
    return undefined;
  }

  return segments;
}

/**
 * Reads an own nested value from an object using a dot-notation path (e.g. `'spec.dbOwner.type'`).
 *
 * Only own properties are traversed; inherited properties, prototype accessors and the
 * `__proto__` / `prototype` / `constructor` segments are never resolved. Arrays are supported
 * through numeric segments. The input object is never modified.
 *
 * @template T Expected return type of the value at the target path. This is a caller assertion;
 * the function does not validate the runtime type.
 * @param obj The source object to read from.
 * @param path Dot-separated path to the nested property.
 * @returns The value at the specified path, or `undefined` if the path is invalid, unsafe or
 * cannot be resolved.
 *
 * @example
 * ```typescript
 * const user = {profile: {details: {name: 'Alice'}}};
 * const name = getValueByPath<string>(user, 'profile.details.name'); // 'Alice'
 * const missing = getValueByPath(user, 'profile.avatar.url'); // undefined
 * const users = {items: [{id: 1}, {id: 2}]};
 * getValueByPath<number>(users, 'items.1.id'); // 2
 * getValueByPath(user, '__proto__.toString'); // undefined
 * ```
 */
export function getValueByPath<T = unknown>(obj: unknown, path: string): T | undefined {
  const keys = splitPath(path);
  if (!keys || !isRecord(obj)) {
    return undefined;
  }

  let current: unknown = obj;
  for (const key of keys) {
    if (!isRecord(current) || !Object.hasOwn(current, key)) {
      return undefined;
    }
    current = current[key];
  }

  return current as T | undefined;
}

/**
 * Deletes an own nested property from an object based on a dot-notation path.
 * Modifies the object in place and never touches inherited or prototype properties.
 *
 * @param obj The target object to modify.
 * @param path Dot-separated path to the property to delete.
 * @returns `true` only when an own property was actually deleted; `false` for an invalid or
 * unsafe path, a missing intermediate/final segment, or a non-configurable property.
 *
 * @example
 * ```typescript
 * const config = {server: {host: 'localhost', port: 8080}};
 * deleteValueByPath(config, 'server.port'); // true
 * // config is now {server: {host: 'localhost'}}
 * deleteValueByPath(config, 'server.port'); // false
 * deleteValueByPath(config, 'constructor.name'); // false
 * ```
 */
export function deleteValueByPath(obj: unknown, path: string): boolean {
  const segments = splitPath(path);
  if (!segments || !isRecord(obj)) {
    return false;
  }

  let current: ObjectRecord = obj;
  for (let i = 0; i < segments.length - 1; i++) {
    const key = segments[i];
    if (!Object.hasOwn(current, key)) {
      return false;
    }

    const nextValue = current[key];
    if (!isRecord(nextValue)) {
      return false;
    }
    current = nextValue;
  }

  const finalKey = segments[segments.length - 1];
  if (!Object.hasOwn(current, finalKey)) {
    return false;
  }

  try {
    return delete current[finalKey];
  } catch {
    return false;
  }
}
