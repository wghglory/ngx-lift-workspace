import {ApplicationRef, Component} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {type UploadAdapter, UploadQueueService} from 'ngx-lift';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';

import {TranslationService} from '../../services/translation.service';
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
  let translation: TranslationService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [UploadComponent]});
    translation = TestBed.inject(TranslationService);
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
    const component = create({accept: '.zip'});
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
    const changes: readonly File[][] = [];
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

  it('reports size and count violations with the rejected file names', async () => {
    const component = create({maxSize: 1, maxFiles: 1});
    const errors: {code: string; fileName?: string}[][] = [];
    component.validationErrors.subscribe((value) => errors.push([...value]));

    await select(component, [file('large.zip', 2 * 1024 * 1024 + 1), file('first.zip'), file('extra.zip')]);
    TestBed.inject(ApplicationRef).tick();

    expect(errors[0].map((error) => error.code)).toEqual(['upload.validation.maxSize', 'upload.validation.maxFiles']);
    expect(errors[0].map((error) => error.fileName)).toEqual(['large.zip', 'extra.zip']);
    expect(document.querySelectorAll('.cll-upload__error-name')).toHaveLength(2);
    expect(document.body.textContent).toContain('large.zip');
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
    const emitted: readonly File[][] = [];
    fixture.componentInstance.filesChange.subscribe((files) => emitted.push(files));

    select(fixture.componentInstance, [file('staged.zip')]);

    expect(emitted).toHaveLength(1);
    expect(emitted[0].map((item) => item.name)).toEqual(['staged.zip']);
    expect(TestBed.inject(UploadQueueService).items()).toEqual([]);
  });

  it('uses Browse as the restore target when the clipped input has focus', async () => {
    const fixture = TestBed.createComponent(UploadComponent);
    fixture.componentRef.setInput('adapter', stubAdapter());
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input[type="file"]');
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
    expect(translation.translate('upload.restore')).toBe('Restore upload progress');
  });
});

describe('UploadComponent dropzone', () => {
  let translation: TranslationService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [UploadComponent]});
    translation = TestBed.inject(TranslationService);
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

  it('renders the dropzone with browse and folder actions plus the used count', () => {
    const {element} = create({multiple: true, maxFiles: 20, accept: '.zip', maxSize: 20});

    expect(element.querySelector('.cll-upload__dropzone')).toBeTruthy();
    expect(element.querySelector('.cll-upload__browse')).toBeTruthy();
    expect(element.querySelector('.cll-upload__folder')).toBeTruthy();
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
});
