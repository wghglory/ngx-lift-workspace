/*
 * ******************************************************************
 * Copyright (c) 2024 Broadcom. All Rights Reserved.
 * Broadcom Confidential. The term "Broadcom" refers to Broadcom Inc.
 * and/or its subsidiaries.
 * ******************************************************************
 */

import {HttpClient} from '@angular/common/http';
import {EMPTY, expand, Observable, OperatorFunction, reduce} from 'rxjs';

import {KubernetesList, KubernetesObject} from '../models';

/**
 * Creates an RxJS operator that fetches paginated Kubernetes resources by continually making requests
 * until all pages have been retrieved, and aggregates the items from all pages into a single KubernetesList.
 *
 * This operator uses Kubernetes' pagination mechanism with the `continue` token. It:
 * - Starts with the initial request
 * - Checks for a `continue` token in the response metadata
 * - Makes subsequent requests with the `continue` token until no more pages exist
 * - Aggregates all items from all pages into a single KubernetesList
 *
 * @template T - The type of Kubernetes objects in the list. Must extend `KubernetesObject`.
 * @param http - The HttpClient instance used to make the HTTP requests.
 * @param endpoint - The API endpoint to fetch the resources from.
 * @param initialParams - Optional initial parameters to include in the request.
 *   Can include query parameters like filters and pagination settings.
 *   Note: `limit` and `continue` are Kubernetes-specific pagination parameters.
 * @returns An RxJS operator function that transforms a source Observable into an Observable
 *   that emits a single KubernetesList containing all aggregated items from all pages.
 *
 * @example
 * ```typescript
 * // Use as an operator
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
  initialParams: Record<string, string | number | boolean | (string | number | boolean)[]> = {},
): OperatorFunction<KubernetesList<T>, KubernetesList<T>> {
  return (source$: Observable<KubernetesList<T>>) => {
    return source$.pipe(
      expand((response) => {
        const {metadata} = response;
        const {continue: continueToken} = metadata;
        if (continueToken) {
          const params = {...initialParams, continue: continueToken};
          return http.get<KubernetesList<T>>(endpoint, {params});
        }
        return EMPTY; // No more pages
      }),
      reduce((acc, current) => {
        const {items: currentPageItems} = current;
        if (currentPageItems) {
          acc.items = acc.items.concat(currentPageItems);
        }
        return acc;
      }),
    );
  };
}

/**
 * Fetches paginated Kubernetes resources by continually making requests until all pages have been retrieved.
 *
 * This function is a convenience wrapper that combines the initial HTTP request with pagination handling.
 * It automatically handles Kubernetes pagination using the `continue` token mechanism.
 *
 * Unlike `aggregatePaginatedKubernetesResources`, this function makes the initial request itself
 * rather than being used as an operator on an existing Observable.
 *
 * @template T - The type of Kubernetes objects in the list. Must extend `KubernetesObject`.
 * @param http - The HttpClient instance used to make the HTTP requests.
 * @param endpoint - The API endpoint to fetch the resources from.
 * @param initialParams - Optional initial parameters to include in the request.
 *   Can include query parameters like filters and pagination settings.
 *   Note: `limit` and `continue` are Kubernetes-specific pagination parameters.
 * @returns An Observable that emits a single KubernetesList containing all aggregated items from all pages.
 *
 * @example
 * ```typescript
 * // Fetch all pods across all pages
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
  initialParams: Record<string, string | number | boolean | (string | number | boolean)[]> = {},
) {
  const initialRequest$ = http.get<KubernetesList<T>>(endpoint, {params: initialParams});

  return initialRequest$.pipe(
    expand((response) => {
      const {metadata} = response;
      const {continue: continueToken} = metadata;
      if (continueToken) {
        const params = {...initialParams, continue: continueToken};
        return http.get<KubernetesList<T>>(endpoint, {params});
      }
      return EMPTY; // No more pages
    }),
    reduce((acc, current) => {
      const {items: currentPageItems} = current;
      if (currentPageItems) {
        acc.items = acc.items.concat(currentPageItems);
      }
      return acc;
    }),
  );
}
