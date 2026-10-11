import {HttpClient, provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {firstValueFrom, of} from 'rxjs';
import {afterEach, beforeEach, describe, expect, expectTypeOf, it, vi} from 'vitest';

import {KubernetesList, KubernetesObject} from '../models';
import {
  aggregatePaginatedKubernetesResources,
  fetchPaginatedKubernetesResources,
  KubernetesListResponse,
} from './kubernetes-pagination.operator';

describe('aggregatePaginatedKubernetesResources', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should aggregate paginated Kubernetes resources correctly', () => {
    const endpoint = '/test-endpoint';
    const initialParams = {};
    const mockResponse1: KubernetesList<KubernetesObject> = {
      apiVersion: 'v1',
      kind: 'List',
      metadata: {continue: 'token1', resourceVersion: '1'},
      items: [
        {apiVersion: 'v1', kind: 'List', metadata: {name: 'Item 1'}},
        {apiVersion: 'v1', kind: 'List', metadata: {name: 'Item 2'}},
      ],
    };
    const mockResponse2: KubernetesList<KubernetesObject> = {
      apiVersion: 'v1',
      kind: 'List',
      metadata: {continue: '', resourceVersion: '1'},
      items: [
        {apiVersion: 'v1', kind: 'List', metadata: {name: 'Item 3'}},
        {apiVersion: 'v1', kind: 'List', metadata: {name: 'Item 4'}},
      ],
    };

    const source$ = of(mockResponse1);

    const result$ = source$.pipe(aggregatePaginatedKubernetesResources(httpClient, endpoint, initialParams));

    result$.subscribe((aggregatedList) => {
      expect(aggregatedList.items.length).toBe(4);
    });

    const req1 = httpTestingController.expectOne(`${endpoint}?continue=token1`);
    expect(req1.request.method).toBe('GET');
    req1.flush(mockResponse2);
  });

  it('should not call API if no more pages', async () => {
    const endpoint = '/test-endpoint';
    const initialParams = {};
    const mockResponse: KubernetesList<KubernetesObject> = {
      apiVersion: 'v1',
      kind: 'List',
      metadata: {continue: '', resourceVersion: '1'},
      items: [
        {apiVersion: 'v1', kind: 'List', metadata: {name: 'Item 1'}},
        {apiVersion: 'v1', kind: 'List', metadata: {name: 'Item 2'}},
      ],
    };

    const source$ = of(mockResponse);

    const result$ = source$.pipe(aggregatePaginatedKubernetesResources(httpClient, endpoint, initialParams));

    const aggregatedList = await firstValueFrom(result$);
    expect(aggregatedList.items.length).toBe(2);

    httpTestingController.expectNone(endpoint);
  });

  it('does not mutate the first page and clears the final continuation metadata', () => {
    const first: KubernetesList<KubernetesObject> = {
      apiVersion: 'v1',
      kind: 'List',
      metadata: {continue: 'next', resourceVersion: '1'},
      items: [{apiVersion: 'v1', kind: 'Pod', metadata: {name: 'first'}}],
    };
    const source$ = of(first).pipe(aggregatePaginatedKubernetesResources(httpClient, '/items'));
    let result: KubernetesList<KubernetesObject> | undefined;
    source$.subscribe((value) => {
      result = value;
    });
    httpTestingController.expectOne('/items?continue=next').flush({
      ...first,
      metadata: {continue: '', resourceVersion: '1'},
      items: [{apiVersion: 'v1', kind: 'Pod', metadata: {name: 'second'}}],
    });

    expect(first.items).toHaveLength(1);
    expect(first.metadata.continue).toBe('next');
    expect(result?.items).toHaveLength(2);
    expect(result?.metadata.continue).toBe('');
  });

  it.each([undefined, null])('normalizes a single page with items=%s', async (items) => {
    const response: KubernetesListResponse<KubernetesObject> = {
      apiVersion: 'v1',
      kind: 'List',
      metadata: {continue: '', resourceVersion: '1'},
      items,
    };

    const result = await firstValueFrom(of(response).pipe(aggregatePaginatedKubernetesResources(httpClient, '/items')));

    expectTypeOf(result.items).toEqualTypeOf<KubernetesObject[]>();
    expect(result.items).toEqual([]);
    expect(result.metadata).toEqual(response.metadata);
    expect(response.items).toBe(items);
    httpTestingController.expectNone('/items');
  });

  it.each([undefined, null])('keeps later items when the first page has items=%s', async (items) => {
    const response: KubernetesListResponse<KubernetesObject> = {
      apiVersion: 'v1',
      kind: 'List',
      metadata: {continue: 'next', resourceVersion: '1'},
      items,
    };
    const laterItems: KubernetesObject[] = [{apiVersion: 'v1', kind: 'Pod', metadata: {name: 'later'}}];
    const result = firstValueFrom(
      of(response).pipe(aggregatePaginatedKubernetesResources(httpClient, '/items', {limit: 20})),
    );

    httpTestingController.expectOne('/items?limit=20&continue=next').flush({
      ...response,
      metadata: {continue: '', resourceVersion: '1'},
      items: laterItems,
    });

    expect((await result).items).toEqual(laterItems);
    expect(response.items).toBe(items);
  });

  it.each([undefined, null])('keeps earlier items when a later page has items=%s', async (items) => {
    const earlierItems: KubernetesObject[] = [{apiVersion: 'v1', kind: 'Pod', metadata: {name: 'earlier'}}];
    const response: KubernetesList<KubernetesObject> = {
      apiVersion: 'v1',
      kind: 'List',
      metadata: {continue: 'next', resourceVersion: '1'},
      items: earlierItems,
    };
    const result = firstValueFrom(of(response).pipe(aggregatePaginatedKubernetesResources(httpClient, '/items')));

    httpTestingController.expectOne('/items?continue=next').flush({
      ...response,
      metadata: {continue: '', resourceVersion: '1'},
      items,
    });

    const combined = await result;
    expect(combined.items).toEqual(earlierItems);
    expect(combined.metadata.continue).toBe('');
    expect(response.items).toBe(earlierItems);
  });

  it('retries next page request on HTTP 429 with backoff and aggregates items', async () => {
    vi.useFakeTimers();
    try {
      const first: KubernetesList<KubernetesObject> = {
        apiVersion: 'v1',
        kind: 'List',
        metadata: {continue: 'page-2', resourceVersion: '1'},
        items: [{apiVersion: 'v1', kind: 'Pod', metadata: {name: 'pod-1'}}],
      };

      let result: KubernetesList<KubernetesObject> | undefined;
      of(first)
        .pipe(aggregatePaginatedKubernetesResources(httpClient, '/items'))
        .subscribe((val) => {
          result = val;
        });

      // Page 2 initial attempt fails with 429
      const req1 = httpTestingController.expectOne('/items?continue=page-2');
      req1.flush({details: {retryAfterSeconds: 1}}, {status: 429, statusText: 'Too Many Requests'});

      expect(result).toBeUndefined();

      // Advance time for retry delay
      await vi.advanceTimersByTimeAsync(1000);

      // Page 2 retry succeeds
      const req2 = httpTestingController.expectOne('/items?continue=page-2');
      req2.flush({
        apiVersion: 'v1',
        kind: 'List',
        metadata: {continue: '', resourceVersion: '1'},
        items: [{apiVersion: 'v1', kind: 'Pod', metadata: {name: 'pod-2'}}],
      });

      expect(result?.items).toHaveLength(2);
      expect(result?.items[0].metadata.name).toBe('pod-1');
      expect(result?.items[1].metadata.name).toBe('pod-2');
    } finally {
      vi.useRealTimers();
    }
  });

  it('handles response without metadata property gracefully', () => {
    const rawResponse = {
      apiVersion: 'v1',
      kind: 'List',
      items: [{apiVersion: 'v1', kind: 'Pod', metadata: {name: 'pod-1'}}],
    } as unknown as KubernetesListResponse<KubernetesObject>;

    let result: KubernetesList<KubernetesObject> | undefined;
    of(rawResponse)
      .pipe(aggregatePaginatedKubernetesResources(httpClient, '/items'))
      .subscribe((val) => {
        result = val;
      });

    expect(result?.items).toHaveLength(1);
    expect(result?.items[0].metadata.name).toBe('pod-1');
  });
});

describe('fetchPaginatedKubernetesResources', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should fetch paginated Kubernetes resources correctly', () => {
    const endpoint = '/test-endpoint';
    const initialParams = {};
    const mockResponse1: KubernetesList<KubernetesObject> = {
      apiVersion: 'v1',
      kind: 'List',
      metadata: {continue: 'token1', resourceVersion: '1'},
      items: [
        {apiVersion: 'v1', kind: 'List', metadata: {name: 'Item 1'}},
        {apiVersion: 'v1', kind: 'List', metadata: {name: 'Item 2'}},
      ],
    };
    const mockResponse2: KubernetesList<KubernetesObject> = {
      apiVersion: 'v1',
      kind: 'List',
      metadata: {continue: '', resourceVersion: '1'},
      items: [
        {apiVersion: 'v1', kind: 'List', metadata: {name: 'Item 3'}},
        {apiVersion: 'v1', kind: 'List', metadata: {name: 'Item 4'}},
      ],
    };

    const result$ = fetchPaginatedKubernetesResources(httpClient, endpoint, initialParams);

    result$.subscribe((aggregatedList) => {
      expect(aggregatedList.items.length).toBe(4);
    });

    const req1 = httpTestingController.expectOne(endpoint);
    expect(req1.request.method).toBe('GET');
    req1.flush(mockResponse1);

    const req2 = httpTestingController.expectOne(`${endpoint}?continue=token1`);
    expect(req2.request.method).toBe('GET');
    req2.flush(mockResponse2);
  });

  it('should make the 1st API call if no more pages', () => {
    const endpoint = '/test-endpoint';
    const initialParams = {};
    const mockResponse: KubernetesList<KubernetesObject> = {
      apiVersion: 'v1',
      kind: 'List',
      metadata: {continue: '', resourceVersion: '1'},
      items: [
        {apiVersion: 'v1', kind: 'List', metadata: {name: 'Item 1'}},
        {apiVersion: 'v1', kind: 'List', metadata: {name: 'Item 2'}},
      ],
    };

    const result$ = fetchPaginatedKubernetesResources(httpClient, endpoint, initialParams);

    result$.subscribe((aggregatedList) => {
      expect(aggregatedList.items.length).toBe(2);
    });

    const req1 = httpTestingController.expectOne(endpoint);
    expect(req1.request.method).toBe('GET');
    req1.flush(mockResponse);
  });

  it('normalizes omitted items returned by the initial HTTP request', async () => {
    const result = firstValueFrom(fetchPaginatedKubernetesResources(httpClient, '/items'));
    httpTestingController.expectOne('/items').flush({
      apiVersion: 'v1',
      kind: 'List',
      metadata: {continue: '', resourceVersion: '1'},
    });

    expect((await result).items).toEqual([]);
  });

  it('retries initial request on HTTP 429 with backoff and succeeds', async () => {
    vi.useFakeTimers();
    try {
      let result: KubernetesList<KubernetesObject> | undefined;

      fetchPaginatedKubernetesResources(httpClient, '/items', {limit: 50}).subscribe((data) => {
        result = data;
      });

      // Attempt 1: 429
      const req1 = httpTestingController.expectOne('/items?limit=50');
      req1.flush({details: {retryAfterSeconds: 1}}, {status: 429, statusText: 'Too Many Requests'});

      expect(result).toBeUndefined();

      // Advance timer by 1s
      await vi.advanceTimersByTimeAsync(1000);

      // Attempt 2: 200 OK
      const req2 = httpTestingController.expectOne('/items?limit=50');
      req2.flush({
        apiVersion: 'v1',
        kind: 'List',
        metadata: {continue: '', resourceVersion: '1'},
        items: [{apiVersion: 'v1', kind: 'Pod', metadata: {name: 'recovered-pod'}}],
      });

      expect(result?.items).toHaveLength(1);
      expect(result?.items[0].metadata.name).toBe('recovered-pod');
    } finally {
      vi.useRealTimers();
    }
  });

  it('does not retry when retryConfig is false', () => {
    let caughtError: unknown;

    fetchPaginatedKubernetesResources(httpClient, '/items', {
      initialParams: {limit: 50},
      retryConfig: false,
    }).subscribe({
      error: (err) => {
        caughtError = err;
      },
    });

    const req = httpTestingController.expectOne('/items?limit=50');
    req.flush('Too Many Requests', {status: 429, statusText: 'Too Many Requests'});

    expect(caughtError).toBeDefined();
    httpTestingController.expectNone('/items?limit=50');
  });
});
