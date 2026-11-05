import {ChangeDetectionStrategy, Component, computed, linkedSignal, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {TranslatePipe} from 'clr-lift';
import {mutateResource, queryResource} from 'ngx-lift';

interface Tenant {
  id: string;
  name: string;
  role: string;
}

interface TenantForm {
  id: FormControl<string>;
  name: FormControl<string>;
  role: FormControl<string>;
}

function emptyTenantForm(): FormGroup<TenantForm> {
  return new FormGroup<TenantForm>({
    id: new FormControl('', {nonNullable: true}),
    name: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    role: new FormControl('', {nonNullable: true}),
  });
}

@Component({
  selector: 'app-query-resource-edit-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, ClarityModule, TranslatePipe],
  templateUrl: './query-resource-edit-form.component.html',
})
export class QueryResourceEditFormComponent {
  // 1) Load the entity to edit.
  readonly tenantQuery = queryResource<Tenant>(() => ({
    key: ['tenant', 'detail', 'tenant-1'],
    loader: () =>
      new Promise<Tenant>((resolve) =>
        setTimeout(() => resolve({id: 'tenant-1', name: 'Acme Corp', role: 'admin'}), 400),
      ),
  }));

  readonly loaded = computed(() => this.tenantQuery.hasValue());

  // 2) Editable form seeded from the query WITHOUT an effect. The source is the entity id, so the
  //    computation re-runs only when the id changes: the first resolution seeds the form, and a
  //    background refetch of the same entity (id unchanged) keeps the user's edits instead of
  //    clobbering them. This is the Angular-recommended alternative to copying query data into the
  //    form inside an effect (which would re-run on every reactive refetch).
  readonly form = linkedSignal<string | null, FormGroup<TenantForm>>({
    source: () => this.tenantQuery.value()?.id ?? null,
    computation: (id, previous) => {
      const tenant = this.tenantQuery.value();
      if (id && tenant) {
        return new FormGroup<TenantForm>({
          id: new FormControl(tenant.id, {nonNullable: true}),
          name: new FormControl(tenant.name, {nonNullable: true, validators: [Validators.required]}),
          role: new FormControl(tenant.role, {nonNullable: true}),
        });
      }
      return previous?.value ?? emptyTenantForm();
    },
  });

  // 3) Save via the per-call callbacks shipped in the previous increment.
  readonly saveOutcome = signal<'success' | 'error' | null>(null);
  readonly saving = signal(false);

  readonly saveMutation = mutateResource(
    (args: Tenant) =>
      new Promise<Tenant>((resolve, reject) =>
        setTimeout(() => (Math.random() < 0.15 ? reject(new Error('simulated 500')) : resolve(args)), 300),
      ),
  );

  save(): void {
    if (this.form().invalid) {
      this.form().markAllAsTouched();
      return;
    }
    this.saveOutcome.set(null);
    this.saving.set(true);
    const tenant = this.form().getRawValue() as Tenant;
    void this.saveMutation
      .mutate(tenant, {
        onSuccess: () => this.saveOutcome.set('success'),
        onError: () => this.saveOutcome.set('error'),
      })
      .catch(() => undefined)
      .finally(() => this.saving.set(false));
  }
}
