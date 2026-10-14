import {TestBed} from '@angular/core/testing';
import {describe, expect, it} from 'vitest';

import {CERTIFICATE_CLOCK} from './certificate.model';
import {CertificateService} from './certificate.service';

describe('CertificateService', () => {
  it('calculates day differences relative to system clock or provided date', () => {
    const service = TestBed.inject(CertificateService);
    const certDate = new Date('2026-12-31T00:00:00Z');
    const referenceDate = new Date('2026-12-01T00:00:00Z');

    expect(service.getDayDifferences(certDate, referenceDate)).toBe(30);
    expect(service.getDayDifferences(certDate, () => referenceDate)).toBe(30);
  });

  it('respects CERTIFICATE_CLOCK when referenceDate is omitted', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [CertificateService, {provide: CERTIFICATE_CLOCK, useValue: () => new Date('2026-10-01T00:00:00Z')}],
    });
    const service = TestBed.inject(CertificateService);
    const certDate = new Date('2026-10-15T00:00:00Z');

    expect(service.getDayDifferences(certDate)).toBe(14);
    expect(service.getCurrentTime()).toBe(new Date('2026-10-01T00:00:00Z').getTime());
  });

  it('allows overriding clock in getCurrentTime', () => {
    const service = TestBed.inject(CertificateService);
    const customTime = 1770000000000;
    expect(service.getCurrentTime(() => customTime)).toBe(customTime);
  });
});
