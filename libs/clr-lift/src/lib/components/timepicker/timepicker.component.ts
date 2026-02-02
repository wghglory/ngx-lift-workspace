import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChildren,
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ClarityModule} from '@clr/angular';

import {TranslatePipe} from '../../pipes/translate.pipe';
import {TranslationService} from '../../services/translation.service';
import {timepickerTranslations} from './timepicker.l10n';
import {MAT_TIMEPICKER_CONFIG, TimepickerOption} from './timepicker.types';
import {formatTime, generateTimeOptions, isSameTime, parseTimeString} from './timepicker.utils';

/**
 * Timepicker dropdown component that displays time options for selection.
 *
 * Features:
 * - Customizable time intervals (15m, 30m, 1h, etc.)
 * - Keyboard navigation (Arrow keys, Enter, Escape)
 * - Min/max time bounds support
 * - Custom options list support
 * - ARIA combobox pattern implementation
 * - Locale-aware time formatting
 *
 * @example
 * ```html
 * <input
 *   clrInput
 *   [cllTimepicker]="timepicker"
 *   [formControl]="timeControl"
 * />
 * <cll-timepicker-toggle [for]="timepicker" />
 * <cll-timepicker
 *   #timepicker
 *   [interval]="'30m'"
 *   [min]="'9:00 AM'"
 *   [max]="'5:00 PM'"
 * />
 * ```
 */
@Component({
  selector: 'cll-timepicker',
  imports: [CommonModule, ClarityModule, TranslatePipe],
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimepickerComponent {
  private translationService = inject(TranslationService);
  private config = inject(MAT_TIMEPICKER_CONFIG, {optional: true});

  /**
   * Time interval between options in the dropdown.
   * Supports formats: '30m', '1h', '90 minutes', or number (minutes).
   * Defaults to '30m'.
   */
  interval = input<string | number>('30m');

  /**
   * Custom array of time options.
   * If provided, overrides the interval-based generation.
   */
  options = input<TimepickerOption[]>();

  /**
   * Minimum allowed time (Date object or time string).
   * Times before this will be disabled.
   */
  min = input<Date | string | null>(null);

  /**
   * Maximum allowed time (Date object or time string).
   * Times after this will be disabled.
   */
  max = input<Date | string | null>(null);

  /**
   * ARIA label for the timepicker dropdown.
   */
  ariaLabel = input<string>(this.config?.ariaLabel || '');

  /**
   * ARIA labelledby attribute for the timepicker dropdown.
   */
  ariaLabelledby = input<string>(this.config?.ariaLabelledby || '');

  /**
   * Event emitted when a time option is selected.
   */
  timeSelected = output<Date>();

  /**
   * Event emitted when the dropdown is opened.
   */
  opened = output<void>();

  /**
   * Event emitted when the dropdown is closed.
   */
  closed = output<void>();

  /**
   * Whether the dropdown is currently open.
   */
  isOpen = signal(false);

  /**
   * The currently selected time value.
   */
  selectedTime = signal<Date | null>(null);

  /**
   * Index of the currently focused option (for keyboard navigation).
   */
  focusedIndex = signal(0);

  /**
   * ViewChildren query for option elements (for keyboard navigation).
   */
  optionElements = viewChildren<ElementRef<HTMLDivElement>>('option');

  /**
   * Computed list of time options.
   * Either uses custom options or generates based on interval.
   */
  timeOptions = computed(() => {
    const customOptions = this.options();
    if (customOptions && customOptions.length > 0) {
      return customOptions;
    }

    // Get interval from input or config
    let intervalValue = this.interval();
    if (!intervalValue && this.config?.interval) {
      intervalValue = this.config.interval;
    }

    const intervalStr = typeof intervalValue === 'number' ? `${intervalValue}m` : intervalValue || '30m';
    return generateTimeOptions(intervalStr, this.min(), this.max());
  });

  /**
   * Computed ARIA label for accessibility.
   */
  computedAriaLabel = computed(() => {
    const label = this.ariaLabel();
    if (label) {
      return label;
    }

    return this.translationService.translate('timepicker.selectTime');
  });

  constructor() {
    this.translationService.loadTranslationsForComponent('timepicker', timepickerTranslations);

    // Effect to scroll to selected option when dropdown opens
    effect(() => {
      if (this.isOpen() && this.selectedTime()) {
        setTimeout(() => this.scrollToSelectedOption(), 0);
      }
    });
  }

  /**
   * Opens the timepicker dropdown.
   */
  open(): void {
    if (!this.isOpen()) {
      this.isOpen.set(true);
      this.updateFocusedIndexToSelected();
      this.opened.emit();
    }
  }

  /**
   * Closes the timepicker dropdown.
   */
  close(): void {
    if (this.isOpen()) {
      this.isOpen.set(false);
      this.closed.emit();
    }
  }

  /**
   * Toggles the dropdown open/closed state.
   */
  toggle(): void {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Selects a time option and closes the dropdown.
   */
  selectOption(option: TimepickerOption): void {
    if (option.disabled) {
      return;
    }

    this.selectedTime.set(option.value);
    this.timeSelected.emit(option.value);
    this.close();
  }

  /**
   * Writes a new time value (for integration with input directive).
   */
  writeValue(value: Date | string | null): void {
    if (!value) {
      this.selectedTime.set(null);
      return;
    }

    if (typeof value === 'string') {
      const parsed = parseTimeString(value);
      this.selectedTime.set(parsed);
    } else if (value instanceof Date) {
      this.selectedTime.set(value);
    }
  }

  /**
   * Handles keyboard navigation within the dropdown.
   */
  onKeyDown(event: KeyboardEvent): void {
    const options = this.timeOptions();
    const currentIndex = this.focusedIndex();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.moveFocus(1, options);
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.moveFocus(-1, options);
        break;

      case 'Enter':
        event.preventDefault();
        if (currentIndex >= 0 && currentIndex < options.length) {
          this.selectOption(options[currentIndex]);
        }
        break;

      case 'Escape':
        event.preventDefault();
        this.close();
        break;

      case 'Home':
        event.preventDefault();
        this.focusedIndex.set(0);
        this.scrollToFocusedOption();
        break;

      case 'End':
        event.preventDefault();
        this.focusedIndex.set(options.length - 1);
        this.scrollToFocusedOption();
        break;
    }
  }

  /**
   * Checks if an option is currently selected.
   */
  isSelected(option: TimepickerOption): boolean {
    const selected = this.selectedTime();
    if (!selected) {
      return false;
    }
    return isSameTime(selected, option.value);
  }

  /**
   * Checks if an option is currently focused.
   */
  isFocused(index: number): boolean {
    return this.focusedIndex() === index;
  }

  /**
   * Gets the formatted label for an option.
   */
  getOptionLabel(option: TimepickerOption): string {
    return option.label || formatTime(option.value);
  }

  /**
   * Moves focus by the specified delta, skipping disabled options.
   */
  private moveFocus(delta: number, options: TimepickerOption[]): void {
    let newIndex = this.focusedIndex() + delta;

    // Wrap around
    if (newIndex < 0) {
      newIndex = options.length - 1;
    } else if (newIndex >= options.length) {
      newIndex = 0;
    }

    // Skip disabled options
    let attempts = 0;
    while (options[newIndex]?.disabled && attempts < options.length) {
      newIndex += delta;
      if (newIndex < 0) {
        newIndex = options.length - 1;
      } else if (newIndex >= options.length) {
        newIndex = 0;
      }
      attempts++;
    }

    if (!options[newIndex]?.disabled) {
      this.focusedIndex.set(newIndex);
      this.scrollToFocusedOption();
    }
  }

  /**
   * Scrolls to the currently focused option.
   */
  private scrollToFocusedOption(): void {
    const elements = this.optionElements();
    const focusedIdx = this.focusedIndex();

    if (elements[focusedIdx]) {
      elements[focusedIdx].nativeElement.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }

  /**
   * Scrolls to the currently selected option.
   */
  private scrollToSelectedOption(): void {
    const options = this.timeOptions();
    const selected = this.selectedTime();

    if (!selected) {
      return;
    }

    const selectedIndex = options.findIndex((opt) => isSameTime(opt.value, selected));

    if (selectedIndex >= 0) {
      this.focusedIndex.set(selectedIndex);
      this.scrollToFocusedOption();
    }
  }

  /**
   * Updates the focused index to match the selected option.
   */
  private updateFocusedIndexToSelected(): void {
    const options = this.timeOptions();
    const selected = this.selectedTime();

    if (!selected) {
      this.focusedIndex.set(0);
      return;
    }

    const selectedIndex = options.findIndex((opt) => isSameTime(opt.value, selected));

    if (selectedIndex >= 0) {
      this.focusedIndex.set(selectedIndex);
    } else {
      this.focusedIndex.set(0);
    }
  }
}
