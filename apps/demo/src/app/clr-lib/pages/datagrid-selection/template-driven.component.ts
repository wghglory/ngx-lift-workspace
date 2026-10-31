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
