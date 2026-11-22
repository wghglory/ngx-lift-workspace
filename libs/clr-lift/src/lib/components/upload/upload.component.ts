import {isPlatformBrowser} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  PLATFORM_ID,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  linkedSignal,
  output,
  signal,
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {ClarityIcons, ClarityModule, uploadCloudIcon} from '@clr/angular';
import {UPLOAD_CHUNK_25MB, type UploadAdapter, type UploadError, type UploadItem, UploadQueueService} from 'ngx-lift';

import {TranslatePipe} from '../../pipes/translate.pipe';
import {TranslationService} from '../../services/translation.service';
import {filesFromDataTransfer} from './drop-files';
import {UploadPanelManager} from './upload-panel-manager';
import {uploadTranslations} from './upload.l10n';

ClarityIcons.addIcons(uploadCloudIcon);

/** Clarity file-selection host: validates a selection and enqueues it on the shared queue. */
@Component({
  selector: 'cll-upload',
  imports: [TranslatePipe, ClarityModule],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UploadComponent), multi: true}],
})
export class UploadComponent implements ControlValueAccessor {
  private static nextId = 0;

  private readonly queue = inject(UploadQueueService);
  private readonly translationService = inject(TranslationService);
  private readonly panelManager = inject(UploadPanelManager);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly tracked = new Map<string, true>();

  readonly adapter = input.required<UploadAdapter>();
  readonly multiple = input(false);
  readonly accept = input('');
  readonly maxSize = input(Infinity);
  readonly maxFiles = input(0);
  readonly chunkSize = input(UPLOAD_CHUNK_25MB);
  readonly concurrency = input(2);
  readonly autoRetry = input(false);
  /** false: validate and emit `filesChange` only; caller enqueues after confirmation. */
  readonly autoEnqueue = input(true);
  readonly maxRetries = input(3);
  readonly pollIntervalMs = input(10_000);
  readonly controlId = input('');
  readonly disabled = input(false);

  readonly filesChange = output<readonly File[]>();
  readonly validationErrors = output<readonly UploadError[]>();
  readonly uploadComplete = output<readonly UploadItem[]>();
  readonly uploadError = output<readonly UploadItem[]>();
  readonly uploadCancelled = output<readonly UploadItem[]>();

  readonly isDisabled = linkedSignal(() => this.disabled());
  readonly value = signal<readonly File[]>([]);
  readonly errors = signal<readonly UploadError[]>([]);
  readonly dragOver = signal(false);
  private dragDepth = 0;
  readonly showAcceptHint = computed(() => this.accept().trim().length > 0);
  readonly showMaxSizeHint = computed(() => Number.isFinite(this.maxSize()) && this.maxSize() > 0);
  readonly showMaxFilesHint = computed(() => this.maxFiles() > 0);
  readonly showDropzoneHint = computed(
    () => this.showAcceptHint() || this.showMaxSizeHint() || this.showMaxFilesHint(),
  );
  readonly fileNames = computed(() =>
    this.value()
      .map((file) => file.name)
      .join(', '),
  );
  readonly inputId: string = `cll-upload-${UploadComponent.nextId++}`;

  private onChange: (value: readonly File[]) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  constructor() {
    this.translationService.loadTranslationsForComponent('upload', uploadTranslations);
    effect(() => {
      if (this.disabled()) this.cancelTracked();
    });
  }

  writeValue(files: readonly File[] | null): void {
    this.clearItems();
    this.value.set(files ?? []);
  }

  registerOnChange(fn: (value: readonly File[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.isDisabled.set(disabled);
    if (disabled) this.cancelTracked();
  }

  onSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const selected = Array.from(input.files ?? []);
    input.value = '';
    this.onTouched();
    this.ingest(selected);
  }

  async onDrop(event: DragEvent): Promise<void> {
    event.preventDefault();
    this.dragDepth = 0;
    this.dragOver.set(false);
    if (this.isDisabled() || !event.dataTransfer) return;
    const files = await filesFromDataTransfer(event.dataTransfer);
    if (this.isDisabled()) return;
    this.onTouched();
    this.ingest(files);
  }

  onDragEnter(event: DragEvent): void {
    event.preventDefault();
    if (this.isDisabled()) return;
    this.dragDepth += 1;
    this.dragOver.set(true);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = this.isDisabled() ? 'none' : 'copy';
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.dragDepth = Math.max(0, this.dragDepth - 1);
    if (this.dragDepth === 0) this.dragOver.set(false);
  }

  /** Validates a selection and enqueues the accepted files on the shared queue. */
  private ingest(selected: readonly File[]): void {
    if (!selected.length || this.isDisabled()) return;

    const rejections: UploadError[] = [];
    const accepted: File[] = [];
    const limit = this.maxFiles() > 0 ? this.maxFiles() : Infinity;
    for (const file of selected) {
      if (!this.matchesAccept(file)) {
        rejections.push({code: 'upload.validation.accept', phase: 'validation', fileName: file.name});
      } else if (this.maxSize() === 0 || file.size > this.maxSize() * 1024 * 1024) {
        rejections.push({
          code: 'upload.validation.maxSize',
          phase: 'validation',
          message: String(this.maxSize()),
          fileName: file.name,
        });
      } else if (accepted.length >= limit) {
        rejections.push({
          code: 'upload.validation.maxFiles',
          phase: 'validation',
          message: String(limit),
          fileName: file.name,
        });
      } else {
        accepted.push(file);
      }
    }
    this.errors.set(rejections);
    if (rejections.length) this.validationErrors.emit(rejections);
    if (!accepted.length) return;

    const next = [...this.value(), ...accepted];
    this.value.set(next);
    this.onChange(next);
    this.filesChange.emit(next);

    // Staging mode: selection is validated and exposed, but the caller decides when to enqueue.
    if (!this.autoEnqueue()) return;

    this.openPanel();
    const items = this.queue.enqueue(accepted, {
      adapter: this.adapter(),
      chunkSize: this.chunkSize(),
      concurrency: this.concurrency(),
      autoRetry: this.autoRetry(),
      maxRetries: this.maxRetries(),
      pollIntervalMs: this.pollIntervalMs(),
    });
    for (const item of items) {
      this.tracked.set(item.id, true);
      void this.watch(item.id);
    }
  }

  clear(): void {
    this.clearItems();
    if (!this.value().length) return;
    this.value.set([]);
    this.onChange([]);
    this.filesChange.emit([]);
    this.errors.set([]);
  }

  clearValidationErrors(): void {
    this.errors.set([]);
  }

  private clearItems(): void {
    for (const id of this.tracked.keys()) this.queue.remove(id);
    this.tracked.clear();
  }

  private cancelTracked(): void {
    for (const id of this.tracked.keys()) this.queue.cancel(id);
  }

  /** Opens the shared panel and records this host as the focus-restoration trigger. */
  private openPanel(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.panelManager.ensurePanel();
    this.panelManager.setTrigger(this.host.nativeElement);
  }

  private async watch(id: string): Promise<void> {
    try {
      const item = await this.queue.completion(id);
      this.tracked.delete(id);
      this.uploadComplete.emit([item]);
    } catch (error) {
      this.tracked.delete(id);
      const item = this.queue.items().find((candidate) => candidate.id === id);
      if (!item) return;
      if (error instanceof DOMException && error.name === 'AbortError' && item.error?.phase !== 'cancel') {
        this.uploadCancelled.emit([item]);
      } else {
        this.uploadError.emit([item]);
      }
    }
  }

  private matchesAccept(file: File): boolean {
    const patterns = this.accept()
      .split(',')
      .map((pattern) => pattern.trim())
      .filter(Boolean);
    if (!patterns.length || patterns.includes('*')) return true;
    return patterns.some((pattern) => {
      if (pattern.startsWith('.')) return file.name.toLowerCase().endsWith(pattern.toLowerCase());
      if (pattern.endsWith('/*')) return file.type.startsWith(pattern.slice(0, -1));
      return file.type === pattern;
    });
  }
}
