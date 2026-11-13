# Datagrid selection implementation and acceptance

The selection exports shipped in `ngx-lift 21.5.0` / `clr-lift 21.4.0`. This document records the delivered behavior and
the acceptance boundaries. Language approval, the manual assistive-technology waiver, release and CI evidence are owned
by the [acceptance contract](../../guides/accessibility-and-localization.md) and the
[gap register](../../gap-register.md).

## Delivered behavior

clr-lift exports `DatagridSelectionComponent`, `DatagridSelectionAccessorDirective` and
`DatagridSelectionBindingDirective`, plus `DatagridSelectionKey`, `DatagridSelectionValue` and
`DatagridItemAvailability`. One caller-written label and native Clarity grid define the field. The grid supplies data,
mode, identity, loading, columns, filters and pagination. The shell supplies the CVA, ordered stable-key reconciliation,
field presentation and composite focus. It does not fetch data or allocate a second form control.

The adapter preserves unresolved keys, immutable incoming values and caller-owned native row restrictions. Owner writes
and reset do not echo changes. Single radios and optional native row-click mode share the same value bridge. Header
pointer/Space actions select or clear only the eligible filtered logical scope. Loading, readonly and Angular disabled
state guard applicable selection paths; loading does not disable the form owner. Selected unavailable items remain
removable, with explanations associated with their checkboxes.

The optional picker host directive forwards the owner's value, disabled state, validation and Angular change/blur/submit
buffering through one explicit inner binding. Missing, multiple or conflicting bindings and duplicate accessors are
diagnosed. Composite focus includes label help, grid/footer and Clarity-owned portals. Departure cancels focus
restoration.

Required uses Angular `RequiredValidator` with direct form bindings; the grid describes the requirement without an
invalid `aria-required`. Parent controls own count, async and business rules plus localized error text. The examples
omit disabled fields from DTOs through `toSignalForm`'s `omitIf` option.

## Runnable examples

Run `pnpm nx serve demo --port=4307 --hmr=false` and open
[/clr-lift/components/datagrid-selection](http://localhost:4307/clr-lift/components/datagrid-selection). The demo reads
a checked-in JSON asset through an HttpClient service; Playwright controls failure and loading responses at that
boundary. It is a local fixture, not a live business API.

The page covers direct multiple/single controls, `formControlName` with `toSignalForm`, a reusable picker and ngModel;
owner writes/reset, disabled/readonly, horizontal layout, availability, native filters/pagination and refresh/retry. A
server-paged playground loads one bounded page per scope/name/status/sort/page identity, retaining saved off-page keys,
scoped select-all/clear, failure and retry, reset-while-loading and stale responses. A reusable picker playground owns
its paged query while the parent owns keys, required validation and the saved-key baseline. A policy create/edit example
hosts two reusable pickers, hydrates detail-first, resets to the accepted baseline without a backend write and converts
selected keys into ID-only, reference or full-entity save DTOs.

All owned library and demo messages cover the eleven supported locales. Displayed source is generated from the runnable
source/template files by `node tools/demo/datagrid-selection-examples.mjs --write`; the tooling target checks drift. See
the [complete consumer examples](datagrid-selection-code-examples.md) and the
[detailed reference](datagrid-selection-reference.md) for contracts.

## Boundaries and remaining acceptance

- Angular 21 is the supported baseline. No native Signal Forms, SSR/hydration or native virtual-scroll acceptance is
  claimed; application-scoped ID generation alone is not hydration proof.
- Server fixtures are checked-in JSON over a demo HTTP interceptor. A real consumer must resolve keys and persist
  through its own service; availability of an off-page key is authoritative only after its row has loaded.
- Independent language acceptance for all eleven locales was approved on 2026-11-08. The manual assistive-technology
  assessment was waived on 2026-11-10 and is not a pass; automated checks remain required.
- Exact test, browser, package, CI and release results belong to the corresponding PR and workflow runs. Local
  acceptance does not establish CI at the pull-request commit, merge, deployment or npm publication.
