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

/** `queryResource.execute()` was called while its definition was undefined. */
export class QueryResourceDisabledError extends Error {
  constructor(message = 'Query resource is disabled') {
    super(message);
    this.name = 'QueryResourceDisabledError';
  }
}

/** `queryResource.execute()` was called after the observer was destroyed. */
export class QueryResourceDisposedError extends Error {
  constructor(message = 'Query resource has been destroyed') {
    super(message);
    this.name = 'QueryResourceDisposedError';
  }
}
