# Compose datagrid selection around one caller-written Clarity grid

Accepted October 25, 2026; revised October 29, 2026 with maintainer approval. Support one caller-written native Clarity
grid. Native column/filter/cell markup keeps custom behavior explicit and avoids a parallel descriptor/override surface.
The API has no renderer choice or generated-grid fallback.

The generic selection field owns the CVA, key reconciliation, availability, shared selection scope, composite focus and
field presentation. The caller binds query data directly to clrDgItems and projects one required plain Clarity label and
one native grid. There is no label input. Optional cll-alert content appears above the grid; request errors remain
separate from field validation. No named grid/label template, renderer selector, generated-grid fallback, column DSL or
cell/filter-template directive is introduced. Native filters/sorters must resolve localized display semantics
explicitly. Native grid/row members provide row data, selection events and selectability; there is no consumer row
marker directive. The shell owns label IDs and ARIA association; optional signposts project beside the label.

Business pickers are optional reuse boundaries. The organization picker owns its organization query, loading and
failure/retry UI; its parent owns the form and submission. Shared domain services/query definitions perform HTTP/cache
work. Without a picker, the page owns the query. The generic field never fetches domain data. Forms store stable scoped
primitive keys. Applications own validators, edit baselines and entity DTO conversion. Direct formControlName works
through the selection component's own CVA; a reusable business-picker host can compose the library-owned
accessor/binding pair without a mirrored form owner or handwritten business CVA methods. The helper exports have local
runtime and installed-package evidence in the [acceptance record](../design/clr-lift/datagrid-selection-acceptance.md).
The field reads loaded data/scope from the projected native grid and reads mode and saved keys from the native selection
type and identity function. trackBy remains view reuse, not selection identity. No duplicate mode/key/loading-lock
inputs or #selection reference are required. A server page is not a complete inventory; unresolved selected keys remain
preserved. Public data/configuration and selected-write seams have narrow local browser evidence. Native loading is an
overlay rather than a complete keyboard lock, so the library must guard selection while loading without disabling the
Angular control. Error text can represent arbitrary parent validators, not only required. The narrow observations remain
historical; the acceptance record describes the subsequent production implementation and its validation boundaries.

This preserves native template freedom without promising every advanced Clarity feature is selection-compatible. Verify
projected grid/label provider context, focus and native registration before claiming support. See the
[design contract](../design/clr-lift/datagrid-selection-design-spec.md) and
[complete consumer code](../design/clr-lift/datagrid-selection-code-examples.md).
