# Clarity component roadmap

Status: **Draft for maintainer review**. Updated October 15, 2026 (Asia/Shanghai). This document proposes order and
scope; it does not approve APIs or authorize component implementation. The [delivery roadmap](priority-roadmap.md)
retains existing release, security, and acceptance work.

## Recommended order

| Order       | Deliverable                                   | Why this comes here                                                                 | Exit condition                                                             |
| ----------- | --------------------------------------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| 0           | Spec template and development workflow        | Make reviewable use cases and API examples the starting point                       | Maintainer reviews this plan and the template                              |
| 1           | Angular/Nx migration and shared form contract | Avoid redesigning each control around incompatible form ownership                   | Compatible installed consumers and four form demos pass                    |
| 2           | Combobox and autocomplete                     | Highest reusable value: remote entity selection, tags, suggestions                  | Selection semantics, remote lifecycle, keyboard behavior, and API approved |
| 3           | Resume key/value inputs                       | Important existing control; its FormArray coupling needs the agreed form contract   | Array value API and legacy migration approved                              |
| 4           | YAML viewer, then editor                      | Supports immediate inspect/edit needs and later Postgres workflows                  | Text, validation, engine loading, and disposal verified                    |
| 5           | Date/time inputs and ranges                   | Broad scheduling/filtering value, but substantial locale/time-zone complexity       | Date-only/time/instant contracts and range behavior verified               |
| 6           | Deep object-path breadcrumbs                  | Focused navigation improvement with a clear object-store use case                   | Every ancestor remains reachable at narrow widths                          |
| 7           | Drawer                                        | Reusable details/edit surface once form and overlay behavior are settled            | Modal/nonmodal behavior and nested control focus verified                  |
| 8           | Cascader, then tree-select                    | Specialized hierarchy selection; share only demonstrated common behavior            | Concrete hierarchy consumer and lazy-selection semantics approved          |
| 9           | Calendar view                                 | Event visualization differs from a picker; no current scheduling-engine requirement | Named consumer and bounded visible-range loading contract                  |
| Reuse first | Badges/labels                                 | Clarity already provides both; first document composition and remaining gaps        | Add a wrapper only for a demonstrated missing behavior                     |

Key/value enhancement work is **on hold** until steps 0–1 are reviewed. No other agent was active in this chat when
checked; work in another session must be paused in that session. Existing component code remains available. Draft specs
can be reviewed before the migration. New form-control implementation follows the platform/form gate. Existing release
fixes, security remediation, and pending acceptance remain independent obligations.

## Verified starting point and corrections

- Workspace manifest: Angular **21.2.17**, CDK **21.2.10**, Nx and official Nx plugins **22.7.5**, TypeScript **5.9.x**.
- Installed Clarity **18.4.0** permits Angular/CDK `^21.1.0 || 22`; this is a peer declaration, not rendering evidence.
- `ngx-lift` is **21.3.0** and `clr-lift` **21.2.0**. Their current broad Angular peers are not proof of Angular 22
  support.
- `toSignalForm(FormGroup)` exposes signals over Reactive Forms. It does not create an Angular Signal Forms `FieldTree`.
- The existing key/value control requires a `FormArray`; it is not yet a general value control for all form modes.
- Clarity already supports `clrMulti`, selected pills, `clrInputChange`, loading listeners/spinner, and an
  [async multi-select example](https://github.com/vmware-clarity/ng-clarity/blob/main/projects/website/src/app/documentation/demos/combobox/combobox-async.demo.html).
  The proposed lift value is a simpler supported contract for cancellation, paging, errors, identity, and forms.
- Clarity also supplies breadcrumbs, badges, and labels. Compare its real behavior before adding equivalents.

## Platform decision

**Yes: use Nx migrations before implementing the new controls. Design review can start now.** Nx and Angular major
numbers need not match. The [Nx matrix](https://nx.dev/docs/kb/angular-nx-version-matrix) currently requires Nx >=23.1
for Angular 22.0 and >=23.2 for Angular 22.1. Select exact mutually supported versions during the migration; do not use
an unreviewed `latest` update. The [Angular matrix](https://angular.dev/reference/versions) lists TypeScript 6.0 and
newer Node patch floors for Angular 22.0; the current `node >=24.0.0` range is too broad for that target.

The native [FormValueControl contract](https://angular.dev/api/forms/signals/FormValueControl) is stable since v22.0.
Prefer a **22-only next major** for the new form contract, while preserving the existing 21.x line for current users.
Maintainer review must settle this before changing package peers or removing compatibility. Supporting both majors is
possible only if real installed consumers prove it; a peer-range edit cannot establish it.

Migration delivery is two reviewable changes where the supported intermediate configuration permits:

1. Record the baseline and choose compatible Nx, Angular, CDK, TypeScript, Node, ng-packagr, Angular ESLint, and
   Analog/Vitest versions. Inspect official migrations and third-party peers. Keep all official Nx packages at one
   version. End the spike with an approved 22-only or dual-major support decision and consumer acceptance matrix. If the
   migration is postponed, retain the new-control hold unless a separate CVA-based 21.x backport is explicitly approved.
2. Generate the pinned Nx migration plan, inspect `package.json` and `migrations.json`, install, then run generated
   migrations. Keep Angular at 21 during the tooling step if supported; otherwise document the required coordinated
   upgrade.
3. Apply Angular 22 migrations through the installed Nx Angular migration workflow, with reviewed exact dependency
   versions. Inspect the installed CLI help; do not assume the old Nx version supports flags added by newer
   documentation.
4. Recheck form APIs against the selected release, run package consumers, then update peer ranges, engines, release
   notes, lockfile, fixtures, CI, and demo together. Keep generated migrations reviewable.

The [official Nx procedure](https://nx.dev/docs/features/automate-updating-dependencies) separates generation from
execution: `pnpm nx migrate <reviewed-package-and-version>`, `pnpm install`, and `pnpm nx migrate --run-migrations` when
a migration file exists. These are future steps, not commands run by this planning change.

## Specifications to review

| Area                                               | Draft                                                           |
| -------------------------------------------------- | --------------------------------------------------------------- |
| Shared form behavior and four integration examples | [Forms compatibility](forms-compatibility-design-spec.md)       |
| Remote selection and text completion               | [Combobox and autocomplete](selection-controls-design-spec.md)  |
| Repeating key/value fields                         | [Key/value inputs](key-value-inputs-design-spec.md)             |
| Read, edit, validate, and synchronize YAML         | [YAML editor](yaml-editor-design-spec.md)                       |
| Date, time, date-time, ranges, and calendar        | [Temporal controls](temporal-controls-design-spec.md)           |
| Deep folder navigation                             | [Object paths](object-path-breadcrumb-design-spec.md)           |
| Cascader and tree-select                           | [Hierarchical selection](hierarchical-selection-design-spec.md) |
| Details and edit panels                            | [Drawer](drawer-design-spec.md)                                 |
| Counts, dots, status, and text tags                | [Badges](badge-design-spec.md)                                  |

## Delivery policy

Each feature moves through **Draft → API reviewed → Implementing → Verified → Released**. Record approval and the spec
revision it covers; a draft example is not an available export. Changes to approved behavior return to API review. Use
the [template](templates/component-design-spec.md) and [workflow](component-development.md).

Review API examples first, then behavior, then implementation. Selection's shared logic starts private; promote a public
utility only after independent consumers prove the need. Design YAML synchronization now, but deliver it after the
editor has its own reliable contract. Calendar reuses date logic without turning the picker into a scheduling product.

No dates or engineering estimates are promised before API review and the migration compatibility check. Each
implementation increment must build and have useful tests; keep migration, new controls, and Postgres integration
independently reviewable.

## Current validation boundary

This change contains planning and agent instructions only. Source and reference inspection informed the proposals.
Component demos, unit tests, E2E, installed Angular 22 consumers, performance measurements, human translation review,
and publication are future acceptance work. Documentation formatting, links, and diff checks are recorded separately.
