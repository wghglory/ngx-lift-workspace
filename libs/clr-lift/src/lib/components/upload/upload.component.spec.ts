import {ApplicationRef} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {type UploadAdapter, UploadQueueService} from 'ngx-lift';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';

import {TranslationService} from '../../services/translation.service';
import {UploadComponent} from './upload.component';

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
    expect(component.isDisabled()).toBe(true);
    expect(TestBed.inject(UploadQueueService).items()[0].status).toBe('cancelled');

    component.writeValue([]);
    expect(component.value()).toEqual([]);
    expect(TestBed.inject(UploadQueueService).items()).toEqual([]);
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

    expect(errors).toHaveLength(1);
    expect(cancellations).toHaveLength(0);
    expect((errors[0] as {error?: {phase: string}}[])[0].error?.phase).toBe('cancel');
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
