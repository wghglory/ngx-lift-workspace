import {Component, inject} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {CalloutComponent, PageContainerComponent} from 'clr-lift';
import {UniqueValidator} from 'ngx-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-unique-validator',
  standalone: true,
  imports: [ClarityModule, ReactiveFormsModule, PageContainerComponent, CalloutComponent, CodeBlockComponent],
  templateUrl: './unique-validator.component.html',
  styleUrl: './unique-validator.component.scss',
})
export class UniqueValidatorComponent {
  private fb = inject(FormBuilder);
  form1 = this.fb.group({
    demo1: this.fb.array([this.fb.control(null), this.fb.control('')], UniqueValidator.unique()),
  });

  validateControlByIndex(index: number) {
    this.form1.controls.demo1.controls[index].updateValueAndValidity();
  }

  example1 = highlight(`
@Component({
  template: \`
    <form clrForm [formGroup]="form1">
      <ng-container formArrayName="demo1">
        <clr-input-container *ngFor="let control of form1.controls.demo1.controls; let i = index">
          <label [attr.for]="i">Control {{ i + 1 }}</label>
          <input clrInput type="text" [formControlName]="i" (blur)="validateControlByIndex(i)" />
          <clr-control-helper>Control value should be unique</clr-control-helper>
          <clr-control-error *clrIfError="'notUnique'">Duplicated</clr-control-error>
        </clr-input-container>
      </ng-container>
    </form>
\`
})
export class DemoComponent {
  private fb = inject(FormBuilder);

  form1 = this.fb.group({
    demo1: this.fb.array([this.fb.control(''), this.fb.control('')], UniqueValidator.unique()),
  });

  validateControlByIndex(index: number) {
    this.form1.controls.demo1.controls[index].updateValueAndValidity();
  }
}
  `);

  form2 = this.fb.group({
    demo2: this.fb.array(
      [this.fb.group({key: '', value: ''}), this.fb.group({key: '', value: ''})],
      UniqueValidator.unique((control) => (control as FormGroup<{key: FormControl<string>}>).controls.key),
    ),
  });

  validateControl(control: AbstractControl) {
    control.updateValueAndValidity();
  }

  example2 = highlight(`
@Component({
  template: \`
    <form clrForm [formGroup]="form2">
      <ng-container formArrayName="demo2">
        <div
          *ngFor="let group of form2.controls.demo2.controls; let i = index"
          [formGroup]="group"
          style="display: flex; gap: 1rem"
        >
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
      </ng-container>
    </form>
\`
})
export class DemoComponent {
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
}
  `);
}
