import {flushEffects} from '../../../test-setup';
import {Component, signal} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {FormControl, FormControlDirective, NgControl, ReactiveFormsModule} from '@angular/forms';
import {vi, beforeEach, afterEach} from 'vitest';

import {TranslationService} from '../../services/translation.service';
import {MockTranslationService} from '../../services/translation.service.mock';
import {FileReaderComponent} from './file-reader.component';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('FileReaderComponent', () => {
  let component: FileReaderComponent;
  let fixture: ComponentFixture<FileReaderComponent>;
  let mockFormControl: FormControl;
  let mockNgControl: FormControlDirective;

  beforeEach(() => {
    mockFormControl = new FormControl('');
    mockNgControl = {
      control: mockFormControl,
      form: mockFormControl,
      valueAccessor: null,
      validator: null,
      asyncValidator: null,
    } as unknown as FormControlDirective;

    TestBed.configureTestingModule({
      imports: [FileReaderComponent, ReactiveFormsModule],
      providers: [
        {provide: TranslationService, useClass: MockTranslationService},
        {provide: NgControl, useValue: mockNgControl},
      ],
    });
    fixture = TestBed.createComponent(FileReaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    // Restore original FileReader
    delete (globalThis as {FileReader?: unknown}).FileReader;
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
  });

  describe('ControlValueAccessor', () => {
    it('should register onChange callback', async () => {
      const onChangeFn = vi.fn();
      component.registerOnChange(onChangeFn);

      component['onChange']('test');
      expect(onChangeFn).toHaveBeenCalledWith('test');
    });

    it('should register onTouched callback', async () => {
      const onTouchedFn = vi.fn();
      component.registerOnTouched(onTouchedFn);

      component['onTouched']();
      expect(onTouchedFn).toHaveBeenCalled();
    });

    it('should set disabled state', async () => {
      component.setDisabledState(true);
      expect(component.isDisabled()).toBe(true);

      component.setDisabledState(false);
      expect(component.isDisabled()).toBe(false);
    });

    it('should write value for encoded content', async () => {
      const encodedValue = btoa('test content');
      fixture.componentRef.setInput('encoded', true);
      fixture.detectChanges();

      component.writeValue(encodedValue);
      await flushEffects();

      expect(component['encodedContent']()).toBe(encodedValue);
      expect(component['rawContent']()).toBe('test content');
    });

    it('should write value for raw content', async () => {
      const rawValue = 'test content';
      fixture.componentRef.setInput('encoded', false);
      fixture.detectChanges();

      component.writeValue(rawValue);
      await flushEffects();

      expect(component['rawContent']()).toBe(rawValue);
      expect(component['encodedContent']()).toBe(btoa(rawValue));
    });

    it('clears existing content when the form resets its value', () => {
      component.writeValue('previous content');
      component.parseError.set('previous error');
      component.writeValue('');

      expect(component.rawContent()).toBe('');
      expect(component.encodedContent()).toBe('');
      expect(component.parseError()).toBe('');
    });

    it('does not emit change or touched callbacks for model-to-view updates', async () => {
      const onChange = vi.fn();
      const onTouched = vi.fn();
      component.registerOnChange(onChange);
      component.registerOnTouched(onTouched);
      component.writeValue('server value');
      await flushEffects();

      expect(onChange).not.toHaveBeenCalled();
      expect(onTouched).not.toHaveBeenCalled();
    });

    it('accepts Unicode text when writing an unencoded form value', () => {
      expect(() => component.writeValue('中文 🚀')).not.toThrow();
      expect(component.rawContent()).toBe('中文 🚀');
    });
  });

  describe('onFileSelected', () => {
    const createFileInput = (file: File): HTMLInputElement => {
      const inputElement = document.createElement('input');
      inputElement.type = 'file';
      // Create a mock FileList
      const fileList = {
        0: file,
        length: 1,
        item: (index: number) => (index === 0 ? file : null),
        [Symbol.iterator]: function* () {
          yield file;
        },
      } as FileList;
      Object.defineProperty(inputElement, 'files', {
        value: fileList,
        writable: false,
      });
      return inputElement;
    };

    it('should handle file selection and read as text', async () => {
      const file = new File(['test content'], 'test.txt', {type: 'text/plain'});
      const fileChangeSpy = vi.spyOn(component.fileChange, 'emit');
      const onChangeSpy = vi.spyOn(component as never, 'onChange');
      const onTouchedSpy = vi.spyOn(component as never, 'onTouched');

      // Mock FileReader
      const mockFileReader = {
        result: 'test content',
        onload: null as ((e: ProgressEvent<FileReader>) => void) | null,
        readAsText: vi.fn(function (this: FileReader) {
          // Simulate async behavior
          setTimeout(() => {
            if (this.onload) {
              const event = {
                target: this,
              } as ProgressEvent<FileReader>;
              this.onload(event);
            }
          }, 0);
        }),
      };
      globalThis.FileReader = class MockFileReader {
        static LOADING = 1;
        readyState = 2;
        result = mockFileReader.result;
        onload = mockFileReader.onload;
        readAsText = mockFileReader.readAsText;
      } as unknown as typeof FileReader;

      const inputElement = createFileInput(file);
      const event = new Event('change');
      Object.defineProperty(event, 'target', {value: inputElement, enumerable: true});

      component.onFileSelected(event);
      await flushEffects();

      expect(component.selectedFile()).toEqual(file);
      expect(component['rawContent']()).toBe('test content');
      expect(fileChangeSpy).toHaveBeenCalledWith('test content');
      expect(onChangeSpy).toHaveBeenCalled();
      expect(onTouchedSpy).toHaveBeenCalled();
    });

    it('should handle file selection with encoded content', async () => {
      const file = new File(['test content'], 'test.txt', {type: 'text/plain'});
      fixture.componentRef.setInput('encoded', true);
      fixture.detectChanges();

      const fileChangeSpy = vi.spyOn(component.fileChange, 'emit');

      // Mock FileReader
      const mockFileReader = {
        result: 'test content',
        onload: null as ((e: ProgressEvent<FileReader>) => void) | null,
        readAsText: vi.fn(function (this: FileReader) {
          setTimeout(() => {
            if (this.onload) {
              const event = {
                target: this,
              } as unknown as ProgressEvent<FileReader>;
              this.onload(event);
            }
          }, 0);
        }),
      };
      globalThis.FileReader = class MockFileReader {
        static LOADING = 1;
        readyState = 2;
        result = mockFileReader.result;
        onload = mockFileReader.onload;
        readAsText = mockFileReader.readAsText;
      } as unknown as typeof FileReader;

      const inputElement = createFileInput(file);
      const event = new Event('change');
      Object.defineProperty(event, 'target', {value: inputElement, enumerable: true});

      component.onFileSelected(event);
      await flushEffects();

      expect(component['encodedContent']()).toBe(btoa('test content'));
      expect(fileChangeSpy).toHaveBeenCalledWith(btoa('test content'));
    });

    it('should handle file selection error', async () => {
      fixture.componentRef.setInput('encoded', true);
      const file = new File(['test'], 'test.txt', {type: 'text/plain'});
      const originalBtoa = window.btoa;
      window.btoa = vi.fn(() => {
        throw new Error('Encoding error');
      });

      const onChangeSpy = vi.spyOn(component as never, 'onChange');

      // Mock FileReader
      const mockFileReader = {
        result: 'test',
        onload: null as ((e: ProgressEvent<FileReader>) => void) | null,
        readAsText: vi.fn(function (this: FileReader) {
          setTimeout(() => {
            if (this.onload) {
              const event = {
                target: this,
              } as ProgressEvent<FileReader>;
              this.onload(event);
            }
          }, 0);
        }),
      };
      globalThis.FileReader = class MockFileReader {
        static LOADING = 1;
        readyState = 2;
        result = mockFileReader.result;
        onload = mockFileReader.onload;
        readAsText = mockFileReader.readAsText;
      } as unknown as typeof FileReader;

      const inputElement = createFileInput(file);
      const event = new Event('change');
      Object.defineProperty(event, 'target', {value: inputElement, enumerable: true});

      component.onFileSelected(event);
      await flushEffects();

      expect(component['parseError']()).toBe('Encoding error');
      expect(onChangeSpy).toHaveBeenCalledWith(' ');

      window.btoa = originalBtoa;
    });

    it('should clear parse error on new file selection', async () => {
      component['parseError'].set('previous error');

      // Mock FileReader - ensure btoa doesn't throw
      const originalBtoa = window.btoa;
      const mockFileReader = {
        result: 'test content',
        onload: null as ((e: ProgressEvent<FileReader>) => void) | null,
        readAsText: vi.fn(function (this: FileReader) {
          setTimeout(() => {
            if (this.onload) {
              const event = {
                target: this,
              } as unknown as ProgressEvent<FileReader>;
              this.onload(event);
            }
          }, 0);
        }),
      };
      globalThis.FileReader = class MockFileReader {
        static LOADING = 1;
        readyState = 2;
        result = mockFileReader.result;
        onload = mockFileReader.onload;
        readAsText = mockFileReader.readAsText;
      } as unknown as typeof FileReader;

      const file = new File(['test content'], 'test.txt', {type: 'text/plain'});
      const inputElement = createFileInput(file);
      const event = new Event('change');
      Object.defineProperty(event, 'target', {value: inputElement, enumerable: true});

      component.onFileSelected(event);
      await flushEffects();

      expect(component['parseError']()).toBe('');
      window.btoa = originalBtoa;
    });

    it('should not process if no files selected', async () => {
      const inputElement = document.createElement('input');
      inputElement.type = 'file';
      inputElement.files = null as never;

      const event = new Event('change');
      Object.defineProperty(event, 'target', {value: inputElement, enumerable: true});

      component.onFileSelected(event);

      expect(component.selectedFile()).toBeUndefined();
    });
  });

  describe('removeFile', () => {
    it('should remove selected file and reset state', async () => {
      const file = new File(['test'], 'test.txt', {type: 'text/plain'});
      component.selectedFile.set(file);
      component['rawContent'].set('test content');
      // Use the actual base64 value instead of calling btoa to avoid mock issues
      component['encodedContent'].set('dGVzdCBjb250ZW50');

      const fileElement = component.fileElement();
      const onChangeSpy = vi.spyOn(component as never, 'onChange');
      const onTouchedSpy = vi.spyOn(component as never, 'onTouched');

      component.removeFile();
      await flushEffects();

      expect(fileElement.nativeElement.value).toBe('');
      expect(component.selectedFile()).toBeUndefined();
      expect(component['rawContent']()).toBe('');
      expect(component['encodedContent']()).toBe('');
      expect(onChangeSpy).toHaveBeenCalledWith('');
      expect(onTouchedSpy).toHaveBeenCalled();
    });
  });

  describe('Validator', () => {
    it('should return null when file is valid', async () => {
      const file = new File(['test'], 'test.txt', {type: 'text/plain'});
      component.selectedFile.set(file);
      fixture.componentRef.setInput('maxSize', 10);
      fixture.detectChanges();

      const result = component.validate(mockFormControl);
      expect(result).toBeNull();
    });

    it('should return exceedLimit error when file size exceeds maxSize', async () => {
      const file = new File(['test content'], 'test.txt', {type: 'text/plain'});
      // Create a file with size > 1MB
      Object.defineProperty(file, 'size', {value: 2 * 1024 * 1024, writable: false});
      component.selectedFile.set(file);
      fixture.componentRef.setInput('maxSize', 1);
      fixture.detectChanges();

      const result = component.validate(mockFormControl);
      expect(result).toEqual({exceedLimit: true});
    });

    it('should return parse error when parseError is set', async () => {
      component['parseError'].set('Parse error message');

      const result = component.validate(mockFormControl);
      expect(result).toEqual({parse: 'Parse error message'});
    });

    it('should return null when no file is selected', async () => {
      component.selectedFile.set(undefined);

      const result = component.validate(mockFormControl);
      expect(result).toBeNull();
    });
  });

  describe('sizeInvalid computed', () => {
    it('should return false when no file is selected', async () => {
      component.selectedFile.set(undefined);
      expect(component.sizeInvalid()).toBe(false);
    });

    it('should return false when file size is within limit', async () => {
      const file = new File(['test'], 'test.txt', {type: 'text/plain'});
      Object.defineProperty(file, 'size', {value: 500 * 1024, writable: false});
      component.selectedFile.set(file);
      fixture.componentRef.setInput('maxSize', 1);
      fixture.detectChanges();

      expect(component.sizeInvalid()).toBe(false);
    });

    it('should return true when file size exceeds limit', async () => {
      const file = new File(['test'], 'test.txt', {type: 'text/plain'});
      Object.defineProperty(file, 'size', {value: 2 * 1024 * 1024, writable: false});
      component.selectedFile.set(file);
      fixture.componentRef.setInput('maxSize', 1);
      fixture.detectChanges();

      expect(component.sizeInvalid()).toBe(true);
    });
  });

  describe('Inputs', () => {
    it('should set controlId input', async () => {
      fixture.componentRef.setInput('controlId', 'test-id');
      fixture.detectChanges();

      expect(component.controlId()).toBe('test-id');
    });

    it('should set acceptFiles input', async () => {
      fixture.componentRef.setInput('acceptFiles', '.txt,.pdf');
      fixture.detectChanges();

      expect(component.acceptFiles()).toBe('.txt,.pdf');
    });

    it('should set encoded input', async () => {
      fixture.componentRef.setInput('encoded', true);
      fixture.detectChanges();

      expect(component.encoded()).toBe(true);
    });

    it('should set maxSize input', async () => {
      fixture.componentRef.setInput('maxSize', 5);
      fixture.detectChanges();

      expect(component.maxSize()).toBe(5);
    });

    it('should set disabled input', async () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(component.isDisabled()).toBe(true);
    });
  });
  describe('file read lifetime', () => {
    class ControlledReader {
      static LOADING = 1;
      readyState = 1;
      result: string | null = null;
      error: DOMException | null = null;
      onload: ((event: ProgressEvent<FileReader>) => void) | null = null;
      onerror: (() => void) | null = null;
      abort = vi.fn();
      readAsText = vi.fn();
      constructor() {
        readers.push(this);
      }
    }
    let readers: ControlledReader[];

    beforeEach(() => {
      readers = [];
      globalThis.FileReader = ControlledReader as unknown as typeof FileReader;
    });

    function selectFile(name: string) {
      const input = document.createElement('input');
      Object.defineProperty(input, 'files', {value: [new File(['content'], name)]});
      component.onFileSelected({target: input} as unknown as Event);
    }

    function complete(reader: ControlledReader, text: string) {
      reader.result = text;
      reader.onload?.({target: reader} as unknown as ProgressEvent<FileReader>);
    }

    it('accepts Unicode files without encoding in plain-text mode', () => {
      const onChange = vi.fn();
      component.registerOnChange(onChange);
      selectFile('unicode.txt');
      complete(readers[0], '中文 🚀');

      expect(component.parseError()).toBe('');
      expect(onChange).toHaveBeenCalledWith('中文 🚀');
    });

    it('roundtrips Unicode text through encoded form values', () => {
      fixture.componentRef.setInput('encoded', true);
      fixture.detectChanges();
      const onChange = vi.fn();
      component.registerOnChange(onChange);
      selectFile('unicode.txt');
      complete(readers[0], '中文 🚀');
      expect(component.parseError()).toBe('');
      const encoded = onChange.mock.calls[0][0];
      component.writeValue(encoded);
      expect(component.rawContent()).toBe('中文 🚀');
    });

    it('supports explicit legacy Latin-1 values without changing their byte encoding', () => {
      fixture.componentRef.setInput('encoded', true);
      fixture.componentRef.setInput('textEncoding', 'latin1');
      fixture.detectChanges();
      component.writeValue(btoa('café'));
      expect(component.rawContent()).toBe('café');
      expect(component.parseError()).toBe('');
    });

    it('reports malformed UTF-8 as validation state without writing back or touching', () => {
      fixture.componentRef.setInput('encoded', true);
      fixture.detectChanges();
      const changed = vi.fn(),
        touched = vi.fn();
      component.registerOnChange(changed);
      component.registerOnTouched(touched);
      component.writeValue(btoa(String.fromCharCode(255)));
      expect(component.parseError()).not.toBe('');
      expect(component.validate(mockFormControl)).toHaveProperty('parse');
      expect(changed).not.toHaveBeenCalled();
      expect(touched).not.toHaveBeenCalled();
    });

    it('rejects oversized files before starting FileReader', () => {
      fixture.componentRef.setInput('maxSize', 0);
      fixture.detectChanges();
      selectFile('oversized.txt');
      expect(readers).toHaveLength(0);
      expect(component.validate(mockFormControl)).toEqual({exceedLimit: true});
    });

    it('cancels an old read when another file is selected', () => {
      const onChange = vi.fn();
      component.registerOnChange(onChange);
      selectFile('old.txt');
      const oldReader = readers[0];
      const staleLoad = oldReader.onload;
      selectFile('new.txt');
      complete(readers[1], 'new value');
      oldReader.result = 'stale value';
      staleLoad?.({target: oldReader} as unknown as ProgressEvent<FileReader>);

      expect(oldReader.abort).toHaveBeenCalled();
      expect(component.rawContent()).toBe('new value');
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('prevents a removed file from returning after its read completes', () => {
      selectFile('removed.txt');
      const reader = readers[0];
      const staleLoad = reader.onload;
      component.removeFile();
      reader.result = 'late value';
      staleLoad?.({target: reader} as unknown as ProgressEvent<FileReader>);

      expect(component.rawContent()).toBe('');
      expect(reader.abort).toHaveBeenCalled();
    });

    it('cancels the active read when destroyed', () => {
      selectFile('pending.txt');
      fixture.destroy();

      expect(readers[0].abort).toHaveBeenCalled();
      expect(readers[0].onload).toBeNull();
    });

    it('exposes FileReader errors to form validation', () => {
      selectFile('broken.txt');
      readers[0].error = new DOMException('Read failed');
      readers[0].onerror?.();

      expect(component.validate(mockFormControl)).toEqual({parse: 'Read failed'});
    });

    it('keeps a new read started synchronously by a fileChange handler', () => {
      component.fileChange.subscribe((content) => {
        if (content === 'first value') {
          selectFile('second.txt');
        }
      });
      selectFile('first.txt');
      complete(readers[0], 'first value');
      expect(readers).toHaveLength(2);
      expect(readers[1].abort).not.toHaveBeenCalled();
      complete(readers[1], 'second value');

      expect(component.rawContent()).toBe('second value');
      expect(component.selectedFile()?.name).toBe('second.txt');
    });
  });
});

@Component({
  imports: [FileReaderComponent, ReactiveFormsModule],
  template: '<cll-file-reader [formControl]="form" [maxSize]="maxSize()" />',
})
class FileReaderFormHost {
  form = new FormControl('initial value');
  maxSize = signal(2);
}

describe('FileReaderComponent real form integration', () => {
  it('updates from the model without marking the control touched or writing back', async () => {
    TestBed.configureTestingModule({
      imports: [FileReaderFormHost],
      providers: [{provide: TranslationService, useClass: MockTranslationService}],
    });
    const fixture = TestBed.createComponent(FileReaderFormHost);
    fixture.detectChanges();
    const host = fixture.componentInstance;
    const changes = vi.fn();
    const subscription = host.form.valueChanges.subscribe(changes);
    host.form.setValue('server update');
    await flushEffects();

    expect(changes).toHaveBeenCalledTimes(1);
    expect(host.form.untouched).toBe(true);
    expect(host.form.pristine).toBe(true);
    subscription.unsubscribe();
  });

  it('revalidates the real form when the file size limit or parsing state changes', () => {
    TestBed.configureTestingModule({
      imports: [FileReaderFormHost],
      providers: [{provide: TranslationService, useClass: MockTranslationService}],
    });
    const fixture = TestBed.createComponent(FileReaderFormHost);
    fixture.detectChanges();
    const host = fixture.componentInstance;
    const reader = fixture.debugElement.query(By.directive(FileReaderComponent)).injector.get(FileReaderComponent);
    const file = new File(['data'], 'data.txt');
    Object.defineProperty(file, 'size', {value: 1.5 * 1024 * 1024});
    reader.selectedFile.set(file);
    host.form.updateValueAndValidity();
    expect(host.form.errors).toBeNull();

    host.maxSize.set(1);
    fixture.detectChanges();
    expect(host.form.errors).toEqual({exceedLimit: true});
    host.maxSize.set(2);
    fixture.detectChanges();
    expect(host.form.errors).toBeNull();
    reader.parseError.set('Parsing failed');
    fixture.detectChanges();
    expect(host.form.errors).toEqual({parse: 'Parsing failed'});
    reader.parseError.set('');
    fixture.detectChanges();
    expect(host.form.errors).toBeNull();
  });

  it('renders without NgControl when only the fileChange output is used', () => {
    TestBed.configureTestingModule({
      imports: [FileReaderComponent],
      providers: [{provide: TranslationService, useClass: MockTranslationService}],
    });
    const fixture = TestBed.createComponent(FileReaderComponent);

    expect(() => fixture.detectChanges()).not.toThrow();
    expect(fixture.componentInstance.formControl()).toBeNull();
  });
});
