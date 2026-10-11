import {HttpErrorResponse} from '@angular/common/http';
import {MonoTypeOperatorFunction, Observable, retry, throwError, timer} from 'rxjs';

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
    const seconds = Number(retryAfterHeader);
    if (Number.isFinite(seconds) && seconds >= 0) {
      return seconds * 1000;
    }
    const dateMs = Date.parse(retryAfterHeader);
    if (!Number.isNaN(dateMs) && dateMs - Date.now() > 0) {
      return dateMs - Date.now();
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
    if (typeof retryAfterSeconds === 'number' && retryAfterSeconds >= 0) {
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
 * falling back to 1000ms.
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

  return (source$: Observable<T>) =>
    source$.pipe(
      retry({
        count: Math.max(maxAttempts - 1, 0),
        delay: (error: unknown) => {
          const delayMs = getK8sRetryDelayMs(error, fallbackDelayMs);
          return delayMs === null ? throwError(() => error) : timer(delayMs);
        },
      }),
    );
}
