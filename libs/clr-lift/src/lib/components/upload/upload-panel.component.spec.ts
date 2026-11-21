import {TestBed} from '@angular/core/testing';
import {OverlayContainer} from '@angular/cdk/overlay';
import {type UploadAdapter, UploadQueueService} from 'ngx-lift';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';

import {TranslationService} from '../../services/translation.service';
import {UploadPanelComponent} from './upload-panel.component';

function uploadFile(name: string, size = 4): File {
  return new File([new Uint8Array(size)], name);
}

function options(adapter: UploadAdapter, overrides: Partial<Parameters<UploadQueueService['enqueue']>[1]> = {}) {
  return {adapter, chunkSize: 2, concurrency: 1, autoRetry: false, maxRetries: 0, pollIntervalMs: 1000, ...overrides};
}

function blockedAdapter(): {adapter: UploadAdapter; release(): void} {
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
  let translation: TranslationService;
  let fixture: ReturnType<typeof TestBed.createComponent<UploadPanelComponent>>;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [UploadPanelComponent]});
    translation = TestBed.inject(TranslationService);
    translation.setLanguage('en');
    queue = TestBed.inject(UploadQueueService);
    fixture = TestBed.createComponent(UploadPanelComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.inject(OverlayContainer).ngOnDestroy();
    TestBed.resetTestingModule();
  });

  const overlay = () => TestBed.inject(OverlayContainer).getContainerElement();
  const panel = () => overlay().querySelector('.cll-upload-panel') as HTMLElement;

  async function flush(microtasks = 64): Promise<void> {
    for (let index = 0; index < microtasks; index += 1) await Promise.resolve();
    fixture.detectChanges();
  }

  function enqueueBlocked(): {release(): void} {
    const blocked = blockedAdapter();
    queue.enqueue([uploadFile('bundle.zip')], options(blocked.adapter));
    return blocked;
  }

  it('stays hidden until the first item exists and renders rows afterwards', async () => {
    expect(panel().querySelector('.cll-upload-panel__card')).toBeNull();

    enqueueBlocked();
    await flush();

    const card = panel().querySelector('.cll-upload-panel__card')!;
    expect(card).not.toBeNull();
    expect(card.textContent).toContain('bundle.zip');
    expect(card.querySelector('.cll-upload-panel__badge-type')?.textContent).toContain('ZIP');
    expect(overlay().querySelector('.cdk-overlay-backdrop')).toBeNull();
  });

  it('minimizes to the badge and restores the same panel', async () => {
    enqueueBlocked();
    await flush();

    panel().querySelector<HTMLButtonElement>('.cll-upload-panel__minimize')!.click();
    fixture.detectChanges();
    expect(queue.minimized()).toBe(true);
    const badge = panel().querySelector<HTMLButtonElement>('.cll-upload-panel__badge')!;
    expect(badge).not.toBeNull();
    expect(badge.getAttribute('aria-label')).toContain('active');

    badge.click();
    fixture.detectChanges();
    expect(queue.minimized()).toBe(false);
    expect(panel().querySelector('.cll-upload-panel__card')).not.toBeNull();
  });

  it('collapses to compact height with the expand toggle without touching queue state', async () => {
    enqueueBlocked();
    await flush();

    panel().querySelector<HTMLButtonElement>('.cll-upload-panel__expand')!.click();
    fixture.detectChanges();
    expect(panel().querySelector('.cll-upload-panel__list--compact')).not.toBeNull();
    expect(queue.items().length).toBe(1);
  });

  it('asks for confirmation when closing with active items and keeps uploads in the background', async () => {
    const blocked = enqueueBlocked();
    await flush();

    panel().querySelector<HTMLButtonElement>('.cll-upload-panel__close')!.click();
    fixture.detectChanges();
    expect(panel().querySelector('.cll-upload-panel__confirm')).not.toBeNull();

    panel().querySelector<HTMLButtonElement>('.cll-upload-panel__confirm-background')!.click();
    fixture.detectChanges();
    expect(queue.minimized()).toBe(true);
    expect(panel().textContent).toContain('background');
    expect(queue.items()[0].status).toBe('uploading');

    blocked.release();
    await flush();
    expect(queue.items()[0].status).toBe('success');
  });

  it('cancels every non-terminal item and closes when the confirmation cancel action runs', async () => {
    enqueueBlocked();
    await flush();

    panel().querySelector<HTMLButtonElement>('.cll-upload-panel__close')!.click();
    fixture.detectChanges();
    panel().querySelector<HTMLButtonElement>('.cll-upload-panel__confirm-cancel')!.click();
    fixture.detectChanges();

    expect(queue.items()).toEqual([]);
    expect(panel().querySelector('.cll-upload-panel__card')).toBeNull();
    expect(panel().querySelector('.cll-upload-panel__badge')).toBeNull();
  });

  it('closes and clears terminal items when idle through the Done action', async () => {
    queue.enqueue(
      [uploadFile('bundle.zip')],
      options({
        initiate: async () => ({uploadId: 'u1'}),
        uploadChunk: async () => undefined,
        combine: async () => undefined,
        cancel: async () => undefined,
      }),
    );
    await flush();

    panel().querySelector<HTMLButtonElement>('.cll-upload-panel__done')!.click();
    fixture.detectChanges();

    expect(queue.items()).toEqual([]);
    expect(panel().querySelector('.cll-upload-panel__card')).toBeNull();
  });

  it('shows footer batch actions with per-item rules', async () => {
    const failed = new Set<string>();
    queue.enqueue(
      [uploadFile('ok.zip'), uploadFile('broken.zip'), uploadFile('pending.zip')],
      options({
        initiate: async (file) => ({uploadId: file.name}),
        uploadChunk: async (request) => {
          if (request.uploadId === 'broken.zip' && !failed.has(request.uploadId)) {
            failed.add(request.uploadId);
            throw {code: 'chunk-failed', phase: 'chunk'};
          }
        },
        combine: async () => undefined,
        cancel: async () => undefined,
      }),
    );
    await flush();

    expect(panel().querySelector('.cll-upload-panel__retry-failed')!.textContent).toContain('(1)');
    expect(panel().querySelector('.cll-upload-panel__clear-completed')).not.toBeNull();
    expect(panel().querySelector('.cll-upload-panel__done')).not.toBeNull();

    // Cancel all appears only while items are still active.
    const blocked = blockedAdapter();
    queue.enqueue([uploadFile('running.zip')], options(blocked.adapter));
    await flush();
    expect(panel().querySelector('.cll-upload-panel__cancel-all')).not.toBeNull();
    blocked.release();
    await flush();

    panel().querySelector<HTMLButtonElement>('.cll-upload-panel__retry-failed')!.click();
    await flush();

    expect(queue.items().filter((item) => item.status === 'success')).toHaveLength(4);
    expect(panel().querySelector('.cll-upload-panel__retry-failed')).toBeNull();
    expect(panel().querySelector('.cll-upload-panel__done')).not.toBeNull();
  });

  it('collapses successful items into one summary row while failures stay pinned', async () => {
    let failed = false;
    queue.enqueue(
      [uploadFile('ok.zip'), uploadFile('broken.zip')],
      options({
        initiate: async (file) => ({uploadId: file.name}),
        uploadChunk: async (request) => {
          if (request.uploadId === 'broken.zip' && !failed) {
            failed = true;
            throw {code: 'chunk-failed', phase: 'chunk'};
          }
        },
        combine: async () => undefined,
        cancel: async () => undefined,
      }),
    );
    await flush();

    const summary = panel().querySelector('.cll-upload-panel__summary')!;
    expect(summary.textContent).toContain('Uploaded 1 files');
    expect(panel().textContent).toContain('broken.zip');
    expect(panel().textContent).toContain('A chunk could not be uploaded.');

    summary.querySelector<HTMLButtonElement>('.cll-upload-panel__summary-toggle')!.click();
    fixture.detectChanges();
    expect(panel().querySelector('.cll-upload-panel__summary-list')!.textContent).toContain('ok.zip');
  });

  it('announces each terminal transition once per item and status', async () => {
    queue.enqueue(
      [uploadFile('bundle.zip')],
      options({
        initiate: async () => ({uploadId: 'u1'}),
        uploadChunk: async () => undefined,
        combine: async () => undefined,
        cancel: async () => undefined,
      }),
    );
    await flush();
    await flush();

    const live = panel().querySelector('.cll-upload-panel__live')!;
    expect(live.textContent).toBe('bundle.zip uploaded.');
  });

  it('handles Escape inside the panel only, choosing the safe action in the confirmation', async () => {
    const blocked = enqueueBlocked();
    await flush();

    panel().dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}));
    fixture.detectChanges();
    expect(queue.minimized()).toBe(true);

    document.body.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}));
    fixture.detectChanges();
    expect(queue.minimized()).toBe(true);

    panel().querySelector<HTMLButtonElement>('.cll-upload-panel__badge')!.click();
    fixture.detectChanges();

    panel().querySelector<HTMLButtonElement>('.cll-upload-panel__close')!.click();
    fixture.detectChanges();
    panel().dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}));
    fixture.detectChanges();
    expect(panel().querySelector('.cll-upload-panel__confirm')).toBeNull();
    expect(queue.minimized()).toBe(true);
    expect(queue.items()[0].status).toBe('uploading');

    blocked.release();
    await flush();
    expect(queue.items()[0].status).toBe('success');
  });
});
