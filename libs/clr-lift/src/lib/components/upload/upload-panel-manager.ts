import {isPlatformBrowser} from '@angular/common';
import {
  ApplicationRef,
  ComponentRef,
  EnvironmentInjector,
  PLATFORM_ID,
  Injectable,
  createComponent,
  inject,
} from '@angular/core';

import {UploadPanelComponent} from './upload-panel.component';

/** Application-wide owner of the shared upload panel and the focus trigger that opened it. */
@Injectable({providedIn: 'root'})
export class UploadPanelManager {
  private readonly platformId = inject(PLATFORM_ID);
  private panelRef?: ComponentRef<UploadPanelComponent>;
  private claimed = false;
  private trigger?: HTMLElement;

  /**
   * Claims the single shared panel slot. The first panel instance wins and owns the
   * overlay; later instances render nothing so the queue keeps exactly one surface.
   */
  claimPanel(): boolean {
    if (this.claimed) return false;
    this.claimed = true;
    return true;
  }

  /** Creates the shared panel on the first enqueue; a declared panel wins the claim first. */
  ensurePanel(environment: EnvironmentInjector, appRef: ApplicationRef): void {
    if (this.claimed || !isPlatformBrowser(this.platformId)) return;
    const ref = createComponent(UploadPanelComponent, {environmentInjector: environment});
    appRef.attachView(ref.hostView);
    document.body.appendChild(ref.location.nativeElement as HTMLElement);
    this.panelRef = ref;
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
}
