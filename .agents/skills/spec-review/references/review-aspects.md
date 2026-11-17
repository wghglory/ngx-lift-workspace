# Review aspects

Apply every aspect to the spec under review. Cite one source per verdict: a path, a line, a check result, a tracker
record, or a primary-source URL with a check date. The named minimum is admission, API design, contracts,
accessibility/language, dependency cost, evidence separation, and codebase gaps. The other rows carry the canonical
workflow's required checks into the same table; none is optional.

| Aspect | Check | Blocking when |
| --- | --- | --- |
| Admission | Re-run the [admission criteria](../../lift-design/references/admission-criteria.md) against every proposed symbol. | A core test fails and the spec proceeds anyway. |
| Consumer evidence | Each use case names a real caller, task, and outcome, not a demo interaction. | No consumer outside the demo app can be cited. |
| Industry comparison | Current Clarity, Angular Material, NG-ZORRO, React and relevant platform sources are compared with URLs and adopt/adapt/reject decisions. | Claims are unsourced, stale, or ignore an existing standard API. |
| API design | Minimal surface, stable naming, and no dual-mode parameter with unrelated semantics. | The public surface is ambiguous, unstable, or conflates two behaviors. |
| Contracts | Typed signatures, overloads, stable keys, errors/no-ops, and compatibility claims match the spec and the existing contract specs. | A contract is undefined, ambiguous, or contradicts an existing public contract. |
| Form applicability | Value controls use CVA, typed Reactive Forms and the existing `toSignalForm` facade; utilities explain their integration. | A display/navigation tool is given an artificial form value. |
| Accessibility | Keyboard, focus, semantics, motion, and state behavior are defined for UI work. | Visible behavior has no keyboard or focus contract. |
| Language | Every owned visible/announced string is listed for all supported locales; API identifiers and code stay in English. | Strings are hardcoded or dictionary parity is absent. |
| Dependency and bundle | New runtime dependencies name approved use cases, alternatives, and cost; entry points show installed-consumer bundle evidence. | Cost and isolation are unproven. |
| Lifecycle and safety | Cancellation, disposal, SSR behavior, global side effects, and cleanup are specified. | Library code mutates global DOM state or depends on private APIs. |
| Tests and demos | Unit/type/browser coverage, failure races, and an approved use case in the demo app are planned. | No plan for meaningful transitions, errors, and cleanup. |
| Evidence separation | Automated checks, human language approval, and assistive-technology decisions are recorded separately. | A check or waiver is reported as human acceptance. |
| Codebase gaps | Roadmap, changelog, tracker, and index claims match package, CI, and source evidence. Use the `Status drift` class when a closed or merged PR is described as open, pending, or under review. Preserve dated historical records that describe only their own increment. | A status, API, index, or duplication drift claim would mislead contributors. |
| Fit and sequence | The feature has a roadmap position and release/version decision; the spec revision is recorded. | No delivery position or approval scope is recorded. |

## Verdict rules

- `Recommend approval`: no blocking finding and the maintainer scope is explicit.
- `Request changes`: findings are fixable in the spec; list each concrete edit.
- `Reject`: admission fails or the API cannot be made compatible with the contracts above.
