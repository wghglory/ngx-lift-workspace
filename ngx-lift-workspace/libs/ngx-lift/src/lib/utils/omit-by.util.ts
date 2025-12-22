import {pickBy} from './pick-by.util';

/**
 * Create an object composed of object properties that do not satisfy a given condition.
 * @param {T} source - The object to omit properties from.
 * @param {(value: T[keyof T], key: string) => boolean} predicate - The function invoked per property.
 * @returns {Partial<T>} - Returns the new object.
 */
export function omitBy<T>(source: T, predicate: (value: T[keyof T], key: string) => boolean): Partial<T> {
  // Negate the predicate and pass it to pickBy
  return pickBy(source, (value, key) => !predicate(value, key));
}
