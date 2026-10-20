import {AsyncPipe} from '@angular/common';
import {
  HttpContext,
  HttpErrorResponse,
  HttpHandlerFn,
  HttpHeaders,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  Injector,
  runInInjectionContext,
  signal,
} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {ClarityModule} from '@clr/angular';
import {CalloutComponent, PageContainerComponent, TranslatePipe, TranslationService, AlertComponent} from 'clr-lift';
import {isK8sStatusThrottled, K8S_RETRY_BACKOFF_CONFIG, k8sRetryBackoffInterceptor, createAsyncState} from 'ngx-lift';
import {defer, finalize, of, throwError, Subject, switchMap, filter, map} from 'rxjs';

import {ApiProperty, ApiTableComponent} from '../../../../shared/components/api-table';
import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {DemoPlaygroundComponent} from '../../../../shared/components/demo-playground/demo-playground.component';
import {highlight} from '../../../../shared/utils/highlight.util';

export type InterceptorMode = 'default' | 'custom' | 'disabled' | 'postDefault' | 'postOptIn' | 'postGateway';

export interface InterceptorResult {
  success: boolean;
  message: string;
  messageKey?: string;
  totalAttempts: number;
  statusCode: number;
}

@Component({
  selector: 'app-k8s-retry-backoff-interceptor',
  imports: [
    DemoPlaygroundComponent,
    AsyncPipe,
    AlertComponent,
    PageContainerComponent,
    CalloutComponent,
    DemoPlaygroundComponent,
    CodeBlockComponent,
    ClarityModule,
    TranslatePipe,
    ApiTableComponent,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './k8s-retry-backoff-interceptor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class K8sRetryBackoffInterceptorComponent {
  private readonly firstInjector = inject(Injector);
  readonly firstRead$ = new Subject<void>();
  readonly firstState$ = this.firstRead$.pipe(
    switchMap(() => {
      let attempt = 0;
      const request = new HttpRequest('GET', '/api/v1/pods');
      const transport: HttpHandlerFn = () =>
        defer(() => {
          attempt++;
          if (attempt === 1)
            return throwError(
              () =>
                new HttpErrorResponse({
                  status: 429,
                  headers: new HttpHeaders({'Retry-After': '1'}),
                }),
            );
          return of(new HttpResponse({status: 200, body: {attempt}}));
        });
      return runInInjectionContext(this.firstInjector, () => k8sRetryBackoffInterceptor(request, transport)).pipe(
        filter((event) => event instanceof HttpResponse),
        map(() => ({attempt, status: 200})),
        createAsyncState(),
      );
    }),
  );
  readonly starterCode = highlight(`import {AsyncPipe} from '@angular/common';
import {HttpRequest, HttpResponse, HttpHandlerFn, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, inject, Injector, runInInjectionContext} from '@angular/core';
import {AlertComponent} from 'clr-lift';
import {createAsyncState, k8sRetryBackoffInterceptor} from 'ngx-lift';
import {Subject, switchMap, defer, throwError, of, filter, map} from 'rxjs';

// Local transport: first response is 429 with Retry-After: 1; the retry succeeds.
// No HTTP provider is needed for this simulation.
// AsyncPipe releases the request and pending retry when the component is destroyed.
// Follow the setup below to apply the same policy to HttpClient GET requests.
@Component({
  selector: 'app-starter',
  imports: [AsyncPipe, AlertComponent],
  templateUrl: './starter.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarterComponent {
  private readonly firstInjector = inject(Injector);
  readonly firstRead$ = new Subject<void>();
  readonly firstState$ = this.firstRead$.pipe(
    switchMap(() => {
      let attempt = 0;
      const request = new HttpRequest('GET', '/api/v1/pods');
      const transport: HttpHandlerFn = () =>
        defer(() => {
          attempt++;
          if (attempt === 1)
            return throwError(
              () =>
                new HttpErrorResponse({
                  status: 429,
                  headers: new HttpHeaders({'Retry-After': '1'}),
                }),
            );
          return of(new HttpResponse({status: 200, body: {attempt}}));
        });
      return runInInjectionContext(this.firstInjector, () => k8sRetryBackoffInterceptor(request, transport)).pipe(
        filter((event) => event instanceof HttpResponse),
        map(() => ({attempt, status: 200})),
        createAsyncState(),
      );
    }),
  );
}`);
  readonly starterHtml = highlight(`@let state = firstState$ | async;
<button type="button" class="btn btn-sm" [disabled]="state?.isLoading" (click)="firstRead$.next()">Refresh</button>
<output aria-live="polite">{{ state?.status ?? 'idle' }} · {{ state?.data?.attempt ?? 0 }}</output>
@if (state?.error; as error) {
  <cll-alert [error]="error" />
}`);

  readonly overrideSimulationCode = highlight(`import {
  HttpContext,
  HttpErrorResponse,
  HttpHandlerFn,
  HttpHeaders,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import {DestroyRef, inject, Injector, runInInjectionContext, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {K8S_RETRY_BACKOFF_CONFIG, k8sRetryBackoffInterceptor} from 'ngx-lift';
import {defer, finalize, of, throwError} from 'rxjs';

// Component fields and handlers used by the live preview.
private destroyRef = inject(DestroyRef);

private injector = inject(Injector);

readonly isTestingOverride = signal(false);

readonly activeOverrideTest = signal<'probe' | 'workload' | null>(null);

readonly overrideResult = signal<{
  bypassed: boolean;
  attempts: number;
  statusCode: number;
  message: string;
  messageKey?: string;
} | null>(null);

testProbeOptOut(): void {
  this.testOverride('probe', false);
}

testWorkloadCustom(): void {
  this.testOverride('workload', {maxAttempts: 10, fallbackDelayMs: 200});
}

private testOverride(
  overrideKey: 'probe' | 'workload',
  config: false | {maxAttempts: number; fallbackDelayMs: number},
): void {
  if (this.isTestingOverride()) return;
  this.isTestingOverride.set(true);
  this.activeOverrideTest.set(overrideKey);
  this.overrideResult.set(null);
  const context = new HttpContext().set(K8S_RETRY_BACKOFF_CONFIG, config);
  const request = new HttpRequest('GET', '/api/v1/namespaces/default/pods', {context});
  let attempts = 0;
  const next: HttpHandlerFn = () =>
    defer(() => {
      attempts++;
      return attempts < 3
        ? throwError(() => new HttpErrorResponse({status: 429}))
        : of(new HttpResponse({status: 200, body: {items: []}}));
    });
  runInInjectionContext(this.injector, () => k8sRetryBackoffInterceptor(request, next))
    .pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => {
        this.isTestingOverride.set(false);
        this.activeOverrideTest.set(null);
      }),
    )
    .subscribe({
      next: (event) => {
        if (event instanceof HttpResponse) {
          this.overrideResult.set({
            bypassed: false,
            attempts,
            statusCode: event.status,
            message:
              'Request succeeded after 2 retries with maxAttempts: 10 and 200ms exponential base and equal jitter.',
            messageKey: 'k8sRetryBackoff.customOverrideResult',
          });
        }
      },
      error: (error: HttpErrorResponse) =>
        this.overrideResult.set({
          bypassed: config === false,
          attempts,
          statusCode: error.status,
          message: 'Request failed immediately (HTTP 429). Retries bypassed via K8S_RETRY_BACKOFF_CONFIG: false.',
          messageKey: 'k8sRetryBackoff.bypassedResult',
        }),
    });
}`);

  readonly simulationCode = highlight(`import {
  HttpContext,
  HttpErrorResponse,
  HttpHandlerFn,
  HttpHeaders,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import {DestroyRef, inject, Injector, runInInjectionContext, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {isK8sStatusThrottled, K8S_RETRY_BACKOFF_CONFIG, k8sRetryBackoffInterceptor} from 'ngx-lift';
import {defer, finalize, of, throwError} from 'rxjs';
import {InterceptorMode, InterceptorResult} from './k8s-retry-backoff-interceptor.component';

// Component fields and handlers used by the live preview.
private destroyRef = inject(DestroyRef);

private injector = inject(Injector);

readonly selectedMode = signal<InterceptorMode>('default');

readonly writeModes = [
  {value: 'postDefault', label: 'k8sRetryBackoffInterceptor.postDefault'},
  {value: 'postOptIn', label: 'k8sRetryBackoffInterceptor.postOptIn'},
  {value: 'postGateway', label: 'k8sRetryBackoffInterceptor.postGateway'},
] as const;

readonly isLoading = signal(false);

readonly logs = signal<string[]>([]);

readonly simulationResult = signal<InterceptorResult | null>(null);

executeRequest(): void {
  if (this.isLoading()) {
    return;
  }
  const mode = this.selectedMode();
  this.isLoading.set(true);
  this.simulationResult.set(null);
  this.logs.set([\`[\${new Date().toLocaleTimeString()}] Dispatching request with mode: \${mode}\`]);

  let context = new HttpContext();
  if (mode === 'disabled') {
    context = context.set(K8S_RETRY_BACKOFF_CONFIG, false);
  } else if (mode === 'custom') {
    context = context.set(K8S_RETRY_BACKOFF_CONFIG, {maxAttempts: 2, fallbackDelayMs: 400});
  }

  if (mode === 'postOptIn' || mode === 'postGateway') {
    context = context.set(K8S_RETRY_BACKOFF_CONFIG, {
      retryMethods: ['POST'],
      isRetryable: isK8sStatusThrottled,
    });
  }
  if (mode !== 'disabled') {
    const retryConfig = context.get(K8S_RETRY_BACKOFF_CONFIG);
    context = context.set(K8S_RETRY_BACKOFF_CONFIG, {
      ...(retryConfig === false ? {} : retryConfig),
      logRetries: true,
      logger: (message) => this.logs.update((logs) => [...logs, message]),
    });
  }
  const method = mode.startsWith('post') ? 'POST' : 'GET';
  const request = new HttpRequest<unknown>(method, '/api/v1/namespaces/default/pods', null, {context});

  let attemptCount = 0;
  const next: HttpHandlerFn = () =>
    defer(() => {
      attemptCount++;
      const current = attemptCount;
      const now = new Date().toLocaleTimeString();

      if (current === 1) {
        const delayNotice =
          mode === 'custom' ? 'no hint (base: 400ms, equal jitter)' : 'Retry-After: 1 (minimum: 1000ms, plus jitter)';
        this.logs.update((l) => [
          ...l,
          \`[\${now}] Attempt \${current}: Mock server response HTTP 429 TooManyRequests (\${delayNotice}).\`,
        ]);
        const headers = mode === 'custom' ? new HttpHeaders() : new HttpHeaders({'Retry-After': '1'});
        return throwError(
          () =>
            new HttpErrorResponse({
              status: 429,
              statusText: 'Too Many Requests',
              headers,
              error:
                mode === 'postGateway'
                  ? {message: 'Gateway rate limit'}
                  : {kind: 'Status', reason: 'TooManyRequests'},
            }),
        );
      }

      this.logs.update((l) => [
        ...l,
        \`[\${now}] Attempt \${current}: Interceptor retry succeeded! HTTP 200 OK received.\`,
      ]);
      return of(
        new HttpResponse({
          status: 200,
          body: {items: ['pod-coredns-1', 'pod-metrics-2']},
        }),
      );
    });

  runInInjectionContext(this.injector, () => k8sRetryBackoffInterceptor(request, next))
    .pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => {
        this.isLoading.set(false);
        this.logs.update((l) => [...l, \`[\${new Date().toLocaleTimeString()}] Pipeline completed.\`]);
      }),
    )
    .subscribe({
      next: (event) => {
        if (event instanceof HttpResponse) {
          this.simulationResult.set({
            success: true,
            message: 'Request succeeded through interceptor after retry.',
            messageKey: 'k8sRetryBackoff.interceptorSuccess',
            totalAttempts: attemptCount,
            statusCode: event.status,
          });
        }
      },
      error: (err: HttpErrorResponse) => {
        this.simulationResult.set({
          success: false,
          message:
            mode === 'disabled'
              ? 'HTTP 429 error returned immediately: Retry backoff was disabled via HttpContext.'
              : mode === 'postDefault'
                ? 'POST was not retried: write retries require explicit endpoint opt-in.'
                : mode === 'postGateway'
                  ? 'Gateway 429 was not retried: the configured Kubernetes predicate rejected it.'
                  : \`Error \${err.status}: Exceeded maximum attempts without recovery.\`,
          messageKey:
            mode === 'disabled'
              ? 'k8sRetryBackoff.disabledResult'
              : mode === 'postDefault'
                ? 'k8sRetryBackoff.postDefaultResult'
                : mode === 'postGateway'
                  ? 'k8sRetryBackoff.gatewayResult'
                  : 'k8sRetryBackoff.unrecoveredResult',
          totalAttempts: attemptCount,
          statusCode: err.status,
        });
      },
    });
}

clearLogs(): void {
  if (this.isLoading()) {
    return;
  }
  this.logs.set([]);
  this.simulationResult.set(null);
}`);

  private translationService = inject(TranslationService);
  private destroyRef = inject(DestroyRef);
  private injector = inject(Injector);

  readonly selectedMode = signal<InterceptorMode>('default');
  readonly writeModes = [
    {value: 'postDefault', label: 'k8sRetryBackoffInterceptor.postDefault'},
    {value: 'postOptIn', label: 'k8sRetryBackoffInterceptor.postOptIn'},
    {value: 'postGateway', label: 'k8sRetryBackoffInterceptor.postGateway'},
  ] as const;
  readonly isLoading = signal(false);
  readonly logs = signal<string[]>([]);
  readonly simulationResult = signal<InterceptorResult | null>(null);

  readonly isTestingOverride = signal(false);
  readonly activeOverrideTest = signal<'probe' | 'workload' | null>(null);
  readonly overrideResult = signal<{
    bypassed: boolean;
    attempts: number;
    statusCode: number;
    message: string;
    messageKey?: string;
  } | null>(null);

  readonly interceptorUsageCode = highlight(`// app.config.ts
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {k8sRetryBackoffInterceptor} from 'ngx-lift';

export const appConfig = {
  providers: [provideHttpClient(withInterceptors([k8sRetryBackoffInterceptor]))],
};

// pod-list.component.ts
import {JsonPipe} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {Component, inject} from '@angular/core';
import {resourceAsync} from 'ngx-lift';

interface PodList {
  items: {metadata: {name: string}}[];
}

@Component({
  selector: 'app-pod-list',
  imports: [JsonPipe],
  template: \`
    @if (pods.isLoading()) {
      <p>Loading pods…</p>
    } @else if (pods.error()) {
      <p>Could not load pods. <button (click)="pods.reload()">Try again</button></p>
    } @else {
      <pre>{{ pods.value() | json }}</pre>
    }
  \`,
})
export class PodListComponent {
  private http = inject(HttpClient);
  // Idempotent methods retry on 429; POST/PATCH require explicit opt-in.
  readonly pods = resourceAsync(() => this.http.get<PodList>('/api/v1/namespaces/default/pods'));
}`);

  readonly factoryCode = highlight(`import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {ApplicationConfig} from '@angular/core';
import {createK8sRetryBackoffInterceptor} from 'ngx-lift';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([createK8sRetryBackoffInterceptor({maxAttempts: 3, fallbackDelayMs: 2000})])),
  ],
};`);

  readonly contextOverrideCode = highlight(`import {HttpClient, HttpContext} from '@angular/common/http';
import {Injectable, inject} from '@angular/core';
import {isK8sStatusThrottled, K8S_RETRY_BACKOFF_CONFIG} from 'ngx-lift';

@Injectable({providedIn: 'root'})
export class WorkloadService {
  private http = inject(HttpClient);

  // 1. Opt out: disable retry backoff for fast-fail health/ping checks or short timeouts
  probeStatus() {
    return this.http.get('/api/v1/namespaces/default/pods/probe', {
      context: new HttpContext().set(K8S_RETRY_BACKOFF_CONFIG, false),
    });
  }

  // Only for an endpoint with an explicit idempotency / rejection-before-execution guarantee.
  createPod(body: unknown) {
    return this.http.post('/api/v1/namespaces/default/pods', body, {
      context: new HttpContext().set(K8S_RETRY_BACKOFF_CONFIG, {
        retryMethods: ['POST'],
        isRetryable: isK8sStatusThrottled,
      }),
    });
  }

  // 2. Custom retry limits for high-priority or batch operations
  listWorkloads() {
    return this.http.get('/apis/apps/v1/namespaces/default/deployments', {
      context: new HttpContext().set(K8S_RETRY_BACKOFF_CONFIG, {
        maxAttempts: 10,
        fallbackDelayMs: 200,
      }),
    });
  }
}`);

  interceptorProperties = computed<ApiProperty[]>(() => [
    {
      name: 'k8sRetryBackoffInterceptor',
      type: 'HttpInterceptorFn',
      description: this.translationService.translate('k8sRetryBackoffInterceptor.apiSummary'),
    },
  ]);

  factoryParameters = computed<ApiProperty[]>(() => [
    {
      name: 'defaultConfig',
      type: 'K8sBackoffRetryConfig',
      default: 'undefined',
      description: this.translationService.translate('k8sRetryBackoffInterceptor.paramDefaultConfig'),
    },
  ]);

  tokenProperties = computed<ApiProperty[]>(() => [
    {
      name: 'K8S_RETRY_BACKOFF_CONFIG',
      type: 'HttpContextToken<K8sBackoffRetryConfig | false | null>',
      default: 'null',
      description: this.translationService.translate('k8sRetryBackoffInterceptor.tokenSummary'),
    },
  ]);

  executeRequest(): void {
    if (this.isLoading()) {
      return;
    }
    const mode = this.selectedMode();
    this.isLoading.set(true);
    this.simulationResult.set(null);
    this.logs.set([`[${new Date().toLocaleTimeString()}] Dispatching request with mode: ${mode}`]);

    let context = new HttpContext();
    if (mode === 'disabled') {
      context = context.set(K8S_RETRY_BACKOFF_CONFIG, false);
    } else if (mode === 'custom') {
      context = context.set(K8S_RETRY_BACKOFF_CONFIG, {maxAttempts: 2, fallbackDelayMs: 400});
    }

    if (mode === 'postOptIn' || mode === 'postGateway') {
      context = context.set(K8S_RETRY_BACKOFF_CONFIG, {
        retryMethods: ['POST'],
        isRetryable: isK8sStatusThrottled,
      });
    }
    if (mode !== 'disabled') {
      const retryConfig = context.get(K8S_RETRY_BACKOFF_CONFIG);
      context = context.set(K8S_RETRY_BACKOFF_CONFIG, {
        ...(retryConfig === false ? {} : retryConfig),
        logRetries: true,
        logger: (message) => this.logs.update((logs) => [...logs, message]),
      });
    }
    const method = mode.startsWith('post') ? 'POST' : 'GET';
    const request = new HttpRequest<unknown>(method, '/api/v1/namespaces/default/pods', null, {context});

    let attemptCount = 0;
    const next: HttpHandlerFn = () =>
      defer(() => {
        attemptCount++;
        const current = attemptCount;
        const now = new Date().toLocaleTimeString();

        if (current === 1) {
          const delayNotice =
            mode === 'custom' ? 'no hint (base: 400ms, equal jitter)' : 'Retry-After: 1 (minimum: 1000ms, plus jitter)';
          this.logs.update((l) => [
            ...l,
            `[${now}] Attempt ${current}: Mock server response HTTP 429 TooManyRequests (${delayNotice}).`,
          ]);
          const headers = mode === 'custom' ? new HttpHeaders() : new HttpHeaders({'Retry-After': '1'});
          return throwError(
            () =>
              new HttpErrorResponse({
                status: 429,
                statusText: 'Too Many Requests',
                headers,
                error:
                  mode === 'postGateway'
                    ? {message: 'Gateway rate limit'}
                    : {kind: 'Status', reason: 'TooManyRequests'},
              }),
          );
        }

        this.logs.update((l) => [
          ...l,
          `[${now}] Attempt ${current}: Interceptor retry succeeded! HTTP 200 OK received.`,
        ]);
        return of(
          new HttpResponse({
            status: 200,
            body: {items: ['pod-coredns-1', 'pod-metrics-2']},
          }),
        );
      });

    runInInjectionContext(this.injector, () => k8sRetryBackoffInterceptor(request, next))
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading.set(false);
          this.logs.update((l) => [...l, `[${new Date().toLocaleTimeString()}] Pipeline completed.`]);
        }),
      )
      .subscribe({
        next: (event) => {
          if (event instanceof HttpResponse) {
            this.simulationResult.set({
              success: true,
              message: 'Request succeeded through interceptor after retry.',
              messageKey: 'k8sRetryBackoff.interceptorSuccess',
              totalAttempts: attemptCount,
              statusCode: event.status,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          this.simulationResult.set({
            success: false,
            message:
              mode === 'disabled'
                ? 'HTTP 429 error returned immediately: Retry backoff was disabled via HttpContext.'
                : mode === 'postDefault'
                  ? 'POST was not retried: write retries require explicit endpoint opt-in.'
                  : mode === 'postGateway'
                    ? 'Gateway 429 was not retried: the configured Kubernetes predicate rejected it.'
                    : `Error ${err.status}: Exceeded maximum attempts without recovery.`,
            messageKey:
              mode === 'disabled'
                ? 'k8sRetryBackoff.disabledResult'
                : mode === 'postDefault'
                  ? 'k8sRetryBackoff.postDefaultResult'
                  : mode === 'postGateway'
                    ? 'k8sRetryBackoff.gatewayResult'
                    : 'k8sRetryBackoff.unrecoveredResult',
            totalAttempts: attemptCount,
            statusCode: err.status,
          });
        },
      });
  }

  clearLogs(): void {
    if (this.isLoading()) {
      return;
    }
    this.logs.set([]);
    this.simulationResult.set(null);
  }

  testProbeOptOut(): void {
    this.testOverride('probe', false);
  }

  testWorkloadCustom(): void {
    this.testOverride('workload', {maxAttempts: 10, fallbackDelayMs: 200});
  }

  private testOverride(
    overrideKey: 'probe' | 'workload',
    config: false | {maxAttempts: number; fallbackDelayMs: number},
  ): void {
    if (this.isTestingOverride()) return;
    this.isTestingOverride.set(true);
    this.activeOverrideTest.set(overrideKey);
    this.overrideResult.set(null);
    const context = new HttpContext().set(K8S_RETRY_BACKOFF_CONFIG, config);
    const request = new HttpRequest('GET', '/api/v1/namespaces/default/pods', {context});
    let attempts = 0;
    const next: HttpHandlerFn = () =>
      defer(() => {
        attempts++;
        return attempts < 3
          ? throwError(() => new HttpErrorResponse({status: 429}))
          : of(new HttpResponse({status: 200, body: {items: []}}));
      });
    runInInjectionContext(this.injector, () => k8sRetryBackoffInterceptor(request, next))
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isTestingOverride.set(false);
          this.activeOverrideTest.set(null);
        }),
      )
      .subscribe({
        next: (event) => {
          if (event instanceof HttpResponse) {
            this.overrideResult.set({
              bypassed: false,
              attempts,
              statusCode: event.status,
              message:
                'Request succeeded after 2 retries with maxAttempts: 10 and 200ms exponential base and equal jitter.',
              messageKey: 'k8sRetryBackoff.customOverrideResult',
            });
          }
        },
        error: (error: HttpErrorResponse) =>
          this.overrideResult.set({
            bypassed: config === false,
            attempts,
            statusCode: error.status,
            message: 'Request failed immediately (HTTP 429). Retries bypassed via K8S_RETRY_BACKOFF_CONFIG: false.',
            messageKey: 'k8sRetryBackoff.bypassedResult',
          }),
      });
  }
}
