import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {ClarityModule} from '@clr/angular';

import {TranslatePipe} from '../../pipes/translate.pipe';
import {TranslationService} from '../../services/translation.service';
import {alertTranslations} from './alert.l10n';
import {AlertService} from './alert.service';

@Component({
  selector: 'cll-alert-container',
  standalone: true,
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
}
