# Clarity component roadmap

Status: **Draft for maintainer review**. Updated October 18, 2026 (Asia/Shanghai). This document proposes order and
scope; it does not approve APIs or authorize component implementation. The [delivery roadmap](priority-roadmap.md)
retains existing release, security, and acceptance work.

## Recommended order

| Order       | Deliverable                            | Why this comes here                                                                 | Exit condition                                                     |
| ----------- | -------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| 0           | Spec template and development workflow | Make reviewable use cases and API examples the starting point                       | Maintainer reviews this plan and the template                      |
| 1           | Angular 21 shared form contract        | Avoid redesigning each control around incompatible form ownership                   | Angular 21 installed consumers and three integration examples pass |
| 2           | Resume key/value inputs                | Important existing control; its FormArray coupling needs the agreed form contract   | Array value API and legacy migration approved                      |
| 3           | YAML viewer, then editor               | Supports immediate inspect/edit needs and later Postgres workflows                  | Text, validation, engine loading, and disposal verified            |
| 4           | Date/time inputs and ranges            | Broad scheduling/filtering value, but substantial locale/time-zone complexity       | Date-only/time/instant contracts and range behavior verified       |
| 5           | Deep object-path breadcrumbs           | Focused navigation improvement with a clear object-store use case                   | Every ancestor remains reachable at narrow widths                  |
| 6           | Drawer                                 | Reusable details/edit surface once form and overlay behavior are settled            | Modal/nonmodal behavior and nested control focus verified          |
| 7           | Cascader, then tree-select             | Specialized hierarchy selection; share only demonstrated common behavior            | Concrete hierarchy consumer and lazy-selection semantics approved  |
| 8           | Calendar view                          | Event visualization differs from a picker; no current scheduling-engine requirement | Named consumer and bounded visible-range loading contract          |
| Reuse first | Badges/labels                          | Clarity already provides both; first document composition and remaining gaps        | Add a wrapper only for a demonstrated missing behavior             |

New value controls target **Angular 21 first**. Angular 22 and the Nx major upgrade are **deferred** and do not block
component delivery. Review the shared CVA contract and each feature API before implementation. The earlier
migration-dependent key/value hold is superseded; preserving its existing FormArray API remains mandatory until a
compatible migration is approved. Release fixes, security remediation, and pending acceptance remain independent.

## Verified starting point and corrections

- Workspace manifest: Angular **21.2.17**, CDK **21.2.10**, Nx and official Nx plugins **22.7.5**, TypeScript **5.9.x**.
- Installed Clarity **18.4.0** permits Angular/CDK `^21.1.0 || 22`; this is a peer declaration, not rendering evidence.
- `ngx-lift` is **21.4.0** and `clr-lift` **21.3.0**. Their current broad Angular peers are not proof of Angular 22
  support.
- `toSignalForm(FormGroup)` exposes signals over Reactive Forms. It does not create an Angular Signal Forms `FieldTree`.
- The existing key/value control requires a `FormArray`; it is not yet a general value control for all form modes.
- Clarity also supplies breadcrumbs, badges, and labels. Compare its real behavior before adding equivalents.

## Package release decision

Both packages remain on 21.x; 22.x is reserved for the Angular 22 upgrade. The
[version policy](DEPLOYMENT.md#version-policy) records the maintainer-approved compatibility exception and migration
requirements. Documentation closeout changes neither dependency pins nor package versions.

## Platform decision

The maintainer's October 16 direction settles the delivery order:

1. Keep the current Angular 21 / Nx 22 platform. New form controls support typed Reactive Forms and ngModel through CVA.
   Demonstrate the existing `toSignalForm(FormGroup)` facade as Reactive Forms integration. Do not add native Signal
   Forms dependencies or bindings in this phase. Ordinary Angular signals remain valid implementation tools.
2. Review and deliver controls in the order above. A new key/value value API must coexist with the existing required
   FormArray API or have a separately approved breaking release; this roadmap does not approve its proposed replacement.
3. Revisit Angular 22 and Nx together in a separate platform PR. At that time select mutually supported pinned Angular,
   CDK, Nx, TypeScript, Node, packaging and test tooling versions using current official compatibility guidance. Recheck
   third-party peers and installed declarations before generating migrations. No dependency pins change in this PR.
4. After the upgrade, add native signal-field support to **every new value control**: key/value value editor, YAML
   editor, temporal inputs/ranges, cascader, tree-select, and selectable calendar. The viewer, breadcrumbs, badges and
   drawer have no artificial form value. File-reader and wizard form integration must also be reviewed during this
   sweep; the wizard hosts fields rather than being a field itself.
5. Require native value/reset/disabled/readonly/touched/validation/pending and async cancellation tests, real form
   submissions, browser demos and strict installed consumers. Keep Angular 21 CVA behavior until an explicit supported
   version/release decision replaces it. A CVA alone does not establish native signal-field support.

The [forms contract](design/clr-lift/forms-compatibility-design-spec.md) owns the two phases and acceptance matrix. Its
October 18 contract revision `1e3ae98` was accepted by the maintainer in chat review: owner writes/reset, composite
touch, Angular commit timing, validation and payload policy have concrete examples and gates. Implementation and
installed-consumer proof remain pending; the shared-form roadmap item is not complete merely because the contract is
written. Compatibility/release policy for the upgrade remains open; the decision to deliver Angular 21 controls first is
settled.

## Specifications to review

| Area                                                 | Draft                                                                           |
| ---------------------------------------------------- | ------------------------------------------------------------------------------- |
| Shared form behavior and staged integration examples | [Forms compatibility](design/clr-lift/forms-compatibility-design-spec.md)       |
| Repeating key/value fields                           | [Key/value inputs](design/clr-lift/key-value-inputs-design-spec.md)             |
| Read, edit, validate, and synchronize YAML           | [YAML editor](design/clr-lift/yaml-editor-design-spec.md)                       |
| Date, time, date-time, ranges, and calendar          | [Temporal controls](design/clr-lift/temporal-controls-design-spec.md)           |
| Deep folder navigation                               | [Object paths](design/clr-lift/object-path-breadcrumb-design-spec.md)           |
| Cascader and tree-select                             | [Hierarchical selection](design/clr-lift/hierarchical-selection-design-spec.md) |
| Details and edit panels                              | [Drawer](design/clr-lift/drawer-design-spec.md)                                 |
| Counts, dots, status, and text tags                  | [Badges](design/clr-lift/badge-design-spec.md)                                  |

## Delivery policy

Each feature moves through **Draft → API reviewed → Implementing → Verified → Released**. Record approval and the spec
revision it covers; a draft example is not an available export. Changes to approved behavior return to API review. Use
the [template](design/templates/component-design-spec.md) and [workflow](design/component-development.md).

Review API examples first, then behavior, then implementation. Design YAML synchronization now, but deliver it after the
editor has its own reliable contract. Calendar reuses date logic without turning the picker into a scheduling product.

No dates or engineering estimates are promised before feature API review. Each implementation increment must build and
have useful tests; keep migration, new controls, and Postgres integration independently reviewable.

## Current validation boundary

This change contains planning and agent instructions only. Source and reference inspection informed the proposals.
Component demos, unit tests, E2E, installed Angular 22 consumers, performance measurements, human translation review,
and publication are future acceptance work. Documentation formatting, links, and diff checks are recorded separately.
