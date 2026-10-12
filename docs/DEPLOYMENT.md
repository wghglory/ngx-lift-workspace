# Deployment & Publishing Guide

This guide covers publishing `ngx-lift` and `clr-lift` to npm, as well as deploying the demo application.

---

## 📦 Publishing Libraries to npm

### 1. Automated Tag-Driven Publishing (Recommended)

Pushing a semver git tag triggers GitHub Actions to test, build, publish the targeted library directly to npm, and
create a GitHub Release with auto-generated release notes.

#### Step-by-Step Flow:

1. **Update version and changelog**:
   - Update `"version"` in `libs/ngx-lift/package.json` (or `libs/clr-lift/package.json`).
   - Document changes in `CHANGELOG.md` under the new version header.

2. **Commit and push to `main`**:

   ```bash
   git add libs/ngx-lift/package.json CHANGELOG.md
   git commit -m "chore(release): publish ngx-lift@21.1.1"
   git push origin main
   ```

3. **Tag and push**:
   - For `ngx-lift`:
     ```bash
     git tag ngx-lift@21.1.1
     git push origin ngx-lift@21.1.1
     ```
   - For `clr-lift`:
     ```bash
     git tag clr-lift@21.0.1
     git push origin clr-lift@21.0.1
     ```

4. **CI/CD Pipeline**:
   - The workflow detects the tag prefix (`ngx-lift@*` or `clr-lift@*`).
   - Executes unit tests and builds the targeted library.
   - Publishes to the npm registry with provenance.
   - Generates the GitHub release.

---

### 2. Manual Workflow Dispatch (GitHub Actions UI)

If publishing without a local git tag:

1. Go to **Actions** → **Publish to npm** in GitHub.
2. Click **Run workflow**.
3. Select:
   - Branch (`main`).
   - Target library (`ngx-lift` or `clr-lift`).
   - Version bump type (`patch`, `minor`, `major`) or specific version.
4. Click **Run workflow** to execute.

---

### 3. Local Verification & Packaging

Before publishing, you can verify package contents locally:

```bash
# 1. Build the library
pnpm run build:ngx

# 2. Package into tarball
cd dist/libs/ngx-lift
npm pack

# 3. Inspect tarball contents
tar -tf ngx-lift-*.tgz
```

---

## 🌐 Deploying the Demo Application

The demo application showcases both `ngx-lift` and `clr-lift` in an interactive environment.

### Production Build

```bash
pnpm run build:demo
```

The production bundle is generated in `dist/apps/demo`.

### Automated Hosting (Netlify & Vercel)

- **Netlify**: Connected via GitHub webhook. Every push to `main` deploys to
  [ngx-lift.netlify.app](https://ngx-lift.netlify.app).
- **Configuration**: Managed via `netlify.toml` in the repository root.
  - Build command: `pnpm run build:demo`
  - Publish directory: `dist/apps/demo`
