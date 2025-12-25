/**
 * Create an object composed of object properties that satisfy a given condition.
 * @param {T} source - The object to pick properties from.
 * @param {(value: T[keyof T], key: string) => boolean} predicate - The function invoked per property.
 * @returns {Partial<T>} - Returns the new object.
 */
export function pickBy<T>(source: T, predicate: (value: T[keyof T], key: string) => boolean): Partial<T> {
  const result: Partial<T> = {};

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key) && predicate(source[key], key)) {
      result[key] = source[key];
    }
  }

  return result;
}
