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
 * Context provided to custom retry loggers.
 */
export interface K8sRetryLogContext {
  /** The 1-based retry attempt number (e.g. 1 for the first retry). */
  attempt: number;
  /** The maximum number of retry attempts allowed after the initial request. */
  maxRetries: number;
  /** The calculated backoff delay in milliseconds for this retry attempt. */
  delayMs: number;
  /** The original error; may contain credentials or response data. Redact before logging. */
  error: unknown;
  /** Optional caller-provided label identifying the request (e.g. "GET /api/v1/pods"). */
  label?: string;
}

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
  /** Minimum fallback delay for every jitter strategy. Defaults to 0; must not exceed maxDelayMs. */
  minDelayMs?: number;
  /** Additive jitter for server hints. Defaults to 250ms. Hints are never shortened. */
  hintJitterMs?: number;
  /** Maximum single wait, defaults to 30s. A larger server hint stops retrying. */
  maxDelayMs?: number;
  /** Cumulative scheduled wait budget, defaults to 60s. This is not a request timeout. */
  maxTotalDelayMs?: number;
  /** HTTP status codes eligible for retry. Defaults to `[429]`. */
  retryStatusCodes?: readonly number[];
  /**
   * Extra predicate to determine if an error is eligible for retry.
   * When specified, the error must pass the status code check AND this predicate must return true.
   */
  isRetryable?: (error: unknown) => boolean;
  /** Whether to log retry attempts to console or custom logger. Defaults to false. */
  logRetries?: boolean;
  /** Label used in retry logs, e.g. "GET /api/v1/pods". */
  label?: string;
  /** Custom logging callback. Defaults to console.warn. */
  logger?: (message: string, context: K8sRetryLogContext) => void;
  /** Interceptor-only method allowlist. Defaults to GET, HEAD, OPTIONS, PUT, and DELETE. Writes require explicit opt-in and endpoint idempotency. */
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
 * Checks if an error is a Kubernetes API server throttle response
 * (i.e. HTTP 429 with Kubernetes Status body indicating reason `TooManyRequests`).
 *
 * The body identifies the response shape, not where the rejection occurred or whether a write
 * had side effects. Use only with an endpoint-specific retry safety guarantee.
 *
 * Handles {@link HttpErrorResponse} instances, objects with an `errorResponse` property,
 * and both parsed JSON objects and serialized JSON strings in the error body.
 *
 * @param error - The error to inspect.
 * @returns `true` if the error represents a Kubernetes API server `TooManyRequests` Status failure.
 *
 * @example
 * ```typescript
 * if (isK8sStatusThrottled(error)) {
 *   console.log('Kubernetes TooManyRequests response');
 * }
 * ```
 */
export function isK8sStatusThrottled(error: unknown): boolean {
  const httpError = extractHttpError(error);
  if (!httpError || httpError.status !== K8S_RETRY_STATUS_CODE) {
    return false;
  }

  let body = httpError.error;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return false;
    }
  }

  if (body && typeof body === 'object') {
    const status = body as KubernetesStatus;
    return status.kind === 'Status' && status.reason === 'TooManyRequests';
  }

  return false;
}

/**
 * Computes the retry delay in milliseconds for a Kubernetes `429 TooManyRequests` response.
 *
 * Checks:
 * 1. The `Retry-After` response header (numeric seconds or RFC 7231 HTTP-date).
 * 2. The `details.retryAfterSeconds` field on the parsed Kubernetes `Status` body or JSON string body.
 * 3. Falls back to `fallbackDelayMs` if no hint is provided.
 *
 * Returns `null` if the error status is not retryable (indicating the error should not be retried).
 *
 * @param error - The error to inspect.
 * @param fallbackDelayMs - Fallback delay in ms if no hint exists. Defaults to {@link K8S_RETRY_FALLBACK_DELAY_MS}.
 * @param retryStatusCodes - Array of HTTP status codes eligible for retry. Defaults to `[K8S_RETRY_STATUS_CODE]`.
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
  retryStatusCodes: readonly number[] = [K8S_RETRY_STATUS_CODE],
): number | null {
  const httpError = extractHttpError(error);
  if (!httpError || typeof httpError.status !== 'number' || !retryStatusCodes.includes(httpError.status)) {
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
 * By default only HTTP 429 triggers a retry; errors outside retryStatusCodes propagate immediately
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
  const minDelayMs = config?.minDelayMs ?? 0;
  const jitter = config?.jitter ?? 'equal';
  const random = config?.random ?? Math.random;
  const retryStatusCodes = config?.retryStatusCodes ?? [K8S_RETRY_STATUS_CODE];
  const isRetryable = config?.isRetryable;
  const logRetries = config?.logRetries ?? false;
  const label = config?.label;
  const logger = config?.logger;

  if (!Number.isSafeInteger(maxAttempts) || maxAttempts < 1) {
    throw new RangeError('maxAttempts must be a positive safe integer');
  }
  for (const [name, value] of Object.entries({
    fallbackDelayMs,
    maxDelayMs,
    maxTotalDelayMs,
    hintJitterMs,
    minDelayMs,
  })) {
    if (!Number.isFinite(value) || value < 0) throw new RangeError(`${name} must be finite and nonnegative`);
  }
  if (minDelayMs > maxDelayMs) throw new RangeError('minDelayMs must not exceed maxDelayMs');
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
              const hint = getK8sRetryDelayMs(error, NaN, retryStatusCodes);
              if (hint === null || (isRetryable && !isRetryable(error))) return throwError(() => error);
              // Never truncate a server's minimum wait to make it fit our client budget.
              if (Number.isFinite(hint) && hint > Math.min(maxDelayMs, maxTotalDelayMs - totalDelayMs)) {
                return throwError(() => error);
              }
              const needsRandom = Number.isFinite(hint) ? hintJitterMs > 0 : jitter !== 'none';
              const draw = needsRandom ? random() : 0;
              if (!Number.isFinite(draw) || draw < 0 || draw >= 1) return throwError(() => error);
              const ceiling = Math.min(maxDelayMs, fallbackDelayMs * 2 ** Math.min(retryCount - 1, 1023));
              const rawDelayMs = Number.isFinite(hint)
                ? hint + Math.floor(draw * Math.min(hintJitterMs, maxDelayMs - hint))
                : jitter === 'none'
                  ? ceiling
                  : jitter === 'full'
                    ? Math.floor(draw * ceiling)
                    : ceiling / 2 + Math.floor((draw * ceiling) / 2);
              const delayMs = Math.max(Number.isFinite(hint) ? 0 : minDelayMs, rawDelayMs);
              if (totalDelayMs + delayMs > maxTotalDelayMs) return throwError(() => error);
              totalDelayMs += delayMs;

              if (logRetries) {
                const httpError = extractHttpError(error);
                const status = httpError?.status ?? 'unknown';
                const prefix = label ? `[k8s-retry-backoff] ${label}` : '[k8s-retry-backoff]';
                const message = `${prefix} status ${status}, attempt ${retryCount}/${maxAttempts - 1} in ${delayMs}ms`;
                const logContext: K8sRetryLogContext = {
                  attempt: retryCount,
                  maxRetries: maxAttempts - 1,
                  delayMs,
                  error,
                  label,
                };
                try {
                  if (logger) {
                    logger(message, logContext);
                  } else {
                    console.warn(message);
                  }
                } catch {
                  // Observability must not prevent recovery of the request.
                }
              }

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
