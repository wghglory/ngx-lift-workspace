import {Clipboard} from '@angular/cdk/clipboard';
import {ChangeDetectionStrategy, Component, computed, inject, input, output, signal} from '@angular/core';
import {ClarityModule, ClrLoadingState} from '@clr/angular';

import {TranslationService} from '../../services/translation.service';
import {copyToClipboardTranslations} from './copy-to-clipboard.l10n';

export type CopyToClipboardTooltipPosition =
  'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'right' | 'left' | 'top' | 'bottom';

export type CopyToClipboardTooltipSize = 'xs' | 'sm' | 'md' | 'lg';

/**
 * An inline action button component that copies a value to the user's clipboard.
 * Features built-in Clarity loading and success feedback, accessible tooltip, and localized messaging.
 *
 * @example
 * ```html
 * <!-- Basic usage -->
 * <cll-copy-to-clipboard [value]="token" />
 *
 * <!-- With text and custom tooltip -->
 * <cll-copy-to-clipboard
 *   [value]="clusterId"
 *   text="Copy ID"
 *   tooltip="Copy cluster unique identifier"
 *   (copied)="onCopied($event)"
 * />
 * ```
 */
@Component({
  selector: 'cll-copy-to-clipboard',
  imports: [ClarityModule],
  templateUrl: './copy-to-clipboard.component.html',
  styleUrl: './copy-to-clipboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopyToClipboardComponent {
  private clipboard = inject(Clipboard);
  private translationService = inject(TranslationService, {optional: true});

  /** The string or number value to be copied to the clipboard. */
  readonly value = input.required<string | number>();

  /** Optional text label to display next to the copy icon. */
  readonly text = input('');

  /** Custom tooltip message to display on hover when enabled. */
  readonly tooltip = input('');

  /** Clarity tooltip placement. */
  readonly tooltipPosition = input<CopyToClipboardTooltipPosition>('right');

  /** Clarity tooltip container size. */
  readonly tooltipSize = input<CopyToClipboardTooltipSize>('md');

  /** Whether the copy button is disabled. */
  readonly disabled = input(false);

  /** Tooltip message shown when the button is disabled. */
  readonly disabledTooltip = input('');

  /** Accessible ARIA label for screen readers. */
  readonly ariaLabel = input<string>();

  /** Button size variant. */
  readonly size = input<'sm' | 'md'>('sm');

  /** Event emitted with the copied string when successfully copied. */
  readonly copied = output<string>();

  /** Current button visual state (DEFAULT, LOADING, or SUCCESS). */
  readonly copyBtnState = signal<ClrLoadingState>(ClrLoadingState.DEFAULT);

  constructor() {
    this.translationService?.loadTranslationsForComponent('CopyToClipboard', copyToClipboardTranslations);
  }

  readonly effectiveTooltip = computed(() => {
    const custom = this.tooltip();
    if (custom) {
      return custom;
    }
    const translated = this.translationService?.translate('CopyToClipboard.copyToClipboard');
    return translated && !translated.startsWith('!!') ? translated : 'Copy to clipboard';
  });

  readonly effectiveAriaLabel = computed(() => {
    return this.ariaLabel() || this.text() || this.effectiveTooltip();
  });

  /**
   * Copies the current value to the clipboard and triggers temporary success state.
   */
  copy(): void {
    if (this.disabled()) {
      return;
    }

    this.copyBtnState.set(ClrLoadingState.LOADING);
    const textToCopy = this.value().toString();
    const success = this.clipboard.copy(textToCopy);

    if (success) {
      this.copyBtnState.set(ClrLoadingState.SUCCESS);
      this.copied.emit(textToCopy);
    } else {
      this.copyBtnState.set(ClrLoadingState.DEFAULT);
    }

    setTimeout(() => {
      this.copyBtnState.set(ClrLoadingState.DEFAULT);
    }, 2000);
  }
}
