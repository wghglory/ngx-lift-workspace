import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  computed,
  effect,
  inject,
  Injector,
  signal,
} from '@angular/core';
import {
  ClarityModule,
  ClarityIcons,
  angleIcon,
  checkCircleIcon,
  exclamationTriangleIcon,
  uploadCloudIcon,
  windowCloseIcon,
  windowMinIcon,
} from '@clr/angular';
import {type UploadItem, type UploadStatus, UploadQueueService} from 'ngx-lift';

import {TranslatePipe} from '../../pipes/translate.pipe';
import {TranslationService} from '../../services/translation.service';
import {UploadPanelManager} from './upload-panel-manager';
import {uploadTranslations} from './upload.l10n';

const ACTIVE_STATUSES: readonly UploadStatus[] = ['queued', 'uploading', 'processing'];

ClarityIcons.addIcons(
  angleIcon,
  checkCircleIcon,
  exclamationTriangleIcon,
  uploadCloudIcon,
  windowCloseIcon,
  windowMinIcon,
);

/**
 * The transfer window itself: window controls, batch actions and per-item progress.
 *
 * Instantiated only by `UploadPanelManager` inside its application-wide overlay, so it
 * survives route changes and host teardown. Not part of the public component API.
 */
@Component({
  selector: 'cll-upload-panel-window',
  imports: [TranslatePipe, ClarityModule],
  templateUrl: './upload-panel-window.component.html',
  styleUrls: ['./upload-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadPanelWindowComponent {
  private readonly translationService = inject(TranslationService);
  private readonly manager = inject(UploadPanelManager);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  readonly queue = inject(UploadQueueService);
  readonly announcement = signal('');
  readonly closed = signal(false);
  readonly expanded = signal(true);
  readonly summaryExpanded = signal(false);
  readonly confirmingClose = signal(false);

  readonly visible = computed(() => this.queue.items().length > 0 && !this.closed());
  readonly activeItems = computed(() => this.queue.items().filter((item) => ACTIVE_STATUSES.includes(item.status)));
  readonly errorItems = computed(() => this.queue.items().filter((item) => item.status === 'error'));
  readonly cancelledItems = computed(() => this.queue.items().filter((item) => item.status === 'cancelled'));
  readonly successItems = computed(() => this.queue.items().filter((item) => item.status === 'success'));
  readonly terminalItems = computed(() => [...this.errorItems(), ...this.cancelledItems(), ...this.successItems()]);
  readonly hasActive = computed(() => this.activeItems().length > 0);
  readonly uploadedTotal = computed(() => this.queue.items().reduce((sum, item) => sum + item.uploadedBytes, 0));
  readonly totalBytes = computed(() => this.queue.items().reduce((sum, item) => sum + item.file.size, 0));
  readonly remainingSeconds = computed(() => {
    const remaining = this.totalBytes() - this.uploadedTotal();
    if (this.rateBytesPerSecond <= 0 || remaining <= 0) return undefined;
    return Math.max(1, Math.round(remaining / this.rateBytesPerSecond));
  });

  private readonly announced = new Set<string>();
  private readonly seenTotal = signal(0);
  private lastSampleBytes = 0;
  private lastSampleAt = 0;
  private rateBytesPerSecond = 0;
  private readonly itemSamples = new Map<string, {bytes: number; at: number}>();
  private readonly itemSmoothed = new Map<string, number>();
  private readonly itemRates = signal<Readonly<Record<string, number>>>({});

  constructor() {
    this.translationService.loadTranslationsForComponent('upload', uploadTranslations);
    effect(() => {
      const total = this.queue.aggregate().total;
      if (total > this.seenTotal()) {
        this.closed.set(false);
        this.confirmingClose.set(false);
      }
      this.seenTotal.set(total);
    });
    effect(() => {
      const bytes = this.uploadedTotal();
      const now = this.now();
      if (this.lastSampleAt > 0 && bytes > this.lastSampleBytes && now > this.lastSampleAt) {
        const instant = ((bytes - this.lastSampleBytes) / (now - this.lastSampleAt)) * 1000;
        this.rateBytesPerSecond = this.smoothRate(this.rateBytesPerSecond, instant);
      }
      this.lastSampleBytes = bytes;
      this.lastSampleAt = now;
    });
    effect(() => {
      const uploading = this.queue.items().filter((item) => item.status === 'uploading');
      const now = this.now();
      const next: Record<string, number> = {};
      for (const item of uploading) {
        const sample = this.itemSamples.get(item.id);
        if (sample && now > sample.at && item.uploadedBytes > sample.bytes) {
          const instant = ((item.uploadedBytes - sample.bytes) / (now - sample.at)) * 1000;
          const rate = this.smoothRate(this.itemSmoothed.get(item.id) ?? 0, instant);
          this.itemSmoothed.set(item.id, rate);
          next[item.id] = rate;
        }
        this.itemSamples.set(item.id, {bytes: item.uploadedBytes, at: now});
      }
      for (const id of [...this.itemSamples.keys()]) {
        if (!uploading.some((item) => item.id === id)) {
          this.itemSamples.delete(id);
          this.itemSmoothed.delete(id);
        }
      }
      this.itemRates.set(next);
    });
    effect(() => {
      const items = this.queue.items();
      if (!items.length || typeof document === 'undefined') return;
      for (const key of [...this.announced]) {
        if (!items.some((item) => key.startsWith(`${item.id}:`))) this.announced.delete(key);
      }
      const messages = items.map((item) => this.announcementFor(item)).filter((message) => message !== undefined);
      if (messages.length) this.announcement.set(messages.join(' '));
    });
  }

  minimize(): void {
    this.queue.minimize();
    this.focusAfterRender('.cll-upload-panel__badge');
  }

  restore(): void {
    this.queue.restore();
    this.focusAfterRender('.cll-upload-panel__minimize');
  }

  toggleExpanded(): void {
    this.expanded.update((value) => !value);
  }

  toggleSummary(): void {
    this.summaryExpanded.update((value) => !value);
  }

  /** Close with active items asks first; closing never cancels uploads. */
  requestClose(): void {
    if (this.hasActive()) {
      this.confirmingClose.set(true);
      this.focusAfterRender('.cll-upload-panel__confirm-background');
      return;
    }
    this.closeIdle();
  }

  /** "Keep uploading in the background": dismiss to the badge, uploads continue. */
  keepInBackground(): void {
    this.confirmingClose.set(false);
    if (this.hasActive()) {
      const message = this.translationService.translate(
        'upload.announce.background',
        String(this.activeItems().length),
      );
      this.announcement.set(message);
      this.queue.minimize();
      this.focusAfterRender('.cll-upload-panel__badge');
      return;
    }
    this.closeIdle();
  }

  /** "Cancel all and close": cancel every non-terminal item, clear terminal items, close. */
  cancelAllAndClose(): void {
    this.confirmingClose.set(false);
    this.cancelActiveAndAnnounce();
    this.queue.clearCompleted();
    this.closed.set(true);
    this.restoreTrigger();
  }

  closeIdle(): void {
    if (this.hasActive()) return;
    this.queue.clearCompleted();
    this.closed.set(true);
    this.restoreTrigger();
  }

  onKeydown(event: Event): void {
    if (!(event instanceof KeyboardEvent)) return;
    if (event.key === 'Tab' && this.confirmingClose()) {
      this.wrapFocusInConfirmation(event);
      return;
    }
    if (event.key !== 'Escape') return;
    event.preventDefault();
    if (this.confirmingClose()) {
      this.keepInBackground();
    } else if (this.hasActive()) {
      this.minimize();
    } else {
      this.closeIdle();
    }
  }

  cancel(id: string): void {
    this.restoreRowFocus(id);
    this.queue.cancel(id);
  }

  retry(id: string): void {
    // The completion promise rejects on failure; the panel reacts through item state instead.
    this.restoreRowFocus(id);
    void this.queue.retry(id)?.catch(() => undefined);
  }

  remove(id: string): void {
    this.restoreRowFocus(id);
    this.queue.remove(id);
  }

  cancelAll(): void {
    this.cancelActiveAndAnnounce();
  }

  /** Cancels every active item, pre-marking their announcements so one count message is spoken. */
  private cancelActiveAndAnnounce(): void {
    const active = this.activeItems();
    for (const item of active) {
      this.announced.add(`${item.id}:cancelled:${item.error?.code ?? ''}:${item.attempt}`);
      this.queue.cancel(item.id);
    }
    if (active.length) {
      this.announcement.set(this.translationService.translate('upload.announce.cancelledAll', String(active.length)));
    }
  }

  retryFailed(): void {
    for (const item of this.errorItems()) this.retry(item.id);
  }

  isIndeterminate(item: UploadItem): boolean {
    return item.status === 'processing' && item.processingProgress === undefined;
  }

  fileExtension(item: UploadItem): string {
    const name = item.file.name;
    const dot = name.lastIndexOf('.');
    const extension = dot >= 0 ? name.slice(dot + 1) : '';
    return (extension || 'file').slice(0, 4).toUpperCase();
  }

  errorText(item: UploadItem): string {
    const phase = item.error?.phase ?? 'unknown';
    return this.translationService.translate(`upload.error.${phase === 'validation' ? 'unknown' : phase}`);
  }

  hasErrorDetail(item: UploadItem): boolean {
    const message = item.error?.message;
    return Boolean(message && !message.startsWith('upload.'));
  }

  formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    const units = ['KB', 'MB', 'GB', 'TB'];
    let value = bytes;
    let unit = -1;
    do {
      value /= 1024;
      unit += 1;
    } while (value >= 1024 && unit < units.length - 1);
    return `${value >= 100 ? Math.round(value) : Math.round(value * 10) / 10} ${units[unit]}`;
  }

  formatRemaining(seconds: number | undefined): string | undefined {
    if (seconds === undefined) return undefined;
    const minutes = Math.floor(seconds / 60);
    const rest = seconds % 60;
    return minutes > 0 ? `${minutes}m ${rest}s` : `${seconds}s`;
  }

  /** Smoothed transfer rate for an uploading item; undefined while no byte progress is observed. */
  rateOf(item: UploadItem): number | undefined {
    return this.itemRates()[item.id];
  }

  remainingFor(item: UploadItem): number | undefined {
    const rate = this.rateOf(item);
    if (!rate || rate <= 0) return undefined;
    const remainingBytes = item.file.size - item.uploadedBytes;
    if (remainingBytes <= 0) return undefined;
    return Math.max(1, Math.round(remainingBytes / rate));
  }

  private restoreRowFocus(id: string): void {
    const active = this.host.nativeElement.ownerDocument.activeElement;
    if (!(active instanceof HTMLElement) || !this.host.nativeElement.contains(active)) return;
    const row = active.closest<HTMLElement>('[data-upload-id]');
    if (row?.dataset['uploadId'] !== id) return;
    afterNextRender(
      () => {
        const document = this.host.nativeElement.ownerDocument;
        // Preserve a still-focused action and any deliberate user move outside this action.
        if (document.activeElement !== document.body && document.activeElement !== active) return;
        if (active.isConnected && document.activeElement === active) return;
        // Use a stable window control: a retried row may finish again immediately.
        const target = this.host.nativeElement.querySelector<HTMLButtonElement>(
          '.cll-upload-panel__minimize, .cll-upload-panel__badge',
        );
        target?.focus();
      },
      {injector: this.injector},
    );
  }

  private restoreTrigger(): void {
    const target = this.manager.restoreTarget();
    target?.focus();
  }

  private wrapFocusInConfirmation(event: KeyboardEvent): void {
    const container = this.host.nativeElement.querySelector<HTMLElement>('.cll-upload-panel__confirm');
    const buttons = container ? Array.from(container.querySelectorAll<HTMLButtonElement>('button')) : [];
    if (buttons.length < 2) return;
    const first = buttons[0];
    const last = buttons[buttons.length - 1];
    const active = document.activeElement;
    if (active === first && event.shiftKey) {
      event.preventDefault();
      last.focus();
    } else if (active === last && !event.shiftKey) {
      event.preventDefault();
      first.focus();
    }
  }

  private focusAfterRender(selector: string): void {
    afterNextRender(
      () => {
        this.host.nativeElement.querySelector<HTMLElement>(selector)?.focus();
      },
      {injector: this.injector},
    );
  }

  private announcementFor(item: UploadItem): string | undefined {
    if (
      item.status !== 'uploading' &&
      item.status !== 'processing' &&
      item.status !== 'success' &&
      item.status !== 'error' &&
      item.status !== 'cancelled'
    )
      return;
    // The attempt in the key re-announces a failure with the same code after a retry.
    const key = `${item.id}:${item.status}:${item.error?.code ?? ''}:${item.attempt}`;
    if (this.announced.has(key)) return;
    this.announced.add(key);
    const detail = item.status === 'error' ? this.errorText(item) : '';
    return this.translationService.translate(`upload.announce.${item.status}`, item.file.name, detail);
  }

  private now(): number {
    return typeof performance !== 'undefined' ? performance.now() : Date.now();
  }

  /** 60/40 exponential blend that smooths an observed byte rate; the first sample seeds it. */
  private smoothRate(previous: number, instant: number): number {
    return previous > 0 ? previous * 0.6 + instant * 0.4 : instant;
  }
}
