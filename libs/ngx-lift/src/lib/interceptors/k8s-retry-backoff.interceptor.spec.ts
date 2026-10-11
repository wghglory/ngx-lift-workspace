import {HttpClient, HttpContext, provideHttpClient, withInterceptors} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {
  createK8sRetryBackoffInterceptor,
  K8S_RETRY_BACKOFF_CONFIG,
  k8sRetryBackoffInterceptor,
} from './k8s-retry-backoff.interceptor';

describe('k8sRetryBackoffInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    vi.useFakeTimers();

    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([k8sRetryBackoffInterceptor])), provideHttpClientTesting()],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    vi.useRealTimers();
  });

  it('passes successful requests through unchanged', () => {
    let result: unknown;
    httpClient.get('/api/v1/pods').subscribe((data) => {
      result = data;
    });

    const req = httpTestingController.expectOne('/api/v1/pods');
    req.flush({items: []});

    expect(result).toEqual({items: []});
  });

  it('retries when receiving a 429 response and succeeds on retry', async () => {
    let result: unknown;
    httpClient.get('/api/v1/pods').subscribe((data) => {
      result = data;
    });

    // Attempt 1: 429
    const req1 = httpTestingController.expectOne('/api/v1/pods');
    req1.flush({details: {retryAfterSeconds: 1}}, {status: 429, statusText: 'Too Many Requests'});

    expect(result).toBeUndefined();

    // Advance timer by 1s
    await vi.advanceTimersByTimeAsync(1000);

    // Attempt 2: 200 OK
    const req2 = httpTestingController.expectOne('/api/v1/pods');
    req2.flush({items: [{name: 'pod-1'}]});

    expect(result).toEqual({items: [{name: 'pod-1'}]});
  });

  it('does not retry when receiving a non-429 error (e.g. 500)', () => {
    let caughtError: unknown;
    httpClient.get('/api/v1/pods').subscribe({
      error: (err) => {
        caughtError = err;
      },
    });

    const req = httpTestingController.expectOne('/api/v1/pods');
    req.flush('Internal Server Error', {status: 500, statusText: 'Server Error'});

    expect(caughtError).toBeDefined();
    // No second request is expected
    httpTestingController.expectNone('/api/v1/pods');
  });

  it('skips retries when K8S_RETRY_BACKOFF_CONFIG is set to false in HttpContext', () => {
    let caughtError: unknown;
    httpClient
      .get('/api/v1/pods', {
        context: new HttpContext().set(K8S_RETRY_BACKOFF_CONFIG, false),
      })
      .subscribe({
        error: (err) => {
          caughtError = err;
        },
      });

    const req = httpTestingController.expectOne('/api/v1/pods');
    req.flush({details: {retryAfterSeconds: 1}}, {status: 429, statusText: 'Too Many Requests'});

    expect(caughtError).toBeDefined();
    // No second request should be made
    httpTestingController.expectNone('/api/v1/pods');
  });

  it('respects per-request custom configuration from HttpContext', async () => {
    let caughtError: unknown;
    httpClient
      .get('/api/v1/pods', {
        context: new HttpContext().set(K8S_RETRY_BACKOFF_CONFIG, {
          maxAttempts: 2,
          fallbackDelayMs: 500,
        }),
      })
      .subscribe({
        error: (err) => {
          caughtError = err;
        },
      });

    // Attempt 1: 429
    const req1 = httpTestingController.expectOne('/api/v1/pods');
    req1.flush('429', {status: 429, statusText: 'Too Many Requests'});

    await vi.advanceTimersByTimeAsync(500);

    // Attempt 2: 429
    const req2 = httpTestingController.expectOne('/api/v1/pods');
    req2.flush('429', {status: 429, statusText: 'Too Many Requests'});

    // Since maxAttempts is 2, it should now fail without making a 3rd request
    expect(caughtError).toBeDefined();
    httpTestingController.expectNone('/api/v1/pods');
  });
});

describe('createK8sRetryBackoffInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    vi.useFakeTimers();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(
          withInterceptors([
            createK8sRetryBackoffInterceptor({
              maxAttempts: 2,
              fallbackDelayMs: 200,
            }),
          ]),
        ),
        provideHttpClientTesting(),
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    vi.useRealTimers();
  });

  it('applies default configuration specified when creating the interceptor', async () => {
    let caughtError: unknown;
    httpClient.get('/api/v1/services').subscribe({
      error: (err) => {
        caughtError = err;
      },
    });

    const req1 = httpTestingController.expectOne('/api/v1/services');
    req1.flush('429', {status: 429, statusText: 'Too Many Requests'});

    await vi.advanceTimersByTimeAsync(200);

    const req2 = httpTestingController.expectOne('/api/v1/services');
    req2.flush('429', {status: 429, statusText: 'Too Many Requests'});

    expect(caughtError).toBeDefined();
    httpTestingController.expectNone('/api/v1/services');
  });
});
