# PR #147 production review and Priority 1/2 delivery

Reviewed on 2026-10-14 (Asia/Shanghai). Target: [PR #147](https://github.com/wghglory/ngx-lift-workspace/pull/147),
`feat/extended-priority-2-backlog`; original head `6549690`, base/main `b8459ed`. The corrected target is #147. Separate
#146 experiments are outside this report.

## Decision and acceptance boundary

The original PR did not complete all Priority 1/2 acceptance criteria. This follow-up delivers the missing engineering
work and repairs confirmed production defects. `computedAsync` implementation and types remain unchanged.

All eleven demo dictionaries now contain 1,641 keys, including 130 previously hardcoded API descriptions. The eight
secondary locales and Traditional Chinese no longer depend on missing-key fallback. Translations were AI-assisted and
reviewed for technical meaning, API literals, retry safety and placeholders. **Independent native-speaker human sign-off
has not been obtained.** The original P2.1 requirement explicitly calls for human-reviewed translations, so full
linguistic acceptance remains open even after the engineering work passes.

No merge or npm publication is part of this delivery. Merge readiness, isolated-consumer readiness and publication
readiness are separate gates. The official npm audit endpoint timed out after 60 seconds; audit remains unverified. A
successful publication dry run does not verify npm credentials or establish a real published release.

## Standards review

The review found and repaired these defects:

- Certificate status sampled the clock twice and could throw for a callback alternating Date and timestamp values. It
  now samples once; custom signal clocks react, and the browser clock advances every minute with cleanup.
- Clarity language switches retained strings from the previous locale. Every switch now starts from upstream/English
  defaults and applies canonical base and exact locale overrides.
- Diagnostic snapshots exposed mutable cache keys, and the pending total undercounted overlapping request generations.
  Snapshots are detached and the aggregate counts all transports still in flight.
- Shared idle components could stop each other's timers. Managed owners release their own subscriptions; the last owner
  clears timers while explicit manual ownership remains supported. Initial configuration precedes the first timer.
- Asynchronous highlighting changed clipboard output to escaped markup. Copy now decodes prepared source exactly once.
- Asynchronous certificate validation allowed submission during PENDING. The form blocks non-valid submission, fails
  closed on loader errors and revalidates synchronously after loading so Clarity's submit-time validation works.
- Translation drafts contained corrupted code tokens and unsafe blanket HTTP retry claims. Technical review corrected
  these, and the checker now rejects known artifacts, changed API identifiers/options and placeholder drift.

## Spec review

| Task                            | Engineering status                                      | Implementation and verification                                                                                                                                                                                                                                        |
| ------------------------------- | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1.1 Remote CI/release workflow | Delivered                                               | Main `b8459ed` CI, CodeQL and demo deployment succeed; coverage/browser artifacts exist. Publication defaults to a guarded dry run with strict consumer verification and artifact upload. Final branch results are recorded at the PR checks and workflow links below. |
| P1.2 Isolated fresh consumer    | Delivered                                               | Packed libraries install in an independent consumer with strict peers, automatic peer installation disabled, strict TypeScript and runtime imports. Inherited relaxed installation settings are removed.                                                               |
| P1.3 Heavy dependencies         | Delivered                                               | highlight.js loads at the rendering component; both certificate-related routes defer/dynamically import parsing. Production static-graph checks prevent initial or route-level eager dependency regressions. Synchronous library APIs are preserved.                   |
| P2.1 Full dictionaries          | Engineering delivered; human linguistic acceptance open | Eleven dictionaries cover 1,641 keys each. API rows react to lazy dictionary arrival. The selector has no partial-support marker. AI technical review does not replace native-speaker sign-off.                                                                        |
| P2.2 Native Clarity strings     | Delivered                                               | Eleven bundles cover all 122 upstream strings. Switching resets fallback state and honors exact regional overrides. Upstream key coverage has a regression test.                                                                                                       |
| P2.3 Diagnostics/configuration  | Delivered                                               | Detached snapshots, accurate request counts, a live panel with one-second refresh/cleanup, and real mounted shared/scoped consumer tests for polling, freshness, GC and destruction.                                                                                   |
| P2.4 Service scope/clock        | Delivered                                               | Explicit provider/component scopes, managed shared ownership, correct initial timer configuration, injected reactive clocks and default-clock cleanup.                                                                                                                 |

PR #145's wizard scenario tests and advanced form API tables remain part of the merged Priority 2 work. They did not, by
themselves, satisfy the extended localization, loading or lifecycle requirements above.

## Verification and remote evidence

The completion run checks formatting, tooling/i18n gates, workspace lint, source and spec TypeScript, coverage,
production builds, bundle boundaries, strict isolated package consumers and Chromium/Firefox/WebKit E2E. Exact
completion totals are recorded in the final PR description after these checks finish.

- [Main CI](https://github.com/wghglory/ngx-lift-workspace/actions/runs/38386504342) and
  [main deployment](https://github.com/wghglory/ngx-lift-workspace/actions/runs/38386504311) succeeded on `b8459ed`.
- [Current PR checks](https://github.com/wghglory/ngx-lift-workspace/pull/147/checks) are the source of truth for the
  final pushed revision; original-head green checks cannot substitute for this verification.
- [Publication workflow runs](https://github.com/wghglory/ngx-lift-workspace/actions/workflows/publish.yml) distinguish
  dry runs from real releases. Dry-run authentication, Git mutation and actual publishing steps must remain skipped.

The local browser server uses port 4317 because the user's existing port 4307 is occupied. E2E's managed server disables
HMR so deferred dependencies are exercised normally. No user-owned server is stopped.

## Usage and next steps

[Production contracts and usage examples](../design/priority-1-2-completion.md) describe idle ownership, certificate
clocks, Clarity overrides, query diagnostics and deferred loading.
[中文说明](../design/priority-1-2-completion.zh-CN.md).

1. Obtain independent linguistic approval for the eight secondary locales; the full-key gate alone cannot close that
   original acceptance item.
2. Merge only with final-revision CI green. After merging, verify the resulting main CI/deployment.
3. Before an actual publication, complete the dependency audit, choose versions and verify credentials. Dry runs perform
   no real publication.
4. Keep Priority 3 separate: SSR/hydration consumers, secondary entry points, Angular migration work and the
   `computedAsync` error/type design.

## computedAsync compatibility

This PR makes no runtime or typing change to `computedAsync`. Its existing compatibility default can store an error
object as `T`; an `onError` returning undefined also defeats an initial-value overload's advertised non-undefined type.
The demo explanation now reflects that existing behavior. Consumers can return a valid typed fallback or choose
`throwOnError: true` with a read/error boundary.

A Result wrapper would break assignments, property reads, templates and previous-value callbacks until consumers unwrap
it. Throwing by default changes runtime behavior; widening to unknown breaks normal property access. Any redesign
belongs in a separately named opt-in API or a major release with consumer migration tests.
