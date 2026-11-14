# ngx-lift delivery priorities

Updated 2026-11-14. The [component roadmap](component-roadmap.md) owns the component sequence and its maintainer
decisions. Angular 22 and the Nx major upgrade are deferred; native signal-field support follows that upgrade for every
new value control. This roadmap owns current delivery priorities and acceptance boundaries; the
[gap register](gap-register.md) owns the detailed backlog.

## Current priorities

| Priority | Item                                                    | Status         | Remaining work                                                                                                                                                                |
| -------- | ------------------------------------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1        | Dependency security                                     | Partial        | Resolve remaining development-tool advisories and verify whole-tree advisory triage. Angular and Nx pins stay unchanged.                                                      |
| 2        | Open feature PRs #137–#141 and #134                     | Review pending | Rebase and review independently, or close with a recorded decision. Do not merge solely because a PR exists.                                                                  |
| 3        | Secondary entry points                                  | Measure first  | Compare installed-consumer bundles and optional-dependency boundaries before choosing splits such as `ngx-lift/query` or `clr-lift/certificate`.                              |
| 4        | SSR/hydration                                           | Lower priority | Define request isolation, PendingTasks, cancellation/deadlines, server polling and hydration consistency with dedicated consumers. Node DOM tests do not prove SSR/hydration. |
| 5        | Large-collection scheduling and advanced cache features | Demand-driven  | Measure actual fan-out before a limiter; persistence, offline queues, infinite queries and shared optimistic rollback need concrete consumers and ownership contracts.        |
| 6        | Human documentation acceptance                          | Partial        | Newcomer comprehension remains an open human gate. Independent language approval for the 2026-11-12 UI strings was recorded on 2026-11-14 (PR #226).                          |
| 7        | Angular 22 / Nx upgrade                                 | Deferred       | Deliver Angular 21 controls first; revisit in a separate platform PR with pinned versions, an installed-consumer matrix and native signal-field support.                      |

## Acceptance boundaries

- New Angular 21 CVA controls proceed only after feature API review; YAML viewer/editor work is paused.
- Both packages stay on 21.x until Angular 22; the [version policy](deployment.md#version-policy) records the approved
  compatibility exceptions and migration requirements.
- After the platform upgrade, native signal-field integration is a required delivery gate for every new value control.
- `toSignalForm(FormGroup)` exposes signals over Reactive Forms; it does not create an Angular Signal Forms `FieldTree`.
- Strict installed Angular consumers cover zoneless and ZoneJS DOM modes, not SSR/hydration or every permitted peer.
- Automated dictionary, accessibility, keyboard and consumer checks are required for UI changes; a manual
  assistive-technology waiver is not a pass. See the [acceptance contract](guides/accessibility-and-localization.md).
- Local validation, CI, maintainer API approval, human acceptance, merge, deployment and publication remain separate
  gates. Exact validation evidence belongs to the PR and CI artifacts.

## Documentation

The [component roadmap](component-roadmap.md) owns the component sequence, the [gap register](gap-register.md) owns
current gaps, and the [command reference](commands.md) owns validation commands. Release history lives in
[CHANGELOG](../CHANGELOG.md), publication gates in the [deployment guide](deployment.md), demo teaching status in
[demo documentation status](documentation-refinement-roadmap.md), and query reader outcomes in the
[query documentation plan](query-documentation-plan.md).
