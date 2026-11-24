import {OrganizationService} from './organization.service';
import {queryResource} from 'ngx-lift';
import {booleanAttribute, ChangeDetectionStrategy, Component, inject, input, OnDestroy, viewChild} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {ClarityModule, ClrDatagrid} from '@clr/angular';
import {AlertComponent, DatagridSelectionComponent, TranslatePipe, ClrLiftI18nService} from 'clr-lift';
import {STATUS_KEYS, STATUS_ORDER, type Organization} from './organization-example.data';
import {StatusFilter} from './status.filter';
import {OrganizationStatusFilterComponent} from './organization-status-filter.component';

/**
 * Reusable organization query/presentation component. It owns its scoped query, native loading and
 * failure/retry UI; the consuming page owns the FormControl, validators and submission. The page's
 * control is bound directly to the inner cll-datagrid-selection. Read and submit selected keys from
 * that same page-owned control; no mirrored selection model is needed.
 */
@Component({
  selector: 'app-organization-picker',
  imports: [
    AlertComponent,
    ClarityModule,
    ReactiveFormsModule,
    DatagridSelectionComponent,
    TranslatePipe,
    OrganizationStatusFilterComponent,
  ],
  templateUrl: './organization-picker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationPickerComponent implements OnDestroy {
  private readonly organizationService = inject(OrganizationService);
  private readonly translationService = inject(ClrLiftI18nService);
  private readonly grid = viewChild<ClrDatagrid<Organization>>(ClrDatagrid);

  readonly organizationsQuery = queryResource(() => this.organizationService.listQuery('scope-1'));
  /** The page-owned control bound directly to the single value-control module. */
  readonly control = input.required<FormControl>();
  readonly readonly = input(false, {transform: booleanAttribute});
  readonly required = input(false, {transform: booleanAttribute});
  readonly error = input('');
  readonly layout = input<'horizontal' | 'vertical'>('vertical');
  readonly statusKeys = STATUS_KEYS;
  readonly availability = (item: Organization) => ({
    disabled: item.status === 'maintenance',
    disabledReason:
      item.status === 'maintenance' ? this.translationService.translate('organizationExample.maintenance') : undefined,
  });
  readonly statusComparator = {
    compare: (a: Organization, b: Organization) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status],
  };
  readonly statusFilter = new StatusFilter();
  readonly organizationKey = (item: Organization) => item.id;

  focusGrid(): void {
    this.grid()?.datagridTable.nativeElement.focus();
  }

  refreshGridItems(): void {
    this.grid()?.items.refresh();
  }

  ngOnDestroy(): void {
    this.statusFilter.destroy();
  }
}
