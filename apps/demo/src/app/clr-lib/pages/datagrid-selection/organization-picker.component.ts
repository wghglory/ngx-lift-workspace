import {OrganizationService} from './organization.service';
import {queryResource} from 'ngx-lift';
import {booleanAttribute, ChangeDetectionStrategy, Component, inject, input, OnDestroy, viewChild} from '@angular/core';
import {ClarityModule, ClrDatagrid} from '@clr/angular';
import {
  AlertComponent,
  DatagridSelectionComponent,
  DatagridSelectionAccessorDirective,
  DatagridSelectionBindingDirective,
  TranslatePipe,
  TranslationService,
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
  private readonly translationService = inject(TranslationService);
  private readonly grid = viewChild<ClrDatagrid<Organization>>(ClrDatagrid);

  readonly organizationsQuery = queryResource(() => this.organizationService.listQuery('scope-1'));
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
