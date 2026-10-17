# Signal and Clarity documentation follow-up

This follows the query learning path in PR #161. It changes the documentation app, not the libraries' public APIs.
Existing URLs remain stable. The review base is `docs/query-pedagogy-and-design-standards` until that PR is merged.

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
Other short component/operator pages already lead with an example or have a local warning that belongs beside it. They
do not need the same tab structure as the long resource page.

A successful build proves template validity. Browser interaction proves the demonstrated flow, not newcomer
comprehension or native-language review. Those human acceptance gates remain open.

## Validation

Results are recorded after the final implementation is checked. Remote CI, merge and publication are separate gates.
