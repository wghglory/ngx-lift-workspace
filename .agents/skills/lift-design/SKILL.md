---
name: lift-design
description:
  Decide whether a proposed public ngx-lift utility or clr-lift component should exist at all, then design it through
  consumer evidence, industry comparisons, and API review. This skill should be used before implementation of any new
  public component, utility, operator, directive, pipe, validator, service, form integration, or entry point; when a
  request asks whether a new tool is valuable or fits the project; and when an existing public contract changes.
---

# Design library behavior

Use the repository's [development workflow](../../../docs/design/component-development.md) as the canonical acceptance
policy. The [component roadmap](../../../docs/component-roadmap.md) defines Angular 21 delivery and the deferred
platform upgrade. The sequence is admission decision, then industry comparison, then spec, then spec PR and review,
then implementation; "design spec first" means the spec precedes implementation.

## Admission gate

Before writing a spec, decide whether the proposed public API belongs in the project. Read
[admission criteria](references/admission-criteria.md) and apply every test to every proposed symbol. Gather evidence
from current primary sources and the current codebase; note the check date and URL for each industry claim. Record one
row per symbol with the test result and a verdict: `Proceed to spec`, `Request consumer evidence`, or `Reject`.

**Completion:** a written admission decision exists with one evidence line per symbol. A `Reject` verdict ends the
skill here: report it in chat with the failing test, open no spec and no implementation PR, and keep the rejected API
out of every public barrel.

## Industry comparison

For admitted symbols, inspect current primary documentation and source: Clarity, Angular Material, NG-ZORRO, and the
relevant React libraries; add RxJS/MDN/browser sources for headless helpers. Record concrete adopt/adapt/reject decisions
with URLs and a note on what each alternative already covers. A thin wrapper over a stable platform API is a reason to
reject, not a feature.

**Completion:** every admitted symbol has a source row naming what exists, what is missing, and the chosen decision.

## Author the spec

Create or update the spec under `docs/design/ngx-lift/` or `docs/design/clr-lift/` using the
[template](../../../docs/design/templates/component-design-spec.md). Preserve an existing canonical spec. Include the
admission decision, goals, non-goals, acceptance use cases, minimal/advanced examples, failure states, compatibility,
and the evidence from the industry comparison. Keep proposed APIs visibly provisional until approved.

Apply the [form contract](../../../docs/design/clr-lift/forms-compatibility-design-spec.md) to value controls. For
display, navigation and utilities, explain the relevant integration instead of adding an artificial form value.

**Completion:** the spec is reviewable and states the consumer, the industry gap, and every unresolved decision.

## Spec PR and review

Open a docs-only PR for the spec and run the [spec review](../spec-review/SKILL.md) on it before any implementation.
For a full docs/codebase drift sweep, read [find-repo-gaps](../find-repo-gaps/SKILL.md). Present the draft/API changes
for maintainer review unless explicit approval already covers that exact scope; record the approval scope. On a
design-only request, stop here.

**Completion:** the spec PR link, the review findings, and the approval scope are recorded.

## Implement after approval

After approval, implement functional increments and satisfy the workflow's demos, localization, tests, accessibility,
lifecycle, performance and installed-consumer gates. Update the spec with actual evidence and submit the implementation
as a separate PR. Diff review of that PR is the built-in `code-review` pass, not a substitute for the earlier sections.

**Completion:** the approved scope is implemented with acceptance evidence; remaining external gates are reported.

Read [documentation standards](../../../docs/documentation-standards.md) when editing demo pages. Use the local
nx-workspace skill to discover targets and the manifest/command guide for actual commands. Scale validation to the
change; do not run component suites for a documentation-only draft or claim planned tests passed.

Completion of the requested scope means either a reviewable decision/draft with unresolved decisions stated, or an
approved implementation with acceptance evidence and remaining external gates reported. Merge and publication require
their own authorization and evidence; this skill does not create that authorization.
