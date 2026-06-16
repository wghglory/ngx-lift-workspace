<div align="center">

# 🚀 ngx-lift Monorepo

**Powerful Angular utilities and Clarity Design System components to supercharge your development**

[![CI](https://github.com/wghglory/ngx-lift-workspace/actions/workflows/ci.yml/badge.svg)](https://github.com/wghglory/ngx-lift-workspace/actions/workflows/ci.yml)
[![Netlify Status](https://api.netlify.com/api/v1/badges/ffc4941a-8b33-4b95-847e-d34938036bcf/deploy-status)](https://app.netlify.com/projects/ngx-lift/deploys)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Angular](https://img.shields.io/badge/Angular-21.2.17-red.svg)](https://angular.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue.svg)](https://www.typescriptlang.org)

[![ngx-lift npm version](https://img.shields.io/npm/v/ngx-lift.svg?label=ngx-lift&logo=npm)](https://www.npmjs.com/package/ngx-lift)
[![clr-lift npm version](https://img.shields.io/npm/v/clr-lift.svg?label=clr-lift&logo=npm)](https://www.npmjs.com/package/clr-lift)
[![npm downloads](https://img.shields.io/npm/dm/ngx-lift.svg)](https://www.npmjs.com/package/ngx-lift)
[![npm downloads](https://img.shields.io/npm/dm/clr-lift.svg)](https://www.npmjs.com/package/clr-lift)

[📖 Documentation](https://ngx-lift.netlify.app) • [🎮 Live Demo](https://ngx-lift.netlify.app) •
[🐛 Report Bug](https://github.com/wghglory/ngx-lift-workspace/issues) •
[💡 Request Feature](https://github.com/wghglory/ngx-lift-workspace/issues)

</div>

---

A modern monorepo containing **ngx-lift** and **clr-lift** - two powerful Angular libraries designed to enhance and
simplify your development experience. Built with Angular 21, TypeScript 5.9, and modern best practices.

## ✨ What's Inside?

### 📚 ngx-lift

**A comprehensive Angular utility library** that provides essential tools for modern Angular development:

- 🚀 **RxJS Operators** - Specialized operators for async state management, polling, and reactive patterns
- ⚡ **Signal Utilities** - Powerful signal-based utilities for Angular's Signals API
- 🔧 **Pipes** - Ready-to-use pipes for common transformations (bytes, masking, arrays)
- ✅ **Validators** - Advanced form validators (date ranges, URLs, unique values)
- 🛠️ **Utilities** - Helper functions for forms, dates, objects, and more

**[📦 View on npm](https://www.npmjs.com/package/ngx-lift)** • **[📖 Documentation](https://ngx-lift.netlify.app)** •
**[💻 Source Code](https://github.com/wghglory/ngx-lift-workspace/tree/main/libs/ngx-lift)**

### 🎨 clr-lift

**An Angular component library** built on top of VMware Clarity Design System:

- 🧩 **15+ Production-Ready Components** - Alerts, toasts, spinners, wizards, and more
- 🔧 **Clarity Utilities** - Enhanced datagrid state management and helpers
- 🎯 **Type-Safe** - Full TypeScript support with strict mode
- ♿ **Accessible** - Built with accessibility in mind
- 🌓 **Theme Support** - Light and dark mode support

**[📦 View on npm](https://www.npmjs.com/package/clr-lift)** •
**[📖 Documentation](https://ngx-lift.netlify.app/clr-lift)** •
**[💻 Source Code](https://github.com/wghglory/ngx-lift-workspace/tree/main/libs/clr-lift)**

### 🎮 Demo Application

A fully-featured showcase application demonstrating all capabilities of both libraries with live examples, code
snippets, and interactive demos.

**[🎮 Live Demo](https://ngx-lift.netlify.app)** •
**[💻 Source Code](https://github.com/wghglory/ngx-lift-workspace/tree/main/apps/demo)**

## 🚀 Quick Start

### Install the Libraries

```bash
# Install ngx-lift
npm install ngx-lift

# Install clr-lift (includes ngx-lift as peer dependency)
npm install clr-lift @clr/angular ngx-lift
```

### Use in Your Project

```typescript
// ngx-lift - RxJS Operators
import {createAsyncState, poll} from 'ngx-lift';

// ngx-lift - Signal Utilities
import {injectParams, injectQueryParams, combineFrom} from 'ngx-lift';

// clr-lift - Components
import {AlertComponent, ToastService} from 'clr-lift';
```

### Development Setup

**Prerequisites:**

- Node.js 24.x or higher
- npm 10.x or higher

```bash
# Clone the repository
git clone https://github.com/wghglory/ngx-lift-workspace.git
cd ngx-lift-workspace

# Install dependencies
npm install

# Start the demo application
npm start
```

The demo app will be available at `http://localhost:4200`.

## 📖 Development

### Project Structure

```
ngx-lift-workspace/
├── apps/
│   └── demo/              # Demo application
├── libs/
│   ├── ngx-lift/          # ngx-lift library
│   └── clr-lift/          # clr-lift library
├── dist/                  # Build outputs
└── .github/workflows/     # CI/CD workflows
```

### Common Commands

#### Development

```bash
# Start demo app
npm start

# Build all projects
npm run build

# Build only libraries
npm run build:libs

# Build specific library
npm run build:ngx
npm run build:clr

# Watch mode for development
npm run watch:ngx
npm run watch:clr
```

#### Testing

```bash
# Run all tests
npm test

# Test specific library
npm run test:ngx
npm run test:clr

# Run tests with coverage
npm run test:coverage
```

#### Linting & Formatting

```bash
# Lint all projects
npm run lint

# Lint and fix
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

#### Nx Commands

```bash
# View project graph
npm run graph

# Run affected tests
npm run affected:test

# Build affected projects
npm run affected:build

# Lint affected projects
npm run affected:lint
```

## 🧪 Testing

This project uses **Vitest** with `@analogjs/vitest-angular` for testing.

### Running Tests

```bash
# Run all tests
nx run-many -t test

# Run tests for a specific library
nx test ngx-lift
nx test clr-lift

# Run tests in watch mode
nx test ngx-lift --watch

# Run tests with coverage
nx test ngx-lift --coverage

# Run tests with UI
nx test ngx-lift --ui
```

### Test Configuration

Each library has its own `vite.config.mts` with test configuration. The test setup is in `src/test-setup.ts`.

## 🔧 Configuration Files

- **`nx.json`**: Nx workspace configuration
- **`tsconfig.base.json`**: TypeScript base configuration with path mappings
- **`package.json`**: Dependencies and scripts

## 📖 Additional Documentation

For maintainers and contributors:

- **`docs/QUICK_START.md`**: Quick start guide for new developers
- **`docs/COMMANDS.md`**: Comprehensive command reference
- **`docs/DEPLOYMENT.md`**: Publishing, deployment, and CI/CD guides

## 📚 Library Usage

### Installing Libraries

```bash
# Install ngx-lift
npm install ngx-lift

# Install clr-lift (requires ngx-lift)
npm install clr-lift ngx-lift @clr/angular
```

### Using in Your Project

```typescript
// Import from ngx-lift
import {createAsyncState, poll} from 'ngx-lift';

// Import from clr-lift
import {AlertComponent, ToastService} from 'clr-lift';
```

## 🤝 Contributing

We welcome contributions! Whether you're fixing bugs, adding features, or improving documentation, your help makes this
project better.

### How to Contribute

1. **Fork the repository** and clone it locally
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** following our [coding standards](.cursor/rules)
4. **Write/update tests** to ensure your changes work correctly
5. **Commit your changes** using [Conventional Commits](https://www.conventionalcommits.org/)
6. **Push to your fork** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request** with a clear description

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Test changes
- `chore:` Build process or auxiliary tool changes
- `perf:` Performance improvements
- `ci:` CI/CD changes

### Development Guidelines

- ✅ All code must pass ESLint and TypeScript strict mode
- ✅ Tests are required for new features (60%+ coverage minimum)
- ✅ JSDoc comments required for all exported APIs
- ✅ Follow Angular 21 best practices (signals, standalone components, OnPush)
- ✅ Use Clarity Design System components where applicable

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links & Resources

- **🏠 Homepage**: [ngx-lift.netlify.app](https://ngx-lift.netlify.app)
- **📦 npm (ngx-lift)**: [npmjs.com/package/ngx-lift](https://www.npmjs.com/package/ngx-lift)
- **📦 npm (clr-lift)**: [npmjs.com/package/clr-lift](https://www.npmjs.com/package/clr-lift)
- **🐛 Issues**: [GitHub Issues](https://github.com/wghglory/ngx-lift-workspace/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/wghglory/ngx-lift-workspace/discussions)
- **📝 Changelog**: [CHANGELOG.md](CHANGELOG.md)

## 📞 Support

- 🐛 **Found a bug?** [Open an issue](https://github.com/wghglory/ngx-lift-workspace/issues/new?template=bug_report.md)
- 💡 **Have a feature request?**
  [Request a feature](https://github.com/wghglory/ngx-lift-workspace/issues/new?template=feature_request.md)
- ❓ **Have a question?** [Start a discussion](https://github.com/wghglory/ngx-lift-workspace/discussions)

## ⭐ Show Your Support

If this project helped you, please consider giving it a ⭐ on GitHub!

---

<div align="center">

**Built with ❤️ using [Nx](https://nx.dev), [Angular](https://angular.io), and
[Clarity Design System](https://clarity.design)**

Made by [Guanghui Wang](https://github.com/wghglory)

</div>
