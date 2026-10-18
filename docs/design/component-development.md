# Component and utility development workflow

This policy applies to new public tools/components and changes to existing public behavior in ngx-lift and clr-lift. It
records the maintainer's October 15, 2026 direction. Formatting-only work uses the existing spec without inventing a new
one.

## Design before implementation

1. Read the relevant spec and current code. When a spec is absent, create one from the
   [template](templates/component-design-spec.md); when behavior changes, update it first.
2. Check current primary sources from Clarity, Angular Material, NG-ZORRO, and relevant React libraries. Record concrete
   gaps and adopt/adapt/reject decisions. Use patterns appropriate to the feature; API count is not a quality target.
3. Write practical use cases, goals, non-goals, the developer learning journey (elevator pitch, hello world, and
   progressive learning path), minimal and advanced API examples, errors, and compatibility. Select additional contracts
   by behavior (forms, UI, async, shared cache), not by package. Keep proposed APIs visibly provisional. Show what the
   consumer imports, binds, and submits.
4. Present the spec/API changes for maintainer review. Implement after approval for that scope; existing explicit
   approval remains valid. A material new behavior or breaking API requires review of the updated proposal.
5. Deliver small functional increments. Update the approved spec with final behavior and evidence.

## Form applicability

New value controls first ship on Angular 21 with ngModel and typed Reactive Forms through ControlValueAccessor.
Demonstrate Reactive Forms observed with the existing `toSignalForm` facade separately; it is still Reactive Forms.
Native Signal Forms integration is deferred until the Angular/Nx upgrade, then required for every new value control,
including selectable calendars. Keep value types and interaction state independent of the form bridge so that later
signal-field support preserves the value contract. Follow the
[form contract](clr-lift/forms-compatibility-design-spec.md). Display/navigation tools integrate inside forms without
pretending to be values; explain this in their specs. Utilities document the form integration relevant to their purpose.

## Required feature acceptance

Apply the [accessibility and language acceptance contract](../guides/accessibility-and-localization.md) to library and
demo work, including AI-generated changes. Complete every supported dictionary as part of the feature increment; runtime
English fallback does not satisfy delivery. Include visible text, accessible names/descriptions, validation,
loading/error messages, and announcements. Keep automated evidence and independent human approval separate.

Prefer native browser capabilities and existing supported dependencies. Justify each new runtime dependency against
important approved use cases, including transitive cost, maintenance, licensing, installation and production
integration. For optional heavy features, verify both installed-dependency isolation and bundle isolation; a dynamic
import alone proves neither optional installation nor absence from an unrelated consumer's build. Record the decision in
the spec.

- Each approved use case appears in the demo app, with working code through `app-demo-playground` wherever practical.
  Include imports, value/state, reset, validation, errors, disabled/readonly, and a realistic advanced use case.
- All demo pages use `cll-page-container`, Clarity controls/tokens and `cds-layout`, with light/dark, compact,
  responsive, keyboard, touch, and RTL behavior considered. Use existing documentation standards for page organization.
- Library strings, demo prose, API tables, helper/error text, and announcements cover every supported language. Preserve
  placeholders/plurals and verify runtime switching. Translation checks and native-speaker acceptance are different
  gates.
- Unit tests cover meaningful transitions, races, identity, forms, errors, and cleanup. Add type tests for
  generic/public contracts. Aim above 70% for new logic and prioritize critical branches over coverage-only assertions.
- Browser E2E covers practical journeys in Chromium, Firefox, and WebKit, with stable role-based selectors, controlled
  network fixtures, and no timing sleeps. Assert projected content and actual user-visible results.
- Verify accessibility semantics and keyboard/focus behavior, and manually check relevant assistive-technology flows.
  Check contrast, large text/zoom, long labels, and translated layouts; automated scans alone are insufficient.
- Measure relevant scale and bundle budgets. Bound remote pages and rendering independently. Verify cancellation,
  disposal, optional heavy dependencies, safe rendering, and documented SSR/hydration behavior.
- Verify installed public packages with strict peers/types and declared render modes; repo path aliases are
  insufficient. Update public JSDoc, navigation/API docs, migration notes, release/version decisions, and peer ranges
  when applicable.

## Validation and reporting

Discover resolved Nx targets using the local nx-workspace skill. Use focused checks during development, then the
applicable repository gates in [COMMANDS](../COMMANDS.md). Current release gates include `pnpm run validate` and
`pnpm nx run demo-e2e:e2e`; verify these against the manifest before running them. Use `git diff --check` for every
change. Documentation-only changes need formatting and link/diff checks; they do not need a component test run.

Report exact scope and failures. Keep local verification, CI, maintainer/API approval, human acceptance, merge, and
publication separate. Production ready means the applicable acceptance evidence exists, not simply that code or examples
were generated.
