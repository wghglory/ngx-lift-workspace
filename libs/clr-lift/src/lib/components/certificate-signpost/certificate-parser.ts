/**
 * Minimal, dependency-free X.509 certificate parsing used by the certificate signpost and validator.
 *
 * This replaces the node-forge dependency. It extracts the fields the library displays and validates:
 * the subject/issuer distinguished names, the validity period, the serial number, and the raw DER
 * bytes used for fingerprinting. It is intentionally narrow: it does not verify signatures, chains,
 * revocation, or trust, mirroring the previous parsing-only contract.
 */

/** A single relative-distinguished-name attribute, e.g. `{ name: 'CN', value: 'example.com' }`. */
export interface CertificateField {
  /** Short attribute name such as `CN`, `O`, `OU`, `C`, `ST`, `L`, or `emailAddress`. */
  name: string;
  /** Decoded attribute value. */
  value: string;
}

/** A distinguished name (subject or issuer) with ordered attributes and a field lookup. */
export interface CertificateName {
  attributes: CertificateField[];
  getField(name: string): CertificateField | undefined;
}

/** Certificate validity window. */
export interface CertificateValidity {
  notBefore: Date;
  notAfter: Date;
}

/** Parsed certificate surface exposed by the library. */
export interface X509Certificate {
  serialNumber: string;
  subject: CertificateName;
  issuer: CertificateName;
  validity: CertificateValidity;
}

const OID_SHORT_NAMES: Record<string, string> = {
  '2.5.4.3': 'CN',
  '2.5.4.4': 'SN',
  '2.5.4.5': 'serialNumber',
  '2.5.4.6': 'C',
  '2.5.4.7': 'L',
  '2.5.4.8': 'ST',
  '2.5.4.9': 'STREET',
  '2.5.4.10': 'O',
  '2.5.4.11': 'OU',
  '2.5.4.12': 'T',
  '2.5.4.42': 'GN',
  '2.5.4.43': 'I',
  '2.5.4.97': 'organizationIdentifier',
  '1.2.840.113549.1.9.1': 'emailAddress',
  '0.9.2342.19200300.100.1.25': 'DC',
  '1.2.840.113549.1.9.2': 'unstructuredName',
};

interface DerNode {
  tag: number;
  value?: Uint8Array;
  children?: DerNode[];
}

function readLength(bytes: Uint8Array, offset: number): {length: number; next: number} {
  const first = bytes[offset];
  if (first < 0x80) {
    return {length: first, next: offset + 1};
  }
  const byteCount = first & 0x7f;
  let length = 0;
  for (let i = 0; i < byteCount; i++) {
    length = (length << 8) | bytes[offset + 1 + i];
  }
  return {length, next: offset + 1 + byteCount};
}

function readNode(bytes: Uint8Array, offset: number): {node: DerNode; next: number} {
  const tag = bytes[offset];
  const {length, next: contentStart} = readLength(bytes, offset + 1);
  const contentEnd = contentStart + length;
  const node: DerNode = {tag};
  if ((tag & 0x20) !== 0) {
    node.children = [];
    let position = contentStart;
    while (position < contentEnd) {
      const child = readNode(bytes, position);
      node.children.push(child.node);
      position = child.next;
    }
  } else {
    node.value = bytes.subarray(contentStart, contentEnd);
  }
  return {node, next: contentEnd};
}

function decodeOid(bytes: Uint8Array): string {
  let result = '';
  let value = 0;
  let first = true;
  for (let i = 0; i < bytes.length; i++) {
    const byte = bytes[i];
    value = (value << 7) | (byte & 0x7f);
    if ((byte & 0x80) === 0) {
      if (first) {
        const arc1 = Math.floor(value / 40);
        const arc2 = value % 40;
        result = `${arc1}.${arc2}`;
        first = false;
      } else {
        result += `.${value}`;
      }
      value = 0;
    }
  }
  return result;
}

function latin1(bytes: Uint8Array): string {
  let result = '';
  for (let i = 0; i < bytes.length; i++) {
    result += String.fromCharCode(bytes[i]);
  }
  return result;
}

function decodeUtf16BigEndian(bytes: Uint8Array): string {
  let result = '';
  for (let i = 0; i + 1 < bytes.length; i += 2) {
    result += String.fromCharCode((bytes[i] << 8) | bytes[i + 1]);
  }
  return result;
}

function decodeUtf32BigEndian(bytes: Uint8Array): string {
  let result = '';
  for (let i = 0; i + 3 < bytes.length; i += 4) {
    const codePoint = (bytes[i] << 24) | (bytes[i + 1] << 16) | (bytes[i + 2] << 8) | bytes[i + 3];
    result += String.fromCodePoint(codePoint);
  }
  return result;
}

function decodeString(tag: number, bytes: Uint8Array): string {
  switch (tag) {
    case 0x0c: // UTF8String
      return new TextDecoder('utf-8').decode(bytes);
    case 0x1e: // BMPString (UTF-16 BE)
      return decodeUtf16BigEndian(bytes);
    case 0x1c: // UniversalString (UTF-32 BE)
      return decodeUtf32BigEndian(bytes);
    case 0x13: // PrintableString
    case 0x14: // T61String / TeletexString
    case 0x16: // IA5String
    case 0x1a: // VisibleString / ISO646String
    case 0x1b: // GeneralString
    case 0x12: // NumericString
    case 0x1d: // GraphicString
    default:
      return latin1(bytes);
  }
}

function parseTimeNode(node: DerNode): Date {
  if (!node.value) {
    throw new Error('Invalid certificate: missing time value');
  }
  const raw = latin1(node.value);
  // Keep only the leading digit run; ignore fractional seconds and any timezone offset.
  const match = raw.match(/^(\d+)(?:\.\d+)?/);
  const digits = match ? match[1] : '';
  if (node.tag === 0x17) {
    // UTCTime: YYMMDDHHMMSS
    if (digits.length < 12) {
      throw new Error('Invalid certificate: malformed UTCTime');
    }
    const year = parseInt(digits.slice(0, 2), 10);
    const fullYear = year >= 50 ? 1900 + year : 2000 + year;
    return new Date(
      Date.UTC(
        fullYear,
        parseInt(digits.slice(2, 4), 10) - 1,
        parseInt(digits.slice(4, 6), 10),
        parseInt(digits.slice(6, 8), 10),
        parseInt(digits.slice(8, 10), 10),
        parseInt(digits.slice(10, 12), 10),
      ),
    );
  }
  // GeneralizedTime: YYYYMMDDHHMMSS
  if (digits.length < 14) {
    throw new Error('Invalid certificate: malformed GeneralizedTime');
  }
  return new Date(
    Date.UTC(
      parseInt(digits.slice(0, 4), 10),
      parseInt(digits.slice(4, 6), 10) - 1,
      parseInt(digits.slice(6, 8), 10),
      parseInt(digits.slice(8, 10), 10),
      parseInt(digits.slice(10, 12), 10),
      parseInt(digits.slice(12, 14), 10),
    ),
  );
}

function hexOf(bytes: Uint8Array): string {
  let result = '';
  for (let i = 0; i < bytes.length; i++) {
    result += bytes[i].toString(16).padStart(2, '0');
  }
  return result;
}

function parseName(node: DerNode): CertificateName {
  const attributes: CertificateField[] = [];
  for (const relativeDistinguishedName of node.children ?? []) {
    for (const attributeTypeAndValue of relativeDistinguishedName.children ?? []) {
      const children = attributeTypeAndValue.children;
      if (!children || children.length < 2) {
        continue;
      }
      const oidNode = children[0];
      const valueNode = children[1];
      if (!oidNode.value || !valueNode.value) {
        continue;
      }
      const oid = decodeOid(oidNode.value);
      const name = OID_SHORT_NAMES[oid] ?? oid;
      attributes.push({name, value: decodeString(valueNode.tag, valueNode.value)});
    }
  }
  return {
    attributes,
    getField(name: string): CertificateField | undefined {
      return attributes.find((attribute) => attribute.name === name);
    },
  };
}

/** Decodes the base64 body of an armored PEM string into raw DER bytes. */
function base64ToBytes(base64: string): Uint8Array {
  const clean = base64.replace(/[^A-Za-z0-9+/=]/g, '');
  const binary = atob(clean);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Converts a PEM string into DER bytes.
 *
 * @param pem - The certificate as a PEM string or, when `pemEncoded` is true, its base64 encoding.
 * @param pemEncoded - When true, `pem` is treated as base64 (the inverse of `btoa`); otherwise it is
 *   treated as PEM text. In both documented cases the decoded value is PEM text, so the armored body
 *   is extracted. A raw (already-DER) binary string is passed through unchanged.
 */
export function extractDerFromPem(pem: string, pemEncoded = true): Uint8Array {
  const decoded = pemEncoded ? atob(pem) : pem;
  const armored = decoded.match(/-----BEGIN[^-]*-----([\s\S]*?)-----END[^-]*-----/);
  if (armored) {
    return base64ToBytes(armored[1]);
  }
  const bytes = new Uint8Array(decoded.length);
  for (let i = 0; i < decoded.length; i++) {
    bytes[i] = decoded.charCodeAt(i);
  }
  return bytes;
}

/** Parses DER-encoded certificate bytes into the library's {@link X509Certificate} shape. */
export function parseCertificate(der: Uint8Array): X509Certificate {
  const top = readNode(der, 0).node;
  if (top.tag !== 0x30 || !top.children || top.children.length < 1) {
    throw new Error('Invalid certificate: expected a SEQUENCE');
  }
  const tbs = top.children[0];
  if (tbs.tag !== 0x30 || !tbs.children) {
    throw new Error('Invalid certificate: expected a TBSCertificate SEQUENCE');
  }

  let index = 0;
  // [0] EXPLICIT version is optional and only present for v2/v3 certificates.
  if (tbs.children[index].tag === 0xa0) {
    index++;
  }
  const serialNode = tbs.children[index++];
  if (!serialNode.value) {
    throw new Error('Invalid certificate: missing serial number');
  }
  const serialNumber = hexOf(serialNode.value);
  index++; // signature algorithm
  const issuerNode = tbs.children[index++];
  const validityNode = tbs.children[index++];
  const subjectNode = tbs.children[index++];

  if (!issuerNode.children || !validityNode.children || validityNode.children.length < 2 || !subjectNode.children) {
    throw new Error('Invalid certificate: malformed issuer, validity, or subject');
  }

  return {
    serialNumber,
    issuer: parseName(issuerNode),
    subject: parseName(subjectNode),
    validity: {
      notBefore: parseTimeNode(validityNode.children[0]),
      notAfter: parseTimeNode(validityNode.children[1]),
    },
  };
}

/**
 * Parses a PEM certificate string directly.
 *
 * @see extractDerFromPem for the `pemEncoded` contract.
 */
export function parseCertificateFromPem(pem: string, pemEncoded = true): X509Certificate {
  return parseCertificate(extractDerFromPem(pem, pemEncoded));
}
