/**
 * Type guard that checks if a value is a Promise.
 *
 * @param obj - The value to check.
 * @returns `true` if the value is a Promise (has a `then` method), `false` otherwise.
 *
 * @example
 * ```typescript
 * const promise = Promise.resolve(42);
 * isPromise(promise); // true
 *
 * const notPromise = 42;
 * isPromise(notPromise); // false
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isPromise(obj: any): obj is Promise<any> {
  return !!obj && typeof obj.then === 'function';
}
