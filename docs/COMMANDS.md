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

| Command                                     | Purpose                                                                                          |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| pnpm run validate                           | Formatting, tooling, locales, lint, types, coverage, builds, bundle and installed-package checks |
| pnpm test                                   | All unit-test projects                                                                           |
| pnpm run test:ngx / pnpm run test:clr       | One library's unit tests                                                                         |
| pnpm nx run ngx-lift:test -- computed-async | Focused signal regressions                                                                       |
| pnpm run test:coverage                      | Coverage run and summary using configured thresholds                                             |
| pnpm run e2e:verify                         | Browser-test lint and Playwright tests                                                           |
| pnpm run e2e:ui                             | Interactive Playwright runner                                                                    |
| pnpm run typecheck                          | Production TypeScript checks                                                                     |
| pnpm run lint                               | All project lint checks                                                                          |
| pnpm run format:check                       | Verify formatting                                                                                |
| pnpm run format                             | Apply formatting                                                                                 |
| pnpm run i18n:check                         | Validate dictionary coverage, placeholders and fixed API options                                 |
| pnpm run bundle:check                       | Verify heavyweight dependency loading boundaries                                                 |
| pnpm run verify:packages                    | Strict tarball consumers, peers, imports and zoneless/ZoneJS DOM fixtures                        |
| git diff --check                            | Whitespace errors in the diff                                                                    |

Playwright starts an isolated dev server by default. Set BASE_URL explicitly to test an existing deployment:

```bash
BASE_URL=http://localhost:4318 pnpm run e2e:verify
```

Test-source types can also be checked explicitly with the installed TypeScript compiler:

```bash
node node_modules/typescript/bin/tsc --noEmit -p libs/ngx-lift/tsconfig.spec.json
node node_modules/typescript/bin/tsc --noEmit -p apps/demo/tsconfig.spec.json
```

Release commands and their side effects are documented in [DEPLOYMENT](DEPLOYMENT.md).
