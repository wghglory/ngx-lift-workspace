import {OverlayModule} from '@angular/cdk/overlay';
import {ChangeDetectionStrategy, Component, computed, forwardRef, inject, input, output, signal} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {ClarityModule, ClrIcon} from '@clr/angular';

import {TranslationService} from '../../services/translation.service';
import {autocompleteTranslations} from './autocomplete.l10n';

/**
 * An autocomplete search input component that provides suggestion overlays using Angular CDK Overlay.
 * Implements `ControlValueAccessor` for integration with template-driven and reactive forms.
 *
 * @example
 * ```html
 * <cll-autocomplete
 *   [options]="['PostgreSQL', 'MySQL', 'Redis', 'Kafka']"
 *   placeholder="Choose database engine..."
 *   formControlName="engine"
 * />
 * ```
 */
@Component({
  selector: 'cll-autocomplete',
  imports: [ClarityModule, ClrIcon, OverlayModule],
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteComponent implements ControlValueAccessor {
  private translationService = inject(TranslationService, {optional: true});

  /** List of selectable suggestion options. */
  readonly options = input<string[]>([]);

  /** Text placeholder when input is empty. */
  readonly placeholder = input<string>('');

  /** Message displayed when no suggestions match the search string. */
  readonly emptyPlaceholder = input<string>();

  /** Input field visible character width. */
  readonly size = input<number>(24);

  /** Whether custom values not present in the options list are allowed. Defaults to `true`. */
  readonly allowCustom = input<boolean>(true);

  /** Emitted when the input loses focus. */
  readonly inputBlur = output<void>();

  /** Emitted when an option is selected from the dropdown or submitted via Enter. */
  readonly selected = output<string>();

  /** Dropdown overlay open state. */
  readonly isOpen = signal(false);

  /** Index of currently keyboard-highlighted option. */
  readonly activeItemIndex = signal(-1);

  /** Current text in the input element. */
  readonly inputValue = signal('');

  /** Whether the input is disabled. */
  readonly disabled = signal(false);

  private onChange: (value: string) => void = () => {
    // ControlValueAccessor callback
  };
  private onTouched: () => void = () => {
    // ControlValueAccessor callback
  };
  private delayTime = 200;

  constructor() {
    this.translationService?.loadTranslationsForComponent('Autocomplete', autocompleteTranslations);
  }

  readonly effectiveEmptyPlaceholder = computed(() => {
    const custom = this.emptyPlaceholder();
    if (custom !== undefined) {
      return custom;
    }
    const translated = this.translationService?.translate('Autocomplete.noDataFound');
    return translated && !translated.startsWith('!!') ? translated : 'No results found';
  });

  readonly effectivePlaceholder = computed(() => {
    const custom = this.placeholder();
    if (custom) {
      return custom;
    }
    const translated = this.translationService?.translate('Autocomplete.searchPlaceholder');
    return translated && !translated.startsWith('!!') ? translated : 'Search or select...';
  });

  readonly suggestions = computed(() => {
    const allOptions = this.options();
    const query = this.inputValue().trim();

    if (!query) {
      return allOptions;
    }

    const queryLower = query.toLowerCase();
    return allOptions.filter((item) => {
      const optionLower = item.toLowerCase();
      return optionLower.includes(queryLower) || queryLower.includes(optionLower);
    });
  });

  writeValue(value: string | null | undefined): void {
    this.inputValue.set(value || '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.inputValue.set(val);
    this.isOpen.set(true);
    this.activeItemIndex.set(-1);
    this.onChange(val);
  }

  onInputChange(val: string): void {
    this.inputValue.set(val);
    this.isOpen.set(true);
    this.activeItemIndex.set(-1);
    this.onChange(val);
  }

  /**
   * Handles selection of an option from the dropdown list.
   */
  onSelect(option: string): void {
    this.inputValue.set(option);
    this.onChange(option);
    this.onTouched();
    this.selected.emit(option);
    this.resetAfterSelection();
  }

  /**
   * Handles Enter key press — selects active suggestion or emits manual entry.
   */
  onEnter(): void {
    const items = this.suggestions();
    const idx = this.activeItemIndex();

    if (idx >= 0 && this.isOpen() && idx < items.length) {
      this.onSelect(items[idx]);
      return;
    }

    if (this.allowCustom()) {
      const text = this.inputValue().trim();
      if (!text) {
        return;
      }
      this.onChange(text);
      this.onTouched();
      this.selected.emit(text);
      this.resetAfterSelection();
    }
  }

  onBlur(): void {
    this.onChange(this.inputValue());
    this.onTouched();

    setTimeout(() => {
      this.resetAfterSelection();
    }, this.delayTime);

    this.inputBlur.emit();
  }

  onArrowDown(event: Event): void {
    this.navigateDropdown(1, event);
  }

  onArrowUp(event: Event): void {
    this.navigateDropdown(-1, event);
  }

  private resetAfterSelection(): void {
    this.isOpen.set(false);
    this.activeItemIndex.set(-1);
  }

  private navigateDropdown(direction: 1 | -1, event: Event): void {
    event.preventDefault();

    if (!this.isOpen()) {
      this.isOpen.set(true);
      return;
    }

    const items = this.suggestions();
    if (items.length === 0) {
      return;
    }

    const currentIndex = this.activeItemIndex();
    let nextIndex: number;

    if (direction === 1) {
      nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
    } else {
      nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
    }

    this.activeItemIndex.set(nextIndex);
  }
}
