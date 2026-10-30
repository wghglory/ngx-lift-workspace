import {toSignalForm} from 'ngx-lift';
import {JsonPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, output, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {TranslatePipe, TranslationService} from 'clr-lift';
import {OrganizationPickerComponent} from './organization-picker.component';

@Component({
  selector: 'app-policy-form',
  imports: [ClarityModule, ReactiveFormsModule, JsonPipe, TranslatePipe, OrganizationPickerComponent],
  templateUrl: './picker-parent.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PolicyFormComponent {
  private readonly translationService = inject(TranslationService);
  private readonly originalOrganizationIds = ['org-1'];
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
  readonly selectionError = computed(() => {
    const errors = this.sf.fields.organizationIds.errors();
    if (!errors) return '';
    if (errors['required']) return this.translationService.translate('organizationExample.required');
    if (errors['maxlength']) return this.translationService.translate('organizationExample.maxOrganizations');
    return this.translationService.translate('organizationExample.invalidSelection');
  });
  readonly save = output<{organizationIds?: string[]}>();
  submit(): void {
    if (this.sf.invalid() || this.sf.pending()) return;
    const payload = this.sf.submitValue();
    this.save.emit(payload.organizationIds === undefined ? {} : {organizationIds: [...payload.organizationIds]});
  }
}
