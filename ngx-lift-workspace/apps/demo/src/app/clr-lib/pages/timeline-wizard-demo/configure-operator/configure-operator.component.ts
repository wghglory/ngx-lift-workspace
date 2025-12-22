import {Component, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {TimelineBaseComponent, TimelineWizardService} from 'clr-lift';

import {Deployment} from '../deployment.type';

@Component({
  selector: 'app-configure-operator',
  standalone: true,
  imports: [ClarityModule, ReactiveFormsModule],
  templateUrl: './configure-operator.component.html',
  styleUrl: './configure-operator.component.scss',
})
export class ConfigureOperatorComponent extends TimelineBaseComponent<Deployment['operator']> implements OnInit {
  override form = new FormGroup({
    operator: new FormGroup({
      name: new FormControl('', [Validators.required]),
      namespace: new FormControl('', [Validators.required]),
    }),
  });

  timelineWizardService = inject(TimelineWizardService);
  stepData = this.timelineWizardService.getStepData<Pick<Deployment, 'operator'>>('operator');

  constructor() {
    super();

    // currentStepData shape comes from TimelineBaseComponent<Deployment['operator']>.
    console.log(this.currentStepData); // not available at the time
    console.log(this.stepData); // available from service
  }

  ngOnInit() {
    console.log(this.currentStepData); // will receive the @Input data
    console.log(this.stepData); // available from service
  }
}
