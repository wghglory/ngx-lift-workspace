# Preserve both key/value form ownership models

Accepted October 24, 2026. Keep the caller-owned FormArray editor alongside the additive array-value CVA: applications
that depend on individual controls retain their identity, validators and lifecycle, while simpler bindings own one
composite value. Shared presentation must preserve these separate ownership boundaries; it must not rebuild caller
controls on each edit. The shared FormArray renderer remains a separate design increment; see the
[canonical contract and proposal](../design/clr-lift/key-value-inputs-design-spec.md#proposed-formarray-and-specialized-row-support).
