import {isPlatformBrowser} from '@angular/common';
import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  computed,
  createComponent,
  effect,
  EnvironmentInjector,
  forwardRef,
  inject,
  input,
  linkedSignal,
  OnDestroy,
  output,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {UPLOAD_CHUNK_25MB, type UploadAdapter, type UploadError, type UploadItem, UploadQueueService} from 'ngx-lift';

import {TranslatePipe} from '../../pipes/translate.pipe';
import {TranslationService} from '../../services/translation.service';
import {UploadPanelComponent} from './upload-panel.component';
import {uploadTranslations} from './upload.l10n';

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
  private readonly queue = inject(UploadQueueService);
  private readonly translationService = inject(TranslationService);
  private readonly appRef = inject(ApplicationRef);
  private readonly environment = inject(EnvironmentInjector);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly tracked = new Map<string, true>();
  private panelRef?: ComponentRef<UploadPanelComponent>;

  readonly adapter = input.required<UploadAdapter>();
  readonly multiple = input(false);
  readonly accept = input('');
  readonly maxSize = input(Infinity);
  readonly maxFiles = input(0);
  readonly chunkSize = input(UPLOAD_CHUNK_25MB);
  readonly concurrency = input(2);
  readonly autoRetry = input(false);
  readonly maxRetries = input(3);
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
  readonly fileNames = computed(() =>
    this.value()
      .map((file) => file.name)
      .join(', '),
  );

  private onChange: (value: readonly File[]) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  constructor() {
    this.translationService.loadTranslationsForComponent('upload', uploadTranslations);
    effect(() => {
      if (this.disabled()) this.cancelTracked();
    });
  }

  ngOnDestroy(): void {
    this.panelRef?.destroy();
    this.panelRef = undefined;
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
    if (!selected.length || this.isDisabled()) return;

    const rejections: UploadError[] = [];
    const accepted: File[] = [];
    const limit = this.maxFiles() > 0 ? this.maxFiles() : Infinity;
    for (const file of selected) {
      if (!this.matchesAccept(file)) {
        rejections.push({code: 'upload.validation.accept', phase: 'validation', fileName: file.name});
      } else if (file.size > this.maxSize() * 1024 * 1024) {
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

    this.ensurePanel();
    const items = this.queue.enqueue(accepted, {
      adapter: this.adapter(),
      chunkSize: this.chunkSize(),
      concurrency: this.concurrency(),
      autoRetry: this.autoRetry(),
      maxRetries: this.maxRetries(),
      pollIntervalMs: 10_000,
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

  private ensurePanel(): void {
    if (!isPlatformBrowser(this.platformId) || document.querySelector('cll-upload-panel')) return;
    this.panelRef = createComponent(UploadPanelComponent, {environmentInjector: this.environment});
    this.appRef.attachView(this.panelRef.hostView);
    document.body.appendChild(this.panelRef.location.nativeElement);
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
      if (error instanceof DOMException && error.name === 'AbortError') {
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
