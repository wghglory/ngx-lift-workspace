import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  forwardRef,
  inject,
  Injector,
  input,
  linkedSignal,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
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

/**
 * A file input component that implements ControlValueAccessor for use with Angular reactive forms.
 * Supports file reading, validation, and base64 encoding.
 *
 * The component:
 * - Reads file content as text or base64
 * - Validates file size limits
 * - Integrates with Angular forms via ControlValueAccessor
 * - Emits file change events
 *
 * @example
 * ```html
 * <cll-file-reader
 *   formControlName="fileContent"
 *   [acceptFiles]="'.txt,.json'"
 *   [maxSize]="5"
 *   [encoded]="true"
 * />
 * ```
 */
@Component({
  selector: 'cll-file-reader',
  imports: [TranslatePipe, ClarityModule, FormsModule],
  templateUrl: './file-reader.component.html',
  styleUrls: ['./file-reader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  private activeReader?: FileReader;

  fileElement = viewChild.required<ElementRef<HTMLInputElement>>('file');
  private fileInput = viewChild<ElementRef<HTMLInputElement>>('file');

  /**
   * The unique identifier for the file input element.
   * Used for accessibility and form association.
   */
  controlId = input('');

  /**
   * Comma-separated list of accepted file types (e.g., '.txt,.json' or 'image/*').
   * Defaults to '*' (all files).
   */
  acceptFiles = input('*');

  /**
   * Whether to read file content as base64 encoded string.
   * If `true`, the file content is base64 encoded; if `false`, it's read as plain text.
   * Defaults to `false`.
   */
  encoded = input(false);

  /** Encoding used for base64 text. Set latin1 to retain the legacy byte-string format. */
  textEncoding = input<'utf-8' | 'latin1'>('utf-8');

  /**
   * Maximum file size in megabytes.
   * Files exceeding this size will trigger a validation error.
   * Defaults to `Infinity` (no limit).
   */
  maxSize = input(Infinity);

  /**
   * Whether the file input is disabled.
   * Defaults to `false`.
   */
  disabled = input(false);

  /**
   * Event emitter that emits the file content when a file is selected.
   * The content is either plain text or base64 encoded, depending on the `encoded` input.
   */
  fileChange = output<string>();

  /**
   * Linked signal that reflects the disabled state.
   * Automatically updates when the `disabled` input changes.
   */
  isDisabled = linkedSignal(() => this.disabled());

  formControl = computed(() => {
    const control = this.injector.get(NgControl, null)?.control;
    return control instanceof FormControl ? control : null;
  });

  selectedFile = signal<File | undefined>(undefined);
  parseError = signal('');
  rawContent = signal('');
  encodedContent = signal('');

  constructor() {
    this.translationService.loadTranslationsForComponent('FileReader', fileReaderTranslations);
    inject(DestroyRef).onDestroy(() => this.cancelRead());
    effect(() => {
      this.sizeInvalid();
      this.parseError();
      untracked(() => this.onValidatorChange());
    });
  }

  private onChange: (value: string) => void = () => {
    // ControlValueAccessor onChange callback
  };
  private onValidatorChange: () => void = () => {
    // Angular Validator callback for changes to validation inputs or state.
  };
  private onTouched: () => void = () => {
    // ControlValueAccessor onTouched callback
  };

  sizeInvalid = computed(() => {
    const selectedFile = this.selectedFile();
    if (!selectedFile) {
      return false;
    }
    return selectedFile.size > this.maxSize() * 1024 * 1024;
  });

  onFileSelected(event: Event) {
    if (this.isDisabled()) {
      return;
    }
    this.cancelRead();
    this.parseError.set('');

    const inputElement = event.target;
    if (!(inputElement instanceof HTMLInputElement)) {
      return;
    }
    const selectedFile = inputElement.files?.[0];
    if (!selectedFile) {
      return;
    }
    this.selectedFile.set(selectedFile);
    if (this.sizeInvalid()) {
      this.rawContent.set('');
      this.encodedContent.set('');
      this.onChange('');
      this.onTouched();
      this.onValidatorChange();
      return;
    }

    const reader = new FileReader();
    this.activeReader = reader;
    reader.onload = () => {
      if (this.activeReader !== reader) {
        return;
      }
      const fileContent = reader.result;
      if (typeof fileContent !== 'string') {
        return;
      }

      try {
        this.setContent(fileContent);
        const content = this.encoded() ? this.encodedContent() : this.rawContent();
        this.onChange(content);
        this.onTouched();
        this.fileChange.emit(content);
      } catch (error: unknown) {
        this.handleReadError(error instanceof Error ? error.message : String(error));
      }
      this.cancelRead(reader);
    };
    reader.onerror = () => {
      if (this.activeReader === reader) {
        this.handleReadError(reader.error?.message ?? this.translationService.translate('FileReader.readError'));
        this.cancelRead(reader);
      }
    };
    reader.readAsText(selectedFile);
  }

  removeFile() {
    if (this.isDisabled()) {
      return;
    }
    this.writeValue('');
    this.onChange('');
    this.onTouched();
  }

  /** Model-to-view updates never mark the form touched or emit another change. */
  writeValue(value: string | null | undefined) {
    this.cancelRead();
    this.parseError.set('');
    this.selectedFile.set(undefined);
    const inputElement = this.fileInput();
    if (inputElement) {
      inputElement.nativeElement.value = '';
    }
    if (!value) {
      this.rawContent.set('');
      this.encodedContent.set('');
      return;
    }

    this.rawContent.set('');
    try {
      if (this.encoded()) {
        this.encodedContent.set(value);
        const bytes = atob(value);
        this.rawContent.set(
          this.textEncoding() === 'latin1'
            ? bytes
            : new TextDecoder('utf-8', {fatal: true}).decode(Uint8Array.from(bytes, (char) => char.charCodeAt(0))),
        );
      } else {
        this.setContent(value);
      }
    } catch (error: unknown) {
      this.parseError.set(error instanceof Error ? error.message : String(error));
    }
  }

  private setContent(value: string) {
    this.rawContent.set(value);
    try {
      let byteString: string;
      if (this.textEncoding() === 'latin1') {
        byteString = value;
      } else {
        const bytes = new TextEncoder().encode(value);
        const CHUNK_SIZE = 8192;
        let binary = '';
        for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
          binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK_SIZE));
        }
        byteString = binary;
      }
      this.encodedContent.set(btoa(byteString));
    } catch (error: unknown) {
      this.encodedContent.set('');
      // Unencoded text must not fail simply because it contains Unicode.
      if (this.encoded()) {
        throw error;
      }
    }
  }

  private handleReadError(message: string) {
    this.parseError.set(message);
    this.onChange(' '); // Keep parse validation distinct from a required error.
    this.onTouched();
  }

  private cancelRead(reader = this.activeReader) {
    if (reader && this.activeReader === reader) {
      this.activeReader = undefined;
      reader.onload = null;
      reader.onerror = null;
      if (reader.readyState === FileReader.LOADING) {
        reader.abort();
      }
    }
  }

  registerOnChange(fn: (value: string) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  registerOnValidatorChange(fn: () => void) {
    this.onValidatorChange = fn;
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
