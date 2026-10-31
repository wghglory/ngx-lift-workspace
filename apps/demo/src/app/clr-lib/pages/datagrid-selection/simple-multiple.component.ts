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
