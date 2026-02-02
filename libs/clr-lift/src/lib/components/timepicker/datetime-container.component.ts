import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ClarityModule} from '@clr/angular';

/**
 * DateTime container component that combines date and time pickers in a single control.
 *
 * This component provides a unified interface for selecting both date and time values,
 * following Clarity Design System patterns. It internally uses both `clrDate` and the
 * timepicker directive to provide a seamless datetime selection experience.
 *
 * Features:
 * - Combined date and time selection
 * - Shared form control for both inputs
 * - Clarity-styled container
 * - Validation support
 * - Helper text and error messages
 *
 * @example
 * ```html
 * <clr-datetime-container>
 *   <label>Meeting Date & Time</label>
 *   <input clrDatetime [cllTimepicker]="timepicker" formControlName="meetingDateTime" />
 *   <cll-timepicker-toggle [for]="timepicker" class="clr-input-group-icon-action" />
 *   <cll-timepicker #timepicker />
 *   <clr-control-helper>Select both date and time</clr-control-helper>
 *   <clr-control-error *clrIfError="'required'">Required</clr-control-error>
 * </clr-datetime-container>
 * ```
 *
 * @example
 * ```typescript
 * // Component
 * form = new FormGroup({
 *   meetingDateTime: new FormControl(new Date())
 * });
 * ```
 */
@Component({
  selector: 'clr-datetime-container',
  imports: [ClarityModule],
  template: `
    <div class="clr-form-control clr-row">
      <label class="clr-control-label clr-col-12 clr-col-md-2">
        <ng-content select="label" />
      </label>
      <div class="clr-control-container clr-col-md-10 clr-col-12">
        <div class="clr-datetime-wrapper">
          <!-- Date input section (optional) -->
          <div class="clr-date-section" #dateSection>
            <div class="clr-input-wrapper">
              <ng-content select="input[clrDate]" />
            </div>
          </div>

          <!-- Time input section -->
          <div class="clr-time-section">
            <div class="clr-input-wrapper">
              <div class="clr-input-group">
                <ng-content select="input[clrDatetime]" />
                <ng-content select="cll-timepicker-toggle" />
              </div>
            </div>
          </div>
        </div>

        <!-- Timepicker dropdown -->
        <ng-content select="cll-timepicker" />

        <!-- Helper text and validation errors -->
        <ng-content select="clr-control-helper" />
        <ng-content select="clr-control-error" />
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .clr-datetime-wrapper {
        display: flex;
        gap: 0.5rem;
        align-items: flex-start;
      }

      .clr-date-section,
      .clr-time-section {
        flex: 1;
        min-width: 0;
      }

      .clr-date-section {
        flex: 1.5;
      }

      /* Hide date section if empty (time-only mode) */
      .clr-date-section:empty {
        display: none;
      }

      .clr-time-section {
        flex: 1;
      }

      /* Full width for time-only mode */
      .clr-date-section:empty + .clr-time-section {
        flex: 1;
        width: 100%;
      }

      @media (max-width: 768px) {
        .clr-datetime-wrapper {
          flex-direction: column;
          gap: 0.75rem;
        }

        .clr-date-section,
        .clr-time-section {
          width: 100%;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatetimeContainerComponent {}
