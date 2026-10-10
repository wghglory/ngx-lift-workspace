/**
 * Flattens a deeply nested object into a single-level object with dot-separated (or custom separator) keys.
 *
 * Arrays and primitive values are preserved as terminal values.
 *
 * @param obj The source object to flatten.
 * @param parentKey Internal prefix used during recursion. Defaults to empty string.
 * @param separator Separator between nested key paths. Defaults to `'.'`.
 * @returns A flattened record of key-path to value mappings.
 *
 * @example
 * ```typescript
 * const nested = {
 *   server: {
 *     host: 'localhost',
 *     ports: [80, 443],
 *     ssl: { enabled: true }
 *   }
 * };
 * const flat = flattenObject(nested);
 * // {
 * //   'server.host': 'localhost',
 * //   'server.ports': [80, 443],
 * //   'server.ssl.enabled': true
 * // }
 * ```
 */
export function flattenObject(obj: Record<string, unknown>, parentKey = '', separator = '.'): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  if (!obj || typeof obj !== 'object') {
    return result;
  }

  for (const key of Object.keys(obj)) {
    const newKey = parentKey ? `${parentKey}${separator}${key}` : key;
    const value = obj[key];

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value as Record<string, unknown>, newKey, separator));
    } else {
      result[newKey] = value;
    }
  }

  return result;
}
