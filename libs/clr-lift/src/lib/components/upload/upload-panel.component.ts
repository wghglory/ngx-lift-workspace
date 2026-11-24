import {isPlatformBrowser} from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  viewChild,
  Injector,
  PLATFORM_ID,
} from '@angular/core';

import {UploadPanelWindowComponent} from './upload-panel-window.component';
import {UploadPanelManager} from './upload-panel-manager';

/**
 * Shared transfer presentation: `<cll-upload-panel />`.
 *
 * Rendering this element bootstraps the application-wide window immediately instead of on
 * the first enqueue. The default anchor renders nothing; inline mode reuses the same renderer locally. The floating window lives in a CDK overlay
 * owned by `UploadPanelManager` and survives route changes and host teardown.
 */
@Component({
  selector: 'cll-upload-panel',
  imports: [UploadPanelWindowComponent],
  template: '@if (inline()) { <cll-upload-panel-window [embedded]="true" /> }',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadPanelComponent implements AfterViewInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly manager = inject(UploadPanelManager);
  private readonly injector = inject(Injector);

  /** Suppress the shared dock while an application dialog presents the same queue. */
  readonly suppressed = input(false);
  /** Reuse the shared transfer renderer in an application dialog, suppressing the floating dock. */
  readonly inline = input(false);
  private readonly inlineWindow = viewChild(UploadPanelWindowComponent);

  /** Reveal an existing row in this presentation, including the successful-items disclosure. */
  showItem(id: string): void {
    if (this.inline()) this.inlineWindow()?.showItem(id);
    else this.manager.showItem(id);
  }

  constructor() {
    effect(() => {
      this.manager.setSuppressed(this, this.suppressed() || this.inline());
      if (!this.inline() && isPlatformBrowser(this.platformId)) this.manager.ensurePanel();
    });
    inject(DestroyRef).onDestroy(() => this.manager.setSuppressed(this, false));
  }

  ngAfterViewInit(): void {
    if (!this.inline() && isPlatformBrowser(this.platformId)) this.manager.ensurePanel();
  }
}
