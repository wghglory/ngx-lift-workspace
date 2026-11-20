import {TestBed} from '@angular/core/testing';
import {OverlayContainer} from '@angular/cdk/overlay';
import {type UploadAdapter, UploadQueueService} from 'ngx-lift';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';

import {UploadPanelComponent} from './upload-panel.component';

function pendingAdapter(): {adapter: UploadAdapter; release(): void} {
  let release!: () => void;
  const pending = new Promise<void>((resolve) => (release = resolve));
  return {
    adapter: {
      initiate: async () => ({uploadId: 'u1'}),
      uploadChunk: async () => pending,
      combine: async () => undefined,
      cancel: async () => undefined,
    },
    release: () => release(),
  };
}

describe('UploadPanelComponent', () => {
  let queue: UploadQueueService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [UploadPanelComponent]});
    queue = TestBed.inject(UploadQueueService);
  });

  afterEach(() => {
    TestBed.inject(OverlayContainer).ngOnDestroy();
    TestBed.resetTestingModule();
  });

  it('renders a shared non-modal overlay and minimizes only while focus is inside', async () => {
    const fixture = TestBed.createComponent(UploadPanelComponent);
    fixture.detectChanges();
    const overlay = TestBed.inject(OverlayContainer).getContainerElement();
    const panel = overlay.querySelector('.cll-upload-panel') as HTMLElement;
    expect(panel).not.toBeNull();
    expect(overlay.querySelector('.cdk-overlay-backdrop')).toBeNull();

    const {adapter, release} = pendingAdapter();
    queue.enqueue([new File([new Uint8Array(2)], 'bundle.zip')], {
      adapter,
      chunkSize: 2,
      concurrency: 1,
      autoRetry: false,
      maxRetries: 0,
      pollIntervalMs: 1000,
    });
    for (let index = 0; index < 8; index += 1) await Promise.resolve();
    fixture.detectChanges();

    expect(panel.querySelector('.cll-upload-panel__name')?.textContent).toContain('bundle.zip');
    panel.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}));
    fixture.detectChanges();
    expect(queue.minimized()).toBe(true);
    expect(panel.textContent).toContain('Restore upload progress');

    (panel.querySelector('.cll-upload-panel__badge') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(queue.minimized()).toBe(false);

    release();
  });

  it('ignores Escape dispatched outside the panel', async () => {
    const fixture = TestBed.createComponent(UploadPanelComponent);
    fixture.detectChanges();
    const {adapter, release} = pendingAdapter();
    queue.enqueue([new File([new Uint8Array(2)], 'bundle.zip')], {
      adapter,
      chunkSize: 2,
      concurrency: 1,
      autoRetry: false,
      maxRetries: 0,
      pollIntervalMs: 1000,
    });
    for (let index = 0; index < 8; index += 1) await Promise.resolve();

    document.body.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}));
    fixture.detectChanges();
    expect(queue.minimized()).toBe(false);
    release();
  });
});
