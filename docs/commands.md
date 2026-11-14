# Command reference

The executable definitions live in [package.json](../package.json). Run commands from the workspace root with pnpm.

## Development and builds

| Command                                 | Purpose                                 |
| --------------------------------------- | --------------------------------------- |
| pnpm start                              | Serve the demo at http://localhost:4200 |
| pnpm run watch:ngx / pnpm run watch:clr | Watch a library build                   |
| pnpm run build                          | Build libraries and demo                |
| pnpm run build:libs                     | Build both packages                     |
| pnpm run build:demo                     | Build the production demo               |
| pnpm nx graph                           | Inspect workspace dependencies          |
| pnpm nx affected -t test                | Test projects affected by a change      |

## Validation

| Command                                     | Purpose                                                                                                           |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| pnpm run validate                           | Formatting, diff whitespace, tooling, locales, lint, types, coverage, builds, bundle and installed-package checks |
| pnpm test                                   | All unit-test projects                                                                                            |
| pnpm run test:ngx / pnpm run test:clr       | One library's unit tests                                                                                          |
| pnpm nx run ngx-lift:test -- computed-async | Focused signal regressions                                                                                        |
| pnpm run test:coverage                      | Coverage run and summary using configured thresholds                                                              |
| pnpm run e2e:verify                         | Browser-test lint and Playwright tests                                                                            |
| pnpm run e2e:ui                             | Interactive Playwright runner                                                                                     |
| pnpm run typecheck                          | Production TypeScript checks                                                                                      |
| pnpm run lint                               | All project lint checks                                                                                           |
| pnpm run format:check                       | Verify formatting                                                                                                 |
| pnpm run format                             | Apply formatting                                                                                                  |
| pnpm run i18n:check                         | Validate dictionary coverage, placeholders and fixed API options                                                  |
| pnpm run bundle:check                       | Verify heavyweight dependency loading boundaries                                                                  |
| pnpm run verify:packages                    | Strict tarball consumers, peers, imports and zoneless/ZoneJS DOM fixtures                                         |
| pnpm run release:check                      | Read-only release preflight; never publishes                                                                      |
| git diff --check HEAD                       | Whitespace errors in staged and unstaged changes                                                                  |

`pnpm run validate` is the local full chain and includes `git diff --check HEAD`; CI's `fast-checks` job enforces the
same whitespace policy through `format:check` over every formatted extension. `pnpm run e2e:verify` stays outside
`validate` because it needs installed Playwright browsers and a dev server. CI covers its two parts as separate jobs:
`lint-typecheck` runs the affected `lint` and `typecheck` targets, covering `demo-e2e` when it is affected, and the
sharded `e2e` matrix runs Playwright. CI runs fast checks, library tests, demo tests, builds and E2E as parallel jobs.
Coverage, installed-consumer checks and the full three-browser E2E matrix run on push/schedule, while the blocking PR
E2E gate uses the full Chromium suite plus Firefox/WebKit smoke. The E2E job caches Playwright browser binaries by OS,
browser and lockfile, then still runs `playwright install --with-deps` on every shard with retries: WebKit's shared
libraries are not part of the runner image. See `.github/workflows/quality.yml` and the
[deployment guide](deployment.md).

Playwright starts an isolated dev server by default. Set BASE_URL explicitly to test an existing deployment:

```bash
BASE_URL=http://localhost:4307 pnpm run e2e:verify
```

Test-source types can also be checked explicitly with the installed TypeScript compiler:

```bash
node node_modules/typescript/bin/tsc --noEmit -p libs/ngx-lift/tsconfig.spec.json
node node_modules/typescript/bin/tsc --noEmit -p apps/demo/tsconfig.spec.json
```

Release commands and their side effects are documented in the [deployment guide](deployment.md).
