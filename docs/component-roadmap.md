# Clarity component roadmap

Updated 2026-11-14. This roadmap records the component sequence and maintainer decisions; it does not approve APIs or
authorize implementation. Breadcrumb navigation, datagrid selection and the additive key/value control are delivered in
`ngx-lift 21.5.0` / `clr-lift 21.4.0`. YAML viewer/editor work is paused; no API review or implementation is scheduled.
The [delivery roadmap](priority-roadmap.md) owns release, security and acceptance work.

## Recommended order

| Order | Deliverable                 | Why it comes here                                                                   | Exit condition                                                    |
| ----- | --------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| 1     | Date/time inputs and ranges | Broad scheduling/filtering value, but substantial locale/time-zone complexity       | Date-only/time/instant contracts and range behavior verified      |
| 2     | Drawer                      | Reusable details/edit surface once form and overlay behavior are settled            | Modal/nonmodal behavior and nested control focus verified         |
| 3     | Cascader, then tree-select  | Specialized hierarchy selection; share only demonstrated common behavior            | Concrete hierarchy consumer and lazy-selection semantics approved |
| 4     | Calendar view               | Event visualization differs from a picker; no current scheduling-engine requirement | Named consumer and bounded visible-range loading contract         |

New value controls target Angular 21 first. Angular 22 and the Nx major upgrade are deferred and do not block component
delivery. Review the shared CVA contract and each feature API before implementation. Release fixes, security remediation
and remaining acceptance records remain independent.

## Current baseline

- Workspace manifest: Angular 21.2.17, CDK 21.2.10, Nx and official Nx plugins 22.7.5, TypeScript 5.9.x.
- Installed Clarity 18.4.0 permits Angular/CDK `^21.1.0 || 22`; this is a peer declaration, not rendering evidence.
- `ngx-lift` 21.5.0 and `clr-lift` 21.4.0 are published. Their broad Angular peers are not proof of Angular 22 support.
- `toSignalForm(FormGroup)` exposes signals over Reactive Forms. It does not create an Angular Signal Forms `FieldTree`.
- `cll-key-value-inputs` retains its caller-owned `FormArray`; additive `cll-key-value-control` binds one immutable
  array through ngModel, typed Reactive Forms and `toSignalForm`.
- Clarity also supplies breadcrumbs, badges and labels. Compare its real behavior before adding equivalents.

## Platform decision

1. Keep the current Angular 21 / Nx 22 platform. New form controls support typed Reactive Forms and ngModel through CVA.
   Demonstrate the existing `toSignalForm(FormGroup)` facade as Reactive Forms integration. Do not add native Signal
   Forms dependencies or bindings in this phase. Ordinary Angular signals remain valid implementation tools.
2. Preserve the existing `cll-key-value-inputs` FormArray API. The additive `cll-key-value-control` is the approved
   coexistence shape; no breaking replacement is approved.
3. Revisit Angular 22 and Nx together in a separate platform PR. Select mutually supported pinned Angular, CDK, Nx,
   TypeScript, Node, packaging and test tooling versions using current official compatibility guidance. Recheck
   third-party peers and installed declarations before generating migrations.
4. After that upgrade, add native signal-field support to every new value control that is later approved: temporal
   inputs/ranges, cascader, tree-select and selectable calendar. File-reader and wizard form integration must also be
   reviewed during this sweep; the wizard hosts fields rather than being a field itself. The paused YAML work is not
   part of the sweep unless that decision is explicitly reversed.
5. Require native value/reset/disabled/readonly/touched/validation/pending and async cancellation tests, real form
   submissions, browser demos and strict installed consumers. Keep Angular 21 CVA behavior until an explicit supported
   version/release decision replaces it. A CVA alone does not establish native signal-field support.

The [forms contract](design/clr-lift/forms-compatibility-design-spec.md) owns the two phases and acceptance matrix.

## Specifications to review

| Area                                                 | Draft                                                                           |
| ---------------------------------------------------- | ------------------------------------------------------------------------------- |
| Shared form behavior and staged integration examples | [Forms compatibility](design/clr-lift/forms-compatibility-design-spec.md)       |
| Repeating key/value fields                           | [Key/value inputs](design/clr-lift/key-value-inputs-design-spec.md)             |
| YAML viewer/editor (paused draft)                    | [YAML editor](design/clr-lift/yaml-editor-design-spec.md)                       |
| Date, time, date-time, ranges, and calendar          | [Temporal controls](design/clr-lift/temporal-controls-design-spec.md)           |
| Deep folder navigation                               | [Breadcrumbs](design/clr-lift/breadcrumb-design-spec.md)                        |
| Cascader and tree-select                             | [Hierarchical selection](design/clr-lift/hierarchical-selection-design-spec.md) |
| Datagrid selection form control                      | [Native grid selection](design/clr-lift/datagrid-selection-design-spec.md)      |
| Details and edit panels                              | [Drawer](design/clr-lift/drawer-design-spec.md)                                 |

## Delivery policy

Each feature moves through **Draft → API reviewed → Implementing → Verified → Released**. Record approval and the spec
revision it covers; a draft example is not an available export. Changes to approved behavior return to API review. Use
the [template](design/templates/component-design-spec.md) and [workflow](design/component-development.md).

Review API examples first, then behavior, then implementation. Calendar reuses date logic without turning the picker
into a scheduling product. No dates or engineering estimates are promised before feature API review. Each implementation
increment must build and have useful tests; keep migration, new controls and Postgres integration independently
reviewable.

## Current validation boundary

Other proposed controls remain drafts; YAML work is paused. Installed Angular 22 consumers and dedicated large-scale
performance measurements remain separate work. Automated checks, human acceptance, CI, merge and publication are
recorded separately in the PR, workflow runs and release evidence.
