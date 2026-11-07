import {describe, expect, it} from 'vitest';

import {md5, sha1} from './certificate-crypto';
import {certificatePem, digiCertPem} from './certificate.fixture';
import {binaryString, makeCert, OID, TAG, toPem} from './certificate-der-fixture';
import {extractDerFromPem, parseCertificate, parseCertificateFromPem, X509Certificate} from './certificate-parser';

describe('certificate-parser (certificate type coverage)', () => {
  describe('real fixtures', () => {
    it('parses the v3 fixture certificate (UTCTime)', () => {
      const cert = parseCertificateFromPem(certificatePem, false);
      expect(cert.serialNumber).toBe('023a69');
      expect(cert.subject.getField('CN')?.value).toBe('Google Internet Authority G2');
      expect(cert.subject.getField('O')?.value).toBe('Google Inc');
      expect(cert.issuer.getField('CN')?.value).toBe('GeoTrust Global CA');
      expect(cert.validity.notAfter.toISOString()).toBe('2015-04-04T15:15:55.000Z');
    });

    it('parses the DigiCert sample certificate (varied DN string types)', () => {
      const cert = parseCertificateFromPem(digiCertPem, false);
      expect(cert.subject.getField('CN')?.value).toBe('DigiCert Assured ID Root G2');
      expect(cert.subject.getField('O')?.value).toBe('DigiCert Inc');
      expect(cert.subject.getField('OU')?.value).toBe('www.digicert.com');
      expect(cert.validity.notAfter.toISOString()).toBe('2038-01-15T12:00:00.000Z');
    });
  });

  describe('certificate versions', () => {
    it('parses a v1 certificate (no version field, no extensions)', () => {
      const der = makeCert({
        serial: [0x01, 0x23, 0x45],
        issuer: [[{oid: OID.CN, tag: TAG.PRINTABLE, value: 'Issuer One'}]],
        subject: [[{oid: OID.CN, tag: TAG.PRINTABLE, value: 'Subject One'}]],
        notBefore: new Date(Date.UTC(2020, 0, 1)),
        notAfter: new Date(Date.UTC(2030, 0, 1)),
      });
      const cert = parseCertificate(der);
      expect(cert.serialNumber).toBe('012345');
      expect(cert.subject.getField('CN')?.value).toBe('Subject One');
      expect(cert.issuer.getField('CN')?.value).toBe('Issuer One');
    });

    it('parses a v3 certificate with extensions (extensions are ignored)', () => {
      // basicConstraints (2.5.29.19): SEQUENCE { OID, OCTET STRING { SEQUENCE { BOOLEAN TRUE } } }
      const basicConstraints = [0x30, 0x0c, 0x06, 0x03, 0x55, 0x1d, 0x13, 0x04, 0x05, 0x30, 0x03, 0x01, 0x01, 0xff];
      const der = makeCert({
        version: 2,
        serial: [0xab, 0xcd],
        issuer: [[{oid: OID.O, tag: TAG.PRINTABLE, value: 'Issuer Org'}]],
        subject: [[{oid: OID.CN, tag: TAG.PRINTABLE, value: 'Subject Cn'}]],
        notBefore: new Date(Date.UTC(2021, 5, 1)),
        notAfter: new Date(Date.UTC(2031, 5, 1)),
        extensions: [basicConstraints],
      });
      const cert = parseCertificate(der);
      expect(cert.subject.getField('CN')?.value).toBe('Subject Cn');
      expect(cert.issuer.getField('O')?.value).toBe('Issuer Org');
    });
  });

  describe('validity time formats', () => {
    it('parses GeneralizedTime validity (post-2049 dates)', () => {
      const der = makeCert({
        serial: [0x01],
        issuer: [[{oid: OID.CN, tag: TAG.PRINTABLE, value: 'CA'}]],
        subject: [[{oid: OID.CN, tag: TAG.PRINTABLE, value: 'Future'}]],
        notBefore: new Date(Date.UTC(2050, 0, 1, 0, 0, 0)),
        notAfter: new Date(Date.UTC(2059, 11, 31, 23, 59, 59)),
        timeTag: 0x18,
      });
      const cert = parseCertificate(der);
      expect(cert.validity.notBefore.toISOString()).toBe('2050-01-01T00:00:00.000Z');
      expect(cert.validity.notAfter.toISOString()).toBe('2059-12-31T23:59:59.000Z');
    });

    it('parses UTCTime validity', () => {
      const der = makeCert({
        serial: [0x02],
        issuer: [[{oid: OID.CN, tag: TAG.PRINTABLE, value: 'CA'}]],
        subject: [[{oid: OID.CN, tag: TAG.PRINTABLE, value: 'Edge'}]],
        notBefore: new Date(Date.UTC(2022, 2, 3, 4, 5, 6)),
        notAfter: new Date(Date.UTC(2032, 2, 3, 4, 5, 6)),
      });
      const cert = parseCertificate(der);
      expect(cert.validity.notBefore.toISOString()).toBe('2022-03-03T04:05:06.000Z');
      expect(cert.validity.notAfter.toISOString()).toBe('2032-03-03T04:05:06.000Z');
    });

    it('converts numeric timezone offsets to UTC instead of reading them as UTC', () => {
      const der = makeCert({
        serial: [0x06],
        issuer: [[{oid: OID.CN, tag: TAG.PRINTABLE, value: 'CA'}]],
        subject: [[{oid: OID.CN, tag: TAG.PRINTABLE, value: 'Offset'}]],
        notBefore: new Date(0),
        notAfter: new Date(0),
        timeTag: 0x18,
        rawNotBefore: '20500101000000+0200',
        rawNotAfter: '20500101000000-0130',
      });
      const cert = parseCertificate(der);
      expect(cert.validity.notBefore.toISOString()).toBe('2049-12-31T22:00:00.000Z');
      expect(cert.validity.notAfter.toISOString()).toBe('2050-01-01T01:30:00.000Z');
    });
  });

  describe('distinguished name shapes', () => {
    it('parses a multi-valued RDN (CN and OU in a single SET)', () => {
      const der = makeCert({
        serial: [0x03],
        issuer: [[{oid: OID.CN, tag: TAG.PRINTABLE, value: 'Issuer'}]],
        subject: [
          [
            {oid: OID.CN, tag: TAG.PRINTABLE, value: 'Host'},
            {oid: OID.OU, tag: TAG.PRINTABLE, value: 'Dev'},
          ],
        ],
        notBefore: new Date(Date.UTC(2023, 0, 1)),
        notAfter: new Date(Date.UTC(2033, 0, 1)),
      });
      const cert = parseCertificate(der);
      expect(cert.subject.attributes).toHaveLength(2);
      expect(cert.subject.getField('CN')?.value).toBe('Host');
      expect(cert.subject.getField('OU')?.value).toBe('Dev');
    });

    it('decodes DN string types: UTF8, BMP/UTF-16, Printable, IA5/emailAddress', () => {
      const der = makeCert({
        serial: [0x04],
        issuer: [[{oid: OID.CN, tag: TAG.UTF8, value: 'Müller CA'}]],
        subject: [
          [{oid: OID.CN, tag: TAG.UTF8, value: 'Müller'}],
          [{oid: OID.O, tag: TAG.BMP, value: 'Café Ltd'}],
          [{oid: OID.EMAIL, tag: TAG.IA5, value: 'a@b.com'}],
        ],
        notBefore: new Date(Date.UTC(2024, 0, 1)),
        notAfter: new Date(Date.UTC(2034, 0, 1)),
      });
      const cert = parseCertificate(der);
      expect(cert.issuer.getField('CN')?.value).toBe('Müller CA');
      expect(cert.subject.getField('CN')?.value).toBe('Müller');
      expect(cert.subject.getField('O')?.value).toBe('Café Ltd');
      expect(cert.subject.getField('emailAddress')?.value).toBe('a@b.com');
    });

    it('parses diverse DN attributes (C, ST, L, O, OU, CN)', () => {
      const der = makeCert({
        serial: [0x05],
        issuer: [[{oid: OID.O, tag: TAG.PRINTABLE, value: 'Root'}]],
        subject: [
          [{oid: OID.C, tag: TAG.PRINTABLE, value: 'US'}],
          [{oid: OID.ST, tag: TAG.PRINTABLE, value: 'California'}],
          [{oid: OID.L, tag: TAG.PRINTABLE, value: 'San Francisco'}],
          [{oid: OID.O, tag: TAG.PRINTABLE, value: 'Acme'}],
          [{oid: OID.OU, tag: TAG.PRINTABLE, value: 'Eng'}],
          [{oid: OID.CN, tag: TAG.PRINTABLE, value: 'acme.test'}],
        ],
        notBefore: new Date(Date.UTC(2025, 0, 1)),
        notAfter: new Date(Date.UTC(2035, 0, 1)),
      });
      const cert = parseCertificate(der);
      expect(cert.subject.getField('C')?.value).toBe('US');
      expect(cert.subject.getField('ST')?.value).toBe('California');
      expect(cert.subject.getField('L')?.value).toBe('San Francisco');
      expect(cert.subject.getField('O')?.value).toBe('Acme');
      expect(cert.subject.getField('OU')?.value).toBe('Eng');
      expect(cert.subject.getField('CN')?.value).toBe('acme.test');
    });
  });

  describe('fingerprints', () => {
    it('hashes DER bytes with the expected MD5 and SHA-1 values', () => {
      // Independently computed with Python hashlib over the decoded fixture DER.
      const der = extractDerFromPem(certificatePem, false);
      expect(md5(der)).toBe('9E4AC96474245129D9766700412A1F89');
      expect(sha1(der)).toBe('D83C1A7F4D0446BB2081B81A1670F8183451CA24');
    });

    it('produces identical DER for PEM and base64-encoded PEM inputs', () => {
      expect(extractDerFromPem(btoa(certificatePem), true)).toEqual(extractDerFromPem(certificatePem, false));
    });
  });

  describe('input encodings (PEM / raw DER / base64)', () => {
    const logical = () =>
      makeCert({
        serial: [0x09, 0x08, 0x07],
        issuer: [[{oid: OID.CN, tag: TAG.PRINTABLE, value: 'CA'}]],
        subject: [[{oid: OID.CN, tag: TAG.PRINTABLE, value: 'Site'}]],
        notBefore: new Date(Date.UTC(2026, 0, 1)),
        notAfter: new Date(Date.UTC(2036, 0, 1)),
      });

    it('parses the same certificate identically from PEM, raw DER, and base64', () => {
      const der = logical();
      const pem = toPem(der);

      const fromPem = parseCertificateFromPem(pem, false);
      const fromDer = parseCertificate(extractDerFromPem(binaryString(der), false));
      const fromBase64 = parseCertificate(extractDerFromPem(btoa(binaryString(der)), true));

      const expected: X509Certificate = fromPem;
      for (const actual of [fromDer, fromBase64]) {
        expect(actual.serialNumber).toBe(expected.serialNumber);
        expect(actual.subject.getField('CN')?.value).toBe('Site');
        expect(actual.issuer.getField('CN')?.value).toBe('CA');
        expect(actual.validity.notBefore.toISOString()).toBe(expected.validity.notBefore.toISOString());
        expect(actual.validity.notAfter.toISOString()).toBe(expected.validity.notAfter.toISOString());
      }
    });

    it('throws on malformed input', () => {
      expect(() => parseCertificateFromPem('not a certificate', false)).toThrow();
      expect(() => parseCertificate(new Uint8Array([0x30, 0x02, 0x01]))).toThrow();
      expect(() => parseCertificate(new Uint8Array([1, 2, 3, 4]))).toThrow();
      expect(() => parseCertificateFromPem('%%%')).toThrow();
      expect(() => parseCertificateFromPem(btoa('not a certificate'))).toThrow();
    });

    it('throws on truncated or indefinite-length DER instead of mis-parsing it', () => {
      // Content length 5 declared, only 2 bytes present.
      expect(() => parseCertificate(new Uint8Array([0x30, 0x05, 0x01, 0x02]))).toThrow(/truncated/);
      // Long-form length bytes cut off.
      expect(() => parseCertificate(new Uint8Array([0x30, 0x82, 0x01]))).toThrow(/truncated/);
      // Indefinite length (0x80) is forbidden in DER.
      expect(() => parseCertificate(new Uint8Array([0x30, 0x80, 0x01, 0x02]))).toThrow(/indefinite/);
      // Overly long length encoding.
      expect(() => parseCertificate(new Uint8Array([0x30, 0x85, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06]))).toThrow(
        /too large/,
      );
      // A child element that overruns its parent's declared content while fitting the buffer.
      expect(() => parseCertificate(new Uint8Array([0x30, 0x03, 0x30, 0x02, 0x01, 0x00, 0x00]))).toThrow(
        /malformed DER structure/,
      );
    });
  });
});
