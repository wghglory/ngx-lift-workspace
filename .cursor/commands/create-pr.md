# Create Pull Request

Analyze code changes using MCP server and create a pull request with a well-formatted title and description following
the project's PR template.

## Objective

Connect to the GitHub MCP server, analyze all git changes (commits, diffs, affected files), and create a pull request
with:

- A descriptive title following conventional commits format (feat, fix, refactor, docs, etc.)
- A comprehensive description following the project's PR template structure
- Proper categorization of changes
- Statistics about the changes
- Checklist items for reviewers

## Process

1. **Connect to GitHub MCP Server**
   - Use the GitHub MCP server to access repository information
   - Get current branch and base branch information
   - Retrieve repository owner and name

2. **Analyze Code Changes**
   - Get all commits since the base branch
   - Analyze git diff to identify changed files
   - Categorize changes by type (added, modified, deleted)
   - Count additions and deletions
   - Identify affected projects (ngx-lift, clr-lift, demo app)
   - Determine PR type from commit messages (feat, fix, refactor, docs, style, test, chore, perf)

3. **Generate PR Title**
   - Follow conventional commits format: `type: description`
   - Extract meaningful description from commit messages
   - Capitalize first letter
   - Keep under 72 characters
   - Examples:
     - `refactor: migrate to nx monorepo workspace`
     - `feat: add new utility function`
     - `fix: resolve memory leak in component`

4. **Generate PR Description**
   - Follow the structure from `.github/PULL_REQUEST_TEMPLATE.md`
   - Include sections:
     - **Description**: Summary of changes with motivation and context
     - **Type of change**: Check appropriate boxes (Bug fix, New feature, Breaking change, Documentation, Refactoring,
       Performance, Test)
     - **Affected Projects**: List affected projects (ngx-lift, clr-lift, demo app)
     - **Changes Summary**: Statistics (files changed, additions, deletions, net change)
     - **Changed Files**: List of files grouped by status (added, modified, deleted) with line counts
     - **Checklist**: All items from the PR template
     - **Testing**: Describe tests run or needed
     - **Additional Notes**: Any relevant context

5. **Create the PR**
   - Use GitHub MCP server to create the pull request
   - Set base branch (default: `main`)
   - Set head branch (current branch)
   - Use generated title and description

## Requirements

- Must analyze actual git changes, not assume
- Title must follow conventional commits format
- Description must match the project's PR template structure
- Include accurate statistics (file counts, line changes)
- Identify all affected projects correctly
- Use proper markdown formatting
- Include all checklist items from the template

## Output Format

The PR should be created with:

**Title**: `type: concise description`

**Description**:

```markdown
# Description

[Summary of changes with motivation and context]

Fixes # (issue if applicable)

## Type of change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Refactoring (no functional changes)
- [ ] Performance improvement
- [ ] Test update

## Affected Projects

- [ ] ngx-lift
- [ ] clr-lift
- [ ] demo app

## Changes Summary

- **Files Changed**: X
- **Additions**: +X
- **Deletions**: -X
- **Net Change**: ±X

## Changed Files

### Added (X)

- `path/to/file.ts` (+X/-X)

### Modified (X)

- `path/to/file.ts` (+X/-X)

### Deleted (X)

- `path/to/file.ts`

## Checklist

- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published

## Testing

[Describe tests that were run or need to be run]

## Additional Notes

[Any other context about the pull request]
```

## Example

For a refactoring PR that migrates to Nx monorepo:

**Title**: `refactor: migrate to nx monorepo workspace`

**Description**: Comprehensive description explaining the migration, affected files, and testing approach.
