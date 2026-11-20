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

  it('ships owned messages in the active locale', () => {
    create();
    expect(translation.translate('upload.status.queued')).toBe('Queued');
    expect(translation.translate('upload.restore')).toBe('Restore upload progress');
  });
});
