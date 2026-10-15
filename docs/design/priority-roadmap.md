# ngx-lift delivery priorities

Updated October 15, 2026 (Asia/Shanghai). Ordered from highest to lowest priority according to the maintainer's latest
direction.

🟢 **Done** means the stated scope has evidence. 🟡 **In progress / partial** identifies remaining work. ⚪ **Planned**
and ⏸️ **Deferred** are not completed work. Local validation, remote merge and npm publication remain separate gates.

| Rank | Item                                                                                         | Status                                      | Acceptance and remaining work                                                                                                                                                                                                 |
| ---- | -------------------------------------------------------------------------------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Original Priority 1: release guards, isolated package consumers, deferred heavy dependencies | 🟢 Done                                     | Release guards and strict consumer verification are implemented; production bundle metadata checks pass. The publish jobs and GitHub releases for ngx-lift 21.3.0 / clr-lift 21.2.0 succeeded.                                |
| 2    | Original Priority 2: dictionary/Clarity coverage, diagnostics, scope and clocks              | 🟢 Engineering done; 🟡 human acceptance    | Eleven dictionaries contain all 1,726 keys with no checker errors. Lifecycle and diagnostics engineering is delivered. Independent native-speaker sign-off remains external and must not be marked done.                      |
| 3    | Previous order 1: installed rendering compatibility                                          | 🟢 Local implementation and validation done | Commit `27a4499` runs the installed Angular 21.2 DOM fixture in separate zoneless and ZoneJS processes. Package exports, strict types and strict peer installation pass. Submitted in PR #150; remote merge remains separate. |
| 4    | Previous order 2: dependency security                                                        | 🟡 Partial; Angular/Nx deferred             | Vitest 4.1.11, PostCSS and scoped development-tool patches remain. Angular and Nx pins restored to main; maintainer will upgrade later. Whole-tree audit remains unverified.                                                  |
| 5    | Previous order 8a: computedAsync error/type defect                                           | 🟢 Fixed and locally validated              | Existing API now throws unhandled failures on reads, preserves typed fallbacks and recovery, and rejects false/undefined contract violations. Breaking release decision remains separate. No new result API.                  |
| 6    | Previous order 8b: Angular migration                                                         | ⚪ Deferred                                 | Angular 22 verification removed at maintainer request. Workspace/library build baseline remains Angular 21. Full major migration is separate work.                                                                            |
| 7    | Accessibility and independent language acceptance                                            | ⚪ Planned                                  | Keyboard/focus and automated accessibility evidence for tooltip, dialog, file-reader and wizard; named human language reviewers and recorded approval.                                                                        |
| 8    | Existing feature PRs #137–#141                                                               | ⚪ Review pending                           | Independently review core utilities, validators, headless directives, transactional/testing APIs and Clarity directives; do not merge solely because a PR exists.                                                             |
| 9    | Secondary entry points                                                                       | ⚪ Measure first                            | Compare installed-consumer bundle and optional-dependency boundaries before choosing splits such as ngx-lift/query or clr-lift/certificate.                                                                                   |
| 10   | Previous order 3: SSR/hydration                                                              | ⏸️ Lower priority                           | Request isolation, PendingTasks, cancellation/deadlines, server polling and hydration consistency need dedicated consumers. Node DOM tests do not prove SSR or hydration.                                                     |
| 11   | Large-collection scheduling and advanced cache features                                      | ⏸️ Demand-driven                            | Measure actual fan-out before a limiter; persistence, offline queues, infinite queries and shared optimistic rollback require concrete consumers and ownership contracts.                                                     |

## Acceptance boundaries

The [integration guide](../guides/demo-and-library-integration.md) owns loading, localization and shared lifecycle;
[API specifications](README.md) own API behavior. The roadmap owns only priority and completion status. Commands live in
[COMMANDS](../COMMANDS.md), release history in [CHANGELOG](../../CHANGELOG.md), and publication gates in
[DEPLOYMENT](../DEPLOYMENT.md). CI runs and the corresponding PR record exact validation evidence.

- A green implementation status is scoped to the stated work; it does not imply merge or publication.
- Dictionary checks do not replace independent human language approval.
- Strict installed Angular consumers cover zoneless and ZoneJS DOM modes, not SSR/hydration or every permitted peer.
- computedAsync's error/type correction requires a breaking release/version decision and dependent peer-range review.
- Angular/Nx upgrades are deferred; pins remain at the existing main baseline.
- Dependency advisory follow-ups remain open; unsuccessful audit access is not a clean whole-tree result.

## Documentation maintenance

🟢 Canonical navigation, integration guidance and generic fixtures are maintained; obsolete audit/review snapshots are
removed. Revision-specific validation evidence lives in CI and the corresponding PR, including any failed runs and
subsequent verification. It is not duplicated in standalone reports.
