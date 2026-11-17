<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

## General Guidelines for working with Nx

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

For a new or changed public component, utility, operator, directive, pipe, validator, service, form integration, or
entry point, read [the component development workflow](docs/design/component-development.md) and use
[the lift-design skill](.agents/skills/lift-design/SKILL.md). Follow its admission gate, docs-only spec PR and
[spec-review](.agents/skills/spec-review/SKILL.md) sequence; implement only within an explicitly approved scope, and
existing approval remains valid for its scope. The workflow owns industry comparisons, form applicability, Clarity
demos, localization and validation; see
[admission criteria](.agents/skills/lift-design/references/admission-criteria.md) and
[review aspects](.agents/skills/spec-review/references/review-aspects.md) for the two gates. Use the
[component roadmap](docs/component-roadmap.md) for the Angular 21 delivery sequence and deferred platform work.

## Documentation language and examples

For every new or changed UI in either library or the demo app, follow the
[accessibility and language acceptance contract](docs/guides/accessibility-and-localization.md) during generation and
review. Deliver keyboard/focus behavior, semantic names/state, and every owned visible/announced message in all
supported locales together with the implementation and demo. Run the applicable accessibility, translation, and browser
checks. Report independent human language and assistive-technology acceptance separately from automated checks.

Maintain repository documentation in English. Chinese explanations are temporary review aids for the maintainer; provide
them in chat unless a temporary file is explicitly requested, and keep them out of committed project documentation.
Preserve supported product translations. Use ngx-lift/clr-lift names and generic application examples; omit internal
company and product identifiers from project documentation, examples, and agent guidance.

## Dependency policy

Prefer browser APIs and existing supported dependencies. Add a runtime dependency only when important, approved use
cases justify its maintenance, installation, bundle, and integration costs. Optional heavyweight features must not
require an engine installation for ordinary consumers; lazy loading alone does not establish dependency isolation.
Record the alternatives and consumer evidence in the feature spec before adding a dependency.

## Agent skills

Project design and gap skills live in `.agents/skills/` and are reached through the pointers in this file and
`docs/README.md`. The `.github/skills/` and `.opencode/skills/` directories hold the Nx skills, and `.cursor/skills/`
holds Cursor-only skills; those are client-specific sets and are not the canonical home for project design skills.

### Issue tracker

Before reading or publishing issues and specs, read `docs/agents/issue-tracker.md`.

### Triage labels

Before triaging issues, read `docs/agents/triage-labels.md`.

### Domain docs

Use the single-context layout. Before domain exploration, read `docs/agents/domain.md`.

### Gap scanning

Before a periodic docs/codebase gap sweep, post-release status refresh, or documentation drift check, read
`.agents/skills/find-repo-gaps/SKILL.md`. Report findings in chat and track outstanding work in GitHub issues;
`docs/design/` specifications and `docs/guides/accessibility-and-localization.md` are the durable contracts.

### Review aspects

Before approving a public API spec, read `.agents/skills/spec-review/SKILL.md`. Code review covers an implementation
diff; spec review covers admission, specification quality, contracts, language, evidence, and codebase gaps before code
exists. Report evidence using the sections defined by the
[acceptance contract](docs/guides/accessibility-and-localization.md).
