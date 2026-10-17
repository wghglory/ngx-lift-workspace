# Query documentation delivery

Approved scope: October 17, 2026. Runtime APIs are unchanged. This plan records documentation delivery separately from
the implemented query/mutation contracts. The destinations below are implemented. Local validation is recorded below;
human acceptance remains a separate gate.

## Readers and outcomes

Assume familiarity with Angular components and signals. A newcomer can load and display a team, handle pending/error
states, refresh without losing existing data, save a change, and explain when several independent queries are needed. An
experienced reader can find exact API contracts, key/tag organization, defaults and diagnostics directly.

## Destinations

| Route below `/ngx-lift/query/` | Reader task                                                                                   |
| ------------------------------ | --------------------------------------------------------------------------------------------- |
| `overview`                     | Understand what server state is and choose the next tutorial                                  |
| `queryResource`                | First read, rendering, parameter changes, refresh and failure recovery                        |
| `mutateResource`               | First save, pending/error handling, then cached-view invalidation and concurrency             |
| `queryResources`               | Independently load a changing set; preserve identity on reorder and dispose removed observers |
| `cache`                        | Understand freshness, retention, refresh triggers and actual defaults                         |
| `keys`                         | Define response identity and select invalidation dependencies                                 |
| `organization`                 | Place definitions and observers; find key/tag factories and naming conventions                |
| `choosing`                     | Compare async primitives by required behavior                                                 |
| `reference`                    | Find signatures, defaults, lifecycle states and detailed API tables                           |
| `devtools`                     | Configure and use query diagnostics                                                           |

Keep existing routes working. Use shallow sidebar entries; introduce explanatory terms before architectural guidance.
Use short excerpts only when clearly labeled, with complete compiled examples available in the playground. Reuse the
same source/template in the beginner preview and code display. Local fixtures simulate latency and errors; identify that
substitution and explain production HTTP setup. Avoid fresh/stale/inactive as a single mandatory sequence.

## Delivery increments

1. Correct standards/template applicability, documentation outcomes and factual spec errors.
2. Add query/mutation starters, reorder pages, and introduce guide destinations/navigation with supported translations.
3. Verify examples through compilation and browser interactions; check reference links, languages and narrow screens.

## Acceptance and evidence

- First query/mutation playground appears before matrices, detailed comparisons or domain architecture.
- Query preview covers parameter changes, first-load failure, refresh failure with retained data and recovery.
- Mutation preview covers pending, success, failure and recovery without requiring query/tag knowledge.
- Collection preview covers add/reorder/remove and per-row recovery; one array response is explained as one query.
- Every menu entry resolves, reference section links work, and all supported dictionaries contain translated prose.
- Complete starter code compiles as part of the demo through public exports. Preview uses its actual component/template.
- Browser checks cover repeated interactions, narrow screens and language switching. Human newcomer acceptance is a
  separate, unperformed gate unless explicitly recorded.
- Record exact commands/revision/results at completion. Local verification is separate from remote CI, merge and
  release.

## Editorial sources

Reviewed October 17, 2026:

- [Angular resources](https://angular.dev/guide/signals/resource): adapt problem/example/explanation before status
  tables.
- [TanStack Quick Start](https://tanstack.com/query/latest/docs/framework/react/quick-start): adapt a working path with
  required setup and links to focused guides; do not copy defaults or public API behavior.
- [Diátaxis](https://diataxis.fr/): separate reader needs; do not impose all four documentation modes on every page.

## Local delivery evidence — October 17, 2026

Implementation revision: `4264a75` (follow-up to PR head `a51d132`). No library exports, signatures or runtime contracts
changed. This revision adds compiled read/save/collection starters, seven guide destinations, shallow translated
navigation, reference anchors inside Clarity's scroll container, and narrow-screen header spacing. Introductory
playgrounds precede lifecycle/comparison/organization reference; TypeScript and HTML source are shown by default in
separate tabs and can be collapsed with Hide Code.

Completed local checks:

| Check                                                                            | Result                                                                           |
| -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Demo tests (`pnpm nx run demo:test --run`)                                       | 79 files, 238 tests passed                                                       |
| Tooling (`pnpm nx run @ngx-lift-workspace/source:tooling-test`)                  | 19 tests passed, including three complete-source parity checks                   |
| New learning E2E (`query-learning.spec.ts`)                                      | 15 cases passed across Chromium, Firefox and WebKit                              |
| Existing query/ownership/layout E2E                                              | 90 cases passed across Chromium, Firefox and WebKit                              |
| Demo and E2E lint; demo TypeScript                                               | Passed                                                                           |
| Dictionary checks                                                                | 11 complete dictionaries; 57 new translated learning/guide messages per language |
| Formatting, example formatting, `git diff --check`, relative documentation links | Passed; 31 relative file targets checked                                         |
| Demo production build                                                            | Passed                                                                           |

Browser checks include first-load and refresh failure, retained data, save input preservation and retry, collection
add/reorder/remove, all guide destinations, reference-anchor navigation, 390px layouts, runtime guide language changes,
query ownership/disposal, devtools, dark/RTL layouts and existing demo layout checks. Parsing, compilation, interaction
checks, and human judgment are different evidence: these tests do not establish that a new developer can learn the API
without help or that every translation has native-speaker approval.

## Integration and remaining acceptance

PR #161 and its follow-ups are merged.
[Main CI at 5bee7e1](https://github.com/wghglory/ngx-lift-workspace/actions/runs/39036851435) passed full validation,
installed-package verification and the complete three-browser suite; the
[demo deployment](https://github.com/wghglory/ngx-lift-workspace/actions/runs/39036851437) also passed. The earlier
local revision above records development evidence; it no longer describes unmerged work.

Maintainer/newcomer reading and native-language review remain open. Publication is separate, under the
[release policy](DEPLOYMENT.md#version-policy). Later documentation changes require their own PR checks.
