# Signal and Clarity documentation follow-up

This follows the query learning path in PR #161. It changes the documentation app, not the libraries' public APIs.
Existing URLs remain stable. PR #161 merged into `main` as `cc1590e`; this follow-up merged as PR #162. The
[site-wide refinement roadmap](documentation-refinement-roadmap.md) records the merged catalog and remaining human
acceptance explicitly.

## Reader outcomes and destinations

| Page             | First successful action                           | Follow-up learning                                                                 | Reference                                    |
| ---------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------- | -------------------------------------------- |
| `computedAsync`  | Change a number and see its delayed derived value | Promise/Observable sources, initial values, errors and concurrency                 | Existing signature and options tables        |
| `resourceAsync`  | Change a user selection and see the response      | Basics, practical recipes, local state and nested resources in separate tabs       | Signature, options, status, then comparisons |
| `dgState`        | Refresh a server-driven grid                      | Read event coordination, request mapping and alternate templates after the preview | Exact debounce and duplicate-state behavior  |
| Timeline wizard  | Navigate forward and back through forms           | Define steps, map data and inspect submission                                      | Inputs, outputs, base class and service      |
| Key/value inputs | Edit a row and inspect the owned FormArray        | Validation and uniqueness after the preview                                        | Existing component tables                    |
| `toSignalForm`   | Complete the existing profile form                | Existing form recipes                                                              | Existing API reference                       |

The retry operator/interceptor retain their method-safety and wait-limit callouts beside setup, after the overview. The
theme-toggle note becomes ordinary introductory prose. These warnings and usage notes do not need a new page.

The server-driven grid and user examples call `randomuser.me`; the grid total is simulated. They demonstrate request
wiring, not a production backend's filtering/sorting implementation. Browser verification intercepts those HTTP calls
with deterministic data. The new computed example uses a timer and requires no network.

## Editorial decisions

- Start with the operation a reader can perform; put comparisons and exact state tables after the relevant examples.
- Keep imports and component logic in TypeScript tabs, and templates in HTML tabs.
- Use a single preview for the wizard and editor, followed by their supporting step/data examples.
- Keep useful warnings next to the operation they qualify. Turn introductory promotional banners into ordinary prose.
- Use tabs for the long resource tutorial; retain every existing recipe and its controls. Tabs change presentation, not
  the lifetime of the resource objects owned by the page.
- Keep the current navigation groups and public routes. New categories without new destinations would add navigation
  work without helping a reader find these existing pages.
- Preserve the query pages from the parent PR and its corrected expanded-code/caret behavior.

## Applicability and limits

The specifications under `docs/design/` remain the authority for runtime contracts; this is a documentation delivery
plan. No new component API, library dependency, package entry point, or release is introduced. The existing standards
and design template already distinguish tutorials, guides, explanations and reference; no second template is needed.
This follow-up established six entry flows. The subsequent catalog refinements, including existing playgrounds, are
tracked in the [refinement roadmap](documentation-refinement-roadmap.md). Short reference pages do not need the long
resource page’s tab structure.

A successful build proves template validity. Browser interaction proves the demonstrated flow, not newcomer
comprehension or native-language review. Those human acceptance gates remain open.

## Validation

Completed locally on October 17, 2026:

| Check                                           | Result                                                                                       |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Demo unit tests                                 | 81 files, 256 tests passed                                                                   |
| Tooling and example formatting                  | 21 tests passed, including datagrid and computed starter source checks                       |
| Learning/query/forms/wizard browser regressions | 39 cases passed across Chromium, Firefox and WebKit                                          |
| Retry, theme and dark/RTL browser regressions   | 24 cases passed across the same browsers                                                     |
| Demo and E2E lint                               | Passed without lint warnings                                                                 |
| Localization                                    | All 11 dictionaries complete, 1,910 entries each; 14 new teaching labels/messages per locale |
| Demo production build                           | Passed without Angular template warnings                                                     |
| Formatting and whitespace                       | Prettier and `git diff --check` passed                                                       |

Browser checks include reactive user selection, fallback responses, tab navigation and restored selection, repeated
async derivation, datagrid refresh, wizard forward/back navigation, separate HTML source, and 390px entry-point layouts.
The resource reorganization preserves all 29 event bindings and 36 template-state reads from the parent version.

Coverage follow-up: the branch includes the PR #161 repair (`791ae20`), adding 17 transport/save tests. A fresh demo
coverage run on this follow-up branch passes with 78.60% branch coverage (338/430), above the unchanged 75% threshold.
The parent PR independently passes locally at 79.06% (340/430).

The production build compiles the final demo templates; library/package verification is not rerun because `libs/` and
package metadata are unchanged. Local review found no blocking issues. Human newcomer comprehension and native-language
review remain open. Main integration and deployment evidence is linked in the refinement roadmap; publication remains
separate.

The remaining catalog was delivered through twelve merged implementation PRs, tracked in the
[refinement roadmap](documentation-refinement-roadmap.md). Those sibling PRs own the other pages; #162 retains the
focused entry-flow scope described here.
