import {HttpErrorResponse} from '@angular/common/http';
import {MonoTypeOperatorFunction, defer, Observable, retry, throwError, timer} from 'rxjs';

import {KubernetesStatus} from '../models/kubernetes-status.model';

/** HTTP status code used by Kubernetes apiservers when a request should be retried later (e.g. watch cache reinitializing). */
export const K8S_RETRY_STATUS_CODE = 429;

/** Total attempts allowed, including the initial try, before giving up. */
export const K8S_RETRY_MAX_ATTEMPTS = 5;

/** Fallback delay in milliseconds used when a 429 response provides neither a `Retry-After` header nor a `details.retryAfterSeconds` body field. */
export const K8S_RETRY_FALLBACK_DELAY_MS = 1000;

/**
 * Configuration options for the `retryOnK8sBackoff` operator.
 */
export interface K8sBackoffRetryConfig {
  /**
   * Total number of attempts allowed, including the initial try.
   * Defaults to {@link K8S_RETRY_MAX_ATTEMPTS} (5).
   */
  maxAttempts?: number;

  /**
   * Fallback delay in milliseconds when the server provides no retry hint.
   * Defaults to {@link K8S_RETRY_FALLBACK_DELAY_MS} (1000).
   */
  fallbackDelayMs?: number;

  /** Fallback jitter. Equal jitter avoids immediate retries; `none` gives deterministic exponential waits. */
  jitter?: 'equal' | 'full' | 'none';
  /** Additive jitter for server hints. Defaults to 250ms. Hints are never shortened. */
  hintJitterMs?: number;
  /** Maximum single wait, defaults to 30s. A larger server hint stops retrying. */
  maxDelayMs?: number;
  /** Cumulative scheduled wait budget, defaults to 60s. This is not a request timeout. */
  maxTotalDelayMs?: number;
  /** Interceptor-only method allowlist. Defaults to GET, HEAD, OPTIONS, PUT and DELETE. */
  retryMethods?: readonly string[];
  /** Random source returning a finite number in [0, 1), useful for deterministic scheduling. */
  random?: () => number;
}

interface HttpErrorLike {
  status?: number;
  headers?: {get(name: string): string | null};
  error?: unknown;
}

/**
 * Normalizes an unknown error into an HttpErrorResponse or HttpErrorLike object if present.
 */
function extractHttpError(error: unknown): HttpErrorLike | null {
  if (error instanceof HttpErrorResponse) {
    return error;
  }
  if (error && typeof error === 'object') {
    if ('errorResponse' in error && (error as {errorResponse: unknown}).errorResponse instanceof HttpErrorResponse) {
      return (error as {errorResponse: HttpErrorResponse}).errorResponse;
    }
    if ('status' in error && typeof (error as HttpErrorLike).status === 'number') {
      return error as HttpErrorLike;
    }
  }
  return null;
}

/**
 * Computes the retry delay in milliseconds for a Kubernetes `429 TooManyRequests` response.
 *
 * Checks:
 * 1. The `Retry-After` response header (numeric seconds or RFC 7231 HTTP-date).
 * 2. The `details.retryAfterSeconds` field on the parsed Kubernetes `Status` body or JSON string body.
 * 3. Falls back to `fallbackDelayMs` if no hint is provided.
 *
 * Returns `null` if the error status is not 429 (indicating the error should not be retried).
 *
 * @param error - The error to inspect.
 * @param fallbackDelayMs - Fallback delay in ms if no hint exists. Defaults to {@link K8S_RETRY_FALLBACK_DELAY_MS}.
 * @returns Delay in milliseconds, or `null` if not retryable.
 *
 * @example
 * ```typescript
 * const delayMs = getK8sRetryDelayMs(httpErrorResponse);
 * if (delayMs !== null) {
 *   console.log(`Retrying after ${delayMs}ms`);
 * }
 * ```
 */
export function getK8sRetryDelayMs(
  error: unknown,
  fallbackDelayMs: number = K8S_RETRY_FALLBACK_DELAY_MS,
): number | null {
  const httpError = extractHttpError(error);
  if (!httpError || httpError.status !== K8S_RETRY_STATUS_CODE) {
    return null;
  }

  // 1. Check Retry-After header
  const retryAfterHeader = httpError.headers?.get('Retry-After');
  if (retryAfterHeader) {
    const header = retryAfterHeader.trim();
    if (/^\d+$/.test(header)) {
      const delay = Number(header) * 1000;
      if (Number.isFinite(delay)) return delay;
    } else if (
      /^(?:(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), \d{2} (?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{4} \d{2}:\d{2}:\d{2} GMT|(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), \d{2}-(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-\d{2} \d{2}:\d{2}:\d{2} GMT|(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun) (?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) {1,2}\d{1,2} \d{2}:\d{2}:\d{2} \d{4})$/.test(
        header,
      )
    ) {
      // Date.parse accepts malformed numeric dates; validate the three HTTP-date formats first.
      const delay = Date.parse(header) - Date.now();
      if (Number.isFinite(delay)) return Math.max(0, delay);
    }
  }

  // 2. Check details.retryAfterSeconds in error body
  let body = httpError.error;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      // Body is not JSON; proceed to fallback
    }
  }

  if (body && typeof body === 'object') {
    const statusBody = body as KubernetesStatus;
    const retryAfterSeconds = statusBody.details?.retryAfterSeconds;
    if (typeof retryAfterSeconds === 'number' && Number.isFinite(retryAfterSeconds * 1000) && retryAfterSeconds >= 0) {
      return retryAfterSeconds * 1000;
    }
  }

  // 3. Fallback delay
  return fallbackDelayMs;
}

/**
 * RxJS operator implementing retry-with-backoff for Kubernetes API server HTTP 429 (`TooManyRequests`)
 * responses (e.g. when the apiserver watch cache is reinitializing with "storage is (re)initializing").
 *
 * Only HTTP 429 triggers a retry; all other errors (4xx, 5xx, network errors) propagate immediately
 * and unchanged to the subscriber. Honors `Retry-After` header first, then `details.retryAfterSeconds`,
 * using exponential fallback waits with equal jitter when no hint exists.
 * A hint above the delay cap or wait budget stops retrying rather than retrying early.
 *
 * @template T - The emission type of the source Observable.
 * @param config - Optional configuration for max attempts and fallback delay.
 * @returns A MonoTypeOperatorFunction that retries on 429.
 *
 * @example
 * ```typescript
 * this.http.get('/api/v1/namespaces/default/pods')
 *   .pipe(retryOnK8sBackoff())
 *   .subscribe({
 *     next: (pods) => console.log('Pods:', pods),
 *     error: (err) => console.error('Error after retries:', err),
 *   });
 * ```
 */
export function retryOnK8sBackoff<T>(config?: K8sBackoffRetryConfig): MonoTypeOperatorFunction<T> {
  const maxAttempts = config?.maxAttempts ?? K8S_RETRY_MAX_ATTEMPTS;
  const fallbackDelayMs = config?.fallbackDelayMs ?? K8S_RETRY_FALLBACK_DELAY_MS;
  const maxDelayMs = config?.maxDelayMs ?? 30_000;
  const maxTotalDelayMs = config?.maxTotalDelayMs ?? 60_000;
  const hintJitterMs = config?.hintJitterMs ?? 250;
  const jitter = config?.jitter ?? 'equal';
  const random = config?.random ?? Math.random;
  if (!Number.isSafeInteger(maxAttempts) || maxAttempts < 1) {
    throw new RangeError('maxAttempts must be a positive safe integer');
  }
  for (const [name, value] of Object.entries({fallbackDelayMs, maxDelayMs, maxTotalDelayMs, hintJitterMs})) {
    if (!Number.isFinite(value) || value < 0) throw new RangeError(`${name} must be finite and nonnegative`);
  }
  if (maxDelayMs > 2_147_483_647) throw new RangeError('maxDelayMs exceeds the timer limit');
  if (!['equal', 'full', 'none'].includes(jitter)) throw new RangeError('Unsupported jitter strategy');
  if (typeof random !== 'function') throw new TypeError('random must be a function');

  return (source$: Observable<T>) =>
    defer(() => {
      let totalDelayMs = 0;
      return source$.pipe(
        retry({
          count: maxAttempts - 1,
          delay: (error: unknown, retryCount: number) => {
            try {
              const hint = getK8sRetryDelayMs(error, NaN);
              if (hint === null) return throwError(() => error);
              // Never truncate a server's minimum wait to make it fit our client budget.
              if (Number.isFinite(hint) && hint > Math.min(maxDelayMs, maxTotalDelayMs - totalDelayMs)) {
                return throwError(() => error);
              }
              const needsRandom = Number.isFinite(hint) ? hintJitterMs > 0 : jitter !== 'none';
              const draw = needsRandom ? random() : 0;
              if (!Number.isFinite(draw) || draw < 0 || draw >= 1) return throwError(() => error);
              const ceiling = Math.min(maxDelayMs, fallbackDelayMs * 2 ** Math.min(retryCount - 1, 1023));
              const delayMs = Number.isFinite(hint)
                ? hint + Math.floor(draw * Math.min(hintJitterMs, maxDelayMs - hint))
                : jitter === 'none'
                  ? ceiling
                  : jitter === 'full'
                    ? Math.floor(draw * ceiling)
                    : ceiling / 2 + Math.floor((draw * ceiling) / 2);
              if (totalDelayMs + delayMs > maxTotalDelayMs) return throwError(() => error);
              totalDelayMs += delayMs;
              return timer(delayMs);
            } catch {
              // A malformed error or random callback must not replace the server's original error.
              return throwError(() => error);
            }
          },
        }),
      );
    });
}
