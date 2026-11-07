/**
 * Test-support DER builder for synthetic X.509 certificates.
 *
 * Signatures and public keys are dummy values: the library only parses certificates, so the
 * structural fields (version, serial, issuer, validity, subject) are what these fixtures control.
 * Not exported from the public API.
 */

export const OID = {
  CN: '2.5.4.3',
  L: '2.5.4.7',
  ST: '2.5.4.8',
  O: '2.5.4.10',
  OU: '2.5.4.11',
  C: '2.5.4.6',
  EMAIL: '1.2.840.113549.1.9.1',
};

export const TAG = {UTF8: 0x0c, BMP: 0x1e, PRINTABLE: 0x13, IA5: 0x16} as const;

function flatten(input: (number | number[])[]): number[] {
  const out: number[] = [];
  for (const item of input) {
    if (Array.isArray(item)) {
      out.push(...flatten(item));
    } else {
      out.push(item);
    }
  }
  return out;
}

function tlv(tag: number, content: (number | number[])[]): number[] {
  const bytes = flatten(content);
  const length = bytes.length;
  const lenBytes: number[] = [];
  if (length < 0x80) {
    lenBytes.push(length);
  } else {
    const tmp: number[] = [];
    let n = length;
    while (n > 0) {
      tmp.unshift(n & 0xff);
      n >>= 8;
    }
    lenBytes.push(0x80 | tmp.length, ...tmp);
  }
  return [tag, ...lenBytes, ...bytes];
}

const SEQUENCE = (content: (number | number[])[]): number[] => tlv(0x30, content);
const SET = (content: (number | number[])[]): number[] => tlv(0x31, content);

function ascii(s: string): number[] {
  const out: number[] = [];
  for (let i = 0; i < s.length; i++) {
    out.push(s.charCodeAt(i) & 0xff);
  }
  return out;
}

function bmp(s: string): number[] {
  const out: number[] = [];
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    out.push((c >> 8) & 0xff, c & 0xff);
  }
  return out;
}

function encodeOid(dotted: string): number[] {
  const parts = dotted.split('.').map(Number);
  const body: number[] = [parts[0] * 40 + parts[1]];
  for (let i = 2; i < parts.length; i++) {
    let v = parts[i];
    const out: number[] = [];
    out.unshift(v & 0x7f);
    v >>= 7;
    while (v > 0) {
      out.unshift((v & 0x7f) | 0x80);
      v >>= 7;
    }
    body.push(...out);
  }
  return body;
}

export interface AttrSpec {
  oid: string;
  tag: number;
  value: string;
}
export type Rdn = AttrSpec[];

function attr(at: AttrSpec): number[] {
  const valueBytes =
    at.tag === TAG.UTF8
      ? [...new TextEncoder().encode(at.value)]
      : at.tag === TAG.BMP
        ? bmp(at.value)
        : ascii(at.value);
  return SEQUENCE([...tlv(0x06, encodeOid(at.oid)), ...tlv(at.tag, valueBytes)]);
}

function rdn(attrs: AttrSpec[]): number[] {
  return SET(attrs.flatMap(attr));
}

function name(rdns: Rdn[]): number[] {
  return SEQUENCE(rdns.flatMap(rdn));
}

function utcTime(d: Date): number[] {
  const s = d.toISOString().slice(0, 19).replace(/[-:T]/g, '').slice(2) + 'Z';
  return tlv(0x17, ascii(s));
}

function genTime(d: Date): number[] {
  const s = d.toISOString().slice(0, 19).replace(/[-:T]/g, '') + 'Z';
  return tlv(0x18, ascii(s));
}

function signatureAlgorithm(): number[] {
  return SEQUENCE([tlv(0x06, encodeOid('1.2.840.113549.1.1.11'))]);
}

function spki(): number[] {
  return SEQUENCE([SEQUENCE([tlv(0x06, encodeOid('1.2.840.10045.2.1'))]), tlv(0x03, [0x00, ...ascii('publickey')])]);
}

/** Builds a synthetic certificate as raw DER bytes. */
export function makeCert(opts: {
  version?: number;
  serial: number[];
  issuer: Rdn[];
  subject: Rdn[];
  notBefore: Date;
  notAfter: Date;
  timeTag?: number;
  extensions?: number[];
}): Uint8Array {
  const timeTag = opts.timeTag ?? 0x17;
  const tbsParts: number[][] = [];
  if (opts.version !== undefined) {
    tbsParts.push(tlv(0xa0, tlv(0x02, [opts.version])));
  }
  tbsParts.push(tlv(0x02, opts.serial));
  tbsParts.push(signatureAlgorithm());
  tbsParts.push(name(opts.issuer));
  const t1 = timeTag === 0x17 ? utcTime(opts.notBefore) : genTime(opts.notBefore);
  const t2 = timeTag === 0x17 ? utcTime(opts.notAfter) : genTime(opts.notAfter);
  tbsParts.push(SEQUENCE([t1, t2]));
  tbsParts.push(name(opts.subject));
  tbsParts.push(spki());
  if (opts.extensions) {
    tbsParts.push(tlv(0xa3, SEQUENCE(opts.extensions)));
  }
  const tbs = SEQUENCE(tbsParts.flat());
  const cert = SEQUENCE([...tbs, ...signatureAlgorithm(), ...tlv(0x03, [0x00, ...ascii('signature')])]);
  return new Uint8Array(cert);
}

/** Converts raw DER bytes into a single-line armored PEM string. */
export function toPem(der: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < der.length; i++) {
    binary += String.fromCharCode(der[i]);
  }
  return `-----BEGIN CERTIFICATE-----\n${btoa(binary)}\n-----END CERTIFICATE-----`;
}

/** Converts raw DER bytes into a binary string, e.g. for `btoa` or raw-DER parser input. */
export function binaryString(der: Uint8Array): string {
  let s = '';
  for (let i = 0; i < der.length; i++) {
    s += String.fromCharCode(der[i]);
  }
  return s;
}
