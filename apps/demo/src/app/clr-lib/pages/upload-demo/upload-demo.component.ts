import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {mutateResource, type UploadAdapter, type UploadItem, UPLOAD_CHUNK_5MB} from 'ngx-lift';
import {
  PageContainerComponent,
  TranslatePipe,
  TranslationService,
  UploadComponent,
  UploadPanelComponent,
} from 'clr-lift';

import {ApiProperty, ApiTableComponent} from '../../../shared/components/api-table';
import {DemoPlaygroundComponent} from '../../../shared/components/demo-playground/demo-playground.component';
import {highlight} from '../../../shared/utils/highlight.util';

const wait = (milliseconds: number) => new Promise<void>((resolve) => setTimeout(resolve, milliseconds));

/** Demonstrates upload selection, the shared panel and composition with query utilities. */
@Component({
  selector: 'app-upload-demo',
  imports: [
    ApiTableComponent,
    DemoPlaygroundComponent,
    PageContainerComponent,
    TranslatePipe,
    UploadComponent,
    UploadPanelComponent,
  ],
  templateUrl: './upload-demo.component.html',
  styleUrls: ['./upload-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadDemoComponent {
  private readonly translation = inject(TranslationService);
  readonly registeredCount = signal(0);
  readonly chunk5Mb = UPLOAD_CHUNK_5MB;

  private readonly api = (name: string): string => this.translation.translate(`uploadDemo.api.${name}`);

  readonly adapter: UploadAdapter = {
    initiate: async (file) => ({uploadId: `${file.name}-${Date.now()}`}),
    uploadChunk: async (request) => {
      await wait(80);
      request.onProgress(request.chunk.size);
    },
    combine: async () => wait(150),
    cancel: async () => undefined,
  };

  private readonly register = mutateResource(
    async (items: readonly UploadItem[]) => {
      await wait(100);
      this.registeredCount.update((count) => count + items.length);
      return items.length;
    },
    {invalidateTags: [{type: 'Bundle'}]},
  );

  readonly inputs = computed<ApiProperty[]>(() => [
    {
      name: 'adapter',
      type: 'UploadAdapter',
      required: true,
      description: this.api('adapter'),
    },
    {name: 'accept', type: 'string', defaultValue: "''", description: this.api('accept')},
    {name: 'maxSize', type: 'number', defaultValue: 'Infinity', description: this.api('maxSize')},
    {
      name: 'maxFiles',
      type: 'number',
      defaultValue: '0',
      description: this.api('maxFiles'),
    },
    {name: 'chunkSize', type: 'number', defaultValue: 'UPLOAD_CHUNK_25MB', description: this.api('chunkSize')},
    {
      name: 'concurrency',
      type: 'number',
      defaultValue: '2',
      description: this.api('concurrency'),
    },
    {name: 'multiple', type: 'boolean', defaultValue: 'false', description: this.api('multiple')},
    {
      name: 'autoRetry',
      type: 'boolean',
      defaultValue: 'false',
      description: this.api('autoRetry'),
    },
    {
      name: 'maxRetries',
      type: 'number',
      defaultValue: '3',
      description: this.api('maxRetries'),
    },
    {name: 'controlId', type: 'string', defaultValue: "''", description: this.api('controlId')},
    {
      name: 'disabled',
      type: 'boolean',
      defaultValue: 'false',
      description: this.api('disabled'),
    },
  ]);

  readonly outputs = computed<ApiProperty[]>(() => [
    {name: 'filesChange', type: 'readonly File[]', description: this.api('filesChange')},
    {name: 'validationErrors', type: 'readonly UploadError[]', description: this.api('validationErrors')},
    {
      name: 'uploadComplete',
      type: 'readonly UploadItem[]',
      description: this.api('uploadComplete'),
    },
    {name: 'uploadError', type: 'readonly UploadItem[]', description: this.api('uploadError')},
    {name: 'uploadCancelled', type: 'readonly UploadItem[]', description: this.api('uploadCancelled')},
  ]);

  readonly methods = computed<ApiProperty[]>(() => [
    {name: 'clear()', description: this.api('clear')},
    {name: 'clearValidationErrors()', description: this.api('clearValidationErrors')},
    {name: 'writeValue(files)', description: this.api('writeValue')},
    {name: 'setDisabledState(disabled)', description: this.api('setDisabledState')},
  ]);

  readonly basicCode = highlight(
    [
      "import {UPLOAD_CHUNK_5MB, type UploadAdapter} from 'ngx-lift';",
      '',
      'readonly adapter: UploadAdapter = {',
      '  initiate: async (file) => ({uploadId: file.name}),',
      '  uploadChunk: async (request) => sendChunk(request),',
      '  combine: async (request) => finish(request),',
      '  cancel: async (uploadId) => remove(uploadId),',
      '};',
    ].join('\n'),
  );

  readonly basicHtml = highlight(
    [
      '<cll-upload [adapter]="adapter" [multiple]="true" accept=".zip,.tar"',
      '  [chunkSize]="chunk5Mb" [concurrency]="2" (uploadComplete)="onComplete($event)" />',
      '<cll-upload-panel />',
    ].join('\n'),
  );

  readonly compositionCode = highlight(
    [
      "import {mutateResource, queryResource, type UploadItem, UploadQueueService} from 'ngx-lift';",
      '',
      'readonly bundles = queryResource(() => ({',
      "  key: ['bundles', 'list'],",
      '  loader: () => this.api.listBundles(),',
      "  tags: [{type: 'Bundle'}],",
      '}));',
      '',
      'private readonly register = mutateResource((item: UploadItem) => this.api.registerBundle(item), {',
      "  invalidateTags: [{type: 'Bundle'}],",
      '});',
      '',
      'const [item] = this.queue.enqueue(files, options);',
      'const finished = await this.queue.completion(item.id);',
      'await this.register.mutate(finished);',
    ].join('\n'),
  );

  readonly httpClientCode = highlight(
    [
      "import {HttpClient, HttpEventType, HttpUploadProgressEvent} from '@angular/common/http';",
      '',
      'uploadChunk: (request) => new Promise<void>((resolve, reject) => {',
      '  const body = new FormData();',
      "  body.append('chunk', request.chunk);",
      "  const subscription = this.http.post(url, body, {reportProgress: true, observe: 'events'}).subscribe({",
      '    next: (event) => {',
      '      if (event.type === HttpEventType.UploadProgress) {',
      '        request.onProgress((event as HttpUploadProgressEvent).loaded);',
      '      }',
      '    },',
      '    error: (error) => reject(error),',
      '    complete: () => resolve(),',
      '  });',
      "  request.signal.addEventListener('abort', () => {",
      '    subscription.unsubscribe();',
      "    reject(new DOMException('Upload cancelled', 'AbortError'));",
      '  }, {once: true});',
      '}),',
    ].join('\n'),
  );

  onComplete(items: readonly UploadItem[]): void {
    void this.register.mutate(items);
  }
}
