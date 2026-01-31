# Create Commit Message

## Overview

Generates a conventional commit message and automatically creates the commit. Supports staged changes, branch changes,
and amend operations.

## Usage

```
/commit-message [options]
```

**Options:**

- `amend` - Amend last commit
- `branch` or `all` - All branch changes (vs main)
- `detailed` - Include testing, screenshots, metadata sections

**Examples:**

- `/commit-message` - Staged changes (default)
- `/commit-message amend` - Amend last commit
- `/commit-message branch` - All branch changes
- `/commit-message branch detailed` - Detailed branch commit

## Steps

1. **Parse input**
   - Extract options: `amend`, `branch`/`all`, `detailed`

2. **Get branch info**
   - Get current branch name
   - Block commits to "main"

3. **Get changes**
   - **amend**: `git diff HEAD^ HEAD` + `git diff --staged`
   - **branch/all**: `git diff main...HEAD` (fallback: `origin/main...HEAD`)
   - **default**: `git diff --staged`

4. **Generate message**
   - Format: `type: subject` (50-72 chars)
   - Types: `docs`, `fix`, `feat`, `refactor`, `style`, `test`, `chore`, `perf`, `ci`
   - Determine type from files changed
   - Follow [Conventional Commits](https://www.conventionalcommits.org/) specification

5. **Message structure**
   - **detailed**: Summary + description + fix points + testing + screenshots + metadata
   - **simple**: Summary line only

6. **Validate**
   - Conventional commit format
   - Commitlint validation (configured in `commitlint.config.js`)

7. **Create commit**
   - Check for staged changes (skip if `amend`)
   - If no staged changes: STOP with instructions to stage files
   - Create commit with `required_permissions: ['all']`:
     - `amend`: `git commit --amend -m "[message]"`
     - `default`: `git commit -m "[message]"`
   - Display commit summary (SHA, message, file count)
   - Do NOT push automatically

## Notes

- Auto-creates commit for staged changes and amend operations
- Branch options generate message only (stage files first)
- Never auto-pushes commits
- Git operations require `required_permissions: ['all']`
