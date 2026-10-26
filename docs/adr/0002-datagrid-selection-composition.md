# Share datagrid selection semantics across built-in and native-grid rendering

Accepted October 25, 2026; revised October 26, 2026 with maintainer approval. The original complete-grid-only decision
is superseded by **B by default, A as an explicit advanced entry point**.

The generic selection field owns one form/selection mechanism and common field presentation. B creates an internal
Clarity datagrid from bounded column declarations and Angular cell/custom-filter templates; A accepts a complete native
Clarity grid when that default surface is insufficient. Each instance chooses one renderer explicitly, with no automatic
fallback or mixed configuration. Neither path promises compatibility with every advanced Clarity feature.

Business pickers are optional reuse boundaries and can wrap either entry point. A parent, domain service or business
picker may retrieve candidate items; the generic field does not fetch domain data. Forms store stable scoped keys;
applications own validators, edit baselines and entity DTO conversion. Existing outer formControlName bindings remain
supported through thin adapters without a mirrored form owner.

The tradeoff adds a bounded column/template adapter and renderer-specific integration checks in exchange for simpler
routine usage without giving up native customization. It does not duplicate CVAs or selection engines, introduce a
universal grid DSL, or require B to expose every one-off feature. Exact declarations and public generic templates still
need API/package proof; see the [design contract](../design/clr-lift/datagrid-selection-design-spec.md).
