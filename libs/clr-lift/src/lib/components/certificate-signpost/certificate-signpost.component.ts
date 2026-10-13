import {ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal} from '@angular/core';
import {certificateIcon, ClarityIcons} from '@clr/angular/icon';
import {ClarityModule} from '@clr/angular';
import type {pki} from 'node-forge';

import {TranslatePipe} from '../../pipes/translate.pipe';
import {TranslationService} from '../../services/translation.service';
import {certificateTranslations} from './certificate.l10n';
import {CERTIFICATE_CLOCK, CertificateClock, CertificateStatus} from './certificate.model';
import {CertificateService} from './certificate.service';
import {CertificateComponent} from './certificate/certificate.component';

ClarityIcons.addIcons(certificateIcon);

@Component({
  selector: 'cll-certificate-signpost',
  imports: [ClarityModule, TranslatePipe, CertificateComponent],
  templateUrl: './certificate-signpost.component.html',
  styleUrls: ['./certificate-signpost.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificateSignpostComponent {
  private translationService = inject(TranslationService);
  private certificateService = inject(CertificateService);
  private injectedClock = inject(CERTIFICATE_CLOCK, {optional: true});

  clock = input<CertificateClock>();

  position = input<
    | 'top-left'
    | 'top-middle'
    | 'top-right'
    | 'right-top'
    | 'right-middle'
    | 'right-bottom'
    | 'bottom-right'
    | 'bottom-middle'
    | 'bottom-left'
    | 'left-bottom'
    | 'left-middle'
    | 'left-top'
  >('right-middle');
  showIcon = input(true);
  pemEncoded = input(false); // encode pem string or not
  pem = input.required<string>();

  private certificateResult = computed(() => {
    try {
      return {
        certificate: this.certificateService.getCertificateFromPem(this.pem(), this.pemEncoded()),
        error: '',
      };
    } catch (error: unknown) {
      return {
        certificate: undefined,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  });

  error = linkedSignal(() => this.certificateResult().error);
  certificate = computed(() => this.certificateResult().certificate);

  certificateStatus = computed<CertificateStatus>(() => {
    const cert = this.certificate();

    return cert
      ? this.getCertificateStatus(cert)
      : {
          labelText: this.error(),
          labelClass: 'label-danger',
          status: 'danger',
          shape: 'error-standard',
        };
  });

  hash = computed(() => this.certificateService.getCertificateHashes(this.pem(), this.pemEncoded()));

  certificateStatusClass = computed(() => {
    return this.certificateStatus().status === 'danger'
      ? 'text-danger'
      : this.certificateStatus().status === 'warning'
        ? 'text-warning'
        : 'text-success';
  });

  constructor() {
    this.translationService.loadTranslationsForComponent('certificate', certificateTranslations);
  }

  /**
   * Returns the status of a certificate based on its expiration date.
   *
   * @param {pki.Certificate} certificate - The certificate to check the status of.
   * @return {CertificateStatus} The status of the certificate, including label text, label class, status, and shape.
   */
  private getCertificateStatus(certificate: pki.Certificate): CertificateStatus {
    const clock = this.clock() ?? this.injectedClock;
    const nowTimestamp = clock
      ? typeof clock === 'function'
        ? clock() instanceof Date
          ? (clock() as Date).getTime()
          : (clock() as number)
        : Date.now()
      : Date.now();
    const referenceDate = new Date(nowTimestamp);
    const daysDiff = this.certificateService.getDayDifferences(certificate.validity.notAfter, referenceDate);

    if (certificate.validity.notAfter.getTime() <= nowTimestamp) {
      return {
        labelText: this.translationService.translate('certificate.expired'),
        labelClass: 'label-danger',
        status: 'danger',
        shape: 'error-standard',
      };
    } else if (daysDiff <= 30) {
      return {
        labelText: this.translationService.translate('certificate.expiresIn', `${daysDiff}`),
        labelClass: 'label-warning',
        status: 'warning',
        shape: 'exclamation-triangle',
      };
    } else {
      return {
        labelText: this.translationService.translate('certificate.valid'),
        labelClass: 'label-success',
        status: 'success',
        shape: 'success-standard',
      };
    }
  }
}
