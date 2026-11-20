import {isPlatformBrowser} from '@angular/common';
import {Overlay} from '@angular/cdk/overlay';
import {TemplatePortal} from '@angular/cdk/portal';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  Injector,
  OnDestroy,
  AfterViewInit,
  PLATFORM_ID,
  signal,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {type UploadItem, UploadQueueService} from 'ngx-lift';

import {TranslatePipe} from '../../pipes/translate.pipe';
import {TranslationService} from '../../services/translation.service';
import {uploadTranslations} from './upload.l10n';

@Component({
  selector: 'cll-upload-panel',
  imports: [TranslatePipe, ClarityModule],
  templateUrl: './upload-panel.component.html',
  styleUrls: ['./upload-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadPanelComponent implements AfterViewInit, OnDestroy {
  private readonly overlay = inject(Overlay);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly injector = inject(ViewContainerRef);
  private readonly context = inject(Injector);
  private readonly translationService = inject(TranslationService);
  private overlayRef?: ReturnType<Overlay['create']>;
  private capturedFocus?: HTMLElement;
  private readonly announced = new Set<string>();

  @ViewChild('panel', {read: TemplateRef}) private panelTemplate?: TemplateRef<unknown>;

  readonly queue = inject(UploadQueueService);
  readonly announcement = signal('');

  constructor() {
    this.translationService.loadTranslationsForComponent('upload', uploadTranslations);
    effect(() => {
      const items = this.queue.items();
      if (!items.length || typeof document === 'undefined') return;
      const active = this.queue.aggregate().active;
      if (active > 0 && !this.capturedFocus) {
        const element = document.activeElement;
        const panel = document.querySelector('.cll-upload-panel');
        if (element instanceof HTMLElement && !panel?.contains(element)) {
          this.capturedFocus = element;
        }
      }
      for (const item of items) {
        this.announce(item);
      }
    });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId) || !this.panelTemplate) return;
    this.overlayRef = this.overlay.create({
      hasBackdrop: false,
      positionStrategy: this.overlay.position().global().right('1rem').bottom('1rem'),
      scrollStrategy: this.overlay.scrollStrategies.noop(),
    });
    this.overlayRef.attach(new TemplatePortal(this.panelTemplate, this.injector));
  }

  ngOnDestroy(): void {
    this.overlayRef?.dispose();
  }

  minimize(): void {
    this.queue.minimize();
    afterNextRender(() => document.querySelector<HTMLButtonElement>('.cll-upload-panel__badge')?.focus(), {
      injector: this.context,
    });
  }

  restore(): void {
    this.queue.restore();
    afterNextRender(() => document.querySelector<HTMLButtonElement>('.cll-upload-panel__minimize')?.focus(), {
      injector: this.context,
    });
  }

  closeIdle(): void {
    if (this.queue.aggregate().active > 0) return;
    this.queue.clearCompleted();
    this.restoreFocus();
  }

  onEscape(event: Event): void {
    if (!(event instanceof KeyboardEvent) || event.key !== 'Escape') return;
    const target = event.target;
    if (!(target instanceof Element) || !target.closest('.cll-upload-panel')) return;
    event.preventDefault();
    if (this.queue.aggregate().active > 0) {
      this.minimize();
    } else {
      this.closeIdle();
    }
  }

  remove(id: string): void {
    this.queue.remove(id);
  }

  retry(id: string): void {
    this.queue.retry(id);
  }

  cancel(id: string): void {
    this.queue.cancel(id);
  }

  clearCompleted(): void {
    this.queue.clearCompleted();
  }

  isIndeterminate(item: UploadItem): boolean {
    return item.status === 'processing';
  }

  private announce(item: UploadItem): void {
    if (item.status !== 'success' && item.status !== 'error' && item.status !== 'cancelled') return;
    const key = `${item.id}:${item.status}:${item.error?.code ?? ''}`;
    if (this.announced.has(key)) return;
    this.announced.add(key);
    const message = this.translationService.translate(
      `upload.announce.${item.status}`,
      item.file.name,
      item.error?.message ?? '',
    );
    this.announcement.set(message);
  }

  private restoreFocus(): void {
    this.capturedFocus?.focus();
    this.capturedFocus = undefined;
  }
}
