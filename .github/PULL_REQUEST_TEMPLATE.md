<!--
  Thank you for contributing to ngx-lift!
  Please fill out this template to help reviewers understand and review your PR efficiently.
-->

## Description

<!-- Provide a clear and concise explanation of what this PR does and the motivation behind it -->

**Issue Link:** <!-- e.g. Fixes #42, Resolves #108, or "N/A" -->

---

## Type of Change

<!-- Mark the appropriate type with [x] -->

- [ ] ✨ `feat`: New feature or utility (non-breaking change adding functionality)
- [ ] 🐛 `fix`: Bug fix (non-breaking change addressing an issue)
- [ ] ♻️ `refactor`: Code change that neither fixes a bug nor adds a feature
- [ ] ⚡ `perf`: Performance improvement
- [ ] 💥 `breaking`: Breaking change (fix or feature modifying existing public API/behavior)
- [ ] 📚 `docs`: Documentation-only change
- [ ] 🧪 `test`: Adding missing tests or correcting existing tests
- [ ] 🔧 `chore` / `build` / `ci`: Tooling, build pipeline, or dependency updates

---

## Affected Workspace Projects

<!-- Select all affected targets with [x] -->

- [ ] `ngx-lift` (core utilities library)
- [ ] `clr-lift` (Clarity Design System component library)
- [ ] `demo` (documentation & showcase app)
- [ ] `.github` / `tools` (tooling, workflows, configs)

---

## Summary of Changes

<!-- Provide a concise bulleted list of the key technical changes in this PR -->

- <!-- Key change 1 -->
- <!-- Key change 2 -->

---

## Breaking Changes & Migration Guide

<!-- If this is a breaking change, check the box and provide clear migration instructions -->

- [ ] **This PR introduces breaking changes**

<!-- If yes, detail the breaking changes and how users should migrate:
### Breaking Changes
- ...

### Migration Guide
```typescript
// Before
// ...

// After
// ...
```
-->

---

## Testing & Verification

### Verification Checklist

- [ ] Unit tests added / updated
- [ ] All unit tests pass (`npm test` or `npx nx run-many -t test`)
- [ ] Lint checks pass with zero errors (`npx nx run-many -t lint`)
- [ ] Production build succeeds (`npm run build:libs` / `npx nx build demo`)
- [ ] Interactive demo page updated and verified (if applicable)

### Test Commands Run

```bash
npx nx test ngx-lift
npx nx lint ngx-lift
npx nx test demo
npx nx build demo
```

---

## Quality Checklist

- [ ] Code strictly complies with TypeScript strict mode (no `any` types)
- [ ] All exported public APIs have comprehensive JSDoc comments with `@example`
- [ ] Components use `ChangeDetectionStrategy.OnPush`
- [ ] Signal inputs (`input()`), signal outputs (`output()`), and modern control flow (`@if`, `@for`) are used
- [ ] Clarity Angular components and design tokens used without hard-coded styles (`clr-lift`)
- [ ] No residual `console.log` or debug statements
