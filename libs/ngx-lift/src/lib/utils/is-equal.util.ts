/**
 * Check if two values are deeply equal.
 * @param {T} value1 - The first value to compare.
 * @param {T} value2 - The second value to compare.
 * @returns {boolean} - Returns true if the values are deeply equal, otherwise false.
 */
export function isEqual<T>(value1: T, value2: T): boolean {
  return compare(value1, value2, {leftToRight: new WeakMap(), rightToLeft: new WeakMap()});
}

interface Ancestors {
  leftToRight: WeakMap<object, object>;
  rightToLeft: WeakMap<object, object>;
}

function compare(value1: unknown, value2: unknown, ancestors: Ancestors): boolean {
  if (value1 === value2) return true;

  if (typeof value1 === 'number' && typeof value2 === 'number') {
    return Number.isNaN(value1) && Number.isNaN(value2);
  }

  if (typeof value1 !== 'object' || typeof value2 !== 'object' || value1 === null || value2 === null) {
    return false;
  }

  if (value1 instanceof Date && value2 instanceof Date) {
    return value1.getTime() === value2.getTime() || (Number.isNaN(value1.getTime()) && Number.isNaN(value2.getTime()));
  }

  if (value1 instanceof Date || value2 instanceof Date) {
    return false;
  }

  if (Array.isArray(value1) !== Array.isArray(value2)) {
    return false;
  }

  if (Object.getPrototypeOf(value1) !== Object.getPrototypeOf(value2)) {
    return false;
  }

  const previousRight = ancestors.leftToRight.get(value1);
  const previousLeft = ancestors.rightToLeft.get(value2);
  if (previousRight !== undefined || previousLeft !== undefined) {
    return previousRight === value2 && previousLeft === value1;
  }
  ancestors.leftToRight.set(value1, value2);
  ancestors.rightToLeft.set(value2, value1);

  try {
    return compareObjects(value1, value2, ancestors);
  } finally {
    ancestors.leftToRight.delete(value1);
    ancestors.rightToLeft.delete(value2);
  }
}

function compareObjects(value1: object, value2: object, ancestors: Ancestors): boolean {
  if (Array.isArray(value1) && Array.isArray(value2)) {
    if (value1.length !== value2.length) return false;
    for (let i = 0; i < value1.length; i++) {
      if (!compare(value1[i], value2[i], ancestors)) return false;
    }
    return true;
  }

  if (value1 instanceof Map && value2 instanceof Map) {
    if (value1.size !== value2.size) return false;
    for (const [key, value] of value1) {
      if (!value2.has(key) || !compare(value, value2.get(key), ancestors)) return false;
    }
    return true;
  }

  if (value1 instanceof Set && value2 instanceof Set) {
    if (value1.size !== value2.size) return false;
    const unmatched = [...value2];
    for (const value of value1) {
      const index = unmatched.findIndex((other) => compare(value, other, ancestors));
      if (index < 0) return false;
      unmatched.splice(index, 1);
    }
    return true;
  }

  if (value1 instanceof RegExp && value2 instanceof RegExp) {
    return value1.source === value2.source && value1.flags === value2.flags;
  }

  if (value1 instanceof ArrayBuffer && value2 instanceof ArrayBuffer) {
    return compareBytes(new Uint8Array(value1), new Uint8Array(value2));
  }

  if (ArrayBuffer.isView(value1) && ArrayBuffer.isView(value2)) {
    return compareBytes(
      new Uint8Array(value1.buffer, value1.byteOffset, value1.byteLength),
      new Uint8Array(value2.buffer, value2.byteOffset, value2.byteLength),
    );
  }

  const tag = Object.prototype.toString.call(value1);
  // Promise, File, Blob, WeakMap, and other opaque values require identity equality.
  if (tag !== '[object Object]' || Object.prototype.toString.call(value2) !== tag) {
    return false;
  }

  const keys1 = Reflect.ownKeys(value1).filter((key) => Object.prototype.propertyIsEnumerable.call(value1, key));
  const keys2 = Reflect.ownKeys(value2).filter((key) => Object.prototype.propertyIsEnumerable.call(value2, key));

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (
      !Object.prototype.propertyIsEnumerable.call(value2, key) ||
      !compare(Reflect.get(value1, key), Reflect.get(value2, key), ancestors)
    ) {
      return false;
    }
  }

  return true;
}

function compareBytes(value1: Uint8Array, value2: Uint8Array): boolean {
  if (value1.byteLength !== value2.byteLength) return false;
  return value1.every((value, index) => value === value2[index]);
}
