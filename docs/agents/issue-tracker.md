# Issue tracker: GitHub

Issues and specs live in this repository's GitHub Issues. Repository: https://github.com/wghglory/ngx-lift Use the gh
CLI from this checkout; infer the repository and host from origin.

## Operations

- Create: gh issue create --title "..." --body-file <file>
- Read: gh issue view <number> --json number,title,body,labels,comments
- List: gh issue list --state open --json number,title,body,labels
- Comment: gh issue comment <number> --body-file <file>
- Label: gh issue edit <number> --add-label "<label>"
- Close: gh issue close <number>

For multiline content, write the exact text to a temporary file and use --body-file.

## Publishing and fetching

When a skill says to publish to the issue tracker, create a GitHub issue. When it says to fetch a ticket, read the
referenced GitHub issue.

## Pull requests as a triage surface

PRs as a request surface: no.

## Related tickets

Use native sub-issues and dependencies when supported by the host and CLI. Otherwise, link children with "Part
of #<parent>", list them in the parent's task list, and record blockers with "Blocked by: #<number>".
