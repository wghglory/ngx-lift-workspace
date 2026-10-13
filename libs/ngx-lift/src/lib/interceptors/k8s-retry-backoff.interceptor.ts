import {HttpContextToken, HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {inject, InjectionToken, makeEnvironmentProviders} from '@angular/core';
import {defer} from 'rxjs';

import {K8sBackoffRetryConfig, retryOnK8sBackoff} from '../operators/k8s-retry-backoff.operator';

/**
 * HttpContext token to configure or disable Kubernetes 429 retry-backoff for an individual request.
 *
 * Pass a {@link K8sBackoffRetryConfig} to customize retry attempts or fallback delay,
 * or pass `false` to disable retry backoff completely for that specific request.
 *
 * @example
 * ```typescript
 * // Disable retry backoff for a specific request
 * this.http.get('/api/v1/pods', {
 *   context: new HttpContext().set(K8S_RETRY_BACKOFF_CONFIG, false)
 * });
 *
 * // Custom config for a specific request
 * this.http.get('/api/v1/pods', {
 *   context: new HttpContext().set(K8S_RETRY_BACKOFF_CONFIG, { maxAttempts: 3, fallbackDelayMs: 500 })
 * });
 * ```
 */
export const K8S_RETRY_BACKOFF_CONFIG = new HttpContextToken<K8sBackoffRetryConfig | false | null>(() => null);

/** Global defaults for Kubernetes retry. Override with provideK8sRetryBackoffConfig. */
export const K8S_RETRY_BACKOFF_DEFAULTS = new InjectionToken<K8sBackoffRetryConfig>('K8S_RETRY_BACKOFF_DEFAULTS', {
  providedIn: 'root',
  factory: () => ({}),
});

/** Configure application-wide defaults without replacing the interceptor. */
export function provideK8sRetryBackoffConfig(config: K8sBackoffRetryConfig) {
  return makeEnvironmentProviders([{provide: K8S_RETRY_BACKOFF_DEFAULTS, useValue: {...config}}]);
}

const DEFAULT_RETRY_METHODS = ['GET', 'HEAD', 'OPTIONS', 'PUT', 'DELETE'] as const;

/**
 * Functional HTTP interceptor that automatically retries Kubernetes HTTP 429 responses
 * with exponential backoff and jitter (respecting `Retry-After` header and `details.retryAfterSeconds`).
 *
 * Register before authentication interceptors in `withInterceptors([...])` so that each retry attempt
 * rebuilds the downstream chain with fresh headers and tokens.
 *
 * POST/PATCH require an explicit method allowlist and an endpoint idempotency guarantee.
 * A Kubernetes Status body alone does not prove a write was rejected before execution.
 *
 * Generated log labels omit query strings and fragments. Custom labels and logger error data
 * remain the caller's responsibility to redact.
 */
export const k8sRetryBackoffInterceptor: HttpInterceptorFn = (req, next) =>
  interceptWithBackoff(req, next, inject(K8S_RETRY_BACKOFF_DEFAULTS));

function interceptWithBackoff(req: HttpRequest<unknown>, next: HttpHandlerFn, defaults?: K8sBackoffRetryConfig) {
  const override = req.context.get(K8S_RETRY_BACKOFF_CONFIG);
  if (override === false) return next(req);
  const config = {...defaults, ...override};
  const method = req.method.toUpperCase();
  const methods = config.retryMethods ?? DEFAULT_RETRY_METHODS;
  if (!methods.some((m) => m.toUpperCase() === method)) return next(req);

  // Path only: query strings may carry tokens, pre-signed parameters, or user identifiers.
  const label = config.label ?? `${method} ${req.url.split(/[?#]/)[0]}`;

  return defer(() => next(req)).pipe(
    retryOnK8sBackoff({
      ...config,
      label,
    }),
  );
}

/**
 * Factory function to create a configured `HttpInterceptorFn` with custom default backoff settings.
 *
 * @param defaultConfig - Default {@link K8sBackoffRetryConfig} applied to requests unless overridden via {@link K8S_RETRY_BACKOFF_CONFIG}.
 * @returns An HttpInterceptorFn with the specified default settings.
 *
 * @example
 * ```typescript
 * // In app.config.ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideHttpClient(
 *       withInterceptors([
 *         createK8sRetryBackoffInterceptor({ maxAttempts: 3, fallbackDelayMs: 2000 })
 *       ])
 *     ),
 *   ],
 * };
 * ```
 */
export function createK8sRetryBackoffInterceptor(defaultConfig?: K8sBackoffRetryConfig): HttpInterceptorFn {
  return (req, next) => interceptWithBackoff(req, next, defaultConfig);
}
