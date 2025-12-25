# Command Reference Guide

This document provides a comprehensive list of all available commands for managing the ngx-lift monorepo.

## 📋 Table of Contents

- [Development Commands](#development-commands)
- [Build Commands](#build-commands)
- [Test Commands](#test-commands)
- [Lint & Format Commands](#lint--format-commands)
- [Publishing Commands](#publishing-commands)
- [Deployment Commands](#deployment-commands)
- [Nx-Specific Commands](#nx-specific-commands)

## 🔧 Development Commands

### Start Demo Application

```bash
npm start
# or
nx serve demo
```

Starts the demo application on `http://localhost:4200` with hot reload.

### Watch Library Changes

```bash
# Watch ngx-lift for changes
npm run watch:ngx
# or
nx build ngx-lift --watch

# Watch clr-lift for changes
npm run watch:clr
# or
nx build clr-lift --watch
```

Automatically rebuilds the library when source files change.

## 🏗️ Build Commands

### Build All Projects

```bash
npm run build
# or
nx run-many -t build
```

Builds all libraries and applications in the workspace.

### Build Libraries Only

```bash
npm run build:libs
# or
nx run-many -t build --projects=ngx-lift,clr-lift
```

Builds both ngx-lift and clr-lift libraries.

### Build Individual Library

```bash
# Build ngx-lift
npm run build:ngx
# or
nx build ngx-lift

# Build clr-lift
npm run build:clr
# or
nx build clr-lift
```

### Build Demo Application

```bash
npm run build:demo
# or
nx build demo --configuration=production
```

Builds the demo application for production.

### Build with Specific Configuration

```bash
# Development build
nx build demo --configuration=development

# Production build
nx build demo --configuration=production
```

## 🧪 Test Commands

### Run All Tests

```bash
npm test
# or
nx run-many -t test
```

### Test Individual Library

```bash
# Test ngx-lift
npm run test:ngx
# or
nx test ngx-lift

# Test clr-lift
npm run test:clr
# or
nx test clr-lift
```

### Test with Coverage

```bash
npm run test:coverage
# or
nx run-many -t test --coverage --parallel=1 && node tools/vitest/show-coverage-summary.mjs

# Coverage for specific library
nx test ngx-lift --coverage
```

### Test in Watch Mode

```bash
nx test ngx-lift --watch
```

### Test with UI

```bash
nx test ngx-lift --ui
```

Opens Vitest UI for interactive testing.

## 🎨 Lint & Format Commands

### Lint All Projects

```bash
npm run lint
# or
nx run-many -t lint
```

### Lint and Auto-fix

```bash
npm run lint:fix
# or
nx run-many -t lint --fix
```

### Lint Specific Project

```bash
nx lint ngx-lift
nx lint clr-lift
nx lint demo
```

### Format Code

```bash
npm run format
# or
prettier --write "**/*.{ts,json,css,scss,md,html}"
```

### Check Formatting

```bash
npm run format:check
# or
prettier --check "**/*.{ts,json,css,scss,md,html}"
```

## 📦 Publishing Commands

### Automated Publishing with Nx Release

#### Version Bump

```bash
npm run release:version
# or
nx release version

# Specific version type
nx release version major
nx release version minor
nx release version patch
```

#### Publish to npm

```bash
npm run release:publish
# or
nx release publish

# Publish specific library
nx release publish --projects=ngx-lift
nx release publish --projects=clr-lift
```

### Manual Publishing

#### Publish ngx-lift

```bash
npm run publish:ngx
# or
nx build ngx-lift && cd dist/libs/ngx-lift && npm publish
```

#### Publish clr-lift

```bash
npm run publish:clr
# or
nx build clr-lift && cd dist/libs/clr-lift && npm publish
```

#### Publish Both Libraries

```bash
npm run publish:all
```

### Publishing Prerequisites

```bash
# Login to npm
npm login

# Verify login
npm whoami

# Check package before publishing
npm pack
```

## 🚢 Deployment Commands

### Netlify Deployment

#### Manual Deploy

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy to production
npm run build:demo
netlify deploy --prod --dir=dist/apps/demo/browser

# Deploy preview
netlify deploy --dir=dist/apps/demo/browser
```

#### Link to Netlify Site

```bash
netlify link
```

### Vercel Deployment

#### Manual Deploy

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to production
npm run build:demo
vercel --prod --cwd dist/apps/demo/browser

# Deploy preview
vercel --cwd dist/apps/demo/browser
```

#### Link to Vercel Project

```bash
vercel link
```

## 🎯 Nx-Specific Commands

### Affected Commands

Run commands only on projects affected by recent changes:

```bash
# Test affected projects
npm run affected:test
# or
nx affected -t test

# Build affected projects
npm run affected:build
# or
nx affected -t build

# Lint affected projects
npm run affected:lint
# or
nx affected -t lint
```

### Project Graph

```bash
npm run graph
# or
nx graph
```

Opens an interactive visualization of the project dependency graph.

### Show Project Details

```bash
nx show project ngx-lift
nx show project clr-lift
nx show project demo
```

### List Projects

```bash
nx show projects
```

### Reset Nx Cache

```bash
nx reset
```

Clears the Nx cache. Useful when experiencing build issues.

### Run Multiple Targets

```bash
# Run build and test in parallel
nx run-many -t build test --parallel=3

# Run on specific projects
nx run-many -t build --projects=ngx-lift,clr-lift
```

## 🔍 Utility Commands

### Check Dependencies

```bash
# List outdated dependencies
npm outdated

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

### Clean Build Artifacts

```bash
# Remove dist folder
rm -rf dist

# Remove node_modules
rm -rf node_modules

# Clean install
rm -rf node_modules package-lock.json && npm install
```

### Generate New Library

```bash
nx generate @nx/angular:library my-new-lib
```

### Generate New Component

```bash
nx generate @nx/angular:component my-component --project=ngx-lift
```

## 🐛 Debugging Commands

### Verbose Output

```bash
nx build ngx-lift --verbose
```

### Skip Cache

```bash
nx build ngx-lift --skip-nx-cache
```

### Dry Run

```bash
nx release version --dry-run
```

## 📊 Performance Commands

### Analyze Bundle Size

```bash
nx build demo --configuration=production --stats-json
```

### Profile Build

```bash
nx build ngx-lift --profile
```

## 🔐 Environment Setup

### Set npm Registry

```bash
npm config set registry https://registry.npmjs.org/
```

### Configure Git

```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

## 📝 Notes

- Most commands support the `--help` flag for more information
- Use `--parallel=N` to control parallelization (default is 3)
- Use `--verbose` for detailed output
- Use `--dry-run` to preview changes without executing

## 🆘 Troubleshooting

### Clear All Caches

```bash
nx reset
rm -rf node_modules/.cache
rm -rf dist
```

### Reinstall Dependencies

```bash
rm -rf node_modules package-lock.json
npm install
```

### Check Nx Configuration

```bash
nx report
```

Shows Nx version and configuration details.

---

For more information, visit:

- [Nx Documentation](https://nx.dev)
- [Angular CLI Documentation](https://angular.io/cli)
- [npm Documentation](https://docs.npmjs.com/)
