# 🚀 START HERE - ngx-lift Monorepo

Welcome to the migrated ngx-lift monorepo! This guide will help you get started quickly.

## 📍 You Are Here

This is the **ngx-lift-workspace** - a modern Nx monorepo containing:

- **ngx-lift** library - Angular utilities, operators, pipes, and more
- **clr-lift** library - VMware Clarity component extensions
- **demo** application - Showcase of both libraries

## ⚡ Quick Start (5 Minutes)

```bash
# 1. Install dependencies
pnpm install

# 2. Build libraries
pnpm run build:libs

# 3. Start demo app
pnpm start
```

Visit `http://localhost:4200` to see the demo!

## 📚 Documentation Guide

### For First-Time Users

1. **START HERE** (you are here!) - Quick orientation
2. **QUICK_START.md** - Essential commands and workflows
3. **README.md** - Complete documentation

### For Developers

1. **COMMANDS.md** - All available commands (50+)
2. **README.md** - Development workflows
3. **TECHNOLOGY_ANALYSIS.md** - Tech stack analysis

### For DevOps/Deployment

1. **DEPLOYMENT.md** - Complete deployment guide
2. **README.md** - CI/CD section
3. **.github/workflows/** - GitHub Actions

## 🎯 Common Tasks

### Development

```bash
pnpm start              # Start demo app
pnpm run watch:ngx      # Watch ngx-lift changes
pnpm run watch:clr      # Watch clr-lift changes
```

### Testing

```bash
pnpm test               # Run all tests
pnpm run test:ngx       # Test ngx-lift
pnpm run test:clr       # Test clr-lift
```

### Building

```bash
pnpm run build          # Build everything
pnpm run build:libs     # Build both libraries
pnpm run build:demo     # Build demo for production
```

### Publishing

```bash
pnpm run release:version   # Bump version
pnpm run release:publish   # Publish to npm
```

### Code Quality

```bash
pnpm run lint           # Lint all projects
pnpm run format         # Format code
```

## 📖 Documentation Files

| File                       | Purpose                | When to Read                 |
| -------------------------- | ---------------------- | ---------------------------- |
| **START_HERE.md**          | Quick orientation      | First time                   |
| **QUICK_START.md**         | Essential commands     | Daily use                    |
| **README.md**              | Complete documentation | Reference                    |
| **TECHNOLOGY_ANALYSIS.md** | Tech stack analysis    | Understanding tech choices   |
| **COMMANDS.md**            | All commands           | Looking for specific command |
| **DEPLOYMENT.md**          | Deployment guide       | Setting up CI/CD             |

## 🗂️ Project Structure

```
ngx-lift-workspace/
├── libs/
│   ├── ngx-lift/          # Core Angular utilities
│   └── clr-lift/          # Clarity extensions
├── apps/
│   └── demo/              # Demo application
├── .github/workflows/     # CI/CD pipelines
└── [documentation files]  # You are here!
```

## ⏳ What You Need to Do

1. **Install dependencies**: `pnpm install`
2. **Build libraries**: `pnpm run build:libs`
3. **Run tests**: `pnpm test` (may need test conversion)
4. **Start developing**: `pnpm start`
5. **Set up CI/CD**: Add GitHub secrets
6. **Configure deployments**: Set up Netlify/Vercel

## 🎓 Learning Path

### Day 1: Get Running

1. Read this file (START_HERE.md)
2. Run quick start commands
3. Explore demo app at localhost:4200
4. Skim QUICK_START.md

### Day 2: Understand the System

1. Read README.md
2. Try different pnpm scripts
3. View project graph: `pnpm run graph`
4. Explore library source code

### Day 3: Deep Dive

1. Read COMMANDS.md
2. Read DEPLOYMENT.md
3. Set up CI/CD
4. Configure deployments

## 🆘 Need Help?

### Quick Answers

- **Build fails?** → Run `nx reset && pnpm install && pnpm run build:libs`
- **Tests fail?** → Check test imports, may need Vitest conversion
- **Demo won't start?** → Build libraries first: `pnpm run build:libs`
- **Import errors?** → Check `tsconfig.base.json` paths

### Documentation

- Check the relevant documentation file above
- Search in COMMANDS.md for specific commands
- Read troubleshooting sections in README.md

### External Resources

- [Nx Documentation](https://nx.dev)
- [Vitest Documentation](https://vitest.dev)
- [Angular Documentation](https://angular.io)

### Support

- Open an issue on GitHub
- Check existing issues
- Review workflow logs (for CI/CD issues)

## 🎯 Your First Task

Run these commands to verify everything works:

```bash
# Navigate to workspace
cd ngx-lift-workspace

# Install dependencies
pnpm install

# Build libraries
pnpm run build:libs

# Start demo
pnpm start
```

If all commands succeed, you're ready to develop! 🎉

## 💡 Pro Tips

1. **Use Nx Console**: Install the VS Code extension for a GUI
2. **View Graph**: Run `pnpm run graph` to see project dependencies
3. **Affected Commands**: Use `nx affected -t test` to test only changed code
4. **Watch Mode**: Use watch commands during development
5. **Read Documentation**: Each doc file serves a specific purpose

## 🎊 What's Next?

After getting everything running:

1. **Explore the demo app** - See both libraries in action
2. **Read library source code** - Understand the utilities
3. **Run tests** - Ensure everything works
4. **Make a change** - Try modifying a component
5. **Set up CI/CD** - Configure GitHub Actions
6. **Deploy** - Get the demo online

## 📞 Quick Links

- **Main Docs**: README.md
- **Commands**: COMMANDS.md
- **Deployment**: DEPLOYMENT.md
- **Quick Start**: QUICK_START.md
- **Tech Analysis**: TECHNOLOGY_ANALYSIS.md

## 🏁 Ready to Start?

```bash
pnpm install && pnpm run build:libs && pnpm start
```

Then open `http://localhost:4200` and start exploring!

---

**Welcome to the ngx-lift monorepo! Happy coding! 🚀**

_For detailed information, see README.md_
