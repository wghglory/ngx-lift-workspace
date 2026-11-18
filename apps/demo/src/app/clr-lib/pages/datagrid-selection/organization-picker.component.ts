import {OrganizationService} from './organization.service';
import {queryResource} from 'ngx-lift';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  model,
  OnDestroy,
  viewChild,
} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {ClarityModule, ClrDatagrid} from '@clr/angular';
import {
  AlertComponent,
  DatagridSelectionComponent,
  DatagridSelectionValue,
  TranslatePipe,
  TranslationService,
} from 'clr-lift';
import {STATUS_KEYS, STATUS_ORDER, type Organization} from './organization-example.data';
import {StatusFilter} from './status.filter';
import {OrganizationStatusFilterComponent} from './organization-status-filter.component';
import {toSelectedKeys} from './selected-keys';

/**
 * Reusable organization query/presentation component. It owns its scoped query, native loading and
 * failure/retry UI; the consuming page owns the FormControl, validators and submission. The page's
 * control is bound directly to the inner cll-datagrid-selection, and selected keys are exposed through
 * the `keys` model for observers.
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
  private readonly translationService = inject(TranslationService);
  private readonly grid = viewChild<ClrDatagrid<Organization>>(ClrDatagrid);

  readonly organizationsQuery = queryResource(() => this.organizationService.listQuery('scope-1'));
  /** The page-owned control bound directly to the single value-control module. */
  readonly control = input.required<FormControl>();
  /** Selected keys emitted for page observers; the control remains the one form owner. */
  readonly keys = model<DatagridSelectionValue>(null);
  /** Follows the current control's value, including reset and control replacement. */
  private readonly selectedKeys = toSelectedKeys(this.control);
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

  constructor() {
    effect(() => this.keys.set(this.selectedKeys()));
  }

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
