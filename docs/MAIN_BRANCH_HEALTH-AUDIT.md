# Main branch health review — 2026-11-07

> Temporary review aid. Per `docs/README.md:26-27`, temporary audits and local log snapshots are **not** maintained
> documentation: do not link this file from a documentation index and do not commit it. Repository documentation stays
> in English.

## Scope

- Reviewed `main` at `8c7205a` (2026-11-07), docs (53 Markdown files), both libraries, the demo app, e2e project,
  tooling scripts, CI/deployment workflows, GitHub issues and PRs.
- Ran the repository's own validation targets (results below). No source file was modified and no commit was made.
- Findings are ordered by risk. `verified` means the evidence was re-checked directly in this audit; `static` means it
  came from a read-only static scan and was not executed; `confirm` means a product/maintainer decision is needed.

## Executive summary

`main` is healthy: clean tree, in sync with `origin/main`, and the CI, deploy and push-on-main workflows for the HEAD
commit all succeeded on 2026-11-07T03:34:05Z. Formatting, translations, tooling tests, lint and typecheck all pass
locally. Coverage is high (ngx-lift 94.14% statements / 90.79% branches; clr-lift 91.23% / 81.62%) and the translation
dictionaries are complete (2,252/2,252 keys in each of 11 locales).

The actionable risk is **not** in shipped library behavior. It concentrates in four places:

1. **Deployment and CI safety** — a Vercel production deploy step with no branch guard, unpinned third-party actions
   holding production secrets, a silently swallowed Netlify failure, and an Nx cache key that ignores most workspace
   config.
2. **Documentation and tracker drift** — the contributor guide cannot install this workspace, agent guidance points at
   the wrong repository, roadmaps still describe shipped work as pending, and all four open issues appear delivered but
   remain `ready-for-agent`.
3. **A small set of concrete code defects** — an unguarded public pipe, swallowed stream errors, a deprecated test mock
   in the production barrel, a timer not cleared on destroy, and a few untranslated strings.
4. **Policy/gate inconsistencies** — `validate` omits two documented checks, commitlint is installed but not hooked,
   coverage and locale documentation disagree with the code, and `node-forge` remains a mandatory heavy runtime
   dependency despite the repository's dependency policy.

## 1. Branch, release and tracker state

| Item                          | State                                                                                                                                           |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `main` / `origin/main`        | `8c7205a` — "Preserve selection across server pages and request failures (#201) (#204)", 2026-11-07                                             |
| Working tree at audit start   | Clean on `main`                                                                                                                                 |
| Last published tags           | `ngx-lift@21.4.0`, `clr-lift@21.3.0` at `ad48f11` (2026-10-18)                                                                                  |
| `CHANGELOG.md` `[Unreleased]` | 6 `Added` + 2 `Fixed` entries, including breadcrumbs, object-path breadcrumbs, datagrid selection, query errors and per-call mutation callbacks |
| Recent delivery               | Breadcrumb track (#191–#197), datagrid selection (#199–#204), query outcome contracts (#207), pnpm 12.16.1 (#205), agent tooling (#206)         |
| CI at `8c7205a`               | `CI`, `Deploy Demo App`, `Push on main` — all success at 2026-11-07T03:34:05Z                                                                   |
| Open issues                   | 4 (#198, #200, #201, #202), all `clr-lift` + `ready-for-agent`                                                                                  |
| Open PRs                      | 8 (#209, #208, #141, #140, #139, #138, #137, #134)                                                                                              |

**Workspace note (not a main defect).** During the audit an external process switched the checkout from `main` to
`fix/demo-code-block-font` (`e18495a`) and left 4 modified files plus an untracked
`apps/demo-e2e/src/console-noise.spec.ts` (an in-progress console-warning fix). `main` and `origin/main` are unchanged;
all git facts above were re-read from the `main` ref after the switch.

## 2. Validation actually run

| Check                                       | Result                                                                                                                                   |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm run format:check`                     | PASS — all matched files use Prettier style                                                                                              |
| `pnpm run i18n:check`                       | PASS — 11 locales, 2,252/2,252 keys each, no errors                                                                                      |
| `pnpm run test:tools`                       | PASS — 26 tests; example formatting and 18 datagrid example sources match                                                                |
| `pnpm exec nx run-many -t lint`             | PASS — 4 projects                                                                                                                        |
| `pnpm exec nx run-many -t typecheck`        | PASS — 4 projects                                                                                                                        |
| `pnpm run test:coverage`                    | **FAIL locally** — `demo:test` only; 8/83 files, 8/289 tests, every failure is `Hook timed out in 10000ms` or `Test timed out in 5000ms` |
| Isolated re-run (`nx test demo`)            | Same timeout pattern, 17/83 files and 26/289 tests affected; individual spec files took 40–380 s                                         |
| Single previously failing spec in isolation | PASS in 105 ms                                                                                                                           |
| GitHub Actions on `main` at HEAD            | `validate` + e2e + deploy all green                                                                                                      |

**Interpretation:** the local test timeouts are resource/parallelism saturation in this environment (plus an uncommitted
WIP checkout), not a reproducible `main` regression — CI ran the same `validate` chain successfully on `8c7205a` and a
single failing spec passes when run alone. `coverage/apps/demo/coverage-summary.json` was absent only because the demo
suite aborted. Re-run the full suite on a quiet, clean `main` checkout before drawing a conclusion.

Not run locally (CI covers them): `build`, `bundle:check`, `verify:packages`, Playwright e2e.

## 3. Issues to fix

### A. CI, deployment and release safety

- **A1 — High, verified. Unguarded Vercel production deploy.** `.github/workflows/deploy-demo.yml:70-78` has no `if:` on
  the Vercel step, while the Netlify step at `:53` is limited to `refs/heads/main`. The workflow also allows
  `workflow_dispatch` (`:10`), so a manual run from any ref deploys to Vercel production with `VERCEL_TOKEN`. **Fix:**
  add `if: github.ref == 'refs/heads/main'` to the Vercel step or restrict dispatch refs.
- **A2 — High, verified. Nx cache invalidation is too narrow.** `nx.json:13` sets
  `sharedGlobals: ["{workspaceRoot}/.github/workflows/ci.yml"]`, but `.github/workflows/` contains four files (`ci.yml`,
  `quality.yml`, `deploy-demo.yml`, `publish.yml`) and root configs (`package.json`, `nx.json`, `tsconfig.base.json`,
  `eslint.config.mjs`, `.prettierrc`, `tools/*.mjs`, `netlify.toml`, `vercel.json`) are outside `projectRoot` for
  `apps/demo` and `libs/*`. Changes to them can leave stale cached lint/typecheck/build results. **Fix:** enumerate all
  workspace-level config, tool and workflow files in `sharedGlobals`.
- **A3 — High, verified. Floating action tags receive production secrets.** All workflows use major tags
  (`actions/checkout@v6`, `actions/setup-node@v6`, `actions/upload-artifact@v7`, `pnpm/action-setup@v6`,
  `nwtgck/actions-netlify@v4`, `amondnet/vercel-action@v42`, `ncipollo/release-action@v1`) with no SHA pin, while
  `NETLIFY_AUTH_TOKEN`, `VERCEL_TOKEN`, `NPM_TOKEN` and `GITHUB_TOKEN` flow into third-party code. **Fix:** pin every
  action to a commit SHA and audit the three third-party actions.
- **A4 — Medium, verified. A failed production deploy can still be green.** `deploy-demo.yml:55`
  `continue-on-error: true` on the Netlify step; the summary at `:153` accepts Netlify **or** Vercel success. **Fix:**
  remove `continue-on-error` or fail the job explicitly when both deploys fail.
- **A5 — Medium, verified. Misleading hard failure on early validation errors.** `.github/workflows/quality.yml:18-24`
  uploads coverage with `if: always()` and `if-no-files-found: error`. If `format:check` fails first, `coverage/` never
  exists and an unrelated artifact error masks the real cause. **Fix:** use `warn` or guard on
  `hashFiles('coverage/**')`.
- **A6 — Medium, static. No timeouts, concurrency or cache.** Only `deploy-demo.yml:68` sets `timeout-minutes`, only
  `ci.yml:12` sets `concurrency`; `nx.json:93` disables Nx Cloud but nothing caches `.nx/cache` or
  `~/.cache/ms-playwright`, so `playwright install --with-deps` re-downloads browsers each run. PR #208's `validate` job
  ran 1h3m17s. **Fix:** add job timeouts, concurrency to deploy/publish, and caches for `.nx/cache` and Playwright.
- **A7 — Medium, static. `validate` omits documented checks.** `package.json:45` has neither `git diff --check` nor
  `e2e:verify`, both documented in `docs/COMMANDS.md:26,35`; `quality.yml:26` runs only `pnpm nx e2e demo-e2e`. **Fix:**
  add them to `validate` or remove them from the command reference.
- **A8 — Medium, static. Direct publish scripts bypass the release gate.** `package.json:48-50` (`publish:ngx`,
  `publish:clr`, `publish:all`) publish straight to npm, contradicting the reviewed-version PR gate in
  `docs/DEPLOYMENT.md:16-27`; `publish:all` also builds the libraries twice. **Fix:** remove them or route them through
  the dry-run/verified workflow.
- **A9 — Medium, verified. CI installs through a third-party npm mirror.** `.npmrc:1-2` sets
  `registry=https://repo.huaweicloud.com/repository/npm/` and `legacy-peer-deps=true` (an npm-only option that pnpm
  ignores). `tools/package/verify-packages.mjs:152-158` copies this file verbatim into the supposedly "fresh isolated
  consumer". **Fix:** default to `registry.npmjs.org`; scope any mirror to an explicit opt-in.
- **A10 — Medium, static. Nx Cloud is off but its tooling remains.** `nx.json:92-94` keeps `nxCloudId` with
  `neverConnectToCloud: true`; `.github/skills/monitor-ci/SKILL.md:42-56` checks for that ID and will falsely report a
  connection, while `docs/design/clr-lift/breadcrumb-design-spec.md:886-888` records an unavailable remote cache.
  **Fix:** delete `nxCloudId` and retire/disable the `nx-cloud-*` skills and `monitor-ci` prompt, or reconnect Cloud.
- **A11 — Medium, verified. Pre-commit does not enforce documented requirements.** `.husky/` contains only `pre-commit`;
  no `commit-msg` hook exists, so `@commitlint/cli` / `@commitlint/config-angular` (`package.json:89-90`) are dead
  despite the Conventional Commits rule in `CONTRIBUTING.md:117-129`. The lint-staged globs (`package.json:196-203`)
  miss `.mjs`, `.cjs`, `.mts`, `.cts`, `.yml` and `.yaml`, and no typecheck or tests run. **Fix:** add a `commit-msg`
  hook, extend globs, and add `typecheck`/`format:check` to the hook.
- **A12 — Medium, verified. Hosting config drift.** `netlify.toml:15` `PNPM_VERSION = "10"` versus `package.json:59`
  `pnpm@12.16.1`; `vercel.json:14-31` omits `Referrer-Policy: strict-origin-when-cross-origin`, which
  `netlify.toml:19-25` sets — and Vercel is the host all public links point to. **Fix:** pin pnpm to 12 and add the
  missing header to `vercel.json`.
- **A13 — Medium, static. Package verification can pass for the wrong reason.**
  `tools/package/verify-packages.mjs:14-18,198,263-271` asserts only `status !== 0` on the negative fixture (a timeout,
  a missing compiler or an install error also satisfies it), uses `process.cwd()` at `:10`, a 60 s install timeout, and
  hardcodes consumer versions (`jsdom ^27` vs root `~22.1.0`, `@types/node ^22` vs `24.13.2`). **Fix:** assert
  `!error && status > 0` plus expected diagnostics, resolve paths from `import.meta`, raise the timeout, derive versions
  from the root manifest.
- **A14 — Medium, verified. Coverage summary tool defects.** `tools/vitest/show-coverage-summary.mjs:33` defines
  `checkThreshold(value, threshold)` but `:52-61` call it with three arguments; `:94-96` silently swallows missing
  reports; `THRESHOLDS` at `:26-31` (80/75/50/80) contradicts `CONTRIBUTING.md:151` ("60%"). **Fix:** drop the dead
  argument, log skipped reports, and align the documented thresholds.
- **A15 — Medium, confirm. Two production hosts, no canonical target.** `.github/workflows/deploy-demo.yml:52-78`
  deploys to both Netlify and Vercel; `README.md:8,14,59,139` and `package.json:15` advertise only Vercel;
  `docs/DEPLOYMENT.md:71-74` names both without choosing. **Fix:** declare one canonical host, remove the dead
  job/config, and confirm Git auto-builds are disabled so artifacts are not deployed twice.

### B. Documentation and tracker drift

- **B1 — High, verified. Agent issue-tracker guidance names the wrong repository.** `docs/agents/issue-tracker.md:3`
  says `https://github.com/wghglory/ngx-lift`; origin and every other URL use `wghglory/ngx-lift-workspace`.
  `AGENTS.md:63` requires reading this file before issue work. **Fix:** correct the URL or drop the literal and rely on
  "infer the repository from origin".
- **B2 — High, verified. Contributor setup cannot install this workspace.** `CONTRIBUTING.md:26-27` requires "Node.js
  22.x or higher" and "npm 10.x or higher"; `npm` commands appear at `:44,48,52,80,84,88,184-191`. Reality:
  `package.json:59-62` requires `pnpm@12.16.1` and Node `>=24.0.0`, and `docs/COMMANDS.md:3` mandates pnpm. The same
  mismatch appears in `.github/PULL_REQUEST_TEMPLATE.md:76-78,90-93`. **Fix:** rewrite all setup and command sections
  for Node 24 + `pnpm nx`, with a single link to `docs/COMMANDS.md`.
- **B3 — High, verified. The issue tracker is stale.** All four open issues carry `ready-for-agent`, yet: #200 shipped
  in PR #203 (`198baf5`), #201 in PR #204 (`8c7205a`), the #198 parent spec exists as
  `docs/design/clr-lift/datagrid-selection-design-spec.md` and its acceptance record, and #202's
  `data-service-policy-form.component.ts`, its spec and `apps/demo-e2e/src/datagrid-selection.spec.ts` all exist on
  `main`. `datagrid-selection-acceptance.md:127` still says "full policy create/edit workflows remain with #202", and
  `CHANGELOG.md` has no policy entry. **Fix:** reconcile tracker, acceptance record and changelog — close the delivered
  issues or re-label #202 to the remaining human-acceptance/publication gate per `docs/agents/triage-labels.md`.
- **B4 — High, verified. Roadmaps describe shipped work as pending.** `docs/component-roadmap.md:3` is still "Draft for
  maintainer review" (updated October 30), `:14` says "Start with a working local multiple selection form", and `:39`
  gives breadcrumb an unmet exit condition — but `CHANGELOG.md:13-31` records all of these as exported, and the
  acceptance record at `:3-6` says #200/#201 are implemented. `docs/design/implementation-gaps.md:36` still lists #189
  filtering/scale as separate although `breadcrumb.component.ts` implements `filter()`/`clearFilter()`. **Fix:** refresh
  statuses to 2026-11-07 and point to the acceptance/changelog records.
- **B5 — Medium, verified. Broken `#evidence` anchor used four times.** `docs/priority-roadmap.md:28`,
  `docs/component-roadmap.md:117`, `docs/design/clr-lift/forms-compatibility-design-spec.md:332,345` all link to
  `key-value-inputs-design-spec.md#evidence`, which has no `## Evidence` heading. **Fix:** point to a real anchor or add
  a canonical Evidence section.
- **B6 — Medium, verified. Stale dates and version numbers.** `docs/priority-roadmap.md:3` says "Updated October 18,
  2026"; `:13` cites the old `21.3.0 / 21.2.0` release while `:52` and `CHANGELOG.md:54` cite `21.4.0 / 21.3.0`; `:61`
  describes documentation closeout as future work although `docs/design/implementation-gaps.md:73` records it on
  November 4. **Fix:** update the status cells to the current release and date.
- **B7 — Medium, verified. Documentation indexes are incomplete.** `docs/README.md:5-19` omits `component-roadmap.md`
  (mandated by `AGENTS.md:37`), `query-documentation-plan.md`, `documentation-learning-paths-plan.md`, both guides, the
  ADRs, the component workflow/template and all three agent docs. `docs/design/README.md:25-48` omits 8 of 22 specs,
  including the shipped `breadcrumb-design-spec.md`. **Fix:** add index rows; a broken index is worse than no index.
- **B8 — Medium, verified. Locale list is wrong.** `libs/clr-lift/README.md:51-52` lists `Italiano` and omits Russian;
  `docs/guides/accessibility-and-localization.md:13`, the demo language loader and the language switcher use `ru` (11
  locales: en, zh-CN, zh-TW, de, es, fr, ja, ko, nl, pt-BR, ru). **Fix:** replace `Italiano` with `Русский`.
- **B9 — Medium, verified. Coverage policy disagrees across three sources.** `CONTRIBUTING.md:151` says 60%; the three
  `vite.config.mts` files set 75% branches; `show-coverage-summary.mjs:26-31` uses 80/75/50/80;
  `docs/design/component-development.md:52` says "above 70%". **Fix:** name one authoritative threshold (the Vitest
  configs) and link to it.
- **B10 — Medium, static. Status and contract duplication.** Five roadmap/plan documents repeat the same "Angular 22/Nx
  deferred, human acceptance pending" boilerplate, and five `datagrid-selection-*` docs (~231 KB) duplicate the same
  contract and evidence — against `docs/README.md:25` ("Maintain links instead of copying ... status reports between
  pages"). **Fix:** keep status in `priority-roadmap.md` and one canonical datagrid contract.
- **B11 — Low, verified. Stale project tree.** `CONTRIBUTING.md:289-318` lists
  `libs/clr-lift/src/lib/{models,operators,pipes}` and omits `docs/`, `tools/`, `apps/demo-e2e/` and
  `.github/workflows/`. **Fix:** replace with a pointer to `docs/QUICK_START.md`.
- **B12 — Low, confirm. Naming policy.** `docs/guides/accessibility-and-localization.md:59-69` and
  `docs/priority-roadmap.md:19` embed the personal handle `wghglory` in acceptance tables, and `README.md:42` /
  `libs/clr-lift/README.md:20` say "VMware Clarity Design System". `AGENTS.md:49-50` asks for generic names and no
  internal identifiers. **Fix:** use role labels and "Clarity Design System" where the maintainer confirms scope;
  upstream `vmware-clarity/ng-clarity` source citations are legitimate.
- **B13 — Low, confirm. Package README version labels.** `libs/clr-lift/README.md:290` says `QueryDevtoolsComponent`
  arrived "With ngx-lift 21.3" but `CHANGELOG.md:66-69` ships it in 21.4.0; `:260` labels `BreadcrumbComponent`
  "unreleased" while the equally unreleased `DatagridSelectionComponent` at `:265` is unlabelled. **Fix:** verify the
  minimum version and apply one convention.

### C. Code defects and library API

- **C1 — Medium, verified. `RangePipe` throws on non-array input.** `libs/ngx-lift/src/lib/pipes/range.pipe.ts:38-41`
  casts `unknown` to a tuple and spreads it; `null`, `undefined` or a non-iterable raises a `TypeError` from a template.
  **Fix:** guard with `Array.isArray(value)` and return `[]`.
- **C2 — Medium, verified. `safeToSignal` swallows stream errors.**
  `libs/ngx-lift/src/lib/signals/form-signals.ts:54-56` only `console.error`s; `controlValue`, `controlStatus` and
  `controlState` silently keep their last value with no error state. **Fix:** expose an error signal or an `onError`
  option, and remove the library `console` call.
- **C3 — Medium, verified. A deprecated test mock ships in the production barrel.**
  `libs/clr-lift/src/lib/services/index.ts:3` exports `translation.service.mock`, whose `:4` marks
  `MockTranslationService` `@deprecated` (and `:1` disables a lint rule file-wide). **Fix:** remove it from the public
  barrel and expose it through a `testing` secondary entry point if needed.
- **C4 — Medium, verified. Copy-notice timer is not cleared on destroy.**
  `libs/clr-lift/src/lib/components/query-devtools/query-devtools.component.ts:359-362` sets `copyNoticeTimer`, but the
  `DestroyRef` hook at `:163-169` only stops resize and resets state. **Fix:** call `clearCopyNotice()` on destroy; also
  verify stale `copyNoticeTimer` behaviour across rapid successive copies (`:349-366`).
- **C5 — Medium, static. Untranslated user-visible strings.** `idle-detection-demo.component.html:67` hardcodes
  `alt="Idle Detection Dialog"`; `resource-async.component.ts:361,368,401,411` hardcodes titles and names (coupled to
  the assertion in `apps/demo-e2e/src/accessibility.spec.ts:73`). **Fix:** add keys in all 11 dictionaries and update
  the e2e assertion.
- **C6 — Medium, static. Dynamic translation keys bypass the checker.** `tools/i18n/check-translations.mjs:68,98`
  requires a string literal and skips `Binary` expressions, so `query-devtools.component.ts:136` and
  `query-devtools.component.html:176,321,329` (`translate('queryDevtools.' + state)`) are unverified. **Fix:** declare
  the state/tab key set with a typed map so the checker can validate it.
- **C7 — Medium, static. `any` in public APIs.** `libs/ngx-lift/src/lib/models/kubernetes-object.model.ts:1,33,39` uses
  a file-level eslint suppression for `spec?: any` / `status?: any`; `timeline-wizard.component.ts:68-70`,
  `timeline-step.type.ts:65` and `timeline-base.component.ts:84,111` expose `output<any>`, `data?: any`,
  `FormGroup<any>`. **Fix:** make `KubernetesObject<TSpec, TStatus>` and `TimelineStep<T>` generic, or use `unknown`.
- **C8 — Medium, static. Exported APIs without colocated specs.** `logger.operator.ts`,
  `libs/clr-lift/devtools/development/index.ts`, `translation.service.mock.ts` and `idle-detection.module.ts` have no
  spec files. **Fix:** add focused specs or remove the exports.
- **C9 — Low, static. Small UI/a11y issues.** Debug `console.log` effects in `resource-async.component.ts:456-485` and
  two other signal demos; extra tab stops on non-interactive content (`query-devtools.component.html:233`,
  `toast.component.html:108`); `<a href="#">` used as buttons in `tooltip-demo.component.html:13,16-18,26,37-39`;
  inconsistent translation namespaces (`cll-spinner.loading`, `'FileReader'`) versus `alert`/`toast`/`queryDevtools`.
  **Fix:** gate or remove debug effects, use real buttons, remove unnecessary `tabindex`, normalize key namespaces with
  a compatibility alias.
- **C10 — Low, static. Disabled assertion and silent i18n fallback.** `computed-async.spec.ts:930-934` has a `// TODO:`
  above a commented-out error-recovery expectation; `state-inspector.component.ts:35-36` returns the raw key when a
  translation is missing, masking regressions. **Fix:** restore the assertion with an explicit expectation and fail
  loudly in development on missing keys.
- **C11 — Low, static. Duplicated callback isolation and deprecated barrels.** `mutate-resource.ts:59-74` and
  `query-client.ts:590-616` repeat the same callback-fault isolation with an unconfigurable `console.error`;
  `idle-detection.module.ts` and the `invalidatesTags` alias remain in primary barrels. **Fix:** extract one shared
  helper with an injectable reporter and schedule deprecation removals.

### D. Tooling, configuration and dependency policy

- **D1 — Medium, verified. `node-forge` contradicts the dependency policy.** `package.json:75` and
  `libs/clr-lift/package.json:30` make it a required runtime/peer dependency for certificate parsing, although
  `AGENTS.md:52-57` says optional heavyweight features must not require an engine installation for ordinary consumers.
  `docs/design/clr-lift/certificate-design-spec.md:100-101` already acknowledges this. **Fix:** move certificate parsing
  to a secondary entry point with `peerDependenciesMeta.optional`, or make the peer optional.
- **D2 — Medium, static. Unbounded peer ranges.** `libs/ngx-lift/package.json:23-29` and
  `libs/clr-lift/package.json:22-32` use `>=21`, `>=18`, `>=7.8.0`, while `@clr/angular: ^18.4.0` requires an exact
  `@clr/ui: 18.4.0` and `strictPeerDependencies: false` hides drift. **Fix:** cap peers (`<22`, `<19`, `<8`) and pin
  `@clr/*` exactly.
- **D3 — Low, verified. Dead Nx target default and un-cached tooling targets.** `nx.json:60-64` configures
  `@angular-devkit/build-angular:browser`, but `apps/demo/project.json:10` uses `@angular/build:application`. The five
  `nx:run-commands` targets in `package.json:142-194` declare no `inputs`, `outputs` or `cache`. **Fix:** remove the
  dead default and declare explicit hashes per tooling target.
- **D4 — Low, static. Tool paths and invocations are cwd-relative.** `tools/bundle/check-lazy-dependencies.mjs:47` reads
  `dist/apps/demo/stats.json` without error handling, `tools/vitest/run-coverage.mjs:5-7` shells out via `npx`, and
  `tools/package/verify-packages.mjs:10` uses `process.cwd()` — against `AGENTS.md:9-11`. **Fix:** resolve from
  `import.meta.dirname`, add actionable errors and use `pnpm exec nx`.
- **D5 — Low, static. Script hygiene.** `package.json:44` `clean` is POSIX-only and deletes the Verdaccio store under
  `tmp/`; `format:examples` (`:39,153-157`) regenerates only one of the two example sources checked by `tooling-test`.
  `project.json:9` and `.verdaccio/config.yml:2` duplicate the storage path. **Fix:** make `clean` cross-platform and
  non-destructive, regenerate both example sources, keep one storage setting.
- **D6 — Low, static. Angular patch skew.** `@angular/cdk` is `21.2.10` while the other `@angular/*` packages are
  `21.2.17`; CLI/build tooling is `21.2.14` and `ng-packagr` `21.2.5`. The lockfile resolves it, but the mix invites
  peer drift. **Fix:** align to one patch release in a dedicated dependency PR.

### E. PR and branch hygiene

- **E1 — Medium, verified. Stale pull requests.** Five feature PRs (#137–#141) have not been updated since 2026-10-10
  and dependabot #134 since 2026-10-23, while `docs/priority-roadmap.md:20` still lists them as "Review pending" and
  `docs/design/implementation-gaps.md:50` says their APIs are out of scope of the main-branch audit. **Fix:** rebase and
  review, or close with a recorded decision.
- **E2 — Medium, verified. PR #208 has a failing required check.** The `quality / validate` job for
  `feat/to-signal-form-options-lab` failed at `pnpm nx e2e demo-e2e` on 2026-11-07T05:12:12Z after 1h3m17s, while the
  parallel "PR #208" workflow and CodeQL passed. **Fix:** obtain the browser-test log and fix or quarantine the flaky
  e2e before merge; note the current uncommitted `console-noise.spec.ts` work appears related.
- **E3 — Low, verified. Local branch/worktree cleanup.** `fix/query-outcome-contract-alignment` is 2 commits behind
  `origin`; the `chore/pnpm-12.16.1` worktree is prunable; three worktrees are registered. **Fix:** prune merged
  branches and worktrees.

## 4. Recommended sequence

1. **Deploy safety first (A1, A3, A4, A5, A12).** Branch guard + SHA pins + truthful failure reporting; these are the
   only findings with production impact.
2. **Make validation deterministic (A2, A6, A7, A10, A11, A13, A14, D3, D4).** Fix cache inputs, add timeouts and
   caches, wire commitlint and the missing documented checks, harden the custom tools.
3. **Restore a single source of truth (B1–B9, B3).** Correct the agent guidance and contributor setup, close or re-scope
   the four open issues, refresh roadmap statuses to 2026-11-07, fix the broken anchor and the version, locale and
   coverage mismatches, and complete the indexes. Then consolidate B10.
4. **Fix the small library defects (C1–C4, C6, C8).** Each is local and low-risk; add regressions alongside.
5. **Honour the dependency policy (D1, D2) and decide the canonical host (A15).** Record alternatives and consumer
   evidence in a feature spec as `AGENTS.md:52-57` requires.
6. **Triage the backlog (E1–E3), then plan a release.** `[Unreleased]` holds six features and two fixes since
   2026-10-18. Once the independent human language and assistive-technology acceptance required by
   `docs/guides/accessibility-and-localization.md` is recorded, cut the next versions through the `docs/DEPLOYMENT.md`
   gates rather than the direct publish scripts.

## 5. What is already healthy

- `main` is clean, in sync with `origin/main`, and CI, e2e and deployment all passed for the HEAD commit.
- All locally executed gates pass; translation coverage is complete (2,252 keys × 11 locales) and example-source drift
  is checked automatically.
- Static scanning found **zero** skipped/disabled tests, **zero** `@ts-ignore`, **zero** positive `tabindex` values and
  no missing translation keys; 219 spec files cover 3 projects, with 92–95% statement coverage in the libraries.
- Documentation links are overwhelmingly valid (all ~250 internal file targets and 15 sampled anchors resolve except
  `#evidence`), no Chinese prose appears in committed docs, and specs/ADRs/acceptance records are unusually thorough.
- Known gaps are explicitly registered in `docs/design/implementation-gaps.md` and `docs/priority-roadmap.md`; the
  platform-upgrade deferral and human-acceptance boundary are deliberate maintainer decisions, not oversights.

## 6. Caveats

- Static findings came from three read-only audits (docs, code, tooling) that scanned all 53 docs, 260 library `.ts`
  files, 219 specs, 119 templates and every workflow/tool config; high-severity items were re-verified directly here.
  Items marked `static` or `confirm` were not executed or need a maintainer product decision.
- Builds, `bundle:check`, `verify:packages` and Playwright e2e were not run locally; CI evidence on `main` was used
  instead. The local `test:coverage` failure is environmental (see §2) and must be re-checked on a quiet, clean `main`
  checkout.
- GitHub issue/PR/CI facts were read with `gh` from this checkout; nothing was written to the tracker.
- No source file was changed. The only artifact of this review is this temporary Markdown file.
