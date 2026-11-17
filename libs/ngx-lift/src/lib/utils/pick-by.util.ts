/** Options for {@link pickBy}. */
export interface PickByOptions {
  /** When true, keep properties the predicate rejects instead of those it accepts. */
  readonly negate?: boolean;
}

/**
 * Create an object composed of object properties that satisfy a given condition.
 * @param {T} source - The object to pick properties from.
 * @param {(value: T[keyof T], key: string) => boolean} predicate - The function invoked per property.
 * @param {PickByOptions} options - Optional behavior; `negate` inverts the predicate.
 * @returns {Partial<T>} - Returns the new object.
 */
export function pickBy<T>(
  source: T,
  predicate: (value: T[keyof T], key: string) => boolean,
  options?: PickByOptions,
): Partial<T> {
  const result: Partial<T> = {};
  const negate = options?.negate === true;

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key) && predicate(source[key], key) !== negate) {
      Object.defineProperty(result, key, {value: source[key], enumerable: true, configurable: true, writable: true});
    }
  }

  return result;
}

/**
 * Create an object composed of properties the predicate rejects.
 * @deprecated Use `pickBy(source, predicate, {negate: true})`; this alias is kept for source compatibility.
 */
export function omitBy<T>(source: T, predicate: (value: T[keyof T], key: string) => boolean): Partial<T> {
  return pickBy(source, predicate, {negate: true});
}
