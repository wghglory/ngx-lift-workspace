---
name: pr-address-comments
description: >-
  Interactively resolve code review findings or PR comments by presenting fix options, applying chosen changes locally,
  and verifying with tests. Use when fixing review comments, addressing pre-PR feedback, or running /fix-pr. Always
  commits locally; never pushes automatically.
compatibility: Requires git.
---

# Address Review Comments

Takes review findings or PR comments, presents actionable options, applies approved fixes, and validates with test and
lint passes.

## Steps

### 1 — Analyze Findings

Map each finding to the exact file and line number. Verify the current file content to ensure line references are
up-to-date.

### 2 — Formulate Options & Ask

For each major finding:

- Propose 2-3 distinct approaches (e.g. Option A, Option B).
- Mark one as **[Recommended]** explaining why it best fits the architecture.
- Offer an "Ignore / Skip" option.
- Use `AskQuestion` when multiple distinct paths exist.

### 3 — Apply Fixes

- Apply changes using editing tools (`StrReplace`, `Write`).
- Preserve surrounding conventions and indentation.

### 4 — Verify Locally

Run validation commands:

```bash
npx nx test [affected-project]
npx nx lint [affected-project]
```

### 5 — Local Commit

Create a clean, descriptive local commit (e.g. `fix: address review findings for ...`). Do not push automatically.
