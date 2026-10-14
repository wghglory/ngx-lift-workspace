import {JsonPipe} from '@angular/common';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, DestroyRef, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TranslatePipe} from 'clr-lift';
import {mutateResource, QueryClient, queryResource, queryResources} from 'ngx-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';
import {FailureDemoData, QueryFailureBackend} from './query-failure-backend';

@Component({
  selector: 'app-query-failure-examples',
  imports: [JsonPipe, FormsModule, TranslatePipe, CodeBlockComponent],
  providers: [
    QueryFailureBackend,
    {provide: HttpClient, useFactory: () => new HttpClient(inject(QueryFailureBackend))},
  ],
  templateUrl: './query-failure-examples.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueryFailureExamplesComponent {
  readonly backend = inject(QueryFailureBackend);
  private readonly http = inject(HttpClient);
  readonly terminalFailures = signal(0);
  readonly diagnostics = signal(0);
  readonly retryEnabled = signal(false);
  readonly deadlineEnabled = signal(false);
  readonly promiseEnabled = signal(false);
  readonly name = signal('');
  private promiseAttempts = 0;
  private readonly client = new QueryClient({
    queryDefaults: {deadlineMs: 5000},
    onQueryError: () => this.terminalFailures.update((count) => count + 1),
    onDiagnostic: () => this.diagnostics.update((count) => count + 1),
  });
  private readonly refreshDefinition = {
    key: ['failure-demo', 'refresh'],
    loader: () => this.http.get<FailureDemoData>('/query-failure/refresh'),
    tags: [{type: 'FailureData', scope: 'demo'}],
    staleTime: 30_000,
  };
  readonly initialQuery = queryResource(
    () => ({key: ['failure-demo', 'initial'], loader: () => this.http.get<FailureDemoData>('/query-failure/initial')}),
    {client: this.client},
  );
  readonly refreshQuery = queryResource(() => this.refreshDefinition, {client: this.client});
  readonly retryQuery = queryResource(
    () =>
      this.retryEnabled()
        ? {
            key: ['failure-demo', 'retry'],
            loader: () => this.http.get<FailureDemoData>('/query-failure/retry'),
            retry: {
              maxAttempts: 3,
              shouldRetry: (error: unknown) => error instanceof HttpErrorResponse && error.status === 503,
              delayMs: 150,
            },
          }
        : undefined,
    {client: this.client},
  );
  readonly promiseQuery = queryResource(
    () =>
      this.promiseEnabled()
        ? {
            key: ['failure-demo', 'promise'],
            loader: async () => {
              if (++this.promiseAttempts === 1) throw new HttpErrorResponse({status: 503});
              return {id: 'promise', value: 42};
            },
            retry: {
              maxAttempts: 2,
              shouldRetry: (error: unknown) => error instanceof HttpErrorResponse && error.status === 503,
              delayMs: 150,
            },
          }
        : undefined,
    {client: this.client},
  );
  readonly deadlineQuery = queryResource(
    () =>
      this.deadlineEnabled()
        ? {
            key: ['failure-demo', 'deadline'],
            loader: () => this.http.get<FailureDemoData>('/query-failure/deadline'),
            deadlineMs: 500,
          }
        : undefined,
    {client: this.client},
  );
  readonly rowQueries = queryResources(
    () => ['a', 'b'],
    (id) => ({
      key: ['failure-demo', 'rows', id],
      loader: () => this.http.get<FailureDemoData>(`/query-failure/rows/${id}`),
    }),
    {client: this.client},
  );
  readonly saveMutation = mutateResource(
    (args: {name: string}) => this.http.post<FailureDemoData>('/query-failure/mutation', args),
    {
      client: this.client,
      concurrency: 'exhaust',
      invalidatesTags: [{type: 'FailureData', scope: 'demo'}],
    },
  );

  constructor() {
    inject(DestroyRef).onDestroy(() => this.client.destroy());
  }
  failRefresh() {
    this.backend.failures.set('refresh', 1);
    this.refreshQuery.reload();
  }
  startRetry() {
    this.backend.failures.set('retry', 2);
    if (this.retryEnabled()) this.retryQuery.reload();
    else this.retryEnabled.set(true);
  }
  startPromise() {
    this.promiseAttempts = 0;
    if (this.promiseEnabled()) this.promiseQuery.reload();
    else this.promiseEnabled.set(true);
  }
  startDeadline() {
    if (this.deadlineEnabled()) this.deadlineQuery.reload();
    else this.deadlineEnabled.set(true);
  }
  save(fail = false) {
    this.backend.failWrite = fail;
    void this.saveMutation.mutate({name: this.name()});
  }
  failObserver() {
    const stop = this.client.observeQuery(this.refreshDefinition, (snapshot) => {
      if (snapshot.status === 'reloading') throw new Error('Demo observer failure');
    });
    this.refreshQuery.reload();
    void this.client.fetchQuery(this.refreshDefinition, {refresh: true}).then(stop, stop);
  }

  readonly failureCode = highlight(`import {ApplicationConfig, Component, inject} from '@angular/core';
import {HttpClient, HttpErrorResponse, provideHttpClient} from '@angular/common/http';
import {provideQueryClient, queryResource} from 'ngx-lift';

export const appConfig: ApplicationConfig = {providers: [provideHttpClient(), provideQueryClient({
  queryDefaults: {
    deadlineMs: 15_000, refetchOnReconnect: true,
    retry: {maxAttempts: 3,
      shouldRetry: error => error instanceof HttpErrorResponse && error.status === 503,
      delayMs: (_error, context) => Math.min(1000 * 2 ** (context.attempt - 1), 30_000)},
  },
})]};

@Component({selector: 'app-recovery', template: '{{ rowsQuery.status() }}'})
export class RecoveryComponent {
  private readonly http = inject(HttpClient);
  readonly rowsQuery = queryResource(() => ({
    key: ['rows'], loader: () => this.http.get<{id: string}[]>('/api/rows'),
  }));
}`);
}
