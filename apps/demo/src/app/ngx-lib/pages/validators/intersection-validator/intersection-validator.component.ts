import {Component, computed, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {AlertComponent, PageContainerComponent, TranslatePipe, TranslationService} from 'clr-lift';
import {intersectionValidator} from 'ngx-lift';

import {ApiProperty, ApiTableComponent} from '../../../../shared/components/api-table';
import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-intersection-validator',
  imports: [
    ClarityModule,
    ReactiveFormsModule,
    PageContainerComponent,
    AlertComponent,
    CodeBlockComponent,
    TranslatePipe,
    ApiTableComponent,
  ],
  templateUrl: './intersection-validator.component.html',
  styleUrl: './intersection-validator.component.scss',
})
export class IntersectionValidatorComponent {
  private translationService = inject(TranslationService);

  parameters = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'array1Key',
        type: 'string',
        description: this.translationService.translate('intersectionValidator.paramArray1Key'),
      },
      {
        name: 'array2Key',
        type: 'string',
        description: this.translationService.translate('intersectionValidator.paramArray2Key'),
      },
    ];
  });
  form = new FormGroup(
    {
      includedNamespaces: new FormControl<string[]>([], Validators.required),
      excludedNamespaces: new FormControl<string[]>([], Validators.required),
    },
    {
      validators: [intersectionValidator('includedNamespaces', 'excludedNamespaces')],
    },
  );

  intersectionHtmlCode = highlight(`
<form clrForm [formGroup]="form">
  <clr-select-container>
    <label>Included Namespaces</label>
    <select clrSelect multiple name="options" [formControl]="form.controls.includedNamespaces" required>
      <option value="default">default</option>
      <option value="kube-system">kube-system</option>
      <option value="kube-public">kube-public</option>
    </select>
    <clr-control-error *clrIfError="'required'">Required</clr-control-error>
    <clr-control-error *clrIfError="'intersection'">
      Included namespaces and excluded namespaces cannot overlap
    </clr-control-error>
  </clr-select-container>

  <clr-select-container>
    <label>Excluded Namespaces</label>
    <select clrSelect multiple name="options" [formControl]="form.controls.excludedNamespaces" required>
      <option value="default">default</option>
      <option value="kube-system">kube-system</option>
      <option value="kube-public">kube-public</option>
    </select>
    <clr-control-error *clrIfError="'required'">Required</clr-control-error>
    <clr-control-error *clrIfError="'intersection'">
      Included namespaces and excluded namespaces cannot overlap
    </clr-control-error>
  </clr-select-container>

  @if (form.errors?.['intersection']) {
    <cll-alert cds-layout="m-y:md" [content]="'Included namespaces and excluded namespaces have overlaps'" />
  }

  <button type="submit" class="btn-primary btn" [disabled]="form.invalid">Submit</button>
</form>
  `);

  intersectionTsCode = highlight(`
import {intersectionValidator} from 'ngx-lift';
import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
})
export class IntersectionValidatorComponent {
  form = new FormGroup(
    {
      includedNamespaces: new FormControl<string[]>([], Validators.required),
      excludedNamespaces: new FormControl<string[]>([], Validators.required),
    },
    {
      validators: [intersectionValidator('includedNamespaces', 'excludedNamespaces')],
    },
  );
}
  `);

  signatureCode = highlight(`intersectionValidator(controlName1: string, controlName2: string): ValidatorFn;`);
}
