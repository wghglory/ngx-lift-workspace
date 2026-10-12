# ngx-lift Command Reference

A comprehensive, categorized guide to all development, test, build, lint, and release commands in the `ngx-lift`
monorepo.

---

## 🛠️ Daily Development

| Command              | Action                                                                                   |
| :------------------- | :--------------------------------------------------------------------------------------- |
| `pnpm start`         | Serve demo application on [http://localhost:4200](http://localhost:4200) with hot reload |
| `pnpm run watch:ngx` | Build and watch `ngx-lift` for changes with auto-rebuild                                 |
| `pnpm run watch:clr` | Build and watch `clr-lift` for changes with auto-rebuild                                 |

---

## 🧪 Testing (Vitest & Playwright)

| Command                         | Action                                                     |
| :------------------------------ | :--------------------------------------------------------- |
| `pnpm test`                     | Run all unit tests across libraries and apps               |
| `pnpm run test:ngx`             | Run unit tests for `ngx-lift` (44 test suites, 670+ tests) |
| `pnpm run test:clr`             | Run unit tests for `clr-lift`                              |
| `pnpm run test:demo`            | Run unit tests for demo application                        |
| `pnpm run test:coverage`        | Run unit tests with coverage reporting                     |
| `pnpm run e2e`                  | Run Playwright end-to-end tests for the demo application   |
| `pnpm nx test ngx-lift --watch` | Run `ngx-lift` unit tests in interactive watch mode        |

---

## 🏗️ Building & Packaging

| Command                             | Action                                                 |
| :---------------------------------- | :----------------------------------------------------- |
| `pnpm run build`                    | Build all projects in the workspace                    |
| `pnpm run build:libs`               | Build both `ngx-lift` and `clr-lift` Angular packages  |
| `pnpm run build:ngx`                | Build `ngx-lift` package into `dist/libs/ngx-lift`     |
| `pnpm run build:clr`                | Build `clr-lift` package into `dist/libs/clr-lift`     |
| `pnpm run build:demo`               | Build the demo application for production              |
| `cd dist/libs/ngx-lift && npm pack` | Create local `.tgz` distribution tarball of `ngx-lift` |
| `cd dist/libs/clr-lift && npm pack` | Create local `.tgz` distribution tarball of `clr-lift` |

---

## 🧹 Code Quality & Formatting

| Command                 | Action                                          |
| :---------------------- | :---------------------------------------------- |
| `pnpm run lint`         | Run ESLint checks across all projects           |
| `pnpm nx lint ngx-lift` | Run ESLint checks on `ngx-lift`                 |
| `pnpm nx lint clr-lift` | Run ESLint checks on `clr-lift`                 |
| `pnpm nx lint demo`     | Run ESLint checks on the demo application       |
| `pnpm run format`       | Format code across the repository with Prettier |
| `pnpm run format:check` | Verify code formatting with Prettier            |

---

## ⚡ Nx Workspace Utilities

| Command                     | Action                                                      |
| :-------------------------- | :---------------------------------------------------------- |
| `pnpm nx graph`             | Open visual dependency graph of the workspace in browser    |
| `pnpm nx affected -t test`  | Run tests only for projects affected by current git changes |
| `pnpm nx affected -t build` | Build only projects affected by current git changes         |
| `pnpm nx affected -t lint`  | Lint only projects affected by current git changes          |
| `pnpm nx reset`             | Clear Nx daemon and local build cache (`.nx/cache`)         |

---

## 🚀 Release & Publishing

| Command                      | Action                                                               |
| :--------------------------- | :------------------------------------------------------------------- |
| `git tag ngx-lift@<version>` | Create release tag for `ngx-lift`                                    |
| `git tag clr-lift@<version>` | Create release tag for `clr-lift`                                    |
| `git push origin <tag-name>` | Push tag to trigger automated GitHub Actions npm publishing workflow |

For detailed publishing guides and manual workflow dispatch, see [DEPLOYMENT.md](DEPLOYMENT.md).
