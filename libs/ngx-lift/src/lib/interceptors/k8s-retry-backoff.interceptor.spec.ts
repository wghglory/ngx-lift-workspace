import {HttpClient, HttpContext, provideHttpClient, withInterceptors} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {
  createK8sRetryBackoffInterceptor,
  K8S_RETRY_BACKOFF_CONFIG,
  k8sRetryBackoffInterceptor,
  provideK8sRetryBackoffConfig,
} from './k8s-retry-backoff.interceptor';
import {isK8sStatusThrottled, K8sRetryLogContext} from '../operators/k8s-retry-backoff.operator';

describe('k8sRetryBackoffInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0);

    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([k8sRetryBackoffInterceptor])), provideHttpClientTesting()],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    vi.restoreAllMocks();
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
    vi.spyOn(Math, 'random').mockReturnValue(0);

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
    vi.restoreAllMocks();
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

describe('retry method and interceptor lifecycle contracts', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
    vi.useRealTimers();
  });

  it.each(['POST', 'PATCH'])('does not retry %s without an explicit idempotency opt-in', (method) => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([k8sRetryBackoffInterceptor])), provideHttpClientTesting()],
    });
    const error = vi.fn();
    TestBed.inject(HttpClient).request(method, '/write').subscribe({error});
    TestBed.inject(HttpTestingController).expectOne('/write').flush({}, {status: 429, statusText: 'throttled'});
    expect(error).toHaveBeenCalledOnce();
    expect(vi.getTimerCount()).toBe(0);
  });

  it.each(['POST', 'PATCH'])('does not infer %s idempotency from a Kubernetes Status body', (method) => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([k8sRetryBackoffInterceptor])), provideHttpClientTesting()],
    });
    const caught = vi.fn();
    TestBed.inject(HttpClient).request(method, '/write').subscribe({error: caught});
    TestBed.inject(HttpTestingController)
      .expectOne('/write')
      .flush({kind: 'Status', reason: 'TooManyRequests'}, {status: 429, statusText: 'throttled'});
    expect(caught).toHaveBeenCalledOnce();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('rebuilds downstream authentication on every attempt and permits explicit POST opt-in', async () => {
    let token = 'first';
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(
          withInterceptors([
            k8sRetryBackoffInterceptor,
            (req, next) => next(req.clone({setHeaders: {Authorization: token}})),
          ]),
        ),
        provideHttpClientTesting(),
      ],
    });
    const result = vi.fn();
    TestBed.inject(HttpClient)
      .post(
        '/write',
        {},
        {context: new HttpContext().set(K8S_RETRY_BACKOFF_CONFIG, {retryMethods: ['POST'], hintJitterMs: 0})},
      )
      .subscribe(result);
    const controller = TestBed.inject(HttpTestingController);
    const first = controller.expectOne('/write');
    expect(first.request.headers.get('Authorization')).toBe('first');
    first.flush({}, {status: 429, statusText: 'throttled', headers: {'Retry-After': '1'}});
    token = 'fresh';
    await vi.advanceTimersByTimeAsync(1000);
    const second = controller.expectOne('/write');
    expect(second.request.headers.get('Authorization')).toBe('fresh');
    second.flush({ok: true});
    expect(result).toHaveBeenCalledWith({ok: true});
  });

  it.each(['POST', 'PATCH'])('retries %s on K8s Status with explicit method and predicate opt-in', async (method) => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([k8sRetryBackoffInterceptor])), provideHttpClientTesting()],
    });
    const result = vi.fn();
    TestBed.inject(HttpClient)
      .request(method, '/api/v1/pods', {
        body: {name: 'my-pod'},
        context: new HttpContext().set(K8S_RETRY_BACKOFF_CONFIG, {
          retryMethods: [method],
          isRetryable: isK8sStatusThrottled,
        }),
      })
      .subscribe(result);
    const controller = TestBed.inject(HttpTestingController);

    // K8s APF rejection before execution
    controller
      .expectOne('/api/v1/pods')
      .flush(
        {kind: 'Status', reason: 'TooManyRequests', details: {retryAfterSeconds: 1}},
        {status: 429, statusText: 'Too Many Requests'},
      );

    await vi.advanceTimersByTimeAsync(1250);

    const second = controller.expectOne('/api/v1/pods');
    expect(second.request.body).toEqual({name: 'my-pod'});
    second.flush({metadata: {name: 'my-pod'}}, {status: 201, statusText: 'Created'});

    expect(result).toHaveBeenCalledWith({metadata: {name: 'my-pod'}});
  });

  it('retries POST on serialized JSON string containing K8s Status TooManyRequests', async () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([k8sRetryBackoffInterceptor])), provideHttpClientTesting()],
    });
    const result = vi.fn();
    TestBed.inject(HttpClient)
      .post(
        '/api/v1/pods',
        {},
        {
          context: new HttpContext().set(K8S_RETRY_BACKOFF_CONFIG, {
            retryMethods: ['POST'],
            isRetryable: isK8sStatusThrottled,
          }),
        },
      )
      .subscribe(result);
    const controller = TestBed.inject(HttpTestingController);

    controller
      .expectOne('/api/v1/pods')
      .flush(JSON.stringify({kind: 'Status', reason: 'TooManyRequests', details: {retryAfterSeconds: 1}}), {
        status: 429,
        statusText: 'Too Many Requests',
      });

    await vi.advanceTimersByTimeAsync(1250);

    controller.expectOne('/api/v1/pods').flush({ok: true});
    expect(result).toHaveBeenCalledWith({ok: true});
  });

  it('sanitizes URL query parameters and fragments in logger labels to prevent secret leaks', async () => {
    const loggerSpy = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        provideK8sRetryBackoffConfig({logRetries: true, logger: loggerSpy, hintJitterMs: 0}),
        provideHttpClient(withInterceptors([k8sRetryBackoffInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    TestBed.inject(HttpClient).get('/api/v1/pods?token=super-secret-token#hash-fragment').subscribe();
    const controller = TestBed.inject(HttpTestingController);

    controller
      .expectOne('/api/v1/pods?token=super-secret-token#hash-fragment')
      .flush({}, {status: 429, statusText: 'throttled', headers: {'Retry-After': '1'}});

    expect(loggerSpy).toHaveBeenCalledOnce();
    const [msg, context] = loggerSpy.mock.calls[0] as [string, K8sRetryLogContext];
    expect(msg).toContain('GET /api/v1/pods status 429');
    expect(msg).not.toContain('super-secret-token');
    expect(msg).not.toContain('hash-fragment');
    expect(context.label).toBe('GET /api/v1/pods');
  });
});

describe('retry configuration layering', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
    vi.useRealTimers();
  });

  it.each([false, true])('merges per-request overrides over global/factory defaults (factory: %s)', async (factory) => {
    const config = {maxAttempts: 3, fallbackDelayMs: 400, jitter: 'none' as const};
    TestBed.configureTestingModule({
      providers: [
        provideK8sRetryBackoffConfig(config),
        provideHttpClient(
          withInterceptors([factory ? createK8sRetryBackoffInterceptor(config) : k8sRetryBackoffInterceptor]),
        ),
        provideHttpClientTesting(),
      ],
    });
    const http = TestBed.inject(HttpClient);
    const controller = TestBed.inject(HttpTestingController);
    const error = vi.fn();
    http
      .get('/override', {
        context: new HttpContext().set(K8S_RETRY_BACKOFF_CONFIG, {maxAttempts: 2, fallbackDelayMs: 100}),
      })
      .subscribe({error});
    controller.expectOne('/override').flush({}, {status: 429, statusText: 'throttled'});
    await vi.advanceTimersByTimeAsync(99);
    controller.expectNone('/override');
    await vi.advanceTimersByTimeAsync(1);
    controller.expectOne('/override').flush({}, {status: 429, statusText: 'throttled'});
    expect(error).toHaveBeenCalledOnce();

    const result = vi.fn();
    http.get('/default').subscribe(result);
    controller.expectOne('/default').flush({}, {status: 429, statusText: 'throttled'});
    await vi.advanceTimersByTimeAsync(399);
    controller.expectNone('/default');
    await vi.advanceTimersByTimeAsync(1);
    controller.expectOne('/default').flush({ok: true});
    expect(result).toHaveBeenCalledWith({ok: true});
  });
});
