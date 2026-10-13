import {HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {defer, of, throwError} from 'rxjs';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {
  getK8sRetryDelayMs,
  isK8sStatusThrottled,
  K8S_RETRY_FALLBACK_DELAY_MS,
  K8sRetryLogContext,
  retryOnK8sBackoff,
} from './k8s-retry-backoff.operator';

describe('isK8sStatusThrottled', () => {
  it('returns true for HttpErrorResponse 429 with Kubernetes Status TooManyRequests body', () => {
    const error = new HttpErrorResponse({
      status: 429,
      error: {
        kind: 'Status',
        apiVersion: 'v1',
        status: 'Failure',
        reason: 'TooManyRequests',
        message: 'storage is (re)initializing',
      },
    });
    expect(isK8sStatusThrottled(error)).toBe(true);
  });

  it('returns true when error body is a serialized JSON string containing Status TooManyRequests', () => {
    const error = new HttpErrorResponse({
      status: 429,
      error: JSON.stringify({
        kind: 'Status',
        status: 'Failure',
        reason: 'TooManyRequests',
      }),
    });
    expect(isK8sStatusThrottled(error)).toBe(true);
  });

  it('returns false when error body is not a K8s Status (e.g. gateway error)', () => {
    const error = new HttpErrorResponse({
      status: 429,
      error: {message: 'rate limit exceeded'},
    });
    expect(isK8sStatusThrottled(error)).toBe(false);
  });

  it('returns false when status code is not 429', () => {
    const error = new HttpErrorResponse({
      status: 500,
      error: {kind: 'Status', reason: 'TooManyRequests'},
    });
    expect(isK8sStatusThrottled(error)).toBe(false);
  });

  it('returns false for unparseable string error bodies or non-HTTP errors', () => {
    expect(isK8sStatusThrottled(new HttpErrorResponse({status: 429, error: '{invalid json'}))).toBe(false);
    expect(isK8sStatusThrottled(new Error('crash'))).toBe(false);
    expect(isK8sStatusThrottled(null)).toBe(false);
  });

  it('unwraps errorResponse property if wrapped', () => {
    const inner = new HttpErrorResponse({
      status: 429,
      error: {kind: 'Status', reason: 'TooManyRequests'},
    });
    expect(isK8sStatusThrottled({errorResponse: inner})).toBe(true);
  });
});

describe('getK8sRetryDelayMs', () => {
  it('returns null for non-429 status codes', () => {
    expect(getK8sRetryDelayMs(new HttpErrorResponse({status: 500}))).toBeNull();
    expect(getK8sRetryDelayMs(new HttpErrorResponse({status: 404}))).toBeNull();
    expect(getK8sRetryDelayMs(new HttpErrorResponse({status: 400}))).toBeNull();
    expect(getK8sRetryDelayMs(new HttpErrorResponse({status: 401}))).toBeNull();
  });

  it('returns null for errors not shaped like HttpErrorResponse', () => {
    expect(getK8sRetryDelayMs(new Error('Network failure'))).toBeNull();
    expect(getK8sRetryDelayMs('a string error')).toBeNull();
    expect(getK8sRetryDelayMs(null)).toBeNull();
    expect(getK8sRetryDelayMs(undefined)).toBeNull();
  });

  it('extracts delay from Retry-After header when it contains integer seconds', () => {
    const error = new HttpErrorResponse({
      status: 429,
      headers: new HttpHeaders({'Retry-After': '5'}),
      error: {details: {retryAfterSeconds: 15}},
    });
    // Header should take precedence over body
    expect(getK8sRetryDelayMs(error)).toBe(5000);
  });

  it('extracts delay from Retry-After header when it contains an HTTP date', () => {
    const futureDate = new Date(Date.now() + 8000).toUTCString();
    const error = new HttpErrorResponse({
      status: 429,
      headers: new HttpHeaders({'Retry-After': futureDate}),
    });

    const delay = getK8sRetryDelayMs(error);
    expect(delay).toBeGreaterThan(0);
    expect(delay).toBeLessThanOrEqual(8000);
  });

  it('extracts delay from body details.retryAfterSeconds when header is absent', () => {
    const error = new HttpErrorResponse({
      status: 429,
      error: {
        kind: 'Status',
        apiVersion: 'v1',
        status: 'Failure',
        message: 'storage is (re)initializing',
        reason: 'TooManyRequests',
        details: {retryAfterSeconds: 3},
        code: 429,
      },
    });
    expect(getK8sRetryDelayMs(error)).toBe(3000);
  });

  it('extracts delay from body details.retryAfterSeconds when error body is a serialized JSON string', () => {
    const error = new HttpErrorResponse({
      status: 429,
      error: JSON.stringify({
        kind: 'Status',
        status: 'Failure',
        message: 'storage is (re)initializing',
        details: {retryAfterSeconds: 2},
      }),
    });
    expect(getK8sRetryDelayMs(error)).toBe(2000);
  });

  it('falls back to default delay when neither header nor body hint is provided', () => {
    const error = new HttpErrorResponse({status: 429});
    expect(getK8sRetryDelayMs(error)).toBe(K8S_RETRY_FALLBACK_DELAY_MS);
  });

  it('falls back to custom fallback delay when provided', () => {
    const error = new HttpErrorResponse({status: 429});
    expect(getK8sRetryDelayMs(error, 2500)).toBe(2500);
  });

  it('unwraps errorResponse property if wrapped inside another error object', () => {
    const innerError = new HttpErrorResponse({
      status: 429,
      error: {details: {retryAfterSeconds: 4}},
    });
    const wrappedError = {errorResponse: innerError};
    expect(getK8sRetryDelayMs(wrappedError)).toBe(4000);
  });
});

describe('retryOnK8sBackoff', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('retries on 429 and succeeds when a subsequent attempt succeeds', async () => {
    let attempts = 0;
    const source$ = defer(() => {
      attempts++;
      if (attempts < 3) {
        return throwError(
          () =>
            new HttpErrorResponse({
              status: 429,
              error: {details: {retryAfterSeconds: 1}},
            }),
        );
      }
      return of({data: 'success'});
    });

    let result: {data: string} | undefined;
    source$.pipe(retryOnK8sBackoff()).subscribe((val) => {
      result = val;
    });

    expect(attempts).toBe(1);
    expect(result).toBeUndefined();

    // Advance 1s for the first retry
    await vi.advanceTimersByTimeAsync(1000);
    expect(attempts).toBe(2);
    expect(result).toBeUndefined();

    // Advance 1s for the second retry
    await vi.advanceTimersByTimeAsync(1000);
    expect(attempts).toBe(3);
    expect(result).toEqual({data: 'success'});
  });

  it('does not retry a non-429 error and immediately propagates it', () => {
    let attempts = 0;
    let caughtError: unknown;

    const source$ = defer(() => {
      attempts++;
      return throwError(() => new HttpErrorResponse({status: 500, statusText: 'Server Error'}));
    });

    source$.pipe(retryOnK8sBackoff()).subscribe({
      error: (err) => {
        caughtError = err;
      },
    });

    expect(attempts).toBe(1);
    expect(caughtError).toBeInstanceOf(HttpErrorResponse);
    expect((caughtError as HttpErrorResponse).status).toBe(500);
  });

  it('gives up after maxAttempts and re-throws the original error unchanged', async () => {
    let attempts = 0;
    let caughtError: unknown;
    const originalError = new HttpErrorResponse({
      status: 429,
      statusText: 'Too Many Requests',
      error: {details: {retryAfterSeconds: 1}},
    });

    const source$ = defer(() => {
      attempts++;
      return throwError(() => originalError);
    });

    source$.pipe(retryOnK8sBackoff({maxAttempts: 3, fallbackDelayMs: 500})).subscribe({
      error: (err) => {
        caughtError = err;
      },
    });

    expect(attempts).toBe(1);

    // Retry 1
    await vi.advanceTimersByTimeAsync(1000);
    expect(attempts).toBe(2);

    // Retry 2 (maxAttempts = 3 total)
    await vi.advanceTimersByTimeAsync(1000);
    expect(attempts).toBe(3);

    // Exhausted: error thrown
    expect(caughtError).toBe(originalError);
  });

  it('uses fallbackDelayMs when 429 response has no hint', async () => {
    let attempts = 0;
    const source$ = defer(() => {
      attempts++;
      if (attempts === 1) {
        return throwError(() => new HttpErrorResponse({status: 429}));
      }
      return of('done');
    });

    let result: string | undefined;
    source$.pipe(retryOnK8sBackoff({fallbackDelayMs: 2000, jitter: 'none'})).subscribe((val) => {
      result = val;
    });

    expect(attempts).toBe(1);

    // 1000ms is not enough
    await vi.advanceTimersByTimeAsync(1000);
    expect(attempts).toBe(1);

    // Another 1000ms completes the 2000ms fallback delay
    await vi.advanceTimersByTimeAsync(1000);
    expect(attempts).toBe(2);
    expect(result).toBe('done');
  });
});

describe('bounded exponential retry', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it.each(['0.5', '-1', '+1', '1/2', 'Mon, 0.5', 'Mon, 1/2', 'Monday 1', '9'.repeat(400)])(
    'ignores malformed Retry-After %s and uses the body',
    (hint) => {
      const error = new HttpErrorResponse({
        status: 429,
        headers: new HttpHeaders({'Retry-After': hint}),
        error: {details: {retryAfterSeconds: 5}},
      });
      expect(getK8sRetryDelayMs(error)).toBe(5000);
    },
  );

  it('clamps past HTTP dates to zero and rejects nonfinite body hints', () => {
    expect(
      getK8sRetryDelayMs(
        new HttpErrorResponse({
          status: 429,
          headers: new HttpHeaders({'Retry-After': 'Wed, 21 Oct 2015 07:28:00 GMT'}),
        }),
      ),
    ).toBe(0);
    expect(
      getK8sRetryDelayMs(new HttpErrorResponse({status: 429, error: {details: {retryAfterSeconds: Infinity}}})),
    ).toBe(1000);
  });

  it('uses exponentially increasing equal jitter and a fresh wait budget for each subscriber', async () => {
    const error = new HttpErrorResponse({status: 429});
    let calls = 0;
    const source = defer(() => {
      calls++;
      return throwError(() => error);
    });
    const retried = source.pipe(retryOnK8sBackoff({random: () => 0, maxAttempts: 4, maxTotalDelayMs: 1499}));
    const first = vi.fn();
    retried.subscribe({error: first});
    await vi.advanceTimersByTimeAsync(499);
    expect(calls).toBe(1);
    await vi.advanceTimersByTimeAsync(1);
    expect(calls).toBe(2);
    expect(first).toHaveBeenCalledWith(error); // Next 1000ms wait exceeds the remaining budget.
    const second = vi.fn();
    retried.subscribe({error: second});
    await vi.advanceTimersByTimeAsync(500);
    expect(calls).toBe(4);
    expect(second).toHaveBeenCalledWith(error);
  });

  it('increases deterministic fallback delays across retries', async () => {
    let calls = 0;
    const source = defer(() => {
      calls++;
      return calls < 4 ? throwError(() => ({status: 429})) : of('ok');
    });
    const next = vi.fn();
    source.pipe(retryOnK8sBackoff({fallbackDelayMs: 100, jitter: 'none'})).subscribe(next);
    await vi.advanceTimersByTimeAsync(100);
    expect(calls).toBe(2);
    await vi.advanceTimersByTimeAsync(199);
    expect(calls).toBe(2);
    await vi.advanceTimersByTimeAsync(1);
    expect(calls).toBe(3);
    await vi.advanceTimersByTimeAsync(400);
    expect(next).toHaveBeenCalledWith('ok');
  });

  it.each([{maxDelayMs: 30000}, {maxDelayMs: 200000, maxTotalDelayMs: 60000}])(
    'never truncates a server hint to fit %j',
    (config) => {
      const error = new HttpErrorResponse({status: 429, headers: new HttpHeaders({'Retry-After': '120'})});
      let calls = 0;
      const caught = vi.fn();
      defer(() => {
        calls++;
        return throwError(() => error);
      })
        .pipe(retryOnK8sBackoff(config))
        .subscribe({error: caught});
      expect(calls).toBe(1);
      expect(caught).toHaveBeenCalledWith(error);
      expect(vi.getTimerCount()).toBe(0);
    },
  );

  it('cancels a pending wait on unsubscribe and preserves errors from faulty random callbacks', async () => {
    const error = new HttpErrorResponse({status: 429});
    let calls = 0;
    const source = defer(() => {
      calls++;
      return throwError(() => error);
    });
    const subscription = source.pipe(retryOnK8sBackoff({jitter: 'none'})).subscribe({error: vi.fn()});
    subscription.unsubscribe();
    await vi.advanceTimersByTimeAsync(10000);
    expect(calls).toBe(1);
    const caught = vi.fn();
    source.pipe(retryOnK8sBackoff({random: () => NaN})).subscribe({error: caught});
    expect(caught).toHaveBeenCalledWith(error);
  });

  it.each([{maxAttempts: Infinity}, {maxAttempts: 0}, {fallbackDelayMs: NaN}, {maxDelayMs: -1}, {maxDelayMs: 2 ** 31}])(
    'rejects invalid configuration %j',
    (config) => {
      expect(() => retryOnK8sBackoff(config)).toThrow(RangeError);
    },
  );

  it('aborts retries immediately if isRetryable returns false', () => {
    let calls = 0;
    const error = new HttpErrorResponse({status: 429});
    const source = defer(() => {
      calls++;
      return throwError(() => error);
    });
    const caught = vi.fn();
    source.pipe(retryOnK8sBackoff({isRetryable: () => false})).subscribe({error: caught});
    expect(calls).toBe(1);
    expect(caught).toHaveBeenCalledWith(error);
  });

  it('retries custom status codes when configured in retryStatusCodes', async () => {
    let calls = 0;
    const error = new HttpErrorResponse({status: 503});
    const source = defer(() => {
      calls++;
      return calls === 1 ? throwError(() => error) : of('recovered');
    });
    const result = vi.fn();
    source
      .pipe(retryOnK8sBackoff({retryStatusCodes: [429, 503], fallbackDelayMs: 100, jitter: 'none'}))
      .subscribe(result);
    await vi.advanceTimersByTimeAsync(100);
    expect(calls).toBe(2);
    expect(result).toHaveBeenCalledWith('recovered');
  });

  it('enforces minDelayMs floor for full jitter when random() returns 0', async () => {
    let calls = 0;
    const error = new HttpErrorResponse({status: 429});
    const source = defer(() => {
      calls++;
      return calls === 1 ? throwError(() => error) : of('done');
    });
    const result = vi.fn();
    source
      .pipe(
        retryOnK8sBackoff({
          jitter: 'full',
          random: () => 0,
          minDelayMs: 250,
          fallbackDelayMs: 1000,
        }),
      )
      .subscribe(result);

    await vi.advanceTimersByTimeAsync(249);
    expect(calls).toBe(1);
    await vi.advanceTimersByTimeAsync(1);
    expect(calls).toBe(2);
    expect(result).toHaveBeenCalledWith('done');
  });

  it('logs retry attempts to custom logger or console.warn when logRetries is enabled', async () => {
    const error = new HttpErrorResponse({status: 429});
    let calls = 0;
    const source = defer(() => {
      calls++;
      return calls === 1 ? throwError(() => error) : of('ok');
    });
    const loggerSpy = vi.fn();
    source
      .pipe(
        retryOnK8sBackoff({
          logRetries: true,
          label: 'GET /api/v1/pods',
          logger: loggerSpy,
          fallbackDelayMs: 100,
          jitter: 'none',
        }),
      )
      .subscribe();

    expect(loggerSpy).toHaveBeenCalledOnce();
    const [msg, context] = loggerSpy.mock.calls[0] as [string, K8sRetryLogContext];
    expect(msg).toContain('[k8s-retry-backoff] GET /api/v1/pods status 429');
    expect(context.attempt).toBe(1);
    expect(context.label).toBe('GET /api/v1/pods');

    // Test console.warn fallback
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    calls = 0;
    source
      .pipe(
        retryOnK8sBackoff({
          logRetries: true,
          label: 'POST /api/v1/pods',
          fallbackDelayMs: 100,
          jitter: 'none',
        }),
      )
      .subscribe();
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('[k8s-retry-backoff] POST /api/v1/pods status 429'));
    warnSpy.mockRestore();
  });
  it.each(['equal', 'full', 'none'] as const)('applies the fallback floor with %s jitter', async (jitter) => {
    let calls = 0;
    defer(() => (++calls === 1 ? throwError(() => new HttpErrorResponse({status: 429})) : of('ok')))
      .pipe(retryOnK8sBackoff({jitter, random: () => 0, fallbackDelayMs: 100, minDelayMs: 250}))
      .subscribe();
    await vi.advanceTimersByTimeAsync(249);
    expect(calls).toBe(1);
    await vi.advanceTimersByTimeAsync(1);
    expect(calls).toBe(2);
  });

  it('rejects a fallback floor above the single wait cap', () => {
    expect(() => retryOnK8sBackoff({minDelayMs: 101, maxDelayMs: 100})).toThrow(RangeError);
  });

  it('does not let a throwing logger abort recovery', async () => {
    let calls = 0;
    const result = vi.fn();
    defer(() => (++calls === 1 ? throwError(() => new HttpErrorResponse({status: 429})) : of('ok')))
      .pipe(
        retryOnK8sBackoff({
          fallbackDelayMs: 100,
          jitter: 'none',
          logRetries: true,
          logger: () => {
            throw new Error('logging unavailable');
          },
        }),
      )
      .subscribe({next: result, error: vi.fn()});
    await vi.advanceTimersByTimeAsync(100);
    expect(result).toHaveBeenCalledWith('ok');
  });

  it('checks eligible status codes before invoking the extra predicate', () => {
    const predicate = vi.fn(() => true);
    const error = new HttpErrorResponse({status: 500});
    const caught = vi.fn();
    throwError(() => error)
      .pipe(retryOnK8sBackoff({isRetryable: predicate}))
      .subscribe({error: caught});
    expect(predicate).not.toHaveBeenCalled();
    expect(caught).toHaveBeenCalledWith(error);
  });
  it('leaves server hints below the fallback floor unchanged', async () => {
    let calls = 0;
    defer(() =>
      ++calls === 1
        ? throwError(() => new HttpErrorResponse({status: 429, headers: new HttpHeaders({'Retry-After': '0'})}))
        : of('ok'),
    )
      .pipe(retryOnK8sBackoff({minDelayMs: 250, hintJitterMs: 0}))
      .subscribe();
    await vi.advanceTimersByTimeAsync(0);
    expect(calls).toBe(2);
  });

  it('stops without logging when the fallback floor exceeds the remaining budget', () => {
    const error = new HttpErrorResponse({status: 429});
    const caught = vi.fn();
    const logger = vi.fn();
    throwError(() => error)
      .pipe(
        retryOnK8sBackoff({
          minDelayMs: 250,
          maxTotalDelayMs: 249,
          fallbackDelayMs: 100,
          logRetries: true,
          logger,
        }),
      )
      .subscribe({error: caught});
    expect(caught).toHaveBeenCalledWith(error);
    expect(logger).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('preserves the original error when the extra predicate throws', () => {
    const error = new HttpErrorResponse({status: 429});
    const caught = vi.fn();
    throwError(() => error)
      .pipe(
        retryOnK8sBackoff({
          isRetryable: () => {
            throw new Error('invalid predicate');
          },
        }),
      )
      .subscribe({error: caught});
    expect(caught).toHaveBeenCalledWith(error);
    expect(vi.getTimerCount()).toBe(0);
  });
});
