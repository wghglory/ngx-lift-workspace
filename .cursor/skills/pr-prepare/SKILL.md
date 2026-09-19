---
name: pr-prepare
description: >-
  Generate a structured PR title and body from git commits and diffs according to the repository's
  PULL_REQUEST_TEMPLATE.md. Use when the user wants to draft a PR description, summarize branch changes, preview PR
  text, or when pr-create needs a draft.
compatibility: Requires git and .github/PULL_REQUEST_TEMPLATE.md.
---

# Generate PR Description

Produces a clean, conventional PR title and comprehensive description matching `.github/PULL_REQUEST_TEMPLATE.md`.

## Steps

### 1 — Extract Changes & Commits

- Run `git log <base-branch>..HEAD --oneline` to inspect all commits in the branch.
- Run `git diff --stat <base-branch>..HEAD` to determine touched files and affected projects:
  - `libs/ngx-lift/` → `ngx-lift`
  - `libs/clr-lift/` → `clr-lift`
  - `apps/demo/` → `demo`
  - `.github/` or `tools/` → `.github` / `tools`

### 2 — Determine PR Type & Scope

- **Type**: `feat`, `fix`, `refactor`, `perf`, `docs`, `test`, `chore`
- **Scope**: `ngx-lift`, `clr-lift`, `demo`, or specific feature (e.g., `to-signal-form`, `resource-async`)
- **Title format**: `<type>(<scope>): <concise imperative subject>` Example:
  `feat(to-signal-form): introduce reactive signal facade for Angular reactive forms`

### 3 — Populate Template Checklist with Evidence Only

- Read `.github/PULL_REQUEST_TEMPLATE.md`.
- Automatically mark checklist boxes (`[x]`) ONLY where verifiable evidence exists:
  - Unit tests: check if `*.spec.ts` files appear in the diff.
  - Type of change: check matching category based on git diff and commits.
  - Affected projects: check matching project checkboxes.
  - Breaking changes: check only if exported signatures or behaviors changed.

### 4 — Output Draft

Display the complete drafted title and markdown body for user review.
