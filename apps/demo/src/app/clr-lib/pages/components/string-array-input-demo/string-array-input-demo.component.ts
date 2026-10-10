import {JsonPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {PageContainerComponent, StringArrayInputComponent} from 'clr-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-string-array-input-demo',
  imports: [
    ClarityModule,
    ReactiveFormsModule,
    JsonPipe,
    StringArrayInputComponent,
    PageContainerComponent,
    CodeBlockComponent,
  ],
  templateUrl: './string-array-input-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StringArrayInputDemoComponent {
  demoForm = new FormGroup({
    tags: new FormControl<string[]>(['angular', 'signals', 'clarity'], Validators.required),
    domains: new FormControl<string[]>(['api.example.com', 'auth.example.com']),
  });

  basicExampleCode = highlight(`
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {StringArrayInputComponent} from 'clr-lift';

@Component({
  imports: [ReactiveFormsModule, StringArrayInputComponent],
  template: \`
    <form [formGroup]="form">
      <cll-string-array-input
        formControlName="tags"
        label="Tags"
        placeholder="Enter tags separated by commas"
      />
    </form>
    <pre>{{ form.value | json }}</pre>
  \`
})
export class TagsFormComponent {
  form = new FormGroup({
    tags: new FormControl<string[]>(['angular', 'signals', 'clarity']),
  });
}
  `);

  uniqueExampleCode = highlight(`
<cll-string-array-input
  formControlName="domains"
  label="CORS Allowed Domains"
  placeholder="api.domain.com, auth.domain.com"
  [unique]="true"
  helperText="Duplicate domains will automatically be removed"
/>
  `);
}
