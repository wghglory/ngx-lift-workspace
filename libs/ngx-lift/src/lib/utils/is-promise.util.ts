/**
 * Type guard that checks if a value is a Promise.
 *
 * @param obj - The value to check.
 * @returns `true` if the value is Promise-like (has a `then` method), `false` otherwise.
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
export function isPromise<T>(obj: T | PromiseLike<T>): obj is PromiseLike<T>;
export function isPromise(obj: unknown): obj is PromiseLike<unknown>;
export function isPromise(obj: unknown): obj is PromiseLike<unknown> {
  return (
    obj !== null &&
    (typeof obj === 'object' || typeof obj === 'function') &&
    'then' in obj &&
    typeof obj.then === 'function'
  );
}
