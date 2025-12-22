import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {
  ClarityIcons,
  disconnectIcon,
  errorStandardIcon,
  successStandardIcon,
  syncIcon,
  unknownStatusIcon,
  warningStandardIcon,
} from '@cds/core/icon';
import {ClarityModule} from '@clr/angular';

import {TranslatePipe} from '../../pipes/translate.pipe';
import {TranslationService} from '../../services/translation.service';
import {TooltipModule} from '../tooltip';
import {TooltipPosition} from './../tooltip/tooltip.model';
import {statusIndicatorTranslations} from './status-indicator.l10n';

ClarityIcons.addIcons(
  successStandardIcon,
  disconnectIcon,
  errorStandardIcon,
  warningStandardIcon,
  syncIcon,
  unknownStatusIcon,
);

@Component({
  selector: 'cll-status-indicator',
  standalone: true,
  imports: [CommonModule, ClarityModule, TranslatePipe, TooltipModule],
  templateUrl: './status-indicator.component.html',
  styleUrls: ['./status-indicator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusIndicatorComponent {
  private translationService = inject(TranslationService);

  iconStatus = input.required<'success' | 'error' | 'pending' | 'warning' | 'inactive' | 'unknown'>();
  iconSize = input<'lg' | 'md' | 'sm' | number>('sm');
  tooltip = input('');
  tooltipPosition = input<TooltipPosition>('tooltip-bottom-right');

  constructor() {
    this.translationService.loadTranslationsForComponent('status-indicator', statusIndicatorTranslations);
  }
}
