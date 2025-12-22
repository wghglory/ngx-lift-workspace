import {
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  Injector,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  FormControlDirective,
  FormControlName,
  FormGroupDirective,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  NgControl,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import {ClarityModule} from '@clr/angular';

import {TranslatePipe} from '../../pipes/translate.pipe';
import {TranslationService} from '../../services/translation.service';
import {fileReaderTranslations} from './file-reader.l10n';

@Component({
  selector: 'cll-file-reader',
  standalone: true,
  imports: [TranslatePipe, ClarityModule, FormsModule],
  templateUrl: './file-reader.component.html',
  styleUrls: ['./file-reader.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileReaderComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FileReaderComponent),
      multi: true,
    },
  ],
})
export class FileReaderComponent implements ControlValueAccessor, Validator {
  private injector = inject(Injector);
  private translationService = inject(TranslationService);

  fileElement = viewChild.required<ElementRef<HTMLInputElement>>('file');

  controlId = input('');
  acceptFiles = input('*');
  encoded = input(false); // read file content as base64
  maxSize = input(Infinity);
  disabled = input(false);

  fileChange = output<string>();

  isDisabled = signal(this.disabled());

  // @Input({ required: true }) formControl: FormControl;
  formControl = computed(() => {
    const ngControl = this.injector.get(NgControl);

    if (ngControl instanceof FormControlName) {
      return this.injector.get(FormGroupDirective).getControl(ngControl);
    } else {
      return (ngControl as FormControlDirective).form as FormControl;
    }
  });

  selectedFile = signal<File | undefined>(undefined);
  parseError = signal('');
  rawContent = signal('');
  encodedContent = signal('');

  constructor() {
    this.translationService.loadTranslationsForComponent('FileReader', fileReaderTranslations);
  }

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  sizeInvalid = computed(() => {
    const selectedFile = this.selectedFile();
    if (!selectedFile) {
      return false;
    }
    return selectedFile.size > this.maxSize() * 1024 * 1024;
  });

  onFileSelected(event: Event) {
    this.parseError.set('');

    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const selectedFile = inputElement.files[0];
      this.selectedFile.set(selectedFile);

      const reader = new FileReader();

      reader.onload = (e: ProgressEvent) => {
        const fileReader = e.target as FileReader;
        const fileContent = fileReader.result as string;

        this.rawContent.set(fileContent);
        try {
          this.encodedContent.set(btoa(fileContent));
          const content = this.encoded() ? this.encodedContent() : this.rawContent();
          this.onChange(content); // Notify the form control
          this.onTouched();

          this.fileChange.emit(content);
        } catch (error) {
          this.parseError.set((error as Error).message);
          this.onChange(' '); // use 1 space string to avoid required error, onChange will trigger validate method
          this.onTouched();
        }
      };

      reader.readAsText(selectedFile);
    }
  }

  removeFile() {
    this.fileElement().nativeElement.value = '';
    this.selectedFile.set(undefined);
    this.rawContent.set('');
    this.encodedContent.set('');
    this.onChange('');
    this.onTouched();
  }

  // value passed from new FormControl()
  writeValue(value: string) {
    if (!value) {
      return;
    }

    if (this.encoded()) {
      this.encodedContent.set(value);
      this.rawContent.set(atob(value));
    } else {
      this.rawContent.set(value);
      this.encodedContent.set(btoa(value));
    }

    setTimeout(() => {
      const content = this.encoded() ? this.encodedContent() : this.rawContent();
      this.onChange(content);
      this.onTouched();
    });
  }

  registerOnChange(fn: (value: string) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.isDisabled.set(isDisabled);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(control: AbstractControl): ValidationErrors | null {
    if (this.sizeInvalid()) {
      return {exceedLimit: true};
    }
    if (this.parseError()) {
      return {parse: this.parseError()};
    }

    return null;
  }
}
