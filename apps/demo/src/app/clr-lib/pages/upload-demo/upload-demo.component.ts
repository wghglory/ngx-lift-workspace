import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {mutateResource, type UploadAdapter, type UploadItem, UPLOAD_CHUNK_5MB} from 'ngx-lift';
import {PageContainerComponent, TranslatePipe, UploadComponent, UploadPanelComponent} from 'clr-lift';

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
  readonly registeredCount = signal(0);
  readonly chunk5Mb = UPLOAD_CHUNK_5MB;

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

  readonly inputs: ApiProperty[] = [
    {
      name: 'adapter',
      type: 'UploadAdapter',
      required: true,
      description: 'Transport for initiate, chunk, combine and cancel.',
    },
    {name: 'accept', type: 'string', defaultValue: "''", description: 'Allowed extensions or MIME patterns.'},
    {name: 'maxSize', type: 'number', defaultValue: 'Infinity', description: 'Maximum file size in MiB.'},
    {
      name: 'maxFiles',
      type: 'number',
      defaultValue: '0',
      description: 'Maximum number of files per selection; 0 means unlimited.',
    },
    {name: 'chunkSize', type: 'number', defaultValue: 'UPLOAD_CHUNK_25MB', description: 'Bytes per chunk.'},
    {
      name: 'concurrency',
      type: 'number',
      defaultValue: '2',
      description: 'In-flight chunks for one file, from 1 to 4.',
    },
    {name: 'multiple', type: 'boolean', defaultValue: 'false', description: 'Allow more than one file per selection.'},
    {
      name: 'autoRetry',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Retry retryable chunk errors automatically.',
    },
    {
      name: 'maxRetries',
      type: 'number',
      defaultValue: '3',
      description: 'Automatic retry limit for retryable chunk errors.',
    },
    {name: 'controlId', type: 'string', defaultValue: "''", description: 'Identifier of the native file input.'},
    {
      name: 'disabled',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Disable selection and cancel in-flight items.',
    },
  ];

  readonly outputs: ApiProperty[] = [
    {name: 'filesChange', type: 'readonly File[]', description: 'Selected files after validation.'},
    {name: 'validationErrors', type: 'readonly UploadError[]', description: 'Rejected files and localized reasons.'},
    {
      name: 'uploadComplete',
      type: 'readonly UploadItem[]',
      description: 'Items that reached a terminal success state.',
    },
    {name: 'uploadError', type: 'readonly UploadItem[]', description: 'Items that ended in an error state.'},
    {name: 'uploadCancelled', type: 'readonly UploadItem[]', description: 'Items that ended in a cancelled state.'},
  ];

  readonly methods: ApiProperty[] = [
    {name: 'clear()', description: 'Remove selected files and their queue items.'},
    {name: 'clearValidationErrors()', description: 'Dismiss the validation error list.'},
    {name: 'writeValue(files)', description: 'ControlValueAccessor write; replaces the current selection.'},
    {name: 'setDisabledState(disabled)', description: 'ControlValueAccessor disabled state; cancels in-flight items.'},
  ];

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
