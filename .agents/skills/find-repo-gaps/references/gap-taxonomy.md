# Gap taxonomy

A gap is a documented claim whose evidence no longer matches the current repository. Use one class, one severity, and one disposition per gap. Quote the claim and cite the evidence with an absolute path and line number when possible.

## Evidence hierarchy

1. Source code, public barrels, package manifests, and workflow definitions.
2. Executed checks and exact CI run records.
3. Tracker, npm registry, tag, and GitHub release records.
4. Canonical docs named by `docs/README.md`.
5. Historical specs, acceptance records, and audit snapshots.

A later source wins over an earlier one. A document that restates a source is a cache; point the cache to the source rather than treating it as independent evidence.

## Classes

| Class | Definition |
| --- | --- |
| Status drift | A roadmap, changelog, or acceptance record claims work is pending, unreleased, or in draft after tracker, npm, tag, or CI evidence says otherwise. |
| Gate drift | A checklist names a validation command, E2E scope, dry-run trigger, or publication step that the workflows do not execute. |
| API drift | A spec claims an export exists or does not exist while public barrels, tests, or packaged consumers prove the opposite. |
| Deployment drift | Workflow conditionals, failure propagation, summaries, or docs disagree about required hosts and job outcomes. |
| Acceptance drift | Human language approval, a manual assistive-technology waiver, or automated evidence is described as a pass, pending, or open incorrectly. |
| Naming drift | Committed prose contains personal handles or internal product identifiers where `AGENTS.md` requires generic names. |
| Index drift | The canonical documentation index omits a doc that workflow rules require an agent to read. |
| Duplication drift | Status, command, or contract text is copied across pages instead of linked to one canonical source. |
| Evidence drift | A line number, anchor, CI run ID, or validation snapshot no longer resolves to the cited state. |
| Historical | A dated acceptance or audit snapshot describes a past increment accurately. Preserve it and link to the current canonical status. |

## Severity

| Severity | Meaning |
| --- | --- |
| P0 | A current claim contradicts a maintainer decision, a published release, a required deployment, or a blocking acceptance gate. |
| P1 | A current claim misleads contributors about a required command, API, version, test, or open gate. |
| P2 | Low-risk prose drift, historical duplication, or a local tooling nicety. |

## Dispositions

| Disposition | Meaning |
| --- | --- |
| Fixed | The gap is resolved in the current change with evidence. |
| Deferred | The gap remains open with an owner and a reason. |
| Waived | A maintainer explicitly waived the gate. Record the date; do not record a pass. |
| Decision | A maintainer chose a direction that supersedes an older recommendation. |
| Historical | The statement remains accurate for its dated snapshot; link it to the current source. |
| False positive | Re-checking the source proved the claim accurate. |

## Historical snapshot test

Preserve a statement when it names a date, PR, issue, or increment and describes only that increment's evidence boundary. Fix a statement when it claims the present state of the roadmap, release, tracker, deployment, or acceptance gate. When a historical body and a current claim share a page, add a short current-state section above the history.

## Repo constraints

- Use `pnpm` and `pnpm exec nx` for workspace tasks; `npm` is reserved for local `npm pack` inspection.
- Keep `quality.yml` as the shared `workflow_call` workflow, PR jobs parallel and affected-based, and coverage off the blocking PR path.
- Keep Nx Cloud enabled.
- Keep committed documentation in English and use generic maintainer, package, and application names.
- Keep automated checks, independent human language acceptance, and manual assistive-technology decisions in separate report sections.
- Treat a manual assistive-technology waiver as a recorded decision, never as an approved assessment.
