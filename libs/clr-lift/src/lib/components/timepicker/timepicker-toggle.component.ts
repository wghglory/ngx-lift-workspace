import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {CommonModule} from '@angular/common';
import '@cds/core/icon/register.js';
import {ClarityIcons, clockIcon} from '@cds/core/icon';

import {TranslationService} from '../../services/translation.service';
import {TimepickerComponent} from './timepicker.component';
import {timepickerTranslations} from './timepicker.l10n';
import {ClarityModule} from '@clr/angular';

// Register clock icon
ClarityIcons.addIcons(clockIcon);

/**
 * Toggle button component for opening/closing the timepicker dropdown.
 *
 * Features:
 * - Clock icon by default (customizable via content projection)
 * - Disabled state synchronized with input
 * - ARIA attributes for accessibility
 * - Integrates with Clarity form fields via `clrIconSuffix`
 *
 * @example
 * ```html
 * <!-- Basic usage -->
 * <cll-timepicker-toggle [for]="timepicker" />
 *
 * <!-- With custom icon -->
 * <cll-timepicker-toggle [for]="timepicker">
 *   <cds-icon shape="calendar" cllTimepickerToggleIcon />
 * </cll-timepicker-toggle>
 *
 * <!-- In form field -->
 * <clr-input-container>
 *   <label>Meeting Time</label>
 *   <input clrInput [cllTimepicker]="timepicker" />
 *   <cll-timepicker-toggle clrIconSuffix [for]="timepicker" />
 *   <cll-timepicker #timepicker />
 * </clr-input-container>
 * ```
 */
@Component({
  selector: 'cll-timepicker-toggle',
  imports: [CommonModule, ClarityModule],
  templateUrl: './timepicker-toggle.component.html',
  styleUrls: ['./timepicker-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimepickerToggleComponent {
  private translationService = inject(TranslationService);

  /**
   * Reference to the timepicker component to control.
   */
  for = input.required<TimepickerComponent>();

  /**
   * Whether the toggle button is disabled.
   * Defaults to false.
   */
  disabled = input<boolean>(false);

  constructor() {
    this.translationService.loadTranslationsForComponent('timepicker', timepickerTranslations);
  }

  /**
   * Toggles the timepicker dropdown open/closed.
   */
  toggle(): void {
    if (this.disabled()) {
      return;
    }

    const timepicker = this.for();
    timepicker.toggle();
  }

  /**
   * Gets the ARIA label based on the timepicker's open state.
   */
  getAriaLabel(): string {
    const timepicker = this.for();
    const key = timepicker.isOpen() ? 'timepicker.closeTimepicker' : 'timepicker.openTimepicker';
    return this.translationService.translate(key);
  }

  /**
   * Checks if the timepicker is currently open.
   */
  isOpen(): boolean {
    return this.for().isOpen();
  }
}
