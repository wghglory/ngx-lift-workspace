import {ChangeDetectionStrategy, Component, effect} from '@angular/core';
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
  constructor() {
    effect(() => {
      const tenant = this.tenantQuery.value();
      if (tenant) this.form.reset({name: tenant.name, role: tenant.role});
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
    const tenant = this.tenantQuery.value();
    if (!tenant) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    void this.saveMutation.mutate({id: tenant.id, ...this.form.getRawValue()}).catch(() => undefined);
  }
}
