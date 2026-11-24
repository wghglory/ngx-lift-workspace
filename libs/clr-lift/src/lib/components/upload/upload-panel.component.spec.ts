import {ApplicationRef} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {OverlayContainer} from '@angular/cdk/overlay';
import {type UploadAdapter, UploadQueueService} from 'ngx-lift';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {TranslationService} from '../../services/translation.service';
import {UploadPanelManager} from './upload-panel-manager';
import {UploadPanelComponent} from './upload-panel.component';
import {UploadPanelWindowComponent} from './upload-panel-window.component';

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

  function bootstrap(): void {
    TestBed.configureTestingModule({imports: [UploadPanelComponent, UploadPanelWindowComponent]});
    translation = TestBed.inject(TranslationService);
    translation.setLanguage('en');
    queue = TestBed.inject(UploadQueueService);
    fixture = TestBed.createComponent(UploadPanelComponent);
    fixture.detectChanges();
    // The declared anchor bootstraps the shared window in a portal view outside the fixture.
    TestBed.inject(ApplicationRef).tick();
  }

  beforeEach(() => bootstrap());

  afterEach(() => {
    TestBed.inject(OverlayContainer).ngOnDestroy();
    TestBed.resetTestingModule();
  });

  const overlay = () => TestBed.inject(OverlayContainer).getContainerElement();
  const panel = () => overlay().querySelector('.cll-upload-panel') as HTMLElement;

  async function flush(microtasks = 64): Promise<void> {
    for (let index = 0; index < microtasks; index += 1) await Promise.resolve();
    TestBed.inject(ApplicationRef).tick();
  }

  function enqueueBlocked(): {release(): void} {
    const blocked = blockedAdapter();
    queue.enqueue([uploadFile('bundle.zip')], options(blocked.adapter));
    return blocked;
  }

  it('uses determinate processing only after the server reports task progress', async () => {
    let finish: (value: {status: 'success'; progress: number}) => void = () => undefined;
    const pending = new Promise<{status: 'success'; progress: number}>((resolve) => {
      finish = resolve;
    });
    let polls = 0;
    const adapter: UploadAdapter = {
      initiate: async () => ({uploadId: 'processing'}),
      uploadChunk: async () => undefined,
      combine: async () => undefined,
      getStatus: async () => (++polls === 1 ? {status: 'processing', progress: 42} : pending),
      cancel: async () => undefined,
    };
    const [item] = queue.enqueue([uploadFile('processing.zip')], options(adapter));
    await flush();
    expect(queue.items()[0].processingProgress).toBe(42);
    expect(panel().querySelector('[role="progressbar"]')?.getAttribute('aria-valuenow')).toBe('42');
    expect(panel().querySelector('.cll-upload-panel__bar--indeterminate')).toBeNull();
    queue.minimize();
    await flush();
    expect(panel().querySelector('.cll-upload-panel__compact-title')!.textContent).toBe('Processing 1 file');
    expect(panel().querySelector('.cll-upload-panel__compact-track')).toBeNull();
    queue.cancel(item.id);
    finish({status: 'success', progress: 100});
    await flush();
  });

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
    expect(badge.getAttribute('aria-label')).toBe('Uploading 1 file');

    badge.click();
    fixture.detectChanges();
    expect(queue.minimized()).toBe(false);
    expect(panel().querySelector('.cll-upload-panel__card')).not.toBeNull();
  });

  it('keeps the shared window alive after the declaring host is destroyed', async () => {
    enqueueBlocked();
    await flush();

    // Route change: the page that declared the panel is torn down.
    fixture.componentRef.destroy();
    TestBed.inject(ApplicationRef).tick();
    expect(panel().querySelector('.cll-upload-panel__card')).not.toBeNull();

    // Navigating back declares the panel again; the window is neither duplicated nor lost.
    const reentered = TestBed.createComponent(UploadPanelComponent);
    reentered.detectChanges();
    TestBed.inject(ApplicationRef).tick();
    expect(overlay().querySelectorAll('.cll-upload-panel')).toHaveLength(1);
    expect(panel().querySelector('.cll-upload-panel__card')).not.toBeNull();
  });

  it('offers only collapse and cancel while active and never a Close control', async () => {
    const blocked = enqueueBlocked();
    await flush();
    expect(panel().querySelector('.cll-upload-panel__close')).toBeNull();
    panel().querySelector<HTMLButtonElement>('.cll-upload-panel__minimize')!.click();
    fixture.detectChanges();
    expect(queue.minimized()).toBe(true);
    expect(queue.items()[0].status).toBe('uploading');
    blocked.release();
  });

  it('cancels immediately without confirmation and retains settled records until explicit Close', async () => {
    enqueueBlocked();
    enqueueBlocked();
    await flush();
    panel().querySelector<HTMLButtonElement>('.cll-upload-panel__cancel-all')!.click();
    fixture.detectChanges();
    expect(panel().querySelector('[role="alertdialog"]')).toBeNull();
    expect(queue.items().every((item) => item.status === 'cancelled')).toBe(true);
    const later = enqueueBlocked();
    await flush();
    expect(queue.items()[2].status).not.toBe('cancelled');
    later.release();
    await flush();
    expect(queue.items()).toHaveLength(3);
    panel().querySelector<HTMLButtonElement>('.cll-upload-panel__done')!.click();
    fixture.detectChanges();
    expect(queue.items()).toEqual([]);
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
    expect(summary.textContent).toContain('Completed (1)');
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

  it('publishes a completed file and the next start together in one render', async () => {
    const blocked = blockedAdapter();
    queue.enqueue(
      [uploadFile('first.zip')],
      options({
        ...blocked.adapter,
        uploadChunk: async () => undefined,
      }),
    );
    queue.enqueue([uploadFile('second.zip')], options(blocked.adapter));
    await flush();

    const live = panel().querySelector('.cll-upload-panel__live')!;
    expect(live.textContent).toContain('first.zip uploaded.');
    expect(live.textContent).toContain('Uploading second.zip.');
    await flush();
    expect(live.textContent).toContain('first.zip uploaded.');
  });

  it('keeps batch retry failures handled and available for another retry', async () => {
    queue.enqueue(
      [uploadFile('broken.zip')],
      options({
        initiate: async () => ({uploadId: 'u1'}),
        uploadChunk: async () => {
          throw {code: 'chunk-failed', phase: 'chunk'};
        },
        combine: async () => undefined,
        cancel: async () => undefined,
      }),
    );
    await flush();

    panel().querySelector<HTMLButtonElement>('.cll-upload-panel__retry-failed')!.click();
    await flush();

    expect(queue.items()[0]).toMatchObject({status: 'error', attempt: 2});
    expect(panel().querySelector('.cll-upload-panel__retry-failed')).not.toBeNull();
  });

  it('announces the transfer start and the processing phase once per attempt', async () => {
    let releaseChunk!: () => void;
    const chunkGate = new Promise<void>((resolve) => (releaseChunk = resolve));
    let statusCalls = 0;
    queue.enqueue(
      [uploadFile('bundle.zip')],
      options({
        initiate: async () => ({uploadId: 'u1'}),
        uploadChunk: async () => {
          await chunkGate;
        },
        combine: async () => undefined,
        cancel: async () => undefined,
        getStatus: async () => {
          statusCalls += 1;
          return statusCalls === 1 ? {status: 'processing', progress: 50} : new Promise(() => undefined);
        },
      }),
    );
    await flush();

    const live = panel().querySelector('.cll-upload-panel__live')!;
    expect(live.textContent).toBe('Uploading bundle.zip.');

    releaseChunk();
    await flush();
    expect(live.textContent).toBe('Processing bundle.zip.');
  });

  it('re-announces a failure with the same code after a retry', async () => {
    const translate = vi.spyOn(translation, 'translate');
    queue.enqueue(
      [uploadFile('broken.zip')],
      options({
        initiate: async () => ({uploadId: 'u1'}),
        uploadChunk: async () => {
          throw {code: 'chunk-failed', phase: 'chunk'};
        },
        combine: async () => undefined,
        cancel: async () => undefined,
      }),
    );
    await flush();
    await flush();
    expect(panel().querySelector('.cll-upload-panel__live')!.textContent).toContain('failed');
    expect(translate.mock.calls.some(([key]) => key === 'upload.announce.error')).toBe(true);

    translate.mockClear();
    void queue.retry(queue.items()[0].id)?.catch(() => undefined);
    await flush();
    await flush();
    expect(queue.items()[0].status).toBe('error');
    expect(queue.items()[0].attempt).toBe(2);
    expect(translate.mock.calls.some(([key]) => key === 'upload.announce.error')).toBe(true);
  });

  it('announces one count message when cancelling all active items', async () => {
    enqueueBlocked();
    enqueueBlocked();
    await flush();

    panel().querySelector<HTMLButtonElement>('.cll-upload-panel__cancel-all')!.click();
    fixture.detectChanges();

    expect(queue.items().every((item) => item.status === 'cancelled')).toBe(true);
    expect(panel().querySelector('.cll-upload-panel__live')!.textContent).toBe('2 uploads cancelled.');
  });

  it('returns focus to the recorded trigger when the panel closes', async () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();
    TestBed.inject(UploadPanelManager).setTrigger(trigger);
    enqueueBlocked();
    await flush();

    panel().querySelector<HTMLButtonElement>('.cll-upload-panel__cancel-all')!.click();
    fixture.detectChanges();
    panel().querySelector<HTMLButtonElement>('.cll-upload-panel__done')!.click();
    fixture.detectChanges();

    expect(document.activeElement).toBe(trigger);
    trigger.remove();
  });

  it('docks the shared window on the left in RTL documents', async () => {
    TestBed.resetTestingModule();
    try {
      // The TranslationService effect syncs the document dir to the locale, and the panel
      // creates the overlay in ngAfterViewInit — so an RTL locale must be set and flushed
      // before the declaring host is created.
      TestBed.configureTestingModule({imports: [UploadPanelComponent, UploadPanelWindowComponent]});
      translation = TestBed.inject(TranslationService);
      translation.setLanguage('he');
      queue = TestBed.inject(UploadQueueService);
      TestBed.inject(ApplicationRef).tick();
      expect(document.documentElement.getAttribute('dir')).toBe('rtl');

      fixture = TestBed.createComponent(UploadPanelComponent);
      fixture.detectChanges();
      TestBed.inject(ApplicationRef).tick();
      enqueueBlocked();
      await flush();

      // CDK's global strategy docks via flex margins, not left/right offsets.
      const pane = panel().closest('.cdk-overlay-pane') as HTMLElement;
      const wrapper = pane.parentElement as HTMLElement;
      expect(pane.style.marginLeft).toBe('1rem');
      expect(pane.style.marginRight).toBe('');
      expect(wrapper.style.justifyContent).toBe('flex-end');
    } finally {
      document.documentElement.setAttribute('dir', 'ltr');
    }
  });

  it('handles Escape only inside the dock and never cancels a transfer', async () => {
    enqueueBlocked();
    await flush();
    panel().dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}));
    fixture.detectChanges();
    expect(queue.minimized()).toBe(true);
    document.body.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}));
    fixture.detectChanges();
    expect(queue.minimized()).toBe(true);
    expect(queue.items()[0].status).toBe('uploading');
  });

  it('clears successful records without losing failures and closes mixed settled records explicitly', async () => {
    queue.enqueue(
      [uploadFile('ok.zip'), uploadFile('bad.zip')],
      options({
        initiate: async (file) => ({uploadId: file.name}),
        uploadChunk: async (request) => {
          if (request.uploadId === 'bad.zip') throw {code: 'invalid', phase: 'chunk', recovery: 'replace'};
        },
        combine: async () => undefined,
        cancel: async () => undefined,
      }),
    );
    await flush();
    const failure = queue.items().find((item) => item.status === 'error')!;
    expect(failure.error?.recovery).toBe('replace');
    expect(panel().querySelector('.cll-upload-panel__retry-failed')).toBeNull();
    panel().querySelector<HTMLButtonElement>('.cll-upload-panel__clear-completed')!.click();
    await flush();
    expect(queue.items().map((item) => item.id)).toEqual([failure.id]);
    panel().querySelector<HTMLButtonElement>('.cll-upload-panel__done')!.click();
    await flush();
    expect(queue.items()).toEqual([]);
  });

  it('expands on a new failed attempt without stealing focus or repeatedly overriding collapse', async () => {
    let reject!: (error: unknown) => void;
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    const [item] = queue.enqueue(
      [uploadFile('bad.zip')],
      options({
        initiate: async () => ({uploadId: 'bad'}),
        uploadChunk: () =>
          new Promise<void>((_, fail) => {
            reject = fail;
          }),
        combine: async () => undefined,
        cancel: async () => undefined,
      }),
    );
    await flush();
    queue.minimize();
    await flush();
    trigger.focus();
    reject({code: 'network', phase: 'chunk'});
    await flush();
    expect(queue.minimized()).toBe(false);
    expect(document.activeElement).toBe(trigger);
    queue.minimize();
    await flush();
    expect(queue.minimized()).toBe(true);
    void queue.retry(item.id)?.catch(() => undefined);
    await flush();
    reject({code: 'network', phase: 'chunk'});
    await flush();
    expect(queue.minimized()).toBe(false);
    expect(document.activeElement).toBe(trigger);
    trigger.remove();
  });

  it('uses byte-weighted transfer progress and retains cleared-success byte contributions', async () => {
    const gate = blockedAdapter();
    const [small] = queue.enqueue(
      [uploadFile('small.zip', 2)],
      options({...gate.adapter, uploadChunk: async () => undefined}),
    );
    queue.enqueue([uploadFile('large.zip', 18)], options(gate.adapter));
    await flush();
    expect(queue.items()[0].status).toBe('success');
    expect(panel().querySelector('.cll-upload-panel__overall-progress')!.textContent).toContain('10%');
    panel().querySelector<HTMLButtonElement>('.cll-upload-panel__clear-completed')!.click();
    await flush();
    expect(queue.items().some((item) => item.id === small.id)).toBe(false);
    expect(panel().querySelector('.cll-upload-panel__overall-progress')!.textContent).toContain('10%');
    gate.release();
  });

  it('suppresses the dock for a dialog without destroying transfers or the shared owner', async () => {
    enqueueBlocked();
    await flush();
    fixture.componentRef.setInput('suppressed', true);
    fixture.detectChanges();
    await flush();
    expect(panel().querySelector('.cll-upload-panel__card')).toBeNull();
    expect(queue.items()[0].status).toBe('uploading');
    fixture.componentRef.setInput('suppressed', false);
    fixture.detectChanges();
    await flush();
    expect(panel().querySelector('.cll-upload-panel__card')).not.toBeNull();
  });
  it('restores stable focus after batch retry and success-only clearing remove their buttons', async () => {
    let fail = true;
    queue.enqueue(
      [uploadFile('retry.zip')],
      options({
        initiate: async () => ({uploadId: 'u'}),
        uploadChunk: async () => {
          if (fail) throw {code: 'network', phase: 'chunk'};
        },
        combine: async () => undefined,
        cancel: async () => undefined,
      }),
    );
    await flush();
    const retry = panel().querySelector<HTMLButtonElement>('.cll-upload-panel__retry-failed')!;
    retry.focus();
    fail = false;
    retry.click();
    await flush();
    expect(document.activeElement).toBe(panel().querySelector('.cll-upload-panel__minimize'));
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    TestBed.inject(UploadPanelManager).setTrigger(trigger);
    const clear = panel().querySelector<HTMLButtonElement>('.cll-upload-panel__clear-completed')!;
    clear.focus();
    clear.click();
    await flush();
    expect(queue.items()).toEqual([]);
    expect(document.activeElement).toBe(trigger);
    trigger.remove();
  });
  it('reuses the same renderer inline, suppresses dock controls and ignores dock minimization', async () => {
    fixture.componentRef.setInput('inline', true);
    fixture.detectChanges();
    enqueueBlocked();
    queue.minimize();
    await flush();
    const inline = fixture.nativeElement.querySelector('.cll-upload-panel--inline') as HTMLElement;
    expect(inline.querySelector('.cll-upload-panel__item')).not.toBeNull();
    expect(inline.querySelector('.cll-upload-panel__header')).toBeNull();
    expect(inline.textContent).toContain('bundle.zip');
    expect(inline.querySelector('.cll-upload-panel__minimize')).toBeNull();
    expect(inline.querySelector('.cll-upload-panel__cancel-all')).toBeNull();
    expect(panel().querySelector('.cll-upload-panel__card')).toBeNull();
    expect(panel().querySelector('.cll-upload-panel__live')!.textContent!.trim()).toBe('');
  });
  it('keeps byte accounting stable when a fresh inline renderer replaces the dock', async () => {
    const gate = blockedAdapter();
    queue.enqueue([uploadFile('small.zip', 2)], options({...gate.adapter, uploadChunk: async () => undefined}));
    queue.enqueue([uploadFile('large.zip', 18)], options(gate.adapter));
    await flush();
    panel().querySelector<HTMLButtonElement>('.cll-upload-panel__clear-completed')!.click();
    await flush();
    expect(panel().querySelector('.cll-upload-panel__overall-progress')!.textContent).toContain('10%');
    const inline = TestBed.createComponent(UploadPanelComponent);
    inline.componentRef.setInput('inline', true);
    inline.detectChanges();
    await flush();
    expect(
      TestBed.inject(UploadPanelManager)
        .transferItems()
        .reduce((sum, item) => sum + item.file.size, 0),
    ).toBe(20);
    inline.destroy();
    await flush();
    expect(panel().querySelector('.cll-upload-panel__overall-progress')!.textContent).toContain('10%');
    gate.release();
  });

  it('keeps focus inside the inline region when clearing its final success', async () => {
    queue.enqueue(
      [uploadFile('complete.zip')],
      options({...blockedAdapter().adapter, uploadChunk: async () => undefined}),
    );
    await flush();
    const external = document.createElement('button');
    document.body.appendChild(external);
    TestBed.inject(UploadPanelManager).setTrigger(external);
    const inline = TestBed.createComponent(UploadPanelComponent);
    inline.componentRef.setInput('inline', true);
    inline.detectChanges();
    await flush();
    const clear = inline.nativeElement.querySelector('.cll-upload-panel__clear-completed') as HTMLButtonElement;
    clear.focus();
    clear.click();
    await flush();
    expect(document.activeElement).toBe(inline.nativeElement.querySelector('.cll-upload-panel'));
    expect(document.activeElement).not.toBe(external);
    inline.destroy();
    external.remove();
  });
  it('hands an initially inline-only queue back to the floating owner without restarting transfers', async () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({imports: [UploadPanelComponent]});
    TestBed.inject(TranslationService).setLanguage('en');
    queue = TestBed.inject(UploadQueueService);
    fixture = TestBed.createComponent(UploadPanelComponent);
    fixture.componentRef.setInput('inline', true);
    fixture.detectChanges();
    enqueueBlocked();
    await flush();
    expect(fixture.nativeElement.querySelector('.cll-upload-panel__item')).not.toBeNull();
    fixture.componentRef.setInput('inline', false);
    fixture.detectChanges();
    await flush();
    expect(panel().querySelector('.cll-upload-panel__item')).not.toBeNull();
    expect(queue.items()[0].status).toBe('uploading');
  });
  it('separates the completed title, group count and size without separator chains', async () => {
    const gate = blockedAdapter();
    gate.release();
    queue.enqueue([uploadFile('first.zip'), uploadFile('second.zip')], options(gate.adapter));
    await flush();
    expect(panel().querySelector('.cll-upload-panel__title')!.textContent).toBe('Upload complete');
    expect(panel().querySelector('.cll-upload-panel__summary-toggle')!.textContent).toContain('Completed (2)');
    expect(panel().querySelector('.cll-upload-panel__summary-size')!.textContent).toBe('8 B');
    expect(panel().textContent).not.toContain('·');
  });

  it('shows a distinct failure label without claiming mixed results are all complete', async () => {
    queue.enqueue(
      [uploadFile('bad.zip')],
      options({
        initiate: async () => ({uploadId: 'bad'}),
        uploadChunk: async () => {
          throw {code: 'network', phase: 'chunk'};
        },
        combine: async () => undefined,
      }),
    );
    await flush();
    expect(panel().querySelector('.cll-upload-panel__title')!.textContent).toBe('Uploads finished');
    expect(panel().querySelector('.cll-upload-panel__failure')!.textContent).toBe('1 failed');
  });

  it('shows only an aggregate labeled estimate after sustained progress, then hides stale estimates', async () => {
    vi.useFakeTimers({toFake: ['Date', 'setInterval', 'clearInterval']});
    let progress: (bytes: number) => void = () => undefined;
    const gate = blockedAdapter();
    try {
      queue.enqueue(
        [uploadFile('large.zip', 10000)],
        options(
          {
            ...gate.adapter,
            uploadChunk: async (request) => {
              progress = request.onProgress;
              await new Promise<void>(() => undefined);
            },
          },
          {chunkSize: 10000},
        ),
      );
      await flush();
      const estimate = () => panel().querySelector('.cll-upload-panel__remaining')!.textContent!.trim();
      expect(estimate()).toBe('');
      await vi.advanceTimersByTimeAsync(1000);
      progress(100);
      await flush();
      expect(estimate()).toBe('');
      await vi.advanceTimersByTimeAsync(100);
      progress(110);
      await flush();
      await vi.advanceTimersByTimeAsync(1900);
      await flush();
      // A short burst followed by idle time is not sustained sampling.
      expect(estimate()).toBe('');
      progress(300);
      await flush();
      expect(estimate()).toBe('About 1m 37s left');
      expect(panel().querySelector('.cll-upload-panel__meta')!.textContent).toContain('300 B of');
      expect(panel().querySelector('.cll-upload-panel__rate')).toBeNull();
      expect(panel().querySelector('.cll-upload-panel__meta .cll-upload-panel__remaining')).toBeNull();
      await vi.advanceTimersByTimeAsync(4000);
      await flush();
      expect(estimate()).toBe('');
    } finally {
      for (const item of queue.items()) queue.cancel(item.id);
      await flush();
      vi.useRealTimers();
    }
  });
  it('keeps queued metadata concise and removes row-level rate and ETA', async () => {
    const gate = blockedAdapter();
    queue.enqueue([uploadFile('first.zip'), uploadFile('second.zip')], options(gate.adapter));
    await flush();
    expect(panel().querySelector('[data-status="queued"] .cll-upload-panel__meta')!.textContent!.trim()).toBe('Queued');
    expect(panel().querySelector('[data-status="uploading"] .cll-upload-panel__meta')!.textContent).toContain(
      '0 B of 4 B uploaded',
    );
    expect(panel().querySelector('.cll-upload-panel__meta .cll-upload-panel__remaining')).toBeNull();
    expect(panel().querySelector('.cll-upload-panel__rate')).toBeNull();
    expect(panel().textContent).not.toContain('·');
    gate.release();
  });
  it('reopens a smaller batch enqueued in the same render turn as settled Close', async () => {
    const gate = blockedAdapter();
    queue.enqueue(
      [uploadFile('old-a.zip'), uploadFile('old-b.zip')],
      options({...gate.adapter, uploadChunk: async () => undefined}),
    );
    await flush();
    panel().querySelector<HTMLButtonElement>('.cll-upload-panel__close')!.click();
    queue.enqueue([uploadFile('new.zip')], options(gate.adapter));
    await flush();
    expect(panel().querySelector('.cll-upload-panel__card')).not.toBeNull();
    expect(panel().textContent).toContain('new.zip');
    expect(panel().textContent).not.toContain('old-a.zip');
    expect(panel().querySelector('.cll-upload-panel__aggregate')!.textContent).toContain('0 B of 4 B uploaded');
    expect(panel().querySelector('.cll-upload-panel__overall-progress')!.textContent).toContain('0%');
    gate.release();
  });
  it('hands focus from the compact badge to the expanded disclosure when a transfer fails', async () => {
    let reject: (error: unknown) => void = () => undefined;
    queue.enqueue(
      [uploadFile('bad.zip')],
      options({
        initiate: async () => ({uploadId: 'bad'}),
        uploadChunk: () =>
          new Promise<void>((_, fail) => {
            reject = fail;
          }),
        combine: async () => undefined,
      }),
    );
    await flush();
    queue.minimize();
    await flush();
    const badge = panel().querySelector<HTMLButtonElement>('.cll-upload-panel__badge')!;
    badge.focus();
    reject({code: 'network', phase: 'chunk'});
    await flush();
    expect(queue.minimized()).toBe(false);
    expect(document.activeElement).toBe(panel().querySelector('.cll-upload-panel__minimize'));
  });

  it('keeps numeric diagnostics supplemental to localized error text and announcements', async () => {
    queue.enqueue(
      [uploadFile('conflict.zip')],
      options({
        initiate: async () => ({uploadId: 'conflict'}),
        uploadChunk: async () => {
          throw {code: 'conflict', phase: 'chunk', message: '412'};
        },
        combine: async () => undefined,
      }),
    );
    await flush();
    expect(panel().querySelector('.cll-upload-panel__error')!.textContent).toContain(
      'A chunk could not be uploaded. (412)',
    );
    expect(panel().querySelector('.cll-upload-panel__live')!.textContent).toContain(
      'A chunk could not be uploaded. (412)',
    );
  });

  it('mounts an empty live region before the first upload and preserves it through ownership handoff', async () => {
    const live = panel().querySelector('.cll-upload-panel__live')!;
    expect(live).not.toBeNull();
    expect(live.textContent!.trim()).toBe('');
    enqueueBlocked();
    await flush();
    expect(panel().querySelector('.cll-upload-panel__live')).toBe(live);
    expect(live.textContent).toContain('Uploading bundle.zip.');
    fixture.componentRef.setInput('inline', true);
    fixture.detectChanges();
    await flush();
    const inlineLive = fixture.nativeElement.querySelector(
      '.cll-upload-panel--inline .cll-upload-panel__live',
    ) as HTMLElement;
    expect(live.textContent!.trim()).toBe('');
    expect(inlineLive.textContent).toContain('Uploading bundle.zip.');
    fixture.componentRef.setInput('inline', false);
    fixture.detectChanges();
    await flush();
    expect(panel().querySelector('.cll-upload-panel__live')).toBe(live);
    expect(live.textContent).toContain('Uploading bundle.zip.');
  });
});
