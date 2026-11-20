import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {mutateResource, type UploadAdapter, type UploadItem} from 'ngx-lift';
import {PageContainerComponent, TranslatePipe, UploadComponent, UploadPanelComponent} from 'clr-lift';

import {DemoPlaygroundComponent} from '../../../shared/components/demo-playground/demo-playground.component';

const wait = (milliseconds: number) => new Promise<void>((resolve) => setTimeout(resolve, milliseconds));

@Component({
  selector: 'app-upload-demo',
  imports: [DemoPlaygroundComponent, PageContainerComponent, TranslatePipe, UploadComponent, UploadPanelComponent],
  templateUrl: './upload-demo.component.html',
  styleUrls: ['./upload-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadDemoComponent {
  readonly registeredCount = signal(0);

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

  readonly basicCode = [
    "import {UPLOAD_CHUNK_5MB, type UploadAdapter} from 'ngx-lift';",
    '',
    'readonly adapter: UploadAdapter = {',
    '  initiate: async (file) => ({uploadId: file.name}),',
    '  uploadChunk: async (request) => sendChunk(request),',
    '  combine: async (request) => finish(request),',
    '  cancel: async (uploadId) => remove(uploadId),',
    '};',
    '',
    '<cll-upload [adapter]="adapter" [multiple]="true" accept=".zip,.tar"',
    '  [chunkSize]="chunk5Mb" [concurrency]="2" (uploadComplete)="onComplete($event)" />',
    '<cll-upload-panel />',
  ].join('\n');

  readonly compositionCode = [
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
  ].join('\n');

  readonly httpClientCode = [
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
  ].join('\n');

  onComplete(items: readonly UploadItem[]): void {
    void this.register.mutate(items);
  }
}
