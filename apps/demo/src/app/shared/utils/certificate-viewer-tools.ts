import {extractDerFromPem, md5, parseCertificate, pemEncodeDer, sha1, sha256, X509Certificate} from 'clr-lift';

/** Everything a minimal custom certificate viewer needs, computed with the public clr-lift utilities. */
export interface CertificateView {
  certificate: X509Certificate;
  digests: {md5: string; sha1: string; sha256: string};
  pem: string;
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
