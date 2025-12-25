# Migration Plan: Moving to Nx Monorepo

## Overview

This document outlines the migration strategy for moving `ngx-lift`, `clr-lift`, and `demo-application` into the Nx
monorepo workspace (`ngx-lift-workspace`).

## Current Structure

```
ngx-lift/
├── projects/
│   ├── ngx-lift/          # Library 1
│   ├── clr-lift/          # Library 2
│   └── demo-application/  # Demo app
├── dist/                  # Build outputs
└── angular.json           # Angular workspace config
```

## Target Structure

```
ngx-lift-workspace/
├── libs/
│   ├── ngx-lift/          # Migrated library 1
│   └── clr-lift/          # Migrated library 2
├── apps/
│   └── demo/              # Migrated demo app
├── dist/                  # Build outputs
└── nx.json                # Nx workspace config
```

## Migration Steps

### Phase 1: Library Migration ✅

1. **Copy source code** from `projects/ngx-lift/src/lib/*` → `ngx-lift-workspace/libs/ngx-lift/src/lib/`
2. **Copy source code** from `projects/clr-lift/src/lib/*` → `ngx-lift-workspace/libs/clr-lift/src/lib/`
3. **Update public-api.ts** files for both libraries
4. **Update package.json** with correct metadata for publishing
5. **Configure ng-package.json** for library builds

### Phase 2: Test Migration (Jasmine → Vitest) ✅

1. **Convert test files** from Jasmine to Vitest syntax
2. **Update test configuration** in project.json
3. **Add vitest.config.mts** for each library
4. **Update imports** (TestBed, describe, it, expect)

### Phase 3: Demo Application Migration ✅

1. **Copy application code** from `projects/demo-application/src/*` → `ngx-lift-workspace/apps/demo/src/`
2. **Update imports** to use workspace library paths
3. **Configure build settings** in project.json
4. **Update assets and styles** paths

### Phase 4: Dependencies & Configuration ✅

1. **Merge dependencies** from root package.json to workspace package.json
2. **Update Angular version** compatibility (18.x → 20.x)
3. **Configure path mappings** in tsconfig.base.json
4. **Update nx.json** for build orchestration

### Phase 5: CI/CD Setup ✅

1. **GitHub Actions workflows**
   - Build and test on PR
   - Publish libraries on release
   - Deploy demo app
2. **Netlify configuration**
   - Build command
   - Publish directory
   - Redirects for SPA
3. **Vercel configuration**
   - Build settings
   - Output directory
   - Environment variables

### Phase 6: Documentation & Scripts ✅

1. **Update README** with new commands
2. **Create development guide**
3. **Document publishing workflow**
4. **Add migration notes**

## Key Changes

### Testing Framework

- **Before**: Karma + Jasmine
- **After**: Vitest + @analogjs/vitest-angular

### Build System

- **Before**: Angular CLI workspace
- **After**: Nx with Angular executors

### Versioning

- **Before**: Manual version bumps
- **After**: Nx release with git tags

### Publishing

- **Before**: `npm run publish-ngx && npm run publish-clr`
- **After**: `nx release publish` (automated)

## Commands Reference

### Development

```bash
# Start demo app
nx serve demo

# Build libraries
nx build ngx-lift
nx build clr-lift

# Build all
nx run-many -t build

# Watch mode
nx build ngx-lift --watch
```

### Testing

```bash
# Test specific library
nx test ngx-lift
nx test clr-lift

# Test all
nx run-many -t test

# Test with coverage
nx test ngx-lift --coverage
```

### Publishing

```bash
# Version bump (interactive)
nx release version

# Build and publish
nx release publish

# Publish specific library
nx release publish --projects=ngx-lift
```

### Deployment

```bash
# Build demo for production
nx build demo --configuration=production

# Preview locally
nx serve-static demo
```

## Rollback Plan

If migration fails, the original structure in `projects/` remains intact and can be used as fallback.

## Post-Migration Cleanup

After successful migration and verification:

1. Archive or remove `projects/` directory
2. Archive or remove `angular.json`
3. Update root `package.json` to point to workspace
4. Update documentation links

## Timeline

- **Phase 1-2**: 2-3 hours (Library code + tests)
- **Phase 3**: 1-2 hours (Demo app)
- **Phase 4**: 1 hour (Dependencies)
- **Phase 5**: 2-3 hours (CI/CD)
- **Phase 6**: 1 hour (Documentation)

**Total Estimated Time**: 7-11 hours

## Success Criteria

- ✅ Both libraries build successfully
- ✅ All tests pass with Vitest
- ✅ Demo app runs and displays both libraries
- ✅ Libraries can be published to npm
- ✅ Demo app deploys to Netlify/Vercel
- ✅ CI/CD pipeline runs successfully

## Notes

- Angular version bump from 18.x to 20.x may require code updates
- Clarity components compatibility should be verified
- Peer dependencies need careful review
- Test syntax conversion requires manual review
