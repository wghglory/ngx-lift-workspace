import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {PageContainerComponent} from 'clr-lift';
import {AutoSelectDirective} from 'ngx-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-auto-select',
  imports: [PageContainerComponent, ClarityModule, ReactiveFormsModule, AutoSelectDirective, CodeBlockComponent],
  templateUrl: './auto-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutoSelectComponent {
  regions = signal<string[]>(['us-west-1', 'us-east-1', 'eu-west-1']);

  form = new FormGroup({
    region: new FormControl<string | null>(null),
  });

  setSingle(): void {
    this.regions.set(['us-west-2 (Only Available Region)']);
  }

  setMultiple(): void {
    this.form.reset();
    this.regions.set(['us-west-1', 'us-east-1', 'eu-west-1']);
  }

  exampleCode = highlight(`
import {AutoSelectDirective} from 'ngx-lift';
import {Component, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule, AutoSelectDirective],
  template: \`
    <form [formGroup]="form">
      <select formControlName="region" [ngxAutoSelect]="regions()">
        <option [ngValue]="null">Select a region...</option>
        @for (region of regions(); track region) {
          <option [value]="region">{{ region }}</option>
        }
      </select>
    </form>
  \`
})
export class AutoSelectExampleComponent {
  regions = signal(['us-west-1', 'us-east-1']);
  form = new FormGroup({
    region: new FormControl(null),
  });
}
  `);

  signatureCode = highlight(`
@Directive({
  selector: '[ngxAutoSelect]',
})
export class AutoSelectDirective<T = unknown> {
  ngxAutoSelect = input.required<T[]>();
  compareWith = input<(a: T, b: T) => boolean>();
}
  `);
}
