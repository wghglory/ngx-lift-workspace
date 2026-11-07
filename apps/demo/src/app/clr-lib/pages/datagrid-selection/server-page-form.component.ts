import {JsonPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, effect, inject, OnDestroy, signal} from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators} from '@angular/forms';
import {ClarityModule, ClrDatagridSortOrder} from '@clr/angular';
import {AlertComponent, DatagridSelectionComponent, TranslatePipe, TranslationService} from 'clr-lift';
import {queryResource, toSignalForm} from 'ngx-lift';
import {Subscription} from 'rxjs';

import {STATUS_KEYS} from './organization-example.data';
import {
  type ServerOrganization,
  type ServerOrganizationScope,
  type ServerOrganizationSort,
  type ServerOrganizationStatus,
} from './server-organization.data';
import {ServerOrganizationService} from './server-organization.service';
import {ServerNameFilter} from './server-name.filter';

@Component({
  selector: 'app-server-organization-grid',
  imports: [AlertComponent, ClarityModule, JsonPipe, ReactiveFormsModule, TranslatePipe, DatagridSelectionComponent],
  templateUrl: './server-page-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/** Direct server-paged form host: the page owns the query, eligibility validation and key-only submission. */
export class ServerPageFormComponent implements OnDestroy {
  private readonly translationService = inject(TranslationService);
  private readonly organizationService = inject(ServerOrganizationService);
  private readonly nameFilterSubscription: Subscription;

  /** Saved keys from the baseline include page rows that were never requested. */
  readonly initialKeys = ['org-s-17', 'org-s-23'];
  readonly savedKeys = ['org-s-05', 'org-s-11', 'org-s-15', 'org-s-23'];
  readonly pageSize = 5;
  readonly sortOrder = computed(() => (this.sort() === '-name' ? ClrDatagridSortOrder.DESC : ClrDatagridSortOrder.ASC));
  readonly scope = signal<ServerOrganizationScope>('commerce');
  readonly status = signal<ServerOrganizationStatus>('all');
  readonly sort = signal<ServerOrganizationSort>('name');
  readonly page = signal(1);
  readonly readonly = signal(false);
  readonly submitted = signal<readonly string[] | null>(null);
  readonly nameFilter = new ServerNameFilter();
  /** Only successfully loaded rows can supply a name or authoritative availability reason. Declared before the form so its validator can read it synchronously. */
  private readonly known = signal<ReadonlyMap<string, ServerOrganization>>(new Map());
  readonly form = new FormGroup({
    organizationIds: new FormControl<string[]>([...this.initialKeys], {
      nonNullable: true,
      validators: [
        Validators.required,
        (control) => {
          const unavailable = this.authoritativelyUnavailableKeys(control.value as readonly string[]);
          return unavailable.length ? {unavailableOrganizations: unavailable} : null;
        },
      ],
    }),
  });
  readonly sf = toSignalForm(this.form, {
    includeDisabled: false,
    // Angular keeps a disabled child in FormGroup.value, so a disabled control is excluded here.
    omitIf: (_value, key) => this.form.get(key)?.disabled ?? false,
  });
  readonly organizationsQuery = queryResource(() =>
    this.organizationService.listQuery({
      scope: this.scope(),
      name: this.nameFilter.query(),
      status: this.status(),
      sort: this.sort(),
      page: this.page(),
      pageSize: this.pageSize,
    }),
  );
  readonly items = computed(() => this.organizationsQuery.value()?.items ?? []);
  /** Keep the last settled total while the next page loads so server pagination does not clamp to page 1. */
  private readonly settledTotal = signal(0);
  readonly total = computed(() => this.organizationsQuery.value()?.total ?? this.settledTotal());
  readonly lastPage = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize)));
  readonly selected = computed(() => {
    const known = this.known();
    return this.sf.fields.organizationIds.value().map((key) => {
      const item = known.get(key);
      return {key, name: item?.name, unavailable: item?.status === 'maintenance'};
    });
  });
  readonly selectionError = computed(() => {
    const errors = this.sf.fields.organizationIds.errors();
    if (!errors) return '';
    if (errors['required']) return this.translationService.translate('organizationExample.required');
    if (errors['unavailableOrganizations']) return this.translationService.translate('selectionDemo.unavailableError');
    return this.translationService.translate('organizationExample.invalidSelection');
  });
  readonly statusKeys = STATUS_KEYS;
  readonly organizationKey = (item: ServerOrganization) => item.id;
  readonly nameComparator = {
    compare: (a: ServerOrganization, b: ServerOrganization) => a.name.localeCompare(b.name, 'en'),
  };
  readonly availability = (item: ServerOrganization) => ({
    disabled: item.status === 'maintenance',
    disabledReason:
      item.status === 'maintenance' ? this.translationService.translate('organizationExample.maintenance') : undefined,
  });
  readonly evidence = computed(() => {
    const scope = this.translationService.translate(
      this.scope() === 'commerce' ? 'selectionDemo.serverCommerce' : 'selectionDemo.serverPublic',
    );
    const sort = this.translationService.translate(
      this.sort() === '-name' ? 'selectionDemo.serverSortDesc' : 'selectionDemo.serverSortAsc',
    );
    return this.translationService.translate(
      'selectionDemo.serverEvidence',
      this.page(),
      this.lastPage(),
      this.total(),
      scope,
      sort,
    );
  });

  constructor() {
    effect(() => {
      const page = this.organizationsQuery.value();
      if (!page) return;
      this.settledTotal.set(page.total);
      if (!page.items.length) return;
      this.known.update((known) => {
        const next = new Map(known);
        for (const item of page.items) next.set(item.id, item);
        return next;
      });
    });
    this.sf.revalidate(this.form.controls.organizationIds, () => this.known());
    this.nameFilterSubscription = this.nameFilter.changes.subscribe(() => this.page.set(1));
  }

  ngOnDestroy(): void {
    this.nameFilterSubscription.unsubscribe();
    this.nameFilter.destroy();
  }

  setScope(scope: ServerOrganizationScope): void {
    this.scope.set(scope);
    this.page.set(1);
  }

  setStatus(status: ServerOrganizationStatus): void {
    this.status.set(status);
    this.page.set(1);
  }

  setSort(order: ClrDatagridSortOrder): void {
    this.sort.set(order === ClrDatagridSortOrder.DESC ? '-name' : 'name');
    this.page.set(1);
  }

  setPage(page: number): void {
    this.page.set(Math.max(1, page));
  }

  selectionLocked(): boolean {
    return this.readonly() || this.form.controls.organizationIds.disabled || this.organizationsQuery.isLoading();
  }

  toggleDisabled(): void {
    const control = this.form.controls.organizationIds;
    if (control.disabled) control.enable();
    else control.disable();
  }

  loadSaved(): void {
    // Restore persisted keys even when their pages were never requested.
    this.form.controls.organizationIds.setValue([...this.savedKeys]);
    this.submitted.set(null);
  }

  removeSelection(key: string): void {
    if (this.selectionLocked()) return;
    const control = this.form.controls.organizationIds;
    control.setValue(control.value.filter((selected) => selected !== key));
    control.markAsDirty();
    control.markAsTouched();
  }

  submit(): void {
    if (this.sf.invalid() || this.sf.pending() || this.form.controls.organizationIds.disabled) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.sf.submitValue();
    // No wildcard: every selected key, including those from pages not currently loaded.
    this.submitted.set(payload.organizationIds ? [...payload.organizationIds] : []);
  }

  reset(formView: FormGroupDirective): void {
    formView.resetForm({organizationIds: [...this.initialKeys]});
    this.submitted.set(null);
  }

  /**
   * Lists saved keys the server authoritatively reports as unavailable.
   * @param keys Selected keys, including keys whose pages were never requested.
   * @returns Keys whose successfully loaded row is in maintenance; unloaded keys stay valid and unverified.
   */
  private authoritativelyUnavailableKeys(keys: readonly string[]): string[] {
    const known = this.known();
    return keys.filter((key) => known.get(key)?.status === 'maintenance');
  }
}
