import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  OnDestroy,
  signal,
} from '@angular/core';
import {ClrDatagridSortOrder} from '@clr/angular';
import {ClarityModule} from '@clr/angular';
import {
  AlertComponent,
  DatagridSelectionAccessorDirective,
  DatagridSelectionBindingDirective,
  DatagridSelectionComponent,
  TranslatePipe,
  TranslationService,
} from 'clr-lift';
import {queryResource} from 'ngx-lift';
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
  selector: 'app-server-organization-picker',
  imports: [
    AlertComponent,
    ClarityModule,
    DatagridSelectionComponent,
    TranslatePipe,
    DatagridSelectionBindingDirective,
  ],
  hostDirectives: [DatagridSelectionAccessorDirective],
  templateUrl: './server-organization-picker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/** Reusable business picker: owns the paged server query and native grid, but no form control of its own. */
export class ServerOrganizationPickerComponent implements OnDestroy {
  private readonly organizationService = inject(ServerOrganizationService);
  private readonly translationService = inject(TranslationService);
  private readonly nameFilterSubscription: Subscription;

  readonly readonly = input(false, {transform: booleanAttribute});
  readonly required = input(false, {transform: booleanAttribute});
  readonly error = input('');

  readonly pageSize = 5;
  readonly scope = signal<ServerOrganizationScope>('commerce');
  readonly status = signal<ServerOrganizationStatus>('all');
  readonly sort = signal<ServerOrganizationSort>('name');
  readonly page = signal(1);
  readonly nameFilter = new ServerNameFilter();
  readonly sortOrder = computed(() => (this.sort() === '-name' ? ClrDatagridSortOrder.DESC : ClrDatagridSortOrder.ASC));
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

  constructor() {
    effect(() => {
      const page = this.organizationsQuery.value();
      if (!page) return;
      this.settledTotal.set(page.total);
    });
    this.nameFilterSubscription = this.nameFilter.changes.subscribe(() => this.page.set(1));
  }

  ngOnDestroy(): void {
    this.nameFilterSubscription.unsubscribe();
    this.nameFilter.destroy();
  }

  /** Applies the next picker-owned scope and requests page 1. */
  setScope(scope: ServerOrganizationScope): void {
    this.scope.set(scope);
    this.page.set(1);
  }

  /** Applies the next picker-owned status filter and requests page 1. */
  setStatus(status: ServerOrganizationStatus): void {
    this.status.set(status);
    this.page.set(1);
  }

  /** Applies the next name sort direction and requests page 1. */
  setSort(order: ClrDatagridSortOrder): void {
    this.sort.set(order === ClrDatagridSortOrder.DESC ? '-name' : 'name');
    this.page.set(1);
  }

  /** Applies the next served page, never below 1. */
  setPage(page: number): void {
    this.page.set(Math.max(1, page));
  }
}
