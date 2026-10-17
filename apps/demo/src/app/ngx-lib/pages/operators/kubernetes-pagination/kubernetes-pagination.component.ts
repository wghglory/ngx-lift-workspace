import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {HttpClient} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, computed, inject, signal, DestroyRef} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {CalloutComponent, PageContainerComponent, SpinnerComponent, TranslatePipe, TranslationService} from 'clr-lift';
import {
  aggregatePaginatedKubernetesResources,
  KubernetesList,
  KubernetesListResponse,
  KubernetesObject,
} from 'ngx-lift';
import {delay, Observable, of} from 'rxjs';

import {ApiProperty, ApiTableComponent} from '../../../../shared/components/api-table';
import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

export interface DemoPod extends KubernetesObject {
  metadata: {
    name: string;
    namespace: string;
    creationTimestamp?: string;
  };
  spec?: {
    nodeName?: string;
    containers?: {name: string; image: string}[];
  };
  status?: {
    phase: string;
    podIP?: string;
  };
}

@Component({
  selector: 'app-kubernetes-pagination',
  imports: [
    PageContainerComponent,
    CalloutComponent,
    CodeBlockComponent,
    SpinnerComponent,
    ClarityModule,
    TranslatePipe,
    ApiTableComponent,
  ],
  templateUrl: './kubernetes-pagination.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KubernetesPaginationComponent {
  private readonly destroyRef = inject(DestroyRef);
  private translationService = inject(TranslationService);

  aggregateParameters = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'http',
        type: 'HttpClient',
        description: this.translationService.translate('kubernetesPagination.paramHttp'),
      },
      {
        name: 'endpoint',
        type: 'string',
        description: this.translationService.translate('kubernetesPagination.paramEndpoint'),
      },
      {
        name: 'initialParams',
        type: 'Record<string, any>',
        default: '{}',
        description: this.translationService.translate('kubernetesPagination.paramInitialParams'),
      },
    ];
  });

  fetchParameters = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'http',
        type: 'HttpClient',
        description: this.translationService.translate('kubernetesPagination.paramHttp'),
      },
      {
        name: 'endpoint',
        type: 'string',
        description: this.translationService.translate('kubernetesPagination.paramEndpoint'),
      },
      {
        name: 'initialParams',
        type: 'Record<string, any>',
        default: '{}',
        description: this.translationService.translate('kubernetesPagination.paramInitialParams'),
      },
    ];
  });

  readonly isLoading = signal(false);
  readonly pagesFetched = signal<number>(0);
  readonly aggregatedList = signal<KubernetesList<DemoPod> | null>(null);

  // Mock server pagination simulator
  private fetchMockPods(endpoint: string, continueToken?: string): Observable<KubernetesListResponse<DemoPod>> {
    const pageMap: Record<string, KubernetesListResponse<DemoPod>> = {
      initial: {
        apiVersion: 'v1',
        kind: 'PodList',
        metadata: {
          continue: 'token-page-2',
          resourceVersion: '1001',
        },
        items: [
          {
            apiVersion: 'v1',
            kind: 'Pod',
            metadata: {name: 'coredns-6f6b67-w211', namespace: 'kube-system'},
            status: {phase: 'Running', podIP: '10.244.0.2'},
          },
          {
            apiVersion: 'v1',
            kind: 'Pod',
            metadata: {name: 'etcd-control-plane-0', namespace: 'kube-system'},
            status: {phase: 'Running', podIP: '192.168.1.10'},
          },
        ],
      },
      'token-page-2': {
        apiVersion: 'v1',
        kind: 'PodList',
        metadata: {
          continue: 'token-page-3',
          resourceVersion: '1002',
        },
        items: [
          {
            apiVersion: 'v1',
            kind: 'Pod',
            metadata: {name: 'postgres-primary-0', namespace: 'default'},
            status: {phase: 'Running', podIP: '10.244.1.14'},
          },
          {
            apiVersion: 'v1',
            kind: 'Pod',
            metadata: {name: 'redis-cache-master-0', namespace: 'default'},
            status: {phase: 'Running', podIP: '10.244.1.15'},
          },
        ],
      },
      'token-page-3': {
        apiVersion: 'v1',
        kind: 'PodList',
        metadata: {
          continue: '', // End of pages
          resourceVersion: '1003',
        },
        items: [
          {
            apiVersion: 'v1',
            kind: 'Pod',
            metadata: {name: 'api-gateway-7b98d9-z894', namespace: 'production'},
            status: {phase: 'Running', podIP: '10.244.2.33'},
          },
        ],
      },
    };

    const token = continueToken || 'initial';
    return of(pageMap[token] ?? {metadata: {continue: ''}, items: []}).pipe(delay(350));
  }

  fetchAggregatedPods(): void {
    this.isLoading.set(true);
    this.pagesFetched.set(0);
    this.aggregatedList.set(null);

    // Mock an HttpClient adapter that uses our simulated pagination map
    const mockHttpClient = {
      get: (_url: string, options?: {params?: Record<string, unknown>}) => {
        const continueToken = options?.params?.['continue'] as string | undefined;
        this.pagesFetched.update((p) => p + 1);
        return this.fetchMockPods(_url, continueToken);
      },
    } as unknown as HttpClient;

    this.fetchMockPods('/api/v1/pods')
      .pipe(
        aggregatePaginatedKubernetesResources<DemoPod>(mockHttpClient, '/api/v1/pods', {limit: 2}),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (list) => {
          this.aggregatedList.set(list);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
  }

  operatorCode =
    highlight(`// Component-field excerpt: http is an injected HttpClient; Pod is your KubernetesObject type.
// In app.config.ts, provideHttpClient() enables HTTP; own the subscription with AsyncPipe or takeUntilDestroyed.
import {HttpClient} from '@angular/common/http';
import {aggregatePaginatedKubernetesResources, KubernetesList} from 'ngx-lift';

// As an RxJS operator piped from an initial HTTP request:
this.http
  .get<KubernetesList<Pod>>('/api/v1/pods', {params: {limit: 100}})
  .pipe(aggregatePaginatedKubernetesResources(this.http, '/api/v1/pods', {limit: 100}))
  .subscribe((podList) => {
    // Automatically loops through continue tokens until finished!
    console.log('Total pods aggregated across all pages:', podList.items.length);
  });`);

  firstReadCode = highlight(`// This is the HTTP version. The preview uses three local pages instead.
// In app.config.ts, add provideHttpClient() to your providers.
import {HttpClient} from '@angular/common/http';
import {AsyncPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {AlertComponent} from 'clr-lift';
import {createAsyncState, fetchPaginatedKubernetesResources, KubernetesObject} from 'ngx-lift';

@Component({
  selector: 'app-pods',
  imports: [AsyncPipe, AlertComponent],
  template: \`
    @if (pods$ | async; as state) {
      @if (state.isLoading) {
        <p role="status">Loading pods...</p>
      }
      @if (state.error) {
        <cll-alert [error]="state.error" />
      }
      @if (state.data; as list) {
        <p>{{ list.items.length }} pods</p>
      }
    }
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PodsComponent {
  private httpClient = inject(HttpClient);
  readonly pods$ = fetchPaginatedKubernetesResources<KubernetesObject>(this.httpClient, '/api/v1/pods', {
    limit: 100,
  }).pipe(createAsyncState());
}
// AsyncPipe owns the entire page sequence and unsubscribes on destruction.
// A repeated/cyclic nonempty continuation token errors instead of looping forever.
// Each ordinary page follows the server's continuation token; no arbitrary item cap.`);

  convenienceCode = highlight(`import {fetchPaginatedKubernetesResources, KubernetesList} from 'ngx-lift';

// As a self-contained helper function:
fetchPaginatedKubernetesResources<Pod>(this.http, '/api/v1/pods', {limit: 100}).subscribe((podList) => {
  console.log('Total pods:', podList.items.length);
});`);
}
