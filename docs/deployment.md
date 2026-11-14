# Publishing and demo deployment

Automation is defined in [publish.yml](../.github/workflows/publish.yml),
[deploy-demo.yml](../.github/workflows/deploy-demo.yml) and the shared [quality.yml](../.github/workflows/quality.yml).
Package manifests and [CHANGELOG](../CHANGELOG.md) own version history.

## Verification before publication

Run the [validation commands](commands.md) and review package compatibility, release notes and credentials before
publishing. A successful build, a merged PR and a published npm version are separate outcomes.

The Publish Libraries workflow accepts project all/ngx-lift/clr-lift, version major/minor/patch/skip and dry_run. Manual
dispatch defaults to dry_run=true. A dry run verifies both packages, strict installed consumers, versioning and publish
commands without publishing, creating a version commit/tag or requiring an npm token.

For a real release, prepare source versions and the changelog in a PR, validate it, and merge it before publication.
Main requires changes through a PR; the publishing workflow does not push version commits to bypass that protection. Use
a local version preparation command such as:

```bash
pnpm nx release version minor --git-commit=false --git-tag=false
```

Nx resolves the current version from the source manifest and updates both source and distribution manifests. Commit the
source changes and release notes through the PR. After merging, deliberately disable dry_run and select **version=skip**
to publish those reviewed versions, or push their reviewed release tags. Other workflow version choices are dry-run
previews only. The workflow uses the official npm registry and checks credentials. Review behavioral compatibility and
dependent package peer ranges using the version policy below before publication.

The publication workflow creates GitHub release records and remote tags on tag events. After a manual `version=skip`
publication, confirm those records rather than pushing the reviewed tag again; source manifests own the next version
calculation.

### Release checklist

Complete these in order. A green build, a merged PR and a published npm version are separate outcomes.

1. Prepare the version bump and the dated changelog section in a PR on `main`. Record every breaking change, its
   migration, and the maintainer decision approving a 21.x compatibility exception.
2. Run `pnpm run release:check` and `pnpm run validate`, and require the PR E2E gate: the full Chromium suite plus
   Firefox/WebKit smoke. The full three-browser matrix runs on push and schedule. Start the `publish.yml` dry run with
   `gh workflow run publish.yml`; the workflow has no pull-request trigger. Confirm `verify:packages` and
   `nx release publish --dry-run` in that run.
3. Confirm the acceptance boundary in the [acceptance contract](guides/accessibility-and-localization.md) and the
   [gap register](gap-register.md). Automated dictionary, accessibility and consumer checks remain required; a waiver
   does not mark the assessment as passed.
4. Review behavioral compatibility, the peer ranges (maintainer decided to keep them unbounded), the
   `ngx-lift`-before-`clr-lift` publish order, and the `NPM_TOKEN` / `npm whoami` credential check.
5. Merge the reviewed version/changelog PR, then publish with `version=skip` and `dry_run=false`, or push the reviewed
   `ngx-lift@<version>` / `clr-lift@<version>` tags. Tag events always publish and are never dry runs.
6. Confirm the GitHub release records and remote tags created by the publication workflow, with a link to the workflow
   run as release evidence. Do not push a reviewed tag again after a manual `version=skip` publication; tag events
   always publish and create release records.

## Version policy

The maintainer decided on October 17, 2026 to keep both packages on **21.x** while the supported platform remains
Angular 21, and reserve **22.x** for the Angular 22 upgrade. Upcoming additions belong in 21.x minor releases. The
package versions remain independent; this decision does not select exact release numbers or publish anything.

The `computedAsync` error/type correction and idle-warning countdown change in 21.4.0 / 21.3.0 remain **behaviorally
breaking**. Shipping them in 21.x is an explicit maintainer-approved exception to SemVer's major-bump rule, not a claim
of backward compatibility. Preserve the [21.4.0 / 21.3.0 breaking and migration notes](../CHANGELOG.md), verify
dependent peers and installed consumers, and run the publication dry run before the real release. Do not remove the
compatibility notice when assigning versions.

**November 8, 2026 decision (approved and published on 2026-11-09):** the `node-forge` certificate API removal and the
`toSignalForm` error-propagation change in 21.5.0 / 21.4.0 are a second, separate exception. The October 17 decision is
not blanket approval for later breaks. Peer ranges stay unbounded (`@angular/* >=21`, `@clr/angular >=18`,
`rxjs >=7.8.0`, `ngx-lift >=21`); the verified platform is Angular 21 / Clarity 18 / RxJS 7. Preserve the
[21.5.0 / 21.4.0 migration notes](../CHANGELOG.md#migration), publish `ngx-lift` first, and confirm strict installed
consumers before authorizing publication. The publish order, installed-consumer checks and credential check were
verified before the 2026-11-09 publication. Any later incompatible change needs the same explicit review.

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

Use `npm pack` to create a local tarball when needed; this is a local inspection exception, while all workspace
automation uses `pnpm`. The installed-consumer check already verifies package exports, strict declarations, peer
installation, runtime imports and mounted Angular consumer lifecycle.

## Demo deployment

The production site lives in `dist/apps/demo/browser`. Vercel settings are in [vercel.json](../vercel.json). The Deploy
Demo App workflow waits for the shared quality gates, builds the libraries/demo and deploys the generated browser output
to Vercel.

Vercel is the only production deployment target on main and the canonical host for public links. The workflow deploys
only from `refs/heads/main`; its job gate requires successful builds and a successful Vercel production deployment, and
a failed build or deployment fails the job. Hosting integrations may also create PR previews; the corresponding remote
job/deployment records provide status. A manual workflow run outside main builds the demo without a production
deployment.

Deployment health is a current-state record, not part of this procedure. The [gap register](gap-register.md) owns open
deployment incidents, and CI run records are the validation evidence. A green CI run and a successful production
deployment remain separate outcomes, so do not infer deployment status from the CI gate.
