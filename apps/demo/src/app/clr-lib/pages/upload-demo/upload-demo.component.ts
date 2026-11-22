import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {
  mutateResource,
  queryResource,
  UPLOAD_CHUNK_5MB,
  type UploadAdapter,
  type UploadItem,
  UploadQueueService,
} from 'ngx-lift';
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

/** Demonstrates upload selection, the shared panel, forms and composition with query utilities. */
@Component({
  selector: 'app-upload-demo',
  imports: [
    ApiTableComponent,
    ClarityModule,
    DemoPlaygroundComponent,
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

  /** DSM-style release bundle staging: select -> inspect manifest -> confirm -> chunked upload. */
  readonly stagedBundle = signal<File | null>(null);
  readonly stagedBundleType = signal('');
  readonly confirmOpen = signal(false);
  readonly modalOpen = signal(false);

  /** Mirrors dsm-ui bundle types; the real app reads `*-release.json` from inside the ZIP. */
  private readonly bundleTypes: readonly {readonly pattern: RegExp; readonly key: string}[] = [
    {pattern: /ds[mo]-|control-plane/i, key: 'dsmBundle.type.controlPlane'},
    {pattern: /data-plane|dp-/i, key: 'dsmBundle.type.dataPlane'},
    {pattern: /data-service|ds-/i, key: 'dsmBundle.type.dataService'},
    {pattern: /k8s|kubernetes/i, key: 'dsmBundle.type.kubernetes'},
  ];

  stageBundle(files: readonly File[]): void {
    const file = files[0];
    if (!file) return;
    this.stagedBundle.set(file);
    const match = this.bundleTypes.find((type) => type.pattern.test(file.name));
    this.stagedBundleType.set(this.translation.translate(match?.key ?? 'dsmBundle.type.other'));
    this.confirmOpen.set(true);
  }

  confirmBundleUpload(): void {
    const file = this.stagedBundle();
    this.confirmOpen.set(false);
    if (!file) return;
    this.queue.enqueue([file], {
      adapter: this.adapter,
      chunkSize: this.chunk5Mb,
      concurrency: 2,
      autoRetry: true,
      maxRetries: 3,
      pollIntervalMs: 10_000,
    });
    this.stagedBundle.set(null);
  }

  cancelBundleUpload(): void {
    this.confirmOpen.set(false);
    this.stagedBundle.set(null);
  }

  private readonly bundleNames = signal<readonly string[]>([]);

  private readonly register = mutateResource(
    async (items: readonly UploadItem[]) => {
      await wait(100);
      this.registeredCount.update((count) => count + items.length);
      this.bundleNames.update((list) => [...list, ...items.map((item) => item.file.name)]);
      return items.length;
    },
    {invalidateTags: [{type: 'Bundle'}]},
  );

  private readonly bundlesQuery = queryResource(() => ({
    key: ['upload-demo', 'bundles'],
    loader: async () => this.bundleNames(),
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

  readonly dsmBundleHtml = highlight(
    [
      '<!-- Inline page, dsm-ui Update Bundles style -->',
      '<cll-upload [adapter]="adapter" [multiple]="false" accept=".zip"',
      '  [autoEnqueue]="false" [chunkSize]="chunk5Mb" [concurrency]="2"',
      '  (filesChange)="stageBundle($event)" />',
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
      "import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';",
      '',
      'bundlesForm = new FormGroup({',
      '  bundles: new FormControl<readonly File[] | null>(null),',
      '});',
      '',
      '<form [formGroup]="bundlesForm">',
      '  <cll-upload [adapter]="adapter" formControlName="bundles" [multiple]="true" />',
      '</form>',
      '<!-- ngModel: <cll-upload [(ngModel)]="files" [adapter]="adapter" name="bundles" /> -->',
    ].join('\n'),
  );

  readonly formsHtml = highlight(
    [
      '<form [formGroup]="bundlesForm">',
      '  <cll-upload [adapter]="adapter" formControlName="bundles" [multiple]="true" />',
      '</form>',
      '<button type="button" (click)="resetForm()">Reset</button>',
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
}
