# Documentation and codebase gap register

Updated 2026-11-16. This register owns current documentation and codebase gaps. Resolved delivery records belong to the
corresponding PR and CI artifacts, not here.

Repeat the sweep with the project skill at `.agents/skills/find-repo-gaps/SKILL.md`. Its `scripts/collect-evidence.sh`
gathers read-only evidence with a recorded workflow-run window and explicit `SKIPPED` / `EVIDENCE UNAVAILABLE` markers;
`references/gap-taxonomy.md` defines classes, severity and dispositions. Report in chat by default and update this
register only on explicit request.

## Severity and disposition

| Severity | Meaning                                                                                                            |
| -------- | ------------------------------------------------------------------------------------------------------------------ |
| P0       | A current claim contradicts a maintainer decision, a published release, a required deployment, or a blocking gate. |
| P1       | A current claim misleads contributors about a required command, API, version, test, or open gate.                  |
| P2       | Low-risk prose drift, historical duplication, or a local tooling nicety.                                           |

Dispositions: `Fixed` in the current PR; `Deferred` with an owner and reason; `Waived` by a dated maintainer decision;
`Decision` superseding an older recommendation; `Historical` for a dated snapshot; `False positive` after re-checking
the source.

## Open and deferred gaps

| ID   | Severity | Class             | Gap                                                                                                                                                                   | Owner and reason                                                                             |
| ---- | -------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| G-40 | P2       | Decision          | `mutateResource` callback faults bypass the configurable query diagnostic hook.                                                                                       | Maintainer: decide whether to share the diagnostic channel, preserving callback isolation.   |
| G-44 | P2       | Architecture      | The D1–D5 architecture deepening backlog remains open, starting with the localization registration seam D2. See [implementation gaps](design/implementation-gaps.md). | Architecture owner: schedule separately; no interface change is implied.                     |
| G-46 | P2       | Gate drift        | `monitor-ci` and `nx-cloud-*` skills do not verify that Nx Cloud CIPE data is available for deploy/publish paths.                                                     | Skills owner: validate CIPE availability before relying on those skills for those workflows. |
| G-47 | P2       | Duplication drift | Deploy and publish workflows duplicate status icon/badge helpers and summary heredocs.                                                                                | CI owner: extract a shared mapping when both summaries are next edited.                      |

## Intentional decisions, not gaps

- Angular 22 and the Nx major upgrade remain deferred; native signal-field support follows that upgrade for new value
  controls.
- `Decision` (2026-11-16, maintainer): Angular and Nx patch pins moved to 21.2.25 and 22.7.10 to clear published
  production and development advisories. Major versions stay deferred; the official registry is the default and the
  restricted-environment mirror remains a documented local opt-in in `.npmrc`.
- Both packages stay on 21.x; the approved 21.x compatibility exceptions remain documented in the
  [version policy](deployment.md#version-policy).
- YAML viewer/editor work is paused; its draft spec is retained for future reference.
- Vercel is the only production deployment target on main and the canonical public host. This is a topology decision,
  not a health claim; deployment outcomes are evidenced by their CI run records.
- `Decision` (2026-11-14, maintainer): the project is personally maintained. The manifest author metadata and the
  repository owner URLs are the authoritative project identity, not internal company or product identifiers. No
  replacement identity, organization rename or URL migration is planned, so the naming-drift finding is closed rather
  than rewritten.
- Gate definitions live in the [roadmap's acceptance boundaries](priority-roadmap.md#acceptance-boundaries); this
  register records gaps, not gate status.

## Acceptance boundary

- The [acceptance contract](guides/accessibility-and-localization.md) owns the independent language approval for all
  eleven locales (2026-11-08, plus the 2026-11-12 `toSignalForm` strings approved on 2026-11-14 in PR #226) and the
  manual assistive-technology waiver (2026-11-10). The waiver is not a pass, and automated dictionary, accessibility,
  keyboard and consumer checks remain required for UI changes.
- Newcomer comprehension remains a separate human gate for documentation work.
- Record exact validation commands, results and CI run IDs in the pull request; this register does not replace CI
  artifacts.
