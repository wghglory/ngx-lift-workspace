import {isPlatformBrowser} from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  Injector,
  PLATFORM_ID,
} from '@angular/core';

import {UploadPanelManager} from './upload-panel-manager';

/**
 * Declaration anchor for the shared transfer window: `<cll-upload-panel />`.
 *
 * Rendering this element bootstraps the application-wide window immediately instead of on
 * the first enqueue. The anchor itself renders nothing; the window lives in a CDK overlay
 * owned by `UploadPanelManager` and survives route changes and host teardown.
 */
@Component({
  selector: 'cll-upload-panel',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadPanelComponent implements AfterViewInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly manager = inject(UploadPanelManager);
  private readonly injector = inject(Injector);

  /** Suppress the shared dock while an application dialog presents the same queue. */
  readonly suppressed = input(false);

  constructor() {
    effect(() => this.manager.setSuppressed(this, this.suppressed()));
    inject(DestroyRef).onDestroy(() => this.manager.setSuppressed(this, false));
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) this.manager.ensurePanel();
  }
}
