import {HttpClient, provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {firstValueFrom, of, retry} from 'rxjs';
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

  const page = (token = '', count = 1): KubernetesList<KubernetesObject> => ({
    apiVersion: 'v1',
    kind: 'List',
    metadata: {continue: token},
    items: Array.from({length: count}, (_, index) => ({
      apiVersion: 'v1',
      kind: 'Pod',
      metadata: {name: String(index)},
    })),
  });

  it.each([
    ['a', 'a'],
    ['a', 'b', 'a'],
  ])('rejects repeated/cyclic tokens %j without partial output', async (...tokens) => {
    const next = vi.fn();
    const error = vi.fn();
    fetchPaginatedKubernetesResources(httpClient, '/items', {retryConfig: false}).subscribe({next, error});
    httpTestingController.expectOne('/items').flush(page(tokens[0]));
    for (let index = 1; index < tokens.length; index++) {
      httpTestingController.expectOne(`/items?continue=${tokens[index - 1]}`).flush(page(tokens[index]));
    }
    expect(error).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({message: expect.stringContaining('repeated')}),
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('detects a server returning the initial request cursor again', () => {
    const error = vi.fn();
    fetchPaginatedKubernetesResources(httpClient, '/items', {initialParams: {continue: 'seed'}}).subscribe({error});
    httpTestingController.expectOne('/items?continue=seed').flush(page('seed'));
    expect(error).toHaveBeenCalledWith(expect.objectContaining({message: expect.stringContaining('repeated')}));
  });

  it.each([['seed'], [42], [true]])('normalizes initial cursor %j like HttpClient', (cursor) => {
    const error = vi.fn();
    fetchPaginatedKubernetesResources(httpClient, '/items', {initialParams: {continue: [cursor]}}).subscribe({error});
    httpTestingController.expectOne(`/items?continue=${cursor}`).flush(page(String(cursor)));
    expect(error).toHaveBeenCalledWith(expect.objectContaining({message: expect.stringContaining('repeated')}));
  });

  it.each([1, 2])('stops at maxPages=%s before issuing an extra request', (maxPages) => {
    const next = vi.fn(),
      error = vi.fn();
    fetchPaginatedKubernetesResources(httpClient, '/items', {bounds: {maxPages}}).subscribe({next, error});
    httpTestingController.expectOne('/items').flush(page('a'));
    if (maxPages === 2) httpTestingController.expectOne('/items?continue=a').flush(page('b'));
    expect(error).toHaveBeenCalledWith(expect.objectContaining({message: expect.stringContaining('maxPages')}));
    expect(next).not.toHaveBeenCalled();
  });

  it.each([1, 2])('rejects maxItems overflow on page %s without partial output', (overflowPage) => {
    const next = vi.fn(),
      error = vi.fn();
    fetchPaginatedKubernetesResources(httpClient, '/items', {bounds: {maxItems: 1}}).subscribe({next, error});
    httpTestingController.expectOne('/items').flush(page(overflowPage === 1 ? '' : 'a', overflowPage === 1 ? 2 : 1));
    if (overflowPage === 2) httpTestingController.expectOne('/items?continue=a').flush(page());
    expect(error).toHaveBeenCalledWith(expect.objectContaining({message: expect.stringContaining('maxItems')}));
    expect(next).not.toHaveBeenCalled();
  });

  it('allows exact limits, including a final empty page', async () => {
    const result = firstValueFrom(
      fetchPaginatedKubernetesResources(httpClient, '/items', {bounds: {maxPages: 2, maxItems: 1}}),
    );
    httpTestingController.expectOne('/items').flush(page('a'));
    httpTestingController.expectOne('/items?continue=a').flush(page('', 0));
    expect((await result).items).toHaveLength(1);
  });

  it.each([0, -1, 1.5, Infinity, NaN, Number.MAX_SAFE_INTEGER + 1])('rejects invalid aggregate limit %s', (limit) => {
    for (const name of ['maxPages', 'maxItems']) {
      expect(() => fetchPaginatedKubernetesResources(httpClient, '/items', {bounds: {[name]: limit}})).toThrow(
        RangeError,
      );
    }
    httpTestingController.expectNone('/items');
  });

  it('resets counters and cursor history for each subscriber and whole-aggregate retry', () => {
    const shared = fetchPaginatedKubernetesResources(httpClient, '/items', {
      bounds: {maxPages: 2, maxItems: 2},
      retryConfig: false,
    });
    for (let index = 0; index < 2; index++) {
      const next = vi.fn(),
        error = vi.fn();
      shared.pipe(retry(1)).subscribe({next, error});
      httpTestingController.expectOne('/items').flush(page('a'));
      httpTestingController.expectOne('/items?continue=a').flush('failure', {status: 500, statusText: 'Server Error'});
      httpTestingController.expectOne('/items').flush(page('a'));
      httpTestingController.expectOne('/items?continue=a').flush(page());
      expect(error).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({items: expect.any(Array)}));
      expect(next.mock.calls[0][0].items).toHaveLength(2);
    }
  });

  it('cancels an in-flight continuation without emitting a partial aggregate', () => {
    const next = vi.fn(),
      error = vi.fn();
    const subscription = fetchPaginatedKubernetesResources(httpClient, '/items', {bounds: {maxPages: 2}}).subscribe({
      next,
      error,
    });
    httpTestingController.expectOne('/items').flush(page('a'));
    const continuation = httpTestingController.expectOne('/items?continue=a');
    subscription.unsubscribe();
    expect(continuation.cancelled).toBe(true);
    expect(next).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
  });

  it('keeps simultaneous subscriptions independent', () => {
    const source = of(page('a'));
    const operator = aggregatePaginatedKubernetesResources(httpClient, '/items', {bounds: {maxPages: 2, maxItems: 2}});
    const first = vi.fn(),
      second = vi.fn();
    source.pipe(operator).subscribe(first);
    source.pipe(operator).subscribe(second);
    const requests = httpTestingController.match('/items?continue=a');
    expect(requests).toHaveLength(2);
    requests[1].flush(page());
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
    requests[0].flush(page());
    expect(first).toHaveBeenCalledTimes(1);
    expect(first.mock.calls[0][0].items).toHaveLength(2);
    expect(second.mock.calls[0][0].items).toHaveLength(2);
  });

  it('preserves legacy HTTP parameters named bounds, maxPages and maxItems', async () => {
    const result = firstValueFrom(
      fetchPaginatedKubernetesResources(httpClient, '/items', {bounds: 'server', maxPages: 3, maxItems: 7}),
    );
    httpTestingController.expectOne('/items?bounds=server&maxPages=3&maxItems=7').flush(page());
    expect((await result).items).toHaveLength(1);
  });

  it('preserves a legacy boolean retryConfig parameter alongside other HTTP params', async () => {
    const result = firstValueFrom(
      fetchPaginatedKubernetesResources(httpClient, '/items', {retryConfig: false, limit: 50}),
    );
    const request = httpTestingController.expectOne('/items?retryConfig=false&limit=50');
    request.flush({apiVersion: 'v1', kind: 'List', metadata: {continue: ''}, items: []});
    expect((await result).items).toEqual([]);
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
    vi.spyOn(Math, 'random').mockReturnValue(0);
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
      vi.restoreAllMocks();
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

  it.each(['initialParams', 'retryConfig'])(
    'preserves a legacy HTTP parameter named %s on every page',
    async (name) => {
      const result = firstValueFrom(
        fetchPaginatedKubernetesResources(httpClient, '/items', {[name]: 'server-value', limit: 50}),
      );
      const initial = httpTestingController.expectOne(
        (request) => request.url === '/items' && !request.params.has('continue'),
      );
      expect(initial.request.params.get(name)).toBe('server-value');
      expect(initial.request.params.get('limit')).toBe('50');
      initial.flush({apiVersion: 'v1', kind: 'List', metadata: {continue: 'next'}, items: []});
      const next = httpTestingController.expectOne((request) => request.params.get('continue') === 'next');
      expect(next.request.params.get(name)).toBe('server-value');
      expect(next.request.params.get('limit')).toBe('50');
      next.flush({apiVersion: 'v1', kind: 'List', metadata: {continue: ''}, items: []});
      expect((await result).items).toEqual([]);
    },
  );

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
    vi.spyOn(Math, 'random').mockReturnValue(0);
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
      vi.restoreAllMocks();
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
