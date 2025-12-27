# Create/Update Pull Request

Analyze code changes using MCP server and create a pull request with a well-formatted title and description following
the project's PR template.

<<<<<<< HEAD
=======
## How to Use

Type `/pr` in Cursor's chat input. The AI will automatically:

- Analyze your code changes
- Generate PR title and description
- Create or update the PR on GitHub using MCP server
- Provide you with the PR URL

>>>>>>> b7bc894 (chore: refine pr command)
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
<<<<<<< HEAD
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
=======
   - Read `git diff --stat` to see which files changed
   - Read `git diff` for key files to understand what changed
   - Categorize changes by type (added, modified, deleted)
   - Count additions and deletions
   - Identify affected projects based on file paths:
     - Files in `libs/ngx-lift/` → `ngx-lift` library
     - Files in `libs/clr-lift/` → `clr-lift` library
     - Files in `apps/demo/` → demo application
     - Files in `docs/` → documentation
     - Files in `.github/` → CI/CD
   - Determine PR type from commit messages and file changes:
     - New files → likely new features (`feat`)
     - Modified existing files → fixes, refactoring, or enhancements
     - Test files → test updates (`test`)
     - Documentation → docs updates (`docs`)
     - Config files → chore/ci changes (`chore`, `ci`)
   - Detect breaking changes:
     - Removed exports
     - Changed function signatures
     - Changed component APIs
     - Major dependency updates

3. **Generate PR Title**
   - Follow conventional commits format: `<type>(<scope>): <subject>`
   - **Types**: `feat`, `fix`, `docs`, `refactor`, `perf`, `test`, `chore`, `build`, `ci`, `style`
   - **Scope**: `ngx-lift`, `clr-lift`, `demo`, `docs`, `ci` (or empty if multiple scopes)
   - **Subject**: Use imperative mood ("add" not "added"), lowercase first letter, no period, max 50 characters
   - Extract meaningful description from commit messages
   - Examples:
     - `feat(ngx-lift): add injectQueryParams signal`
     - `fix(clr-lift): resolve tooltip positioning issue`
     - `refactor(demo): migrate to standalone components`
     - `refactor: migrate to nx monorepo workspace` (multiple scopes)
     - `docs: update API documentation`
     - `chore: update dependencies to latest versions`

4. **Generate PR Description**
   - Follow the structure from `.github/PULL_REQUEST_TEMPLATE.md`
   - Include all sections from the template:
     - **Description**: Clear, concise explanation with motivation and context
     - **Summary of Changes**: High-level summary with key changes as bullet points
     - **Type of Change**: Pre-select checkboxes based on analysis:
       - `🐛 Bug fix` if bugs fixed
       - `✨ New feature` if new functionality added
       - `💥 Breaking change` if breaking changes detected
       - `📚 Documentation update` if docs changed
       - `♻️ Refactoring` if code restructured
       - `⚡ Performance improvement` if performance improved
       - `🧪 Test update/addition` if tests added/updated
       - `🔧 Configuration change` if config files changed
       - `🎨 Style/UI update` if styling changed
       - `🔒 Security fix` if security issues addressed
     - **Affected Projects**: Check based on file paths:
       - `ngx-lift` library (files in `libs/ngx-lift/`)
       - `clr-lift` library (files in `libs/clr-lift/`)
       - `demo` application (files in `apps/demo/`)
       - Documentation (files in `docs/`)
       - CI/CD workflows (files in `.github/`)
       - Build configuration
       - Dependencies
     - **Breaking Changes**: If detected, describe impact and migration path
     - **Testing**: Test coverage checklist and test commands run
     - **Code Quality Checklist**: All items from the template
     - **Documentation**: Documentation update checklist
     - **Performance Impact**: Performance considerations
     - **Additional Context**: Any other relevant notes
>>>>>>> b7bc894 (chore: refine pr command)

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
   - When commits are appended to the branch, running `/pr` again will automatically update the PR with new changes
   - **DO NOT** ask if MCP is configured or if you should proceed - just execute the create/update action automatically

## Requirements

- **MUST automatically create or update the PR using GitHub MCP server** - never just display the content, never ask for
  permission
- **MUST assume MCP server is configured and ready** - use it directly without asking if it's available
- **MUST check for existing PR first** - if PR exists for the current branch, update it instead of creating a new one
- **MUST update PR when commits are appended** - re-running `/pr` after adding commits should update the existing PR
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

<<<<<<< HEAD
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
=======
**Description**: Follow the complete structure from `.github/PULL_REQUEST_TEMPLATE.md` including all sections:

- Description with related issue
- Summary of Changes with key changes
- Type of Change (with emoji checkboxes)
- Affected Projects
- Breaking Changes (if applicable)
- Testing (coverage checklist and test commands)
- Code Quality Checklist
- Documentation checklist
- Performance Impact
- Additional Context
- Reviewer Notes
- Dependencies
- Related PRs
>>>>>>> b7bc894 (chore: refine pr command)

## Automatic PR Management

**CRITICAL**: This command MUST automatically create or update PRs using the GitHub MCP server. The workflow is:

1. **First Run**: Analyze changes → Generate title/description → **Create PR automatically via MCP (NO QUESTIONS
   ASKED)**
2. **Subsequent Runs**: Check for existing PR → Analyze new changes → **Update existing PR automatically via MCP (NO
   QUESTIONS ASKED)**
3. **After Adding Commits**: Re-run `/pr` → **Update PR with new changes automatically (NO QUESTIONS ASKED)**

**IMPORTANT RULES:**

- The command should NEVER just display the PR content - it must always perform the create/update action
- The command should NEVER ask if MCP is configured - assume it is and use it directly
- The command should NEVER ask for permission to create/update - just do it automatically
- The MCP server is configured and ready - use it without hesitation

<<<<<<< HEAD
=======
## Analysis Tips

- **Read key files**: If many files changed, focus on the most significant ones
- **Look for patterns**: Multiple similar changes indicate a refactoring
- **Check commit messages**: They often contain the intent
- **Identify scope**: Look at file paths to determine scope
- **Detect breaking changes**:
  - Removed exports
  - Changed function signatures
  - Changed component APIs
  - Major dependency updates

>>>>>>> b7bc894 (chore: refine pr command)
## Example

For a refactoring PR that migrates to Nx monorepo:

**Title**: `refactor: migrate to nx monorepo workspace`

<<<<<<< HEAD
**Description**: Comprehensive description explaining the migration, affected files, and testing approach.

**Action**: The PR is automatically created or updated via GitHub MCP server, not just displayed.
=======
**Description**: Comprehensive description following the PR template structure, explaining the migration, affected
files, and testing approach.

**Action**: The PR is automatically created or updated via GitHub MCP server, not just displayed.

## Workflow

1. Make your code changes
2. Commit your changes
3. Type `/pr` in Cursor
4. PR is automatically created/updated with generated title and description
5. Review the PR on GitHub using the provided URL
>>>>>>> b7bc894 (chore: refine pr command)
