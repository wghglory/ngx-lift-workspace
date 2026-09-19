---
name: pr-review
description: >-
  Perform an adversarial pre-PR code review on local changes or branch diff before submitting a PR. Use when the user
  asks to review changes, check if code is ready for PR, runs /review, or when pr-create needs a pre-submission review
  step.
compatibility: Requires git.
---

# Pre-PR Code Review

Reviews local changes or branch commits against workspace standards using the adversarial reviewer mindset.

## Parameters

- `diff-target` (optional): Git diff range to review (e.g. `origin/main...HEAD`). If omitted, defaults to all
  uncommitted and staged changes (`HEAD`).

## Steps

### 1 — Fetch Changes

- If `diff-target` is provided: `git diff <diff-target>` and `git log <diff-target> --oneline`
- If omitted: `git status --porcelain` and `git diff HEAD` (Read full content of any untracked files with the Read
  tool).

### 2 — Adversarial Review

Activate the `review-adversarial` skill. Examine every changed line for:

- Signal reactive context violations and memory leaks
- Public API contract changes or broken TypeScript generics
- Untested code paths or shallow test assertions
- Modern Angular best practices (OnPush, modern control flow, signal inputs/outputs)
- Clarity Design System tokens and accessibility (`clr-lift`)

Classify every finding:

- 🔴 **Major**: Bugs, memory leaks, broken contracts, missing critical tests, runtime crashes.
- 🟡 **Minor**: Non-blocking improvements, minor style consistency.

### 3 — Present Findings & Route Next Steps

- Present findings structured by file.
- If Major issues exist, recommend activating `pr-address-comments` to resolve them.
- If no Major issues exist, recommend proceeding to `pr-create`.
