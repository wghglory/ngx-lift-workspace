import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {FormControl, FormControlDirective, NgControl, ReactiveFormsModule} from '@angular/forms';
import {vi} from 'vitest';

import {TranslationService} from '../../services/translation.service';
import {MockTranslationService} from '../../services/translation.service.mock';
import {FileReaderComponent} from './file-reader.component';

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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ControlValueAccessor', () => {
    it('should register onChange callback', () => {
      const onChangeFn = vi.fn();
      component.registerOnChange(onChangeFn);

      component['onChange']('test');
      expect(onChangeFn).toHaveBeenCalledWith('test');
    });

    it('should register onTouched callback', () => {
      const onTouchedFn = vi.fn();
      component.registerOnTouched(onTouchedFn);

      component['onTouched']();
      expect(onTouchedFn).toHaveBeenCalled();
    });

    it('should set disabled state', () => {
      component.setDisabledState(true);
      expect(component.isDisabled()).toBe(true);

      component.setDisabledState(false);
      expect(component.isDisabled()).toBe(false);
    });

    it('should write value for encoded content', fakeAsync(() => {
      const encodedValue = btoa('test content');
      fixture.componentRef.setInput('encoded', true);
      fixture.detectChanges();

      component.writeValue(encodedValue);
      tick();

      expect(component['encodedContent']()).toBe(encodedValue);
      expect(component['rawContent']()).toBe('test content');
    }));

    it('should write value for raw content', fakeAsync(() => {
      const rawValue = 'test content';
      fixture.componentRef.setInput('encoded', false);
      fixture.detectChanges();

      component.writeValue(rawValue);
      tick();

      expect(component['rawContent']()).toBe(rawValue);
      expect(component['encodedContent']()).toBe(btoa(rawValue));
    }));

    it('should not write value if value is empty', () => {
      const initialRawContent = component['rawContent']();
      const initialEncodedContent = component['encodedContent']();

      component.writeValue('');
      expect(component['rawContent']()).toBe(initialRawContent);
      expect(component['encodedContent']()).toBe(initialEncodedContent);
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

    it('should handle file selection and read as text', fakeAsync(() => {
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
      vi.spyOn(window, 'FileReader').mockImplementation(() => mockFileReader as unknown as FileReader);

      const inputElement = createFileInput(file);
      const event = new Event('change');
      Object.defineProperty(event, 'target', {value: inputElement, enumerable: true});

      component.onFileSelected(event);
      tick();

      expect(component.selectedFile()).toEqual(file);
      expect(component['rawContent']()).toBe('test content');
      expect(fileChangeSpy).toHaveBeenCalledWith('test content');
      expect(onChangeSpy).toHaveBeenCalled();
      expect(onTouchedSpy).toHaveBeenCalled();
    }));

    it('should handle file selection with encoded content', fakeAsync(() => {
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
      vi.spyOn(window, 'FileReader').mockImplementation(() => mockFileReader as unknown as FileReader);

      const inputElement = createFileInput(file);
      const event = new Event('change');
      Object.defineProperty(event, 'target', {value: inputElement, enumerable: true});

      component.onFileSelected(event);
      tick();

      expect(component['encodedContent']()).toBe(btoa('test content'));
      expect(fileChangeSpy).toHaveBeenCalledWith(btoa('test content'));
    }));

    it('should handle file selection error', fakeAsync(() => {
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
      vi.spyOn(window, 'FileReader').mockImplementation(() => mockFileReader as unknown as FileReader);

      const inputElement = createFileInput(file);
      const event = new Event('change');
      Object.defineProperty(event, 'target', {value: inputElement, enumerable: true});

      component.onFileSelected(event);
      tick();

      expect(component['parseError']()).toBe('Encoding error');
      expect(onChangeSpy).toHaveBeenCalledWith(' ');

      window.btoa = originalBtoa;
    }));

    it('should clear parse error on new file selection', fakeAsync(() => {
      component['parseError'].set('previous error');

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
      vi.spyOn(window, 'FileReader').mockImplementation(() => mockFileReader as unknown as FileReader);

      const file = new File(['test content'], 'test.txt', {type: 'text/plain'});
      const inputElement = createFileInput(file);
      const event = new Event('change');
      Object.defineProperty(event, 'target', {value: inputElement, enumerable: true});

      component.onFileSelected(event);
      tick();

      expect(component['parseError']()).toBe('');
    }));

    it('should not process if no files selected', () => {
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
    it('should remove selected file and reset state', fakeAsync(() => {
      const file = new File(['test'], 'test.txt', {type: 'text/plain'});
      component.selectedFile.set(file);
      component['rawContent'].set('test content');
      // Use the actual base64 value instead of calling btoa to avoid mock issues
      component['encodedContent'].set('dGVzdCBjb250ZW50');

      const fileElement = component.fileElement();
      const onChangeSpy = vi.spyOn(component as never, 'onChange');
      const onTouchedSpy = vi.spyOn(component as never, 'onTouched');

      component.removeFile();
      tick();

      expect(fileElement.nativeElement.value).toBe('');
      expect(component.selectedFile()).toBeUndefined();
      expect(component['rawContent']()).toBe('');
      expect(component['encodedContent']()).toBe('');
      expect(onChangeSpy).toHaveBeenCalledWith('');
      expect(onTouchedSpy).toHaveBeenCalled();
    }));
  });

  describe('Validator', () => {
    it('should return null when file is valid', () => {
      const file = new File(['test'], 'test.txt', {type: 'text/plain'});
      component.selectedFile.set(file);
      fixture.componentRef.setInput('maxSize', 10);
      fixture.detectChanges();

      const result = component.validate(mockFormControl);
      expect(result).toBeNull();
    });

    it('should return exceedLimit error when file size exceeds maxSize', () => {
      const file = new File(['test content'], 'test.txt', {type: 'text/plain'});
      // Create a file with size > 1MB
      Object.defineProperty(file, 'size', {value: 2 * 1024 * 1024, writable: false});
      component.selectedFile.set(file);
      fixture.componentRef.setInput('maxSize', 1);
      fixture.detectChanges();

      const result = component.validate(mockFormControl);
      expect(result).toEqual({exceedLimit: true});
    });

    it('should return parse error when parseError is set', () => {
      component['parseError'].set('Parse error message');

      const result = component.validate(mockFormControl);
      expect(result).toEqual({parse: 'Parse error message'});
    });

    it('should return null when no file is selected', () => {
      component.selectedFile.set(undefined);

      const result = component.validate(mockFormControl);
      expect(result).toBeNull();
    });
  });

  describe('sizeInvalid computed', () => {
    it('should return false when no file is selected', () => {
      component.selectedFile.set(undefined);
      expect(component.sizeInvalid()).toBe(false);
    });

    it('should return false when file size is within limit', () => {
      const file = new File(['test'], 'test.txt', {type: 'text/plain'});
      Object.defineProperty(file, 'size', {value: 500 * 1024, writable: false});
      component.selectedFile.set(file);
      fixture.componentRef.setInput('maxSize', 1);
      fixture.detectChanges();

      expect(component.sizeInvalid()).toBe(false);
    });

    it('should return true when file size exceeds limit', () => {
      const file = new File(['test'], 'test.txt', {type: 'text/plain'});
      Object.defineProperty(file, 'size', {value: 2 * 1024 * 1024, writable: false});
      component.selectedFile.set(file);
      fixture.componentRef.setInput('maxSize', 1);
      fixture.detectChanges();

      expect(component.sizeInvalid()).toBe(true);
    });
  });

  describe('Inputs', () => {
    it('should set controlId input', () => {
      fixture.componentRef.setInput('controlId', 'test-id');
      fixture.detectChanges();

      expect(component.controlId()).toBe('test-id');
    });

    it('should set acceptFiles input', () => {
      fixture.componentRef.setInput('acceptFiles', '.txt,.pdf');
      fixture.detectChanges();

      expect(component.acceptFiles()).toBe('.txt,.pdf');
    });

    it('should set encoded input', () => {
      fixture.componentRef.setInput('encoded', true);
      fixture.detectChanges();

      expect(component.encoded()).toBe(true);
    });

    it('should set maxSize input', () => {
      fixture.componentRef.setInput('maxSize', 5);
      fixture.detectChanges();

      expect(component.maxSize()).toBe(5);
    });

    it('should set disabled input', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(component.isDisabled()).toBe(true);
    });
  });
});
