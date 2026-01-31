# Code Review

Review changed files against tech standards and automatically apply fixes.

## Usage

```bash
/review          # Review local staged/unstaged changes
/review 123      # Review PR #123
```

## How It Works

### Local Changes (no PR number)

1. Find changed files via `git status` and `git diff`
2. Read files from local workspace
3. Apply fixes automatically
4. Generate report with before/after code

### Pull Request (with PR number)

1. Detect repository: `wghglory/ngx-lift-workspace` from `git remote -v`
2. Fetch PR via GitHub MCP tools (`pull_request_read`, `get_files`, `get_diff`)
3. Read file content from PR branch using `get_file_contents`
4. Report issues (read-only, no auto-fix)
5. Generate review report

## Review Checklist

Review standards are defined in `.cursor/rules/` with checklists in each file:

- `general.mdc` - TypeScript, code quality, library development, JSDoc documentation
- `angular.mdc` - Angular patterns, signals, OnPush, control flow
- `clarity.mdc` - Clarity components, SASS variables, styling (clr-lift only)
- `testing.mdc` - Test coverage, stable selectors
- `nx.mdc` - Module boundaries, workspace structure, library publishing
- `rxjs.mdc` - RxJS patterns, operators, async state management

## Priority Levels

**Critical**: Missing JSDoc for public APIs, TypeScript/ESLint errors, missing OnPush, `any` types, hard-coded colors
(clr-lift), accessibility issues

**Warnings**: Old Angular patterns, missing track functions, missing test coverage

**Suggestions**: Code style, performance optimizations

## Key Rules

- Review **ONLY changed files**, not entire codebase
- PR reviews: Read from PR branch (not local workspace)
- Local reviews: Apply fixes automatically
- PR reviews: Report issues only (read-only)
- Check JSDoc documentation for all new public APIs
- Respect library context: `ngx-lift/` (no UI) vs `clr-lift/` (Clarity UI) vs `demo/` (showcase app)
