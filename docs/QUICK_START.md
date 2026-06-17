# Quick Start Guide

Get up and running with the ngx-lift monorepo in minutes!

## 🚀 Initial Setup

### Prerequisites

- Node.js 24.x or higher
- pnpm 10.x or higher

### Installation

```bash
# 1. Navigate to workspace
cd ngx-lift-workspace

# 2. Install dependencies
pnpm install

# 3. Build libraries
pnpm run build:libs

# 4. Start demo app
pnpm start
```

Visit `http://localhost:4200` to see the demo app.

## 📋 Most Common Commands

### Development

```bash
pnpm start              # Start demo app
pnpm run watch:ngx      # Watch ngx-lift changes
pnpm run watch:clr      # Watch clr-lift changes
```

### Building

```bash
pnpm run build          # Build everything
pnpm run build:libs     # Build both libraries
pnpm run build:ngx      # Build ngx-lift only
pnpm run build:clr      # Build clr-lift only
pnpm run build:demo     # Build demo app for production
```

### Testing

```bash
pnpm test               # Run all tests
pnpm run test:ngx       # Test ngx-lift
pnpm run test:clr       # Test clr-lift
pnpm run test:coverage  # Run tests with coverage
```

### Code Quality

```bash
pnpm run lint           # Lint all projects
pnpm run lint:fix       # Lint and auto-fix
pnpm run format         # Format code with Prettier
```

### Publishing

```bash
pnpm run release:version   # Bump version
pnpm run release:publish   # Publish to npm
```

### Deployment

```bash
pnpm run build:demo     # Build for production
# Then deploy to Netlify or Vercel
```

## 🎯 Quick Workflows

### Developing a New Feature

```bash
# 1. Start demo app
pnpm start

# 2. In another terminal, watch library
pnpm run watch:ngx

# 3. Make changes to library
# 4. Changes auto-reload in demo app

# 5. Run tests
pnpm run test:ngx

# 6. Commit changes
git add .
git commit -m "feat: add new feature"
```

### Publishing a New Version

```bash
# 1. Ensure all tests pass
pnpm test

# 2. Build libraries
pnpm run build:libs

# 3. Version bump
pnpm run release:version

# 4. Publish
pnpm run release:publish
```

### Deploying Demo App

#### Automatic (Recommended)

```bash
# Just push to main branch
git push origin main
# GitHub Actions will handle the rest
```

#### Manual

```bash
# 1. Build everything
pnpm run build:libs
pnpm run build:demo

# 2. Deploy to Netlify
netlify deploy --prod --dir=dist/apps/demo/browser

# Or deploy to Vercel
vercel --prod --cwd dist/apps/demo/browser
```

## 🔍 Project Structure

```
ngx-lift-workspace/
├── apps/
│   └── demo/              # Demo application
│       └── src/
├── libs/
│   ├── ngx-lift/          # ngx-lift library
│   │   └── src/
│   │       ├── lib/       # Library source code
│   │       └── index.ts   # Public API
│   └── clr-lift/          # clr-lift library
│       └── src/
│           ├── lib/       # Library source code
│           └── index.ts   # Public API
├── dist/                  # Build outputs
├── .github/workflows/     # CI/CD workflows
├── package.json           # Dependencies & scripts
├── nx.json                # Nx configuration
└── tsconfig.base.json     # TypeScript configuration
```

## 📦 Library Usage

### Installing in Another Project

```bash
npm install ngx-lift
npm install clr-lift ngx-lift @clr/angular
```

### Importing

```typescript
// From ngx-lift
import {createAsyncState, poll, computedAsync} from 'ngx-lift';

// From clr-lift
import {AlertComponent, ToastService} from 'clr-lift';
```

## 🐛 Common Issues

### Build Fails

```bash
# Clear cache and rebuild
nx reset
rm -rf dist
pnpm run build:libs
```

### Tests Fail

```bash
# Clear cache
nx reset

# Reinstall dependencies
rm -rf node_modules
pnpm install
```

### Demo App Won't Start

```bash
# Ensure libraries are built first
pnpm run build:libs
pnpm start
```

## 📚 Learn More

- **Full Documentation**: See `README.md`
- **All Commands**: See `COMMANDS.md`
- **Deployment Guide**: See `DEPLOYMENT.md`
- **Tech Stack Analysis**: See `TECHNOLOGY_ANALYSIS.md`

## 🆘 Need Help?

1. Check the documentation files
2. Run `nx --help` for Nx commands
3. Visit [Nx Documentation](https://nx.dev)
4. Open an issue on GitHub

## ⚡ Pro Tips

1. **Use Nx Console**: Install the Nx Console extension for VS Code
2. **View Project Graph**: Run `pnpm run graph` to visualize dependencies
3. **Run Affected Only**: Use `nx affected -t test` to test only changed code
4. **Parallel Execution**: Nx runs tasks in parallel by default
5. **Cache**: Nx caches builds for faster rebuilds

## 🎉 You're Ready!

Start developing with:

```bash
pnpm start
```

Happy coding! 🚀
