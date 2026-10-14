# Query production review

Reviewed October 14, 2026 (Asia/Shanghai). Repository: `/Users/guanghuiw/Work/github/ngx-lift`; base `main@5b196cf`.
[中文说明](query-production-review.zh-CN.md) · [Query design](../design/query-resource-design-spec.md) ·
[Migration guide](../MIGRATIONS.md).

This is the current query acceptance record. It consolidates the earlier PR #142, #146/#147 integration and demo review
notes. Historical fixes are distinguished from this PR's changes; remote checks are recorded on the PR.

## Decision

The query core is suitable for bounded Angular browser server-state reads with explicit scope, deadline and retry
policies. This PR improves documentation, demos and installed-consumer evidence; it does not change the query engine. No
new blocking runtime defect was found in the local review. **Actual npm publication is not ready:** dependency
triage/remediation, independent linguistic acceptance, version selection and authentication remain open.

SSR/hydration, ZoneJS and every version admitted by peer ranges are not established by the current browser evidence.
Large dynamic lists have no concurrency limiter. Persistence, infinite queries, offline queues and shared optimistic
rollback are deferred, not advertised features.

## Delivered changes

- A progressive queryResource guide: tool selection, basic/dependent reads, cached Observable services, cache/polling,
  recovery and diagnostics, with per-example code and Clarity controls.
- A separate lazy queryResources route/menu with selection, reorder/removal, partial-failure recovery, API and limits.
- Consistent query/mutation state labels and spaced text-only demo actions. Recovery uses a decision table and tabs.
- A concise naming callout with title/body spacing: `userQuery`, `tenantQueries`, `createMutation`; plain names identify
  data. Displayed snippets consistently use Angular component/service contexts. The redundant syntax paragraph was
  removed.
- Both reported NG8107 warnings fixed; signal-backed demo inputs update on native input/change events.
- Corrected README/changelog API claims and explicit unreleased migrations; removed duplicate design/review documents
  and updated links to the canonical entries.
- A mounted Angular 21.2 zoneless consumer against fresh installed tarballs, covering logout/login isolation, pending
  cancellation, retained refresh data/recovery, collection lifecycle, scoped writes and destruction.

The user selected this GitHub checkout. The other checkout's port-4200 server was left intact; local previews use 4317
(development) and 4318 (production). No version manifest, dependency lockfile or package publication changed.

## Validation

| Check                         | Evidence                                                                                                                |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `pnpm run validate`           | Formatting, tooling/i18n, workspace lint/source types, coverage, builds, bundle boundaries and strict consumers passed. |
| Unit tests                    | 848 ngx-lift, 262 clr-lift, 235 demo tests passed.                                                                      |
| Demo test-source TypeScript   | `pnpm nx exec -p demo -- pnpm exec tsc --noEmit -p tsconfig.spec.json` passed.                                          |
| Full production-browser suite | 126 tests passed across Chromium, Firefox and WebKit.                                                                   |
| Naming follow-up              | 12 displayed TypeScript snippets compiled; 23 relevant unit tests and 24 three-browser query E2E tests passed.          |
| Template diagnostics          | Production demo build passed without NG8107.                                                                            |
| Review                        | Query inputs/state, observer teardown, isolated consumer setup and public API descriptions inspected.                   |
| Formatting / links            | `git diff --check`; duplicate-document references updated to the canonical spec/review.                                 |

These totals are local checkpoints from this session. The final PR checks determine remote status. The unit environment
emits existing jsdom stylesheet-parsing/translation-fallback messages; these are distinct from the fixed Angular serve
diagnostics. No registry credentials were exercised.

## Existing resilience and priority completion

The core contracts were implemented before this demo PR:

| Earlier work            | Current state                                                                                                                                                                                           |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PR #142 correctness     | Publication revision/membership guards prevent stale reentrant notifications. Pagination parameters, nullable emptiness and cyclic equality contracts were repaired.                                    |
| PR #146 query lifecycle | Native Observable/PromiseLike loaders; first-value/empty/teardown handling; listener isolation; bounded retries/deadlines; observed recovery; terminal reporting; B-only collections and scoped writes. |
| PR #147 integration     | Diagnostics detach keys and sample time/visibility once; logical-read counts include obsolete retry waits; inspector projection and strict fresh consumer coverage repaired.                            |
| Priority 1              | Release workflow guards, strict package consumers and deferred heavyweight dependencies delivered.                                                                                                      |
| Priority 2              | Dictionary/Clarity coverage, diagnostics and service scope/clock engineering delivered. Independent human linguistic approval remains open.                                                             |
| Priority 3              | SSR/hydration consumers, peer/rendering matrix, measured entry points, Angular migration and computedAsync error/type redesign remain separate work.                                                    |

Original evidence remains in Git history and [PR #142](https://github.com/wghglory/ngx-lift-workspace/pull/142),
[PR #146](https://github.com/wghglory/ngx-lift-workspace/pull/146) and
[PR #147](https://github.com/wghglory/ngx-lift-workspace/pull/147). Older test totals and release snapshots are
historical, not current badges. Unrelated whole-library audit evidence remains in its own audit reports.

## Release conditions

Proposed next versions are **ngx-lift 22.0.0** for the removed public adapter and other post-21.2.0 contract changes,
and **clr-lift 22.0.0** for the changed FileReader encoding default. These are proposals, not manifest bumps or npm
availability claims. Align clr-lift's ngx-lift peer requirement to the tested new API baseline and validate the real
versioned tarballs before publishing.

Merge readiness, consumer readiness and publication readiness are separate gates. The source support matrix currently
records Angular 21.2 zoneless browser/DOM evidence; broader rendering claims require their own fixtures.

### Dependency triage

Read-only GitHub Dependabot queries on main found 15 runtime-scoped alert records covering six unique advisories;
manifest/lockfile duplicates are included. They describe the main dependency tree, not exploitability of an individual
deployed artifact. This work leaves dependency manifests and the lockfile unchanged.

| Package                          | Advisory                                                                 | Reported fix / action                                                                                                    |
| -------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| node-forge                       | [GHSA-86w9-cpqp-85rv](https://github.com/advisories/GHSA-86w9-cpqp-85rv) | High severity; no patched version listed. Triage certificate-related reachability and replacement/mitigation separately. |
| @angular/router                  | [GHSA-ff3f-86qr-9cv3](https://github.com/advisories/GHSA-ff3f-86qr-9cv3) | High severity; fixed in 21.2.24.                                                                                         |
| @angular/core, @angular/compiler | [GHSA-jj27-h5hq-8x99](https://github.com/advisories/GHSA-jj27-h5hq-8x99) | High severity; fixed in 21.2.19.                                                                                         |
| @angular/common                  | [GHSA-jhpw-976m-542j](https://github.com/advisories/GHSA-jhpw-976m-542j) | High severity; fixed in 21.2.19.                                                                                         |
| @angular/core, @angular/compiler | [GHSA-hh8m-fm6v-7cvg](https://github.com/advisories/GHSA-hh8m-fm6v-7cvg) | Medium severity; fixed in 21.2.20.                                                                                       |
| @angular/common                  | [GHSA-p297-fm68-3q8c](https://github.com/advisories/GHSA-p297-fm68-3q8c) | Medium severity; fixed in 21.2.20.                                                                                       |

The workspace currently pins Angular runtime packages to 21.2.17. A focused coordinated patch upgrade to at least
21.2.24 addresses the listed Angular findings, subject to official availability and consumer validation. Peer
dependencies remain consumer-owned and need a documented security baseline.

An official-registry production audit was attempted with a 45-second process bound and timed out. The audit result is
unverified; it is not recorded as clean. Registry authentication was not exercised because publication was not
requested.
