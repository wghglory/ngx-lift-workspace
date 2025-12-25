# Quick Start Guide

Get up and running with the ngx-lift monorepo in minutes!

## 🚀 Initial Setup

```bash
# 1. Navigate to workspace
cd ngx-lift-workspace

# 2. Install dependencies
npm install

# 3. Build libraries
npm run build:libs

# 4. Start demo app
npm start
```

Visit `http://localhost:4200` to see the demo app.

## 📋 Most Common Commands

### Development

```bash
npm start              # Start demo app
npm run watch:ngx      # Watch ngx-lift changes
npm run watch:clr      # Watch clr-lift changes
```

### Building

```bash
npm run build          # Build everything
npm run build:libs     # Build both libraries
npm run build:ngx      # Build ngx-lift only
npm run build:clr      # Build clr-lift only
npm run build:demo     # Build demo app for production
```

### Testing

```bash
npm test               # Run all tests
npm run test:ngx       # Test ngx-lift
npm run test:clr       # Test clr-lift
npm run test:coverage  # Run tests with coverage
```

### Code Quality

```bash
npm run lint           # Lint all projects
npm run lint:fix       # Lint and auto-fix
npm run format         # Format code with Prettier
```

### Publishing

```bash
npm run release:version   # Bump version
npm run release:publish   # Publish to npm
```

### Deployment

```bash
npm run build:demo     # Build for production
# Then deploy to Netlify or Vercel
```

## 🎯 Quick Workflows

### Developing a New Feature

```bash
# 1. Start demo app
npm start

# 2. In another terminal, watch library
npm run watch:ngx

# 3. Make changes to library
# 4. Changes auto-reload in demo app

# 5. Run tests
npm run test:ngx

# 6. Commit changes
git add .
git commit -m "feat: add new feature"
```

### Publishing a New Version

```bash
# 1. Ensure all tests pass
npm test

# 2. Build libraries
npm run build:libs

# 3. Version bump
npm run release:version

# 4. Publish
npm run release:publish
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
npm run build:libs
npm run build:demo

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
npm run build:libs
```

### Tests Fail

```bash
# Clear cache
nx reset

# Reinstall dependencies
rm -rf node_modules
npm install
```

### Demo App Won't Start

```bash
# Ensure libraries are built first
npm run build:libs
npm start
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
2. **View Project Graph**: Run `npm run graph` to visualize dependencies
3. **Run Affected Only**: Use `nx affected -t test` to test only changed code
4. **Parallel Execution**: Nx runs tasks in parallel by default
5. **Cache**: Nx caches builds for faster rebuilds

## 🎉 You're Ready!

Start developing with:

```bash
npm start
```

Happy coding! 🚀
