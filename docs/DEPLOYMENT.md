# Publishing and demo deployment

Automation is defined in [publish.yml](../.github/workflows/publish.yml),
[deploy-demo.yml](../.github/workflows/deploy-demo.yml) and the shared [quality.yml](../.github/workflows/quality.yml).
Package manifests and [CHANGELOG](../CHANGELOG.md) own version history.

## Verification before publication

Run the [validation commands](COMMANDS.md) and review package compatibility, release notes and credentials before
publishing. A successful build, a merged PR and a published npm version are separate outcomes.

The Publish Libraries workflow accepts project all/ngx-lift/clr-lift, version major/minor/patch/skip and dry_run. Manual
dispatch defaults to dry_run=true. A dry run verifies both packages, strict installed consumers, versioning and publish
commands without publishing, creating a version commit/tag or requiring an npm token.

For a real release, choose the version policy, review the changelog, and deliberately disable dry_run. The workflow uses
the official npm registry and checks credentials. Breaking API changes require breaking versions and a review of
dependent package peer ranges before publication.

## Release tags

Tag events always publish; they are not dry runs. Commit reviewed version and changelog changes before pushing a tag:

```bash
git tag ngx-lift@<version>
git push origin ngx-lift@<version>
```

Use clr-lift@<version> for the Clarity package. A v* tag selects both packages. The pipeline runs quality gates and
publishes the selected package(s) with release records. Ordinary branch pushes do not publish packages.

## Local package inspection

```bash
pnpm run build:libs
pnpm run verify:packages
cd dist/libs/ngx-lift
npm pack --dry-run
```

Use npm pack to create a local tarball when needed. The installed-consumer check already verifies package exports,
strict declarations, peer installation, runtime imports and mounted Angular consumer lifecycle.

## Demo deployment

The production site lives in dist/apps/demo/browser. Netlify and Vercel settings are in [netlify.toml](../netlify.toml)
and [vercel.json](../vercel.json). The Deploy Demo App workflow waits for quality gates, builds the libraries/demo and
deploys the generated browser output. Hosting integrations may also create PR previews; the corresponding remote
job/deployment records provide status.
