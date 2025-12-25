import {computed, inject, Injectable, signal} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

import {Alert, RequiredAlert} from './alert.type';

/**
 * Service for managing application-wide alerts.
 * Provides methods to add, delete, and clear alerts, with automatic HTML sanitization.
 *
 * Alerts are stored in a signal and automatically sanitized for safe HTML rendering.
 * The service supports click event handlers on alert target elements.
 */
@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private sanitizer = inject(DomSanitizer);

  private alertsSource = signal<RequiredAlert[]>([]);

  /**
   * Computed signal that provides all alerts with sanitized HTML content.
   * The content is automatically sanitized using Angular's DomSanitizer to prevent XSS attacks.
   */
  alerts = computed(() => {
    return this.alertsSource().map((alert) => ({
      ...alert,
      content: this.sanitizer.bypassSecurityTrustHtml(alert.content),
    }));
  });

  /**
   * Adds a new alert to the alert list.
   * The alert is added to the beginning of the list and assigned a unique ID.
   * If the alert has a target selector and click handler, they are registered after a delay.
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

    this.registerEvent(newAlert);

    return newAlert;
  }

  /**
   * Deletes an alert by its unique identifier.
   * If the alert has a registered click event handler, it is unregistered before deletion.
   *
   * @param id - The unique symbol identifier of the alert to delete.
   */
  deleteAlert(id: symbol) {
    const alert = this.alertsSource().find((alert) => alert.id === id);

    if (alert) {
      // TODO: https://github.com/vmware-clarity/ng-clarity/issues/1151
      this.unregisterEvent(alert);
      this.alertsSource.update((alerts) => alerts.filter((alert) => alert.id !== id));
    }
  }

  /**
   * Clears all alerts from the alert list.
   * All registered click event handlers are unregistered before clearing.
   */
  clearAlerts() {
    this.alertsSource().forEach((alert) => {
      this.unregisterEvent(alert);
    });

    this.alertsSource.set([]);
  }

  /**
   * wait for the alert to be rendered in DOM and then register click event handler.
   * @param alert Alert to be registered
   */
  private registerEvent(alert: RequiredAlert) {
    setTimeout(() => {
      if (alert.targetSelector && alert.onTargetClick) {
        const element = document.querySelector(alert.targetSelector);
        element?.addEventListener('click', alert.onTargetClick, false);
      }
    }, 2000);
  }

  /**
   * unregister the click event before deleting the alert
   * @param alert Alert to be unregistered
   */
  private unregisterEvent(alert: RequiredAlert) {
    if (alert.targetSelector && alert.onTargetClick) {
      const element = document.getElementById(alert.targetSelector);
      element?.removeEventListener('click', alert.onTargetClick, false);
    }
  }

  private createAlert(alert: Alert): RequiredAlert {
    return {
      id: Symbol(),
      content: alert.content,
      alertType: alert.alertType ?? 'danger',
      isAppLevel: alert.isAppLevel ?? true,
      targetSelector: alert.targetSelector,
      onTargetClick: alert.onTargetClick,
    };
  }
}
