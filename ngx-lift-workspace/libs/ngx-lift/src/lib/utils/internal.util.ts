/* eslint-disable @typescript-eslint/no-explicit-any */
export function isArrayLike(value: any): value is {length: number} {
  return (
    value != null &&
    typeof value !== 'function' &&
    typeof value.length === 'number' &&
    value.length >= 0 &&
    value.length <= Number.MAX_SAFE_INTEGER
  );
}

export function isPrototype(value: any): boolean {
  const Ctor = value?.constructor;
  return Ctor && Ctor.prototype === value;
}
