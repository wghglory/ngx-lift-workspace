# Certificate parsing, status, and validation

Status: Implemented (contract audit). Owner: clr-lift maintainers. Updated: October 17, 2026. Package: clr-lift.
Approval: existing parsing/display APIs; no cryptographic trust guarantee.

## Applicable contracts

Parsing, async module loading, validation and rendered signpost accessibility apply. The validator integrates with
Reactive Forms; the signpost has no form value or shared query cache.

## Background

[signpost](../../../libs/clr-lift/src/lib/components/certificate-signpost/certificate-signpost.component.ts) and
[certificateValidator](../../../libs/clr-lift/src/lib/components/certificate-signpost/certificate.validator.ts) support
PEM inspection and Reactive Forms parsing checks. The signpost calls the
[certificate parser](../../../libs/clr-lift/src/lib/components/certificate-signpost/certificate-parser.ts) directly;
there is no certificate service.

## Terminology

PEM text differs from base64-encoded PEM text. Parsing establishes readable certificate structure; a display expiry
status or fingerprint does not establish signature validity, chain trust, hostname match or revocation status.

## Goals

- G1: Inspect certificate details/fingerprints and show expiry status against a controllable clock.
- G2: Reject malformed nonempty certificate input through a Reactive Forms validator.

## Non-Goals

### Not now

New certificate engines, asynchronous native field validators, and automatic certificate renewal.

### Outside this API

TLS trust decisions, chain validation, private-key handling, revocation and server policy.

## Use cases and acceptance

| ID  | Task                   | Initial state/action             | Outcome                                     | Failure/recovery                           | Demo/test                                |
| --- | ---------------------- | -------------------------------- | ------------------------------------------- | ------------------------------------------ | ---------------------------------------- |
| C1  | Inspect PEM            | Raw/encoded input opens signpost | Details and display hashes                  | Parse failure shown without trust claim    | real raw/encoded parser and digest tests |
| C2  | Observe expiry         | Inject/update reference clock    | Expired at notAfter; warning within 30 days | Override clock yields deterministic output | clock regressions                        |
| C3  | Validate imported text | Empty, malformed, valid PEM      | Empty allowed; malformed invalidCertificate | Required is caller-owned                   | validator branch tests; certificate E2E  |

## Industry evidence and current gaps

Certificate parsing, DER decoding, and MD5/SHA-1 fingerprints are implemented with dependency-free, synchronous
browser-native code in `certificate-parser.ts` and `certificate-crypto.ts`. This removed the previous node-forge peer
dependency so unrelated consumers are not forced to install it. ASN.1/DER decoding and hashing are intentionally narrow:
they cover the fields this library displays and validates, not full X.509 semantics. Angular's ValidatorFn owns parsing
errors. Expiry display does not inspect all certificate trust conditions.

## Downstream consumer alignment requirement

A downstream UI consumer parses certificates for display with `@peculiar/x509` and hashes DER synchronously with
node-forge; it never generates keys, signs, or decrypts. Requirement: clr-lift's parser must cover those usages so the
consumer can drop node-forge and `@peculiar/asn1-x509`:

- Parsing is key-algorithm agnostic: RSA, ECDSA, Ed25519 and other certificates parse identically because the subject
  public key info is not interpreted. Regression fixtures cover RSA and ECDSA signature algorithms.
- The signature algorithm OID is exposed as `signatureAlgorithm` for labeling RSA/ECDSA and other families; unknown OIDs
  stay opaque for the caller to map, matching the consumer's signature-algorithm map fallback.
- The subjectAltName (2.5.29.17) and subjectKeyIdentifier (2.5.29.14) extensions are parsed when present
  (`subjectAltName`, `subjectKeyIdentifier`), including constructed `directoryName` entries.
- Fingerprints ship for MD5, SHA-1 and SHA-256 over DER, cross-checked against the platform implementation. This library
  intentionally ships no more synchronous digests; consumers needing SHA-384/512 compute them in their own component
  with the async WebCrypto `crypto.subtle.digest` over the DER bytes.

Trust decisions in the downstream consumer (trusted-certificate submission, connection status) stay server-side; this
requirement covers parsing and display only.

## Developer learning journey and pedagogy plan

Prerequisites: Angular components, Clarity setup, and a PEM certificate; parsing does not establish trust.

| Reader task            | Learning outcome                                                       | Destination / working example                                                                   |
| ---------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Inspect a certificate  | Read issuer, expiry and fingerprints from the downloadable PEM fixture | [/clr-lift/components/certificate](https://ngx-lift.vercel.app/clr-lift/components/certificate) |
| Validate imported text | Distinguish parse failure from certificate trust                       | This spec, validator contract and certificate demo                                              |

Validation and delivery: Use certificate parser/validator regressions and certificate E2E. The fixture and teaching flow
landed in #172; human comprehension remains open. The public API and behavior sections below own exact options and
limitations; examples introduce them after the first task.

## Public API and examples

```html
<!-- Host imports CertificateSignpostComponent. pem is raw PEM text. -->
<cll-certificate-signpost [pem]="pem" [pemEncoded]="false" />
```

The exported `parseCertificateFromPem` helper defaults `pemEncoded=true`; the signpost input defaults false. Pass the
flag explicitly at boundaries. Hash output is uppercase MD5/SHA1 for display compatibility. Use
`certificateValidator(false)` with Reactive Forms for raw PEM; decoding is opt-in. The signpost is display-only; the
validator works with Reactive Forms + `toSignalForm` because that facade retains the same control.

Build-your-own-viewer utilities, exported alongside the component for custom certificate tooling:

```typescript
import {extractDerFromPem, md5, parseCertificate, pemEncodeDer, sha1, sha256} from 'clr-lift';

const der = extractDerFromPem(pemText); // PEM (or base64-encoded PEM) -> DER bytes
const certificate = parseCertificate(der); // DER -> fields; key-algorithm agnostic
const digests = {md5: md5(der), sha1: sha1(der), sha256: sha256(der)}; // uppercase hex
const pem = pemEncodeDer(der); // DER -> PEM armor with 64-character base64 lines
```

`pemEncodeDer(der, label = 'CERTIFICATE')` is the inverse of `extractDerFromPem` for DER input; the round trip
`extractDerFromPem(pemEncodeDer(der))` returns bytes equal to `der`. The armor label is opaque, so the same function
arms other PEM content (for example `PRIVATE KEY`). No owned visible strings: it returns data, not UI. The demo page
exercises these utilities in its build-your-own-viewer section with a sample selector covering root, intermediate CA and
leaf certificates for RSA and ECDSA keys.

## Behavior and architecture

Signpost parsing catches failures into error/status state; the surfaced parser message is a developer diagnostic, not
translated product copy. Expiry compares exact notAfter timestamp, then day difference for warning text. A component
`clock` overrides the default browser minute timer, which refreshes current time and is cleaned up by the effect. A
supplied clock must expose reactive dependencies if live updates are needed. The validator returns null for empty input
and `{invalidCertificate: error}` for nonempty parse failures.

## Clarity, accessibility, and localization

Use translated Clarity signpost/button labels and status text, not color alone. Runtime locale changes recompute
messages. Verify keyboard open/close and focus return; human translation acceptance remains separate.

## Demo and validation plan

Certificate and file-reader demos automatically load their deferred viewer for the initial PEM, without a load button or
programmatic focus movement. Keep the signpost trigger and status aligned with their label;
`apps/demo-e2e/src/certificate.spec.ts` checks details/focus. Adjacent tests cover clock precedence/status and mocked
parse-error recovery. Direct service/validator tests use an expired public certificate to verify raw/encoded PEM
parsing, fixed DER fingerprints, malformed input, empty optional values, caller-owned required validation and recovery.
Parsing an expired certificate remains valid for this API. Dependency/bundle tooling verifies demo lazy-loading; strict
package installation checks a different boundary.

## Compatibility, rollout, and risks

Angular 21. The node-forge peer dependency was removed; certificate parsing and fingerprinting are now dependency-free
and synchronous, so unrelated consumers no longer install node-forge and the main `clr-lift` entry does not reference
it. The stateful `CertificateService` was removed: the signpost calls the parser and digest functions directly and owns
clock resolution, so consumers bind `pem`/`pemEncoded`/`clock` inputs instead of injecting a service or providing an
injection token. The `CertificateComponent` `certificate` input and the exported parser expose the local
`X509Certificate` type instead of `node-forge`'s `pki.Certificate`. Native signal-field validation is a future reviewed
integration, not provided by the current ValidatorFn.

Migration for the removed APIs: replace `CertificateService.getCertificateFromPem(pem, pemEncoded)` with the exported
`parseCertificateFromPem`; replace `getCertificateHashes` with the exported `extractDerFromPem` plus the digest
functions; replace the `CERTIFICATE_CLOCK` provider with the component `clock` input.

## Review decisions and delivery

Keep explicit parsing-only semantics and clock precedence. Reassess optional packaging and stronger display fingerprints
separately; neither is silently introduced in this docs update.

## Evidence

The parser, certificateValidator, signpost, and certificate component suites pass. The fixed MD5/SHA1 values were
independently calculated from DER with Python hashlib and are now reproduced by the dependency-free native
implementation in `certificate-crypto.ts`; SHA-256 is cross-checked against the platform implementation in tests. A
synthetic DER fixture builder covers certificate types the two real fixtures do not: v1 and v3 certificates, UTCTime and
GeneralizedTime validity with numeric offsets, multi-valued RDNs, UTF8/BMP/Printable/IA5 distinguished-name encodings,
RSA and ECDSA signature algorithms, SAN/SKI extensions, and PEM/raw-DER/base64 inputs. This proves parsing/display
behavior, not trust.
