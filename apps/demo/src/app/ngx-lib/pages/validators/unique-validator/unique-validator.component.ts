import {DemoPlaygroundComponent} from '../../../../shared/components/demo-playground/demo-playground.component';
import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {CalloutComponent, PageContainerComponent, TranslatePipe, TranslationService} from 'clr-lift';
import {UniqueValidator} from 'ngx-lift';

import {ApiProperty, ApiTableComponent} from '../../../../shared/components/api-table';
import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-unique-validator',
  imports: [
    DemoPlaygroundComponent,
    ClarityModule,
    ReactiveFormsModule,
    PageContainerComponent,
    CalloutComponent,
    CodeBlockComponent,
    TranslatePipe,
    ApiTableComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './unique-validator.component.html',
  styleUrl: './unique-validator.component.scss',
})
export class UniqueValidatorComponent {
  readonly firstTaskCode = highlight(
    "import {ChangeDetectionStrategy, Component, inject} from '@angular/core';\nimport {FormBuilder, ReactiveFormsModule} from '@angular/forms';\nimport {ClarityModule} from '@clr/angular';\nimport {UniqueValidator} from 'ngx-lift';\n\n@Component({\n  selector: 'app-form-example',\n  imports: [ClarityModule, ReactiveFormsModule],\n  templateUrl: './form-example.html',\n  changeDetection: ChangeDetectionStrategy.OnPush,\n})\nexport class FormExampleComponent {\n  private fb = inject(FormBuilder);\n\n  form1 = this.fb.group({\n    demo1: this.fb.array([this.fb.control(null), this.fb.control('')], UniqueValidator.unique()),\n  });\n\n  validateControlByIndex(index: number) {\n    this.form1.controls.demo1.controls[index].updateValueAndValidity();\n  }\n}",
  );
  readonly firstTaskHtml = highlight(
    `<form clrForm [formGroup]="form1">
  <ng-container formArrayName="demo1">
    @for (control of form1.controls.demo1.controls; track $index; let i = $index) {
      <clr-input-container>
        <label [for]="'unique-control-' + i">Control {{ i + 1 }}</label>
        <input
          [id]="'unique-control-' + i"
          clrInput
          type="text"
          [formControlName]="i"
          (blur)="validateControlByIndex(i)"
        />
        <clr-control-helper>Control value should be unique</clr-control-helper>
        <clr-control-error *clrIfError="'notUnique'">Duplicated</clr-control-error>
      </clr-input-container>
    }
  </ng-container>
  <button type="button" class="btn btn-sm btn-outline" (click)="form1.reset()">Clear</button>
  <output aria-live="polite">{{ form1.status }}</output>
</form>`,
  );
  private fb = inject(FormBuilder);
  private translationService = inject(TranslationService);

  parameters = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'key',
        type: 'string',
        default: 'undefined',
        description: this.translationService.translate('uniqueValidator.paramKey'),
      },
    ];
  });
  form1 = this.fb.group({
    demo1: this.fb.array([this.fb.control(null), this.fb.control('')], UniqueValidator.unique()),
  });

  validateControlByIndex(index: number) {
    this.form1.controls.demo1.controls[index].updateValueAndValidity();
  }

  example1Code = highlight(`import {UniqueValidator} from 'ngx-lift';
import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form1">
      <ng-container formArrayName="demo1">
        @for (control of form1.controls.demo1.controls; track $index; let i = $index) {
          <clr-input-container>
            <label [attr.for]="i">Control {{ i + 1 }}</label>
            <input clrInput type="text" [formControlName]="i" (blur)="validateControlByIndex(i)" />
            <clr-control-helper>Control value should be unique</clr-control-helper>
            <clr-control-error *clrIfError="'notUnique'">Duplicated</clr-control-error>
          </clr-input-container>
        }
      </ng-container>
    </form>
  \`,
})
export class UniqueValidatorExampleComponent {
  private fb = inject(FormBuilder);

  form1 = this.fb.group({
    demo1: this.fb.array([this.fb.control(''), this.fb.control('')], UniqueValidator.unique()),
  });

  validateControlByIndex(index: number) {
    this.form1.controls.demo1.controls[index].updateValueAndValidity();
  }
}`);

  form2 = this.fb.group({
    demo2: this.fb.array(
      [this.fb.group({key: '', value: ''}), this.fb.group({key: '', value: ''})],
      UniqueValidator.unique((control) => (control as FormGroup<{key: FormControl<string>}>).controls.key),
    ),
  });

  validateControl(control: AbstractControl) {
    control.updateValueAndValidity();
  }

  example2Code = highlight(`import {UniqueValidator} from 'ngx-lift';
import {Component, inject} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form2">
      <ng-container formArrayName="demo2">
        @for (group of form2.controls.demo2.controls; track $index; let i = $index) {
          <div [formGroup]="group" cds-layout="horizontal gap:md">
            <clr-input-container>
              <label class="clr-sr-only">key</label>
              <input
                clrInput
                [formControl]="group.controls.key"
                (blur)="validateControl(group.controls.key)"
                [size]="30"
              />
              <clr-control-helper>key control should be unique</clr-control-helper>
              <clr-control-error *clrIfError="'notUnique'">Duplicated</clr-control-error>
            </clr-input-container>
            <clr-input-container>
              <label class="clr-sr-only">value</label>
              <input clrInput [formControl]="group.controls.value" [size]="30" />
              <clr-control-helper>value control has not validation</clr-control-helper>
            </clr-input-container>
          </div>
        }
      </ng-container>
    </form>
  \`,
})
export class UniqueValidatorFormGroupExampleComponent {
  private fb = inject(FormBuilder);

  form2 = this.fb.group({
    demo2: this.fb.array(
      [this.fb.group({key: '', value: ''}), this.fb.group({key: '', value: ''})],
      UniqueValidator.unique((control) => (control as FormGroup<{key: FormControl<string>}>).controls.key),
    ),
  });

  validateControl(control: AbstractControl) {
    control.updateValueAndValidity();
  }
}`);

  signatureCode = highlight(`declare class UniqueValidator {
  static unique(controlSelector?: (control: AbstractControl) => AbstractControl): ValidatorFn;
}`);
}
