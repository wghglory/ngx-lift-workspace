import {HttpClient} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, computed, ElementRef, inject, signal, viewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {UploadQueueService} from 'ngx-lift';
import {TranslatePipe, UploadComponent, UploadPanelManager} from 'clr-lift';

import {createS3DemoAdapter} from './s3-upload-demo.adapter';

/** Application composition of the existing queue; no S3 API is added to either library. */
@Component({
  selector: 'app-s3-upload-demo',
  imports: [ClarityModule, FormsModule, TranslatePipe, UploadComponent],
  templateUrl: './s3-upload-demo.component.html',
  styles: [':host { display: block; } form > * { margin: 0; } code { overflow-wrap: anywhere; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class S3UploadDemoComponent {
  private readonly http = inject(HttpClient);
  private readonly queue = inject(UploadQueueService);
  private readonly picker = viewChild.required(UploadComponent);
  private readonly pickerHost = viewChild.required<UploadComponent, ElementRef<HTMLElement>>(UploadComponent, {
    read: ElementRef,
  });
  private readonly panelManager = inject(UploadPanelManager);
  readonly bucket = signal('demo-uploads');
  readonly prefix = signal('documents/');
  readonly overwrite = signal(false);
  readonly files = signal<readonly File[]>([]);
  readonly stored = signal<readonly string[]>([]);
  readonly disabled = computed(() => !this.bucket().trim() || !this.files().length);
  // The picker requires an adapter even in staging mode; only enqueue() below uses it.
  readonly stagingAdapter = createS3DemoAdapter(this.http, {bucket: '', prefix: '', overwrite: false}, () => undefined);

  clearSelection(): void {
    this.picker().clear();
    this.files.set([]);
  }

  upload(): void {
    if (this.disabled()) return;
    const adapter = createS3DemoAdapter(
      this.http,
      {bucket: this.bucket().trim(), prefix: this.prefix(), overwrite: this.overwrite()},
      (path) => this.stored.update((paths) => [...new Set([...paths, path])]),
    );
    this.panelManager.ensurePanel();
    const browse = this.pickerHost().nativeElement.querySelector<HTMLButtonElement>('.cll-upload__browse');
    if (browse) this.panelManager.setTrigger(browse);
    this.queue.enqueue(this.files(), {
      adapter,
      // One PUT per object, including empty files. A smaller chunk size would overwrite the same key repeatedly.
      chunkSize: Number.MAX_SAFE_INTEGER,
      concurrency: 1,
      autoRetry: false,
      maxRetries: 0,
      pollIntervalMs: 1000,
    });
    // clear() is safe here: staged selection owns no queue items.
    this.picker().clear();
    this.files.set([]);
  }
}
