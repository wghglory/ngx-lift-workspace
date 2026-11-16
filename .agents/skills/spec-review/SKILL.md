---
name: spec-review
description:
  Review a design spec, a public API proposal, or its docs-only PR across admission, specification quality, contracts,
  accessibility/language, dependency cost, evidence, and codebase gaps. This skill should be used before implementation
  and after a spec PR is opened; it complements the built-in code-review pass, which reviews an implementation diff only.
---

# Review a design spec

Produce a multi-aspect review of a proposed public API before code exists. Use the canonical
[development workflow](../../../docs/design/component-development.md),
[acceptance contract](../../../docs/guides/accessibility-and-localization.md), and
[gap taxonomy](../find-repo-gaps/references/gap-taxonomy.md) as the rule sources. Read
[review aspects](references/review-aspects.md) and apply every aspect. Review the spec and the codebase as they exist now;
a historical snapshot is evidence of a past state, not a current claim. The named minimum is admission, API design,
contracts, accessibility/language, dependency cost, evidence separation, and codebase gaps; the remaining aspects carry
the workflow's required checks into the same verdict table.

## Workflow

1. Read the spec, the relevant public barrels, and the current source. Run the
   [find-repo-gaps](../find-repo-gaps/SKILL.md) workflow when the review spans docs/codebase drift; otherwise check the
   register and the specific claims directly. When a claim under review cites a PR number, check its current state with
   the [issue tracker](../../../docs/agents/issue-tracker.md) workflow. **Completion:** every claim under review has a
   paired source of truth and every cited PR number has a recorded state.
2. Apply every aspect in [review aspects](references/review-aspects.md). For each, record `Pass`, `Needs change`, or
   `Blocked`, one evidence line with a path or URL, and the concrete change needed. **Completion:** no aspect is left
   unmarked and no verdict rests on an unchecked assertion.
3. Check the admission decision against [admission criteria](../lift-design/references/admission-criteria.md). A proposal
   that should have been rejected is a blocking finding even if its spec is well written. **Completion:** the gate verdict
   is confirmed or challenged with evidence.
4. Report a single disposition: `Recommend approval`, `Request changes`, or `Reject`. List blocking findings first, then
   non-blocking ones, each with an owner. **Completion:** the recommendation names the exact scope the maintainer may
   approve and the conditions that must be met before implementation.
5. Apply the [acceptance contract](../../../docs/guides/accessibility-and-localization.md) to the review report: keep
   automated checks, independent human language acceptance, and manual assistive-technology decisions in the separate
   sections it defines. **Completion:** the report follows that contract's section and waiver rules.

## Boundaries

This skill reviews specs and repository alignment; it recommends or withholds readiness for maintainer approval and
does not itself approve implementation, merge, or publication. After implementation, run the built-in `code-review` pass
on the diff for standards and spec conformance. Report in chat by default and keep committed prose in English with
generic maintainer, package, and application names.
