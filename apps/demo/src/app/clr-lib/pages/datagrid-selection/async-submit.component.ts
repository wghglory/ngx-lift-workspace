import {JsonPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {AsyncValidatorFn, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {AlertComponent, DatagridSelectionComponent, TranslatePipe, TranslationService} from 'clr-lift';
import {queryResource, toSignalForm} from 'ngx-lift';
import {filter, firstValueFrom} from 'rxjs';

import {STATUS_KEYS, type Organization} from './organization-example.data';
import {OrganizationService, organizationListQuery} from './organization.service';

const INELIGIBLE_KEYS = new Set(['org-4']);

// Stands in for a server-side eligibility check; the demo never contacts a policy service.
const eligibility: AsyncValidatorFn = (control) =>
  new Promise((resolve) => {
    setTimeout(() => {
      const rejected = ((control.value ?? []) as string[]).filter((key) => INELIGIBLE_KEYS.has(key));
      resolve(rejected.length ? {ineligible: rejected} : null);
    }, 800);
  });

@Component({
  selector: 'app-async-organization-grid',
  imports: [AlertComponent, ClarityModule, ReactiveFormsModule, JsonPipe, TranslatePipe, DatagridSelectionComponent],
  templateUrl: './async-submit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsyncSubmitComponent {
  private readonly translationService = inject(TranslationService);
  private readonly organizationService = inject(OrganizationService);
  readonly organizationsQuery = queryResource(() => organizationListQuery(this.organizationService, 'scope-1'));

  readonly form = new FormGroup({
    organizationIds: new FormControl<string[]>([], {
      nonNullable: true,
      validators: [Validators.required],
      asyncValidators: [eligibility],
      updateOn: 'submit',
    }),
  });
  readonly sf = toSignalForm(this.form);
  readonly submitted = signal<readonly string[] | undefined>(undefined);
  readonly selectionError = computed(() => {
    const errors = this.sf.fields.organizationIds.errors();
    if (!errors) return '';
    if (errors['required']) return this.translationService.translate('organizationExample.required');
    if (errors['ineligible']) return this.translationService.translate('selectionDemo.asyncError');
    return this.translationService.translate('organizationExample.invalidSelection');
  });
  readonly statusKeys = STATUS_KEYS;
  readonly organizationKey = (item: Organization) => item.id;

  async submit(): Promise<void> {
    this.submitted.set(undefined);
    // updateOn: 'submit' starts the async validator during the form submission; wait for its verdict.
    if (this.form.pending) {
      await firstValueFrom(this.form.statusChanges.pipe(filter((status) => status !== 'PENDING')));
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.sf.submitValue();
    this.submitted.set(payload.organizationIds === undefined ? [] : [...payload.organizationIds]);
  }

  reset(): void {
    this.form.reset({organizationIds: []});
    this.submitted.set(undefined);
  }
}
