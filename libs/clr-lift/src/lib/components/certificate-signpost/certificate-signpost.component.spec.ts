import {signal} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {pki} from 'node-forge';
import {vi} from 'vitest';

import {TranslationService} from '../../services/translation.service';
import {MockTranslationService} from '../../services/translation.service.mock';
import {CERTIFICATE_CLOCK} from './certificate.model';
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

  it('ages an unchanged certificate with the default clock and cleans up on destroy', async () => {
    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date('2026-10-31T23:59:30Z'));
      const timedFixture = TestBed.createComponent(CertificateSignpostComponent);
      const certificate = pki.createCertificate();
      certificate.validity.notAfter = new Date('2026-11-01T00:00:00Z');
      vi.spyOn(TestBed.inject(CertificateService), 'getCertificateFromPem').mockReturnValue(certificate);
      timedFixture.componentRef.setInput('pem', 'certificate');
      timedFixture.detectChanges();
      expect(timedFixture.componentInstance.certificateStatus().status).toBe('warning');
      await vi.advanceTimersByTimeAsync(60_000);
      expect(timedFixture.componentInstance.certificateStatus().status).toBe('danger');
      timedFixture.destroy();
    } finally {
      vi.useRealTimers();
    }
  });

  it('samples a mixed Date/timestamp clock exactly once per status evaluation', () => {
    const certificate = pki.createCertificate();
    certificate.validity.notAfter = new Date('2026-11-01T00:00:00Z');
    vi.spyOn(TestBed.inject(CertificateService), 'getCertificateFromPem').mockReturnValue(certificate);
    fixture.componentRef.setInput('pem', 'certificate');
    const clock = vi
      .fn<() => Date | number>()
      .mockReturnValueOnce(new Date('2026-10-22T00:00:00Z'))
      .mockReturnValue(Date.parse('2026-11-02T00:00:00Z'));
    fixture.componentRef.setInput('clock', clock);
    expect(component.certificateStatus().status).toBe('warning');
    expect(clock).toHaveBeenCalledTimes(1);
  });

  it('updates status when a signal-backed clock advances without replacing inputs', () => {
    const certificate = pki.createCertificate();
    certificate.validity.notAfter = new Date('2026-11-01T00:00:00Z');
    vi.spyOn(TestBed.inject(CertificateService), 'getCertificateFromPem').mockReturnValue(certificate);
    fixture.componentRef.setInput('pem', 'certificate');
    const clock = signal(Date.parse('2026-10-22T00:00:00Z'));
    fixture.componentRef.setInput('clock', clock);
    expect(component.certificateStatus().status).toBe('warning');
    clock.set(Date.parse('2026-11-02T00:00:00Z'));
    expect(component.certificateStatus().status).toBe('danger');
  });

  it('determines certificate status using clock input for deterministic time evaluation', () => {
    const certificate = pki.createCertificate();
    certificate.validity.notAfter = new Date('2026-11-01T00:00:00Z');
    vi.spyOn(TestBed.inject(CertificateService), 'getCertificateFromPem').mockReturnValue(certificate);
    fixture.componentRef.setInput('pem', 'certificate');

    // 10 days before expiry -> warning (<= 30 days)
    fixture.componentRef.setInput('clock', () => new Date('2026-10-22T00:00:00Z'));
    fixture.detectChanges();
    expect(component.certificateStatus().status).toBe('warning');

    // 60 days before expiry -> success (> 30 days)
    fixture.componentRef.setInput('clock', () => new Date('2026-09-02T00:00:00Z'));
    fixture.detectChanges();
    expect(component.certificateStatus().status).toBe('success');

    // After expiry -> danger
    fixture.componentRef.setInput('clock', () => new Date('2026-11-02T00:00:00Z'));
    fixture.detectChanges();
    expect(component.certificateStatus().status).toBe('danger');
  });

  it('honors CERTIFICATE_CLOCK injection token when clock input is omitted', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [CertificateSignpostComponent],
      providers: [
        {provide: TranslationService, useClass: MockTranslationService},
        {provide: CERTIFICATE_CLOCK, useValue: () => new Date('2026-05-01T00:00:00Z')},
        CertificateService,
      ],
    });
    const customFixture = TestBed.createComponent(CertificateSignpostComponent);
    const customComponent = customFixture.componentInstance;
    const certificate = pki.createCertificate();
    certificate.validity.notAfter = new Date('2026-05-15T00:00:00Z');
    vi.spyOn(TestBed.inject(CertificateService), 'getCertificateFromPem').mockReturnValue(certificate);
    customFixture.componentRef.setInput('pem', 'cert');
    customFixture.detectChanges();

    // 14 days diff -> warning
    expect(customComponent.certificateStatus().status).toBe('warning');
  });
});
