import {isPlatformBrowser} from '@angular/common';
import {Overlay, type OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {DestroyRef, effect, inject, Injectable, Injector, PLATFORM_ID, signal} from '@angular/core';

import {type UploadAdapter, type UploadItem, UploadQueueService} from 'ngx-lift';

import {relativeFilePath} from './drop-files';
import {UploadPanelWindowComponent} from './upload-panel-window.component';

/**
 * Root-scoped owner of the single shared transfer window.
 *
 * The window lives in a CDK overlay owned by this service, not by any page component, so
 * route changes and host teardown never destroy it while the application is alive. A
 * declared `<cll-upload-panel>` or the first enqueue bootstraps it; both calls are
 * idempotent and later ones are no-ops.
 */
@Injectable({providedIn: 'root'})
export class UploadPanelManager {
  private readonly overlay = inject(Overlay);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly injector = inject(Injector);
  private overlayRef?: OverlayRef;
  private trigger?: HTMLElement;
  private readonly queue = inject(UploadQueueService);
  private readonly scopes = new Map<string, {adapter: UploadAdapter; scope?: string}>();
  private readonly suppressors = new Set<object>();
  readonly suppressed = signal(false);
  private readonly transferHistory = new Map<string, UploadItem>();
  readonly transferItems = signal<readonly UploadItem[]>([]);

  setSuppressed(owner: object, value: boolean): void {
    if (value) this.suppressors.add(owner);
    else this.suppressors.delete(owner);
    this.suppressed.set(this.suppressors.size > 0);
  }

  track(items: readonly UploadItem[], adapter: UploadAdapter, scope?: string): void {
    for (const item of items) this.scopes.set(item.id, {adapter, scope});
    const liveIds = new Set(this.queue.items().map((item) => item.id));
    for (const id of this.scopes.keys()) if (!liveIds.has(id)) this.scopes.delete(id);
  }

  duplicate(file: File, adapter: UploadAdapter, scope?: string): UploadItem | undefined {
    return this.queue
      .items()
      .find(
        (item) =>
          item.status !== 'cancelled' &&
          (scope !== undefined
            ? this.scopes.get(item.id)?.scope === scope
            : this.scopes.get(item.id)?.scope === undefined && this.scopes.get(item.id)?.adapter === adapter) &&
          this.sameFile(item.file, file),
      );
  }

  sameFile(left: File, right: File): boolean {
    return (
      left.name === right.name &&
      left.size === right.size &&
      left.lastModified === right.lastModified &&
      relativeFilePath(left) === relativeFilePath(right)
    );
  }

  showItem(id: string): void {
    this.ensurePanel();
    this.window?.showItem(id);
  }

  private window?: UploadPanelWindowComponent;

  constructor() {
    effect(() => {
      const items = this.queue.items();
      const ids = new Set(items.map((item) => item.id));
      for (const id of this.scopes.keys()) if (!ids.has(id)) this.scopes.delete(id);
      if (!items.length) this.transferHistory.clear();
      for (const [id, previous] of this.transferHistory) {
        if (!ids.has(id) && previous.status !== 'success') this.transferHistory.delete(id);
      }
      for (const item of items) this.transferHistory.set(item.id, item);
      this.transferItems.set([...this.transferHistory.values()].filter((item) => item.status !== 'cancelled'));
    });
    inject(DestroyRef).onDestroy(() => this.overlayRef?.dispose());
  }

  /** Creates the shared window once per application; later calls are no-ops. */
  ensurePanel(): void {
    if (this.overlayRef || !isPlatformBrowser(this.platformId)) return;
    const rtl = this.isRtl();
    const position = this.overlay.position().global().bottom('1rem');
    if (rtl) position.left('1rem');
    else position.right('1rem');
    this.overlayRef = this.overlay.create({
      hasBackdrop: false,
      // CDK's global position strategy only flips its flex direction from this config
      // value, not from the document direction, so it must be passed explicitly.
      direction: rtl ? 'rtl' : 'ltr',
      positionStrategy: position,
      scrollStrategy: this.overlay.scrollStrategies.noop(),
    });
    this.window = this.overlayRef.attach(new ComponentPortal(UploadPanelWindowComponent, null, this.injector)).instance;
  }

  /** Records the element that most recently opened or interacted with the panel. */
  setTrigger(element: HTMLElement): void {
    this.trigger = element;
  }

  /** The element focus should return to when the panel closes; connected elements only. */
  restoreTarget(): HTMLElement | undefined {
    const element = this.trigger;
    return element?.isConnected ? element : undefined;
  }

  private isRtl(): boolean {
    if (typeof document === 'undefined') return false;
    const direction = document.documentElement.getAttribute('dir') ?? document.body.getAttribute('dir');
    return direction === 'rtl' || (direction === null && getComputedStyle(document.body).direction === 'rtl');
  }
}
