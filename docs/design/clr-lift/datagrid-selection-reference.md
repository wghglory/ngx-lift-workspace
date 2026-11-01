# Datagrid selection: detailed contracts and evidence

Current decision: **one caller-written Clarity grid, approved October 29, 2026**. Start with the
[short design](datagrid-selection-design-spec.md) and [complete consumer code](datagrid-selection-code-examples.md).
This reference retains detailed use cases, async/edit/availability contracts and historical proof evidence; the
historical two-renderer and column-candidate results do not certify the current native-grid proposal. The selection
control and reusable-picker adapter are now exported locally; see the
[current acceptance record](datagrid-selection-acceptance.md). Historical proof sections below remain historical.

## Approved rendering revision, October 29, 2026

The application directly projects one complete Clarity datagrid. The selection shell provides the CVA, stable-key
reconciliation, availability, shared selection scope, composite focus and field presentation. There is no generated
grid, column schema, template override API, renderer selector or automatic fallback. A plain directly projected Clarity
label is required; there is no label input. Optional cll-alert content appears above the grid and remains separate from
validation feedback. Native filters, sorters, row names, footer and pagination belong to the application. Native
label/provider context and row/grid registration still need runtime validation.

Resource-specific pickers remain optional. The organization picker owns its business markup and queryResource, including
loading, failure and Retry UI. Its parent owns values, validators and submission. Without a picker the page owns the
inventory query. Shared services/query factories retain HTTP/cache responsibilities; the generic field does not fetch. A
picker host can compose the proposed library-owned accessor/binding pair to retain formControlName without handwritten
CVA callbacks or a mirrored control. Data retrieval never determines form ownership.

#200 now delivers only this native local entry point and common form behavior. #201 retains the native server-page path;
#202 retains direct and reusable-picker query/edit/reset demonstrations. No second renderer is required.

## Loaded data and saved keys

Data goes to the native clrDgItems iterator from queryResource. The shell observes grid.items.all and items.allChanges
for supplied rows, and items.displayed/change for native filtered/paged scope. These are readable through the installed
exported ClrDatagrid type; do not import the unexported Items provider or read private rawItems. Initial read and events
must be synchronized after native processing, and old subscriptions must be detached. Current Chromium proof covers
delayed data, full/page distinctions, paging/filtering/clearing, fresh objects and empty results. This is a narrow
data-seam result, not full field/CVA/provider acceptance.

A supplied server page is not a complete inventory. Neither a hidden row nor an absent/unloaded key establishes
invalidity. Keep stable key values independently of current rows. Read saved keys from native clrDgItemsIdentityFn /
items.identifyBy and mode from clrDgSelectionType; do not use trackBy, guessed id fields, object identity or row
indices. Require native single/multi mode and a stable primitive identity, with runtime diagnostics. Mode/identity stay
fixed for the field instance. Angular CVA and broad native identity types do not provide exact key/mode typing through
projection.

No public selectionMode, itemKey, interactionDisabled or #selection reference is required. The adapter internally owns
native selected writes, preservation/select-all, event wiring and rendering work. A narrow native proof verifies mode
and identity reads independent of index-based trackBy, plus selected writes with correct page/header rendering when
change detection is scheduled. Earlier setter-only writes that left the header stale are not acceptable.

Read native loading and guard all selection paths while it is true, without disabling the Angular control or changing
its payload/validity. The real native loading overlay still leaves a focused checkbox keyboard-editable. This observed
native behavior requires library guards; neither the proof nor the declaration candidate implements the full guard.
Persistent disable uses the actual parent control, and optional readonly still supports browsing. Error presentation is
not limited to required: normal parent validators and caller-selected localized messages are supported by the same
field.

The current codebook uses the actual queryResource/toSignalForm implementations, a complete HttpClient service and
query/provider setup, and translated failure/retry UI. The business picker owns its inventory query; its parent does not
query or pass items/loading. There is no items input on the generic shell or duplicate query/cache owner.

Native row access/selection uses public grid.rows, row.item, row.clrDgSelectable and grid selection events. No row
marker directive is required in consumer markup; rendered rows never substitute for the full supplied inventory.

A separate narrow Chromium experiment verifies required native label/grid projection, label-only grid naming with an
adjacent signpost, label-text changes and native signpost opening. A conditional real cll-alert appears above the grid
and Retry removes it without remounting the grid. This uses a private projection adapter, not the production
selection/CVA. Full form/layout provider context, label-click focus, supported render modes and assistive-technology
acceptance remain pending.

## Applicable contracts

- Value/form integration: the [shared forms contract](forms-compatibility-design-spec.md) governs Angular 21 CVA,
  ngModel, typed Reactive Forms, and the separate `toSignalForm` facade host. Native Signal Forms follows the platform
  upgrade, with the same submitted value contract.
- Rendered UI: selection, composite focus, field labeling, helper/error content, horizontal/vertical layout, and the
  [accessibility and language contract](../../guides/accessibility-and-localization.md).
- Async integration: loading, page replacement, edit preselection, stale results, and unavailable selections. The
  accepted boundary leaves fetching and cancellation with the application.
- Shared cache: no new cache or backend client is proposed. Applications may use existing query utilities. Explicit
  integration hosts must cover `resourceAsync`, `queryResource` and `mutateResource` without making these utilities
  required inputs of the selection component.

## Background

Production application forms repeatedly wrap a selectable Clarity datagrid in a custom value accessor and a form
container. They repeat identifier-to-row conversion, selection callbacks, labels, errors, and CSS compensating for a
text-input wrapper. Some expose identifiers; others expose row objects. They include both single and multiple selection,
mostly without a footer, and edit forms receive saved values before inventory loading completes.

A read-only consumer audit found nine modern datagrid CVAs and one legacy namespace CVA. Related legacy forms manually
bridge selection to controls. The application-specific source paths remain in the review conversation; this reusable
spec uses generic examples and does not introduce application or company identifiers.

Corrections established by that audit:

- The inspected tenant-assignment picker fetches every organization page before using `*clrDgItems`. It demonstrates
  client-side grid operations, not a server-driven grid.
- Namespace, cluster, and directory pickers use a recursive Kubernetes list helper. Some storage-target and deployment
  policy services instead read one response; the latter request a fixed limit and do not aggregate continuation pages at
  that service layer. This is a possible inventory-completeness gap, not evidence of observed production truncation.
- Data acquisition, client/server grid operations, row eligibility, and form validation are four separate concerns.
  Fetching all items does not validate a selection or guarantee that an existing assignment remains authorized.
- Disabled-state bridging is missing or a no-op in the inspected modern CVAs. Several identifier-array accessors also
  assume a non-null array. Existing behavior is migration evidence, not the desired generic contract.
- The inspected external hosts use Reactive Forms. CVA implementation alone does not establish tested ngModel support.

Installed Clarity 18.4.0 already provides single/multiple selection, row identity, local/server operation, eligibility,
loading, and optional projected footer/pagination. The datagrid itself is not a CVA. The proposed reusable value is the
form/selection boundary and field presentation, rather than a replacement grid engine.

## Terminology

The [root glossary](../../../GLOSSARY.md#datagrid-selection) records the accepted selection-value and selection-key
vocabulary following the accepted review. The [composition decision](../../adr/0002-datagrid-selection-composition.md)
records the architectural tradeoff. Exact symbols remain draft.

- **Item**: a selectable business resource. A row is its Clarity grid presentation, not its identity. Use `items`,
  item-oriented selection terms; keep actual Clarity API names unchanged.
- **Selection value**: the value held by the owning form; the application's backend payload may be derived from it.
- **Item key**: the stable identity connecting that value to a rendered row, independent of object instance or page.
- **Loaded items**: items currently supplied to the grid; they may represent a complete local collection or one server
  page.
- **Inventory completeness**: whether the application knows it has the whole relevant collection. It cannot be inferred
  from an empty page, a loaded flag, or the use of `*clrDgItems`.
- **Reconciliation**: matching an existing selection to newly loaded row instances without making a user edit.
- **Unavailable selection**: a selected identity authoritatively known to be unavailable. An off-page or not-yet-loaded
  identity is unresolved, rather than automatically unavailable.
- **Selection eligibility**: whether a user may select or deselect a particular row. It is distinct from required and
  other form validation rules.

## Goals

- G1: Deliver single and multiple grid selection as real form values with predictable edit prefill and reset behavior.
- G2: Offer one caller-written native grid with a shared form/selection mechanism; omit a parallel column schema.
- G3: Display a meaningful label, helper, and errors with horizontal and vertical field layouts, without consumer CSS
  patches for text-input dimensions.
- G4: Keep selection stable through loading, filtering, paging, refreshed objects, and future form-bridge changes.

## Non-goals

### Not now

- Implementing the component before the design interview and API approval are complete.
- Upgrading Angular/Nx or adding native Signal Forms imports to the Angular 21 package.
- Migrating every application-specific picker, replacing Clarity, supporting every advanced grid feature, or introducing
  runtime dependencies.
- Treating special values such as a version wildcard or an assignment scope as ordinary selected items.

### Outside this API

Backend authorization, Kubernetes pagination, API query construction, business warnings, resource-specific badges,
version comparison, and application payload conversion remain application concerns. A future request for all matching
server records requires a separately reviewed selection algebra; an ordinary array cannot imply an unbounded query.

## Use cases and acceptance

The inventory below describes observed categories; proposed outcomes are acceptance requirements under review.

| ID   | Actor and task                                  | Initial state                                                             | Action                                            | Proposed observable outcome                                                               | Failure/recovery                                        | Demo/test                           |
| ---- | ----------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------- | ----------------------------------- |
| UC1  | Assign several tenants                          | Saved stable IDs; items arrive later; no footer                           | Open edit, then select another row                | Existing items preselected; only the user edit changes form value/dirty state             | Loading/error preserves saved IDs                       | Planned multi/edit host             |
| UC2  | Assign namespaces                               | Saved names; complete local inventory; label chips in cells               | Filter and change selection                       | Selection survives filtering; custom cells remain native Clarity content                  | Empty inventory differs from failed request             | Planned local/filter host           |
| UC3  | Choose storage targets or deployment policies   | Optional storage and required policy fields; parent-owned validators      | Select, clear, submit                             | Owner receives selected identities; required feedback follows owner state                 | Business warning does not become a grid-owned validator | Planned validation host             |
| UC4  | Choose one deployment policy                    | Saved row reference, potentially replaced on refresh                      | Load, replace items, select another               | Exactly one selection; refreshed instance alone is not a user change                      | No match follows explicit unavailable policy            | Planned single/edit host            |
| UC5  | Choose a directory configuration                | Optional single selection; rich status cells                              | Select and explicitly clear                       | Clear submits the agreed empty single value                                               | Clear obeys disabled/readonly                           | Planned single/clear host           |
| UC6  | Choose a placement target                       | Single selection, eligibility constraints, footer/page size               | Page and select a permitted row                   | Eligibility and footer remain usable; stable identity includes namespace/scope            | Ineligible items cannot be chosen                       | Planned footer/eligibility host     |
| UC7  | Choose multiple placement targets               | Current objects include name and namespace                                | Refresh with equal names in different scopes      | Scoped identities remain distinct; payload conversion stays explicit                      | Duplicate keys produce a developer diagnostic           | Planned identity/type host          |
| UC8  | Embed the picker in a compound version selector | Separate All/Major/Minor scope control                                    | Switch between scope and explicit items           | Parent owns wildcard and scope; picker owns only explicit items                           | Parent explicitly decides when to clear/default         | Planned composition host            |
| UC9  | Maintain permissions with many items            | Preselected names and a paginated grid                                    | Inspect selected items and return                 | Value preserved; selected-only view is a deliberate presentation choice                   | Readonly remains distinct from disabled                 | Planned inspection host             |
| UC10 | Select across server pages                      | Saved key absent from current page                                        | Change page/filter, resolve saved key later       | Off-page selection survives; hydration emits no form edit                                 | Failure/stale response cannot clear or overwrite value  | Planned remote fixture host         |
| UC11 | Use either field layout                         | Long label, helper/errors, translated filters                             | Switch layout and narrow viewport                 | Label above or beside grid; grid and filter popovers remain usable                        | Reflow, zoom and RTL preserve actions                   | Planned layout/browser host         |
| UC12 | Reset, disable, and inspect                     | Selected items, focus inside cell/filter/footer                           | Reset or change availability                      | Shared form contract holds; all selection paths respect state                             | No late selection/touch callbacks                       | Planned three-form-host matrix      |
| UC13 | Select all in a footer-free scrolling grid      | 100 unpaged items; only 10 fit the scroll viewport                        | Click select-all, then scroll                     | All 100 eligible items selected, including initially out-of-view ones                     | Ineligible-item policy respected                        | Planned unpaged-scroll browser host |
| UC14 | Scope select-all to filtered results            | 100 unpaged items, 8 match a filter, other selections already exist       | Select/clear filtered results                     | Only those 8 eligible/removable items affected; unrelated keys retained                   | Later loads do not auto-select new keys                 | Planned filter/select-all host      |
| UC15 | Load inventory with resourceAsync               | Saved selection exists before a component-local read resolves             | Load, reload, fail and retry                      | Items reconcile by key; reads never change the form value, dirty or touched               | Failed or cancelled reads preserve selected keys        | Planned local-resource host         |
| UC16 | Load shared inventory with queryResource        | Scoped query may have cached data and multiple observers                  | Refresh or invalidate its scoped tags             | Fresh objects reconcile without selecting new arrivals or clearing saved keys             | Refresh error differs from authoritative removal        | Planned shared-query host           |
| UC17 | Save or change resources with mutateResource    | Valid form selection and an explicit submitted DTO snapshot               | Save policy or update inventory availability      | Mutation state stays outside field validity; refresh preserves selection intent           | Write failure keeps edits; refetch failure is separate  | Planned query/mutation host         |
| UC18 | Open an edit form with independent queries      | Policy detail and organization/namespace inventory return in either order | Initialize the edit session, then reconcile items | Values and cross-page preselection agree regardless of response order                     | Detail retry does not expose an editable blank form     | Proposed edit-query host            |
| UC19 | Distinguish inventory failure from empty data   | No initial inventory or cached inventory during refresh                   | Fail, display retry and recover                   | Initial error differs from empty success; refresh failure keeps cached rows and selection | Read failure never silently removes saved keys          | Proposed query-error host           |
| UC20 | Restart edits from the original configuration   | Many saved organizations span pages; user has changed multiple fields     | Reset changes to the edit-session baseline        | All baseline keys and text restored; pending edits discarded; owner pristine/untouched    | Current permissions and availability still apply        | Proposed baseline-reset host        |

## Industry evidence and current gaps

Checked October 25, 2026. Installed source governs the current Clarity integration; latest upstream documentation is
comparison evidence, not proof of compatibility with this package's pinned platform.

| Primary source                                                                                                                   | Observed capability                                                                                                                    | Adopt/adapt/reject recommendation                                                                 | Gap addressed                                                        |
| -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Installed `@clr/angular` 18.4.0 declarations and datagrid implementation                                                         | `clrDgSelectionType`, array `clrDgSelected`, identity function, preserve-selection, selectable items, refresh events, projected footer | Adopt the existing grid and public APIs; adapt selection into a form value                        | Grid lacks a CVA and composite field contract                        |
| [Angular Material table source documentation](https://github.com/angular/components/blob/main/src/material/table/table.md)       | SelectionModel composition; separate table, data source, and paginator                                                                 | Adopt separation of selection/data/pagination; keep Clarity rendering                             | Keep optional Angular templates; avoid a universal configuration DSL |
| [NG-ZORRO table source documentation](https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/components/table/doc/index.en-US.md) | Explicit front/server pagination, query events, checkbox disabled/checked state, optional pagination                                   | Adopt explicit data-mode and availability boundaries; retain existing Clarity equivalents         | UI mode must not imply complete inventory or valid form data         |
| [React Aria Table](https://react-aria.adobe.com/Table)                                                                           | Controlled selected keys, single/multiple modes, disabled items and separate row actions                                               | Adapt key identity and independent selection/action semantics; defer the `all` selection sentinel | Stable form values must survive changing row instances/pages         |
| [Angular custom Signal Forms controls](https://angular.dev/guide/forms/signals/custom-controls)                                  | FormValueControl/model value and form-state integration                                                                                | Prepare an independent selection core; recheck interfaces at the platform upgrade                 | CVA alone does not establish native Signal Forms acceptance          |

Clarity-specific findings that constrain implementation:

- The installed version uses array `clrDgSelected` for both single and multi selection. Older examples using
  `clrDgSingleSelected` do not match the installed declarations.
- `clrDgPreserveSelection` prevents filter-triggered clearing. It does not define the entire unavailable-row policy.
  Client-grid replacement may prune items absent from the supplied collection; server-managed items behave differently.
- Identity-based object reconciliation can emit grid selection events. Forwarding every event directly to the form would
  incorrectly count hydration as a user edit.
- `*clrDgItems="let item of items; trackBy: trackItem"` uses Clarity's native `clrDgItemsTrackBy` input for row-view
  reuse. This is optional and separate from `[clrDgItemsIdentityFn]`, which identifies items for grid state and
  selection. A row trackBy is not required for key-based selection correctness. Resource examples should use stable
  scoped keys for both, but Clarity permits independent row-view tracking strategies, including index tracking. A row
  index must never become the form selection key or the grid's resource identity.
- Default select-all covers displayed selectable items, not all matching server results.
- `clrControl` supplies registration/presentation, not a CVA. Its host label/description handling alone does not prove
  that the internal element with `role="grid"` is named and described correctly.
- There is no general datagrid-wide disabled/readonly value-control input. Effective row eligibility and select-all must
  combine caller constraints with form availability.
- A complete projected grid in A preserves its own provider hierarchy. Projecting arbitrary caller-declared items into a
  different internal grid needs an injector/content-query proof before such an API can be accepted.

The source audit confirms both API forms. Installed Clarity 18.4.0 and upstream
[ClrDatagridItems](https://github.com/vmware-clarity/ng-clarity/blob/main/projects/angular/data/datagrid/datagrid-items.ts)
forward the iterator's trackBy to Angular's NgFor row-view differ. The upstream
[selection documentation example](https://github.com/vmware-clarity/ng-clarity/blob/main/projects/website/src/app/documentation/demos/datagrid/selection/selection.html)
sets `clrDgItemsIdentityFn` and omits iterator trackBy, while the upstream
[selection development demo](https://github.com/vmware-clarity/ng-clarity/blob/main/projects/demo/src/app/datagrid/selection/selection.html)
exercises both together, including row-view tracking by index. The
[v17 migration guide](https://clarity.design/pages/update-to-v17) records the separation of row iteration from selection
tracking; historical input names there do not override the installed version's `clrDgItemsIdentityFn` declaration. The
read-only application audit likewise finds identity-only resource pickers and list templates using both inputs.

## Developer learning journey and pedagogy plan

All destinations below are proposed. No demo route or package import has been delivered.

| Reader task / prerequisite                                      | Learning outcome                                 | Proposed destination                       | Working example and expected result                          | Validation          |
| --------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------ | ------------------------------------------------------------ | ------------------- |
| First local multi-select; know Clarity items and Reactive Forms | Submit stable selected keys                      | Datagrid selection playground              | Optional footer; value/status/submitted payload              | Compile and browser |
| Edit an existing selection                                      | Distinguish value from loaded items              | Prefill and identity example               | Delayed items and refreshed instances preserve pristine form | Controlled requests |
| Use one selected row                                            | Understand null, required and explicit clear     | Single selection example                   | Agreed scalar/null value; business adapter outside picker    | Forms/type checks   |
| Use template-driven or signal-observed Reactive Forms           | Keep one owner per host                          | Separate ngModel and toSignalForm examples | Same selection contract, real reset/submit                   | Installed consumers |
| Load server pages                                               | Preserve keys without claiming global select-all | Remote paging example                      | Keys survive page/filter changes and request races           | Browser fixture     |
| Adapt presentation and availability                             | Use both layouts and inspect readonly            | Layout/eligibility example                 | Long labels, errors, footer/filter focus and RTL             | Browser/a11y/manual |

## Accepted behavior and integration rationale

### Accepted foundation

Q1–Q12 are approved with the simplified availability contract and no dedicated forced-retention API. Resource-specific
components directly compose a complete Clarity grid; external formControlName stays compatible. Forms store stable
primitive keys: single K|null and multiple K[]; readonly key arrays remain supported. Entity DTO conversion stays at
submission. Field layout inherits clrForm with a per-field override.

Business code supplies scoped string/number item keys. Duplicate candidate keys are developer errors. Existing
multi-value order is stable through filtering, sorting and paging; new selections append. Defaults belong to the
application; the library never selects a first or sole item implicitly. Explicit single clear emits null even when
required, and owning-form validation then reflects emptiness.

The exact implementation and exported declarations require integration proof; approved interface direction remains
valid.

Here, **caller** means the application component using clr-lift, not the person interacting with the form. Under Q1,
that component directly declares the complete clr-datagrid with native columns/cells/filters. It supplies items,
fetching state, pagination preferences and domain eligibility/validation rules. Clarity still renders and operates the
grid. clr-lift owns the selection-to-form bridge, preselection reconciliation, availability enforcement, composite focus
and field presentation. The caller does not implement another CVA or independently synchronize `clrDgSelected` for this
inner control. Any outer application-component form bridge remains an explicit integration choice.

The native-grid tradeoff keeps native customization explicit and removes a second schema/renderer. Native grid markup
can be centralized in a reusable domain picker or declared inline; domain reuse and data retrieval do not determine grid
ownership. Keep one selection engine and one form owner.

### Approved interface direction: Q10–Q12

The ask-matt workflow review identifies the next step as interface review followed by a real Angular/Clarity integration
proof. Its standard static logic/visual-variant prototypes cannot establish Angular CVA, projection or accessible-grid
behavior. Continue in this design context, then consolidate the proven contract for ticketing.

| Question | Proposal for review                                                                                                        | Reason                                                                                                                                                        |
| -------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Q10      | One DatagridSelectionComponent reads fixed native clrDgSelectionType and native identity; no duplicate shell configuration | Keep one usage pattern while preserving scalar/null versus key-array values; generic inference and actual forms must be proved                                |
| Q11      | Revised October 29: compose a library-owned picker accessor and bind its inner selection through a directive               | Supersedes the earlier recommendation to leave thin CVAs in business components; parent formControlName remains unchanged. Runtime/package proof is required. |
| Q12      | Approved: item disabled plus disabledReason, no dedicated locks or dual permission objects                                 | Keep normal availability simple and preserve removal of invalid saved choices                                                                                 |

Q12 is approved in its simplified form: item disabled plus a localized disabledReason, without locked/lockedReason or
separate select/deselect permission objects. Normal disabled items cannot be newly selected. An existing selection that
becomes unavailable keeps its key and explanation, remains removable for recovery, and is validated by the owning
business form. Whole-field disabled/readonly still blocks every value edit. Item disabled therefore describes
eligibility to add, rather than blindly mapping onto an already-selected checkbox's native disabled attribute.

The modern form consumers do not justify a dedicated must-retain API. A legacy registration dialog shows existing
resources checked and disabled but excludes them from create payloads; that action-only presentation is not a v1
form-value requirement. The simplified approval supersedes earlier lock proposals throughout this specification.

The proof must use the installed Angular/Clarity components and inspect actual owner values/dirty/touched,
projection/provider behavior and the accessibility tree. Cover delayed prefill/no echo, wrapped formControlName and
ngModel, disabled/readonly and unavailable selected items, unpaged-scroll/filtered/page select-all, true grid
naming/errors, and focus across cells/footer/filter popup. Strict templates and a packed consumer check the eventual
public surface. The local proof now passes strict Angular templates and 54 browser scenarios in each of Chromium,
Firefox and WebKit. This proves the scoped integration, not a new packaged public component.

After the proof, update this canonical spec rather than starting a competing contract. The recommended later route is
implementation against the approved child-ticket graph above. Concrete API review and production delivery remain
pending; the earlier workflow-routing discussion did not itself implement the component.

### Application component reuse and the outer form binding

Resource-specific components remain useful: an organization picker and a storage-target picker each declare their grid
once, and create/edit pages reuse those components. Shared behavior removes duplicated selection/form mechanisms, not
the resource-specific columns, filters or data sources.

Preserve the outer application component's existing `formControlName` binding. The main application example is:

```typescript
readonly form = new FormGroup({
  organizationIds: new FormControl<string[]>(['org-a'], {
    nonNullable: true,
    validators: [Validators.required],
  }),
  storageTargetNames: new FormControl<string[]>([], {nonNullable: true}),
});
```

`FormControl<K[]>` is the normal application example; `readonly K[]` is an optional TypeScript constraint, not a
required consumer declaration. The bridge must accept either array shape and emit a fresh mutable `K[]` for accepted
multi-select edits without mutating caller-owned arrays. The `readonly form` property modifier only prevents reassigning
that property. Neither TypeScript modifier makes the rendered field readonly; the field's readonly interaction state is
separate. Use Angular `setValue`, `patchValue` or `reset` to notify the form of application changes rather than mutating
its array in place.

```html
<!-- Proposed integration: outer wrappers must retain/provide a real value accessor. -->
<form [formGroup]="form">
  <app-organization-picker formControlName="organizationIds" [items]="organizations()" />
  <app-storage-target-picker formControlName="storageTargetNames" [items]="storageTargets()" />
</form>
```

The organization wrapper's domain inputs include items; its native identity callback chooses the actual stable saved
key. The October 29 proposal composes a library-owned accessor and marks one inner field for binding. Host NgControl
does not automatically move to an inner grid: those two directives own the explicit connection. The business component
writes no CVA callbacks. Runtime/packaging proof and explicit removal of an existing accessor remain required before
production migration. Preserve existing object-valued wrapper contracts with explicit adaptation rather than silently
changing those fields to IDs.

The earlier `[control]` sketch passed an existing FormControl instance directly to a wrapper. That object includes
value, errors, disabled and touched state; it is not the ID array itself or Clarity's `clrControl` directive. This is a
possible Reactive Forms composition, but no longer the main API recommendation. It is not required by the generic
selection core. The parent form remains the one owner under either approach, with no mirrored FormControl. ngModel and
future native Signal Forms need real bridges for their own form systems.

### Wrapper bridge feasibility and revised composition

Installed Angular supports a thin resource-wrapper CVA that passes controlled value, availability and interaction events
to the generic inner selection UI. The inner UI has no formControl/ngModel binding in that mode and creates no
FormControl. The wrapper remains connected to the original NgControl, validators and form commit timing. Owner writes
update the view without user callbacks; accepted inner edits and composite departures report through the outer CVA. Read
required/error/touched/pending presentation from the actual owner's public APIs with lifecycle-safe injection.

The October 29 proposal chooses a reusable standalone CVA host directive, but exactly one custom value accessor may be
registered on the wrapper host. Installed ClrControl is not standalone and cannot simply be used as a host directive.
Host directives referenced by exported library components can also impose public-entrypoint visibility/export
requirements. Do not promise an invisible generic host-directive abstraction before strict packaging proof. The earlier
private-helper/thin-CVA recommendation is superseded for the intended consumer API; existing custom wrappers can retain
their current accessor until migrated.

The complete composed picker, parent, direct native grids and reusable filter UI now compile against declaration-only
candidates. This proves consumer syntax, not runtime bridge/provider/projection behavior. Installed public-package and
production lifecycle proof remain required; preserving formControlName never requires mirrored controls.

### Integration proof findings to preserve in production

- Keep caller items readonly. Clarity's smart iterator requires a mutable array, so adapt with a cached shallow copy
  rather than weakening types or mutating the caller's collection.
- The library owns selected-row synchronization and rendering. Earlier setter-only writes left the header stale;
  explicit Angular bindings fixed those prototypes, while the new narrow adapter proof verifies native selected writes
  with scheduled change detection across pages. Do not expose a second writable application selection owner or restore
  the removed consumer reference merely to hide a rendering bug. Full owner-write/no-echo coverage remains required.
- Cover single-radio and multi-checkbox intent separately; refreshed objects and grid reconciliation are not user edits.
- Own filter portals through standard aria-controls relationships. A host contains check alone touched the field when
  its own filter input received focus. Distinguish WebKit's transient body focus while a page's elements are replaced
  from actual outside focus/pointer/window departure.
- Use the declared public datagridTable element reference for grid naming/descriptions/invalid state. Required is
  associated instruction text, not aria-required on role=grid. Keep this version-sensitive adapter private.
- Preserve one Angular form owner. The wrapped Reactive Forms host and the direct ngModel host pass, including disabled
  serialization and Angular-owned blur/submit commit timing; there is no mirrored inner FormControl.

### Selection values versus backend payloads

Q2 is explicitly reconfirmed: store stable keys in the form and convert them to full/partial entity DTOs at submission
when the endpoint needs them. The generic control does not gain an entity-valued mode from this requirement.

```typescript
const organizationIds = form.controls.organizationIds.value;
const idPayload = {organizationIds};

// selectedItems represents ALL resolved selected entities, including off-page ones.
const referencePayload = {
  organizations: selectedItems.map((item) => ({id: item.id, name: item.name})),
};
const entityPayload = {
  organizations: selectedItems.map(toOrganizationDto),
};
```

Entity resolution and `toOrganizationDto` belong to the application, not new exports from this draft. Complete DTOs must
not accidentally include item-view state such as availability. Prefer an explicit reference DTO or
`Pick<Organization, 'id' | 'name'>` to an unconstrained Partial when specific fields are required.

Key-only endpoints need no entity hydration solely to submit. Entity endpoints require every selected key resolved from
authoritative cached data, a complete inventory or by-ID lookups, rather than just the current page. Unresolved keys
must keep the submitted request blocked until resolved or explicitly handled; do not silently filter them out. An
existing object-valued application wrapper needs a compatible explicit adapter or a separately reviewed value contract,
not a silent switch to key arrays.

## Advanced integration examples

### Complete status column example

The [direct policy form](datagrid-selection-code-examples.md#without-a-picker-advanced-form-and-tosignalform) includes
id/name/status data, a native name column, translated status badge, comparator, real custom filter, pagination and a
plain projected label/signpost. It also uses the actual toSignalForm facade on its owning FormGroup. The
[shared resources](datagrid-selection-code-examples.md#shared-resources) define every helper/message.

### Complete Clarity grid example

See [simple multiple](datagrid-selection-code-examples.md#without-a-picker-simple-multiple-selection),
[simple single](datagrid-selection-code-examples.md#without-a-picker-single-selection) and the
[reusable picker and parent](datagrid-selection-code-examples.md#with-a-picker-component). All directly project the
native grid. There is no gridTemplate, cllDatagridLabel or generated-grid fallback. Native row labels, sorting, filters
and optional pagination are explicit. Native trackBy remains row-view reuse, not saved identity. The library owns
selected-row writes and their change detection; uncoordinated direct assignment left the earlier proof's header stale on
page changes.

The shell supplies localized single Clear and field feedback. It retains primitive key values and unresolved/off-page
keys. Server pages use ordinary caller-owned row iteration and clrDgRefresh instead of the smart local iterator. The
scope remains the logical native page, not viewport DOM rows. Returning an availability reason does not inject text into
arbitrary caller-owned cells. These source examples do not prove the runtime registration of projected grid/rows/labels.

### Application-owned async inventory and mutation

The application loads inventory with queryResource and writes with mutateResource. The
[complete code](datagrid-selection-code-examples.md#shared-resources) provides the actual service, query definition and
HTTP/query setup. The page binds its query result to clrDgItems, owns loading/failure/retry UI, and keeps the form
mounted while requests settle. The field reads native loaded/scope snapshots; it does not fetch or subscribe to a query
cache.

Query keys include resource scope and every server-response-changing parameter, including server page/filter parameters
where applicable. Client-side filtering over a complete inventory does not change the inventory query key. queryResource
retains successful data on refresh failures and distinguishes those from initial failures. Cancellation, stale responses
and observer lifetime belong to the application query, never the selection/form bridge.

The save sketch below uses existing ngx-lift APIs; SavePolicyArgs and policyService belong to the application. It is an
integration sketch, not an additional compiled consumer host.

For an explicit policy save, the parent validates and constructs a DTO snapshot before invoking a mutation:

```typescript
import {mutateResource} from 'ngx-lift';

readonly savePolicy = mutateResource(
  (args: SavePolicyArgs) => this.policyService.savePolicy(args.scope, args.policy),
  {
    concurrency: 'exhaust',
    invalidateTags: (_saved, args) => [{type: 'Policies', scope: args.scope}],
  },
);
// After validating the owning form and constructing its DTO snapshot:
// await this.savePolicy.mutate(args);
```

Policy tags and inventory tags describe different data. An inventory-changing mutation invalidates matching scoped
`Organizations` tags; saving a policy need not invalidate organization inventory. The configured mutation/query client
owns scoped invalidation and refetch. If the save flow requires fresh data before continuing, the application explicitly
awaits the read; mutation success alone does not prove background refetch has finished. The field does not automatically
select a newly created item.

Required acceptance for the query and mutation host:

- Saved keys can precede initial items. Loading, retry, reloading and fresh object instances reconcile the view without
  emitting a form edit, changing key order, marking dirty/touched or losing keys absent from the current data.
- Keep the field/form owner mounted during refresh. A temporary empty collection, cancelled request or failed reload is
  not authoritative deletion. Query cache updates must not overwrite pending blur/submit selection edits with the last
  committed form value. Native row trackBy remains optional throughout.
- Read loading, mutation loading, business validation pending, field disabled and field readonly are separate states.
  The parent owns the submit button's Clarity loading state, duplicate-submit policy and any temporary edit lock.
- Changed authoritative availability can update item eligibility and trigger parent validation without a fake value
  change. An unavailable selected key remains until explicitly removed; whether it blocks saving is a business rule.
- Submission snapshots the selected keys and required DTO data. Later refetches do not mutate an in-flight payload. Save
  failure retains the user's edits. A completed write followed by a refetch/invalidation failure is reported as a
  synchronization failure rather than encouraging a second create request.
- A resource-scope change is an application form transition. The application explicitly chooses reset, preserve and
  revalidate, or a different form instance; it must not submit old-scope keys under a new scope without that decision.

The local scratch proof now includes actual resourceAsync/queryResource/mutateResource hosts backed by in-memory
Observable transports. Policy detail and organization inventory use independent queries, namespace inventory uses a
local resource, and saving uses a mutation with scoped detail-query invalidation. These prove the covered local
transitions, not live HTTP/backend integration, every remaining async acceptance case or a packaged component.

### Edit-session loading, error and reset workflow

The following workflow is exercised by the local query-edit review host. It adds no production component inputs;
packaged delivery and full acceptance remain pending.

**Independent requests.** If policy id and resource scope are already known, start policy-detail and inventory queries
in parallel with separate keys, loading states and retry actions. Do not combine them solely to make preselection work,
and do not introduce an inventory-first waterfall. If inventory needs a scope or another parameter supplied only by the
detail response, that query waits for its actual prerequisite. Atomic rendering may be a product choice, but it is not
required by the selection bridge.

Accept the first detail response intended for editing into an application-owned baseline and initialize the form once
for that edit-session identity. Until then, show detail loading/error and keep the edit controls unavailable rather than
letting a late detail response overwrite edits made to an empty default form. Cached detail may be used if the
application deliberately accepts it as the editing baseline; preserve its server version when the backend supports
concurrency checks. Later detail-query refreshes must not automatically reset either the working form or its baseline. A
different policy/scope starts an explicit new edit session.

| Response order  | Form and grid behavior                                                                                                                                                                      |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Detail first    | Initialize policyName, organization keys and namespace key immediately. The grids can still be loading with no rows. Retain every key; select matching rows as each inventory/page arrives. |
| Inventory first | Rows may render for browsing, but selection editing waits for initial detail acceptance. Initializing the form then checks matching loaded rows through the normal model-write path.        |
| Different pages | Loaded matching rows show checked; selected keys on other or unrequested pages remain in the value and total selected count. Visit their page to see the checked rows.                      |

Initializing or hydrating these selections must not produce a user value-change callback or mark the form dirty/touched.
The same rules apply independently to the single namespace field and the multiple organization field. Loading all
inventory first is neither required nor implied. An off-page or unresolved key is not missing merely because it is not
currently rendered.

**Network states.** The caller binds `[clrDgLoading]="organizationsQuery.isLoading()"` to the Clarity grid; `clrLoading`
is the button-loading API. Clarity does not infer HTTP failures from an empty array or fetch/retry requests itself. The
application composes a Clarity/clr-lift alert near the affected grid and an explicit Retry action calling
`organizationsQuery.reload()`. Keep transport feedback separate from the selection field's required/business error.

| State                                      | Recommended presentation and behavior                                                                                                                               |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Initial detail failure                     | Page/form-level failure and Retry; no editable blank policy or submission before a baseline is accepted.                                                            |
| Initial inventory loading                  | Grid loading indicator; retain saved keys and do not display a successful empty-inventory message.                                                                  |
| Initial inventory failure                  | Error and Retry near the grid; do not say that no organizations exist. Retain saved keys, even though no row can be resolved yet.                                   |
| Successful empty inventory                 | Actual empty-inventory message. Existing keys still require authoritative availability validation, not silent removal.                                              |
| Inventory refresh failure with cached data | Keep cached rows, current choices and form owner mounted; show a refresh-failure message and Retry. Do not replace the inventory with an error-derived empty array. |

Use queryResource's `isInitialError()` and `isRefreshError()` to distinguish failures with and without cached data.
Whether submission requires a fresh inventory is a parent-owned business rule: key-only endpoints may not require entity
hydration, while entity DTOs and current eligibility checks can require it. Read loading/failure is not automatically
Angular validation pending/invalid. An accepted backend write and a later read failure remain separate outcomes.

**Restarting an edit.** Recommended action: **Reset changes**, a secondary button with type="button" beside Save/Cancel
in the parent form. It restores the entire original policy form, including name, all selected organization keys across
pages, and namespace. It stays on the edit form and performs no backend write. Clear selection, closing/cancelling the
form and fetching the latest server detail remain distinct actions. A domain wrapper may offer a separately named Reset
organization selection when field-only recovery is actually needed.

The baseline is a copied form-value snapshot of the initially accepted policy detail, not the current query-cache
object, current grid page, or latest refreshed inventory. It belongs to the parent edit session, not to the generic
datagrid selection component. No `originalItems`, baseline input or public draft-history API is proposed. For example:

```typescript
// baseline contains policyName, every organization key, and the namespace key.
// The parent captured a separate copy when it accepted the initial detail.
this.formDirective.resetForm(structuredClone(this.baseline));
```

For this separately loaded edit baseline, use the owning
[FormGroupDirective's resetForm](https://angular.dev/api/forms/FormGroupDirective#resetform) so Angular also clears
submitted state. The complete examples with constructor-time nonNullable defaults use type="button" and resetForm() on
the existing form directive. Avoid the native browser reset action: it independently clears Clarity pagination and
checkbox DOM inputs without updating Clarity state. Direct form.reset(value) remains supported for model-only resets;
bare patchValue does not restart the form interaction state. Reset must discard pending blur/submit selections, write
every baseline key back through the value accessor, and leave controls pristine/untouched. Normal owner reset events may
notify Angular observers/facades; the CVA must not echo them as a user edit. A Reset button must not rely solely on
form.dirty for enablement, since pending blur/submit changes can exist before that flag changes. Re-run applicable
current validators. Preserve current permissions, item availability, inventory and query errors: an originally selected
item that is now unavailable is restored as a selected key and can still be invalid under today's business rules. Do not
falsely restore old permission or eligibility metadata. Reset changes preserves grid filters/page by default and does
not refetch; a separate View selected action can make restored choices easier to inspect.

For recognition, always display the total selected count across pages. A caller-owned optional **Original
configuration** summary can show saved names/keys, namespace and added/removed counts without mixing original and
current checkmarks. Names for unrequested selected keys require detail-provided display metadata or explicit by-key
resolution; never infer them from the current page. Diff/summary presentation does not replace the copied baseline used
for reset. Whether to ship this optional summary alongside Reset changes remains a product-review choice.

After a successful save, the parent closes the form or deliberately starts a new baseline from the accepted saved
response. Background detail refetch must not silently move what Reset changes means. New owned messages for the eventual
host include initial/refresh load failures, Retry, successful empty inventory, selected count, Reset changes,
reset-result announcement and any original-configuration/diff labels, with all supported locales required at delivery.
The local proof covers both response orders, error/retry with and without cache, cross-page original keys, reset of
pending blur/submit edits, submitted-state reset, detail refresh while editing, simulated mutation failure/success, and
restored keys that are now unavailable. The example uses a complete 25-item inventory with client-side pagination;
server-page fetches, real HTTP errors, mutation-success/detail-refetch-failure and broader request races still need
production integration coverage.

## Behavior and architecture

The [shared form contract](forms-compatibility-design-spec.md) already settles model-write no-echo behavior, owner
reset, Angular-owned `updateOn`, composite departure touch, disabled/readonly distinction, validator ownership and async
state. These are existing requirements, not questions reopened by this feature.

Approved responsibility boundary; concrete bridge implementation remains unproved:

```mermaid
flowchart LR
  F[Angular form owner] <--> Bridge[Form bridge]
  Bridge <--> S[Selection value and identity]
  S <--> G[Caller-written Clarity grid]
  Data[Application data and query owner] --> G
  L[Field label, layout, helper and errors] --> G
```

Required transitions and proof points:

- `writeValue`, reset and row hydration render supplied selection without change/touch callbacks. Nullable multi-form
  initialization renders empty without silently rewriting its owner; explicit user clear reports the approved empty
  value.
- A meaningful user selection reports one serialized value change. Row-instance refresh and selection ordering alone
  must not cause duplicate notifications under the chosen equality/order policy.
- Unresolved keys remain distinguishable from unavailable keys. A filtered-out row, empty loading collection, current
  remote page or failed request is not authoritative removal evidence.
- Disabled/readonly must block checkbox/radio, keyboard, row-click if present, select-all, clear and selected-item
  removal paths while preserving the value. Readonly permits viewing, filtering, sorting and paging, without changing
  selection.
- Focus departure considers the complete grid, footer, filter trigger and owned filter popup. Moving between them does
  not touch the form early. Reset followed by a later departure must still notify the owner correctly.
- Fetching retains application cancellation/generation ownership under the proposed boundary. Grid loading does not
  become `FormControl.pending`; only form async validation supplies that state.
- Shared labels/errors must reach meaningful accessible targets. Avoid a dependency on private Clarity selection
  services or unreviewed DOM selectors; lack of public access may require an upstream change or a revised API.

The maintainer approved the simplified Q12 and removed dedicated forced-retention scope. Other accepted behavior remains
valid. Concrete bridge interfaces, accessible targets and installed-package proof remain implementation/API work.

### Select-all scope with pagination, filters and scrolling

Select-all is scoped to the grid's active logical item collection after current filters and pagination. A footer is
presentation; the actual pagination configuration defines a page. A scroll viewport does not define selection scope.

| Grid configuration                                           | Scope of one select-all action                                                     |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| Actual local/server pagination, with any footer presentation | Current filtered page's eligible items                                             |
| No pagination, no footer, all items in a scrollable grid     | All currently filtered eligible items, including those outside the scroll viewport |
| No pagination, footer used only for counts or summary        | The same entire filtered eligible collection                                       |
| Server-managed data where only one batch/page is supplied    | Only that supplied logical page; never unrequested matching server results         |

The action records explicit keys at that moment. Later data arrivals or filter/page changes do not implicitly select new
keys. Existing out-of-scope selections are preserved. Clearing the header removes only in-scope selections that business
rules permit removing. Grid sorting changes neither existing form-value order nor identity. Reason strings, header state
and accessibility must reflect actual eligibility/removal policy.

Acceptance examples: 100 unpaged items in a 10-row-height scrolling area select all 100 eligible items; a filter
matching 8 scopes the next action to those 8; a paginated page of 10 affects those 10 rather than the collection total.
Each example excludes items ineligible for that action, preserves out-of-scope choices, and covers unavailable selected
items.

### Business item availability, reasons and validation

Business logic supplies item eligibility and a localized disabledReason. The approved simple contract is:

```typescript
interface DatagridItemAvailability {
  disabled: boolean;
  disabledReason?: string;
}
```

An item availability function returns that state; denied choices must have an understandable localized explanation. Item
eligibility composes with field disabled/readonly. It blocks additions through rows, keyboard and select-all; selected
unavailable items remain removable, unless the whole field is disabled/readonly. The bridge and actual Clarity input
state must reflect this distinction. No item creates a child FormControl.

The default reason is visible wrapping text beneath the item name, with caller-controlled placement in a status or
availability cell. Do not rely solely on hover or a native disabled checkbox for access to the explanation. The exact
renderer symbol and semantic association are integration-proof details. A unavailable unselected item does not make the
field invalid; authoritative business validators decide whether a selected unavailable key may be submitted.

Required, selection count, eligibility of submitted keys and cross-field compatibility belong to the owning Angular
form. For example, this application chooses required organization assignment capped at three and optional storage:

```typescript
readonly form = new FormGroup({
  organizationIds: new FormControl<string[]>([], {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(3)],
  }),
  locationNames: new FormControl<string[]>([], {nonNullable: true}),
});
```

The wrapper retains the parent's form owner through its CVA/bridge; it must not recreate validators or synchronize a
second control. The CVA reports value/interaction, while the field presentation reflects real
required/error/touched/pending state through reviewed metadata and error slots. A required-looking input or label alone
does not install/forward validation. ngModel validation directives and later native Signal Forms schemas need their own
real-host checks.

Business async validators own remote eligibility checks and actual form pending. When authoritative inventory or
permission state changes independently of the value, business integration must revalidate that owner without faking a
user edit or replacing its value. Disallowing new selection need not imply rejecting a grandfathered saved selection.
Field disabled state, row availability, network loading and invalid selection remain separate concepts. Any future
control-owned structural validator must compose with owner validators rather than replace them.

## Clarity, accessibility, and localization

Use Clarity tokens and existing form layout concepts. A vertical field puts the label above the grid; horizontal puts it
beside the grid with helper/errors aligned to the grid. Layout width must not leak into filter-popup labels. Cover
optional footer/pagination, long cell contents, compact/light/dark modes, touch, zoom, narrow widths and RTL.

Field feedback follows Clarity input conventions: a caller-supplied helper appears below the grid in the normal state; a
visible error replaces it with Clarity error text and an error icon. Correcting the error restores the helper. The real
grid's aria-describedby references only the currently rendered helper or error, plus any required hint. Invalidity alone
does not imply immediate error display: the form integration uses the owner's touched/submitted policy. Submitting an
empty required single selection must reveal the same feedback even when the user never focused that field. Clarity's
helper/error components may be reused without creating another form owner or forwarding validators into a second
control. Scratch technical fixture keys and raw Angular state must be explained separately from field helper text.

Clear-selection and other field actions belong above the grid, outside the gap between the grid/footer and its
helper/error. In this form, align Clear selection to the start of the grid control column in either field layout,
following reading direction. This is the selected field-level default, not a universal table-toolbar placement rule.
Error coloring is scoped to the feedback region; do not place clr-error on an ancestor of the grid, selection inputs,
filters or pagination. Required selection failure is a field-level error, so valid pagination/search controls and the
row radio/checkbox indicators retain their ordinary styling. Keep aria-invalid and the current error association on the
actual grid. Under change/blur policies, a required empty field remains without visible error while untouched, becomes
touched after departure from the whole composite, and remains pristine when focus moves without selection changes. The
submit policy preserves Angular's deferred value/touched behavior until form submission. Single and multiple values
share the same Angular invalid/dirty/touched semantics; diagnostic prefixes must not imply separate validation
contracts. Field readonly blocks every selection edit, including clear and select-all, without making individually
disabled items selectable when readonly is false.

The policy-creation host starts with empty organizations, namespace and policyName, without selecting the first
namespace or requiring an action to clear a default. Edit preselection uses an explicitly separate fixture. Its
horizontal/vertical switch applies to all three fields, retains owners and drafts, and reflows to stacked fields on
narrow screens. Selection fields have a label and control body without an enclosing field border; feedback aligns with
the control body. Use actual Clarity input/select directives for owned settings as well as business inputs. Keep debug
scenario actions and state outside the three-field form, in an optional advanced area. Warning presentation does not
implicitly determine whether an item can be selected; callers still provide disabled/disabledReason and owner
validation.

Filtering belongs to the caller's Clarity grid. Do not add first-N, ID-interval or generic from/to filtering to the
selection field without an evidenced business use case. The proof uses real organization-name filtering to exercise
filtered select-all and off-filter selection preservation. A domain may project its own date/capacity/range filter when
its semantics are meaningful; removing a synthetic fixture does not restrict Clarity's filtering capabilities. The
[Carbon table guidance](https://github.com/carbon-design-system/carbon-website/blob/main/src/pages/components/data-table/usage.mdx#batch-actions)
places batch-mode cancellation on the far right. Adapt the broader action-grouping idea; this form's field-value Clear
is kept with the grid's selection area at the control start rather than treating batch cancellation as a universal rule.

Review diagnostics distinguish the UI's read-only viewValue from the committed FormControl value. They normally agree
for updateOn=change and may differ until blur/submit commits a user edit. A selected key absent from loaded items
remains in both values when committed; it is not a backend draft. Event-emission counters belong only to regression
probes, not visible field state, submitted data or a component API.

For this form, small inventories use natural height. The unpaged grid has a CSS height ceiling of approximately ten
ordinary Clarity rows plus its header; wrapping rows can occupy more space. This limits the viewport, not the items or
selection. Retain the last unfiltered footprint while filtering, including one-result and empty-result states, to keep
subsequent fields steady. Paginated grids use their page footprint and retain it for filtering/short pages. Rebase the
footprint when the unfiltered inventory size or available width genuinely changes; do not permanently retain a larger
height from an unrelated inventory. The proof's sizing adapter and CSS are caller-side experiment code, not an approved
new exported sizing utility or maxVisibleItems API. Large/remote/virtual inventories need their own production evidence.

Inventory all owned messages before implementation: field label, description, required/invalid feedback, loading, load
failure/retry, empty results, selection count, selected/unresolved/unavailable status where offered, row selection
labels, select-all scope, clear/removal labels, and disabled/readonly explanations. Resource labels, custom columns and
business errors remain caller supplied. Avoid duplicate announcements between shell and native Clarity controls.

Deliver every owned message and demo explanation in en, zh-CN, zh-TW, de, es, fr, ja, ko, nl, pt-BR and ru, retaining
library aliases. Runtime switching must preserve selection, focus and query state. Automated dictionary/browser checks,
independent language review and manual assistive-technology acceptance remain distinct gates.

## Demo and validation plan

No production-component suite has run. A local scratch integration proof passes strict Angular compilation and 162
browser scenarios (54 per engine); its scope and remaining gates are recorded below.

The local proof exercises complete-grid projection, field registration, item availability, accessible grid naming and
filter-popup/footer focus against installed Clarity. Production implementation must preserve these verified behaviors,
complete the remaining API/type/package gates and retain corresponding regressions.

Then cover every approved use case in copyable playgrounds and focused tests:

- Unit/host tests: prefill before/after items, no-echo hydration, refreshed identities, scoped duplicate names,
  null/reset, single clear, multi ordering, cross-page preservation, stale requests, and unavailable preselected items.
- Identity/type hosts: selection remains stable with native row trackBy omitted and configured. Stable-key row trackBy
  reuses retained row elements after fresh instances and reorder; independent row-view tracking must not override the
  resource/selection key. Cover both `FormControl<K[]>` and `FormControl<readonly K[]>`, with fresh mutable output
  arrays and no mutation of caller-owned values.
- Async hosts: actual resourceAsync local reads, queryResource cached/refreshed reads and mutateResource writes; delayed
  preselection, request replacement, refresh errors, scoped tag invalidation, availability changes, pending blur/submit
  edits, immutable submit snapshots and mutation-success/refetch-failure separation.
- Forms: real ngModel, typed Reactive Forms and toSignalForm hosts; change/blur/submit timing; pristine/dirty/touched,
  caller sync/async validators, disabled initial values, reset and serialized submission.
- Browser: Chromium, Firefox and WebKit; keyboard/pointer/touch selection, filters and popup focus, footer optionality,
  horizontal/vertical/reflow, light/dark/compact, locale switching and RTL. Controlled fixtures; no timing sleeps.
- Installed packages: public declarations and strict templates in Angular 21 zoneless and ZoneJS consumers. Typed
  FormControl alone does not establish CVA template typing. Native Signal Forms gets a separate post-upgrade matrix.
- Performance/platform: choose realistic local inventory and bounded server-page budgets during review; measure rather
  than assert untested scale. Verify teardown and SSR/hydration if claimed. No new runtime dependency is proposed.

## Compatibility, rollout, and risks

The current workspace uses Angular 21.2.17 and installed Clarity 18.4.0. Existing broad package peers do not prove every
older Clarity version supports the proposed bridge. Record a minimum supported Clarity version and installed evidence
after API proof; do not silently narrow peers in this design draft.

The roadmap already defers Angular/Nx upgrades and requires native Signal Forms after that upgrade. Preserve existing
Reactive Forms/ngModel behavior through the future form bridge unless a separately reviewed release decision changes it.
Object-valued application pickers need explicit adapters under the accepted primitive-key contract. Automatic default
selection and wildcard semantics must not be imported accidentally from existing domain controls.

Major risks: unavailable public accessible-name forwarding, disabled/readonly row integration, Clarity projection/DI,
selection events caused by reconciliation, complete-local versus remote-page removal semantics, scoped key collisions,
and accidental migration changes in form dirty/submission behavior. Each needs a reviewed policy and observable test.

## Review decisions and delivery

The maintainer accepted Q1–Q9 and clarified that an unpaged, footer-free grid may show the entire item collection in a
scrolling area. The maintainer subsequently approved Q10/Q11 and the simplified Q12, with dedicated locks removed from
v1. The API direction is approved; integration proof and production delivery remain separate gates.

| Decision | Accepted policy                                                                                                                                             |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Q1       | Caller-written Clarity grid; optional reusable resource pickers; preserve outer formControlName                                                             |
| Q2       | Stable key-valued forms; convert to full/partial entity DTOs at submission when required                                                                    |
| Q3       | Inherit form horizontal/vertical layout; per-field override and narrow-screen reflow                                                                        |
| Q4       | Retain unresolved/off-page selections; only authoritative business validation establishes invalidity; no silent removal                                     |
| Q5       | Prevent unavailable additions; allow invalid selections to be removed; no independent lock API; reasons beneath the name with caller-controlled placement   |
| Q6       | Actual filtered page scope; all filtered items when unpaged, including scrolled-out items; preserve out-of-scope selections; no all-server-results sentinel |
| Q7       | Readonly supports viewing, filtering, sorting and paging without selection changes; disabled retains value and blocks edits                                 |
| Q8       | No implicit first/sole selection; application sets defaults; single clear emits null with owner validation                                                  |
| Q9       | Scoped stable item keys; duplicate candidate keys are developer errors; retain multi-value order and append new selections                                  |

The [ADR](../../adr/0002-datagrid-selection-composition.md) records the October 29 native-grid rendering decision and
shared key-valued form contract. Next resolve public single/multi typing, wrapper bridge and owner-state presentation,
item add/remove policy representation, accessible targets and layout defaults. Technical facts come from
installed-source/proof work; only genuine remaining API/product choices return to maintainer review. Present the
complete concrete API before production implementation. Existing approved decisions remain valid.

Delivery sequence: concrete API/projection proof; local single/multi selection and field presentation; remote-page and
unavailable-item acceptance; complete demos/localization/browser/package validation. Include unpaged scroll and filtered
select-all in the validation matrix. Roadmap priority remains unchanged.

## Evidence

- October 25, 2026 source-only audit: current ngx-lift revision `17a38283980e4340bb1367846b6a432a74f12792`, installed
  Clarity 18.4.0 declarations/implementation, shared form contract, field/layout patterns, and consumer implementations
  and create/edit call sites. Consumer behavior was not runtime-reproduced and inferred completeness/identity risks are
  identified as risks.
- Primary-source comparison: official Angular Material/NG-ZORRO repository docs, React Aria Table and Angular custom
  Signal Forms documentation linked above. Clarity integration claims use the installed version rather than older docs.
- Follow-up explanation checked the actual organization/storage CVAs, cluster eligibility/reason markup, and installed
  Angular 21 required/maxLength implementations. The latter validate empty arrays and array lengths respectively. The
  original application sources were not changed. Public cll-* examples remain proposals; the separate local proof below
  compiles and exercises the bridge mechanism.
- Select-all scope inspection: the installed datagrid exposes its logical displayed collection through public class
  declarations; its smart client processing applies filtering/sorting/pagination before viewport rendering. With no
  pagination it contains the entire filtered collection, not merely on-screen rows. Do not derive selection scope from
  DOM rows. Host-directive packaging notes remain source inspection; the thin-wrapper mechanism is exercised by the
  local runtime proof below.
- Current draft checks passed: focused Prettier check, relative file-link existence for this spec and the design index,
  and `git diff --check`. Local browser proof is recorded below. Production-component suites, full accessibility and
  installed-consumer acceptance, human review, CI, merge and publication are not claimed.

### Historical generic API proof, October 26, 2026

The first #200 implementation step uses the approved strict-template/package seam to resolve the remaining generic API
question before production exports. A private, declaration-only `@proof/datagrid-selection` candidate contains the
proposed component/directive/type names; it has no runtime selection implementation and is not published or exported by
clr-lift.

- **Red:** without an explicit typed column owner and context guard, a cell referencing `item.missingProperty`
  unexpectedly compiled. A fixed-item prototype cannot detect this generic consumer failure.
- **Review regression:** native Clarity method-interface variance allowed subtype-only filters/comparators despite
  NoInfer. A strict negative case reproduced the failure. Intersecting with function-property callback signatures closes
  that gap; broader valid callbacks remain accepted.
- **Green:** required `cllDatagridColumnOf`, the context guard, NoInfer and strict callback parameters preserve the
  intended item/key/mode types. Fourteen strict compiler cases passed against source and then against a
  partial-compiled, ng-packagr-built candidate installed from a local tarball: valid typed cells; invalid item property;
  valid readonly string/mutable number values and exact mutable output events; rejected multiple/scalar, single/array,
  wrong-key and wrong-event shapes; rejected wrong-item and subtype-only filters; rejected subtype-only comparators;
  accepted broader callbacks; rejected missing column owner; and complete native grid bindings.
- A dedicated case deliberately demonstrates Angular's CVA limitation: a number FormControl still compiles against a
  string multiple field. This is an observed boundary requiring runtime incoming-value diagnostics, not a passing
  end-to-end type guarantee.
- Compiler settings use strict TypeScript, strict Angular templates and `skipLibCheck: false`; the environment is
  Angular 21.2.17, TypeScript 5.9.3 and Clarity 18.4.0. The tarball is extracted into an external consumer; its Angular,
  Clarity and compiler dependencies are linked from the existing workspace. This is **not a fresh dependency install**.
- Local review aids are under `tmp/datagrid-selection-api-proof`. Reproduce with
  `API_PROOF_ANCHOR=true node tmp/datagrid-selection-api-proof/prove.mjs` and
  `node tmp/datagrid-selection-api-proof/package-proof.mjs`. These ignored scratch files do not replace the committed
  public-host/package regression suite required for production delivery.

Pending: maintainer review of the concrete API additions, shared production runtime, real candidate/production renderer
integration, runtime owner/configuration diagnostics, production demos/localization/browser coverage and actual clr-lift
installed-consumer acceptance. That candidate reflected the then-current earlier rendering proposal, superseded by the
current native-grid decision.

### Historical rendering comparison proof, October 26, 2026

An earlier private comparison exercised alternative grid construction over the same policy detail, inventory,
reconciliation and form/query/reset flow. It passed 54 scenarios per browser in Chromium, Firefox and WebKit, including
native custom filters, comparators, label-help focus, popup registration, local selection and optional pagination. Those
comparisons are no longer consumer entry points and do not justify maintaining a parallel schema or renderer.

That proof reproduced a pagination trap: removing a footer alone left old native page slicing active. Disable actual
pagination when removing it. Preserve filtered logical scope, offscreen/off-page keys, native Angular selected-row
bindings and layout/feedback behavior. Earlier browser results are not production component or current data-adapter
acceptance. The remaining native integration evidence below retains its historical date and scope.

### Original native integration proof, October 25, 2026

Workspace revision: f865000dd9691e83c954ec02a10a126ec197c89c plus the local design/proof work. Installed Angular
21.2.17, Clarity 18.4.0 and Node v24.18.0. The scratch proof lives in the ignored tmp directory and is not a package
export. Strict TypeScript/Angular template compilation passed; Chromium, Firefox and WebKit each passed 38 browser
scenarios, 114 in total, with no pageerror. The scoped ARIA attribute/name/structure rules also passed.

The added query-edit review host contributes twelve scenarios per browser. It uses actual queryResource for independent
policy-detail and organization reads, resourceAsync for namespace inventory, and mutateResource for local simulated
policy saves with scoped detail invalidation. It covers both response orders, initial failures/retry, cached refresh
failure, successful empty inventory, cross-page preselection and reset, preservation of edits/baseline during detail
refresh, reset of pending blur/submit choices, mutation failure/success and the saved reset baseline, current
unavailable item validation after reset, and responsive layout. Native row trackBy is verified by retaining a row
element marker across a successful refetch with fresh item objects. The local fixture has 25 items with client-side
pagination; no live backend or server-page request is claimed. The preview now has a detached local launcher so serving
the review page does not depend on an interactive command session remaining open. These scratch additions are not public
package exports.

The scenarios cover unresolved edit keys, delayed items, refreshed identities/no echo, actual scrolling select-all,
filtered clear, readonly browsing, field disabled/raw versus normal serialization, unavailable-item removal, single
radio/null/required, real ngModel, keyboard/filter-portal/footer focus, owner error association, blur and submit commit
timing, and real paginated select-all preserving other pages. Failed portal-focus, native-header-binding and WebKit
transient-focus cases were reproduced before fixes and included in the final all-engine run.

The expanded review page separates Reactive Forms and template-driven forms, with independent validation and payload
previews. Its organization example supplies Name, ID and Status; only Enabled organizations may be newly selected. A
parent-owned validator rejects a saved item that becomes unavailable while preserving its key until explicit removal.
The guarded submit handler displays errors and produces no payload for an invalid form. The separate verified off-page
fixture remains selected and submittable when hidden by ordinary organization-name filtering. An earlier first-N fixture
was removed because the reviewed business flows do not justify that feature. Switching updateOn in this demo preserves
the current selection instead of reintroducing edit defaults. An empty UI draft in blur mode produces a visible required
error after composite-field departure. Clarity button classes and actual footer arrow SVG paths are checked.

The field shell reuses the installed Clarity control-helper/control-error components, including its real error icon. An
additional browser scenario initializes a required single field to empty and untouched, submits without focusing it,
asserts visible feedback using the actual Clarity invalid-color token, and verifies that correction restores the helper
and grid description. The previous plain paragraph error was present but its custom class lost to Clarity's generic
paragraph selector, leaving normal text color; the regression first reproduced that mismatch before this fix.

The latest presentation regression snapshots computed radio indicator colors and pagination input borders before and
after required feedback appears; neither changes. It also measures clear-action/grid/error ordering, verifies actual Tab
departure and pristine/untouched behavior for single and multiple fields, and checks that readonly disables every
rendered selection control while individually unavailable items stay disabled after readonly is removed. Diagnostic JSON
groups identical Angular state names by field instead of using different single/multiple flag prefixes.

The review hosts use a create-data-service-policy scenario with organizations (multiple organization keys), namespace
(one scoped namespace key) and policyName (a normal Clarity text input). The independent template-driven host binds
versions to multiple version strings and supplies Version, Status and Release date columns. These are named business
controls over the same selection contract; namespace and version items use their own inventories. Version approval
status is distinct from row availability: the example can warn about CreateDisabled without forbidding selection.

The default create host starts with all three business values empty and untouched, auto-loads the sample organization
inventory, and has no start-empty action. Submitting reveals all required errors; reset hides them again. Separate edit
fixtures retain preselection and delayed-inventory coverage. All owned text inputs and selects use actual Clarity
directives; debug controls/state are collapsed outside the three-field form. Field borders are removed. Horizontal and
vertical screenshots and browser geometry checks verify aligned label/control/feedback columns, no owner or pending
submit-value replacement, and stacked reflow without page overflow at 390 CSS pixels. The installed ClrLayout directive
reads only during initialization, so the proof uses ClrForm's public LayoutService for live switching without rebuilding
the form. Filter controls have their own vertical Clarity layout scope. These are basic layout proofs; the remaining
full theme, zoom, RTL, localization and installed-component gates still apply.

The sizing proof additionally checks five-item natural height with no filler, stable one/zero-result filtering, a
large-inventory ceiling, and a small paginated inventory with no gap before the footer. A two-item empty-filter test
records ResizeObserver samples to reject transient growth from the empty-state placeholder. Filtered height is reserved
in the render pass; natural-height rebasing is measured from public Clarity elements and row queries. Source inventory
fixtures are distinct from filters. The visible JSON now uses viewValue and omits emission counters; only automated
proof URLs enable an out-of-band event-count probe. No new public size-policy API is claimed by these results.

Portal ownership is checked after Angular rendering when a dialog receives focus before Clarity assigns its ARIA ID.
Ordinary field departures do not wait for another render. The proof uses an ARIA-labelled group and the real grid name;
its earlier native fieldset wrapper produced a blank flex grid after a dynamic error was inserted in Chromium. These
implementation findings remain constraints to verify in the eventual Clarity form-container integration.

Re-run the technical proof from the repository root with node tmp/datagrid-selection-proof/run.mjs. This standalone
scratch runner uses existing installed dependencies; it is not an inferred project target or a fresh packed consumer.
The attempted Nx exec dispatch did not provide a reliable scratch-run entry, so the proof uses the direct Node entry.

Remaining gates: production source/exports and regression suite, generic key/value declarations and negative type cases,
full field layout/theme/zoom/RTL and localization/demo delivery, true remote races and lifecycle budgets, installed
tarball consumers in supported render modes, full repository checks, manual language/assistive-technology acceptance, CI
and release. SSR/hydration is not established. No production delivery, merge or publication is claimed.

## Localized column and filter contract

Use native Clarity filter/sort integration. The shared selection component does not inspect cells, infer translation
keys/pipes or introduce a translation engine. It must preserve the native grid's filters and query while reconciling
keys and handling form state.

| Data/presentation                | Native integration                                                                           |
| -------------------------------- | -------------------------------------------------------------------------------------------- |
| Already localized service text   | A native field column/filter uses that supplied text directly.                               |
| Service-returned translation key | Render its translation and provide a native filter/comparator resolving the same text.       |
| Enum-to-key mapping              | Map then translate in the cell and matcher, with the same fallback/parameters.               |
| Cell with translation pipe       | A pipe changes display, not native raw-field matching; supply matching semantics explicitly. |
| Existing native string filter    | Use clr-dg-string-filter with clrDgStringFilter and ClrDatagridStringFilterInterface<T>.     |
| Existing native custom filter/UI | Use clr-dg-filter with clrDgFilter and an application-owned reusable filter component.       |

Do not leave clrDgField="statusKey" as the only filtering behavior when the user sees a translated phrase. The standard
raw-field filter cannot infer that translation. A native string matcher has the shape accepts(item, search); resolve
translated text inside that matcher or prepare translated view data. Native custom filters expose changes so their
application adapter can notify Clarity when the query or resolved text changes. Preserve search text and sorting when
native filter instances are replaced; merely replacing a matcher can otherwise drop native filter state.

### Runtime and locale acceptance

- Match the same resolved text shown by the cell, including interpolation and missing-key fallback. Do not add raw-key
  matching unless the application intentionally exposes that behavior.
- Localize headers, row names, filter search names/placeholders, choices, empty/clear messages and announcements. Native
  controls use the supported Clarity common-string integration; application text stays caller-localized.
- React to locale and dictionary changes through supported application translation/filter events. The library must not
  guess when a translator changed. Already-localized data must be refreshed by its owner. Dispose adapter subscriptions.
- Reapply matching/sorting while preserving query text, direction, keys and pending blur/submit edits. Pagination may
  clamp only when the actual filtered result requires it. Locale changes emit no form change/touch.
- Use locale-appropriate text comparison. Numeric filters retain numeric meaning; custom dates/enums/business ordering
  stay explicit. The status-choice example filters stable enum values while translating its visible choices.
- Test service-localized data, raw keys, enum mappings, parameterized/missing values, translated custom cells, native
  string filters and custom UI, with active queries and offscreen selection during runtime language changes.

No column text resolver, column schema, template override directive or new generic translation adapter is proposed by
this contract. Production native filter registration, language switching and independent language acceptance remain
separate from source compilation.

## Why a wrapper forwards change and touch

**October 29 optional wrapper proposal:** the library performs this forwarding. The component itself is already the CVA
for direct native-grid usage; no wrapper helper is required there. Business developers no longer implement the CVA
methods or bind validationControl/valueChange/blurred in a reusable picker. The
[complete example](datagrid-selection-code-examples.md#with-a-picker-component) composes
DatagridSelectionAccessorDirective through hostDirectives and adds cllDatagridSelectionBinding to the inner field. The
parent still writes app-organization-picker with formControlName or formControl.

```mermaid
flowchart LR
  P[Original parent FormControl] --> Accessor[Library accessor on business picker host]
  Accessor <-->|Library binding directive| I[Inner selection field]
  Business[Business component] -->|Items, columns and presentation| I
```

There is one original form control and one registered outer accessor. The inner field has no direct form binding. The
adapter preserves Angular's change/blur/submit buffering, disabled state, validators and submitted/reset presentation.
Owner writes and resets update the view without calling user-change/touch callbacks. Accepted inner edits call Angular's
registered change callback; leaving the whole composite calls its registered touch callback. Internal focus movement
between cells, footer, label help and owned filter popups does not count as departure.

Do not implement this by mirroring the parent value into an inner FormControl or binding the original control a second
time. Do not reread committed control.value during validation updates to overwrite an intentionally pending edit. The
adapter/binding must resolve the true NgControl lifecycle-safely, observe form metadata, detach old references and
subscriptions, and reject missing/multiple inner fields or conflicting form/value bindings. Registering another custom
accessor on the picker host is an error.

The previous manual CVA example explained Angular's protocol but exposed infrastructure work that belongs in the
library. Its callbacks and validationControl route are now lower-level implementation/legacy-integration details, not
the recommended application picker recipe. This is a proposed public API refinement with strict consumer syntax proof;
runtime and public packaging acceptance remain pending. See the
[directive composition API](https://angular.dev/guide/directives/directive-composition-api) and
[ControlValueAccessor protocol](https://angular.dev/api/forms/ControlValueAccessor).
