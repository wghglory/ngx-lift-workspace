<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects,
  targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e.
  `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using
  globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed
  without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST
  before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->

# Library and component design

For a new or changed public component, utility, operator, directive, validator, or form integration, read
[the component development workflow](docs/design/component-development.md) and use
[the lift-design skill](.agents/skills/lift-design/SKILL.md). Create or update the design spec before implementation;
present practical use cases and proposed API examples for maintainer review. Existing explicit approval remains valid
for its scope. The workflow owns industry comparisons, form applicability, Clarity demos, localization and validation.
Use the [component roadmap](docs/design/component-roadmap.md) for the new component sequence and key/value hold.

## Documentation language and examples

Maintain repository documentation in English. Chinese explanations are temporary review aids for the maintainer; provide
them in chat unless a temporary file is explicitly requested, and keep them out of committed project documentation.
Preserve supported product translations. Use ngx-lift/clr-lift names and generic application examples; omit internal
company and product identifiers from project documentation, examples, and agent guidance.
