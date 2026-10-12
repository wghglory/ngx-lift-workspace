import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {PageContainerComponent, ScrollToStepTopDirective} from 'clr-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-scroll-to-step-top-demo',
  imports: [ClarityModule, ReactiveFormsModule, PageContainerComponent, CodeBlockComponent, ScrollToStepTopDirective],
  templateUrl: './scroll-to-step-top-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollToStepTopDemoComponent {
  stepperForm = new FormGroup({
    step1: new FormGroup({
      clusterName: new FormControl('', [Validators.required]),
      region: new FormControl('us-west-2', [Validators.required]),
    }),
    step2: new FormGroup({
      nodes: new FormControl(3, [Validators.required, Validators.min(1)]),
      storageClass: new FormControl('', [Validators.required]),
    }),
    step3: new FormGroup({
      confirm: new FormControl(false, [Validators.requiredTrue]),
    }),
  });

  directiveUsageCode = highlight(`
<form clrStepper cllScrollToStepTop [formGroup]="form">
  <clr-stepper-panel formGroupName="step1">
    <clr-step-title>Step 1: Configuration</clr-step-title>
    <clr-step-content *clrIfExpanded>
      <clr-input-container>
        <label>Cluster Name</label>
        <input clrInput formControlName="clusterName" />
        <clr-control-error>Cluster name is required</clr-control-error>
      </clr-input-container>

      <button clrStepButton="next">Next</button>
    </clr-step-content>
  </clr-stepper-panel>

  <clr-stepper-panel formGroupName="step2">
    <clr-step-title>Step 2: Capacity</clr-step-title>
    <clr-step-content *clrIfExpanded>
      <!-- Step 2 Content -->
      <button clrStepButton="next">Next</button>
    </clr-step-content>
  </clr-stepper-panel>
</form>
  `);
}
