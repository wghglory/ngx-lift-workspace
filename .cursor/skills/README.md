# Cursor Agent Skills

This workspace provides specialized Cursor Agent Skills in `.cursor/skills/`.

## Available Skills

| Skill                     | Description                                                                                                        | Triggers / Usage                                             |
| :------------------------ | :----------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------- |
| **`review-adversarial`**  | Rigorous, line-by-line code review looking for bugs, leaks, broken public API contracts, and unhandled edge cases. | Activated during PR reviews, `/review`, or pre-merge checks. |
| **`pr-review`**           | Pre-PR code review orchestrator for local changes or branch diffs.                                                 | Reviewing local changes before creating a pull request.      |
| **`pr-address-comments`** | Interactively resolves review findings by proposing fix options and verifying with tests.                          | Addressing review comments or running `/fix-pr`.             |
| **`pr-prepare`**          | Drafts PR title and description adhering to `.github/PULL_REQUEST_TEMPLATE.md`.                                    | Preparing PR description or summarizing branch changes.      |
| **`pr-create`**           | End-to-end pull request pipeline: local review → draft body → submit via `gh`.                                     | Opening or submitting a new PR (`/write-pr`).                |
| **`commit-message`**      | Generates conventional commit messages from git diff or staged changes.                                            | Writing commit messages (`/commit-message`).                 |
| **`create-design-doc`**   | Generates UI design documents and architecture specifications from requirements.                                   | Drafting new feature architecture or component specs.        |
| **`create-month-swag`**   | Generates month-by-month project execution plans with Gantt timeline and SWAG estimates.                           | Planning release milestones and SWAG estimates.              |
