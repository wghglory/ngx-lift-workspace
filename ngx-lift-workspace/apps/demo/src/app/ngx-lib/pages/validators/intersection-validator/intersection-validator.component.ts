import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {AlertComponent, CalloutComponent, PageContainerComponent} from 'clr-lift';
import {intersectionValidator} from 'ngx-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-intersection-validator',
  standalone: true,
  imports: [
    ClarityModule,
    ReactiveFormsModule,
    PageContainerComponent,
    AlertComponent,
    CalloutComponent,
    CodeBlockComponent,
  ],
  templateUrl: './intersection-validator.component.html',
  styleUrl: './intersection-validator.component.scss',
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
    <cll-alert class="my-4" [content]="'Included namespaces and excluded namespaces have overlaps'" />
  }

  <button type="submit" class="btn-primary btn" [disabled]="form.invalid">Submit</button>
</form>
  `);

  intersectionTsCode = highlight(`
import {intersectionValidator} from 'ngx-lift';

form = new FormGroup(
  {
    includedNamespaces: new FormControl<string[]>([], Validators.required),
    excludedNamespaces: new FormControl<string[]>([], Validators.required),
  },
  {
    validators: [intersectionValidator('includedNamespaces', 'excludedNamespaces')],
  },
);
  `);
}
