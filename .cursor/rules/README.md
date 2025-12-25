# Cursor Rules Documentation

This directory contains comprehensive cursor rules for the ngx-lift workspace. These rules guide code generation, ensure
consistency, and enforce best practices across the project.

## Rule Files Overview

### `general.mdc` (Always Applied)

Core project rules and standards that apply to all code:

- Core technologies and versions
- Non-negotiable standards
- Code quality standards
- Definition of done
- Performance guidelines
- TypeScript guidelines
- Component development guidelines
- Naming conventions
- Styling guidelines
- Error handling
- Service & data layer guidelines
- Architecture & boundaries

### `angular.mdc` (Always Applied)

Angular 20 specific patterns and best practices:

- Component architecture (standalone components)
- Signal-based development
- Dependency injection patterns
- Template syntax (new control flow)
- Forms and validation
- Routing patterns
- Performance optimization
- Component communication
- Error handling
- Accessibility

### `testing.mdc` (Always Applied)

Testing guidelines for Vitest and Playwright:

- Unit testing with Vitest
- Component testing patterns
- Spies and mocks
- Test utilities
- Test selectors
- Coverage requirements
- E2E testing with Playwright
- Type safety in tests
- Common testing patterns

### `clarity.mdc` (Always Applied)

Clarity Design System guidelines:

- Component usage
- Common Clarity components (alerts, buttons, forms, datagrid, timeline)
- Styling guidelines (SASS variables)
- Component scoping
- Icons
- Accessibility
- Clarity Lift components
- Responsive design
- Theme support

### `rxjs.mdc` (Always Applied)

RxJS patterns and best practices:

- Observable creation
- Common operators
- ngx-lift operators
- Async state management
- Subscription management
- Subjects
- Error handling
- Combining observables
- Signals and Observables
- Performance optimization

### `nx.mdc` (Always Applied)

Nx workspace guidelines:

- Project structure
- Project configuration
- Nx commands
- Dependency management
- Code generation
- Build configuration
- Testing configuration
- Caching
- Affected commands
- Library publishing

## How Rules Are Applied

All rule files have `alwaysApply: true` in their frontmatter, meaning they are always active when generating or
modifying code in this workspace.

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

- **Angular**: 20.3.0
- **Nx**: 22.0.0
- **Clarity**: @clr/angular 17.12.1
- **Vitest**: 3.0.0
- **Playwright**: 1.36.0
- **TypeScript**: 5.9.2
- **ESLint**: 9.8.0

## Quick Reference

### Component Creation Checklist

- [ ] Standalone component
- [ ] `ChangeDetectionStrategy.OnPush`
- [ ] Signal inputs/outputs
- [ ] Clarity components in template
- [ ] No hard-coded colors
- [ ] ARIA attributes
- [ ] Unit tests (60%+ coverage)
- [ ] ESLint passes
- [ ] TypeScript compiles

### Service Creation Checklist

- [ ] Use `inject()` function
- [ ] Proper error handling
- [ ] RxJS operators used correctly
- [ ] Unit tests
- [ ] ESLint passes

### Library Creation Checklist

- [ ] Proper Nx project structure
- [ ] Respects module boundaries
- [ ] Exports in `index.ts`
- [ ] Unit tests
- [ ] Documentation
- [ ] ESLint passes

## Resources

- [Angular Documentation](https://angular.io/docs)
- [Nx Documentation](https://nx.dev)
- [Clarity Design System](https://clarity.design)
- [Vitest Documentation](https://vitest.dev)
- [Playwright Documentation](https://playwright.dev)
- [RxJS Documentation](https://rxjs.dev)
