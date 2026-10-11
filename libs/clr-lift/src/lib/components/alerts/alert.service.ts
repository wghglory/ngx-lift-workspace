import {computed, DestroyRef, inject, Injectable, signal} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

import {Alert, RequiredAlert} from './alert.type';

/**
 * Service for managing application-wide alerts.
 * Provides methods to add, delete, and clear alerts.
 *
 * Alerts are stored in a signal and HTML markup is trusted so inline interactive elements
 * (e.g. buttons, links) can be placed at any position within the content.
 */
@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private sanitizer = inject(DomSanitizer);

  constructor() {
    inject(DestroyRef).onDestroy(() => this.clearAlerts());
  }

  private alertsSource = signal<RequiredAlert[]>([]);

  /**
   * Computed signal that provides all alerts.
   * String content is wrapped with bypassSecurityTrustHtml so that inline HTML elements
   * (e.g. buttons, spans, links) anywhere in the message are preserved.
   */
  alerts = computed(() => {
    return this.alertsSource().map((alert) => ({
      ...alert,
      content:
        typeof alert.content === 'string' ? this.sanitizer.bypassSecurityTrustHtml(alert.content) : alert.content,
    }));
  });

  /**
   * Adds a new alert to the alert list.
   * The alert is added to the beginning of the list and assigned a unique ID.
   * The container renders actions and handles legacy content clicks without delayed registration.
   *
   * @param alert - The alert configuration to add.
   * @returns The created alert with all required properties and a unique ID.
   *
   * @example
   * ```typescript
   * alertService.addAlert({
   *   content: 'Operation completed successfully',
   *   alertType: 'success',
   *   isAppLevel: true
   * });
   * ```
   */
  addAlert(alert: Alert) {
    const newAlert = this.createAlert(alert);

    this.alertsSource.update((alerts) => [newAlert, ...alerts]);

    return newAlert;
  }

  /**
   * Deletes an alert by its unique identifier.
   *
   * @param id - The unique symbol identifier of the alert to delete.
   */
  deleteAlert(id: symbol) {
    const alert = this.alertsSource().find((alert) => alert.id === id);

    if (alert) {
      this.alertsSource.update((alerts) => alerts.filter((alert) => alert.id !== id));
    }
  }

  /**
   * Clears all alerts from the alert list.
   */
  clearAlerts() {
    this.alertsSource.set([]);
  }

  private createAlert(alert: Alert): RequiredAlert {
    return {
      id: Symbol(),
      content: alert.content,
      alertType: alert.alertType ?? 'danger',
      isAppLevel: alert.isAppLevel ?? true,
      isLightweight: alert.isLightweight,
      actions: alert.actions,
      targetSelector: alert.targetSelector,
      onTargetClick: alert.onTargetClick,
    };
  }
}
