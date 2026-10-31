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
