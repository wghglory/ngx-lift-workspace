import {NgClass} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, inject, input, signal, untracked} from '@angular/core';
import {certificateIcon, ClarityIcons} from '@cds/core/icon';
import {ClarityModule} from '@clr/angular';
import {pki} from 'node-forge';

import {TranslatePipe} from '../../pipes/translate.pipe';
import {TranslationService} from '../../services/translation.service';
import {certificateTranslations} from './certificate.l10n';
import {CertificateStatus} from './certificate.model';
import {CertificateService} from './certificate.service';
import {CertificateComponent} from './certificate/certificate.component';

ClarityIcons.addIcons(certificateIcon);

@Component({
  selector: 'cll-certificate-signpost',
  standalone: true,
  imports: [NgClass, ClarityModule, TranslatePipe, CertificateComponent],
  templateUrl: './certificate-signpost.component.html',
  styleUrls: ['./certificate-signpost.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificateSignpostComponent {
  private translationService = inject(TranslationService);
  private certificateService = inject(CertificateService);

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

  error = signal('');

  certificate = computed(() => {
    try {
      return this.certificateService.getCertificateFromPem(this.pem(), this.pemEncoded());
    } catch (error: unknown) {
      untracked(() => {
        this.error.set(error as string);
      });
      return undefined;
    }
  });

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
    const daysDiff = this.certificateService.getDayDifferences(certificate.validity.notAfter);

    if (daysDiff < 0) {
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
