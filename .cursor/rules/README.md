# Cursor Rules

Comprehensive rules for code generation, consistency, and best practices. All rules are always applied.

## Rule Files

- **`general.mdc`** - Core standards, technologies, code quality, Definition of Done
- **`angular.mdc`** - Angular 19 patterns: standalone components, signals, control flow, routing
- **`clarity.mdc`** - Clarity Design System: components, SASS variables, styling, accessibility
- **`testing.mdc`** - Vitest & Playwright: unit tests, E2E tests, coverage, test patterns
- **`rxjs.mdc`** - RxJS patterns: observables, operators, async state, subscriptions
- **`nx.mdc`** - Nx workspace: project structure, boundaries, commands, dependencies

## Key Principles

1. **TypeScript Strict Mode**: All code must pass strict TypeScript compilation
2. **No `any` Types**: Avoid `any` types; use proper types or `unknown` with type guards
3. **Signals First**: Prefer Angular Signals over Observables for component state
4. **OnPush Strategy**: All components must use `ChangeDetectionStrategy.OnPush`
5. **Clarity Components**: Always use Clarity Angular components over raw HTML
6. **No Hard-coded Colors**: Use Clarity SASS variables for all colors
7. **Accessibility**: ARIA attributes and keyboard navigation by default
8. **Testing**: 60%+ coverage with Vitest for unit tests, Playwright for E2E
9. **Linting**: All code must pass ESLint without errors or warnings
10. **Nx Boundaries**: Respect project boundaries; no circular dependencies

## Technology Stack

- **Angular**: 20.0.1
- **Nx**: 22.1.0
- **Clarity**: @clr/angular 17.12.1
- **Vitest**: 3.0.5
- **Playwright**: 1.36.0
- **TypeScript**: 5.9.2
- **ESLint**: 9.8.0
- **Transloco**: @jsverse/transloco 7.5.1
- **ngx-lift**: 1.10.3 (external package)
- **clr-lift**: 1.10.2 (external package)

## Quick Checklists

**Component**: Standalone, OnPush, signals, Clarity components, no hard-coded colors, ARIA, tests (60%+), ESLint passes

**Service**: `inject()` function, error handling, RxJS operators, tests, ESLint passes

**Library**: Nx structure, module boundaries, exports in `index.ts`, tests, documentation, ESLint passes

## Resources

- [Angular Documentation](https://angular.io/docs)
- [Nx Documentation](https://nx.dev)
- [Clarity Design System](https://clarity.design)
- [Vitest Documentation](https://vitest.dev)
- [Playwright Documentation](https://playwright.dev)
- [RxJS Documentation](https://rxjs.dev)
- [Transloco Documentation](https://transloco.vercel.app)
- [ngx-lift Documentation](https://github.com/vmware/ngx-lift)
- [clr-lift Documentation](https://github.com/vmware/clr-lift)
