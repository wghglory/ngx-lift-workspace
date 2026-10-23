<div align="center">

# 🚀 ngx-lift Monorepo

**Powerful Angular utilities and Clarity Design System components to supercharge your development**

[![CI](https://github.com/wghglory/ngx-lift-workspace/actions/workflows/ci.yml/badge.svg)](https://github.com/wghglory/ngx-lift-workspace/actions/workflows/ci.yml)
[![Live Demo on Vercel](https://img.shields.io/badge/Live_Demo-Vercel-black?logo=vercel)](https://ngx-lift.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Angular](https://img.shields.io/badge/Angular-21.2.17-red.svg)](https://angular.io)
[![ngx-lift npm version](https://img.shields.io/npm/v/ngx-lift.svg?label=ngx-lift&logo=npm)](https://www.npmjs.com/package/ngx-lift)
[![clr-lift npm version](https://img.shields.io/npm/v/clr-lift.svg?label=clr-lift&logo=npm)](https://www.npmjs.com/package/clr-lift)

[📖 Documentation](https://ngx-lift.vercel.app) • [🎮 Live Demo](https://ngx-lift.vercel.app) •
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

**[📦 View on npm](https://www.npmjs.com/package/ngx-lift)** • **[📖 Documentation](https://ngx-lift.vercel.app)** •
**[💻 Source Code](https://github.com/wghglory/ngx-lift-workspace/tree/main/libs/ngx-lift)**

### 🎨 clr-lift

**An Angular component library** built on top of VMware Clarity Design System:

- 🧩 **15+ Production-Ready Components** - Alerts, toasts, spinners, wizards, and more
- 🔧 **Clarity Utilities** - Enhanced datagrid state management and helpers
- 🎯 **Type-Safe** - Full TypeScript support with strict mode
- ♿ **Accessible** - Built with accessibility in mind
- 🌓 **Theme Support** - Light and dark mode support

**[📦 View on npm](https://www.npmjs.com/package/clr-lift)** •
**[📖 Documentation](https://ngx-lift.vercel.app/clr-lift)** •
**[💻 Source Code](https://github.com/wghglory/ngx-lift-workspace/tree/main/libs/clr-lift)**

### 🎮 Demo Application

A fully-featured showcase application demonstrating all capabilities of both libraries with live examples, code
snippets, and interactive demos.

**[🎮 Live Demo](https://ngx-lift.vercel.app)** •
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

### Workspace development

Follow the [quick start](docs/QUICK_START.md) for setup and the [command reference](docs/COMMANDS.md) for builds,
testing and validation. Exact tool versions live in package.json and the lockfile.

## Documentation

The [documentation index](docs/README.md) maps each topic to its canonical source:

- [Library installation and usage](libs/ngx-lift/README.md) · [Clarity package](libs/clr-lift/README.md)
- [Async/query/retry API contracts](docs/design/README.md)
- [Loading, localization and shared lifecycle](docs/guides/demo-and-library-integration.md)
- [Publishing and deployment](docs/DEPLOYMENT.md)
- [Architecture](docs/TECHNOLOGY_ANALYSIS.md), [roadmap](docs/priority-roadmap.md) and [changelog](CHANGELOG.md)

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

Contribution requirements and code conventions are maintained in [CONTRIBUTING](CONTRIBUTING.md).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links & Resources

- **🏠 Homepage**: [ngx-lift.vercel.app](https://ngx-lift.vercel.app)
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

### Quality checks

Run [the validation commands](docs/COMMANDS.md) before submitting changes. The
[integration guide](docs/guides/demo-and-library-integration.md) describes loading/localization ownership and acceptance
limits; [publishing](docs/DEPLOYMENT.md) describes release gates.
