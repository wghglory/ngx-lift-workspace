import {DOCUMENT} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, effect, inject, input, linkedSignal, signal} from '@angular/core';
import {certificateIcon, ClarityIcons} from '@clr/angular/icon';
import {ClarityModule} from '@clr/angular';
import {differenceInDays} from 'ngx-lift';

import {TranslatePipe} from '../../pipes/translate.pipe';
import {TranslationService} from '../../services/translation.service';
import {certificateTranslations} from './certificate.l10n';
import {md5, sha1} from './certificate-crypto';
import {extractDerFromPem, parseCertificate, parseCertificateFromPem, X509Certificate} from './certificate-parser';
import {CertificateClock, CertificateStatus} from './certificate.model';
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

  /** Optional clock; signal-backed functions reactively update certificate status. */
  clock = input<CertificateClock>();
  private readonly currentTime = signal(Date.now());

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
        certificate: parseCertificateFromPem(this.pem(), this.pemEncoded()),
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

  hash = computed(() => {
    const der = extractDerFromPem(this.pem(), this.pemEncoded());
    // Validate the structure so malformed input throws instead of hashing garbage.
    parseCertificate(der);

    return {md5: md5(der), sha1: sha1(der)};
  });

  certificateStatusClass = computed(() => {
    return this.certificateStatus().status === 'danger'
      ? 'text-danger'
      : this.certificateStatus().status === 'warning'
        ? 'text-warning'
        : 'text-success';
  });

  constructor() {
    this.translationService.loadTranslationsForComponent('certificate', certificateTranslations);
    const browserWindow = inject(DOCUMENT).defaultView;
    effect((onCleanup) => {
      if (this.clock() || !browserWindow) return;
      const timer = browserWindow.setInterval(() => this.currentTime.set(Date.now()), 60_000);
      onCleanup(() => browserWindow.clearInterval(timer));
    });
  }

  /**
   * Resolves the current timestamp in milliseconds from the clock input or the minute-tick signal.
   */
  private resolveNowTimestamp(): number {
    const clock = this.clock();
    if (clock) {
      const result = clock();
      return result instanceof Date ? result.getTime() : result;
    }
    return this.currentTime();
  }

  /**
   * Returns the status of a certificate based on its expiration date.
   *
   * @param {X509Certificate} certificate - The certificate to check the status of.
   * @return {CertificateStatus} The status of the certificate, including label text, label class, status, and shape.
   */
  private getCertificateStatus(certificate: X509Certificate): CertificateStatus {
    const nowTimestamp = this.resolveNowTimestamp();
    const daysDiff = differenceInDays(new Date(certificate.validity.notAfter), new Date(nowTimestamp));

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
