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

5. **Check for Existing PR**
   - First, check if a PR already exists for the current branch using GitHub MCP server
   - Query for existing PRs with the same head branch
   - If PR exists, note the PR number for updating

6. **Create or Update the PR**
   - **If PR does NOT exist**: Use GitHub MCP server to create a new pull request
   - **If PR DOES exist**: Use GitHub MCP server to update the existing PR's title and description
   - Set base branch (default: `main`)
   - Set head branch (current branch)
   - Use generated title and description
   - **CRITICAL**: Always automatically create or update the PR using GitHub MCP server - NEVER ask the user, NEVER just
     display the content
   - **CRITICAL**: The MCP server is configured and ready - use it directly without asking for confirmation or
     permission
   - When commits are appended to the branch, running `/create-pr` again will automatically update the PR with new
     changes
   - **DO NOT** ask if MCP is configured or if you should proceed - just execute the create/update action automatically

## Requirements

- **MUST automatically create or update the PR using GitHub MCP server** - never just display the content, never ask for
  permission
- **MUST assume MCP server is configured and ready** - use it directly without asking if it's available
- **MUST check for existing PR first** - if PR exists for the current branch, update it instead of creating a new one
- **MUST update PR when commits are appended** - re-running `/create-pr` after adding commits should update the existing
  PR
- **MUST execute the action automatically** - do not ask "should I proceed" or "do you want me to create it" - just do
  it
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

## Automatic PR Management

**CRITICAL**: This command MUST automatically create or update PRs using the GitHub MCP server. The workflow is:

1. **First Run**: Analyze changes → Generate title/description → **Create PR automatically via MCP (NO QUESTIONS
   ASKED)**
2. **Subsequent Runs**: Check for existing PR → Analyze new changes → **Update existing PR automatically via MCP (NO
   QUESTIONS ASKED)**
3. **After Adding Commits**: Re-run `/create-pr` → **Update PR with new changes automatically (NO QUESTIONS ASKED)**

**IMPORTANT RULES:**

- The command should NEVER just display the PR content - it must always perform the create/update action
- The command should NEVER ask if MCP is configured - assume it is and use it directly
- The command should NEVER ask for permission to create/update - just do it automatically
- The MCP server is configured and ready - use it without hesitation

## Example

For a refactoring PR that migrates to Nx monorepo:

**Title**: `refactor: migrate to nx monorepo workspace`

**Description**: Comprehensive description explaining the migration, affected files, and testing approach.

**Action**: The PR is automatically created or updated via GitHub MCP server, not just displayed.
