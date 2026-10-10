import {ChangeDetectionStrategy, Component, computed, inject, input, signal} from '@angular/core';
import {ClarityModule, ClrIcon} from '@clr/angular';

import {TranslationService} from '../../services/translation.service';
import {CopyToClipboardComponent} from '../copy-to-clipboard/copy-to-clipboard.component';
import {maskedValueFieldTranslations} from './masked-value-field.l10n';

/**
 * A presentational component that masks sensitive values (passwords, tokens, keys)
 * by default with a toggleable show/hide button and optional copy-to-clipboard button.
 *
 * @example
 * ```html
 * <!-- Basic masked password -->
 * <cll-masked-value-field [value]="credentials.password" />
 *
 * <!-- Masked API secret with copy button -->
 * <cll-masked-value-field
 *   [value]="apiKey"
 *   [copyable]="true"
 *   copyTooltip="Copy API Key"
 * />
 * ```
 */
@Component({
  selector: 'cll-masked-value-field',
  imports: [ClarityModule, ClrIcon, CopyToClipboardComponent],
  templateUrl: './masked-value-field.component.html',
  styleUrl: './masked-value-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaskedValueFieldComponent {
  private translationService = inject(TranslationService, {optional: true});

  /** The sensitive value to mask. When empty/null/undefined, renders the emptyPlaceholder. */
  readonly value = input<string | number | null | undefined>();

  /** The placeholder displayed when masked. Defaults to 10 bullet dots. */
  readonly placeholder = input('●●●●●●●●●●');

  /** The fallback string rendered when value is null, undefined, or empty. Defaults to '-'. */
  readonly emptyPlaceholder = input('-');

  /** Accessible label or override for the show button. */
  readonly showLabel = input<string>();

  /** Accessible label or override for the hide button. */
  readonly hideLabel = input<string>();

  /** Whether to render a copy-to-clipboard button alongside the toggle button. */
  readonly copyable = input(false);

  /** Tooltip text for the copy button when copyable is true. */
  readonly copyTooltip = input<string>();

  /** Whether the sensitive value is currently unmasked. */
  readonly isVisible = signal(false);

  constructor() {
    this.translationService?.loadTranslationsForComponent('MaskedValueField', maskedValueFieldTranslations);
  }

  readonly hasValue = computed(() => {
    const val = this.value();
    return val !== null && val !== undefined && val !== '';
  });

  readonly stringValue = computed(() => {
    const val = this.value();
    return val !== null && val !== undefined ? String(val) : '';
  });

  readonly effectiveAriaLabel = computed(() => {
    if (this.isVisible()) {
      return this.hideLabel() || this.translationService?.translate('MaskedValueField.hide') || 'Hide value';
    }
    return this.showLabel() || this.translationService?.translate('MaskedValueField.show') || 'Show value';
  });

  /**
   * Toggles visibility between masked and plain text.
   */
  toggle(): void {
    this.isVisible.update((visible) => !visible);
  }
}
