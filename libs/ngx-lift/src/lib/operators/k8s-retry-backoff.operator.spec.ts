import {HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {defer, of, throwError} from 'rxjs';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {getK8sRetryDelayMs, K8S_RETRY_FALLBACK_DELAY_MS, retryOnK8sBackoff} from './k8s-retry-backoff.operator';

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
  });

  afterEach(() => {
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
    source$.pipe(retryOnK8sBackoff({fallbackDelayMs: 2000})).subscribe((val) => {
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
