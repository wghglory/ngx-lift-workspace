import {TestBed} from '@angular/core/testing';
import {describe, expect, it} from 'vitest';

import {certificatePem} from './certificate.fixture';
import {CERTIFICATE_CLOCK} from './certificate.model';
import {CertificateService} from './certificate.service';

describe('CertificateService', () => {
  it.each([false, true])('parses real PEM with pemEncoded=%s', (encoded) => {
    const certificate = TestBed.inject(CertificateService).getCertificateFromPem(
      encoded ? btoa(certificatePem) : certificatePem,
      encoded,
    );
    expect(certificate.subject.getField('CN').value).toBe('Google Internet Authority G2');
    expect(certificate.validity.notAfter.toISOString()).toBe('2015-04-04T15:15:55.000Z');
  });

  it('defaults to base64-encoded PEM', () => {
    const service = TestBed.inject(CertificateService);
    expect(service.getCertificateFromPem(btoa(certificatePem)).serialNumber).toBe('023a69');
    expect(service.getCertificateHashes(btoa(certificatePem))).toEqual(
      service.getCertificateHashes(certificatePem, false),
    );
  });

  it.each([false, true])('hashes DER bytes with pemEncoded=%s', (encoded) => {
    // Independently computed with Python hashlib over decoded DER, not node-forge.
    expect(
      TestBed.inject(CertificateService).getCertificateHashes(encoded ? btoa(certificatePem) : certificatePem, encoded),
    ).toEqual({md5: '9E4AC96474245129D9766700412A1F89', sha1: 'D83C1A7F4D0446BB2081B81A1670F8183451CA24'});
  });

  it.each(['getCertificateFromPem', 'getCertificateHashes'] as const)('%s rejects malformed inputs', (method) => {
    const service = TestBed.inject(CertificateService);
    expect(() => service[method]('%%%')).toThrow();
    expect(() => service[method]('not a certificate', false)).toThrow();
    expect(() => service[method](btoa('not a certificate'))).toThrow();
  });

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
