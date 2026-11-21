import {isPlatformBrowser} from '@angular/common';
import {Overlay, type OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {DestroyRef, inject, Injectable, Injector, PLATFORM_ID} from '@angular/core';

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

  constructor() {
    inject(DestroyRef).onDestroy(() => this.overlayRef?.dispose());
  }

  /** Creates the shared window once per application; later calls are no-ops. */
  ensurePanel(): void {
    if (this.overlayRef || !isPlatformBrowser(this.platformId)) return;
    const position = this.overlay.position().global().bottom('1rem');
    if (this.isRtl()) position.left('1rem');
    else position.right('1rem');
    this.overlayRef = this.overlay.create({
      hasBackdrop: false,
      positionStrategy: position,
      scrollStrategy: this.overlay.scrollStrategies.noop(),
    });
    this.overlayRef.attach(new ComponentPortal(UploadPanelWindowComponent, null, this.injector));
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
