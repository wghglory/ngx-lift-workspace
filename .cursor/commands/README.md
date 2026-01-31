# Cursor AI Commands

Custom commands for Cursor AI agent. Use the `/` prefix to execute commands.

## Available Commands

| Command                    | Description                              |
| -------------------------- | ---------------------------------------- |
| `/review [pr-number]`      | Code review of local changes or PRs      |
| `/write-pr`                | Create/update PR with AI code review     |
| `/fix-pr`                  | Generate fix plan for PR review comments |
| `/commit-message [branch]` | Generate and create commit message       |
| `/create-design-doc`       | Create design document from requirements |
| `/create-month-swag`       | Create monthly estimation document       |

## Quick Examples

```bash
/review                      # Review local changes
/review 1142                 # Review PR #1142
/write-pr                    # Create/update PR
/commit-message              # Commit staged changes
/commit-message branch       # Commit all branch changes
/fix-pr                      # Generate fix plan (no auto-fix)
```

## How It Works

1. Type `/command-name` in Cursor chat
2. Agent reads command file from `.cursor/commands/`
3. Command executes following documented steps

## Adding Commands

1. Create `.md` file in `.cursor/commands/`
2. Document purpose, usage, and steps
3. Add to this README
