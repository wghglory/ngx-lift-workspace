import {ComponentFixture, TestBed} from '@angular/core/testing';
import {vi} from 'vitest';

import {TranslationService} from '../../services/translation.service';
import {MockTranslationService} from '../../services/translation.service.mock';
import {makeCert, OID, TAG, toPem} from './certificate-der-fixture';
import {CertificateSignpostComponent} from './certificate-signpost.component';

function pemExpiringAt(notAfter: Date, notBefore: Date = new Date(Date.UTC(2020, 0, 1))): string {
  return toPem(
    makeCert({
      serial: [0x01],
      issuer: [[{oid: OID.CN, tag: TAG.PRINTABLE, value: 'Test CA'}]],
      subject: [[{oid: OID.CN, tag: TAG.PRINTABLE, value: 'test.example'}]],
      notBefore,
      notAfter,
    }),
  );
}

describe('CertificateSignpostComponent', () => {
  let component: CertificateSignpostComponent;
  let fixture: ComponentFixture<CertificateSignpostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CertificateSignpostComponent],
      providers: [{provide: TranslationService, useClass: MockTranslationService}],
    });
    fixture = TestBed.createComponent(CertificateSignpostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('shows a string error for an invalid certificate and recovers after an input change', () => {
    fixture.componentRef.setInput('pem', 'not a certificate');

    expect(() => component.certificate()).not.toThrow();
    expect(component.certificate()).toBeUndefined();
    expect(component.error()).toContain('Invalid certificate');

    fixture.componentRef.setInput('pem', pemExpiringAt(new Date(Date.UTC(2030, 0, 1))));
    expect(component.certificate()).toBeDefined();
    expect(component.error()).toBe('');
  });

  it('marks a certificate expired immediately after its expiration instant', () => {
    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date('2026-10-11T12:00:00Z'));
      fixture.componentRef.setInput('pem', pemExpiringAt(new Date('2026-10-11T11:59:59Z')));

      expect(component.certificateStatus().status).toBe('danger');
    } finally {
      vi.useRealTimers();
    }
  });

  it('ages an unchanged certificate with the browser clock and cleans up on destroy', async () => {
    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date('2026-10-31T23:59:30Z'));
      const timedFixture = TestBed.createComponent(CertificateSignpostComponent);
      timedFixture.componentRef.setInput('pem', pemExpiringAt(new Date('2026-11-01T00:00:00Z')));
      timedFixture.detectChanges();
      expect(timedFixture.componentInstance.certificateStatus().status).toBe('warning');
      await vi.advanceTimersByTimeAsync(60_000);
      expect(timedFixture.componentInstance.certificateStatus().status).toBe('danger');
      timedFixture.destroy();
    } finally {
      vi.useRealTimers();
    }
  });
});
