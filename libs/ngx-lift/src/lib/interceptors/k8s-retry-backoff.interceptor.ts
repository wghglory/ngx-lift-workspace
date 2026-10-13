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

/**
 * Retry Kubernetes 429 responses for idempotent methods. Register before authentication interceptors
 * so every attempt rebuilds the downstream chain. POST/PATCH require an explicit method allowlist
 * and an endpoint idempotency guarantee; retrying writes can otherwise duplicate side effects.
 */
export const k8sRetryBackoffInterceptor: HttpInterceptorFn = (req, next) =>
  interceptWithBackoff(req, next, inject(K8S_RETRY_BACKOFF_DEFAULTS));

function interceptWithBackoff(req: HttpRequest<unknown>, next: HttpHandlerFn, defaults?: K8sBackoffRetryConfig) {
  const override = req.context.get(K8S_RETRY_BACKOFF_CONFIG);
  if (override === false) return next(req);
  const config = {...defaults, ...override};
  const methods = config.retryMethods ?? ['GET', 'HEAD', 'OPTIONS', 'PUT', 'DELETE'];
  if (!methods.some((method) => method.toUpperCase() === req.method.toUpperCase())) return next(req);
  return defer(() => next(req)).pipe(retryOnK8sBackoff(config));
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
