import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {ClarityModule} from '@clr/angular';

import {TranslatePipe} from '../../pipes/translate.pipe';
import {TranslationService} from '../../services/translation.service';
import {alertTranslations} from './alert.l10n';
import {AlertService} from './alert.service';
import {RequiredAlert} from './alert.type';

@Component({
  selector: 'cll-alert-container',
  imports: [ClarityModule, TranslatePipe],
  templateUrl: './alert-container.component.html',
  styleUrl: './alert-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertContainerComponent {
  private alertService = inject(AlertService);
  private translationService = inject(TranslationService);

  alerts = this.alertService.alerts;

  constructor() {
    this.translationService.loadTranslationsForComponent('alert', alertTranslations);
  }

  onCloseAlert(id: symbol) {
    this.alertService.deleteAlert(id);
  }

  /** Handles legacy selectors only within the alert that received the click. */
  onContentClick(event: MouseEvent, alert: RequiredAlert, content: HTMLElement) {
    const {targetSelector, onTargetClick} = alert;
    const {target} = event;
    if (!targetSelector || !onTargetClick || !(target instanceof Element) || !content.contains(target)) {
      return;
    }

    let matched: Element | null;
    try {
      matched = target.closest(targetSelector);
    } catch {
      // Invalid legacy selectors must not break the alert's other interactions.
      return;
    }
    if (matched && content.contains(matched)) {
      event.preventDefault();
      onTargetClick();
    }
  }
}
