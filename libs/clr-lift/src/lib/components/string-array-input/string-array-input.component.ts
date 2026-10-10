import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  Optional,
  Self,
} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';

import {TranslationService} from '../../services/translation.service';
import {stringArrayInputTranslations} from './string-array-input.l10n';

/**
 * A form control component that enables users to input multiple strings via a single delimited text input.
 * Implements `ControlValueAccessor` to seamlessly bind with Angular Reactive Forms (`formControlName`, `[formControl]`).
 *
 * @example
 * ```html
 * <!-- Bound to string[] in form -->
 * <cll-string-array-input
 *   formControlName="allowedOrigins"
 *   label="Allowed CORS Origins"
 *   placeholder="e.g. https://app.example.com, https://api.example.com"
 * />
 * ```
 */
@Component({
  selector: 'cll-string-array-input',
  imports: [ClarityModule, ReactiveFormsModule],
  templateUrl: './string-array-input.component.html',
  styleUrl: './string-array-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StringArrayInputComponent implements ControlValueAccessor, OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly translationService = inject(TranslationService, {
    optional: true,
  });

  @Optional() @Self() public ngControl = inject(NgControl, {optional: true});

  /** Unique input identifier for label association. */
  readonly inputId = input<string>('cll-string-array-' + Math.random().toString(36).substring(2, 9));

  /** Input label. If empty, screen-reader-only styling is applied. */
  readonly label = input<string>('');

  /** Input placeholder string. */
  readonly placeholder = input<string>('');

  /** Helper text displayed below the input. If omitted, defaults to localized "Separate values with commas". */
  readonly helperText = input<string>();

  /** The delimiter character used to parse and serialize array items. Defaults to comma `,`. */
  readonly delimiter = input<string>(',');

  /** Whether to trim whitespace around parsed values. Defaults to `true`. */
  readonly trim = input<boolean>(true);

  /** Whether to eliminate duplicate values. Defaults to `false`. */
  readonly unique = input<boolean>(false);

  /** Internal form control holding the raw string value. */
  readonly internalControl = new FormControl<string>('');

  onChange: (value: string[]) => void = () => {
    // ControlValueAccessor callback
  };

  onTouched: () => void = () => {
    // ControlValueAccessor callback
  };

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
    this.translationService?.loadTranslationsForComponent('StringArrayInput', stringArrayInputTranslations);
  }

  readonly effectiveHelperText = computed(() => {
    const custom = this.helperText();
    if (custom !== undefined) {
      return custom;
    }
    const translated = this.translationService?.translate('StringArrayInput.helperText');
    return translated && !translated.startsWith('!!') ? translated : 'Separate values with commas';
  });

  ngOnInit(): void {
    this.syncValidators();

    this.ngControl?.control?.statusChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.syncValidators();
    });

    this.internalControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((val) => {
      const parsed = this.parseStringToArray(val);
      this.onChange(parsed);
    });
  }

  private parseStringToArray(raw: string | null): string[] {
    if (!raw) {
      return [];
    }
    const delim = this.delimiter();
    const shouldTrim = this.trim();
    const shouldUnique = this.unique();

    let items = raw
      .split(delim)
      .map((s) => (shouldTrim ? s.trim() : s))
      .filter((s) => s !== '');

    if (shouldUnique) {
      items = Array.from(new Set(items));
    }

    return items;
  }

  private syncValidators(): void {
    const parentValidators = this.ngControl?.control?.validator;
    if (parentValidators && this.internalControl.validator !== parentValidators) {
      this.internalControl.setValidators(parentValidators);
      this.internalControl.updateValueAndValidity({emitEvent: false});
    }
  }

  writeValue(value: unknown): void {
    if (Array.isArray(value)) {
      const delim = this.delimiter();
      const separator = delim === ',' ? ', ' : delim;
      this.internalControl.setValue(value.join(separator), {
        emitEvent: false,
      });
    } else {
      this.internalControl.setValue('', {emitEvent: false});
    }
  }

  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.internalControl.disable({emitEvent: false});
    } else {
      this.internalControl.enable({emitEvent: false});
    }
  }
}
