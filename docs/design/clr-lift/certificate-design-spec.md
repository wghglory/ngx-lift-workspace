# Certificate parsing, status, and validation

Status: Implemented (contract audit). Owner: clr-lift maintainers. Updated: October 16, 2026. Package: clr-lift.
Approval: existing parsing/display APIs; no cryptographic trust guarantee.

## Background

[CertificateService](../../../libs/clr-lift/src/lib/components/certificate-signpost/certificate.service.ts),
[signpost](../../../libs/clr-lift/src/lib/components/certificate-signpost/certificate-signpost.component.ts) and
[certificateValidator](../../../libs/clr-lift/src/lib/components/certificate-signpost/certificate.validator.ts) support
PEM inspection and Reactive Forms parsing checks.

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

| ID  | Task                   | Initial state/action             | Outcome                                     | Failure/recovery                           | Demo/test                                       |
| --- | ---------------------- | -------------------------------- | ------------------------------------------- | ------------------------------------------ | ----------------------------------------------- |
| C1  | Inspect PEM            | Raw/encoded input opens signpost | Details and display hashes                  | Parse failure shown without trust claim    | mocked recovery tests; real parser tests needed |
| C2  | Observe expiry         | Inject/update reference clock    | Expired at notAfter; warning within 30 days | Override clock yields deterministic output | clock regressions                               |
| C3  | Validate imported text | Empty, malformed, valid PEM      | Empty allowed; malformed invalidCertificate | Required is caller-owned                   | validator coverage needed; certificate E2E      |

## Industry evidence and current gaps

The installed node-forge APIs supply PEM parsing, DER and digest functions; reuse them rather than implementing ASN.1.
Angular's ValidatorFn owns parsing errors. Expiry display does not inspect all certificate trust conditions.

## Public API and examples

```html
<!-- Host imports CertificateSignpostComponent. pem is raw PEM text. -->
<cll-certificate-signpost [pem]="pem" [pemEncoded]="false" />
```

`CertificateService.getCertificateFromPem` and `getCertificateHashes` default `pemEncoded=true`; the signpost input
defaults false. Pass the flag explicitly at boundaries. Hash output is uppercase MD5/SHA1 for display compatibility. Use
`certificateValidator(false)` with Reactive Forms for raw PEM; decoding is opt-in. The signpost is display-only; the
validator works with Reactive Forms + `toSignalForm` because that facade retains the same control.

## Behavior and architecture

Signpost parsing catches failures into error/status state. Expiry compares exact notAfter timestamp, then day difference
for warning text. A component `clock` overrides `CERTIFICATE_CLOCK`; otherwise a browser minute timer refreshes current
time and is cleaned up by the effect. A supplied clock must expose reactive dependencies if live updates are needed. The
validator returns null for empty input and `{invalidCertificate: error}` for nonempty parse failures.

## Clarity, accessibility, and localization

Use translated Clarity signpost/button labels and status text, not color alone. Runtime locale changes recompute
messages. Verify keyboard open/close and focus return; human translation acceptance remains separate.

## Demo and validation plan

Certificate and file-reader demos automatically load their deferred viewer for the initial PEM, without a load button or
programmatic focus movement. The label, signpost trigger and status use aligned inline layouts;
`apps/demo-e2e/src/certificate.spec.ts` checks details/focus. Adjacent tests cover clock precedence/status and mocked
parse-error recovery; they do not directly prove real PEM parsing, fingerprints or certificateValidator branches. Add
actual raw/encoded/malformed PEM fixtures, hash expectations and empty/invalid validator assertions. Dependency/bundle
tooling verifies demo lazy-loading; strict package installation checks a different boundary.

## Compatibility, rollout, and risks

Angular 21 and existing node-forge peer. Current package root requires node-forge even for unrelated consumers; lazy
demo loading does not make that installation optional. Evaluate secondary packaging only with consumer evidence. Native
signal-field validation is a future reviewed integration, not provided by the current ValidatorFn.

## Review decisions and delivery

Keep explicit parsing-only semantics and clock precedence. Reassess optional packaging and stronger display fingerprints
separately; neither is silently introduced in this docs update.

## Evidence

Source, adjacent tests and package manifest inspected October 16, 2026. No crypto, browser or package checks rerun here.
