import {HttpClient, HttpEventType} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, computed, inject, signal, viewChild} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {
  mutateResource,
  queryResource,
  toSignalForm,
  UPLOAD_CHUNK_5MB,
  type UploadAdapter,
  type UploadItem,
  UploadQueueService,
} from 'ngx-lift';
import {
  AlertComponent,
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

/** Demonstrates upload selection, the shared panel, forms and composition with query utilities. */
@Component({
  selector: 'app-upload-demo',
  imports: [
    AlertComponent,
    ApiTableComponent,
    ClarityModule,
    DemoPlaygroundComponent,
    FormsModule,
    PageContainerComponent,
    ReactiveFormsModule,
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
  private readonly queue = inject(UploadQueueService);
  private readonly http = inject(HttpClient);
  readonly registeredCount = signal(0);
  readonly cancelledCount = signal(0);
  readonly chunk5Mb = UPLOAD_CHUNK_5MB;

  private readonly api = (name: string): string => this.translation.translate(`uploadDemo.api.${name}`);

  /** Basic adapter: fixed-latency chunks with real byte progress. */
  readonly adapter: UploadAdapter = {
    initiate: async (file) => ({uploadId: `${file.name}-${Date.now()}`}),
    uploadChunk: async (request) => {
      await wait(80);
      request.onProgress(request.chunk.size);
    },
    combine: async () => wait(150),
    cancel: async () => undefined,
  };

  /** Failure adapter: 'failing.zip' drops its first chunk once with a retryable error. */
  readonly failingAdapter: UploadAdapter = {
    initiate: async (file) => ({uploadId: `${file.name}-${Date.now()}`}),
    uploadChunk: async (request) => {
      if (request.uploadId.startsWith('failing.zip') && !this.failedUploadIds.has(request.uploadId)) {
        this.failedUploadIds.add(request.uploadId);
        await wait(120);
        throw {code: 'demo.transient', phase: 'chunk', retryable: true, message: 'Simulated transient chunk failure'};
      }
      await wait(80);
      request.onProgress(request.chunk.size);
    },
    combine: async () => wait(150),
    cancel: async () => undefined,
  };

  private readonly failedUploadIds = new Set<string>();

  /** Slow adapter so active items can be cancelled or sent to the background. */
  readonly slowAdapter: UploadAdapter = {
    initiate: async (file) => ({uploadId: `${file.name}-${Date.now()}`}),
    uploadChunk: async (request) => {
      await wait(700);
      request.onProgress(request.chunk.size);
    },
    combine: async () => wait(400),
    cancel: async () => undefined,
  };

  /** Panel adapter for the headless demo-file enqueue on the panel tab. */
  private readonly panelAdapter: UploadAdapter = this.slowAdapter;

  readonly bundlesForm = new FormGroup({
    bundles: new FormControl<readonly File[] | null>(null),
  });
  readonly ngModelFiles = signal<readonly File[]>([]);
  readonly signalFormGroup = new FormGroup({
    bundles: new FormControl<readonly File[] | null>(null),
  });
  private readonly signalForm = toSignalForm(this.signalFormGroup);
  readonly signalFormValue = this.signalForm.controlValue('bundles');

  /** Confirm-first upload: select -> inspect file metadata -> confirm -> chunked upload. */
  readonly stagedFiles = signal<readonly File[]>([]);
  readonly duplicateNames = signal<readonly string[]>([]);
  readonly confirmOpen = signal(false);
  readonly modalOpen = signal(false);
  readonly apiCalls = signal<readonly string[]>([]);
  private readonly inlineUpload = viewChild<UploadComponent>('inlineUpload');
  private readonly modalUpload = viewChild<UploadComponent>('modalUpload');

  /** Adapter that logs simulated REST calls so the transport contract is visible in the demo. */
  readonly apiAdapter: UploadAdapter = {
    initiate: async (file) => {
      this.logApi('POST', `/api/bundles/initiate?name=${encodeURIComponent(file.name)}`);
      return {uploadId: `${file.name}-${Date.now()}`};
    },
    uploadChunk: async (request) => {
      await wait(120);
      request.onProgress(request.chunk.size);
      this.logApi('PUT', `/api/bundles/${request.uploadId}/chunks/${request.chunkNumber}`);
    },
    combine: async ({uploadId}) => {
      await wait(200);
      this.logApi('POST', `/api/bundles/${uploadId}/combine`);
    },
    cancel: async (uploadId) => this.logApi('DELETE', `/api/bundles/${uploadId}`),
  };

  /** Executable HttpClient transport: maps progress events and bridges abort to the adapter contract. */
  readonly httpAdapter: UploadAdapter = {
    initiate: async (file) => ({uploadId: `${file.name}-${Date.now()}`}),
    uploadChunk: (request) =>
      new Promise<void>((resolve, reject) => {
        const subscription = this.http
          .post(`/api/upload/${encodeURIComponent(request.uploadId)}/${request.chunkNumber}`, request.chunk, {
            reportProgress: true,
            observe: 'events',
            responseType: 'text',
          })
          .subscribe({
            next: (event) => {
              if (event.type === HttpEventType.UploadProgress) request.onProgress(event.loaded ?? 0);
            },
            error: reject,
            complete: () => resolve(),
          });
        request.signal.addEventListener(
          'abort',
          () => {
            subscription.unsubscribe();
            reject(new DOMException('Upload cancelled', 'AbortError'));
          },
          {once: true},
        );
      }),
    combine: async () => undefined,
    cancel: async () => undefined,
  };
  readonly httpResult = signal('');

  stageFiles(files: readonly File[]): void {
    if (!files.length) return;
    // De-dupe against the LIVE queue only: a cancelled/cleared item must be selectable again.
    const queuedKeys = new Set(
      this.queue
        .items()
        .filter((item) => item.status === 'queued' || item.status === 'uploading' || item.status === 'processing')
        .map((item) => this.fileKey(item.file)),
    );
    const staged = new Map(this.stagedFiles().map((file) => [this.fileKey(file), file]));
    const duplicates = new Set<string>();
    for (const file of files) {
      const key = this.fileKey(file);
      if (staged.has(key) || queuedKeys.has(key)) duplicates.add(file.name);
      else staged.set(key, file);
    }
    this.stagedFiles.set([...staged.values()]);
    this.duplicateNames.set([...duplicates]);
    if (staged.size > 0 || files.length > 0) this.confirmOpen.set(true);
  }

  confirmUpload(): void {
    const files = this.stagedFiles();
    this.confirmOpen.set(false);
    this.modalOpen.set(false);
    if (!files.length) return;
    this.queue.enqueue(files, {
      adapter: this.apiAdapter,
      chunkSize: this.chunk5Mb,
      concurrency: 2,
      autoRetry: true,
      maxRetries: 3,
      pollIntervalMs: 10_000,
    });
    this.clearStaging();
  }

  cancelUpload(): void {
    this.confirmOpen.set(false);
    this.clearStaging();
  }

  cancelModalUpload(): void {
    this.modalOpen.set(false);
    this.clearStaging();
  }

  /** Clears staged state AND the host's own selection so the next pick starts fresh. */
  private clearStaging(): void {
    this.inlineUpload()?.clear();
    this.modalUpload()?.clear();
    this.stagedFiles.set([]);
    this.duplicateNames.set([]);
  }

  fileTrackKey(file: File): string {
    return this.fileKey(file);
  }

  private logApi(method: string, path: string): void {
    const entry = `${method} ${path}`;
    this.apiCalls.update((calls) => [entry, ...calls].slice(0, 20));
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    const units = ['KB', 'MB', 'GB'];
    let value = bytes;
    let unit = -1;
    do {
      value /= 1024;
      unit += 1;
    } while (value >= 1024 && unit < units.length - 1);
    return `${value >= 100 ? Math.round(value) : Math.round(value * 10) / 10} ${units[unit]}`;
  }

  private fileKey(file: File): string {
    // Keep folder-relative paths so same-named bundles in different folders stay distinct.
    const path = (file as File & {webkitRelativePath?: string}).webkitRelativePath ?? '';
    return `${path}|${file.name}|${file.size}|${file.type}`;
  }

  private readonly registeredBundles = signal<readonly {readonly id: string; readonly name: string}[]>([]);

  private readonly register = mutateResource(
    async (items: readonly UploadItem[]) => {
      await wait(100);
      this.registeredCount.update((count) => count + items.length);
      this.registeredBundles.update((list) => [...list, ...items.map((item) => ({id: item.id, name: item.file.name}))]);
      return items.length;
    },
    {invalidateTags: [{type: 'Bundle'}]},
  );

  private readonly bundlesQuery = queryResource(() => ({
    key: ['upload-demo', 'bundles'],
    loader: async () => this.registeredBundles(),
    tags: [{type: 'Bundle'}],
  }));
  readonly bundleList = this.bundlesQuery.value;

  onComplete(items: readonly UploadItem[]): void {
    void this.register.mutate(items);
  }

  onFailedComplete(items: readonly UploadItem[]): void {
    void this.register.mutate(items);
  }

  onCancelled(): void {
    this.cancelledCount.update((count) => count + 1);
  }

  /** Adds synthetic files through the headless queue so panel journeys run without the OS dialog. */
  addDemoFiles(): void {
    this.queue.enqueue(
      [
        new File([new Uint8Array(1_400_000)], 'release-bundle.zip'),
        new File([new Uint8Array(900_000)], 'onboarding-demo.mp4'),
        new File([new Uint8Array(600_000)], 'design-tokens-v4.zip'),
      ],
      {
        adapter: this.panelAdapter,
        chunkSize: 512_000,
        concurrency: 2,
        autoRetry: false,
        maxRetries: 3,
        pollIntervalMs: 10_000,
      },
    );
  }

  transferDemo(): void {
    void this.addAndAwait();
  }

  /** Awaits completion so both the success and abort/failure paths are observable in the browser. */
  transferHttp(): void {
    this.httpResult.set('');
    const [item] = this.queue.enqueue([new File([new Uint8Array(700_000)], 'http-bundle.zip')], {
      adapter: this.httpAdapter,
      chunkSize: 350_000,
      concurrency: 1,
      autoRetry: false,
      maxRetries: 3,
      pollIntervalMs: 10_000,
    });
    void this.queue.completion(item.id).then(
      (finished) => {
        this.httpResult.set(finished.status);
        void this.register.mutate([finished]);
      },
      (error: unknown) => {
        const message = error instanceof Error ? error.message : (error as {message?: string})?.message;
        this.httpResult.set(message || 'Upload failed');
      },
    );
  }

  private async addAndAwait(): Promise<void> {
    const [item] = this.queue.enqueue([new File([new Uint8Array(700_000)], 'container-image.tar')], {
      adapter: this.adapter,
      chunkSize: 350_000,
      concurrency: 2,
      autoRetry: false,
      maxRetries: 3,
      pollIntervalMs: 10_000,
    });
    try {
      const finished = await this.queue.completion(item.id);
      await this.register.mutate([finished]);
    } catch {
      /* UploadError or AbortError: no business write */
    }
  }

  resetForm(): void {
    this.bundlesForm.reset();
  }

  readonly inputs = computed<ApiProperty[]>(() => [
    {name: 'adapter', type: 'UploadAdapter', required: true, description: this.api('adapter')},
    {name: 'accept', type: 'string', defaultValue: "''", description: this.api('accept')},
    {name: 'maxSize', type: 'number', defaultValue: 'Infinity', description: this.api('maxSize')},
    {name: 'maxFiles', type: 'number', defaultValue: '0', description: this.api('maxFiles')},
    {name: 'chunkSize', type: 'number', defaultValue: 'UPLOAD_CHUNK_25MB', description: this.api('chunkSize')},
    {name: 'concurrency', type: 'number', defaultValue: '2', description: this.api('concurrency')},
    {name: 'multiple', type: 'boolean', defaultValue: 'false', description: this.api('multiple')},
    {name: 'autoRetry', type: 'boolean', defaultValue: 'false', description: this.api('autoRetry')},
    {name: 'autoEnqueue', type: 'boolean', defaultValue: 'true', description: this.api('autoEnqueue')},
    {name: 'maxRetries', type: 'number', defaultValue: '3', description: this.api('maxRetries')},
    {name: 'pollIntervalMs', type: 'number', defaultValue: '10000', description: this.api('pollIntervalMs')},
    {name: 'controlId', type: 'string', defaultValue: "''", description: this.api('controlId')},
    {name: 'disabled', type: 'boolean', defaultValue: 'false', description: this.api('disabled')},
  ]);

  readonly outputs = computed<ApiProperty[]>(() => [
    {name: 'filesChange', type: 'readonly File[]', description: this.api('filesChange')},
    {name: 'validationErrors', type: 'readonly UploadError[]', description: this.api('validationErrors')},
    {name: 'uploadComplete', type: 'readonly UploadItem[]', description: this.api('uploadComplete')},
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

  readonly confirmHtml = highlight(
    [
      '<!-- Inline page: select -> confirm -> upload -->',
      '<cll-upload [adapter]="adapter" [multiple]="true" accept=".zip,.tar"',
      '  [autoEnqueue]="false" (filesChange)="stageFiles($event)" />',
      '<clr-modal [(clrModalOpen)]="confirmOpen"> ... </clr-modal>',
      '<cll-upload-panel /> <!-- one global window; survives route changes -->',
    ].join('\n'),
  );

  readonly configurationCode = highlight(
    [
      '<cll-upload [adapter]="adapter" [multiple]="true" accept=".png,.jpg,.pdf"',
      '  [maxFiles]="3" [maxSize]="1" [autoRetry]="true" [maxRetries]="3"',
      '  [chunkSize]="UPLOAD_CHUNK_25MB" [concurrency]="4" />',
    ].join('\n'),
  );

  readonly failureCode = highlight(
    [
      "// A chunk error marks the item 'error'; retry re-sends only unacknowledged chunks.",
      'uploadChunk: async (request) => {',
      "  if (request.uploadId.startsWith('failing.zip') && !this.failedUploadIds.has(request.uploadId)) {",
      '    this.failedUploadIds.add(request.uploadId);',
      "    throw {code: 'demo.transient', phase: 'chunk', retryable: true};",
      '  }',
      '  await sendChunk(request);',
      '},',
    ].join('\n'),
  );

  readonly panelCode = highlight(
    [
      "import {UploadQueueService} from 'ngx-lift';",
      '',
      'private readonly queue = inject(UploadQueueService);',
      '',
      '// Headless enqueue: the shared panel appears on the first item.',
      'this.queue.enqueue(files, {adapter, chunkSize, concurrency: 2, autoRetry: false, maxRetries: 3, pollIntervalMs: 10_000});',
      '',
      '// Window controls: Minimize docks to a badge; Close with active items',
      '// asks between background upload and cancel-all; it never cancels silently.',
    ].join('\n'),
  );

  readonly formsCode = highlight(
    [
      "import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';",
      "import {toSignalForm} from 'ngx-lift';",
      '',
      'readonly bundlesForm = new FormGroup({bundles: new FormControl<readonly File[] | null>(null)});',
      'readonly signalForm = toSignalForm(this.bundlesForm);',
      "readonly value = this.signalForm.controlValue('bundles');",
      'readonly ngModelFiles = signal<readonly File[]>([]);',
    ].join('\n'),
  );

  readonly formsHtml = highlight(
    [
      '<form [formGroup]="bundlesForm">',
      '  <cll-upload [adapter]="adapter" formControlName="bundles" [multiple]="true" />',
      '</form>',
      '<form>',
      '  <cll-upload [adapter]="adapter" name="bundles" [ngModel]="ngModelFiles()"',
      '    (ngModelChange)="ngModelFiles.set($event)" [multiple]="true" />',
      '</form>',
      '<form [formGroup]="signalForm">',
      '  <cll-upload [adapter]="adapter" formControlName="bundles" [multiple]="true" />',
      '</form>',
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
      'await this.register.mutate(finished); // the active query refetches on its own',
    ].join('\n'),
  );

  readonly httpClientCode = highlight(
    [
      "import {HttpClient, HttpEventType} from '@angular/common/http';",
      '',
      'uploadChunk: (request) => new Promise<void>((resolve, reject) => {',
      '  const subscription = this.http.post(url, request.chunk, {',
      "    reportProgress: true, observe: 'events', responseType: 'text',",
      '  }).subscribe({',
      '    next: (event) => {',
      '      if (event.type === HttpEventType.UploadProgress) request.onProgress(event.loaded ?? 0);',
      '    },',
      '    error: reject,',
      '    complete: () => resolve(),',
      '  });',
      "  request.signal.addEventListener('abort', () => {",
      '    subscription.unsubscribe();',
      "    reject(new DOMException('Upload cancelled', 'AbortError'));",
      '  }, {once: true});',
      '}),',
    ].join('\n'),
  );
}
