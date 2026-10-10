import {ChangeDetectionStrategy, Component, computed, inject, input} from '@angular/core';

import {TranslationService} from '../../services/translation.service';
import {getTimeUntilExpiration} from '../../utils/date-time.util';
import {expirationTimeTranslations} from './expiration-time.l10n';

/**
 * A presentational component that formats and displays remaining time until an expiration timestamp.
 * Displays duration in days, hours, minutes, and seconds (when under 10 minutes).
 * When past expiration, automatically displays a localized expired indicator styled with Clarity danger tokens.
 *
 * @example
 * ```html
 * <!-- ISO string -->
 * <cll-expiration-time [expiresAt]="certificate.notAfter" />
 *
 * <!-- Null/undefined fallback -->
 * <cll-expiration-time [expiresAt]="null" emptyPlaceholder="Never" />
 * ```
 */
@Component({
  selector: 'cll-expiration-time',
  templateUrl: './expiration-time.component.html',
  styleUrl: './expiration-time.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpirationTimeComponent {
  private translationService = inject(TranslationService, {optional: true});

  /** ISO date string or Date object representing the expiration timestamp. */
  readonly expiresAt = input<string | Date | null | undefined>();

  /** Whether to show seconds when time remaining is 10 minutes or less. Defaults to `true`. */
  readonly showSeconds = input<boolean>(true);

  /** CSS class to apply when expired. Defaults to `'text-error'`. */
  readonly expiredClass = input<string>('text-error');

  /** Placeholder text shown when `expiresAt` is missing or null. Defaults to `'-'`. */
  readonly emptyPlaceholder = input<string>('-');

  constructor() {
    this.translationService?.loadTranslationsForComponent('ExpirationTime', expirationTimeTranslations);
  }

  readonly timeUntil = computed(() => {
    const exp = this.expiresAt();
    return exp ? getTimeUntilExpiration(exp) : null;
  });

  readonly isExpired = computed(() => {
    const exp = this.expiresAt();
    if (!exp) {
      return false;
    }
    const date = typeof exp === 'string' ? new Date(exp) : exp;
    return !Number.isNaN(date.getTime()) && date.getTime() <= Date.now();
  });

  readonly expiredLabel = computed(() => {
    const translated = this.translationService?.translate('ExpirationTime.expired');
    return translated && !translated.startsWith('!!') ? translated : 'Expired';
  });

  readonly daysUnit = computed(() => {
    const t = this.translationService?.translate('ExpirationTime.days');
    return t && !t.startsWith('!!') ? t : 'days';
  });

  readonly hoursUnit = computed(() => {
    const t = this.translationService?.translate('ExpirationTime.hours');
    return t && !t.startsWith('!!') ? t : 'hours';
  });

  readonly minsUnit = computed(() => {
    const t = this.translationService?.translate('ExpirationTime.mins');
    return t && !t.startsWith('!!') ? t : 'mins';
  });

  readonly secondsUnit = computed(() => {
    const t = this.translationService?.translate('ExpirationTime.seconds');
    return t && !t.startsWith('!!') ? t : 'seconds';
  });
}
