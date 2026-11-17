# One value-control module for datagrid selection

Accepted November 17, 2026. This decision reopens [ADR-0002](0002-datagrid-selection-composition.md) and supersedes only
its reusable-picker accessor/binding composition: the second half of the ownership paragraph (the picker host composing
the library-owned accessor/binding pair) and Q11 (the October 29 accessor plus inner-binding proposal). It is an
approved breaking public API change; the `DatagridSelectionAccessorDirective` and `DatagridSelectionBindingDirective`
exports are removed and the helper module is deleted.

All other ADR-0002 decisions remain in force: one caller-written native Clarity grid with no renderer choice or
generated-grid fallback; one `DatagridSelectionComponent` that owns the `ControlValueAccessor`, key reconciliation,
availability, shared selection scope, composite focus, field presentation and ID allocation; caller-bound `clrDgItems`,
one directly projected plain label and optional `cll-alert`; scoped primitive keys with unresolved keys preserved;
caller-owned validators, edit baselines and entity DTO conversion; no duplicate mode/key/loading inputs or `#selection`
reference; native loading guarded without disabling the Angular control.

## Decision

Value control lives in a single module. `DatagridSelectionComponent` is the only form boundary: it injects `APP_ID` and
allocates its own `${appId}-datagrid-selection-${n}` IDs, and it resolves its form owner solely from its own injector
`NgControl` in `ngDoCheck` through a private `resolveOwner()` method. The internal `ɵowner` / `ɵconnect` cross-module
ownership protocol is removed, so no other library object can re-point the field at a different control.

The reusable business picker no longer mirrors a form owner. It is a plain presentational/query component: it owns its
query, loading, failure and retry UI only. It exposes the selected keys through a `model` signal (two-way `keys`
binding) and emits key changes through that output; it owns no `ControlValueAccessor` and creates no mirrored or second
`FormControl`. The consuming page owns the form: it binds `formControlName` (or `formControl` / `ngModel`) to a
`cll-datagrid-selection` host directly, or binds the inner field directly, and it owns validation, the accepted baseline
and submission. Key-to-entity conversion and DTO selection remain application concerns at submission, exactly as before.

Removing the pair eliminates the three-module ownership rewrite and the shallow ID allocator without changing the
field's value, reconciliation, availability, focus or accessibility contract. Direct form bindings, typed controls,
`ngModel`, `toSignalForm` and Angular-owned `updateOn` buffering remain supported through the single CVA. Because the
accessor and binding directives were public exports, removing them is a breaking change for any consumer that composed
them onto a picker host; those consumers must move the form binding onto `cll-datagrid-selection` and emit keys from the
picker as described above.

## Consequences

Library, demo, packaged-consumer and browser fixtures must all use the single-module contract; no dangling import or
export of the removed directives or the ID service remains. The in-page API reference and design/acceptance documents
describe only `DatagridSelectionComponent` as the value-control surface. The validation and installed-package evidence
for direct form bindings remains valid; no SSR/hydration or virtual-scroll acceptance is claimed.
