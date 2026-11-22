# Agent coding rules

Canonical source for this repository's detailed coding standards. All rules are always applied. Edit these files only;
client-specific directories link here.

## Rule files

- **`general.md`** — Core standards, technologies, code quality, Definition of Done
- **`angular.md`** — Modern Angular patterns: standalone components, signals, control flow, routing
- **`clarity.md`** — Clarity Design System: components, SASS variables, styling, accessibility
- **`testing.md`** — Vitest & Playwright: unit tests, E2E tests, coverage, test patterns
- **`rxjs.md`** — RxJS patterns: observables, operators, async state, subscriptions
- **`nx.md`** — Nx workspace: project structure, boundaries, commands, dependencies
- **`component-development.md`** — Required workflow for new or changed public components

## Client links

- Cursor reads `.cursor/rules/*.mdc`, which are relative symlinks to these files. The `.mdc` extension and frontmatter
  stay intact through the link so Cursor's discovery still works.
- Claude reads `.claude/rules/*.md`, also relative symlinks to these files.
- Other agents read `AGENTS.md`, which points here.

`node --test tools/agents/rules.test.mjs` verifies every link resolves and each canonical rule is non-empty.

## Key principles

1. **Standalone components** — All components must be standalone (`standalone: true` is implicit in Angular 19+).
2. **Signals first** — Use signals for state, `computed()` for derived values, and `input()`/`output()` for I/O.
3. **Modern control flow** — Use `@if`, `@for`, `@switch` instead of structural directives.
4. **Strict typing** — No `any`, no non-null assertions (`!`). Use type guards or optional chaining.
5. **OnPush change detection** — All components use `ChangeDetectionStrategy.OnPush`.
6. **Accessibility** — ARIA attributes, keyboard navigation, and focus management where needed.
7. **Clarity tokens** — Use Clarity SASS variables, never hard-coded colors.
8. **Test coverage** — Unit tests for logic, E2E tests for user flows, 80% minimum coverage.
