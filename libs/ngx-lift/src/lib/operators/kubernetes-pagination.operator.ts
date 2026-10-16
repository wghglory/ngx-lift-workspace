import {HttpClient} from '@angular/common/http';
import {defer, EMPTY, expand, map, Observable, OperatorFunction, reduce} from 'rxjs';

import {KubernetesList, KubernetesObject} from '../models';
import {K8sBackoffRetryConfig, retryOnK8sBackoff} from './k8s-retry-backoff.operator';

/**
 * List response accepted at the HTTP boundary. Custom endpoints may omit `items`
 * or return null for an empty list; pagination normalizes both to an array.
 */
export type KubernetesListResponse<T extends KubernetesObject> = Omit<KubernetesList<T>, 'items'> & {
  items?: T[] | null;
};

/**
 * Options for configuring Kubernetes pagination requests and HTTP 429 retry backoff.
 */
export interface KubernetesPaginationOptions {
  /**
   * Optional initial parameters to include in the request (e.g. `limit`, `labelSelector`, `fieldSelector`).
   */
  initialParams?: Record<string, string | number | boolean | (string | number | boolean)[]>;

  /**
   * Configuration for HTTP 429 retry-with-backoff for each page request.
   * Set to `false` to disable automatic retry backoff.
   * Defaults to undefined (enabled with standard Kubernetes backoff settings).
   */
  retryConfig?: K8sBackoffRetryConfig | false;

  /** Optional aggregate limits, including the initial page. Positive safe integers; omitted means unbounded.
   * Exceeding a limit fails the entire aggregate, never returns a truncated successful list.
   * @example {bounds: {maxPages: 100, maxItems: 10000}}
   */
  bounds?: {maxPages?: number; maxItems?: number};
}

function parsePaginationOptions(
  options: Record<string, string | number | boolean | (string | number | boolean)[]> | KubernetesPaginationOptions,
): {
  initialParams: Record<string, string | number | boolean | (string | number | boolean)[]>;
  retryConfig?: K8sBackoffRetryConfig | false;
  bounds?: KubernetesPaginationOptions['bounds'];
} {
  // Legacy HTTP parameter names may coincide with option names; discriminate by value shape.
  const isOptionsObject = (value: unknown): boolean =>
    value === undefined || (value !== null && typeof value === 'object' && !Array.isArray(value));
  if (
    ('initialParams' in options && isOptionsObject(options.initialParams)) ||
    ('bounds' in options && isOptionsObject(options.bounds)) ||
    ('retryConfig' in options &&
      Object.keys(options).every((key) => key === 'retryConfig') &&
      (options.retryConfig === false || isOptionsObject(options.retryConfig)))
  ) {
    const paginationOptions = options as KubernetesPaginationOptions;
    return {
      initialParams: paginationOptions.initialParams ?? {},
      retryConfig: paginationOptions.retryConfig,
      bounds: paginationOptions.bounds,
    };
  }
  return {
    initialParams: options as Record<string, string | number | boolean | (string | number | boolean)[]>,
  };
}

/**
 * Creates an RxJS operator that fetches paginated Kubernetes resources by continually making requests
 * until all pages have been retrieved, and aggregates the items from all pages into a single KubernetesList.
 *
 * This operator uses Kubernetes' pagination mechanism with the `continue` token. It:
 * - Starts with the initial request
 * - Automatically retries on HTTP 429 (e.g. watch cache reinitializing) with backoff on each page
 * - Checks for a `continue` token in the response metadata
 * - Makes subsequent requests with the `continue` token until no more pages exist
 * - Normalizes missing/null `items` on every page, including a single-page response
 * - Rejects repeated/cyclic continue tokens and configured aggregate bounds
 * - Aggregates all items from all pages into a single KubernetesList
 *
 * @template T - The type of Kubernetes objects in the list. Must extend `KubernetesObject`.
 * @param http - The HttpClient instance used to make the HTTP requests.
 * @param endpoint - The API endpoint to fetch the resources from.
 * @param initialParamsOrOptions - Optional initial parameters or pagination options including retry configuration.
 * @returns An RxJS operator function that transforms a source Observable into an Observable
 *   that emits a single KubernetesList containing all aggregated items from all pages.
 *
 * @example
 * ```typescript
 * // Use as an operator with default retry-backoff
 * this.http.get<KubernetesList<Pod>>('/api/v1/pods')
 *   .pipe(
 *     aggregatePaginatedKubernetesResources(this.http, '/api/v1/pods', { limit: 100 })
 *   )
 *   .subscribe(list => {
 *     console.log(`Total pods: ${list.items.length}`);
 *   });
 * ```
 */
export function aggregatePaginatedKubernetesResources<T extends KubernetesObject>(
  http: HttpClient,
  endpoint: string,
  initialParamsOrOptions:
    Record<string, string | number | boolean | (string | number | boolean)[]> | KubernetesPaginationOptions = {},
): OperatorFunction<KubernetesListResponse<T>, KubernetesList<T>> {
  const {initialParams, retryConfig, bounds} = parsePaginationOptions(initialParamsOrOptions);
  for (const [name, value] of Object.entries(bounds ?? {})) {
    if (value !== undefined && (!Number.isSafeInteger(value) || value <= 0)) {
      throw new RangeError(`Kubernetes pagination ${name} must be a positive safe integer`);
    }
  }

  return (source$: Observable<KubernetesListResponse<T>>) => {
    const retriedSource$ = retryConfig === false ? source$ : source$.pipe(retryOnK8sBackoff(retryConfig));

    return defer(() => {
      let pageCount = 0;
      let itemCount = 0;
      const seenTokens = new Set<string>();
      if (typeof initialParams['continue'] === 'string' && initialParams['continue']) {
        seenTokens.add(initialParams['continue']);
      }
      return retriedSource$.pipe(
        expand((response) => {
          pageCount++;
          itemCount += response.items?.length ?? 0;
          if (bounds?.maxPages !== undefined && pageCount > bounds.maxPages) {
            throw new Error('Kubernetes pagination exceeded maxPages');
          }
          if (bounds?.maxItems !== undefined && itemCount > bounds.maxItems) {
            throw new Error('Kubernetes pagination exceeded maxItems');
          }
          const token = response.metadata?.continue;
          if (token) {
            if (seenTokens.has(token)) throw new Error('Kubernetes pagination repeated a continue token');
            if (bounds?.maxPages !== undefined && pageCount >= bounds.maxPages) {
              throw new Error('Kubernetes pagination exceeded maxPages');
            }
            seenTokens.add(token);
          }
          if (token) {
            const params = {...initialParams, continue: token};
            const page$ = http.get<KubernetesListResponse<T>>(endpoint, {params});
            return retryConfig === false ? page$ : page$.pipe(retryOnK8sBackoff(retryConfig));
          }
          return EMPTY; // No more pages
        }),
        map((response): KubernetesList<T> => ({...response, items: [...(response.items ?? [])]})),
        reduce((acc, current) => ({
          ...acc,
          metadata: current.metadata,
          items: [...acc.items, ...current.items],
        })),
      );
    });
  };
}

/**
 * Fetches paginated Kubernetes resources by continually making requests until all pages have been retrieved.
 *
 * This function is a convenience wrapper that combines the initial HTTP request with pagination handling.
 * It automatically handles Kubernetes pagination using the `continue` token mechanism and automatically retries
 * on HTTP 429 ("storage is (re)initializing") responses with backoff.
 *
 * Unlike `aggregatePaginatedKubernetesResources`, this function makes the initial request itself
 * rather than being used as an operator on an existing Observable.
 *
 * @template T - The type of Kubernetes objects in the list. Must extend `KubernetesObject`.
 * @param http - The HttpClient instance used to make the HTTP requests.
 * @param endpoint - The API endpoint to fetch the resources from.
 * @param initialParamsOrOptions - Optional initial parameters or pagination options including retry configuration.
 * @returns An Observable that emits a single KubernetesList containing all aggregated items from all pages.
 *
 * @example
 * ```typescript
 * // Fetch all pods across all pages with automatic 429 retry backoff
 * fetchPaginatedKubernetesResources<Pod>(
 *   this.http,
 *   '/api/v1/pods',
 *   { limit: 100 }
 * ).subscribe(list => {
 *   console.log(`Total pods: ${list.items.length}`);
 * });
 * ```
 */
export function fetchPaginatedKubernetesResources<T extends KubernetesObject>(
  http: HttpClient,
  endpoint: string,
  initialParamsOrOptions:
    Record<string, string | number | boolean | (string | number | boolean)[]> | KubernetesPaginationOptions = {},
): Observable<KubernetesList<T>> {
  const {initialParams, retryConfig, bounds} = parsePaginationOptions(initialParamsOrOptions);
  const initialRequest$ = http.get<KubernetesListResponse<T>>(endpoint, {params: initialParams});

  return initialRequest$.pipe(
    aggregatePaginatedKubernetesResources(http, endpoint, {
      initialParams,
      retryConfig,
      bounds,
    }),
  );
}
