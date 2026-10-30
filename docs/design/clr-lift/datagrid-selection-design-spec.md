# Datagrid selection form control

Status: **native grid composition approved; production exports implemented locally October 30, 2026**. The
[delivery plan](datagrid-selection-delivery-plan.md) maps the current stories and execution order. Package: clr-lift.
The exports below are available in the checkout; npm publication is separate. The
[composition ADR](../../adr/0002-datagrid-selection-composition.md) supersedes the earlier rendering proposal.

[Parent #198](https://github.com/wghglory/ngx-lift-workspace/issues/198) →
[#200 local field](https://github.com/wghglory/ngx-lift-workspace/issues/200) → independent
[#201 server pages](https://github.com/wghglory/ngx-lift-workspace/issues/201) and
[#202 policy create/edit](https://github.com/wghglory/ngx-lift-workspace/issues/202).

## Caller-written Clarity grid

The application writes the native Clarity grid, columns, cells, sorting, filters and optional pagination. The selection
component owns the CVA, key reconciliation, availability, shared selection scope, validation presentation and composite
focus. It does not fetch data or introduce another grid engine.

There is no parallel column schema, column text/type configuration or cell/filter/label template directive API. There is
no columns input, gridTemplate, renderMode or generated-grid fallback. Each field requires one directly projected
Clarity label and one grid. Native row selection labels and custom filter/sort behavior belong to that native markup.
Read the native selection mode and identity; names/translations must not become identity.

## Query data and identity

Examples load organizations through queryResource and a real HttpClient-backed service. Pass the query value directly to
native clrDgItems. The selection shell no longer has an items input or gridItems() source adapter: it observes the
projected ClrDatagrid's supplied all-data snapshot and displayed/page scope. Do not derive the full inventory from
rendered rows. For server paging, supplied data is only the loaded page; keep unresolved/off-page keys and never treat
absence as authoritative deletion.

Read mode from clrDgSelectionType and keys from clrDgItemsIdentityFn/items.identifyBy. The grid declares single or multi
exactly once and its identity callback must return a stable scoped string/finite-number key. trackBy only controls
row-view reuse; it can legally return an index/object and is not a persisted-key definition. Do not inspect its private
view differ or infer identity from DOM/row position. Reject default object identity, duplicate/invalid keys and none
mode when actually initialized; retain unresolved values while items arrive.

Remove shell selectionMode, itemKey, interactionDisabled and the #selection template reference. The library owns native
selected-row writes, preservation, custom-select-all/event wiring, header locking and change detection internally. It
reads native grid.rows/row.item and row selectability; no consumer row marker or extra directive import is needed.
Mode/identity must stay stable for the mounted field; do not infer mode from an empty initial form value. Angular CVA
and native identity are runtime value-shape boundaries, not exact generic inference from the parent control.

Keep forms mounted during query changes. Native loading and translated failure/retry UI belong to the page or business
picker. The field reads grid.loading and blocks all selection edits while loading without disabling the Angular control
or changing its payload/validation. A real native checkbox remains keyboard-editable under the loading overlay, so the
library must add its own guard. Persistent disabled state comes from control.disable(); optional readonly still permits
browsing. The generic field does not fetch or accept a query-library input.

## Complete examples

| Need                                                             | Code                                                                                                        |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Direct use, plain label and form.reset                           | [Simple multiple](datagrid-selection-code-examples.md#without-a-picker-simple-multiple-selection)           |
| Direct use, scalar/null value                                    | [Simple single](datagrid-selection-code-examples.md#without-a-picker-single-selection)                      |
| Direct use, custom label/filter/sort/pagination and toSignalForm | [Complete direct form](datagrid-selection-code-examples.md#without-a-picker-advanced-form-and-tosignalform) |
| Business picker without handwritten CVA, plus parent form        | [Picker and parent](datagrid-selection-code-examples.md#with-a-picker-component)                            |
| Template-driven single field                                     | [ngModel](datagrid-selection-code-examples.md#template-driven-single-selection)                             |

All imports, classes, HTML, shared filters and localized messages are included. Use id/name/status data and
organizationId/organizationIds throughout. The [reference](datagrid-selection-reference.md) retains detailed async,
reset, availability, accessibility and historical proof evidence.

## Direct label and request alert

Remove the label input. Every field directly contains a plain Clarity label and one clr-datagrid. Optional cll-alert
content appears above the grid:

```html
<cll-datagrid-selection [formControl]="organizationIds">
  <label class="clr-control-label">{{ 'organizationExample.organizations' | translate }}</label>
  @if (organizationsQuery.error()) {
  <cll-alert>
    {{ 'organizationExample.loadError' | translate }}
    <button type="button" class="btn btn-link" (click)="organizationsQuery.reload()">
      {{ 'organizationExample.retry' | translate }}
    </button>
  </cll-alert>
  }
  <clr-datagrid>...</clr-datagrid>
</cll-datagrid-selection>
```

This slot sketch omits native configuration; use the complete examples for runnable consumer source. Projection keeps
label, alerts, grid and field feedback in the appropriate layout positions. No generated label, label directive or
ng-template is needed. Diagnose a missing/duplicate direct label or grid; ignore filter-internal labels. Clarity uses
plain label, not a clr-label component.

The shell associates the visible label with the actual role=grid element and handles label-to-grid focus. A label for
attribute alone is insufficient. Project a signpost directly beside the label when help is needed; the shell puts both
in the label area and names the grid from the label alone. It manages unique IDs and the real grid association. Business
components need no nextId counter or manual aria-labelledby for this pattern. Custom label text/markup remains
supported.

Treat the label text and optional signpost as one inline label group, with a small gap after the text. The label must
not stretch to push the signpost to the far edge of the label column. Validation feedback follows the grid/footer and
uses Clarity's standard clr-control-error, including its error icon and caption typography. Scope the error class to
that feedback only; do not add a vertical error border or color nested native grid/pager/filter controls as invalid.

Use Clarity's built-in signpost trigger and its default information icon; set clrSignpostTriggerAriaLabel for the
localized accessible name instead of projecting a custom question-mark button. This follows
[Clarity's default trigger implementation](https://github.com/vmware-clarity/ng-clarity/blob/main/projects/angular/popover/signpost/signpost.ts).

The single-selection Clear action is rendered by the selection component, above the grid. Consumer examples therefore do
not repeat it in their HTML. Clear uses the standard secondary button style, matching the surrounding form's Reset
action. Clear writes null to this field; the parent-owned Reset action restores form defaults and form state.

Use the existing AlertComponent with localized initial/refresh failure and Retry inside the selection. Keep the grid
mounted on request failure. Request alerts do not create validation errors or replace the separate error message.

required accepts bare required or [required]="condition". With Angular form bindings, this intentionally uses Angular's
RequiredValidator as well as the required marker. Programmatic Validators.required remains supported. The parent owns
other business validators. Grid loading blocks interaction without changing the parent's enabled/serialization state;
Angular disabled remains separate.

## Errors are not limited to required

Keep error as one caller-supplied localized string. Validators.required, count rules and any future custom/async
validators attach to the same parent FormControl. The examples use sf.fields.organizationIds.errors() to select
required, maximum-three or fallback messages and pass the result to error, including through the reusable picker. The
shell presents it for invalid and touched/submitted state. No validator registry, error-map input or custom template is
needed. See the [complete validation recipe](datagrid-selection-code-examples.md#validation-and-error-text).

## Direct form and reusable picker

The selection component itself is the CVA. Direct formControlName/formControl/ngModel usage needs no extra picker
accessor or binding directive. Optional business components centralize their native markup and business behavior. The
organization picker also owns its queryResource, loading, request failure and Retry; the parent owns form values,
validators and submission. Keep the shared service/query definition outside both components and avoid another inventory
query in the parent. For those, retain DatagridSelectionAccessorDirective on the picker host through hostDirectives and
one cllDatagridSelectionBinding on its inner field. They avoid handwritten business CVA methods; the name identifies the
explicit inner-field-to-picker binding. This is independent of grid rendering and creates no second FormControl.

The library adapter must preserve real-owner validation/disabled/submitted state, change/blur/submit buffering and
lifecycle cleanup. Do not silently bind unrelated nested fields. Reject duplicate accessors and multiple/missing inner
bindings. The helper is covered by real-owner and installed Angular 21 consumers; see the
[acceptance record](datagrid-selection-acceptance.md).

## Updating, resetting and observing the form

Use form.setValue/patchValue/reset directly for model updates. reset restores pristine/untouched; it does not clear
FormGroupDirective.submitted. The complete Reactive Forms examples use a native type="reset" button: Angular resets
their nonNullable controls to their constructor defaults and clears submitted without a reset handler or directive
parameter. For a programmatic full restart with a separately loaded edit baseline, resetForm(value) on the owning form
directive remains useful. See the [reset comparison](datagrid-selection-code-examples.md#reset-and-direct-form-updates).

toSignalForm(this.form) observes the same owning FormGroup and adds signals; it does not create native Signal Forms or a
new value binding. The direct form example uses fields/value, invalid/pending and submitValue signals, explicitly omits
disabled controls and emits a copied payload through an ordinary save output. Its preview reads sf.submitValue()
directly; it does not mirror that current value in a submittedValue signal or claim to retain submission history.
Angular still owns updateOn buffering.

## Localized display, sorting and filters

Native filters must match the text users see. Service-localized text works with ordinary native field processing. Raw
translation keys/enums shown through a pipe need native custom string/filter models and, when needed, a comparator using
the same resolved text. Existing Clarity custom filters remain usable. Do not inspect cell HTML to infer translation.

Header text, row names, filter controls/options and helper/error text must be localized. Locale/dictionary changes must
refresh filtering/sorting without discarding the query, selected keys or pending edits. This belongs to native
application filter/translation integration, not a removed column DSL. See the
[native filter contract](datagrid-selection-reference.md#localized-column-and-filter-contract).

## Behavior that remains fixed

| Concern             | Contract                                                                                                                                                                                                                                                 |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Value               | Single: scoped string/finite-number key or null. Multiple: ordered keys. Accept readonly/mutable arrays; emit fresh mutable arrays. Never mutate caller data.                                                                                            |
| Identity            | Native clrDgItemsIdentityFn supplies stable scoped identity. Duplicate candidate keys are developer errors. Optional native trackBy controls row reuse independently.                                                                                    |
| Prefill and refresh | Saved keys may arrive before items. Reconcile new instances and off-page/unresolved keys without change/touch callbacks or dirty state. Never auto-select a first/sole item.                                                                             |
| Selection scope     | Select/clear only the filtered current logical page, or every filtered eligible supplied item when unpaged, including offscreen items. Preserve out-of-scope keys and existing order; append new choices. Later arrivals are not automatically selected. |
| Availability        | itemAvailability returns disabled plus a readable disabledReason. Block additions; selected unavailable items keep their keys and remain removable. Whole-field disabled/readonly blocks every selection edit. Readonly permits browsing.                |
| Clear and reset     | Single Clear emits null even if required. Parent reset restores its accepted baseline, cancels buffered edits and resets form/submission state; it does not refetch or restore old permissions.                                                          |
| Validation          | Parent owns required/count/async/cross-field rules. Show error when invalid and touched or submitted. Otherwise show helper. Loading is not form pending.                                                                                                |
| Presentation        | Inherit horizontal/vertical form layout, permit a field override, stack at narrow widths. Clear precedes the grid; feedback follows the entire grid/footer. Keep row/pager/filter inputs free of field-error coloring.                                   |
| Size                | Small inventories fit naturally. Preserve the unfiltered footprint during filtering. No public max-items or synthetic range-filter input.                                                                                                                |
| Pagination          | Caller-owned native footer/pagination performs real slicing. Omit pagination for an unpaged grid; preserve values and pending edits when it changes.                                                                                                     |
| Async and DTOs      | Application owns queryResource/resourceAsync/mutateResource, stale responses, cancellation, retries and immutable submit snapshots. Key-to-entity conversion and resolving all required entities belong to submission code.                              |

The native datagrid scroll box owns the height bound; its footer stays outside that box. Measure the rendered datagrid
element rather than Clarity's display:contents content wrapper. Retain the measured footprint through filtered refreshes
of the same inventory and use rem units so text scaling remains supported.

Full transitions, failure/recovery and async examples remain in the [reference](datagrid-selection-reference.md).

## Public surface

| Developers use                     | Purpose                                                                                                                     |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| DatagridSelectionComponent         | One CVA and shared field/selection behavior around a directly projected native grid.                                        |
| DatagridSelectionAccessorDirective | Optional library-owned accessor on a reusable business-picker host.                                                         |
| DatagridSelectionBindingDirective  | Optional explicit inner field connection to that picker accessor.                                                           |
| Common inputs                      | Optional required, helper, error, readonly and layout; no label input.                                                      |
| itemAvailability                   | Caller policy returning disabled and a localized disabledReason; selected unavailable items remain removable.               |
| Internal native bridge             | Library-owned selected writes, preservation, select-all/events and loading/disabled guards; no consumer template reference. |
| Native content                     | One required direct label and clr-datagrid, plus optional cll-alert above the grid. Native content is caller-owned.         |

The wrapper adapter uses a private connection protocol, not another public value/event owner. Primitive-key
single/multiple value shapes require runtime incoming-value and native identity diagnostics. Angular's CVA bindings are
untyped boundaries; a typed FormControl alone cannot prove the template rejects the wrong mode/value.

## Verification and delivery

The [acceptance record](datagrid-selection-acceptance.md) lists the implementation, runnable route, regression and
installed-consumer evidence, scope limits, and independent human gates. The component, accessor and binding are exported
from clr-lift. The local examples exercise real queryResource HTTP data and the original Reactive Forms/ngModel owners;
toSignalForm observes the same parent form.

Loading/readonly guards do not write native row permissions. Custom header pointer/Space actions use the same eligible
filtered logical scope; single headers never select an item. Single radios and optional native row-click selection reach
the same CVA. Availability explanations are visible and associated with the affected checkbox. Required is described on
the actual grid because role=grid does not support aria-required. The parent explicitly excludes disabled fields from
its submission DTO, including Angular's wholly disabled FormGroup case.

The ten displayed demo sources are generated from runnable files and checked for drift by the tooling target. Direct
status text filters resolve the displayed translations and refresh native matching/order on language or dictionary
changes. The picker retains a separate ordinary enum filter component. Neither path changes native inventory identity.

#201 retains server-page behavior; #202 retains full policy create/edit workflows. Independent native-language and
assistive-technology acceptance, CI, merge, deployment and npm publication are separate gates. No SSR/hydration or
virtual-scroll acceptance is claimed by the local-grid increment.
