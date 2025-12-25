# Migration Checklist

Use this checklist to track your migration progress and ensure everything is set up correctly.

## ✅ Migration Completed (Done by AI)

- [x] Migrate ngx-lift library source code
- [x] Migrate clr-lift library source code
- [x] Migrate demo application
- [x] Copy assets and static files
- [x] Update package.json with dependencies
- [x] Configure tsconfig.base.json with path mappings
- [x] Set up Vitest configuration for libraries
- [x] Create GitHub Actions workflows (CI, Publish, Deploy)
- [x] Create Netlify configuration (netlify.toml)
- [x] Create Vercel configuration (vercel.json)
- [x] Add npm scripts for development
- [x] Copy configuration files (tailwind, prettier, commitlint)
- [x] Create comprehensive documentation
- [x] Create PR and issue templates

## 🔧 Setup Tasks (Your Action Required)

<!-- ### Initial Setup

- [ ] Navigate to workspace: `cd ngx-lift-workspace`
- [ ] Install dependencies: `npm install`
- [ ] Verify installation: `npm list --depth=0`

### Build Verification

- [ ] Build ngx-lift: `npm run build:ngx`
- [ ] Build clr-lift: `npm run build:clr`
- [ ] Build demo app: `npm run build:demo`
- [ ] Verify dist folder contents -->

### Test Migration

<!-- - [ ] Review test files in `libs/ngx-lift/src/lib/**/*.spec.ts`
- [ ] Review test files in `libs/clr-lift/src/lib/**/*.spec.ts`
- [ ] Convert Jasmine syntax to Vitest (see guide below)
- [ ] Run tests: `npm test` -->

- [ ] Fix any failing tests
- [ ] Run tests with coverage: `npm run test:coverage`

### Development Environment

<!--
- [ ] Start demo app: `npm start`
- [ ] Verify app loads at http://localhost:4200
- [ ] Test hot reload by making a change
- [ ] Test library watch mode: `npm run watch:ngx`
- [ ] Verify changes reflect in demo app

### Code Quality

- [ ] Run linter: `npm run lint`
- [ ] Fix linting errors: `npm run lint:fix`
- [ ] Format code: `npm run format`
- [ ] Verify no linting/formatting issues -->

### GitHub Setup

- [ ] Create/update GitHub repository
- [ ] Push code to GitHub
- [ ] Go to Settings → Secrets and variables → Actions
- [ ] Add `NPM_TOKEN` secret
- [ ] Add `NETLIFY_AUTH_TOKEN` secret
- [ ] Add `NETLIFY_SITE_ID` secret
- [ ] Add `VERCEL_TOKEN` secret
- [ ] Add `VERCEL_ORG_ID` secret
- [ ] Add `VERCEL_PROJECT_ID` secret

### Netlify Setup

- [ ] Log in to Netlify (https://app.netlify.com)
- [ ] Click "Add new site" → "Import an existing project"
- [ ] Connect to GitHub repository
- [ ] Verify build settings match netlify.toml
- [ ] Trigger a manual deploy
- [ ] Verify deployment succeeds
- [ ] Check deployed site URL

### Vercel Setup

- [ ] Log in to Vercel (https://vercel.com)
- [ ] Click "Add New Project"
- [ ] Import GitHub repository
- [ ] Verify build settings match vercel.json
- [ ] Trigger a manual deploy
- [ ] Verify deployment succeeds
- [ ] Check deployed site URL

### npm Publishing Setup

- [ ] Log in to npm: `npm login`
- [ ] Verify login: `npm whoami`
- [ ] Check package names are available
- [ ] Verify package.json metadata
- [ ] Test local publish (dry run): `npm publish --dry-run`

### CI/CD Verification

- [ ] Create a test branch
- [ ] Make a small change
- [ ] Push and create PR
- [ ] Verify CI workflow runs
- [ ] Check lint, test, and build steps pass
- [ ] Merge PR
- [ ] Verify deploy workflow runs
- [ ] Check Netlify/Vercel deployments

### Publishing Verification

- [ ] Create a git tag: `git tag v1.10.4-test`
- [ ] Push tag: `git push origin v1.10.4-test`
- [ ] Verify publish workflow runs
- [ ] Check npm packages are published
- [ ] Delete test tag if needed

## 📝 Test Conversion Guide

### Common Jasmine to Vitest Conversions

#### 1. Imports

```typescript
// Before (Jasmine - no imports needed)
describe('MyComponent', () => {
  // tests
});

// After (Vitest - add imports)
import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';

describe('MyComponent', () => {
  // tests
});
```

#### 2. Spies

```typescript
// Before (Jasmine)
spyOn(service, 'method').and.returnValue(value);
spyOn(service, 'method').and.callThrough();

// After (Vitest)
vi.spyOn(service, 'method').mockReturnValue(value);
vi.spyOn(service, 'method').mockImplementation(() => value);
```

#### 3. Async Tests

```typescript
// Before (Jasmine)
it('should do something', async () => {
  await fixture.whenStable();
  // assertions
});

// After (Vitest - same syntax)
it('should do something', async () => {
  await fixture.whenStable();
  // assertions
});
```

#### 4. Matchers (mostly the same)

```typescript
// These work in both Jasmine and Vitest
expect(value).toBe(expected);
expect(value).toEqual(expected);
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(array).toContain(item);
expect(spy).toHaveBeenCalled();
expect(spy).toHaveBeenCalledWith(arg);
```

## 🔍 Verification Commands

Run these commands to verify everything works:

```bash
# 1. Check Nx installation
npx nx --version

# 2. List all projects
npx nx show projects

# 3. View project graph
npm run graph

# 4. Build all projects
npm run build

# 5. Test all projects
npm test

# 6. Lint all projects
npm run lint

# 7. Check affected projects (after making changes)
npx nx affected:graph

# 8. Run affected tests
npm run affected:test

# 9. Check for outdated dependencies
npm outdated

# 10. Verify package.json scripts
npm run
```

## 🐛 Common Issues & Solutions

### Issue: Build fails with module not found

**Solution:**

```bash
nx reset
rm -rf dist node_modules
npm install
npm run build:libs
```

### Issue: Tests fail with import errors

**Solution:**

- Add Vitest imports: `import { describe, it, expect } from 'vitest';`
- Check test-setup.ts is configured
- Verify vite.config.mts includes test files

### Issue: Demo app won't start

**Solution:**

```bash
# Build libraries first
npm run build:libs
# Then start demo
npm start
```

### Issue: Path resolution errors

**Solution:**

- Check tsconfig.base.json paths
- Ensure libraries are built
- Restart TypeScript server in IDE

### Issue: GitHub Actions fail

**Solution:**

- Check all secrets are added
- Verify workflow file syntax
- Check Node version matches (20.x)
- Review workflow logs for specific errors

## 📊 Success Criteria

Your migration is complete when:

- [ ] All dependencies install without errors
- [ ] Both libraries build successfully
- [ ] Demo app builds for production
- [ ] All tests pass (after conversion)
- [ ] Linting passes with no errors
- [ ] Demo app runs locally
- [ ] GitHub Actions workflows run successfully
- [ ] Demo app deploys to Netlify
- [ ] Demo app deploys to Vercel
- [ ] Libraries can be published to npm

## 📚 Reference Documents

- **README.md** - Main documentation
- **QUICK_START.md** - Quick start guide
- **COMMANDS.md** - All available commands
- **DEPLOYMENT.md** - Deployment instructions
- **MIGRATION_SUMMARY.md** - Detailed migration info
- **MIGRATION_PLAN.md** - Original migration plan
- **MIGRATION_COMPLETE.md** - Migration completion summary

## 🎯 Next Steps After Completion

1. **Update README badges** with correct URLs
2. **Set up branch protection** rules on GitHub
3. **Configure Dependabot** for dependency updates
4. **Add code coverage** reporting (Codecov)
5. **Set up Nx Cloud** for distributed caching (optional)
6. **Create Storybook** for component documentation (optional)
7. **Add E2E tests** with Playwright (optional)
8. **Set up monitoring** for deployed apps (optional)

## 📞 Need Help?

- Check the documentation files
- Review Nx documentation: https://nx.dev
- Check Vitest documentation: https://vitest.dev
- Open an issue on GitHub
- Review workflow logs for errors

---

**Last Updated**: December 22, 2025

**Status**: Ready for your action! Start with `npm install`
