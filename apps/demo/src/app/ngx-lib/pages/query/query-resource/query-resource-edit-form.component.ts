import {ChangeDetectionStrategy, Component, computed, linkedSignal, untracked} from '@angular/core';
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

  // Tracks the id the live FormGroup was seeded from, so a same-id refetch (which transiently resets
  // value() to undefined and back) does not rebuild the form and clobber the user's edits.
  private seededId: string | null = null;

  // 2) Editable form seeded from the query WITHOUT an effect.
  //    Subtlety that bit us: `source` reads `value()?.id`, so the linked signal depends on the WHOLE
  //    `value()` signal, not just the selected id. Per Angular's implementation (producerRecomputeValue),
  //    the node becomes dirty whenever any signal read inside `source` changes — i.e. on every refetch
  //    that replaces the tenant object, even when the id is still "tenant-1". linkedSignal only
  //    equality-checks the PRODUCED value (the FormGroup), never the source id, so `computation` DOES
  //    re-run on a same-id refetch. The `seededId` guard below is what keeps the live FormGroup (and the
  //    user's edits) by returning the previous instance:
  //      - null -> 'tenant-1' (first resolution): build the seeded form, record seededId.
  //      - same id refetched / reload transient (value() resets to undefined then resolves): id unchanged
  //        -> keep the existing FormGroup with the user's edits.
  //      - 'tenant-1' -> 'tenant-2' (navigate to another entity): rebuild from the new data.
  //    This is the Angular-recommended alternative to copying query data into the form inside an
  //    effect (which would also re-run on every refetch and overwrite in-progress edits).
  readonly form = linkedSignal<string | null, FormGroup<TenantForm>>({
    source: () => this.tenantQuery.value()?.id ?? null,
    computation: (id, previous) => {
      // id unchanged since the last seed: keep the live FormGroup (preserves edits across refetches).
      if (id && this.seededId === id) return previous?.value ?? tenantForm(null);
      // Read the resolved value WITHOUT making this computation react to every refetch.
      const tenant = untracked(() => this.tenantQuery.value());
      if (id && tenant) {
        this.seededId = id;
        return tenantForm(tenant);
      }
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
