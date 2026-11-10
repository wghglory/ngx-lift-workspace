---
name: find-repo-gaps
description: Find gaps between repository documentation and the current codebase, CI, releases, and tracker state. This skill should be used when the user asks for a docs/codebase drift check, a periodic gap sweep, a post-release status refresh, or wants to know which documented claims no longer match reality.
---

# Find repository gaps

Find gaps between what the repository claims and what the repository currently does. A gap is a documented claim whose evidence no longer matches source code, workflows, package metadata, tracker state, CI runs, or a recorded maintainer decision. Treat historical snapshots as evidence of a past state, not as current claims.

## Workflow

1. Read [`references/gap-taxonomy.md`](references/gap-taxonomy.md) and the workspace rules in `AGENTS.md`, `docs/README.md`, `docs/agents/`, and `docs/guides/accessibility-and-localization.md`. Fix the severity scale, disposition vocabulary, canonical sources, and human-acceptance boundary before comparing files. **Completion:** the gap classes, evidence hierarchy, and maintainer decisions are loaded.

2. Run [`scripts/collect-evidence.sh`](scripts/collect-evidence.sh) from the workspace root. Capture its output in a temporary file when a large sweep benefits from reuse. Keep every command read-only. **Completion:** evidence covers git state, package versions, npm versions, open issues and PRs, workflow runs, release records, docs inventory, status claims, workflow guards, coverage thresholds, and locale sources.

3. Pair each canonical document with its source of truth: roadmaps with tracker/CI/npm evidence, deployment docs with workflows, specs with public barrels, command docs with `package.json`, and acceptance docs with the recorded human decisions. Use `search_content`, `read_file`, and semantic navigation; dispatch parallel sub-agents when the sweep spans more than a few directories. **Completion:** every current-state claim has one paired source and one evidence line.

4. Classify every gap with an ID, class, severity, exact claim, exact evidence, and disposition. Prefer absolute paths and line numbers. Label historical statements as `Historical` rather than rewriting them. Label maintainer decisions as `Decision` and waivers as `Waived`, never `Passed`. **Completion:** every gap has a complete row and no claim rests on an unverified line-number citation.

5. Produce the report with [`assets/gap-report-template.md`](assets/gap-report-template.md). Report automated checks, independent human language acceptance, and manual assistive-technology decisions in separate sections. Report in chat by default; write `docs/gap-register.md` only when explicitly requested, and keep committed prose in English with generic maintainer and product names. **Completion:** the report is reviewable, reproducible, and contains no unsupported pass claim.

## Repo constraints

- Use `pnpm` and `pnpm exec nx` for workspace tasks, including read-only `pnpm view` registry queries; leave `npm` for local `npm pack` inspection only.
- Keep `.github/workflows/quality.yml` as the shared `workflow_call` gate, keep PR jobs parallel and affected-based, and keep coverage off the blocking PR path.
- Keep Nx Cloud enabled; do not reintroduce `neverConnectToCloud`.
- Treat `docs/README.md` as the canonical index, `CHANGELOG.md` and package manifests as version sources, and workflow runs as validation evidence.
- Treat the current `docs/gap-register.md` as the standing backlog; update it only on explicit request.
