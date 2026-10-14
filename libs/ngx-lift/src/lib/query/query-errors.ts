/** A logical read exceeded its total deadline, including loader execution and retry waits. */
export class QueryTimeoutError extends Error {
  constructor(
    readonly deadlineMs: number,
    cause?: unknown,
  ) {
    super(`Query deadline exceeded (${deadlineMs} ms)`, {cause});
    this.name = 'QueryTimeoutError';
  }
}
