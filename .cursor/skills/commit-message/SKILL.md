---
name: commit-message
description: >-
  Generate clean conventional commit messages from git diff or staged changes. Use when the user says "commit", "write a
  commit message", "generate commit message", or runs /commit-message.
compatibility: Requires git.
---

# Generate Conventional Commit Message

Analyzes git diffs and commits, producing a concise, standard commit message adhering to Conventional Commits.

## Structure

```
<type>(<scope>): <short imperative subject>

[optional body explaining motivation and key changes]
```

## Types

- `feat`: New feature or utility
- `fix`: Bug fix
- `refactor`: Code reorganization without functional change
- `perf`: Performance improvement
- `docs`: Documentation updates
- `test`: Adding or correcting tests
- `chore` / `build` / `ci`: Tooling, workflow, or dependency updates

## Common Scopes

- `ngx-lift`: Changes to core Angular utility library
- `clr-lift`: Changes to Clarity Design System library
- `demo`: Changes to showcase demo application
- Or specific feature scope: `to-signal-form`, `resource-async`, etc.

## Instructions

1. Run `git diff --cached` (or `git diff HEAD` if nothing staged) to inspect changed lines.
2. Determine the single primary intent of the commit.
3. Keep the subject line under 72 characters, lowercase first letter, no trailing period.
4. If staging is empty, inform the user which files can be staged.
