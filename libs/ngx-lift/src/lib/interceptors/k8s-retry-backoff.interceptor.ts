import {HttpContextToken, HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';

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

/**
 * Functional HTTP interceptor that automatically retries Kubernetes HTTP 429 responses
 * with backoff (respecting `Retry-After` header and `details.retryAfterSeconds`).
 *
 * Register globally via Angular's `provideHttpClient(withInterceptors([k8sRetryBackoffInterceptor]))`.
 *
 * @example
 * ```typescript
 * // In app.config.ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideHttpClient(withInterceptors([k8sRetryBackoffInterceptor])),
 *   ],
 * };
 * ```
 */
export const k8sRetryBackoffInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const contextConfig = req.context.get(K8S_RETRY_BACKOFF_CONFIG);
  if (contextConfig === false) {
    return next(req);
  }

  return next(req).pipe(retryOnK8sBackoff(contextConfig ?? undefined));
};

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
  return (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const contextConfig = req.context.get(K8S_RETRY_BACKOFF_CONFIG);
    if (contextConfig === false) {
      return next(req);
    }

    const effectiveConfig = contextConfig !== null ? {...defaultConfig, ...contextConfig} : defaultConfig;
    return next(req).pipe(retryOnK8sBackoff(effectiveConfig));
  };
}
