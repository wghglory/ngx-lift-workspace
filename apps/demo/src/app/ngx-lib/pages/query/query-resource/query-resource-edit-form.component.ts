import {ChangeDetectionStrategy, Component, computed, linkedSignal} from '@angular/core';
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

// One factory builds both the empty form and the seeded form, so the control set and validators
// are declared exactly once. `tenant` is null for the empty form.
function tenantForm(tenant: Tenant | null): FormGroup<TenantForm> {
  return new FormGroup<TenantForm>({
    id: new FormControl(tenant?.id ?? '', {nonNullable: true}),
    name: new FormControl(tenant?.name ?? '', {nonNullable: true, validators: [Validators.required]}),
    role: new FormControl(tenant?.role ?? '', {nonNullable: true}),
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

  // 2) Editable form seeded from the query WITHOUT an effect. `source` is the entity id, so the
  //    computation re-runs only when the id changes:
  //      - null -> 'tenant-1' (first resolution): build the seeded form.
  //      - same id refetched (value object changes, id unchanged): source is unchanged, so the
  //        existing FormGroup (with the user's edits) is kept instead of being rebuilt/clobbered.
  //      - 'tenant-1' -> 'tenant-2' (navigate to another entity): rebuild from the new data.
  //    This is the Angular-recommended alternative to copying query data into the form inside an
  //    effect (which would re-run on every reactive refetch and overwrite in-progress edits).
  readonly form = linkedSignal<string | null, FormGroup<TenantForm>>({
    source: () => this.tenantQuery.value()?.id ?? null,
    computation: (id, previous) => {
      const tenant = this.tenantQuery.value();
      if (id && tenant) return tenantForm(tenant);
      return previous?.value ?? tenantForm(null);
    },
  });

  // 3) Save. No local outcome/busy signals: the mutation ref already exposes isLoading()/status(),
  //    so the template reads saveMutation.status() === 'resolved' | 'error' for the result and
  //    saveMutation.isLoading() for the pending state. status() tracks only the latest invocation.
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
    void this.saveMutation.mutate(this.form().getRawValue() as Tenant).catch(() => undefined);
  }
}
