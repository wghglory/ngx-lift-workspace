---
name: pr-create
description: >-
  End-to-end workflow to create a high-quality GitHub Pull Request: runs a local adversarial code review, drafts a
  conventional PR title and body from commits and the repository PR template, and submits via the gh CLI. Use when the
  user says "create a PR", "open PR", "submit PR", or runs /write-pr.
compatibility: Requires git and GitHub CLI (gh).
---

# Create High-Quality PR

Orchestrates the complete PR creation pipeline: local review → draft body → submit via `gh`.

## Parameter

- `base-branch` (optional): PR target branch (defaults to repository default, usually `main`). Derive default via:
  ```bash
  gh repo view --json defaultBranchRef -q .defaultBranchRef.name
  ```

## Phase 1 — Sync & Local Review

1. Fetch upstream and verify branch status:
   ```bash
   git fetch origin
   ```
2. Activate `pr-review` skill with `diff-target = origin/<base-branch>...HEAD`.
3. If major blocking issues exist, pause and ask the developer to address them via `pr-address-comments`. Proceed once
   all major issues are cleared.

## Phase 2 — Draft PR Title & Body

1. Activate `pr-prepare` skill to generate the PR title and markdown body adhering to
   `.github/PULL_REQUEST_TEMPLATE.md`.
2. Present the drafted PR title and body to the user for confirmation.

## Phase 3 — Submit via GitHub CLI

1. Ensure changes are committed and the branch is pushed to origin:
   ```bash
   git push -u origin HEAD
   ```
2. Create PR with `gh`:
   ```bash
   gh pr create --base <base-branch> --title "<pr-title>" --body "<pr-body>"
   ```
3. Output the generated PR URL to the user.
