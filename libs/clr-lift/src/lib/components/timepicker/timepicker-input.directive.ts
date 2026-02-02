import {Directive, ElementRef, forwardRef, HostListener, inject, input, OnInit, Renderer2} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';

import {TranslationService} from '../../services/translation.service';
import {TimepickerComponent} from './timepicker.component';
import {formatTime, isTimeInBounds, parseTimeString} from './timepicker.utils';

/**
 * Directive that connects an input element to a timepicker dropdown.
 *
 * Features:
 * - ControlValueAccessor implementation for form control integration
 * - Parses time strings in multiple formats (12h/24h)
 * - Validates time format and min/max bounds
 * - Auto-formats time on blur
 * - ARIA attributes for accessibility
 *
 * @example
 * ```html
 * <input
 *   clrInput
 *   [cllTimepicker]="timepicker"
 *   [cllTimepickerMin]="'9:00 AM'"
 *   [cllTimepickerMax]="'5:00 PM'"
 *   [formControl]="timeControl"
 * />
 * <cll-timepicker #timepicker />
 * ```
 */
@Directive({
  selector: 'input[cllTimepicker]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimepickerInputDirective),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TimepickerInputDirective),
      multi: true,
    },
  ],
})
export class TimepickerInputDirective implements ControlValueAccessor, Validator, OnInit {
  protected elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);
  private translationService = inject(TranslationService);

  private currentValue: Date | null = null;

  /**
   * Reference to the timepicker component.
   */
  cllTimepicker = input.required<TimepickerComponent>();

  /**
   * Minimum allowed time (Date object or time string).
   * Times before this will trigger validation error.
   */
  cllTimepickerMin = input<Date | string | null>(null);

  /**
   * Maximum allowed time (Date object or time string).
   * Times after this will trigger validation error.
   */
  cllTimepickerMax = input<Date | string | null>(null);

  private onChange: (value: Date | null) => void = () => {
    // ControlValueAccessor onChange callback
  };

  private onTouched: () => void = () => {
    // ControlValueAccessor onTouched callback
  };

  ngOnInit(): void {
    const timepicker = this.cllTimepicker();

    // Set ARIA attributes
    this.renderer.setAttribute(this.elementRef.nativeElement, 'role', 'combobox');
    this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-expanded', 'false');
    this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-haspopup', 'listbox');
    this.renderer.setAttribute(this.elementRef.nativeElement, 'autocomplete', 'off');

    // Listen for time selections from the timepicker
    timepicker.timeSelected.subscribe((time) => {
      this.currentValue = time;
      this.updateInputValue(time);
      this.onChange(time);
      this.onTouched();
    });

    // Update aria-expanded when dropdown opens/closes
    timepicker.opened.subscribe(() => {
      this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-expanded', 'true');
    });

    timepicker.closed.subscribe(() => {
      this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-expanded', 'false');
    });
  }

  /**
   * Handles input focus - opens the timepicker dropdown.
   */
  @HostListener('focus')
  onFocus(): void {
    const timepicker = this.cllTimepicker();
    timepicker.open();
  }

  /**
   * Handles input blur - closes dropdown and formats the value.
   */
  @HostListener('blur')
  onBlur(): void {
    const timepicker = this.cllTimepicker();
    timepicker.close();

    // Format the current value on blur
    if (this.currentValue) {
      this.updateInputValue(this.currentValue);
    }

    this.onTouched();
  }

  /**
   * Handles input changes - parses the entered time string.
   */
  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;

    if (!value || value.trim() === '') {
      this.currentValue = null;
      this.onChange(null);
      return;
    }

    const parsed = parseTimeString(value);
    if (parsed) {
      this.currentValue = parsed;
      this.onChange(parsed);

      // Update the timepicker's selected value
      const timepicker = this.cllTimepicker();
      timepicker.writeValue(parsed);
    } else {
      // Keep the current value but let validation handle the error
      this.onChange(this.currentValue);
    }
  }

  /**
   * Handles keyboard events - Arrow down opens dropdown, Escape closes it.
   */
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const timepicker = this.cllTimepicker();

    if (event.key === 'ArrowDown' && !event.altKey) {
      event.preventDefault();
      timepicker.open();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      timepicker.close();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      timepicker.close();
    }

    // If dropdown is open, delegate to timepicker for navigation
    if (timepicker.isOpen() && ['ArrowDown', 'ArrowUp', 'Enter', 'Home', 'End'].includes(event.key)) {
      timepicker.onKeyDown(event);
    }
  }

  /**
   * Writes a value from the form control to the input.
   */
  writeValue(value: Date | string | null): void {
    if (!value) {
      this.currentValue = null;
      this.updateInputValue(null);
      return;
    }

    let dateValue: Date | null = null;

    if (typeof value === 'string') {
      dateValue = parseTimeString(value);
    } else if (value instanceof Date) {
      dateValue = value;
    }

    this.currentValue = dateValue;
    this.updateInputValue(dateValue);

    // Update the timepicker's selected value
    const timepicker = this.cllTimepicker();
    timepicker.writeValue(dateValue);
  }

  /**
   * Registers the onChange callback.
   */
  registerOnChange(fn: (value: Date | null) => void): void {
    this.onChange = fn;
  }

  /**
   * Registers the onTouched callback.
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * Sets the disabled state of the input.
   */
  setDisabledState(isDisabled: boolean): void {
    this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
  }

  /**
   * Validates the input value.
   */
  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) {
      return null;
    }

    // If value is a string, try to parse it
    if (typeof value === 'string') {
      const parsed = parseTimeString(value);
      if (!parsed) {
        return {cllTimepickerParse: true};
      }
    }

    // Validate min/max bounds
    const timeValue = this.currentValue || (value instanceof Date ? value : null);

    if (timeValue) {
      const min = this.cllTimepickerMin();
      const max = this.cllTimepickerMax();

      let minDate: Date | null = null;
      let maxDate: Date | null = null;

      if (min) {
        minDate = typeof min === 'string' ? parseTimeString(min) : min;
      }

      if (max) {
        maxDate = typeof max === 'string' ? parseTimeString(max) : max;
      }

      if (!isTimeInBounds(timeValue, minDate, maxDate)) {
        if (minDate && timeValue < minDate) {
          const formattedMin = formatTime(minDate);
          return {
            cllTimepickerMin: {
              min: formattedMin,
              actual: formatTime(timeValue),
            },
          };
        }

        if (maxDate && timeValue > maxDate) {
          const formattedMax = formatTime(maxDate);
          return {
            cllTimepickerMax: {
              max: formattedMax,
              actual: formatTime(timeValue),
            },
          };
        }
      }
    }

    return null;
  }

  /**
   * Updates the input element's display value.
   */
  private updateInputValue(value: Date | null): void {
    const formatted = value ? formatTime(value) : '';
    this.renderer.setProperty(this.elementRef.nativeElement, 'value', formatted);
  }
}
