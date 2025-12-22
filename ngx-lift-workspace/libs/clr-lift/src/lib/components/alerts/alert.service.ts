import {computed, inject, Injectable, signal} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

import {Alert, RequiredAlert} from './alert.type';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private sanitizer = inject(DomSanitizer);

  private alertsSource = signal<RequiredAlert[]>([]);

  alerts = computed(() => {
    return this.alertsSource().map((alert) => ({
      ...alert,
      content: this.sanitizer.bypassSecurityTrustHtml(alert.content),
    }));
  });

  addAlert(alert: Alert) {
    const newAlert = this.createAlert(alert);

    this.alertsSource.update((alerts) => [newAlert, ...alerts]);

    this.registerEvent(newAlert);

    return newAlert;
  }

  deleteAlert(id: symbol) {
    const alert = this.alertsSource().find((alert) => alert.id === id);

    if (alert) {
      // TODO: https://github.com/vmware-clarity/ng-clarity/issues/1151
      this.unregisterEvent(alert);
      this.alertsSource.update((alerts) => alerts.filter((alert) => alert.id !== id));
    }
  }

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
