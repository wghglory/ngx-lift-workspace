import {booleanAttribute, ChangeDetectionStrategy, Component, computed, inject, input} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {TranslationService} from '../../services/translation.service';
import {spinnerTranslations} from './spinner.l10n';

@Component({
  selector: 'cll-spinner',
  imports: [ClarityModule],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent {
  /** Decorative by default; set false and provide a localized label for standalone loading status. */
  decorative = input(true, {transform: booleanAttribute});
  label = input('');
  private readonly translationService = inject(TranslationService);
  readonly statusLabel = computed(() => this.label() || this.translationService.translate('cll-spinner.loading'));
  constructor() {
    this.translationService.loadTranslationsForComponent('cll-spinner', spinnerTranslations);
  }

  size = input<'lg' | 'md' | 'sm'>('lg');
  center = input(true);
  inline = input(false, {transform: booleanAttribute});
  class = input('');
  readonly cssClasses = computed(() =>
    [
      'spinner',
      `spinner-${this.size()}`,
      this.inline() ? 'spinner-inline' : 'spinner-block',
      !this.inline() && this.center() ? 'mx-auto' : '',
      this.class(),
    ]
      .filter(Boolean)
      .join(' '),
  );
}
