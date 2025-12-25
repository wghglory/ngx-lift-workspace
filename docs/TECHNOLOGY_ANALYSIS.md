# Technology Stack Analysis

**Last Updated**: December 2025

**Project**: ngx-lift-workspace

## Overview

This document provides a comprehensive analysis of the technology stack used in the ngx-lift workspace, including build
systems, frameworks, tools, and their configurations.

## Core Framework & Runtime

### Angular

- **Version**: 20.3.0
- **Type**: Standalone components architecture
- **Key Features**:
  - Signal-based reactivity
  - New control flow syntax (`@if`, `@for`, `@switch`)
  - Standalone components (no NgModules)
  - OnPush change detection strategy (mandatory)

### TypeScript

- **Version**: 5.9.2
- **Mode**: Strict mode enabled
- **Configuration**: `tsconfig.base.json` with path mappings for monorepo

### Zone.js

- **Version**: ~0.15.0
- **Purpose**: Angular change detection

## Build Systems & Bundlers

### Rspack (Primary Build Tool)

- **Version**: @rspack/core ^1.5.0, @rspack/cli ^1.5.0, @rspack/dev-server ^1.1.4
- **Purpose**: Primary bundler for application builds and development server
- **Configuration**: `apps/demo/rspack.config.ts`
- **Nx Plugin**: `@nx/angular-rspack` 22.0.0
- **Targets Handled**:
  - `build` - Production builds
  - `serve` - Development server
  - `serve-static` - Static file serving
  - `preview` - Preview builds
  - `build-deps` - Dependency building
  - `watch-deps` - Dependency watching

**Why Rspack?**

- Faster build times compared to Webpack
- Webpack-compatible API
- Better performance for large Angular applications
- Active development and community support

### Vite (Testing Only)

- **Version**: ^7.0.0
- **Purpose**: Test runner infrastructure for Vitest
- **Configuration**: `apps/demo/vite.config.mts`
- **Nx Plugin**: `@nx/vite` 22.0.0 (configured for `test` target only)
- **Targets Handled**:
  - `test` - Unit testing with Vitest

**Why Vite for Testing?**

- Vitest requires Vite as its underlying infrastructure
- Fast test execution with HMR support
- Excellent TypeScript support
- Plugin ecosystem for Angular testing

### Webpack (Transitive Dependency)

- **Status**: Present but not directly used
- **Source**: Transitive dependency from `@angular-devkit/build-angular`
- **Usage**: Only used by `extract-i18n` target
- **Note**: Webpack is not used for main build/serve operations

**Why Webpack is Still Present:**

- `@angular-devkit/build-angular` package includes webpack as a dependency
- Required for i18n extraction (`extract-i18n` target)
- Not used for application builds (Rspack handles that)
- Can be safely ignored for main development workflow

### Build System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Nx Workspace                         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Application Builds:                                     │
│  ┌──────────────┐                                       │
│  │   Rspack     │  ← Primary bundler                    │
│  │  (rspack)    │  ← Handles build, serve, preview     │
│  └──────────────┘                                       │
│                                                          │
│  Testing:                                               │
│  ┌──────────────┐                                       │
│  │    Vite      │  ← Test infrastructure               │
│  │  (vitest)    │  ← Handles unit tests                │
│  └──────────────┘                                       │
│                                                          │
│  i18n Extraction:                                       │
│  ┌──────────────┐                                       │
│  │   Webpack    │  ← Transitive dependency              │
│  │ (extract-i18n)│  ← Only for i18n extraction        │
│  └──────────────┘                                       │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Plugin Configuration in `nx.json`:**

```json
{
  "@nx/vite/plugin": {
    "testTargetName": "test" // Only handles test target
  },
  "@nx/rspack/plugin": {
    "buildTargetName": "build",
    "serveTargetName": "serve"
    // ... other build targets
  }
}
```

## Monorepo & Workspace Management

### Nx

- **Version**: 22.0.0
- **Purpose**: Monorepo tooling and build orchestration
- **Key Plugins**:
  - `@nx/angular` - Angular-specific tooling
  - `@nx/angular-rspack` - Rspack integration
  - `@nx/vite` - Vite/Vitest integration
  - `@nx/playwright` - E2E testing
  - `@nx/eslint` - Linting
  - `@nx/web` - Web utilities

### Project Structure

```
ngx-lift-workspace/
├── libs/
│   ├── ngx-lift/          # Core Angular utilities library
│   └── clr-lift/          # Clarity Design System extensions
├── apps/
│   ├── demo/              # Demo application (Rspack)
│   └── demo-e2e/          # E2E tests (Playwright)
└── tools/                 # Build tools and scripts
```

## Testing Framework

### Vitest (Unit Testing)

- **Version**: ^3.0.0
- **Configuration**: `apps/demo/vite.config.mts`
- **Coverage**: @vitest/coverage-v8 ^3.0.5
- **Angular Support**: @analogjs/vitest-angular ~1.19.1
- **Coverage Thresholds**:
  - Statements: 80%
  - Branches: 75%
  - Functions: 50%
  - Lines: 80%

### Playwright (E2E Testing)

- **Version**: ^1.36.0
- **Nx Plugin**: @nx/playwright 22.0.0
- **Configuration**: `apps/demo-e2e/playwright.config.ts`
- **Browsers**: Chromium, Firefox, WebKit

### Testing Architecture

- **Unit Tests**: Vitest with Angular testing utilities
- **E2E Tests**: Playwright for browser automation
- **Test Location**: Co-located with source files (`*.spec.ts`)

## UI Framework & Design System

### Clarity Design System

- **@clr/angular**: ^17.12.1
- **@clr/ui**: ^17.12.1
- **@cds/core**: ^6.16.1
- **Purpose**: Primary UI component library
- **Styling**: SASS with Clarity variables (no hard-coded colors)

### Tailwind CSS

- **Version**: ^3.4.13
- **Purpose**: Utility-first CSS framework
- **Plugin**: @tailwindcss/container-queries ^0.1.1
- **Configuration**: `apps/demo/tailwind.config.js`

## Code Quality & Linting

### ESLint

- **Version**: ^9.8.0
- **Configuration**: Flat config format (`eslint.config.mjs`)
- **Plugins**:
  - `angular-eslint` ^20.3.0
  - `eslint-plugin-import` ^2.29.1
  - `eslint-plugin-playwright` ^1.6.2
  - `eslint-plugin-simple-import-sort` ^10.0.0
- **Custom Rules**: `tools/eslint-plugin/`

### Prettier

- **Version**: ^3.3.3
- **Plugins**: prettier-plugin-tailwindcss ^0.6.8
- **Configuration**: `.prettierrc` or `prettier.config.js`

### TypeScript Compiler

- **Strict Mode**: Enabled
- **No `any` Types**: Enforced by linting rules
- **Path Mappings**: Configured in `tsconfig.base.json`

## Package Management & Publishing

### npm

- **Package Manager**: npm (via package-lock.json)
- **Publishing**: ng-packagr ~20.3.0 for Angular libraries
- **Versioning**: Nx release management

### Library Publishing

- **ngx-lift**: Published to npm
- **clr-lift**: Published to npm
- **Build Output**: `dist/libs/[library-name]`

## Development Tools

### SWC

- **@swc/core**: ^1.5.7
- **@swc-node/register**: ~1.9.1
- **Purpose**: Fast TypeScript/JavaScript compiler
- **Usage**: Used by Rspack for faster compilation

### PostCSS

- **Version**: ^8.4.5
- **Plugins**: postcss-url ~10.1.3, autoprefixer ^10.4.0
- **Purpose**: CSS processing

### Highlight.js

- **Version**: ^11.11.1
- **Purpose**: Syntax highlighting in demo application

## Additional Libraries

### Animation

- **lottie-web**: ^5.13.0
- **ngx-lottie**: ^20.0.0
- **Purpose**: Lottie animations

### Icons

- **angular-svg-icon**: ^19.1.1
- **Purpose**: SVG icon support

### Cryptography

- **node-forge**: ^1.3.3
- **Purpose**: Certificate generation and cryptography

## CI/CD & Deployment

### GitHub Actions

- **Workflows**: `.github/workflows/`
- **CI**: Continuous integration on push/PR
- **Publishing**: Automated library publishing
- **Deployment**: Demo app deployment to Netlify/Vercel

### Deployment Platforms

- **Netlify**: `netlify.toml` configuration
- **Vercel**: `vercel.json` configuration

## Version Management

### Nx Release

- **Tool**: Built-in Nx release management
- **Versioning**: Semantic versioning
- **Pre-version Command**: `npx nx run-many -t build`

## Key Architectural Decisions

### 1. Rspack Over Webpack

- **Decision**: Use Rspack as primary bundler
- **Rationale**: Faster build times, better performance
- **Trade-off**: Some webpack plugins may not be compatible

### 2. Vite for Testing Only

- **Decision**: Use Vite infrastructure only for Vitest
- **Rationale**: Vitest requires Vite, but Rspack handles builds
- **Configuration**: Vite plugin configured to only handle `test` target

### 3. Dual Build System

- **Decision**: Rspack for builds, Vite for tests
- **Rationale**: Best tool for each job
- **Configuration**: Clear separation in `nx.json` plugins

### 4. Webpack as Transitive Dependency

- **Decision**: Accept webpack as transitive dependency
- **Rationale**: Required by `@angular-devkit/build-angular` for i18n
- **Impact**: Minimal - only affects `extract-i18n` target

## Performance Considerations

### Build Performance

- **Rspack**: Significantly faster than Webpack for Angular apps
- **SWC**: Fast TypeScript compilation
- **Nx Caching**: Intelligent build caching

### Test Performance

- **Vitest**: Fast test execution with HMR
- **Parallel Execution**: Tests run in parallel where possible

### Bundle Size

- **Budget Limits**: Configured in `rspack.config.ts`
  - Initial bundle: 2MB warning, 4MB error
  - Component styles: 4KB warning, 8KB error

## Migration Notes

### From Webpack to Rspack

- **Status**: ✅ Completed
- **Configuration**: `rspack.config.ts` replaces webpack config
- **Compatibility**: Most webpack features supported

### From Karma/Jasmine to Vitest

- **Status**: ✅ Completed
- **Test Syntax**: Converted to Vitest syntax
- **Coverage**: Maintained coverage thresholds

## Future Considerations

### Potential Upgrades

- Monitor Rspack updates for new features
- Consider Angular 21+ when available
- Evaluate new testing tools as they emerge

### Maintenance

- Keep dependencies up to date
- Monitor for security vulnerabilities
- Review build performance regularly

## References

- [Angular Documentation](https://angular.io/docs)
- [Nx Documentation](https://nx.dev)
- [Rspack Documentation](https://rspack.dev)
- [Vitest Documentation](https://vitest.dev)
- [Clarity Design System](https://clarity.design)

---

**Note**: This document should be updated when significant technology changes occur in the workspace.
