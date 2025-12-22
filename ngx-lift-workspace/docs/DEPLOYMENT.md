# Deployment Guide

This guide covers deploying the demo application to Netlify and Vercel, as well as publishing the libraries to npm.

## 📦 Publishing Libraries to npm

### Prerequisites

1. **npm Account**: Create an account at [npmjs.com](https://www.npmjs.com/)
2. **npm Login**: Authenticate locally
   ```bash
   npm login
   ```
3. **Publishing Rights**: Ensure you have publish permissions for `ngx-lift` and `clr-lift`

### Automated Publishing (Recommended)

#### Method 1: GitHub Actions Workflow

1. **Set up npm Token**:
   - Go to npmjs.com → Account Settings → Access Tokens
   - Generate a new token with "Automation" type
   - Add to GitHub Secrets as `NPM_TOKEN`

2. **Trigger Workflow**:
   - Go to GitHub Actions tab
   - Select "Publish Libraries" workflow
   - Click "Run workflow"
   - Choose version type (major, minor, patch)

#### Method 2: Git Tags

```bash
# Create a new version tag
git tag v1.10.4

# Push the tag
git push origin v1.10.4
```

This automatically triggers the publish workflow.

### Manual Publishing

#### Using Nx Release (Recommended)

```bash
# 1. Version bump (interactive)
nx release version

# Or specify version type
nx release version patch
nx release version minor
nx release version major

# 2. Build and publish
nx release publish

# Publish specific library
nx release publish --projects=ngx-lift
nx release publish --projects=clr-lift
```

#### Traditional npm Publish

```bash
# Publish ngx-lift
npm run build:ngx
cd dist/libs/ngx-lift
npm publish
cd ../../..

# Publish clr-lift
npm run build:clr
cd dist/libs/clr-lift
npm publish
cd ../../..
```

### Publishing Checklist

- [ ] All tests pass (`npm test`)
- [ ] Linting passes (`npm run lint`)
- [ ] Version updated in `package.json`
- [ ] CHANGELOG updated
- [ ] README updated if needed
- [ ] Build successful (`npm run build:libs`)
- [ ] Logged in to npm (`npm whoami`)

### Version Strategy

This project follows [Semantic Versioning](https://semver.org/):

- **Major (x.0.0)**: Breaking changes
- **Minor (1.x.0)**: New features, backward compatible
- **Patch (1.0.x)**: Bug fixes, backward compatible

## 🌐 Deploying Demo App to Netlify

### Automated Deployment

#### Setup

1. **Connect Repository**:
   - Go to [Netlify](https://app.netlify.com/)
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub repository

2. **Configure Build Settings**:
   - Build command:
     `npm ci && npx nx run-many -t build --projects=ngx-lift,clr-lift && npx nx build demo --configuration=production`
   - Publish directory: `dist/apps/demo/browser`
   - Base directory: (leave empty)

3. **Add Environment Variables** (if needed):
   - Go to Site settings → Environment variables
   - Add any required variables

4. **Get Site ID and Auth Token**:
   - Site ID: Site settings → General → Site details → API ID
   - Auth Token: User settings → Applications → Personal access tokens

5. **Add GitHub Secrets**:
   - `NETLIFY_AUTH_TOKEN`: Your personal access token
   - `NETLIFY_SITE_ID`: Your site ID

#### Automatic Deployment Triggers

- **Push to `main`**: Deploys to production
- **Pull Requests**: Creates preview deployments

### Manual Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build the project
npm run build:libs
npm run build:demo

# Deploy to production
netlify deploy --prod --dir=dist/apps/demo/browser

# Deploy preview
netlify deploy --dir=dist/apps/demo/browser
```

### Netlify Configuration

The `netlify.toml` file contains:

```toml
[build]
  base = "."
  command = "npm ci && npx nx run-many -t build --projects=ngx-lift,clr-lift && npx nx build demo --configuration=production"
  publish = "dist/apps/demo/browser"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "20"
  NPM_VERSION = "10"
```

### Netlify CLI Commands

```bash
# Check deployment status
netlify status

# View site info
netlify sites:list

# Open site in browser
netlify open

# View deployment logs
netlify logs

# Link to existing site
netlify link
```

## ▲ Deploying Demo App to Vercel

### Automated Deployment

#### Setup

1. **Connect Repository**:
   - Go to [Vercel](https://vercel.com/)
   - Click "Add New Project"
   - Import your GitHub repository

2. **Configure Build Settings**:
   - Framework Preset: Other
   - Build Command:
     `npm ci && npx nx run-many -t build --projects=ngx-lift,clr-lift && npx nx build demo --configuration=production`
   - Output Directory: `dist/apps/demo/browser`
   - Install Command: `npm ci`

3. **Get Project IDs**:
   - Project ID: Project Settings → General
   - Org ID: Account Settings → General

4. **Get Auth Token**:
   - Account Settings → Tokens
   - Create new token

5. **Add GitHub Secrets**:
   - `VERCEL_TOKEN`: Your authentication token
   - `VERCEL_ORG_ID`: Your organization ID
   - `VERCEL_PROJECT_ID`: Your project ID

#### Automatic Deployment Triggers

- **Push to `main`**: Deploys to production
- **Pull Requests**: Creates preview deployments

### Manual Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Build the project
npm run build:libs
npm run build:demo

# Deploy to production
vercel --prod --cwd dist/apps/demo/browser

# Deploy preview
vercel --cwd dist/apps/demo/browser
```

### Vercel Configuration

The `vercel.json` file contains:

```json
{
  "version": 2,
  "buildCommand": "npm ci && npx nx run-many -t build --projects=ngx-lift,clr-lift && npx nx build demo --configuration=production",
  "outputDirectory": "dist/apps/demo/browser",
  "framework": null,
  "installCommand": "npm ci",
  "devCommand": "npx nx serve demo"
}
```

### Vercel CLI Commands

```bash
# Check deployment status
vercel ls

# View project info
vercel inspect

# View deployment logs
vercel logs

# Link to existing project
vercel link

# Pull environment variables
vercel env pull

# Set environment variable
vercel env add
```

## 🔄 CI/CD Workflows

### GitHub Actions Setup

All workflows are in `.github/workflows/`:

1. **`ci.yml`**: Continuous Integration
   - Runs on: Push, Pull Requests
   - Actions: Lint, Test, Build

2. **`publish.yml`**: Library Publishing
   - Runs on: Manual trigger, Git tags
   - Actions: Build, Test, Publish to npm

3. **`deploy-demo.yml`**: Demo Deployment
   - Runs on: Push to main, Manual trigger
   - Actions: Build, Deploy to Netlify/Vercel

### Required GitHub Secrets

Add these in: Repository Settings → Secrets and variables → Actions

```
NPM_TOKEN              # npm authentication token
NETLIFY_AUTH_TOKEN     # Netlify authentication token
NETLIFY_SITE_ID        # Netlify site ID
VERCEL_TOKEN           # Vercel authentication token
VERCEL_ORG_ID          # Vercel organization ID
VERCEL_PROJECT_ID      # Vercel project ID
```

## 🔍 Monitoring Deployments

### Netlify

- **Dashboard**: https://app.netlify.com/
- **Deployment Logs**: Site → Deploys → Click on deployment
- **Analytics**: Site → Analytics
- **Functions**: Site → Functions (if using)

### Vercel

- **Dashboard**: https://vercel.com/dashboard
- **Deployment Logs**: Project → Deployments → Click on deployment
- **Analytics**: Project → Analytics
- **Logs**: Project → Logs

### npm

- **Package Page**: https://www.npmjs.com/package/ngx-lift
- **Download Stats**: Package page → Statistics
- **Versions**: Package page → Versions

## 🐛 Troubleshooting

### Build Fails on Netlify/Vercel

1. **Check Node Version**:

   ```toml
   # netlify.toml
   [build.environment]
     NODE_VERSION = "20"
   ```

2. **Clear Build Cache**:
   - Netlify: Site settings → Build & deploy → Clear cache
   - Vercel: Redeploy with "Clear cache"

3. **Check Build Logs**:
   - Review error messages in deployment logs
   - Ensure all dependencies are installed

### npm Publish Fails

1. **Check Authentication**:

   ```bash
   npm whoami
   npm login
   ```

2. **Check Package Name**:
   - Ensure package name is available
   - Check for typos in package.json

3. **Check Version**:
   - Version must be higher than published version
   - Use `npm version patch/minor/major`

### Deployment Preview Not Working

1. **Check PR Settings**:
   - Netlify: Site settings → Build & deploy → Deploy contexts
   - Vercel: Project settings → Git → Deploy Previews

2. **Check Branch Protection**:
   - Ensure CI checks are passing
   - Review required status checks

## 📊 Best Practices

### Pre-Deployment Checklist

- [ ] Run all tests locally
- [ ] Check linting
- [ ] Test build locally
- [ ] Review changes
- [ ] Update version numbers
- [ ] Update CHANGELOG
- [ ] Create git tag (for releases)

### Post-Deployment Verification

- [ ] Check deployment logs
- [ ] Test deployed application
- [ ] Verify npm package
- [ ] Check analytics
- [ ] Monitor error logs

### Security

- [ ] Keep secrets secure
- [ ] Rotate tokens regularly
- [ ] Use environment variables for sensitive data
- [ ] Enable 2FA on npm, Netlify, Vercel
- [ ] Review access permissions

## 📞 Support

For deployment issues:

1. Check deployment logs
2. Review this guide
3. Check platform status pages:
   - [Netlify Status](https://www.netlifystatus.com/)
   - [Vercel Status](https://www.vercel-status.com/)
   - [npm Status](https://status.npmjs.org/)
4. Open an issue on GitHub

---

**Happy Deploying! 🚀**
