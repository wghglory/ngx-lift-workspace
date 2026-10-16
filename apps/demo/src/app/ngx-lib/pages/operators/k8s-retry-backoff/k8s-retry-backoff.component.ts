import {HttpHeaders} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {ClarityModule} from '@clr/angular';
import {CalloutComponent, PageContainerComponent, TranslatePipe, TranslationService} from 'clr-lift';
import {getK8sRetryDelayMs, retryOnK8sBackoff} from 'ngx-lift';
import {defer, finalize, Observable, of, tap, throwError} from 'rxjs';

import {ApiProperty, ApiTableComponent} from '../../../../shared/components/api-table';
import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {DemoPlaygroundComponent} from '../../../../shared/components/demo-playground/demo-playground.component';
import {highlight} from '../../../../shared/utils/highlight.util';

export type SimulatorScenario = 'header' | 'body' | 'fallback' | 'non429' | 'exhausted';

export interface SimulationResult {
  success: boolean;
  message: string;
  totalAttempts: number;
  statusCode?: number;
}

@Component({
  selector: 'app-k8s-retry-backoff',
  imports: [
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
  templateUrl: './k8s-retry-backoff.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class K8sRetryBackoffComponent {
  readonly delaySimulationCode = highlight(`import {HttpHeaders} from '@angular/common/http';
import {signal} from '@angular/core';
import {getK8sRetryDelayMs} from 'ngx-lift';

// Component fields and handlers used by the live preview.
readonly helperScenario = signal<'header' | 'body' | 'fallback' | 'non429'>('header');

readonly extractedDelayResult = signal<{delayMs: number | null} | null>(null);

calculateDelay(): void {
  const sc = this.helperScenario();
  let error: unknown;
  if (sc === 'header') {
    error = {
      status: 429,
      headers: new HttpHeaders({'Retry-After': '3'}),
    };
  } else if (sc === 'body') {
    error = {
      status: 429,
      error: {details: {retryAfterSeconds: 2}},
    };
  } else if (sc === 'fallback') {
    error = {
      status: 429,
      headers: new HttpHeaders(),
      error: {},
    };
  } else {
    error = {status: 500, error: 'Internal Server Error'};
  }

  const delay = getK8sRetryDelayMs(error, 1000);
  this.extractedDelayResult.set({delayMs: delay});
}`);

  readonly simulationCode = highlight(`import {HttpHeaders} from '@angular/common/http';
import {DestroyRef, inject, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {retryOnK8sBackoff} from 'ngx-lift';
import {defer, finalize, Observable, of, tap, throwError} from 'rxjs';
import {SimulatorScenario, SimulationResult} from './k8s-retry-backoff.component';

// Component fields and handlers used by the live preview.
private destroyRef = inject(DestroyRef);

readonly selectedScenario = signal<SimulatorScenario>('header');

readonly isLoading = signal(false);

readonly logs = signal<string[]>([]);

readonly simulationResult = signal<SimulationResult | null>(null);

executeSimulation(): void {
  if (this.isLoading()) {
    return;
  }
  const scenario = this.selectedScenario();
  this.isLoading.set(true);
  this.simulationResult.set(null);
  this.logs.set([\`[\${new Date().toLocaleTimeString()}] Pipeline started for scenario: \${scenario}\`]);

  let attemptCount = 0;

  const source$: Observable<{message: string; attempt: number}> = defer(() => {
    attemptCount++;
    const currentAttempt = attemptCount;
    const now = new Date().toLocaleTimeString();

    if (scenario === 'header') {
      if (currentAttempt === 1) {
        const delayMs = 1000;
        this.logs.update((l) => [
          ...l,
          \`[\${now}] Attempt \${currentAttempt}: Server returned HTTP 429 (Retry-After: 1). Backoff: \${delayMs}ms...\`,
        ]);
        return throwError(() => ({
          status: 429,
          headers: new HttpHeaders({'Retry-After': '1'}),
          error: {message: 'Too Many Requests'},
        }));
      }
      this.logs.update((l) => [...l, \`[\${now}] Attempt \${currentAttempt}: Received HTTP 200 OK after backoff!\`]);
      return of({message: 'Pods retrieved successfully', attempt: currentAttempt});
    }

    if (scenario === 'body') {
      if (currentAttempt === 1) {
        const delaySec = 1.5;
        this.logs.update((l) => [
          ...l,
          \`[\${now}] Attempt \${currentAttempt}: Server returned HTTP 429 (details.retryAfterSeconds: \${delaySec}). Backoff: \${delaySec * 1000}ms...\`,
        ]);
        return throwError(() => ({
          status: 429,
          error: {
            kind: 'Status',
            apiVersion: 'v1',
            status: 'Failure',
            message: 'storage is (re)initializing',
            reason: 'TooManyRequests',
            code: 429,
            details: {retryAfterSeconds: delaySec},
          },
        }));
      }
      this.logs.update((l) => [...l, \`[\${now}] Attempt \${currentAttempt}: Watch cache ready! HTTP 200 OK.\`]);
      return of({message: 'Storage reinitialized; pods fetched', attempt: currentAttempt});
    }

    if (scenario === 'fallback') {
      if (currentAttempt === 1) {
        this.logs.update((l) => [
          ...l,
          \`[\${now}] Attempt \${currentAttempt}: Server returned HTTP 429 without Retry-After hint. Using a 1000ms exponential base with equal jitter...\`,
        ]);
        return throwError(() => ({
          status: 429,
          error: 'Too Many Requests',
        }));
      }
      this.logs.update((l) => [
        ...l,
        \`[\${now}] Attempt \${currentAttempt}: Received HTTP 200 OK after fallback delay.\`,
      ]);
      return of({message: 'Request succeeded after fallback backoff', attempt: currentAttempt});
    }

    if (scenario === 'non429') {
      this.logs.update((l) => [
        ...l,
        \`[\${now}] Attempt \${currentAttempt}: Server returned HTTP 500 Internal Server Error. Non-429 error!\`,
      ]);
      return throwError(() => ({
        status: 500,
        error: {message: 'Internal apiserver error'},
      }));
    }

    // scenario === 'exhausted'
    this.logs.update((l) => [...l, \`[\${now}] Attempt \${currentAttempt}: Server returned HTTP 429.\`]);
    return throwError(() => ({
      status: 429,
      headers: new HttpHeaders({'Retry-After': '0'}),
      error: {message: 'Continuous rate limit'},
    }));
  });

  source$
    .pipe(
      retryOnK8sBackoff({
        maxAttempts: 5,
        fallbackDelayMs: 1000,
        minDelayMs: 100,
        logRetries: true,
        logger: (message) => this.logs.update((logs) => [...logs, message]),
      }),
      takeUntilDestroyed(this.destroyRef),
      tap((res) => {
        this.simulationResult.set({
          success: true,
          message: res.message,
          totalAttempts: res.attempt,
          statusCode: 200,
        });
      }),
      finalize(() => {
        this.isLoading.set(false);
        this.logs.update((l) => [...l, \`[\${new Date().toLocaleTimeString()}] Pipeline completed.\`]);
      }),
    )
    .subscribe({
      error: (err) => {
        const statusCode = err?.status ?? 0;
        this.simulationResult.set({
          success: false,
          message:
            statusCode === 429
              ? 'Max attempts (5) exceeded. Request rejected.'
              : \`Error \${statusCode}: Non-429 error propagated immediately without retry.\`,
          totalAttempts: attemptCount,
          statusCode,
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

  readonly selectedScenario = signal<SimulatorScenario>('header');
  readonly isLoading = signal(false);
  readonly logs = signal<string[]>([]);
  readonly simulationResult = signal<SimulationResult | null>(null);

  readonly helperScenario = signal<'header' | 'body' | 'fallback' | 'non429'>('header');
  readonly extractedDelayResult = signal<{delayMs: number | null} | null>(null);

  readonly operatorCode = highlight(`import {JsonPipe} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {Component, inject} from '@angular/core';
import {resourceAsync, retryOnK8sBackoff} from 'ngx-lift';

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
  // resourceAsync subscribes and cleans up when the component is destroyed.
  readonly pods = resourceAsync(() =>
    this.http.get<PodList>('/api/v1/namespaces/default/pods').pipe(
      retryOnK8sBackoff({
        maxAttempts: 5,
        fallbackDelayMs: 1000,
        minDelayMs: 100,
        // Add 503 only if this endpoint permits retrying it.
        retryStatusCodes: [429],
        logRetries: true,
        logger: (message, {attempt, delayMs}) => console.info(message, {attempt, delayMs}),
      }),
    ),
  );
}`);

  readonly delayHelperCode = highlight(`import {HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {getK8sRetryDelayMs} from 'ngx-lift';

const error = new HttpErrorResponse({
  status: 429,
  headers: new HttpHeaders({'Retry-After': '3'}),
  error: {details: {retryAfterSeconds: 2}},
});

getK8sRetryDelayMs(error); // 3000 — the header takes precedence over the body
getK8sRetryDelayMs({status: 429, error: {}}, 1000); // 1000 — fallback
getK8sRetryDelayMs({status: 500}); // null — do not retry
// This helper only calculates a delay; it does not send or retry a request.`);

  operatorParameters = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'config',
        type: 'K8sBackoffRetryConfig',
        default: '{ maxAttempts: 5, fallbackDelayMs: 1000 }',
        description: this.translationService.translate('k8sRetryBackoff.paramConfig'),
      },
    ];
  });

  configProperties = computed<ApiProperty[]>(() => [
    {
      name: 'maxAttempts',
      type: 'number',
      default: '5',
      description: this.translationService.translate('k8sRetryBackoff.paramMaxAttempts'),
    },
    {
      name: 'fallbackDelayMs',
      type: 'number',
      default: '1000',
      description: this.translationService.translate('k8sRetryBackoff.paramFallbackDelay'),
    },
    {
      name: 'jitter',
      type: "'equal' | 'full' | 'none'",
      default: "'equal'",
      description: this.translationService.translate('k8sRetryBackoff.paramJitter'),
    },
    {
      name: 'hintJitterMs',
      type: 'number',
      default: '250',
      description: this.translationService.translate('k8sRetryBackoff.paramHintJitter'),
    },
    {
      name: 'maxDelayMs',
      type: 'number',
      default: '30000',
      description: this.translationService.translate('k8sRetryBackoff.paramMaxDelay'),
    },
    {
      name: 'maxTotalDelayMs',
      type: 'number',
      default: '60000',
      description: this.translationService.translate('k8sRetryBackoff.paramWaitBudget'),
    },
    {
      name: 'retryMethods',
      type: 'readonly string[]',
      default: "['GET', 'HEAD', 'OPTIONS', 'PUT', 'DELETE']",
      description: this.translationService.translate('k8sRetryBackoff.paramMethods'),
    },
    ...[
      ['minDelayMs', 'number', '0', 'paramMinDelay'],
      ['retryStatusCodes', 'readonly number[]', '[429]', 'paramStatuses'],
      ['isRetryable', '(error: unknown) => boolean', 'undefined', 'paramPredicate'],
      ['logRetries', 'boolean', 'false', 'paramLogRetries'],
      ['label', 'string', 'undefined', 'paramLabel'],
      ['logger', '(message, context: K8sRetryLogContext) => void', 'console.warn', 'paramLogger'],
    ].map(([name, type, defaultValue, key]) => ({
      name,
      type,
      default: defaultValue,
      description: this.translationService.translate(`k8sRetryBackoff.${key}`),
    })),
    {
      name: 'random',
      type: '() => number',
      default: 'Math.random',
      description: this.translationService.translate('k8sRetryBackoff.paramRandom'),
    },
  ]);

  delayParameters = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'error',
        type: 'unknown',
        description: this.translationService.translate('k8sRetryBackoff.paramError'),
      },
      {
        name: 'fallbackDelayMs',
        type: 'number',
        default: '1000',
        description: this.translationService.translate('k8sRetryBackoff.paramFallbackDelay'),
      },
      {
        name: 'retryStatusCodes',
        type: 'readonly number[]',
        default: '[429]',
        description: this.translationService.translate('k8sRetryBackoff.paramStatuses'),
      },
    ];
  });

  executeSimulation(): void {
    if (this.isLoading()) {
      return;
    }
    const scenario = this.selectedScenario();
    this.isLoading.set(true);
    this.simulationResult.set(null);
    this.logs.set([`[${new Date().toLocaleTimeString()}] Pipeline started for scenario: ${scenario}`]);

    let attemptCount = 0;

    const source$: Observable<{message: string; attempt: number}> = defer(() => {
      attemptCount++;
      const currentAttempt = attemptCount;
      const now = new Date().toLocaleTimeString();

      if (scenario === 'header') {
        if (currentAttempt === 1) {
          const delayMs = 1000;
          this.logs.update((l) => [
            ...l,
            `[${now}] Attempt ${currentAttempt}: Server returned HTTP 429 (Retry-After: 1). Backoff: ${delayMs}ms...`,
          ]);
          return throwError(() => ({
            status: 429,
            headers: new HttpHeaders({'Retry-After': '1'}),
            error: {message: 'Too Many Requests'},
          }));
        }
        this.logs.update((l) => [...l, `[${now}] Attempt ${currentAttempt}: Received HTTP 200 OK after backoff!`]);
        return of({message: 'Pods retrieved successfully', attempt: currentAttempt});
      }

      if (scenario === 'body') {
        if (currentAttempt === 1) {
          const delaySec = 1.5;
          this.logs.update((l) => [
            ...l,
            `[${now}] Attempt ${currentAttempt}: Server returned HTTP 429 (details.retryAfterSeconds: ${delaySec}). Backoff: ${delaySec * 1000}ms...`,
          ]);
          return throwError(() => ({
            status: 429,
            error: {
              kind: 'Status',
              apiVersion: 'v1',
              status: 'Failure',
              message: 'storage is (re)initializing',
              reason: 'TooManyRequests',
              code: 429,
              details: {retryAfterSeconds: delaySec},
            },
          }));
        }
        this.logs.update((l) => [...l, `[${now}] Attempt ${currentAttempt}: Watch cache ready! HTTP 200 OK.`]);
        return of({message: 'Storage reinitialized; pods fetched', attempt: currentAttempt});
      }

      if (scenario === 'fallback') {
        if (currentAttempt === 1) {
          this.logs.update((l) => [
            ...l,
            `[${now}] Attempt ${currentAttempt}: Server returned HTTP 429 without Retry-After hint. Using a 1000ms exponential base with equal jitter...`,
          ]);
          return throwError(() => ({
            status: 429,
            error: 'Too Many Requests',
          }));
        }
        this.logs.update((l) => [
          ...l,
          `[${now}] Attempt ${currentAttempt}: Received HTTP 200 OK after fallback delay.`,
        ]);
        return of({message: 'Request succeeded after fallback backoff', attempt: currentAttempt});
      }

      if (scenario === 'non429') {
        this.logs.update((l) => [
          ...l,
          `[${now}] Attempt ${currentAttempt}: Server returned HTTP 500 Internal Server Error. Non-429 error!`,
        ]);
        return throwError(() => ({
          status: 500,
          error: {message: 'Internal apiserver error'},
        }));
      }

      // scenario === 'exhausted'
      this.logs.update((l) => [...l, `[${now}] Attempt ${currentAttempt}: Server returned HTTP 429.`]);
      return throwError(() => ({
        status: 429,
        headers: new HttpHeaders({'Retry-After': '0'}),
        error: {message: 'Continuous rate limit'},
      }));
    });

    source$
      .pipe(
        retryOnK8sBackoff({
          maxAttempts: 5,
          fallbackDelayMs: 1000,
          minDelayMs: 100,
          logRetries: true,
          logger: (message) => this.logs.update((logs) => [...logs, message]),
        }),
        takeUntilDestroyed(this.destroyRef),
        tap((res) => {
          this.simulationResult.set({
            success: true,
            message: res.message,
            totalAttempts: res.attempt,
            statusCode: 200,
          });
        }),
        finalize(() => {
          this.isLoading.set(false);
          this.logs.update((l) => [...l, `[${new Date().toLocaleTimeString()}] Pipeline completed.`]);
        }),
      )
      .subscribe({
        error: (err) => {
          const statusCode = err?.status ?? 0;
          this.simulationResult.set({
            success: false,
            message:
              statusCode === 429
                ? 'Max attempts (5) exceeded. Request rejected.'
                : `Error ${statusCode}: Non-429 error propagated immediately without retry.`,
            totalAttempts: attemptCount,
            statusCode,
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

  calculateDelay(): void {
    const sc = this.helperScenario();
    let error: unknown;
    if (sc === 'header') {
      error = {
        status: 429,
        headers: new HttpHeaders({'Retry-After': '3'}),
      };
    } else if (sc === 'body') {
      error = {
        status: 429,
        error: {details: {retryAfterSeconds: 2}},
      };
    } else if (sc === 'fallback') {
      error = {
        status: 429,
        headers: new HttpHeaders(),
        error: {},
      };
    } else {
      error = {status: 500, error: 'Internal Server Error'};
    }

    const delay = getK8sRetryDelayMs(error, 1000);
    this.extractedDelayResult.set({delayMs: delay});
  }
}
