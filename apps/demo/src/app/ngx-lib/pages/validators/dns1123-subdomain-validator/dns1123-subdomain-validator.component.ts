import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {PageContainerComponent} from 'clr-lift';
import {dns1123SubdomainValidator, k8sNameValidator} from 'ngx-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-dns1123-subdomain-validator',
  imports: [PageContainerComponent, ClarityModule, ReactiveFormsModule, CodeBlockComponent],
  templateUrl: './dns1123-subdomain-validator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dns1123SubdomainValidatorComponent {
  form = new FormGroup({
    subdomain: new FormControl('cluster-01.dev.internal', [dns1123SubdomainValidator()]),
    k8sResource: new FormControl('my-database-cluster', [k8sNameValidator]),
  });

  exampleCode = highlight(`
import {dns1123SubdomainValidator, k8sNameValidator} from 'ngx-lift';
import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form">
      <div>
        <label>DNS-1123 Subdomain</label>
        <input type="text" formControlName="subdomain" />
        @if (form.controls.subdomain.errors?.['dns1123Subdomain']) {
          <div>Must contain only lowercase letters, digits, '.', or '-', and start/end with an alphanumeric char</div>
        }
        @if (form.controls.subdomain.errors?.['dns1123SubdomainLength']) {
          <div>Cannot exceed 253 characters</div>
        }
      </div>

      <div>
        <label>Kubernetes Resource Name</label>
        <input type="text" formControlName="k8sResource" />
        @if (form.controls.k8sResource.errors?.['k8sName']) {
          <div>Must be lowercase RFC 1123 label (max 63 chars, no dots)</div>
        }
      </div>
    </form>
  \`
})
export class K8sNamingExampleComponent {
  form = new FormGroup({
    subdomain: new FormControl('', [dns1123SubdomainValidator()]),
    k8sResource: new FormControl('', [k8sNameValidator]),
  });
}
  `);

  signatureCode = highlight(`
function dns1123SubdomainValidator(): ValidatorFn

function k8sNameValidator(control: AbstractControl): ValidationErrors | null
  `);
}
