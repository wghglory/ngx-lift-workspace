/**
 * Check if two values are deeply equal.
 * @param {T} value1 - The first value to compare.
 * @param {T} value2 - The second value to compare.
 * @returns {boolean} - Returns true if the values are deeply equal, otherwise false.
 */
export function isEqual<T>(value1: T, value2: T): boolean {
  if (value1 === value2) return true;

  if (typeof value1 !== 'object' || typeof value2 !== 'object' || value1 === null || value2 === null) {
    return false;
  }

  if (Array.isArray(value1) !== Array.isArray(value2)) {
    return false;
  }

  if (Array.isArray(value1) && Array.isArray(value2)) {
    if (value1.length !== value2.length) return false;
    for (let i = 0; i < value1.length; i++) {
      if (!isEqual(value1[i], value2[i])) return false;
    }
    return true;
  }

  const keys1 = Object.keys(value1) as Array<keyof T>;
  const keys2 = Object.keys(value2) as Array<keyof T>;

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key) || !isEqual(value1[key], value2[key])) {
      return false;
    }
  }

  return true;
}
