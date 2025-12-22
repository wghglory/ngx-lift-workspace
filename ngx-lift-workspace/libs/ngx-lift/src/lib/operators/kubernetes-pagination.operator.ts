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
 * Fetches paginated Kubernetes resources by continually making requests
 * until all pages have been retrieved, and aggregates the items from all pages
 * into a single KubernetesList.
 *
 * @template T The type of the items contained within the KubernetesList.
 * @param http The HttpClient instance used to make the HTTP requests.
 * @param endpoint The API endpoint to fetch the resources from.
 * @param initialParams Optional initial parameters to include in the request.
 *                      Can include query parameters like filters and pagination settings.
 * `limit` and `continue` parameters are parameters for kubernetes
 * @returns An observable that emits a single KubernetesList containing all items from all pages.
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
 * Fetches paginated Kubernetes resources by continually making requests
 * until all pages have been retrieved.
 *
 * @template T The type of the items contained within the KubernetesList.
 * @param http The HttpClient instance used to make the HTTP requests.
 * @param endpoint The API endpoint to fetch the resources from.
 * @param initialParams Optional initial parameters to include in the request.
 *                      Can include query parameters like filters and pagination settings.
 * `limit` and `continue` parameters are parameters for kubernetes
 * @returns An observable that emits a single KubernetesList containing all items from all pages.
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
