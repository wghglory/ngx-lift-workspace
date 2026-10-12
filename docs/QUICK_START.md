# Quick Start Guide

Get up and running with the `ngx-lift` monorepo in minutes.

---

## 🚀 Initial Setup

### Prerequisites

- **Node.js**: `>= 24.0.0`
- **pnpm**: `>= 10.0.0`
- **Git**: `>= 2.30.0`

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/wghglory/ngx-lift-workspace.git
cd ngx-lift-workspace

# 2. Install dependencies
pnpm install

# 3. Build libraries
pnpm run build:libs

# 4. Start demo application
pnpm start
```

Open [http://localhost:4200](http://localhost:4200) in your browser to view the interactive demo.

---

## 📂 Workspace Structure

This monorepo is managed with [Nx](https://nx.dev) and contains two production libraries and a showcase demo app:

```
ngx-lift-workspace/
├── apps/
│   ├── demo/               # Showcase application with live examples
│   └── demo-e2e/           # Playwright E2E tests for demo app
├── libs/
│   ├── ngx-lift/           # Core Angular utility library (signals, operators, pipes, query)
│   └── clr-lift/           # Clarity Design System extension components
├── docs/                   # Workspace guides and specifications
│   ├── design/             # Architectural specifications for async & query primitives
│   ├── QUICK_START.md      # This file
│   ├── COMMANDS.md         # Full command reference
│   ├── DEPLOYMENT.md       # Publishing & deployment guides
│   ├── MIGRATIONS.md       # Version migration notes
│   └── TECHNOLOGY_ANALYSIS.md # Architecture and technology stack details
```

---

## 📋 Essential Commands

| Command               | Description                                       |
| :-------------------- | :------------------------------------------------ |
| `pnpm start`          | Start demo application at `http://localhost:4200` |
| `pnpm run watch:ngx`  | Build and watch `ngx-lift` with auto-rebuild      |
| `pnpm run watch:clr`  | Build and watch `clr-lift` with auto-rebuild      |
| `pnpm test`           | Run all unit tests across the workspace           |
| `pnpm run test:ngx`   | Run unit tests for `ngx-lift`                     |
| `pnpm run test:clr`   | Run unit tests for `clr-lift`                     |
| `pnpm run build:libs` | Build both libraries for distribution             |
| `pnpm run lint`       | Lint all projects with ESLint                     |
| `pnpm run format`     | Format code with Prettier                         |

For the complete list of available commands, see [COMMANDS.md](COMMANDS.md).

---

## 🧭 Next Steps

- **Command Reference**: See [COMMANDS.md](COMMANDS.md) for testing, building, and Nx tooling commands.
- **Async & Query Architecture**: Explore [docs/design/README.md](design/README.md) for in-depth design specifications
  of `resourceAsync`, `queryResource`, `mutateResource`, and `computedAsync`.
- **Release & Deployment**: See [DEPLOYMENT.md](DEPLOYMENT.md) for publishing libraries to npm.
- **Migration Guides**: See [MIGRATIONS.md](MIGRATIONS.md) when upgrading from earlier versions.
