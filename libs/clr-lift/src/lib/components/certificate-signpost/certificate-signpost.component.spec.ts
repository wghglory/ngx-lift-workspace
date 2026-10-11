import {ComponentFixture, TestBed} from '@angular/core/testing';
import {pki} from 'node-forge';
import {vi} from 'vitest';

import {TranslationService} from '../../services/translation.service';
import {MockTranslationService} from '../../services/translation.service.mock';
import {CertificateService} from './certificate.service';
import {CertificateSignpostComponent} from './certificate-signpost.component';

describe('CertificateSignpostComponent', () => {
  let component: CertificateSignpostComponent;
  let fixture: ComponentFixture<CertificateSignpostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CertificateSignpostComponent],
      providers: [{provide: TranslationService, useClass: MockTranslationService}, CertificateService],
    });
    fixture = TestBed.createComponent(CertificateSignpostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('shows a string error for an invalid certificate and recovers after an input change', () => {
    const certificateService = TestBed.inject(CertificateService);
    const parse = vi.spyOn(certificateService, 'getCertificateFromPem').mockImplementation(() => {
      throw new Error('Invalid PEM');
    });
    fixture.componentRef.setInput('pem', 'invalid pem');

    expect(() => component.certificate()).not.toThrow();
    expect(component.certificate()).toBeUndefined();
    expect(component.error()).toBe('Invalid PEM');

    parse.mockReturnValue(pki.createCertificate());
    fixture.componentRef.setInput('pem', 'valid pem');
    expect(component.certificate()).toBeDefined();
    expect(component.error()).toBe('');
  });

  it('marks a certificate expired immediately after its expiration instant', () => {
    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date('2026-10-11T12:00:00Z'));
      const certificate = pki.createCertificate();
      certificate.validity.notAfter = new Date('2026-10-11T11:59:59Z');
      vi.spyOn(TestBed.inject(CertificateService), 'getCertificateFromPem').mockReturnValue(certificate);
      fixture.componentRef.setInput('pem', 'certificate');

      expect(component.certificateStatus().status).toBe('danger');
    } finally {
      vi.useRealTimers();
    }
  });
});
