// Distribute across object unions so callbacks see values from every member.
type PropertyValue<T> = T extends unknown ? T[keyof T] : never;

// The signature supplying the guard target must itself accept every source value.
type ValueGuard<T, V, S extends V> = ((value: V, key: string) => value is S) &
  ([PropertyValue<T>] extends [V] ? unknown : never);

/** Options for {@link pickBy}. */
export interface PickByOptions {
  /** When true, keep properties the predicate rejects instead of those it accepts. */
  readonly negate?: boolean;
}

/**
 * Create an object composed of object properties that satisfy a given condition.
 * Value type guards narrow each retained property; literal negation excludes the guarded type.
 * Keys remain optional. Boolean predicates or dynamic negation retain `Partial<T>`.
 * @param {T} source - The object to pick properties from.
 * @param {(value: PropertyValue<T>, key: string) => boolean} predicate - The function invoked per property.
 * @param {PickByOptions} options - Optional behavior; `negate` inverts the predicate.
 * @returns A new object containing only matching own enumerable string properties.
 */
export function pickBy<T, S extends PropertyValue<T>>(
  source: T,
  predicate: (value: PropertyValue<T>, key: string) => value is S,
  options?: PickByOptions & {readonly negate: false},
): Partial<{[K in keyof T]: T[K] & S}>;
export function pickBy<T, S extends PropertyValue<T>>(
  source: T,
  predicate: (value: PropertyValue<T>, key: string) => value is S,
  options: PickByOptions & {readonly negate: true},
): Partial<{[K in keyof T]: Exclude<T[K], S>}>;
export function pickBy<T, V, S extends V>(
  source: T,
  predicate: ValueGuard<T, V, S>,
  options?: PickByOptions & {readonly negate: false},
): Partial<{[K in keyof T]: T[K] & S}>;
export function pickBy<T, V, S extends V>(
  source: T,
  predicate: ValueGuard<T, V, S>,
  options: PickByOptions & {readonly negate: true},
): Partial<{[K in keyof T]: Exclude<T[K], S>}>;
export function pickBy<T>(
  source: T,
  predicate: (value: PropertyValue<T>, key: string) => boolean,
  options?: PickByOptions,
): Partial<T>;
export function pickBy<T>(
  source: T,
  predicate: (value: PropertyValue<T>, key: string) => boolean,
  options?: PickByOptions,
): Partial<T> {
  const result: Partial<T> = {};
  const negate = options?.negate === true;

  for (const key in source) {
    if (!Object.prototype.hasOwnProperty.call(source, key)) continue;
    const value = source[key] as PropertyValue<T>;
    if (predicate(value, key) !== negate) {
      Object.defineProperty(result, key, {value, enumerable: true, configurable: true, writable: true});
    }
  }

  return result;
}

/**
 * Create an object composed of properties the predicate rejects.
 * @deprecated Use `pickBy(source, predicate, {negate: true})`; this alias is kept for source compatibility.
 */
export function omitBy<T, S extends PropertyValue<T>>(
  source: T,
  predicate: (value: PropertyValue<T>, key: string) => value is S,
): Partial<{[K in keyof T]: Exclude<T[K], S>}>;
/** @deprecated Use `pickBy(source, predicate, {negate: true})` instead. */
export function omitBy<T, V, S extends V>(
  source: T,
  predicate: ValueGuard<T, V, S>,
): Partial<{[K in keyof T]: Exclude<T[K], S>}>;
/** @deprecated Use `pickBy(source, predicate, {negate: true})` instead. */
export function omitBy<T>(source: T, predicate: (value: PropertyValue<T>, key: string) => boolean): Partial<T>;
export function omitBy<T>(source: T, predicate: (value: PropertyValue<T>, key: string) => boolean): Partial<T> {
  return pickBy(source, predicate, {negate: true});
}
