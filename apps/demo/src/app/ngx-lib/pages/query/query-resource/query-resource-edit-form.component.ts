import {ChangeDetectionStrategy, Component, computed, effect, signal} from '@angular/core';
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
  name: FormControl<string>;
  role: FormControl<string>;
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

  readonly form = new FormGroup<TenantForm>({
    name: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    role: new FormControl('', {nonNullable: true}),
  });
  private readonly initializedId = signal<string | undefined>(undefined);
  readonly loaded = computed(() => {
    const tenant = this.tenantQuery.value();
    return !!tenant && tenant.id === this.initializedId();
  });

  constructor() {
    effect(() => {
      const tenant = this.tenantQuery.value();
      if (!tenant || tenant.id === this.initializedId()) return;
      this.form.reset({name: tenant.name, role: tenant.role});
      this.initializedId.set(tenant.id);
    });
  }

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
    const id = this.initializedId();
    if (id === undefined || !this.loaded()) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    void this.saveMutation.mutate({id, ...this.form.getRawValue()}).catch(() => undefined);
  }
}
