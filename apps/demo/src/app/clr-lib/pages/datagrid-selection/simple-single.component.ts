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
