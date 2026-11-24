import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, inject, input} from '@angular/core';
import {ClarityModule} from '@clr/angular';

import {TranslatePipe} from '../../../pipes/translate.pipe';
import {ClrLiftI18nService} from '../../../services/clr-lift-i18n.service';
import {certificateTranslations} from '../certificate.l10n';
import {X509Certificate} from '../certificate-parser';
import {CertificateStatus} from '../certificate-status.model';

@Component({
  selector: 'cll-certificate',
  imports: [ClarityModule, TranslatePipe, CommonModule],
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificateComponent {
  private translationService = inject(ClrLiftI18nService);

  certificate = input.required<X509Certificate>();
  certificateStatus = input.required<CertificateStatus>();

  readonly formattedNotBefore = computed(() =>
    new Intl.DateTimeFormat(this.translationService.locale(), {dateStyle: 'medium', timeStyle: 'medium'}).format(
      this.certificate().validity.notBefore,
    ),
  );

  readonly formattedNotAfter = computed(() =>
    new Intl.DateTimeFormat(this.translationService.locale(), {dateStyle: 'medium', timeStyle: 'medium'}).format(
      this.certificate().validity.notAfter,
    ),
  );

  hash = input.required<{
    md5: string;
    sha1: string;
    sha256: string;
  }>();

  constructor() {
    this.translationService.loadTranslationsForComponent('certificate', certificateTranslations);
  }
}
