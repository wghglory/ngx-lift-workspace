import {Directive, forwardRef, HostBinding, inject, input, OnInit} from '@angular/core';
import {NG_VALIDATORS, NG_VALUE_ACCESSOR} from '@angular/forms';
import {ClrDateContainer} from '@clr/angular';

import {TimepickerComponent} from './timepicker.component';
import {TimepickerInputDirective} from './timepicker-input.directive';

/**
 * Directive that combines date and time input functionality.
 *
 * This directive provides the same functionality as TimepickerInputDirective
 * but is designed to work seamlessly with Clarity's date picker in a datetime context.
 * It should be used with the `clr-datetime-container` component.
 *
 * Features:
 * - Combines date selection (via clrDate) with time selection
 * - Shares a single form control for both date and time
 * - Automatic date portion preservation when setting time
 * - Full form validation support
 *
 * @example
 * ```html
 * <!-- Time-only -->
 * <clr-datetime-container>
 *   <label>Meeting Time</label>
 *   <input clrDatetime [cllTimepicker]="timepicker" formControlName="time" />
 *   <cll-timepicker-toggle [for]="timepicker" class="clr-input-group-icon-action" />
 *   <cll-timepicker #timepicker />
 * </clr-datetime-container>
 *
 * <!-- Date + Time -->
 * <clr-datetime-container>
 *   <label>Meeting Date & Time</label>
 *   <input clrDate formControlName="meetingDateTime" placeholder="MM/DD/YYYY" />
 *   <input clrDatetime [cllTimepicker]="timepicker" formControlName="meetingDateTime" placeholder="HH:MM" />
 *   <cll-timepicker-toggle [for]="timepicker" class="clr-input-group-icon-action" />
 *   <cll-timepicker #timepicker />
 * </clr-datetime-container>
 * ```
 *
 * @example
 * ```typescript
 * // Component
 * form = new FormGroup({
 *   meetingDateTime: new FormControl(new Date(), [Validators.required])
 * });
 * ```
 */
@Directive({
  selector: 'input[clrDatetime]',
})
export class DatetimeDirective extends TimepickerInputDirective implements OnInit {
  @HostBinding('attr.type') type = 'text';
  @HostBinding('class.clr-input') clrInputClass = true;

  private dateContainer = inject(ClrDateContainer, {optional: true});

  // Re-declare inputs to make them available for this directive
  override cllTimepicker = input.required<TimepickerComponent>();
  override cllTimepickerMin = input<Date | string | null>(null);
  override cllTimepickerMax = input<Date | string | null>(null);

  override ngOnInit(): void {
    super.ngOnInit();

    // Override placeholder if not set
    if (!this.elementRef.nativeElement.placeholder) {
      this.elementRef.nativeElement.placeholder = 'HH:MM';
    }

    // Warn if not in a datetime container context
    if (!this.dateContainer) {
      console.warn('clrDatetime directive should be used within a clr-datetime-container for best results');
    }
  }
}
