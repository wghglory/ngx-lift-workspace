import {HttpErrorResponse} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, input} from '@angular/core';
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
 * <!-- Alert with error object -->
 * <cll-alert [error]="errorResponse" />
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
   * An HTTP error response object to display.
   * If provided, the alert will automatically extract and display error information.
   */
  error = input<HttpErrorResponse>();

  /**
   * The text content to display in the alert.
   * If both `error` and `content` are provided, `error` takes precedence.
   */
  content = input('');
}
