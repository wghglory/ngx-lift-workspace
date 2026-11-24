<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

Use the repository-pinned Nx CLI and resolved project configuration. For project/target discovery, task execution or
scaffolding, use the corresponding Nx skill in .agents/skills. Prefer local CLI/help and configured scripts; use an
available integration when it adds a capability the CLI does not provide.

<!-- nx configuration end-->

# Repository guidance

Build modern, robust code for the current supported platform. Existing patterns are context, not constraints against a
better implementation. Start with [library boundaries](.agents/rules/general.md), then read only the task-relevant
[guidance](.agents/rules/README.md). Configuration owns compiler/lint/coverage settings and available commands.

For new public APIs or material contract changes, use the
[component development workflow](docs/design/component-development.md) and
[lift-design skill](.agents/skills/lift-design/SKILL.md). Routine fixes within an approved contract use the existing
spec and approval; they do not need a new design cycle. The [roadmap](docs/component-roadmap.md) and
[form compatibility contract](docs/design/clr-lift/forms-compatibility-design-spec.md) retain their platform decisions.

For rendered library/demo changes, follow the
[accessibility and localization contract](docs/guides/accessibility-and-localization.md). Keep project documentation in
English with generic examples. Keep automated validation, independent human acceptance and package publication distinct.

Prefer native APIs and existing dependencies. Justify new runtime dependencies and verify their installation/bundle
cost.

Shared skills live in .agents/skills; client directories link there. Before publishing issues, read
[issue-tracker guidance](docs/agents/issue-tracker.md); before domain exploration, read
[domain guidance](docs/agents/domain.md). For spec review or a docs/codebase drift sweep, use the corresponding
spec-review or find-repo-gaps skill. monitor-ci is explicitly invoked by the user.

Edit shared guidance only in .agents/rules and preserve the client symlinks. Run pnpm run test:tools after changing
them.
