# Compose datagrid selection around application-owned resource grids

Accepted October 25, 2026. Resource-specific components retain their complete Clarity grid templates and existing outer
formControlName bindings, while clr-lift supplies reusable selection/form behavior and field presentation. Forms store
stable resource keys; applications resolve keys and construct entity DTOs at submission. This retains custom cells,
filters, actions and optional footers without creating a second grid configuration language, at the cost of
resource-specific templates and explicit form adapters. Exact bridge symbols and implementation still require API review
and proof; see the [design contract](../design/clr-lift/datagrid-selection-design-spec.md).
