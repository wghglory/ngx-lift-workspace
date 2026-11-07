import {HttpErrorResponse} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, computed, inject, input, model, output} from '@angular/core';
import {ClarityModule} from '@clr/angular';

import {AlertType} from '../alerts/alert.type';
import {alertTranslations} from '../alerts/alert.l10n';
import {TranslatePipe} from '../../pipes/translate.pipe';
import {TranslationService} from '../../services/translation.service';

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
  imports: [ClarityModule, TranslatePipe],
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
   * Whether to render a close button so the user can dismiss the alert.
   * Defaults to `true`, preserving the current visible close button behavior.
   * When `false`, the alert stays visible and cannot be dismissed by the user.
   */
  closable = input(true);

  /**
   * Controlled open/closed state of the alert.
   * `false` shows the alert; `true` closes (removes) it from the view.
   * Supports two-way binding through `[(closed)]`; setting it back to `false`
   * reopens a previously closed alert.
   */
  closed = model(false);

  /**
   * Emits when the alert is closed (`true`) or reopened (`false`).
   * Fires after a user dismisses the alert or after a controlled `[(closed)]` change.
   */
  closedChange = output<boolean>();

  constructor() {
    inject(TranslationService).loadTranslationsForComponent('alert', alertTranslations);
  }

  /** Relays Clarity's close/open event to the controlled `closed` model and `closedChange` output. */
  protected onClosedChange(closed: boolean): void {
    this.closed.set(closed);
    this.closedChange.emit(closed);
  }

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
