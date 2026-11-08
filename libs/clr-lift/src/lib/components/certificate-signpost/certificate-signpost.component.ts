import {DOCUMENT} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, effect, inject, input, linkedSignal, signal} from '@angular/core';
import {certificateIcon, ClarityIcons} from '@clr/angular/icon';
import {ClarityModule} from '@clr/angular';
import {differenceInDays} from 'ngx-lift';

import {TranslatePipe} from '../../pipes/translate.pipe';
import {TranslationService} from '../../services/translation.service';
import {certificateTranslations} from './certificate.l10n';
import {md5, sha1, sha256} from './certificate-crypto';
import {extractDerFromPem, parseCertificate, X509Certificate} from './certificate-parser';
import {CertificateStatus} from './certificate.model';
import {CertificateComponent} from './certificate/certificate.component';

ClarityIcons.addIcons(certificateIcon);

/** Shared label/icon/text styling per certificate status, so every status site spells it once. */
const STATUS_STYLES = {
  danger: {labelClass: 'label-danger', shape: 'error-standard', textClass: 'text-danger'},
  warning: {labelClass: 'label-warning', shape: 'exclamation-triangle', textClass: 'text-warning'},
  success: {labelClass: 'label-success', shape: 'success-standard', textClass: 'text-success'},
} as const;

@Component({
  selector: 'cll-certificate-signpost',
  imports: [ClarityModule, TranslatePipe, CertificateComponent],
  templateUrl: './certificate-signpost.component.html',
  styleUrls: ['./certificate-signpost.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificateSignpostComponent {
  private translationService = inject(TranslationService);

  /** Internal minute-tick so expiry status updates as time passes; the browser clock is used, no time override is exposed. */
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
      const der = extractDerFromPem(this.pem(), this.pemEncoded());
      const certificate = parseCertificate(der);
      return {
        certificate,
        error: '',
        hashes: {md5: md5(der), sha1: sha1(der), sha256: sha256(der)},
      };
    } catch (error: unknown) {
      return {
        certificate: undefined,
        error: error instanceof Error ? error.message : String(error),
        hashes: undefined,
      };
    }
  });

  error = linkedSignal(() => this.certificateResult().error);
  certificate = computed(() => this.certificateResult().certificate);

  certificateStatus = computed<CertificateStatus>(() => {
    const cert = this.certificate();

    return cert
      ? this.getCertificateStatus(cert)
      : {...STATUS_STYLES.danger, status: 'danger', labelText: this.error()};
  });

  /** Fingerprint hashes of the parsed certificate; empty for malformed input, which never renders. */
  hash = computed(() => this.certificateResult().hashes ?? {md5: '', sha1: '', sha256: ''});

  certificateStatusClass = computed(() => {
    const status = this.certificateStatus().status;
    return status === 'info' ? 'text-info' : STATUS_STYLES[status].textClass;
  });

  constructor() {
    this.translationService.loadTranslationsForComponent('certificate', certificateTranslations);
    const browserWindow = inject(DOCUMENT).defaultView;
    if (browserWindow) {
      effect((onCleanup) => {
        const timer = browserWindow.setInterval(() => this.currentTime.set(Date.now()), 60_000);
        onCleanup(() => browserWindow.clearInterval(timer));
      });
    }
  }

  /**
   * Returns the status of a certificate based on its expiration date.
   *
   * @param {X509Certificate} certificate - The certificate to check the status of.
   * @return {CertificateStatus} The status of the certificate, including label text, label class, status, and shape.
   */
  private getCertificateStatus(certificate: X509Certificate): CertificateStatus {
    const nowTimestamp = this.currentTime();
    const daysDiff = differenceInDays(new Date(certificate.validity.notAfter), new Date(nowTimestamp));

    if (certificate.validity.notAfter.getTime() <= nowTimestamp) {
      return this.statusPresentation('danger', this.translationService.translate('certificate.expired'));
    } else if (daysDiff <= 30) {
      return this.statusPresentation(
        'warning',
        this.translationService.translate('certificate.expiresIn', `${daysDiff}`),
      );
    } else {
      return this.statusPresentation('success', this.translationService.translate('certificate.valid'));
    }
  }

  /** Combines the shared status styles with the translated label into a certificate status. */
  private statusPresentation(status: keyof typeof STATUS_STYLES, labelText: string): CertificateStatus {
    return {...STATUS_STYLES[status], status, labelText};
  }
}
