import {ApplicationRef, Component} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {type UploadAdapter, UploadQueueService} from 'ngx-lift';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {afterEach, beforeEach, describe, expect, expectTypeOf, it, vi} from 'vitest';

import {ClrLiftI18nService} from '../../services/clr-lift-i18n.service';
import {UploadComponent} from './upload.component';
import {UploadPanelManager} from './upload-panel-manager';

function file(name: string, size = 2): File {
  return new File([new Uint8Array(size)], name);
}

function stubAdapter(): UploadAdapter {
  return {
    initiate: async () => ({uploadId: 'u1'}),
    uploadChunk: async () => undefined,
    combine: async () => undefined,
    cancel: async () => undefined,
  };
}

async function select(component: UploadComponent, files: readonly File[]): Promise<void> {
  const input = document.createElement('input');
  Object.defineProperty(input, 'files', {value: files, configurable: true});
  component.onSelected({target: input} as unknown as Event);
  for (let index = 0; index < 40; index += 1) await Promise.resolve();
}

@Component({
  imports: [ReactiveFormsModule, UploadComponent],
  template:
    '<cll-upload [formControl]="control" [adapter]="adapter" [autoEnqueue]="false" [multiple]="true" accept=".zip" />',
})
class BlurUploadHost {
  readonly adapter = stubAdapter();
  readonly control = new FormControl<readonly File[]>([], {nonNullable: true, updateOn: 'blur'});
}

describe('UploadComponent', () => {
  let translation: ClrLiftI18nService;

  it('types the control value as an immutable file list', () => {
    expectTypeOf<Parameters<UploadComponent['writeValue']>[0]>().toEqualTypeOf<readonly File[] | null>();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [UploadComponent]});
    translation = TestBed.inject(ClrLiftI18nService);
    translation.setLanguage('en');
  });

  afterEach(() => TestBed.resetTestingModule());

  function create(inputs: Record<string, unknown> = {}): UploadComponent {
    const fixture = TestBed.createComponent(UploadComponent);
    fixture.componentRef.setInput('adapter', stubAdapter());
    for (const [name, value] of Object.entries(inputs)) fixture.componentRef.setInput(name, value);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('commits the current selection on the first touch with updateOn blur', async () => {
    const fixture = TestBed.createComponent(BlurUploadHost);
    fixture.detectChanges();
    const component: UploadComponent = fixture.debugElement.query(By.directive(UploadComponent)).componentInstance;
    await select(component, [file('first.zip')]);
    expect(fixture.componentInstance.control.value.map((item) => item.name)).toEqual(['first.zip']);
    expect(fixture.componentInstance.control.touched).toBe(true);
    await select(component, [file('second.zip')]);
    expect(fixture.componentInstance.control.value.map((item) => item.name)).toEqual(['first.zip', 'second.zip']);
    component.clear();
    expect(fixture.componentInstance.control.value).toEqual([]);
  });

  it('does not render a staged file name or clear control', async () => {
    const fixture = TestBed.createComponent(UploadComponent);
    fixture.componentRef.setInput('adapter', stubAdapter());
    fixture.componentRef.setInput('autoEnqueue', false);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    await select(component, [file('staged.zip')]);
    fixture.detectChanges();

    expect(component.value()).toHaveLength(1);
    expect(fixture.nativeElement.querySelector('button[aria-label="Clear all files"]')).toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('staged.zip');
  });

  it('integrates selection errors with Angular validation and accessible feedback', async () => {
    const fixture = TestBed.createComponent(BlurUploadHost);
    fixture.detectChanges();
    const component: UploadComponent = fixture.debugElement.query(By.directive(UploadComponent)).componentInstance;
    const control = fixture.componentInstance.control;
    await select(component, [file('bad.txt')]);
    fixture.detectChanges();
    expect(control.hasError('upload')).toBe(true);
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input[type="file"]');
    const errors: HTMLElement = fixture.nativeElement.querySelector('[aria-live="polite"]');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe(errors.id);
    expect(errors.textContent).toContain('bad.txt');
    component.clearValidationErrors();
    expect(control.valid).toBe(true);
    await select(component, [file('another.txt')]);
    expect(control.invalid).toBe(true);
    control.reset();
    fixture.detectChanges();
    expect(control.valid).toBe(true);
    expect(component.errors()).toEqual([]);
    expect(input.hasAttribute('aria-invalid')).toBe(false);
  });

  it('reports rejected files without enqueueing them while accepted files still upload', async () => {
    const component = create({accept: '.zip', multiple: true});
    const errors: unknown[] = [];
    const completed: unknown[] = [];
    component.validationErrors.subscribe((value) => errors.push(value));
    component.uploadComplete.subscribe((value) => completed.push(value));

    await select(component, [file('bad.txt'), file('good.zip')]);

    expect(errors).toHaveLength(1);
    expect((errors[0] as {code: string}[])[0].code).toBe('upload.validation.accept');
    expect(component.value().map((item) => item.name)).toEqual(['good.zip']);
    expect(TestBed.inject(UploadQueueService).items()).toHaveLength(1);
    expect(completed).toHaveLength(1);
  });

  it('keeps the form value independent from queue state and cancels items when disabled', async () => {
    const pending = new Promise<void>(() => undefined);
    const component = create({adapter: {...stubAdapter(), uploadChunk: async () => pending}});
    const changes: (readonly File[])[] = [];
    component.registerOnChange((value) => changes.push(value));
    await select(component, [file('bundle.zip')]);

    expect(component.value()).toHaveLength(1);
    expect(changes.at(-1)).toHaveLength(1);

    component.setDisabledState(true);
    expect(component.disabledState()).toBe(true);
    expect(TestBed.inject(UploadQueueService).items()[0].status).toBe('cancelled');

    component.writeValue([]);
    expect(component.value()).toEqual([]);
    expect(TestBed.inject(UploadQueueService).items()).toEqual([]);
  });

  it('exposes a stable input id, a programmatic label and native disabled state', () => {
    const fixture = TestBed.createComponent(UploadComponent);
    fixture.componentRef.setInput('adapter', stubAdapter());
    fixture.componentRef.setInput('controlId', 'bundle-input');
    fixture.componentRef.setInput('multiple', true);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input[type="file"]');
    expect(input.id).toBe('bundle-input');
    expect(input.getAttribute('aria-label')).toBe(translation.translate('upload.selectFiles'));
    expect(input.disabled).toBe(true);
  });

  it('generates a stable input id when controlId is not supplied', () => {
    const fixture = TestBed.createComponent(UploadComponent);
    fixture.componentRef.setInput('adapter', stubAdapter());
    fixture.detectChanges();

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input[type="file"]');
    expect(input.id).toMatch(/^cll-upload-\d+$/);
  });

  it('cancels owner-supplied items on disable without emitting change or touch', async () => {
    const pending = new Promise<void>(() => undefined);
    const component = create({adapter: {...stubAdapter(), uploadChunk: async () => pending}});
    let changes = 0;
    let touches = 0;
    component.registerOnChange(() => (changes += 1));
    component.registerOnTouched(() => (touches += 1));
    await select(component, [file('bundle.zip')]);
    const changesAfterSelection = changes;
    touches = 0;

    component.setDisabledState(true);

    expect(TestBed.inject(UploadQueueService).items()[0].status).toBe('cancelled');
    expect(changes).toBe(changesAfterSelection);
    expect(touches).toBe(0);
  });

  it('rejects an oversized selection once without changing the existing queue', async () => {
    const component = create({multiple: true, maxFiles: 1});
    await select(component, [file('existing.zip')]);
    const original = TestBed.inject(UploadQueueService).items()[0];
    await select(component, [file('first.zip'), file('extra.zip')]);
    expect(component.errors()).toEqual([{code: 'upload.validation.maxFiles', phase: 'validation', message: '1'}]);
    expect(TestBed.inject(UploadQueueService).items()).toEqual([original]);
  });

  it('reports each oversized file while accepting valid siblings within the count limit', async () => {
    const component = create({multiple: true, maxSize: 1, maxFiles: 3});
    await select(component, [
      file('large.pdf', 2 * 1024 * 1024),
      file('large.png', 2 * 1024 * 1024),
      file('valid.zip'),
    ]);
    TestBed.inject(ApplicationRef).tick();
    expect(component.errors().map((error) => error.fileName)).toEqual(['large.pdf', 'large.png']);
    expect(document.querySelectorAll('.cll-upload__error-name')).toHaveLength(2);
    expect(TestBed.inject(UploadQueueService).items()).toHaveLength(1);
  });

  it('emits an error event when adapter cancellation fails', async () => {
    const pending = new Promise<void>(() => undefined);
    const component = create({
      adapter: {
        initiate: async () => ({uploadId: 'u1'}),
        uploadChunk: async () => pending,
        combine: async () => undefined,
        cancel: async () => {
          throw new Error('cancel failed');
        },
      },
    });
    const errors: unknown[] = [];
    const cancellations: unknown[] = [];
    component.uploadError.subscribe((value) => errors.push(value));
    component.uploadCancelled.subscribe((value) => cancellations.push(value));

    await select(component, [file('bundle.zip')]);
    component.setDisabledState(true);
    for (let index = 0; index < 20; index += 1) await Promise.resolve();

    TestBed.inject(ApplicationRef).tick();
    expect(errors).toHaveLength(1);
    expect(cancellations).toHaveLength(1);
    expect((errors[0] as {error?: {phase: string}}[])[0].error?.phase).toBe('cancel');
  });

  it('emits uploadError when a retried item fails again before the watcher re-arms', async () => {
    const component = create({
      adapter: {
        initiate: async () => ({uploadId: 'u1'}),
        uploadChunk: async () => {
          throw {code: 'chunk-failed', phase: 'chunk'};
        },
        combine: async () => undefined,
        cancel: async () => undefined,
      },
    });
    const attempts: number[] = [];
    component.uploadError.subscribe((value) => attempts.push(...value.map((item) => item.attempt)));

    await select(component, [file('bundle.zip')]);
    expect(attempts).toEqual([1]);

    const queue = TestBed.inject(UploadQueueService);
    void queue.retry(queue.items()[0].id)?.catch(() => undefined);
    // The second attempt settles before change detection re-runs the watcher effect.
    for (let index = 0; index < 40; index += 1) await Promise.resolve();
    expect(queue.items()[0].status).toBe('error');
    expect(queue.items()[0].attempt).toBe(2);

    TestBed.inject(ApplicationRef).tick();
    for (let index = 0; index < 40; index += 1) await Promise.resolve();
    expect(attempts).toEqual([1, 2]);
  });

  it('stages files without enqueueing when autoEnqueue is false', () => {
    const fixture = TestBed.createComponent(UploadComponent);
    fixture.componentRef.setInput('adapter', stubAdapter());
    fixture.componentRef.setInput('autoEnqueue', false);
    fixture.detectChanges();
    const emitted: (readonly File[])[] = [];
    fixture.componentInstance.filesChange.subscribe((files) => emitted.push(files));

    select(fixture.componentInstance, [file('staged.zip')]);

    expect(emitted).toHaveLength(1);
    expect(emitted[0].map((item) => item.name)).toEqual(['staged.zip']);
    expect(TestBed.inject(UploadQueueService).items()).toEqual([]);
  });

  it('uses the visible picker button as the restore target when the clipped input has focus', async () => {
    const fixture = TestBed.createComponent(UploadComponent);
    fixture.componentRef.setInput('adapter', stubAdapter());
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input[type="file"]');
    expect(input.getAttribute('aria-label')).toBe('Select file');
    expect(fixture.nativeElement.querySelector('.cll-upload__browse').textContent.trim()).toBe('Choose file');
    input.focus();
    expect(document.activeElement).toBe(input);

    await select(fixture.componentInstance, [file('bundle.zip')]);

    expect(TestBed.inject(UploadPanelManager).restoreTarget()).toBe(
      fixture.nativeElement.querySelector('.cll-upload__browse'),
    );
  });

  it('emits cancellation even when the queue is cleared synchronously', async () => {
    const component = create({adapter: {...stubAdapter(), uploadChunk: () => new Promise(() => undefined)}});
    const cancelled: string[] = [];
    component.uploadCancelled.subscribe((items) => cancelled.push(...items.map((item) => item.status)));
    await select(component, [file('bundle.zip')]);
    const queue = TestBed.inject(UploadQueueService);

    queue.cancel(queue.items()[0].id);
    queue.clearCompleted();
    for (let index = 0; index < 40; index += 1) await Promise.resolve();

    expect(cancelled).toEqual(['cancelled']);
  });

  it('ships owned messages in the active locale', () => {
    create();
    expect(translation.translate('upload.status.queued')).toBe('Queued');
    expect(translation.translate('upload.minimize')).toBe('Minimize');
  });
});

describe('UploadComponent dropzone', () => {
  let translation: ClrLiftI18nService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [UploadComponent]});
    translation = TestBed.inject(ClrLiftI18nService);
    translation.setLanguage('en');
  });

  afterEach(() => TestBed.resetTestingModule());

  function create(inputs: Record<string, unknown> = {}): {component: UploadComponent; element: HTMLElement} {
    const fixture = TestBed.createComponent(UploadComponent);
    fixture.componentRef.setInput('adapter', stubAdapter());
    for (const [name, value] of Object.entries(inputs)) fixture.componentRef.setInput(name, value);
    fixture.detectChanges();
    return {component: fixture.componentInstance, element: fixture.nativeElement as HTMLElement};
  }

  async function drop(component: UploadComponent, files: readonly File[]): Promise<void> {
    const dataTransfer = {files, items: []} as unknown as DataTransfer;
    await component.onDrop({preventDefault: () => undefined, dataTransfer} as unknown as DragEvent);
    for (let index = 0; index < 40; index += 1) await Promise.resolve();
  }

  function dragEvent(type: 'enter' | 'over' | 'leave'): DragEvent {
    return {preventDefault: () => undefined, type} as unknown as DragEvent;
  }

  it.each(['reset', 'clear', 'disable', 'destroy'] as const)(
    'invalidates a pending directory drop on %s',
    async (action) => {
      const {component} = create({multiple: true});
      const queue = TestBed.inject(UploadQueueService);
      let release: (entries: FileSystemEntry[]) => void = () => undefined;
      let reads = 0;
      const directory = {
        isDirectory: true,
        isFile: false,
        createReader: () => ({
          readEntries: (next: (entries: FileSystemEntry[]) => void) => {
            if (reads++ === 0) release = next;
            else next([]);
          },
        }),
      } as unknown as FileSystemEntry;
      const child = {
        isFile: true,
        file: (next: (value: File) => void) => next(file('late.zip')),
      } as unknown as FileSystemEntry;
      let changes = 0;
      let touches = 0;
      component.registerOnChange(() => {
        changes++;
      });
      component.registerOnTouched(() => {
        touches++;
      });
      const pending = component.onDrop({
        preventDefault: () => undefined,
        dataTransfer: {files: [], items: [{kind: 'file', webkitGetAsEntry: () => directory}]},
      } as unknown as DragEvent);
      if (action === 'reset') component.writeValue([]);
      if (action === 'clear') component.clear();
      if (action === 'disable') {
        component.setDisabledState(true);
        component.setDisabledState(false);
      }
      if (action === 'destroy') TestBed.resetTestingModule();
      release([child]);
      await pending;
      expect(component.value()).toEqual([]);
      expect(queue.items()).toEqual([]);
      expect(changes).toBe(0);
      expect(touches).toBe(0);
    },
  );

  it.each(['file', 'directory'] as const)(
    'rejects an unreadable %s drop atomically and preserves the prior selection',
    async (failureKind) => {
      const {component, element} = create({multiple: true});
      await drop(component, [file('previous.zip')]);
      const queue = TestBed.inject(UploadQueueService);
      const enqueue = vi.spyOn(queue, 'enqueue');
      const rejected = vi.fn();
      component.validationErrors.subscribe(rejected);
      let reads = 0;
      const directory = {
        isFile: false,
        isDirectory: true,
        name: 'folder',
        fullPath: '/folder',
        createReader: () => ({
          readEntries: (next: (entries: unknown[]) => void, fail: (error: DOMException) => void) => {
            if (reads++ === 0)
              next([{isFile: true, file: (success: (value: File) => void) => success(file('ok.zip'))}]);
            else if (failureKind === 'directory') fail(new DOMException('Unavailable', 'NotReadableError'));
            else if (reads === 2)
              next([
                {
                  isFile: true,
                  name: 'locked.zip',
                  fullPath: '/folder/locked.zip',
                  file: (_next: unknown, fail: (error: DOMException) => void) =>
                    fail(new DOMException('Unavailable', 'NotReadableError')),
                },
              ]);
            else next([]);
          },
        }),
      };
      await component.onDrop({
        preventDefault: () => undefined,
        dataTransfer: {files: [], items: [{kind: 'file', webkitGetAsEntry: () => directory}]},
      } as unknown as DragEvent);
      TestBed.tick();
      expect(enqueue).not.toHaveBeenCalled();
      expect(component.value().map((file) => file.name)).toEqual(['previous.zip']);
      expect(rejected).toHaveBeenCalledWith([
        expect.objectContaining({
          code: 'upload.validation.read',
          phase: 'validation',
          fileName: failureKind === 'file' ? 'folder/locked.zip' : 'folder',
        }),
      ]);
      expect(element.textContent).toContain('We cannot read this selection. No files were added.');
      expect(element.textContent).toContain(failureKind === 'file' ? 'folder/locked.zip' : 'folder');
      expect(component.reading()).toBe(false);
    },
  );

  it.each(['reset', 'clear', 'disable', 'destroy'] as const)(
    'ignores a late drop-read failure after %s',
    async (action) => {
      const {component} = create({multiple: true});
      const rejected = vi.fn();
      component.validationErrors.subscribe(rejected);
      let failRead: (error: DOMException) => void = () => undefined;
      const directory = {
        isFile: false,
        isDirectory: true,
        createReader: () => ({
          readEntries: (_next: unknown, fail: (error: DOMException) => void) => {
            failRead = fail;
          },
        }),
      };
      const pending = component.onDrop({
        preventDefault: () => undefined,
        dataTransfer: {files: [], items: [{kind: 'file', webkitGetAsEntry: () => directory}]},
      } as unknown as DragEvent);
      if (action === 'reset') component.writeValue([]);
      if (action === 'clear') component.clear();
      if (action === 'disable') {
        component.setDisabledState(true);
        component.setDisabledState(false);
      }
      if (action === 'destroy') TestBed.resetTestingModule();
      failRead(new DOMException('Unavailable', 'NotReadableError'));
      await pending;
      expect(rejected).not.toHaveBeenCalled();
      expect(component.errors()).toEqual([]);
      expect(component.value()).toEqual([]);
    },
  );

  function pendingDirectoryDrop(component: UploadComponent, name: string) {
    let release: (entries: unknown[]) => void = () => undefined;
    let fail: (error: DOMException) => void = () => undefined;
    let reads = 0;
    const directory = {
      isFile: false,
      isDirectory: true,
      name,
      fullPath: '/' + name,
      createReader: () => ({
        readEntries: (next: (entries: unknown[]) => void, error: (error: DOMException) => void) => {
          if (reads++ === 0) {
            release = next;
            fail = error;
          } else next([]);
        },
      }),
    };
    const pending = component.onDrop({
      preventDefault: () => undefined,
      dataTransfer: {files: [], items: [{kind: 'file', webkitGetAsEntry: () => directory}]},
    } as unknown as DragEvent);
    return {
      pending,
      succeed: () => release([{isFile: true, file: (next: (file: File) => void) => next(file(name + '.zip'))}]),
      fail: () => fail(new DOMException('Unavailable', 'NotReadableError')),
    };
  }

  it('appends both overlapping folder drops and keeps reading until both finish', async () => {
    const {component} = create({multiple: true});
    const queue = TestBed.inject(UploadQueueService);
    const first = pendingDirectoryDrop(component, 'first');
    const second = pendingDirectoryDrop(component, 'second');
    second.succeed();
    await second.pending;
    expect(component.reading()).toBe(true);
    expect(component.value().map((file) => file.name)).toEqual(['second.zip']);
    first.succeed();
    await first.pending;
    expect(component.reading()).toBe(false);
    expect(component.value().map((file) => file.name)).toEqual(['second.zip', 'first.zip']);
    expect(queue.items().map((item) => item.file.name)).toEqual(['second.zip', 'first.zip']);
    await Promise.all(queue.items().map((item) => queue.completion(item.id)));
  });

  it('reports one failed folder drop without discarding another pending valid drop', async () => {
    const {component} = create({multiple: true});
    const rejected = vi.fn();
    component.validationErrors.subscribe(rejected);
    const valid = pendingDirectoryDrop(component, 'valid');
    const invalid = pendingDirectoryDrop(component, 'unreadable');
    invalid.fail();
    await invalid.pending;
    expect(component.reading()).toBe(true);
    expect(rejected).toHaveBeenCalledWith([
      expect.objectContaining({code: 'upload.validation.read', fileName: 'unreadable'}),
    ]);
    valid.succeed();
    await valid.pending;
    expect(component.reading()).toBe(false);
    expect(component.value().map((file) => file.name)).toEqual(['valid.zip']);
    expect(
      TestBed.inject(UploadQueueService)
        .items()
        .map((item) => item.file.name),
    ).toEqual(['valid.zip']);
    expect(component.errors()).toEqual([expect.objectContaining({code: 'upload.validation.read'})]);
    const queue = TestBed.inject(UploadQueueService);
    await Promise.all(queue.items().map((item) => queue.completion(item.id)));
  });

  it('does not let an old read clear the reading state of a new selection after reset', async () => {
    const {component} = create({multiple: true});
    const previous = pendingDirectoryDrop(component, 'previous');
    component.writeValue([]);
    const current = pendingDirectoryDrop(component, 'current');
    previous.succeed();
    await previous.pending;
    expect(component.reading()).toBe(true);
    expect(component.value()).toEqual([]);
    current.succeed();
    await current.pending;
    expect(component.reading()).toBe(false);
    expect(component.value().map((file) => file.name)).toEqual(['current.zip']);
    const queue = TestBed.inject(UploadQueueService);
    await Promise.all(queue.items().map((item) => queue.completion(item.id)));
  });

  it('renders the dropzone with browse and folder actions and the per-selection limit', () => {
    const {element} = create({multiple: true, maxFiles: 20, accept: '.zip', maxSize: 20});

    expect(element.querySelector('.cll-upload__dropzone')).toBeTruthy();
    expect(element.querySelector('.cll-upload__browse')!.textContent!.trim()).toBe('Choose files');
    expect(element.querySelector('.cll-upload__folder')!.textContent!.trim()).toBe('Choose folder');
    expect(element.textContent).toContain('20');
    expect(element.querySelector('input[webkitdirectory]')).toBeTruthy();
  });

  it('enqueues dropped files and resets the drag state', async () => {
    const {component} = create();
    component.onDragEnter(dragEvent('enter'));
    expect(component.dragOver()).toBe(true);
    component.onDragEnter(dragEvent('enter'));
    component.onDragLeave(dragEvent('leave'));
    expect(component.dragOver()).toBe(true);

    await drop(component, [file('dropped.zip')]);

    expect(component.dragOver()).toBe(false);
    expect(component.value().map((item) => item.name)).toEqual(['dropped.zip']);
    expect(TestBed.inject(UploadQueueService).items()).toHaveLength(1);
  });

  it('ignores drops and drag state while disabled', async () => {
    const {component} = create();
    component.setDisabledState(true);

    await drop(component, [file('ignored.zip')]);
    component.onDragEnter(dragEvent('enter'));

    expect(component.dragOver()).toBe(false);
    expect(TestBed.inject(UploadQueueService).items()).toEqual([]);
  });

  it('exits the drag state once the pointer leaves the dropzone', () => {
    const {component} = create();
    component.onDragEnter(dragEvent('enter'));
    component.onDragLeave(dragEvent('leave'));

    expect(component.dragOver()).toBe(false);
  });
  it('skips suspected repeats in the same adapter scope but accepts same-name different files', async () => {
    const adapter = stubAdapter();
    const component = create({adapter, multiple: true}).component;
    const first = new File(['first'], 'bundle.zip', {lastModified: 7});
    await select(component, [first, first]);
    const queue = TestBed.inject(UploadQueueService);
    expect(queue.items()).toHaveLength(1);
    expect(component.duplicates()).toHaveLength(1);
    await select(component, [new File(['first'], 'bundle.zip', {lastModified: 7})]);
    expect(queue.items()).toHaveLength(1);
    await select(component, [new File(['different'], 'bundle.zip', {lastModified: 7})]);
    expect(queue.items()).toHaveLength(2);
    const otherTarget = create({adapter: stubAdapter(), multiple: true}).component;
    await select(otherTarget, [first]);
    expect(queue.items()).toHaveLength(3);
    queue.clearCompleted();
    await select(component, [first]);
    expect(queue.items()).toHaveLength(1);
  });

  it('keeps rejection details when valid files are appended and does not block valid siblings', async () => {
    const component = create({multiple: true, accept: '.zip'}).component;
    await select(component, [file('readme.txt'), file('first.zip')]);
    expect(component.errors()).toHaveLength(1);
    expect(TestBed.inject(UploadQueueService).items()).toHaveLength(1);
    await select(component, [file('second.zip')]);
    expect(component.errors()).toHaveLength(1);
    expect(TestBed.inject(UploadQueueService).items()).toHaveLength(2);
    component.clearValidationErrors();
    expect(component.errors()).toEqual([]);
  });
  it('keeps duplicate detection isolated by explicit destination even with a reused adapter', async () => {
    const adapter = stubAdapter();
    const source = new File(['bytes'], 'same.zip', {lastModified: 8});
    const first = create({adapter, multiple: true, scope: 'region-a'}).component;
    const second = create({adapter, multiple: true, scope: 'region-b'}).component;
    const third = create({adapter: stubAdapter(), multiple: true, scope: 'region-a'}).component;
    await select(first, [source]);
    await select(second, [source]);
    await select(third, [source]);
    expect(TestBed.inject(UploadQueueService).items()).toHaveLength(2);
    expect(third.duplicates()).toHaveLength(1);
    expect(second.duplicates()).toEqual([]);
  });
  it('does not turn a duplicate into a count-limit rejection', async () => {
    const {component} = create({multiple: true, maxFiles: 1});
    const source = new File(['bytes'], 'same.zip', {lastModified: 9});
    await select(component, [source, source]);
    expect(component.duplicates()).toHaveLength(1);
    expect(component.errors()).toEqual([]);
    expect(TestBed.inject(UploadQueueService).items()).toHaveLength(1);
  });
  it('does not claim rejected same-selection duplicates are already queued', async () => {
    const {component} = create({multiple: true, maxFiles: 1, accept: '.zip'});
    const source = file('same.zip');
    await select(component, [source, source, file('extra.zip')]);
    expect(component.duplicates()).toEqual([]);
    expect(TestBed.inject(UploadQueueService).items()).toEqual([]);
    const unsupported = file('same.txt');
    await select(component, [unsupported, unsupported]);
    expect(component.duplicates()).toEqual([]);
    expect(TestBed.inject(UploadQueueService).items()).toEqual([]);
  });
});
