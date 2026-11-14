# Documentation and codebase gap register

Updated 2026-11-14. This register owns current documentation and codebase gaps. Resolved delivery records belong to the
corresponding PR and CI artifacts, not here.

Repeat the sweep with the project skill at `.agents/skills/find-repo-gaps/SKILL.md`. Its `scripts/collect-evidence.sh`
gathers read-only evidence with a recorded workflow-run window and explicit `SKIPPED` / `EVIDENCE UNAVAILABLE` markers;
`references/gap-taxonomy.md` defines classes, severity and dispositions. Report in chat by default and update this
register only on explicit request.

## Severity and disposition

| Severity | Meaning                                                                                                            |
| -------- | ------------------------------------------------------------------------------------------------------------------ |
| P0       | A current claim contradicts a maintainer decision, a published release, a required deployment, or a blocking gate. |
| P1       | A current claim misleads contributors about a required command, API, version, test, or open gate.                  |
| P2       | Low-risk prose drift, historical duplication, or a local tooling nicety.                                           |

Dispositions: `Fixed` in the current PR; `Deferred` with an owner and reason; `Waived` by a dated maintainer decision;
`Decision` superseding an older recommendation; `Historical` for a dated snapshot; `False positive` after re-checking
the source.

## Open and deferred gaps

Rows marked `Fixed` are resolved in PR #226 and are retained for this review only; they will be removed in the next
sweep. Resolved delivery records belong to the PR and CI artifacts, not here.

| ID   | Severity | Class             | Gap                                                                                                                                                                                                                                                                                                                                          | Owner and reason                                                                                                                                                                      |
| ---- | -------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| G-36 | P2       | API drift         | `RangePipe` casts non-array input to a tuple and can throw from a template.                                                                                                                                                                                                                                                                  | Library owner: guard with `Array.isArray` and add a regression.                                                                                                                       |
| G-38 | P2       | Acceptance drift  | Dynamic translation keys bypass `tools/i18n/check-translations.mjs`; a few demo strings remain hardcoded.                                                                                                                                                                                                                                    | Library owner: declare typed key maps and localize visible strings.                                                                                                                   |
| G-39 | P2       | API drift         | Some exported helpers and test doubles lack colocated specs.                                                                                                                                                                                                                                                                                 | Library owner: add focused specs or remove the exports.                                                                                                                               |
| G-40 | P2       | Decision          | `mutateResource` callback faults bypass the configurable query diagnostic hook.                                                                                                                                                                                                                                                              | Maintainer: decide whether to share the diagnostic channel, preserving callback isolation.                                                                                            |
| G-41 | P2       | Status drift      | PRs #137–#141 and #134 remain open for independent review.                                                                                                                                                                                                                                                                                   | Maintainer: rebase and review, or close with a recorded decision.                                                                                                                     |
| G-42 | P2       | Duplication drift | Several roadmap/plan documents and five `datagrid-selection-*` documents repeat status and contract text.                                                                                                                                                                                                                                    | Docs owner: keep current status in this register and link to one canonical datagrid contract.                                                                                         |
| G-43 | P2       | Evidence drift    | Several spec-level acceptance statements still describe staged human gates as historical snapshots.                                                                                                                                                                                                                                          | Docs owner: add short pointers to this register during the next spec edit.                                                                                                            |
| G-44 | P2       | Architecture      | The D1–D5 architecture deepening backlog remains open, starting with the localization registration seam D2. See [implementation gaps](design/implementation-gaps.md).                                                                                                                                                                        | Architecture owner: schedule separately; no interface change is implied.                                                                                                              |
| G-45 | P2       | Dependency drift  | Whole-tree dependency advisory triage remains unverified; `.npmrc` still defaults to a mirror while isolated consumers explicitly use the official registry.                                                                                                                                                                                 | Maintainer: resolve advisories and decide whether to make the mirror opt-in.                                                                                                          |
| G-46 | P2       | Gate drift        | `monitor-ci` and `nx-cloud-*` skills do not verify that Nx Cloud CIPE data is available for deploy/publish paths.                                                                                                                                                                                                                            | Skills owner: validate CIPE availability before relying on those skills for those workflows.                                                                                          |
| G-47 | P2       | Duplication drift | Deploy and publish workflows duplicate status icon/badge helpers and summary heredocs.                                                                                                                                                                                                                                                       | CI owner: extract a shared mapping when both summaries are next edited.                                                                                                               |
| G-48 | P2       | Naming drift      | Historical tracker and migration URLs and manifest author metadata still contain a personal repository owner or name.                                                                                                                                                                                                                        | Maintainer: decide the replacement identity first; published URLs must stay resolvable, so they are not rewritten speculatively.                                                      |
| G-49 | P1       | Acceptance drift  | The 2026-11-12 `toSignalForm` validator-binding UI strings still need independent human language approval.                                                                                                                                                                                                                                   | Maintainer: record the reviewed locales, revision and approval in the PR; automated checks do not replace this gate.                                                                  |
| G-50 | P1       | Gate drift        | On main, `Run affected Playwright shard` had a 5-minute step timeout while the full three-browser matrix runs about 52 tests per WebKit shard; shard `(webkit, 5)` timed out at #43533711666, so `Deploy` was skipped. Older SHAs through `36bd515` instead failed `Enforce deployment gate` on the now-removed Netlify step, not on Vercel. | `Fixed` (configuration): PR #226 raises the step timeout to 10 minutes. CI owner: record a green main deploy run ID after merge; no deployment pass is claimed until that run exists. |
| G-51 | P2       | Evidence drift    | `libs/clr-lift/README.md` linked to `../../docs/...`, which resolved in the monorepo but not in the published npm package.                                                                                                                                                                                                                   | `Fixed`: PR #226 replaces all three links with plain-text repository paths. The published README is now self-contained.                                                               |

## Intentional decisions, not gaps

- Angular 22 and the Nx major upgrade remain deferred; native signal-field support follows that upgrade for new value
  controls.
- Both packages stay on 21.x; the approved 21.x compatibility exceptions remain documented in the
  [version policy](deployment.md#version-policy).
- YAML viewer/editor work is paused; its draft spec is retained for future reference.
- Vercel is the only production deployment target on main and the canonical public host. This is a topology decision,
  not a health claim; deployment outcomes are evidenced by their CI run records.
- Local validation, CI, maintainer API approval, human acceptance, merge, deployment and publication remain separate
  gates.

## Acceptance boundary

- The [acceptance contract](guides/accessibility-and-localization.md) owns the independent language approval for all
  eleven locales (2026-11-08) and the manual assistive-technology waiver (2026-11-10). The waiver is not a pass, and
  automated dictionary, accessibility, keyboard and consumer checks remain required for UI changes.
- Newcomer comprehension remains a separate human gate for documentation work.
- Record exact validation commands, results and CI run IDs in the pull request; this register does not replace CI
  artifacts.
