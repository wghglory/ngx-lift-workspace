# ngx-lift delivery priorities

Updated October 18, 2026. The [component roadmap](component-roadmap.md) now owns the proposed component sequence: design
workflow, Angular 21 forms, then components. Angular 22 and the Nx major upgrade are deferred; native signal-field
support follows that upgrade for every new value control. The table below preserves the existing delivery backlog and
evidence; its historical rank is not the new component order.

🟢 **Done** means the stated scope has evidence. 🟡 **In progress / partial** identifies remaining work. ⚪ **Planned**
and ⏸️ **Deferred** are not completed work. Local validation, remote merge and npm publication remain separate gates.

| Rank | Item                                                                                         | Status                                      | Acceptance and remaining work                                                                                                                                                                                                                                     |
| ---- | -------------------------------------------------------------------------------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Original Priority 1: release guards, isolated package consumers, deferred heavy dependencies | 🟢 Done                                     | Release guards and strict consumer verification are implemented; production bundle metadata checks pass. The publish jobs and GitHub releases for ngx-lift 21.3.0 / clr-lift 21.2.0 succeeded.                                                                    |
| 2    | Original Priority 2: dictionary/Clarity coverage, diagnostics, scope and clocks              | 🟢 Engineering done; 🟡 human acceptance    | Eleven demo dictionaries pass key and placeholder checks; counts change with new content. Lifecycle and diagnostics engineering is delivered. Independent native-speaker sign-off remains external and must not be marked done.                                   |
| 3    | Previous order 1: installed rendering compatibility                                          | 🟢 Local implementation and validation done | Commit `27a4499` runs the installed Angular 21.2 DOM fixture in separate zoneless and ZoneJS processes. Package exports, strict types and strict peer installation pass. Merged in PR #150; this does not prove SSR/hydration or Angular 22.                      |
| 4    | Previous order 2: dependency security                                                        | 🟡 Partial; migration separate              | Vitest 4.1.11, PostCSS and scoped development-tool patches remain. Angular and Nx pins remain unchanged; their major migration is deferred. Independent security fixes remain eligible. Whole-tree audit remains unverified.                                      |
| 5    | Previous order 8a: computedAsync error/type defect                                           | 🟢 Published in ngx-lift 21.4.0             | Read-time errors, typed fallbacks/recovery and invalid-contract rejection are delivered. The approved 21.x exception, migrations, packed-consumer verification and publication are recorded in the [21.4.0 release evidence](../CHANGELOG.md). No new result API. |
| 6    | Previous order 8b: Angular migration                                                         | ⏸️ Deferred by maintainer                   | Deliver new controls on Angular 21 first. Revisit Angular 22/Nx in a separate platform PR, then require native signal-field support across all new value controls and an installed-consumer matrix.                                                               |
| 7    | Accessibility and independent language acceptance                                            | ⚪ Planned                                  | Keyboard/focus and automated accessibility evidence for tooltip, dialog, file-reader and wizard; named human language reviewers and recorded approval.                                                                                                            |
| 8    | Existing feature PRs #137–#141                                                               | ⚪ Review pending                           | Independently review core utilities, validators, headless directives, transactional/testing APIs and Clarity directives; do not merge solely because a PR exists.                                                                                                 |
| 9    | Secondary entry points                                                                       | ⚪ Measure first                            | Compare installed-consumer bundle and optional-dependency boundaries before choosing splits such as ngx-lift/query or clr-lift/certificate.                                                                                                                       |
| 10   | Previous order 3: SSR/hydration                                                              | ⏸️ Lower priority                           | Request isolation, PendingTasks, cancellation/deadlines, server polling and hydration consistency need dedicated consumers. Node DOM tests do not prove SSR or hydration.                                                                                         |
| 11   | Large-collection scheduling and advanced cache features                                      | ⏸️ Demand-driven                            | Measure actual fan-out before a limiter; persistence, offline queues, infinite queries and shared optimistic rollback require concrete consumers and ownership contracts.                                                                                         |

## Repairs before extending the affected APIs

The [active gap register](design/implementation-gaps.md) owns source evidence and acceptance criteria. Preserve
intentional developer-trusted localized alert HTML and scoped callbacks (F1); caller interpolation must escape untrusted
values. File-reader disable handling (F2, #156) and mixed hover/focus toast timeout plus viewport containment (F3, #155)
are implemented and merged. Pagination cursor-loop protection (F4, #159) is implemented; its PR owns final validation
and merge evidence. Configurable aggregate page/item caps were declined. These focused repairs target Angular 21; the
deferred platform upgrade is not a prerequisite. Package publication remains separate.

## Acceptance boundaries

The [integration guide](guides/demo-and-library-integration.md) owns loading, localization and shared lifecycle;
[API specifications](design/README.md) own API behavior. The roadmap owns only priority and completion status. Commands
live in [COMMANDS](COMMANDS.md), release history in [CHANGELOG](../CHANGELOG.md), and publication gates in
[DEPLOYMENT](DEPLOYMENT.md). CI runs and the corresponding PR record exact validation evidence.

- A green implementation status is scoped to the stated work; it does not imply merge or publication.
- Dictionary checks do not replace independent human language approval.
- Strict installed Angular consumers cover zoneless and ZoneJS DOM modes, not SSR/hydration or every permitted peer.
- Both packages stay on 21.x until Angular 22; the [version policy](DEPLOYMENT.md#version-policy) records the explicit
  compatibility exception for computedAsync and idle warnings. Packed-consumer verification and publication completed
  for ngx-lift 21.4.0 / clr-lift 21.3.0; see the [release evidence](../CHANGELOG.md).
- Angular 22 and the Nx major upgrade are deferred; new Angular 21 CVA controls can proceed after feature API review.
- After the platform upgrade, native signal-field integration is a required delivery gate for every new value control.
- Dependency advisory follow-ups remain open; unsuccessful audit access is not a clean whole-tree result.

## Documentation maintenance

The [demo refinement roadmap](documentation-refinement-roadmap.md) records merged delivery through #175 and links to
successful main CI/deployment. The [query learning plan](query-documentation-plan.md) owns its reader outcomes.
Documentation closeout aligns package examples, per-spec learning briefs and status references; its PR owns validation.
Human newcomer and native-language acceptance remain open. Proposed component APIs remain drafts.

🟢 Canonical navigation, integration guidance and generic fixtures are maintained; obsolete audit/review snapshots are
removed. Revision-specific validation evidence lives in CI and the corresponding PR, including any failed runs and
subsequent verification. It is not duplicated in standalone reports.
