import {JsonPipe} from '@angular/common';
import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
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

  submit(): void {
    if (this.sf.invalid() || this.sf.pending()) return;
    const payload = this.sf.submitValue();
    this.save.emit(payload.organizationIds === undefined ? {} : {organizationIds: [...payload.organizationIds]});
  }

  private statusText(item: Organization): string {
    return this.translationService.translate(STATUS_KEYS[item.status]);
  }
}
