# ngx-lift Monorepo

A monorepo containing **ngx-lift** and **clr-lift** Angular libraries, along with a demo application showcasing their
capabilities.

[![CI](https://github.com/wghglory/ngx-lift-workspace/actions/workflows/ci.yml/badge.svg)](https://github.com/wghglory/ngx-lift-workspace/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/ngx-lift.svg)](https://www.npmjs.com/package/ngx-lift)
[![npm version](https://badge.fury.io/js/clr-lift.svg)](https://www.npmjs.com/package/clr-lift)

## 📦 Packages

### ngx-lift

A comprehensive Angular library designed to enhance and simplify your Angular development experience with utilities,
operators, pipes, signals, and validators.

**[View on npm](https://www.npmjs.com/package/ngx-lift)** | **[Documentation](https://ngx-lift.netlify.app)**

### clr-lift

An Angular library that augments VMware Clarity components with additional reusable components and utilities.

**[View on npm](https://www.npmjs.com/package/clr-lift)** | **[Documentation](https://ngx-lift.netlify.app/clr-lift)**

### Demo Application

A showcase application demonstrating the features and capabilities of both libraries.

**[Live Demo](https://ngx-lift.netlify.app)**

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher

### Installation

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

## 📦 Publishing

### Automated Publishing (Recommended)

#### Using GitHub Actions

1. Go to Actions tab in GitHub
2. Select "Publish Libraries" workflow
3. Click "Run workflow"
4. Choose version type (major, minor, patch)

#### Using Git Tags

```bash
# Create and push a version tag
git tag v1.10.4
git push origin v1.10.4
```

### Manual Publishing

```bash
# Version bump
npm run release:version

# Build and publish
npm run release:publish
```

### Individual Library Publishing

```bash
# Publish ngx-lift only
npm run publish:ngx

# Publish clr-lift only
npm run publish:clr

# Publish both
npm run publish:all
```

**Note**: You need to be logged in to npm (`npm login`) and have publish permissions.

## 🚢 Deployment

### Netlify

#### Automatic Deployment

- Push to `main` branch triggers automatic deployment
- Pull requests get preview deployments

#### Manual Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build:demo
netlify deploy --prod --dir=dist/apps/demo/browser
```

#### Configuration

The `netlify.toml` file contains all deployment settings. Required secrets:

- `NETLIFY_AUTH_TOKEN`
- `NETLIFY_SITE_ID`

### Vercel

#### Automatic Deployment

- Connected to GitHub repository
- Deploys on push to `main`

#### Manual Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Build and deploy
npm run build:demo
vercel --prod --cwd dist/apps/demo/browser
```

#### Configuration

The `vercel.json` file contains deployment settings. Required secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## 🔄 CI/CD

### GitHub Actions Workflows

#### CI Workflow (`ci.yml`)

- Runs on: Push to `main`/`develop`, Pull Requests
- Actions:
  - Lint affected projects
  - Test affected projects with coverage
  - Build affected projects
  - Upload coverage reports

#### Publish Workflow (`publish.yml`)

- Runs on: Manual trigger, Git tags
- Actions:
  - Build libraries
  - Run tests
  - Publish to npm
  - Create GitHub release

#### Deploy Demo Workflow (`deploy-demo.yml`)

- Runs on: Push to `main`, Manual trigger
- Actions:
  - Build libraries and demo app
  - Deploy to Netlify
  - Deploy to Vercel

### Required GitHub Secrets

```
NPM_TOKEN              # npm authentication token
NETLIFY_AUTH_TOKEN     # Netlify authentication token
NETLIFY_SITE_ID        # Netlify site ID
VERCEL_TOKEN           # Vercel authentication token
VERCEL_ORG_ID          # Vercel organization ID
VERCEL_PROJECT_ID      # Vercel project ID
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
- **`netlify.toml`**: Netlify deployment configuration
- **`vercel.json`**: Vercel deployment configuration
- **`.github/workflows/`**: CI/CD workflows

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

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Test changes
- `chore:` Build process or auxiliary tool changes

## 📄 License

MIT © [Guanghui Wang](https://github.com/wghglory)

## 🔗 Links

- **Homepage**: https://ngx-lift.netlify.app
- **Repository**: https://github.com/wghglory/ngx-lift-workspace
- **npm (ngx-lift)**: https://www.npmjs.com/package/ngx-lift
- **npm (clr-lift)**: https://www.npmjs.com/package/clr-lift
- **Issues**: https://github.com/wghglory/ngx-lift-workspace/issues

## 📞 Support

For questions and support, please open an issue on GitHub.

---

Built with ❤️ using [Nx](https://nx.dev) and [Angular](https://angular.io)
