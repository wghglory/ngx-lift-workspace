# Datagrid selection: complete consumer code

Status: **native grid composition approved; production exports implemented locally October 30, 2026**. Each grid owner
directly projects a Clarity label and grid and loads its data with queryResource. There is no gridTemplate, column
schema, cell/filter-template override API or custom label directive.

The selection/accessor/binding exports are available in this checkout and verified through installed Angular 21
consumers. npm publication is separate. See the [acceptance record](datagrid-selection-acceptance.md) for current
evidence and the [delivery plan](datagrid-selection-delivery-plan.md) for downstream scope. The examples below are
complete consumer recipes; the demo adds interaction switches and a translated-text status filter for acceptance
journeys.

| Need                                                                                     | Complete code                                                          |
| ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| No picker: ordinary multiple selection, direct label, model reset                        | [Simple multiple](#without-a-picker-simple-multiple-selection)         |
| No picker: scalar/null form value                                                        | [Simple single](#without-a-picker-single-selection)                    |
| No picker: label signpost, status filter/sort, pagination, toSignalForm and submit/reset | [Direct policy form](#without-a-picker-advanced-form-and-tosignalform) |
| Reusable business picker with no handwritten CVA                                         | [Picker and parent](#with-a-picker-component)                          |
| Template-driven single selection                                                         | [ngModel](#template-driven-single-selection)                           |
| Model-only reset versus complete form reset                                              | [Reset and direct form updates](#reset-and-direct-form-updates)        |

All examples use Organization {id, name, status}, a native organizationKey identity callback, and
organizationId/organizationIds. The service and query definition, HTTP/query providers and localized query-failure UI
are included below. The native identity callback defines the saved IDs, and native rows own selection labels; there is
no duplicate shell key/label configuration. Each example includes its imports, component class and HTML; shared data,
filter UI/model and all messages are defined at the end.

Every field directly contains a plain Clarity label and one native grid. There is no label input or generated label.
Optional cll-alert content belongs after the label and above the grid. Advanced examples project a signpost next to the
label. The library assigns the label ID and names the actual grid, so business components do not generate IDs or bind
aria-labelledby for this pattern.

## Data belongs to the native grid

Bind query data to the familiar native iterator:

```html
<clr-dg-row *clrDgItems="let item of organizationsQuery.value() ?? []" ...></clr-dg-row>
```

This is an orientation sketch; complete bindings appear below. The selection component has no items input. It reads the
projected grid's supplied items and native displayed scope instead of requiring another data binding. The normal local
query below returns the complete collection for its scope. In a server-paged grid, supplied items are only the loaded
page: missing rows are not deletion or invalid selection, and unrequested selected IDs remain unresolved/preserved.

Configure mode and identity on the native grid only: clrDgSelectionType="single" or "multi", and
[clrDgItemsIdentityFn]="organizationKey". The selection shell reads those native settings; it has no selectionMode,
itemKey or items input. Require a fixed selectable mode and stable string/finite-number identity. Never infer mode from
an empty/null initial form value, guess an id property, or persist default object identity.

trackBy is separate Angular row-view reuse. It may return a row index, object or synthetic view key; those are not
necessarily safe persisted selection IDs. Clarity exposes its identity function through items.identifyBy, while the
iterator's trackBy is a setter for its view differ. Read native identity, not private trackBy or template source. The
examples omit optional trackBy entirely and define only the native identity function.

The installed ClrDatagrid exposes items.all, items.displayed, items.allChanges and items.change through its exported
class. The shell reads/subscribes through that object; it does not deep-import the unexported Items provider, read
private rawItems, or reconstruct data from rendered DOM. Snapshot after native processing; allChanges can arrive before
filtering/paging has finished. Subscribe/clean up when the projected grid changes. Only the supplied snapshot can
reconcile newly loaded rows; use the native displayed scope for selection actions.

The shell observes native configuration and owns the selected-row synchronization, selection preservation,
custom-select-all subscription, header locking and change detection internally. Consumer markup needs no #selection
reference, selectedItems() bridge or manual native selection event writer. Read native grid.rows, each row.item and
native selection events internally. There is no row marker directive or extra directive import on consumer rows. Keep
event/owner-write provenance, hydration/no-echo and pending edits correct; moving these bindings into the library is an
implementation obligation, not just a cosmetic markup edit.

The examples keep the form/grid mounted during loading/errors and show translated initial/refresh failure and Retry.
Pass loading only to clrDgLoading. The shell must read it and block row/keyboard/header/Clear edits while loading,
without calling FormControl.disable() or changing validity/serialization. Native loading alone paints an overlay; it
does not disable a focused checkbox or prevent keyboard selection. For persistent form disabling, use Angular's
control.disable(). Readonly remains a separate optional non-editable/browsable state. There is no interactionDisabled
input.

Native mode/identity and Angular CVA are runtime boundaries. Check scalar/null versus key-array shape, primitive finite
keys and duplicates at runtime. Native clrDgItems still gives the cell its typed row context. Do not claim shell-level
key/mode generic inference from the owning FormControl or the native identity function's broad public return type.

Without a picker, the page owns queryResource. With a business picker, the picker owns its organization query, loading,
request failure and Retry UI. The parent only binds its form value and validation message. The shared service and query
factory retain HTTP/cache identity; do not duplicate that query in the parent. A scoped picker may accept a business
scope input and use it in the query key. Generic selection never fetches organizations.

## Without a picker: simple multiple selection

Use the selection component itself as the CVA. The caller writes ordinary native Clarity columns/cells and sorting/
filtering. No business picker or picker binding directive is needed. This example has no form submission directive;
form.reset() is enough to restore the model and pristine/untouched state.

### simple-multiple.component.ts

```typescript
import {OrganizationService, organizationListQuery} from './organization.service';
import {queryResource} from 'ngx-lift';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {AlertComponent, DatagridSelectionComponent, TranslatePipe} from 'clr-lift';
import {type Organization} from './organization-example.data';

@Component({
  selector: 'app-simple-organization-grid',
  imports: [AlertComponent, ClarityModule, ReactiveFormsModule, TranslatePipe, DatagridSelectionComponent],
  templateUrl: './simple-multiple.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleOrganizationGridComponent {
  private readonly organizationService = inject(OrganizationService);
  readonly organizationsQuery = queryResource(() => organizationListQuery(this.organizationService, 'scope-1'));
  readonly form = new FormGroup({
    organizationIds: new FormControl<string[]>([], {nonNullable: true}),
  });
  readonly organizationKey = (item: Organization) => item.id;
  reset(): void {
    this.form.reset({organizationIds: []});
  }
}
```

### simple-multiple.component.html

```html
<cll-datagrid-selection [formControl]="form.controls.organizationIds">
  <label class="clr-control-label">{{ 'organizationExample.organizations' | translate }}</label>
  @if (organizationsQuery.error()) {
  <cll-alert>
    {{ (organizationsQuery.isRefreshError() ? 'organizationExample.refreshError' : 'organizationExample.loadError') |
    translate }}
    <button type="button" class="btn btn-link" (click)="organizationsQuery.reload()">
      {{ 'organizationExample.retry' | translate }}
    </button>
  </cll-alert>
  }
  <clr-datagrid
    clrDgSelectionType="multi"
    [clrDgLoading]="organizationsQuery.isLoading()"
    [clrDgItemsIdentityFn]="organizationKey"
  >
    <clr-dg-column clrDgField="name">{{ 'organizationExample.name' | translate }}</clr-dg-column>
    <clr-dg-row
      *clrDgItems="let item of organizationsQuery.value() ?? []"
      [clrDgItem]="item"
      [clrDgRowSelectionLabel]="'organizationExample.selectRow' | translate: item.name"
    >
      <clr-dg-cell>{{ item.name }}</clr-dg-cell>
    </clr-dg-row>
  </clr-datagrid>
</cll-datagrid-selection>
<button type="button" class="btn btn-secondary" (click)="reset()">{{ 'organizationExample.reset' | translate }}</button>
```

## Without a picker: single selection

The same projected grid works with a scalar/null FormControl. Native selected rows remain an array for Clarity's
selection API; the shell reads single mode and converts to/from the scalar key. There is no implicit first-row
selection. The component renders its own Clear button above the grid, so this consumer template does not declare it.
Clear and the parent-owned Reset use the standard secondary button style. Clearing reports null and Angular owns
required validation when required is present; resetting restores the form defaults and state.

### simple-single.component.ts

```typescript
import {OrganizationService, organizationListQuery} from './organization.service';
import {queryResource} from 'ngx-lift';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {AlertComponent, DatagridSelectionComponent, TranslatePipe} from 'clr-lift';
import {type Organization} from './organization-example.data';

@Component({
  selector: 'app-single-organization-grid',
  imports: [AlertComponent, ClarityModule, ReactiveFormsModule, TranslatePipe, DatagridSelectionComponent],
  templateUrl: './simple-single.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingleOrganizationGridComponent {
  private readonly organizationService = inject(OrganizationService);
  readonly organizationsQuery = queryResource(() => organizationListQuery(this.organizationService, 'scope-1'));
  readonly organizationId = new FormControl<string | null>(null);
  readonly organizationKey = (item: Organization) => item.id;
}
```

### simple-single.component.html

```html
<cll-datagrid-selection [formControl]="organizationId">
  <label class="clr-control-label">{{ 'organizationExample.organization' | translate }}</label>
  @if (organizationsQuery.error()) {
  <cll-alert>
    {{ (organizationsQuery.isRefreshError() ? 'organizationExample.refreshError' : 'organizationExample.loadError') |
    translate }}
    <button type="button" class="btn btn-link" (click)="organizationsQuery.reload()">
      {{ 'organizationExample.retry' | translate }}
    </button>
  </cll-alert>
  }
  <clr-datagrid
    clrDgSelectionType="single"
    [clrDgLoading]="organizationsQuery.isLoading()"
    [clrDgItemsIdentityFn]="organizationKey"
  >
    <clr-dg-column clrDgField="name">{{ 'organizationExample.name' | translate }}</clr-dg-column>
    <clr-dg-row
      *clrDgItems="let item of organizationsQuery.value() ?? []"
      [clrDgItem]="item"
      [clrDgRowSelectionLabel]="'organizationExample.selectRow' | translate: item.name"
    >
      <clr-dg-cell>{{ item.name }}</clr-dg-cell>
    </clr-dg-row>
  </clr-datagrid>
</cll-datagrid-selection>
```

## Without a picker: advanced form and toSignalForm

This page owns its FormGroup and writes the native grid inline. It adds a plain projected label with an adjacent Clarity
signpost, translated status badge, custom business ordering, a reusable status-choice filter and native pagination.
There is no explicit ng-template in this example.

toSignalForm observes the same FormGroup; formControlName still owns the selection field. The payload in the preview
follows the committed form value. This validation example uses default change updates, so its summary and Remove actions
stay current with each selection. The reusable-picker example separately demonstrates updateOn: 'blur'. The facade
supplies reactive validity/pending and sanitized submitValue signals. includeDisabled: false uses Angular form.value,
and omitIf explicitly excludes disabled fields even when the whole group is disabled. The preview reads sf.submitValue()
directly. A valid submit emits a copied payload through the ordinary save output for the containing application to
persist; no submittedValue signal duplicates the form. sf.submitValue() describes the current sanitized value, not
submission history. Copy values when handing them to an asynchronous operation.

The original IDs are known when the nonNullable control is constructed. The ordinary reset button calls
formView.resetForm() to restore those defaults and clear submitted state. It avoids the native browser reset action,
which independently clears Clarity pagination and selection inputs. For an edit baseline loaded later, pass the explicit
baseline to resetForm(value).

The saved-selection example includes a complete-inventory membership validator and a selected-key summary. Missing keys
stay in the form and count toward the maximum until the user removes them. A successful complete inventory confirms
unavailability; a loading or failed request is unverified and blocks submission without declaring keys invalid.
Revalidation updates the existing owner without changing saved keys or pristine/touched state. A server-paged picker
must resolve keys separately instead of treating its current page as a complete inventory.

### data-service-policy-form.component.ts

```typescript
import {JsonPipe} from '@angular/common';
import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ClarityModule, ClrDatagrid} from '@clr/angular';
import {AlertComponent, DatagridSelectionComponent, TranslatePipe, TranslationService} from 'clr-lift';
import {queryResource, toSignalForm} from 'ngx-lift';
import {STATUS_KEYS, type Organization} from './organization-example.data';
import {OrganizationService, organizationListQuery} from './organization.service';

@Component({
  selector: 'app-data-service-policy-form',
  imports: [AlertComponent, ClarityModule, ReactiveFormsModule, JsonPipe, TranslatePipe, DatagridSelectionComponent],
  templateUrl: './data-service-policy-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataServicePolicyFormComponent {
  private readonly translationService = inject(TranslationService);
  private readonly organizationService = inject(OrganizationService);
  private readonly grid = viewChild<ClrDatagrid<Organization>>(ClrDatagrid);

  private readonly originalOrganizationIds = ['org-2'];
  readonly organizationsQuery = queryResource(() => organizationListQuery(this.organizationService, 'scope-1'));

  // Only this endpoint's successful complete inventory can establish that a saved key is unavailable.
  readonly verifiedOrganizations = computed(() =>
    this.organizationsQuery.status() === 'resolved' ? this.organizationsQuery.value() : undefined,
  );
  readonly maximumOrganizations = 3;

  readonly form = new FormGroup({
    organizationIds: new FormControl<string[]>([...this.originalOrganizationIds], {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(this.maximumOrganizations),
        (control) => {
          const missing = this.unavailableKeys(control.value);
          return missing.length ? {unavailableOrganizations: missing} : null;
        },
      ],
    }),
  });
  readonly sf = toSignalForm(this.form, {
    includeDisabled: false,
    // Angular includes children in form.value when the entire group is disabled.
    omitIf: (_value, key) => this.form.get(key)?.disabled ?? false,
  });

  readonly selectedOrganizations = computed(() => {
    const inventory = new Map((this.organizationsQuery.value() ?? []).map((item) => [item.id, item]));
    const unavailable = new Set(this.unavailableKeys(this.sf.fields.organizationIds.value()));
    return this.sf.fields.organizationIds.value().map((id) => ({
      id,
      name: inventory.get(id)?.name,
      unavailable: unavailable.has(id),
    }));
  });
  readonly hasUnavailableSelection = computed(() => this.selectedOrganizations().some((item) => item.unavailable));

  readonly readonly = signal(false);
  readonly layout = signal<'horizontal' | 'vertical'>('vertical');
  readonly availability = (item: Organization) => ({
    disabled: item.status === 'maintenance',
    disabledReason:
      item.status === 'maintenance' ? this.translationService.translate('organizationExample.maintenance') : undefined,
  });

  readonly selectionError = computed(() => {
    const errors = this.sf.fields.organizationIds.errors();
    if (!errors) return '';
    if (errors['required']) return this.translationService.translate('organizationExample.required');
    if (errors['maxlength']) return this.translationService.translate('organizationExample.maxOrganizations');
    if (errors['unavailableOrganizations']) return this.translationService.translate('selectionDemo.unavailableError');
    return this.translationService.translate('organizationExample.invalidSelection');
  });

  readonly statusKeys = STATUS_KEYS;
  readonly statusComparator = {
    compare: (a: Organization, b: Organization) =>
      new Intl.Collator(this.translationService.locale()).compare(this.statusText(a), this.statusText(b)),
  };
  readonly statusTextFilter = {
    accepts: (item: Organization, search: string) =>
      this.statusText(item)
        .toLocaleLowerCase(this.translationService.locale())
        .includes(search.toLocaleLowerCase(this.translationService.locale())),
  };
  readonly organizationKey = (item: Organization) => item.id;
  readonly save = output<{organizationIds?: string[]}>();

  constructor() {
    effect(() => {
      this.verifiedOrganizations();
      // Query verification changes validity, not the user's selected value or interaction state.
      untracked(() => this.form.controls.organizationIds.updateValueAndValidity());
    });
    afterRenderEffect(() => {
      const grid = this.grid();
      // Track both language and dictionary changes, keeping the native active query and sort state.
      this.translationService.locale();
      this.translationService.translate(STATUS_KEYS.ready);
      this.translationService.translate(STATUS_KEYS.maintenance);
      untracked(() => grid?.items.refresh());
    });
  }

  toggleDisabled(): void {
    const control = this.form.controls.organizationIds;
    if (control.disabled) control.enable();
    else control.disable();
  }
  loadSaved(): void {
    // Restore persisted keys, including one absent from the current inventory; this does not change the reset baseline.
    this.form.controls.organizationIds.setValue(['org-2', 'unresolved']);
  }

  selectionLocked(): boolean {
    return this.readonly() || this.form.controls.organizationIds.disabled || this.organizationsQuery.isLoading();
  }

  removeSelection(id: string): void {
    if (this.selectionLocked()) return;
    const control = this.form.controls.organizationIds;
    control.setValue(control.value.filter((key) => key !== id));
    control.markAsDirty();
    control.markAsTouched();
    this.grid()?.datagridTable.nativeElement.focus();
  }

  retryVerification(): void {
    // The warning disappears during verification; keep keyboard focus on a stable element.
    this.grid()?.datagridTable.nativeElement.focus();
    this.organizationsQuery.reload();
  }

  submit(): void {
    if (this.form.controls.organizationIds.enabled && !this.verifiedOrganizations()) return;
    if (this.sf.invalid() || this.sf.pending()) return;
    const payload = this.sf.submitValue();
    this.save.emit(payload.organizationIds === undefined ? {} : {organizationIds: [...payload.organizationIds]});
  }

  private unavailableKeys(keys: readonly string[]): string[] {
    const inventory = this.verifiedOrganizations();
    if (!inventory) return [];
    const available = new Set(inventory.map((item) => item.id));
    return keys.filter((key) => !available.has(key));
  }

  private statusText(item: Organization): string {
    return this.translationService.translate(STATUS_KEYS[item.status]);
  }
}
```

### data-service-policy-form.component.html

```html
<form #formView="ngForm" clrForm clrLayout="vertical" [formGroup]="form" (ngSubmit)="submit()">
  <section [attr.aria-label]="'selectionDemo.selectedTitle' | translate" cds-layout="vertical gap:sm">
    <p role="status" aria-atomic="true">
      {{ 'selectionDemo.selectedCount' | translate: selectedOrganizations().length : maximumOrganizations }}
    </p>
    <ul cds-layout="vertical gap:xs">
      @for (selection of selectedOrganizations(); track selection.id) {
      <li>
        {{ selection.name || ((selection.unavailable ? 'selectionDemo.unavailableName' : 'selectionDemo.unverifiedName')
        | translate) }} ({{ selection.id }})
        <button
          type="button"
          class="btn btn-link btn-sm"
          [disabled]="selectionLocked()"
          [attr.aria-label]="'selectionDemo.removeKey' | translate: selection.id"
          (click)="removeSelection(selection.id)"
        >
          {{ 'selectionDemo.remove' | translate }}
        </button>
      </li>
      }
    </ul>
    @if (!verifiedOrganizations() && selectedOrganizations().length) {
    <p role="status">{{ 'selectionDemo.verificationHelp' | translate }}</p>
    } @if (hasUnavailableSelection()) {
    <clr-alert data-testid="unavailable-selection" clrAlertType="warning" [clrAlertClosable]="false">
      <clr-alert-item>
        <span class="alert-text" role="alert">{{ 'selectionDemo.unavailableHelp' | translate }}</span>
        <div class="alert-actions">
          <button type="button" class="btn btn-sm alert-action" (click)="retryVerification()">
            {{ 'organizationExample.retry' | translate }}
          </button>
        </div>
      </clr-alert-item>
    </clr-alert>
    }
  </section>
  <cll-datagrid-selection
    formControlName="organizationIds"
    required
    [helper]="'organizationExample.help' | translate"
    [error]="selectionError()"
    [readonly]="readonly()"
    [layout]="layout()"
    [itemAvailability]="availability"
  >
    <label class="clr-control-label">{{ 'organizationExample.organizations' | translate }}</label>
    <clr-signpost [clrSignpostTriggerAriaLabel]="'organizationExample.about' | translate">
      <clr-signpost-content *clrIfOpen>{{ 'organizationExample.help' | translate }}</clr-signpost-content>
    </clr-signpost>
    @if (organizationsQuery.error()) {
    <cll-alert>
      {{ (organizationsQuery.isRefreshError() ? 'organizationExample.refreshError' : 'organizationExample.loadError') |
      translate }}
      <button type="button" class="btn btn-link" (click)="organizationsQuery.reload()">
        {{ 'organizationExample.retry' | translate }}
      </button>
    </cll-alert>
    }
    <clr-datagrid
      clrDgSelectionType="multi"
      [clrDgLoading]="organizationsQuery.isLoading()"
      [clrDgItemsIdentityFn]="organizationKey"
    >
      <clr-dg-column clrDgField="name">{{ 'organizationExample.name' | translate }}</clr-dg-column>
      <clr-dg-column clrDgField="status" [clrDgSortBy]="statusComparator">
        {{ 'organizationExample.status' | translate }}
        <clr-dg-string-filter [clrDgStringFilter]="statusTextFilter" />
      </clr-dg-column>
      <clr-dg-row
        *clrDgItems="let item of organizationsQuery.value() ?? []"
        [clrDgItem]="item"
        [clrDgRowSelectionLabel]="'organizationExample.selectRow' | translate: item.name"
      >
        <clr-dg-cell>{{ item.name }}</clr-dg-cell>
        <clr-dg-cell>
          <span
            class="label"
            [class.label-success]="item.status === 'ready'"
            [class.label-warning]="item.status === 'maintenance'"
          >
            {{ statusKeys[item.status] | translate }}
          </span>
        </clr-dg-cell>
      </clr-dg-row>
      <clr-dg-footer><clr-dg-pagination [clrDgPageSize]="10" /></clr-dg-footer>
    </clr-datagrid>
  </cll-datagrid-selection>
  <div cds-layout="horizontal gap:md wrap:wrap">
    <label
      ><input
        type="checkbox"
        [checked]="layout() === 'horizontal'"
        (change)="layout.set(layout() === 'horizontal' ? 'vertical' : 'horizontal')"
      />
      {{ 'selectionDemo.horizontal' | translate }}</label
    >
    <label
      ><input type="checkbox" [checked]="readonly()" (change)="readonly.set(!readonly())" /> {{ 'selectionDemo.readonly'
      | translate }}</label
    >
    <label
      ><input type="checkbox" [checked]="form.controls.organizationIds.disabled" (change)="toggleDisabled()" /> {{
      'selectionDemo.disabled' | translate }}</label
    >
    <button type="button" class="btn btn-sm" (click)="organizationsQuery.reload()">
      {{ 'common.refresh' | translate }}
    </button>
    <button type="button" class="btn btn-sm" (click)="loadSaved()">{{ 'selectionDemo.loadSaved' | translate }}</button>
  </div>
  <button
    type="submit"
    class="btn btn-primary"
    [disabled]="form.controls.organizationIds.enabled && !verifiedOrganizations()"
  >
    {{ 'organizationExample.submit' | translate }}
  </button>
  <button type="button" class="btn btn-secondary" (click)="formView.resetForm()">
    {{ 'organizationExample.reset' | translate }}
  </button>
</form>
<pre>{{ sf.submitValue() | json }}</pre>
```

## With a picker component

A reusable app-organization-picker centralizes the organization query, loading/failure/retry UI, business grid markup
and filters. Its parent owns FormGroup, validators, saved values and submission, and does not load the picker inventory.
The picker should not implement writeValue/registerOnChange/registerOnTouched.

Retain the two explicit composition declarations from the previous proposal:

- hostDirectives: [DatagridSelectionAccessorDirective] gives the business picker host its one library-owned CVA.
- cllDatagridSelectionBinding marks the inner field to connect to that accessor.

The name Binding is reasonable here: it binds the inner selection to the form accessor on its business-picker host. The
longer prefix identifies the feature and avoids a generic forms API. Keep this explicit connection instead of silently
attaching every nested selection field, passing a whole FormControl through business inputs, or mirroring one. There is
no additional callback/state plumbing for business developers. The helper exports have real-owner and installed-package
evidence in the [acceptance record](datagrid-selection-acceptance.md).

Direct inline usage needs neither helper. Both examples use the same native grid composition. The component itself is a
CVA; these helpers solve the additional wrapper-host boundary. Angular does not use a child component's accessor as the
accessor for its parent business component automatically. Reject multiple/missing connected inner fields, conflicting
inner form/value bindings, and duplicate accessors. Preserve original-owner validation, disabled, updateOn, submit/reset
and lifecycle cleanup; the binding must not create another form control.

### organization-picker.component.ts

```typescript
import {OrganizationService, organizationListQuery} from './organization.service';
import {queryResource} from 'ngx-lift';
import {booleanAttribute, ChangeDetectionStrategy, Component, inject, input, OnDestroy} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {
  AlertComponent,
  DatagridSelectionComponent,
  DatagridSelectionAccessorDirective,
  DatagridSelectionBindingDirective,
  TranslatePipe,
} from 'clr-lift';
import {STATUS_KEYS, STATUS_ORDER, type Organization} from './organization-example.data';
import {StatusFilter} from './status.filter';
import {OrganizationStatusFilterComponent} from './organization-status-filter.component';

@Component({
  selector: 'app-organization-picker',
  imports: [
    AlertComponent,
    ClarityModule,
    DatagridSelectionComponent,
    DatagridSelectionBindingDirective,
    TranslatePipe,
    OrganizationStatusFilterComponent,
  ],
  hostDirectives: [DatagridSelectionAccessorDirective],
  templateUrl: './organization-picker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationPickerComponent implements OnDestroy {
  private readonly organizationService = inject(OrganizationService);
  readonly organizationsQuery = queryResource(() => organizationListQuery(this.organizationService, 'scope-1'));
  readonly readonly = input(false, {transform: booleanAttribute});
  readonly required = input(false, {transform: booleanAttribute});
  readonly error = input('');
  readonly statusKeys = STATUS_KEYS;
  readonly statusComparator = {
    compare: (a: Organization, b: Organization) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status],
  };
  readonly statusFilter = new StatusFilter();
  readonly organizationKey = (item: Organization) => item.id;
  ngOnDestroy(): void {
    this.statusFilter.destroy();
  }
}
```

### organization-picker.component.html

```html
<cll-datagrid-selection
  cllDatagridSelectionBinding
  [readonly]="readonly()"
  [required]="required()"
  [helper]="'organizationExample.help' | translate"
  [error]="error() || ('organizationExample.invalidSelection' | translate)"
>
  <label class="clr-control-label">{{ 'organizationExample.organizations' | translate }}</label>
  <clr-signpost [clrSignpostTriggerAriaLabel]="'organizationExample.about' | translate">
    <clr-signpost-content *clrIfOpen>{{ 'organizationExample.help' | translate }}</clr-signpost-content>
  </clr-signpost>
  @if (organizationsQuery.error()) {
  <cll-alert>
    {{ (organizationsQuery.isRefreshError() ? 'organizationExample.refreshError' : 'organizationExample.loadError') |
    translate }}
    <button type="button" class="btn btn-link" (click)="organizationsQuery.reload()">
      {{ 'organizationExample.retry' | translate }}
    </button>
  </cll-alert>
  }
  <clr-datagrid
    clrDgSelectionType="multi"
    [clrDgLoading]="organizationsQuery.isLoading()"
    [clrDgItemsIdentityFn]="organizationKey"
  >
    <clr-dg-column clrDgField="name">{{ 'organizationExample.name' | translate }}</clr-dg-column>
    <clr-dg-column [clrDgSortBy]="statusComparator">
      {{ 'organizationExample.status' | translate }}
      <clr-dg-filter [clrDgFilter]="statusFilter">
        <app-organization-status-filter [filter]="statusFilter" />
      </clr-dg-filter>
    </clr-dg-column>
    <clr-dg-row
      *clrDgItems="let item of organizationsQuery.value() ?? []"
      [clrDgItem]="item"
      [clrDgRowSelectionLabel]="'organizationExample.selectRow' | translate: item.name"
    >
      <clr-dg-cell>{{ item.name }}</clr-dg-cell>
      <clr-dg-cell>
        <span
          class="label"
          [class.label-success]="item.status === 'ready'"
          [class.label-warning]="item.status === 'maintenance'"
        >
          {{ statusKeys[item.status] | translate }}
        </span>
      </clr-dg-cell>
    </clr-dg-row>
    <clr-dg-footer><clr-dg-pagination [clrDgPageSize]="10" /></clr-dg-footer>
  </clr-datagrid>
</cll-datagrid-selection>
```

### picker-parent.component.ts

```typescript
import {JsonPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, output, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {TranslatePipe, TranslationService} from 'clr-lift';
import {toSignalForm} from 'ngx-lift';

import {OrganizationPickerComponent} from './organization-picker.component';

@Component({
  selector: 'app-policy-form',
  imports: [ClarityModule, ReactiveFormsModule, JsonPipe, TranslatePipe, OrganizationPickerComponent],
  templateUrl: './picker-parent.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PolicyFormComponent {
  private readonly translationService = inject(TranslationService);

  private readonly originalOrganizationIds = ['org-1'];
  readonly form = new FormGroup({
    organizationIds: new FormControl<string[]>([...this.originalOrganizationIds], {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(3)],
      updateOn: 'blur',
    }),
  });
  readonly sf = toSignalForm(this.form, {
    includeDisabled: false,
    // Angular includes children in form.value when the entire group is disabled.
    omitIf: (_value, key) => this.form.get(key)?.disabled ?? false,
  });

  readonly selectionError = computed(() => {
    const errors = this.sf.fields.organizationIds.errors();
    if (!errors) return '';
    if (errors['required']) return this.translationService.translate('organizationExample.required');
    if (errors['maxlength']) return this.translationService.translate('organizationExample.maxOrganizations');
    return this.translationService.translate('organizationExample.invalidSelection');
  });
  readonly save = output<{organizationIds?: string[]}>();

  submit(): void {
    if (this.sf.invalid() || this.sf.pending()) return;
    const payload = this.sf.submitValue();
    this.save.emit(payload.organizationIds === undefined ? {} : {organizationIds: [...payload.organizationIds]});
  }
}
```

### picker-parent.component.html

```html
<form #formView="ngForm" clrForm clrLayout="vertical" [formGroup]="form" (ngSubmit)="submit()">
  <app-organization-picker [error]="selectionError()" formControlName="organizationIds" required />
  <button type="submit" class="btn btn-primary">{{ 'organizationExample.submit' | translate }}</button>
  <button type="button" class="btn btn-secondary" (click)="formView.resetForm()">
    {{ 'organizationExample.reset' | translate }}
  </button>
</form>
<pre>{{ sf.submitValue() | json }}</pre>
```

## Template-driven single selection

ngModel, name and required are normal Angular form bindings on the same selection component. Do not add a Reactive Forms
binding to this field. The status filter, when used by the other examples, owns a separate Reactive Forms control; it is
filter UI state, not another owner of organizationIds.

### template-driven.component.ts

```typescript
import {OrganizationService, organizationListQuery} from './organization.service';
import {queryResource} from 'ngx-lift';
import {ChangeDetectionStrategy, Component, inject, output} from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {AlertComponent, DatagridSelectionComponent, TranslatePipe} from 'clr-lift';
import {type Organization} from './organization-example.data';

@Component({
  selector: 'app-template-organization-form',
  imports: [AlertComponent, ClarityModule, FormsModule, TranslatePipe, DatagridSelectionComponent],
  templateUrl: './template-driven.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateOrganizationFormComponent {
  private readonly organizationService = inject(OrganizationService);
  readonly organizationsQuery = queryResource(() => organizationListQuery(this.organizationService, 'scope-1'));
  organizationId: string | null = null;
  readonly save = output<string | null>();
  readonly organizationKey = (item: Organization) => item.id;
  submit(form: NgForm): void {
    if (form.invalid || form.pending) return;
    this.save.emit(this.organizationId);
  }
  reset(form: NgForm): void {
    form.resetForm({organizationId: null});
  }
}
```

### template-driven.component.html

```html
<form clrForm clrLayout="vertical" #form="ngForm" (ngSubmit)="submit(form)">
  <cll-datagrid-selection
    name="organizationId"
    [(ngModel)]="organizationId"
    required
    [error]="'organizationExample.required' | translate"
  >
    <label class="clr-control-label">{{ 'organizationExample.organization' | translate }}</label>
    @if (organizationsQuery.error()) {
    <cll-alert>
      {{ (organizationsQuery.isRefreshError() ? 'organizationExample.refreshError' : 'organizationExample.loadError') |
      translate }}
      <button type="button" class="btn btn-link" (click)="organizationsQuery.reload()">
        {{ 'organizationExample.retry' | translate }}
      </button>
    </cll-alert>
    }
    <clr-datagrid
      clrDgSelectionType="single"
      [clrDgLoading]="organizationsQuery.isLoading()"
      [clrDgItemsIdentityFn]="organizationKey"
    >
      <clr-dg-column clrDgField="name">{{ 'organizationExample.name' | translate }}</clr-dg-column>
      <clr-dg-row
        *clrDgItems="let item of organizationsQuery.value() ?? []"
        [clrDgItem]="item"
        [clrDgRowSelectionLabel]="'organizationExample.selectRow' | translate: item.name"
      >
        <clr-dg-cell>{{ item.name }}</clr-dg-cell>
      </clr-dg-row>
    </clr-datagrid>
  </cll-datagrid-selection>
  <button type="submit" class="btn btn-primary">{{ 'organizationExample.submit' | translate }}</button>
  <button type="button" class="btn btn-secondary" (click)="reset(form)">
    {{ 'organizationExample.reset' | translate }}
  </button>
</form>
```

## Validation and error text

Keep required, helper and error. error is a localized message to present when the actual owning control is invalid and
touched or submitted; it does not implement a validator or mean required-only. The direct form and picker parent already
have ordinary Angular Validators.required and Validators.maxLength(3). Their selectionError computed reads
sf.fields.organizationIds.errors(), chooses the correct required/maximum message and provides a generic
invalid-selection fallback. The picker forwards that message without interpreting error keys.

A custom ValidatorFn/AsyncValidatorFn can be attached to the same original FormControl. Its custom error key can be
mapped in the same computed if a specific message is needed. No new error map, custom-validator input, template or
selection-owned validator registry is needed now. Keep domain/async validation on the parent and keep loading separate
from validation pending. A group-level error stays a group concern unless the application deliberately associates its
presentation with this field.

## Reset and direct form updates

You can update the form directly. Prefer setValue for a complete value, patchValue for a partial update, and reset to
restore explicit values and pristine/untouched model state. These owner writes must update the view without CVA echo
callbacks.

```typescript
this.form.patchValue({organizationIds: ['org-1']});
this.form.reset({organizationIds: ['org-1']});
```

| Operation                  | What it changes                                                                                                             |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| form.patchValue / setValue | Values and validity; does not automatically reset dirty/touched or submitted state.                                         |
| form.reset(value)          | Values/validity and pristine/untouched state; cancels buffered edits. Does not clear the form directive's submitted flag.   |
| Native type="reset" button | Also runs the browser reset action on native pagination and selection inputs. Avoid it for this composite grid.             |
| formView.resetForm(value)  | Resets the model to explicit values and clears submitted state. Useful when an edit baseline was loaded after construction. |
| sf.reset                   | Delegates to the existing model's reset; it does not reset FormGroupDirective.submitted.                                    |

The two complete Reactive Forms examples use an ordinary button and the existing form directive:

```html
<form #formView="ngForm" [formGroup]="form">
  <!-- The selection field and native grid go here. -->
  <button type="button" (click)="formView.resetForm()">Reset</button>
</form>
```

This restores the nonNullable control defaults and clears submitted state without the browser resetting native DOM
inputs behind Clarity's state. The current pagination input stays populated; selected rows match the form's keys.

Direct model reset is supported whenever code needs it:

```typescript
reset(): void {
  this.form.reset({organizationIds: [...this.originalOrganizationIds]});
}
```

This resets model values and pristine/untouched state. If the form was submitted, its directive still has
submitted=true; validation shown for invalid and touched **or submitted** may remain visible. This is ordinary Angular
behavior, not a selection-specific requirement. When a full programmatic restart must also clear submitted, or restore a
different baseline loaded after control construction, use the owning directive's resetForm(value). A template
#formView="ngForm" passed to that handler is one option; it is not mandatory for ordinary model updates. See
[FormGroup.reset](https://angular.dev/api/forms/FormGroup#reset) and
[FormGroupDirective.resetForm](https://angular.dev/api/forms/FormGroupDirective#resetForm).

The real [toSignalForm implementation](../../../libs/ngx-lift/src/lib/signals/to-signal-form.ts) is a facade over the
same Angular FormGroup, not native Angular Signal Forms and not another form owner. Its fields/value/reset APIs observe
or delegate to that existing model. There is no extra value binding on the selection component.

## Shared resources

These are every helper imported by the example hosts. Configure HTTP/query providers through appConfig in application
bootstrap. The service returns the complete scoped inventory for local grid processing; adapt its endpoint to the
application. Examples use a fixed scope. A scoped picker accepts scope from its parent and includes it in the query key;
the parent owns scope transitions and edit baselines.

appConfig registers these example messages once. Component templates use the translate pipe without registering messages
or injecting TranslationService just for startup. If normal application setup already loads these keys, omit
registerExampleMessages and its initializer. A translation pipe looks up loaded messages; it does not register a
dictionary. The advanced validation-message computed still uses TranslationService in TypeScript. All messages cover
supported locales; independent human language acceptance remains pending.

The direct form and picker parent expose an ordinary save output for the containing application's persistence handler.
It is a business submit event, not another selection value binding or stored form value. For example:

```html
<app-data-service-policy-form (save)="savePolicy($event)" />
```

This shows the integration boundary; savePolicy belongs to the containing application. The same applies to
app-policy-form. Use a real persistence operation there; do not mirror sf.submitValue() into another signal merely to
display it.

### app.config.ts

```typescript
import {provideHttpClient} from '@angular/common/http';
import {inject, provideAppInitializer, type ApplicationConfig} from '@angular/core';
import {TranslationService} from 'clr-lift';
import {provideQueryClient} from 'ngx-lift';
import {registerExampleMessages} from './organization-example.messages';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideQueryClient(),
    provideAppInitializer(() => registerExampleMessages(inject(TranslationService))),
  ],
};
```

### organization.service.ts

```typescript
import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import type {Observable} from 'rxjs';
import type {QueryDefinition} from 'ngx-lift';
import type {Organization} from './organization-example.data';

@Injectable({providedIn: 'root'})
export class OrganizationService {
  private readonly httpClient = inject(HttpClient);
  list(scope: string): Observable<Organization[]> {
    // This example endpoint returns the complete local-grid inventory for the scope.
    return this.httpClient.get<Organization[]>('/api/organizations', {params: {scope}});
  }
}

export function organizationListQuery(
  organizationService: OrganizationService,
  scope: string,
): QueryDefinition<Organization[]> {
  return {
    key: ['organizations', 'list', scope],
    staleTime: 60_000,
    loader: () => organizationService.list(scope),
  };
}
```

### organization-example.data.ts

```typescript
export type Status = 'ready' | 'maintenance';
export interface Organization {
  id: string;
  name: string;
  status: Status;
}
export const STATUS_KEYS: Record<Status, string> = {
  ready: 'organizationExample.ready',
  maintenance: 'organizationExample.maintenance',
};
export const STATUS_ORDER: Record<Status, number> = {ready: 0, maintenance: 1};
```

### status.filter.ts

```typescript
import {signal} from '@angular/core';
import type {ClrDatagridFilterInterface} from '@clr/angular';
import {Subject} from 'rxjs';
import type {Organization, Status} from './organization-example.data';

export type StatusChoice = 'all' | Status;
export class StatusFilter implements ClrDatagridFilterInterface<Organization> {
  readonly changes = new Subject<void>();
  readonly value = signal<StatusChoice>('all');
  isActive(): boolean {
    return this.value() !== 'all';
  }
  accepts(item: Organization): boolean {
    return this.value() === 'all' || item.status === this.value();
  }
  set(value: StatusChoice): void {
    if (value === this.value()) return;
    this.value.set(value);
    this.changes.next();
  }
  destroy(): void {
    this.changes.complete();
  }
}
```

### organization-status-filter.component.ts

```typescript
import {ChangeDetectionStrategy, Component, effect, input} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {TranslatePipe} from 'clr-lift';
import {STATUS_KEYS} from './organization-example.data';
import {StatusFilter, type StatusChoice} from './status.filter';
let nextFilterId = 0;

@Component({
  selector: 'app-organization-status-filter',
  imports: [ClarityModule, ReactiveFormsModule, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div clrForm clrLayout="vertical">
      <clr-select-container>
        <label [for]="filterId">{{ 'organizationExample.status' | translate }}</label>
        <select clrSelect [id]="filterId" [formControl]="choice">
          <option value="all">{{ 'organizationExample.allStatuses' | translate }}</option>
          <option value="ready">{{ statusKeys.ready | translate }}</option>
          <option value="maintenance">{{ statusKeys.maintenance | translate }}</option>
        </select>
      </clr-select-container>
    </div>
  `,
})
export class OrganizationStatusFilterComponent {
  readonly filter = input.required<StatusFilter>();
  readonly choice = new FormControl<StatusChoice>('all', {nonNullable: true});
  readonly filterId = `organization-status-filter-${nextFilterId++}`;
  readonly statusKeys = STATUS_KEYS;
  constructor() {
    // Reset/model changes update the select without echoing another filter-change event.
    effect(() => this.choice.setValue(this.filter().value(), {emitEvent: false}));
    this.choice.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => this.filter().set(value));
  }
}
```

The filter model owns stable enum state and survives popup recreation. Its component owns one local FormControl for the
select UI, synchronizes external reset without echo, and cleans up its subscription. Caller hosts complete the model's
Subject on destruction. No standalone ngModel is mixed into these Reactive Forms examples.

For already-localized service text, native field filtering works directly. For raw translation keys or enums shown via a
pipe, provide a native Clarity string/custom filter that resolves the same text, and a comparator when text ordering
should follow translations. Clarity cannot infer translation from the cell HTML. Locale changes must reapply matching/
sorting without losing the query, keys or pending edits. The library must not restore the removed columns/text-resolver
API to implement this. See the
[native localized-filter contract](datagrid-selection-reference.md#localized-column-and-filter-contract).

### Example messages

<details>
<summary>Full organization-example.messages.ts: all 11 locales</summary>

### organization-example.messages.ts

```typescript
import {TranslationService} from 'clr-lift';

// Independent language acceptance remains a separate gate.
export const EXAMPLE_MESSAGES: Record<string, Record<string, string>> = {
  en: {
    organization: 'Organization',
    organizations: 'Organizations',
    name: 'Name',
    status: 'Status',
    ready: 'Ready',
    maintenance: 'Maintenance',
    allStatuses: 'All statuses',
    reset: 'Reset',
    submit: 'Submit',
    required: 'Choose an organization.',
    rule: 'Choose one to three organizations.',
    help: 'Choose the organizations allowed to use this policy.',
    about: 'About organization assignments',
    selectRow: 'Select {0}',
    loadError: 'Organizations could not be loaded.',
    refreshError: 'Could not refresh organizations. Showing previously loaded data.',
    retry: 'Retry',
    maxOrganizations: 'Choose no more than three organizations.',
    invalidSelection: 'The organization selection is invalid.',
  },
  'zh-CN': {
    organization: '组织',
    organizations: '组织',
    name: '名称',
    status: '状态',
    ready: '就绪',
    maintenance: '维护中',
    allStatuses: '所有状态',
    reset: '重置',
    submit: '提交',
    required: '请选择组织。',
    rule: '请选择一至三个组织。',
    help: '选择允许使用此策略的组织。',
    about: '关于组织分配',
    selectRow: '选择 {0}',
    loadError: '无法加载组织。',
    refreshError: '无法刷新组织。当前显示上次加载的数据。',
    retry: '重试',
    maxOrganizations: '最多选择三个组织。',
    invalidSelection: '组织选择无效。',
  },
  'zh-TW': {
    organization: '組織',
    organizations: '組織',
    name: '名稱',
    status: '狀態',
    ready: '就緒',
    maintenance: '維護中',
    allStatuses: '所有狀態',
    reset: '重設',
    submit: '提交',
    required: '請選擇組織。',
    rule: '請選擇一至三個組織。',
    help: '選擇允許使用此原則的組織。',
    about: '關於組織指派',
    selectRow: '選擇 {0}',
    loadError: '無法載入組織。',
    refreshError: '無法重新整理組織。目前顯示上次載入的資料。',
    retry: '重試',
    maxOrganizations: '最多選擇三個組織。',
    invalidSelection: '組織選擇無效。',
  },
  de: {
    organization: 'Organisation',
    organizations: 'Organisationen',
    name: 'Name',
    status: 'Status',
    ready: 'Bereit',
    maintenance: 'Wartung',
    allStatuses: 'Alle Status',
    reset: 'Zurücksetzen',
    submit: 'Senden',
    required: 'Wählen Sie eine Organisation.',
    rule: 'Wählen Sie eine bis drei Organisationen.',
    help: 'Wählen Sie die Organisationen, die diese Richtlinie verwenden dürfen.',
    about: 'Informationen zu Organisationszuweisungen',
    selectRow: '{0} auswählen',
    loadError: 'Organisationen konnten nicht geladen werden.',
    refreshError: 'Organisationen konnten nicht aktualisiert werden. Die zuvor geladenen Daten werden angezeigt.',
    retry: 'Erneut versuchen',
    maxOrganizations: 'Wählen Sie höchstens drei Organisationen.',
    invalidSelection: 'Die Organisationsauswahl ist ungültig.',
  },
  es: {
    organization: 'Organización',
    organizations: 'Organizaciones',
    name: 'Nombre',
    status: 'Estado',
    ready: 'Listo',
    maintenance: 'Mantenimiento',
    allStatuses: 'Todos los estados',
    reset: 'Restablecer',
    submit: 'Enviar',
    required: 'Seleccione una organización.',
    rule: 'Seleccione de una a tres organizaciones.',
    help: 'Seleccione las organizaciones que pueden usar esta directiva.',
    about: 'Acerca de las asignaciones de organizaciones',
    selectRow: 'Seleccionar {0}',
    loadError: 'No se pudieron cargar las organizaciones.',
    refreshError: 'No se pudieron actualizar las organizaciones. Se muestran los datos cargados anteriormente.',
    retry: 'Reintentar',
    maxOrganizations: 'Seleccione como máximo tres organizaciones.',
    invalidSelection: 'La selección de organizaciones no es válida.',
  },
  fr: {
    organization: 'Organisation',
    organizations: 'Organisations',
    name: 'Nom',
    status: 'État',
    ready: 'Prêt',
    maintenance: 'Maintenance',
    allStatuses: 'Tous les états',
    reset: 'Réinitialiser',
    submit: 'Envoyer',
    required: 'Choisissez une organisation.',
    rule: 'Choisissez une à trois organisations.',
    help: 'Choisissez les organisations autorisées à utiliser cette stratégie.',
    about: 'À propos des affectations aux organisations',
    selectRow: 'Sélectionner {0}',
    loadError: 'Impossible de charger les organisations.',
    refreshError: 'Impossible d’actualiser les organisations. Les données précédemment chargées sont affichées.',
    retry: 'Réessayer',
    maxOrganizations: 'Choisissez au maximum trois organisations.',
    invalidSelection: 'La sélection d’organisations n’est pas valide.',
  },
  ja: {
    organization: '組織',
    organizations: '組織',
    name: '名前',
    status: '状態',
    ready: '準備完了',
    maintenance: 'メンテナンス中',
    allStatuses: 'すべての状態',
    reset: 'リセット',
    submit: '送信',
    required: '組織を選択してください。',
    rule: '組織を1つから3つ選択してください。',
    help: 'このポリシーを使用できる組織を選択してください。',
    about: '組織の割り当てについて',
    selectRow: '{0} を選択',
    loadError: '組織を読み込めませんでした。',
    refreshError: '組織を更新できませんでした。前回読み込んだデータを表示しています。',
    retry: '再試行',
    maxOrganizations: '組織は3つまで選択してください。',
    invalidSelection: '組織の選択が無効です。',
  },
  ko: {
    organization: '조직',
    organizations: '조직',
    name: '이름',
    status: '상태',
    ready: '준비됨',
    maintenance: '유지 보수 중',
    allStatuses: '모든 상태',
    reset: '재설정',
    submit: '제출',
    required: '조직을 선택하세요.',
    rule: '조직을 1개에서 3개까지 선택하세요.',
    help: '이 정책을 사용할 수 있는 조직을 선택하세요.',
    about: '조직 할당 정보',
    selectRow: '{0} 선택',
    loadError: '조직을 불러오지 못했습니다.',
    refreshError: '조직을 새로 고치지 못했습니다. 이전에 불러온 데이터를 표시합니다.',
    retry: '다시 시도',
    maxOrganizations: '조직을 최대 3개까지 선택하세요.',
    invalidSelection: '조직 선택이 올바르지 않습니다.',
  },
  nl: {
    organization: 'Organisatie',
    organizations: 'Organisaties',
    name: 'Naam',
    status: 'Status',
    ready: 'Gereed',
    maintenance: 'Onderhoud',
    allStatuses: 'Alle statussen',
    reset: 'Opnieuw instellen',
    submit: 'Verzenden',
    required: 'Selecteer een organisatie.',
    rule: 'Selecteer één tot drie organisaties.',
    help: 'Selecteer de organisaties die dit beleid mogen gebruiken.',
    about: 'Over organisatietoewijzingen',
    selectRow: '{0} selecteren',
    loadError: 'Organisaties konden niet worden geladen.',
    refreshError: 'Organisaties konden niet worden vernieuwd. De eerder geladen gegevens worden weergegeven.',
    retry: 'Opnieuw proberen',
    maxOrganizations: 'Selecteer maximaal drie organisaties.',
    invalidSelection: 'De organisatieselectie is ongeldig.',
  },
  'pt-BR': {
    organization: 'Organização',
    organizations: 'Organizações',
    name: 'Nome',
    status: 'Status',
    ready: 'Pronto',
    maintenance: 'Manutenção',
    allStatuses: 'Todos os status',
    reset: 'Redefinir',
    submit: 'Enviar',
    required: 'Selecione uma organização.',
    rule: 'Selecione de uma a três organizações.',
    help: 'Selecione as organizações que podem usar esta política.',
    about: 'Sobre as atribuições de organizações',
    selectRow: 'Selecionar {0}',
    loadError: 'Não foi possível carregar as organizações.',
    refreshError: 'Não foi possível atualizar as organizações. Os dados carregados anteriormente são exibidos.',
    retry: 'Tentar novamente',
    maxOrganizations: 'Selecione no máximo três organizações.',
    invalidSelection: 'A seleção de organizações é inválida.',
  },
  ru: {
    organization: 'Организация',
    organizations: 'Организации',
    name: 'Имя',
    status: 'Состояние',
    ready: 'Готово',
    maintenance: 'Обслуживание',
    allStatuses: 'Все состояния',
    reset: 'Сбросить',
    submit: 'Отправить',
    required: 'Выберите организацию.',
    rule: 'Выберите от одной до трёх организаций.',
    help: 'Выберите организации, которым разрешено использовать эту политику.',
    about: 'О назначении организаций',
    selectRow: 'Выбрать {0}',
    loadError: 'Не удалось загрузить организации.',
    refreshError: 'Не удалось обновить организации. Отображаются ранее загруженные данные.',
    retry: 'Повторить',
    maxOrganizations: 'Выберите не более трёх организаций.',
    invalidSelection: 'Выбраны недопустимые организации.',
  },
};

export function registerExampleMessages(service: TranslationService): void {
  service.loadTranslationsForComponent('organizationExample', EXAMPLE_MESSAGES);
}
```

</details>

## Projection and native registration requirements

The selection component requires exactly one direct child label and one direct child clr-datagrid. Diagnose a missing or
duplicate label/grid after content initialization; ignore labels inside filters. The label uses Clarity's existing label
directive when ClarityModule is imported. There is no label input, generated fallback, cllDatagridLabel or named
ng-template. Optional direct cll-alert children are projected above the grid, including alerts inside Angular @if
blocks.

The conceptual projection order is label and optional adjacent clr-signpost, then the control body containing cll-alert,
field actions, clr-datagrid and field feedback. Keep the label in the label column for horizontal layout; alerts align
with the grid. Request alerts do not replace error validation feedback, set a form error or destroy the grid. All
examples reuse AlertComponent and its projected localized message/Retry button; they do not require a new alert or query
input on selection.

The shell assigns/preserves a unique label ID and uses it to name the actual role=grid element. The optional direct
clr-signpost projects beside the label in the label area; it is outside the label's naming subtree. Rich label content
such as emphasis still belongs inside label. No consumer nextId counter, text-span ID or manual aria-labelledby binding
is needed for the shown label/signpost pattern. This is library infrastructure, including unique/hydration-safe IDs, not
business code. Preserve an explicitly supplied native accessible name and merge helper/error descriptions on the actual
grid element. A native label's for attribute alone cannot label a datagrid.

Required marker, inherited layout and field feedback remain shell responsibilities. Test projected label/signpost
provider behavior, keyboard activation, label-to-grid focus, horizontal/vertical layout, translated accessible names,
unique IDs across picker instances and live alert insertion/removal in production.

The native grid declares its own mode, identity, data, loading, filters and optional pagination. The library observes
those settings and owns selected-row writes, native preservation/custom-select-all, event subscriptions and disabled/
loading guards. It must schedule change detection for internal writes; a direct assignment without rendering work
previously left the header stale. Application code does not bind another native selected value or handle selection
events to write the same form field. Keep one writer through the CVA.

Clarity's customSelectAllEnabled/selectAllDisabled settings remain part of internal adapter wiring. The adapter must
consume customSelectAll before enabling it, derive scope from native displayed items, and preserve out-of-scope keys.
Angular disabled, grid loading, optional readonly and item eligibility all participate in the appropriate interaction
checks. These requirements must work with keyboard as well as pointer interaction.

## Native data-reading evidence

A narrow browser proof using the real installed Clarity grid passes eight Chromium checks: initially delayed data,
distinct full/current-page snapshots, paging, filtering while retaining all supplied items, filter clearing, fresh
object replacement, empty replacement and no runtime errors. Strict compilation reads only the exported ClrDatagrid's
public members; no private member or provider deep import is used. This establishes the data-reading seam, not the
production selection/CVA or complete form behavior. A production adapter must still cover provider lifecycle, immutable
snapshots, server/virtual rows, owner writes, pending edits and identity changes in its supported Clarity versions.

## Native configuration and loading evidence

A separate narrow Chromium proof passes five observations using the real installed Clarity grid: native identity stays
independent of index-based trackBy; native single/multi is readable; internal selected writes plus change detection keep
page/header state current; loading leaves a focused checkbox keyboard-editable; no browser runtime errors occur. The
keyboard result is a native behavior the library must guard, not evidence that the proposed guard is implemented.
Neither prototype establishes full CVA buffering, no-echo reconciliation, form-disabled/readonly, or complete popup
focus.

## Native row integration evidence

A narrow Chromium experiment uses only exported grid/row members, with no consumer row marker. It reads row.item from
grid.rows, receives the native selection event, follows paging/fresh-object replacement, updates row.clrDgSelectable to
lock/unlock the checkbox and reports no runtime errors. This establishes a row integration seam, not the complete
selection/CVA or loading/eligibility guard. Keep full-inventory identity and scope on grid.items; handle row
subscription cleanup, existing caller selectability, header state and all keyboard paths in production.

## Label and alert projection evidence

A narrow Chromium experiment uses real Clarity labels/signposts/grids and AlertComponent with a private projection
adapter. Five observations pass: plain labels with optional adjacent signposts name the actual grids; opening the
signpost preserves the label-only name; changing label text updates that name; a conditional alert appears above the
grid, Retry removes it and the grid instance survives; no browser runtime errors occur. This establishes the
projection/naming seam, not a production field implementation. Label-click focus, provider interactions with
forms/layout, multi-instance and SSR/hydration identity, browser/assistive-technology coverage and selection/CVA
integration remain required.

## Historical declaration-proof scope

The current production evidence is recorded separately in the [acceptance record](datagrid-selection-acceptance.md). The
following describes the earlier declaration experiments.

Seven current source hosts plus HTTP/query provider configuration compile with strictTemplates and skipLibCheck=false,
using real AlertComponent/queryResource/toSignalForm/translation APIs and declaration-only selection/accessor/binding
candidates. Twelve negative cases reject invalid native row access, removed items, itemKey, selectionMode,
interactionDisabled, columns, itemLabel and label inputs; removed picker items/loading inputs; and removed row-marker/
label-template exports. Dictionaries cover all 11 locales with matching keys/parameters. The direct form and picker
parent both compile their reactive error selection for required and maximum-count validation.

These source checks and narrow native observations do not establish production selection/CVA, registration, buffering,
no-echo hydration, loading guards, live language switching, popup focus or installed public exports. Earlier key/mode
inference proofs used different inputs and are historical, not evidence for this component's native-derived contract.
