import {createHash} from 'node:crypto';
import {describe, expect, it} from 'vitest';

import {md5, sha1, sha256} from './certificate-crypto';
import {certificatePem, digiCertPem} from './certificate.fixture';
import {ascii, binaryString, encodeOid, makeCert, OID, TAG, tlv, toPem} from './certificate-der-fixture';
import {
  extractDerFromPem,
  parseCertificate,
  parseCertificateFromPem,
  pemEncodeDer,
  X509Certificate,
} from './certificate-parser';

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

  describe('algorithms and extensions (downstream consumer alignment)', () => {
    const base = () => ({
      serial: [0x0a],
      issuer: [[{oid: OID.CN, tag: TAG.PRINTABLE, value: 'CA'}]],
      subject: [[{oid: OID.CN, tag: TAG.PRINTABLE, value: 'Site'}]],
      notBefore: new Date(Date.UTC(2026, 0, 1)),
      notAfter: new Date(Date.UTC(2036, 0, 1)),
    });

    it('exposes the signature algorithm OID for RSA and ECDSA certificates', () => {
      const rsa = parseCertificate(makeCert({...base(), signatureAlgorithmOid: '1.2.840.113549.1.1.11'}));
      expect(rsa.signatureAlgorithm).toBe('1.2.840.113549.1.1.11');

      const ecdsa = parseCertificate(makeCert({...base(), signatureAlgorithmOid: '1.2.840.10045.4.3.2'}));
      expect(ecdsa.signatureAlgorithm).toBe('1.2.840.10045.4.3.2');
    });

    it('reads the signature algorithm from the real fixtures', () => {
      expect(parseCertificateFromPem(certificatePem, false).signatureAlgorithm).toBe('1.2.840.113549.1.1.5');
      expect(parseCertificateFromPem(digiCertPem, false).signatureAlgorithm).toBe('1.2.840.113549.1.1.11');
    });

    it('decodes X.690 first subidentifiers with a large second arc', () => {
      expect(encodeOid('2.100.3')).toEqual([0x81, 0x34, 0x03]);
      for (const oid of ['0.39.7', '1.39.7', '2.100.3', '2.999.1']) {
        expect(parseCertificate(makeCert({...base(), signatureAlgorithmOid: oid})).signatureAlgorithm).toBe(oid);
      }
    });

    it('rejects empty and unterminated base-128 OID subidentifiers', () => {
      const seq = (content: number[]) => tlv(0x30, content);
      const atv = seq([...tlv(0x06, encodeOid(OID.CN)), ...tlv(0x13, ascii('x'))]);
      const name = seq([...tlv(0x31, atv)]);
      const validity = seq([...tlv(0x17, ascii('260101000000Z')), ...tlv(0x17, ascii('360101000000Z'))]);
      const tbs = seq([...tlv(0x02, [0x01]), ...seq([...tlv(0x06, [])]), ...name, ...validity, ...name]);
      const emptyOid = seq([...tbs, ...seq([...tlv(0x06, [])]), ...tlv(0x03, [0x00])]);
      expect(() => parseCertificate(new Uint8Array(emptyOid))).toThrow(/malformed DER structure/);

      const unterminated = seq([...tbs, ...seq([...tlv(0x06, [0x81])]), ...tlv(0x03, [0x00])]);
      expect(() => parseCertificate(new Uint8Array(unterminated))).toThrow(/malformed DER structure/);
    });

    it('parses subjectAltName and subjectKeyIdentifier extensions when present', () => {
      // directoryName [4] is constructed: a full Name (RDNSequence), not a primitive string.
      const directoryName = tlv(0xa4, [
        tlv(0x30, [tlv(0x31, [tlv(0x30, [tlv(0x06, encodeOid('2.5.4.3')), tlv(0x0c, ascii('Dir Example'))])])]),
      ]);
      const sanExtension = tlv(0x30, [
        tlv(0x06, encodeOid('2.5.29.17')),
        tlv(0x04, [
          tlv(0x30, [
            tlv(0x82, ascii('www.example.com')),
            tlv(0x81, ascii('a@b.com')),
            tlv(0x86, ascii('https://example.com')),
            tlv(0x87, [192, 168, 1, 7]),
            directoryName,
          ]),
        ]),
      ]);
      const skiExtension = tlv(0x30, [
        tlv(0x06, encodeOid('2.5.29.14')),
        tlv(0x04, tlv(0x04, [0x01, 0x02, 0x03, 0x04])),
      ]);
      const der = makeCert({
        ...base(),
        version: 2,
        extensions: [sanExtension, skiExtension],
      });

      const cert = parseCertificate(der);
      expect(cert.subjectAltName).toEqual([
        {type: 'dns', value: 'www.example.com'},
        {type: 'email', value: 'a@b.com'},
        {type: 'uri', value: 'https://example.com'},
        {type: 'ip', value: '192.168.1.7'},
        {type: 'directoryName', value: 'CN=Dir Example'},
      ]);
      expect(cert.subjectKeyIdentifier).toBe('01020304');
    });

    it('renders valid IPv4/IPv6 entries and skips malformed iPAddress bytes', () => {
      const ipv6 = [0x20, 0x01, 0x0d, 0xb8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
      const sanExtension = tlv(0x30, [
        tlv(0x06, encodeOid('2.5.29.17')),
        tlv(0x04, tlv(0x30, [tlv(0x87, [10, 0, 0, 1, 2]), tlv(0x87, [192, 168, 1, 7]), tlv(0x87, ipv6)])),
      ]);
      const cert = parseCertificate(makeCert({...base(), version: 2, extensions: [sanExtension]}));
      expect(cert.subjectAltName).toEqual([
        {type: 'ip', value: '192.168.1.7'},
        {type: 'ip', value: '2001:0db8:0000:0000:0000:0000:0000:0001'},
      ]);
    });

    it('rejects trailing DER bytes inside an extension value', () => {
      const sanExtension = tlv(0x30, [
        tlv(0x06, encodeOid('2.5.29.17')),
        tlv(0x04, [...tlv(0x30, [tlv(0x82, ascii('www.example.com'))]), 0x00]),
      ]);
      expect(() => parseCertificate(makeCert({...base(), version: 2, extensions: [sanExtension]}))).toThrow(
        /unexpected trailing DER bytes/,
      );
    });

    it('computes SHA-256 fingerprints matching the platform implementation', () => {
      const der = extractDerFromPem(certificatePem, false);
      expect(sha256(der)).toBe(createHash('sha256').update(der).digest('hex').toUpperCase());
      expect(sha256(der)).toMatch(/^[0-9A-F]{64}$/);
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

    it('extracts the armored body in linear time on hostile marker input', () => {
      // The CodeQL polynomial-ReDoS shape: ambiguous BEGIN/END markers repeated thousands of times.
      const hostile = `-----BEGIN--------BEGIN-----${'-----BEGIN-----a'.repeat(50_000)}-----END-----a`.repeat(2);
      const started = performance.now();
      try {
        extractDerFromPem(hostile, false);
      } catch {
        // The extracted pseudo-body is not valid base64; the point is that scanning must not hang.
      }
      // Well under a second; the quadratic regex version took far longer on this shape.
      expect(performance.now() - started).toBeLessThan(1000);
    });

    it('ignores armor markers that never complete and parses real armor', () => {
      const incomplete = '-----BEGIN CERTIFICATE----- no end marker';
      expect(extractDerFromPem(incomplete, false).length).toBe(incomplete.length);
      const body = '-----BEGIN CERTIFICATE-----\nYWJj\n-----END CERTIFICATE-----\n';
      expect(Array.from(extractDerFromPem(body, false))).toEqual([0x61, 0x62, 0x63]);
    });

    it('re-encodes the fixture DER to exactly the fixture PEM', () => {
      const der = extractDerFromPem(certificatePem, false);
      expect(pemEncodeDer(der).trim()).toBe(certificatePem.trim());
    });

    it('round-trips arbitrary DER through pemEncodeDer and extractDerFromPem', () => {
      const der = extractDerFromPem(digiCertPem, false);
      const pem = pemEncodeDer(der);
      expect(extractDerFromPem(pem, false)).toEqual(der);
      const bodyLines = pem.split('\n').slice(1, -2);
      expect(bodyLines.length).toBeGreaterThan(0);
      expect(bodyLines.every((line) => line.length > 0 && line.length <= 64)).toBe(true);
    });

    it('encodes with a custom armor label', () => {
      const der = extractDerFromPem(digiCertPem, false);
      const pem = pemEncodeDer(der, 'PRIVATE KEY');
      expect(pem.startsWith('-----BEGIN PRIVATE KEY-----\n')).toBe(true);
      expect(pem.endsWith('\n-----END PRIVATE KEY-----\n')).toBe(true);
      expect(extractDerFromPem(pem, false)).toEqual(der);
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

    it('rejects trailing DER bytes while ignoring text after the PEM END marker', () => {
      const der = extractDerFromPem(certificatePem, false);
      const trailing = new Uint8Array([...der, 0xde, 0xad, 0xbe, 0xef]);
      expect(() => parseCertificate(trailing)).toThrow(/unexpected trailing DER bytes/);
      expect(() => parseCertificateFromPem(toPem(trailing), false)).toThrow(/unexpected trailing DER bytes/);

      const framed = `${certificatePem.trim()}\nordinary PEM framing after the END marker`;
      expect(parseCertificateFromPem(framed, false).subject.getField('CN')?.value).toBe('Google Internet Authority G2');
    });
  });
});
