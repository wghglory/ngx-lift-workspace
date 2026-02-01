import {HttpErrorResponse} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
import {ClarityModule} from '@clr/angular';

import {AlertType} from '../alerts/alert.type';

/**
 * A reusable alert component built on top of Clarity Design System.
 * Displays alert messages with various types, sizes, and styles.
 *
 * @example
 * ```html
 * <!-- Basic alert -->
 * <cll-alert [content]="'This is an error message'" />
 *
 * <!-- Alert with HttpErrorResponse -->
 * <cll-alert [error]="httpError" />
 *
 * <!-- Alert with generic Error -->
 * <cll-alert [error]="error" />
 *
 * <!-- Small, lightweight alert -->
 * <cll-alert
 *   [content]="'Info message'"
 *   [alertType]="'info'"
 *   [isSmall]="true"
 *   [isLightweight]="true"
 * />
 * ```
 */
@Component({
  selector: 'cll-alert',
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
  imports: [ClarityModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {
  /**
   * The type of alert to display.
   * Options: 'success', 'info', 'warning', 'danger', 'neutral', 'loading', 'unknown'
   * Defaults to 'danger'.
   */
  alertType = input<AlertType>('danger');

  /**
   * Whether to display the alert in a compact size.
   * Defaults to `false`.
   */
  isSmall = input(false);

  /**
   * Whether to display the alert in a lightweight style.
   * Defaults to `false`.
   */
  isLightweight = input(false);

  /**
   * Whether to display the alert at the application level (full-width).
   * Defaults to `false`.
   */
  isAppLevel = input(false);

  /**
   * An error object to display. Accepts HttpErrorResponse or Error.
   * The component will extract the error message from various error formats.
   */
  error = input<HttpErrorResponse | Error>();

  /**
   * The text content to display in the alert.
   * If both `error` and `content` are provided, `error` takes precedence.
   */
  content = input('');

  /**
   * Computed error message extracted from various error formats.
   * Handles HttpErrorResponse, Error, and custom error objects.
   */
  protected errorMessage = computed(() => {
    const err = this.error();
    if (!err) return '';

    // HttpErrorResponse: error?.error?.message || error?.message
    if ('error' in err && err.error && typeof err.error === 'object' && 'message' in err.error) {
      return err.error.message;
    }

    // Error or custom object with message property
    if ('message' in err) {
      return err.message;
    }

    return '';
  });
}
