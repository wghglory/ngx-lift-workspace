import {extractDerFromPem, md5, parseCertificate, pemEncodeDer, sha1, sha256, X509Certificate} from 'clr-lift';

/** Fingerprint set computed over the DER bytes of one certificate. */
export interface CertificateDigests {
  md5: string;
  sha1: string;
  sha256: string;
}

/** Everything a minimal custom certificate viewer needs, computed with the public clr-lift utilities. */
export interface CertificateView {
  certificate: X509Certificate;
  digests: CertificateDigests;
  pem: string;
}

/** One parsed certificate of a PEM chain together with its DER bytes and fingerprints. */
export interface ParsedChainEntry {
  certificate: X509Certificate;
  digests: CertificateDigests;
}

/**
 * Hierarchy of a parsed chain, mirroring the dsm-ui trust-certificate tree: the trust anchor is the
 * root node and every issued certificate is nested below its issuer. Nodes are named after the
 * common name, falling back to the organization name.
 */
export interface CertificateHierarchyNode {
  name: string;
  certificate: X509Certificate;
  digests: CertificateDigests;
  children: CertificateHierarchyNode[];
}

/** Runs the public parse, digest and re-encode utilities after their chunk has been requested. */
export function buildCertificateView(pem: string): CertificateView {
  const der = extractDerFromPem(pem, false);
  return {
    certificate: parseCertificate(der),
    digests: {md5: md5(der), sha1: sha1(der), sha256: sha256(der)},
    pem: pemEncodeDer(der),
  };
}

/**
 * Splits a PEM string that may contain several certificates into single blocks with linear scans,
 * keeping the input order (leaf first, trust anchor last, as distributed).
 */
export function splitPemBlocks(pem: string): string[] {
  const beginMarker = '-----BEGIN CERTIFICATE-----';
  const endMarker = '-----END CERTIFICATE-----';
  const blocks: string[] = [];
  let index = pem.indexOf(beginMarker);
  while (index !== -1) {
    const end = pem.indexOf(endMarker, index);
    if (end === -1) {
      break;
    }
    blocks.push(pem.slice(index, end + endMarker.length));
    index = pem.indexOf(beginMarker, end + endMarker.length);
  }
  return blocks;
}

/** Parses every certificate block of a chain input, keyed to its DER fingerprints. */
export function parseCertificateChain(pem: string): ParsedChainEntry[] {
  return splitPemBlocks(pem).map((block) => {
    const der = extractDerFromPem(block, false);
    return {
      certificate: parseCertificate(der),
      digests: {md5: md5(der), sha1: sha1(der), sha256: sha256(der)},
    };
  });
}

/**
 * Builds the nested issuer hierarchy from a parsed chain the same way dsm-ui's
 * buildCertificateHierarchy does: reverse to anchor-first, name by common name with an
 * organization fallback, and nest every next certificate under its issuer.
 */
export function buildCertificateHierarchy(entries: ParsedChainEntry[]): CertificateHierarchyNode | null {
  const chain = [...entries].reverse();
  if (!chain.length) {
    return null;
  }
  const nodeName = (entry: ParsedChainEntry): string =>
    entry.certificate.subject.getField('CN')?.value ?? entry.certificate.subject.getField('O')?.value ?? '-';
  const root: CertificateHierarchyNode = {
    name: nodeName(chain[0]),
    certificate: chain[0].certificate,
    digests: chain[0].digests,
    children: [],
  };
  let current = root;
  for (let i = 1; i < chain.length; i++) {
    const node: CertificateHierarchyNode = {
      name: nodeName(chain[i]),
      certificate: chain[i].certificate,
      digests: chain[i].digests,
      children: [],
    };
    current.children = [node];
    current = node;
  }
  return root;
}
