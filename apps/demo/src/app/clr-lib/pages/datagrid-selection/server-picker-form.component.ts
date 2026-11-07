import {JsonPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {TranslatePipe, TranslationService} from 'clr-lift';
import {toSignalForm} from 'ngx-lift';

import {ServerOrganizationPickerComponent} from './server-organization-picker.component';

@Component({
  selector: 'app-server-picker-form',
  imports: [ClarityModule, JsonPipe, ReactiveFormsModule, ServerOrganizationPickerComponent, TranslatePipe],
  templateUrl: './server-picker-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/** Parent host for the reusable picker: owns values, required validation, the baseline and the submit DTO. */
export class ServerPickerFormComponent {
  private readonly translationService = inject(TranslationService);

  /** Parent-owned baseline: saved keys include rows that live on pages the picker has not requested. */
  readonly initialKeys = ['org-s-13', 'org-s-25'];
  readonly readonly = signal(false);
  readonly form = new FormGroup({
    organizationIds: new FormControl<string[]>([...this.initialKeys], {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });
  readonly sf = toSignalForm(this.form, {
    includeDisabled: false,
    // Angular keeps a disabled child in FormGroup.value, so a disabled control is excluded here.
    omitIf: (_value, key) => this.form.get(key)?.disabled ?? false,
  });
  readonly submitted = signal<readonly string[] | null>(null);
  readonly selectionError = computed(() => {
    const errors = this.sf.fields.organizationIds.errors();
    if (!errors) return '';
    if (errors['required']) return this.translationService.translate('organizationExample.required');
    return this.translationService.translate('organizationExample.invalidSelection');
  });

  toggleDisabled(): void {
    const control = this.form.controls.organizationIds;
    if (control.disabled) control.enable();
    else control.disable();
  }

  submit(): void {
    if (this.sf.invalid() || this.sf.pending() || this.form.controls.organizationIds.disabled) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.sf.submitValue();
    // Key-only DTO belongs to the parent; the picker never sees the serialized payload.
    this.submitted.set(payload.organizationIds ? [...payload.organizationIds] : []);
  }

  reset(formView: FormGroupDirective): void {
    formView.resetForm({organizationIds: [...this.initialKeys]});
    this.submitted.set(null);
  }
}
