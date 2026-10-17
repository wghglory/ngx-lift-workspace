# <Feature name> design specification

Status: Draft | API reviewed | Implementing | Verified | Released. Owner: <owner>. Updated: <date>. Approval: <review
link and approved revision, or pending>. Package: ngx-lift | clr-lift. All proposed symbols and examples are unavailable
until implemented and verified. For existing APIs, use Status: Implemented (contract audit), record source/test
pointers, and distinguish source inspection from tests actually run. Preserve accurate existing sections; fill
substantive gaps without rewriting prose. Store package specs in `docs/design/ngx-lift/` or `docs/design/clr-lift/`.

## Applicable contracts

Select requirements by behavior, not package. Keep the common problem, goals, use cases, public API, documentation plan,
compatibility, decisions, and evidence sections. Record which additional contracts apply and why:

- Value/form integration: value types, validation, CVA or the actual forms bridge (including headless form utilities).
- Rendered UI: Clarity tokens, focus, keyboard/touch, accessible names, responsive layout and localization.
- Reactive/async APIs: dependency capture, execution boundaries, races, cancellation, errors and disposal.
- Shared state/cache: identity, observer ownership, freshness, retention, invalidation and scope isolation.
- Other utilities: their relevant input/output, platform and performance contracts.

A display component need not own a form value. A headless utility can integrate with forms. Omit irrelevant detail with
one reason; do not impose signal/cache requirements on synchronous utilities or CVA requirements on every UI component.

## Background

Describe the customer problem, existing callers, and the smallest useful delivery. Link source evidence and existing
specs. Distinguish observed behavior, upstream capabilities, and proposals.

## Terminology

Define domain terms that change API meaning: selection versus query, key versus label, draft versus committed value.

## Goals

- G1: State a customer outcome and observable success condition.
- G2: State the outcome for application developers and its compatibility implications.

## Non-Goals

### Not now

List reasonably expected features deferred from this increment, with alternatives or follow-up ownership.

### Outside this API

State durable boundaries, such as backend authorization or domain-specific persistence.

## Use cases and acceptance

| ID  | Actor and task   | Initial data/state       | Action        | Observable outcome          | Failure/recovery | Demo/test                |
| --- | ---------------- | ------------------------ | ------------- | --------------------------- | ---------------- | ------------------------ |
| UC1 | <practical task> | <including edit/prefill> | <interaction> | <including submitted value> | <error/reset>    | <planned or actual path> |

Cover real user journeys, keyboard and touch, empty results, unavailable data, long/localized content, and applicable
scale. Each goal maps to at least one use case. Later record actual test pointers; planned coverage is not evidence.

## Industry evidence and current gaps

| Existing implementation / primary source             | Verified behavior                 | Adopt, adapt, or reject | Our gap and reason |
| ---------------------------------------------------- | --------------------------------- | ----------------------- | ------------------ |
| Clarity source and current local implementation      | <specific behavior>               | <decision>              | <customer impact>  |
| Angular Material / NG-ZORRO / relevant React library | <specific behavior, URL and date> | <decision>              | <tradeoff>         |

Research comparable production libraries before creating or changing behavior. Borrow interaction lessons while
retaining Clarity styling. Prefer composition over replacement when public Clarity APIs satisfy the use cases.

## Developer learning journey and pedagogy plan

Record a documentation brief that can be verified against the delivered pages:

| Reader task / prerequisites        | Learning outcome                        | Destination / page type   | Working example and expected result    | Validation                     |
| ---------------------------------- | --------------------------------------- | ------------------------- | -------------------------------------- | ------------------------------ |
| <first task and assumed knowledge> | <what the reader can build and explain> | <actual route or section> | <source/template and visible behavior> | <compile/browser/reader check> |

Include the first complete working task, then the next practical tasks. Introduce vocabulary where it is used; link to
shared explanations instead of duplicating architecture banners. Reference pages serve lookup directly. Provide short
teaching excerpts with explicitly stated prerequisites and a complete runnable example; avoid arbitrary line limits.
Define stable destinations for advanced organization/naming, comparisons, and exact state/option tables. Separate the
runtime implementation status from the documentation delivery status. Record checks actually performed; a proposed route
or a prose description of a future example is not delivery evidence.

## Public API and examples

Define minimal inputs/outputs, types, defaults, identity, empty/null/reset behavior, and validation semantics. Show
imports, a minimal local example, a realistic advanced example, and submitted data. Mark examples as proposed until they
compile against the public package. Explain why each advanced option is necessary; avoid mandatory configuration DSLs.
For value controls, reference the shared [forms contract](../clr-lift/forms-compatibility-design-spec.md). Show the
feature's values in Angular 21 ngModel, typed Reactive Forms, and Reactive Forms + `toSignalForm`; record native
signal-field support as required after the platform upgrade, with its own acceptance cases. Keep Angular 21 examples
free of native Signal Forms imports. For a utility or display/navigation component, explain form applicability
explicitly.

## Behavior and architecture

Describe state transitions, ownership, async cancellation, stale results, error recovery, lifecycle/disposal, and
controlled versus internally managed behavior. Specify overlay/focus handling where relevant. Use a diagram when it
makes this clearer. Separate a private reusable mechanism from a public API. Document dependencies, optional/lazy
loading, SSR behavior, and security/resource limits that actually apply to the feature.

## Clarity, accessibility, and localization

Define Clarity containers, tokens, light/dark and compact modes, responsive layout, keyboard behavior, accessible names,
focus restoration, announcements, and RTL. List every user-visible string, plural/interpolation rule, locale/date
behavior, and runtime language-switch behavior. Cover all supported dictionaries; record human language review
separately.

## Demo and validation plan

Map every approved practical use case to a Clarity-styled demo and test. Use `app-demo-playground` with working copyable
TypeScript/HTML and SCSS when relevant. Show real value/state, pending/errors, validation, reset, disabled and readonly.
Define focused unit/state/type tests, browser E2E and accessibility checks, installed-package consumers, and measured
performance budgets for relevant workloads. Include lifecycle/repeated mount tests when resources or overlays are owned.
Use existing repository validation commands and targets; keep release validation separate from focused development
checks.

## Compatibility, rollout, and risks

For each proposed dependency, identify the important use case it enables, browser/existing-library alternatives,
maintenance and transitive costs, and how installed consumers avoid it when the feature is optional. Distinguish package
installation from lazy loading. Obtain review of this decision before introducing a new runtime dependency.

State supported Angular/Clarity versions, peer/entry-point impact, migration examples, breaking changes, bundle costs,
fallbacks, and rollback. Identify unresolved risks and an acceptance owner for each.

## Review decisions and delivery

List choices the maintainer must settle, alternatives, and the recommended option. Record approved decisions before
code. Split implementation into independently functional, reviewable increments. Update this document when behavior
changes.

## Evidence

Record actual validation with revision, scope, result, and remaining limitations. Keep Draft when only planning is
complete; never treat a checklist, mocked UI, dictionary parity, or a peer range as production-readiness evidence.
