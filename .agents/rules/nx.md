---
globs: ['nx.json', '**/project.json', '**/package.json', '**/tsconfig*.json']
alwaysApply: false
---

# Workspace and package validation

Use the resolved Nx project graph and targets; inferred configuration may not be visible in project.json alone. Prefer
package-manager-prefixed Nx commands and existing scripts, discovering unfamiliar options through --help.

- Respect project and package boundaries. Consumers must resolve supported public entry points without relying on source
  aliases, private files or undeclared dependencies.
- Match checks to the change. Use focused targets while iterating, then the applicable CI/release gates from the current
  scripts and [command reference](../../docs/commands.md). Documentation changes need formatting/link/tooling checks,
  not a redundant component/browser run unless the changed behavior or tooling warrants it.
- Public package changes need the installed-consumer checks as well as source compilation. Verify peer compatibility and
  relevant bundle/dependency costs; lazy loading alone does not prove dependency isolation.
- Preserve the maintained client symlinks when editing shared agent guidance; run the tooling checks for those changes.
