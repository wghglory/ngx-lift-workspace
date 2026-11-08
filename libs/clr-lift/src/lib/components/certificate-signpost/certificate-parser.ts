/**
 * Minimal, dependency-free X.509 certificate parsing used by the certificate signpost and validator.
 *
 * This replaces the node-forge dependency. It extracts the fields the library displays and validates:
 * the subject/issuer distinguished names, the validity period, the serial number, the signature
 * algorithm OID, the subjectAltName and subjectKeyIdentifier extensions, and the raw DER bytes used
 * for fingerprinting. It is intentionally narrow and key-algorithm agnostic (RSA, ECDSA, Ed25519 and
 * other certificates parse identically): it does not verify signatures, chains, revocation, or
 * trust, mirroring the previous parsing-only contract.
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

/** One entry of the subjectAltName extension. */
export interface GeneralName {
  /** Kind of name: `dns`, `uri`, `email`, `ip`, or `directoryName`. */
  type: 'dns' | 'uri' | 'email' | 'ip' | 'directoryName';
  /** Decoded value; IP addresses render as dotted quad (IPv4) or colon-separated hex (IPv6). */
  value: string;
}

/** Parsed certificate surface exposed by the library. */
export interface X509Certificate {
  serialNumber: string;
  subject: CertificateName;
  issuer: CertificateName;
  validity: CertificateValidity;
  /** Dotted OID of the signature algorithm, e.g. `1.2.840.113549.1.1.11` (RSA with SHA-256). */
  signatureAlgorithm: string;
  /** subjectAltName entries when the extension (2.5.29.17) is present. */
  subjectAltName?: GeneralName[];
  /** subjectKeyIdentifier as lowercase hex when the extension (2.5.29.14) is present. */
  subjectKeyIdentifier?: string;
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
  if (first === undefined) {
    throw new Error('Invalid certificate: truncated DER');
  }
  if (first < 0x80) {
    return {length: first, next: offset + 1};
  }
  const byteCount = first & 0x7f;
  if (byteCount === 0) {
    throw new Error('Invalid certificate: indefinite lengths are not allowed in DER');
  }
  if (byteCount > 4) {
    throw new Error('Invalid certificate: DER length is too large');
  }
  let length = 0;
  for (let i = 0; i < byteCount; i++) {
    const byte = bytes[offset + 1 + i];
    if (byte === undefined) {
      throw new Error('Invalid certificate: truncated DER');
    }
    length = (length << 8) | byte;
  }
  return {length, next: offset + 1 + byteCount};
}

function readNode(bytes: Uint8Array, offset: number): {node: DerNode; next: number} {
  const tag = bytes[offset];
  if (tag === undefined) {
    throw new Error('Invalid certificate: truncated DER');
  }
  const {length, next: contentStart} = readLength(bytes, offset + 1);
  const contentEnd = contentStart + length;
  if (contentEnd > bytes.length) {
    throw new Error('Invalid certificate: truncated DER');
  }
  const node: DerNode = {tag};
  if ((tag & 0x20) !== 0) {
    node.children = [];
    let position = contentStart;
    while (position < contentEnd) {
      const child = readNode(bytes, position);
      if (child.next > contentEnd) {
        throw new Error('Invalid certificate: malformed DER structure');
      }
      node.children.push(child.node);
      position = child.next;
    }
  } else {
    node.value = bytes.subarray(contentStart, contentEnd);
  }
  return {node, next: contentEnd};
}

/** Reads one DER TLV and rejects any bytes left after it; a DER buffer holds exactly one value. */
function readSingleNode(bytes: Uint8Array): DerNode {
  const {node, next} = readNode(bytes, 0);
  if (next !== bytes.length) {
    throw new Error('Invalid certificate: unexpected trailing DER bytes');
  }
  return node;
}

/** Splits the X.690 first subidentifier (40 * arc1 + arc2) into its two arcs. */
function firstOidArcs(value: number): [number, number] {
  if (value < 40) {
    return [0, value];
  }
  if (value < 80) {
    return [1, value - 40];
  }
  return [2, value - 80];
}

function decodeOid(bytes: Uint8Array): string {
  let result = '';
  let value = 0;
  let first = true;
  for (let i = 0; i < bytes.length; i++) {
    const byte = bytes[i];
    value = value * 128 + (byte & 0x7f);
    if (!Number.isSafeInteger(value)) {
      throw new Error('Invalid certificate: malformed DER structure');
    }
    if ((byte & 0x80) === 0) {
      if (first) {
        // X.690 encodes the first subidentifier as 40 * arc1 + arc2, with arc1 capped at 2.
        const [arc1, arc2] = firstOidArcs(value);
        result = `${arc1}.${arc2}`;
        first = false;
      } else {
        result += `.${value}`;
      }
      value = 0;
    }
  }
  if (first || value !== 0) {
    throw new Error('Invalid certificate: malformed DER structure');
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
  const match = raw.match(/^(\d+)(?:\.\d+)?(Z|[+-]\d{2}(?:\d{2})?)?$/);
  if (!match) {
    throw new Error('Invalid certificate: malformed time value');
  }
  const digits = match[1];
  let timestamp: number;
  if (node.tag === 0x17) {
    // UTCTime: YYMMDDHHMMSS
    if (digits.length < 12) {
      throw new Error('Invalid certificate: malformed UTCTime');
    }
    const year = parseInt(digits.slice(0, 2), 10);
    const fullYear = year >= 50 ? 1900 + year : 2000 + year;
    timestamp = Date.UTC(
      fullYear,
      parseInt(digits.slice(2, 4), 10) - 1,
      parseInt(digits.slice(4, 6), 10),
      parseInt(digits.slice(6, 8), 10),
      parseInt(digits.slice(8, 10), 10),
      parseInt(digits.slice(10, 12), 10),
    );
  } else {
    // GeneralizedTime: YYYYMMDDHHMMSS
    if (digits.length < 14) {
      throw new Error('Invalid certificate: malformed GeneralizedTime');
    }
    timestamp = Date.UTC(
      parseInt(digits.slice(0, 4), 10),
      parseInt(digits.slice(4, 6), 10) - 1,
      parseInt(digits.slice(6, 8), 10),
      parseInt(digits.slice(8, 10), 10),
      parseInt(digits.slice(10, 12), 10),
      parseInt(digits.slice(12, 14), 10),
    );
  }
  const zone = match[2];
  if (zone && zone !== 'Z') {
    // A numeric offset marks local time; UTC is the local time minus the offset.
    const hours = parseInt(zone.slice(1, 3), 10);
    const minutes = zone.length >= 5 ? parseInt(zone.slice(3, 5), 10) : 0;
    const offsetMs = (hours * 60 + minutes) * 60_000;
    timestamp += zone[0] === '+' ? -offsetMs : offsetMs;
  }
  return new Date(timestamp);
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
 * Extracts the base64 body between the PEM armor markers with linear string scans.
 *
 * Marker matching is done with `indexOf` rather than a regular expression so hostile input
 * (for example many repeated `-----BEGIN-----a` sequences) cannot trigger polynomial
 * backtracking.
 */
function extractArmoredBody(decoded: string): string | undefined {
  const beginMarker = '-----BEGIN';
  const begin = decoded.indexOf(beginMarker);
  if (begin === -1) {
    return undefined;
  }
  // The BEGIN label is followed by its own `-----` delimiter before the base64 body starts.
  const bodyStart = decoded.indexOf('-----', begin + beginMarker.length);
  if (bodyStart === -1) {
    return undefined;
  }
  const endMarker = '-----END';
  const end = decoded.indexOf(endMarker, bodyStart + 5);
  if (end === -1) {
    return undefined;
  }
  return decoded.slice(bodyStart + 5, end);
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
  const armored = extractArmoredBody(decoded);
  if (armored !== undefined) {
    return base64ToBytes(armored);
  }
  const bytes = new Uint8Array(decoded.length);
  for (let i = 0; i < decoded.length; i++) {
    bytes[i] = decoded.charCodeAt(i);
  }
  return bytes;
}

/**
 * Encodes DER bytes as an armored PEM string with 64-character base64 lines.
 *
 * The inverse of {@link extractDerFromPem} for DER input: `extractDerFromPem(pemEncodeDer(der))`
 * returns bytes equal to `der`. Use a different `label` (for example `PRIVATE KEY`) when arming
 * non-certificate content; the label is opaque to this function.
 */
export function pemEncodeDer(der: Uint8Array, label = 'CERTIFICATE'): string {
  let binary = '';
  for (let i = 0; i < der.length; i++) {
    binary += String.fromCharCode(der[i]);
  }
  const base64 = btoa(binary)
    .replace(/(.{64})/g, '$1\n')
    .replace(/\n$/, '');
  return `-----BEGIN ${label}-----\n${base64}\n-----END ${label}-----\n`;
}

/** Parses the subjectAltName (2.5.29.17) extension content into {@link GeneralName} entries. */
function parseGeneralNames(content: Uint8Array): GeneralName[] {
  const names: GeneralName[] = [];
  for (const entry of readSingleNode(content).children ?? []) {
    // directoryName [4] is the only constructed GeneralName; every other tag carries a value.
    if (entry.tag === 0xa4) {
      const nameNode = (entry.children ?? [])[0];
      if (nameNode) {
        const dn = parseName(nameNode)
          .attributes.map((attribute) => `${attribute.name}=${attribute.value}`)
          .join(', ');
        names.push({type: 'directoryName', value: dn});
      }
      continue;
    }
    const value = entry.value;
    if (!value) {
      continue;
    }
    if (entry.tag === 0x82) {
      names.push({type: 'dns', value: latin1(value)});
    } else if (entry.tag === 0x81) {
      names.push({type: 'email', value: latin1(value)});
    } else if (entry.tag === 0x86) {
      names.push({type: 'uri', value: latin1(value)});
    } else if (entry.tag === 0x87) {
      // iPAddress carries exactly 4 (IPv4) or 16 (IPv6) bytes; other lengths are malformed and skipped.
      if (value.length === 4) {
        names.push({type: 'ip', value: Array.from(value).join('.')});
      } else if (value.length === 16) {
        const groups: string[] = [];
        for (let i = 0; i < value.length; i += 2) {
          groups.push(((value[i] << 8) | value[i + 1]).toString(16).padStart(4, '0'));
        }
        names.push({type: 'ip', value: groups.join(':')});
      }
    }
  }
  return names;
}

/** Extracts the SAN and SKI extensions when present in the TBSCertificate [3] block. */
function parseExtensions(tbs: DerNode): {subjectAltName?: GeneralName[]; subjectKeyIdentifier?: string} {
  const result: {subjectAltName?: GeneralName[]; subjectKeyIdentifier?: string} = {};
  const extensionsNode = (tbs.children ?? []).find((child) => child.tag === 0xa3);
  for (const extension of extensionsNode?.children?.[0]?.children ?? []) {
    const fields = extension.children;
    if (!fields || fields.length < 2 || !fields[0].value) {
      continue;
    }
    const oid = decodeOid(fields[0].value);
    // The last field is the extnValue OCTET STRING; an optional critical BOOLEAN precedes it.
    const valueNode = fields[fields.length - 1];
    if (!valueNode.value) {
      continue;
    }
    if (oid === '2.5.29.17') {
      result.subjectAltName = parseGeneralNames(valueNode.value);
    } else if (oid === '2.5.29.14') {
      // The SKI extnValue wraps the key identifier in another OCTET STRING.
      const keyIdentifier = readSingleNode(valueNode.value);
      if (keyIdentifier.value) {
        result.subjectKeyIdentifier = hexOf(keyIdentifier.value);
      }
    }
  }
  return result;
}

/** Parses DER-encoded certificate bytes into the library's {@link X509Certificate} shape. */
export function parseCertificate(der: Uint8Array): X509Certificate {
  const top = readSingleNode(der);
  if (top.tag !== 0x30 || !top.children || top.children.length < 1) {
    throw new Error('Invalid certificate: expected a SEQUENCE');
  }
  const tbs = top.children[0];
  if (tbs.tag !== 0x30 || !tbs.children) {
    throw new Error('Invalid certificate: expected a TBSCertificate SEQUENCE');
  }

  const signatureAlgorithmNode = top.children[1]?.children?.[0];
  if (!signatureAlgorithmNode?.value) {
    throw new Error('Invalid certificate: missing signature algorithm');
  }
  const signatureAlgorithm = decodeOid(signatureAlgorithmNode.value);

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
    signatureAlgorithm,
    ...parseExtensions(tbs),
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
