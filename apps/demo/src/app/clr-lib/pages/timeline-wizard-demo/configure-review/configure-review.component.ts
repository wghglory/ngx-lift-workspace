import {KeyValuePipe} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TimelineBaseComponent, TimelineWizardService, TranslatePipe} from 'clr-lift';

import {Deployment} from '../deployment.type';

@Component({
  selector: 'app-configure-review',
  imports: [KeyValuePipe, TranslatePipe],
  templateUrl: './configure-review.component.html',
  styleUrls: ['./configure-review.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigureReviewComponent extends TimelineBaseComponent {
  private timelineWizardService = inject(TimelineWizardService);
  private http = inject(HttpClient);

  // use defer or iif is very important here so buildPayload has @Input() data
  // override next$ = defer(() => this.submitAPI());
  override next$ = this.submitAPI();

  get operatorStep() {
    return this.timelineWizardService.getStepData<Pick<Deployment, 'operator'>>('operator');
  }
  get serviceStep() {
    return this.timelineWizardService.getStepData<Pick<Deployment, 'service'>>('service');
  }
  get runtimePropertiesStep() {
    return this.timelineWizardService.getStepData<Pick<Deployment, 'appProperties'>>('runtime-properties');
  }

  private submitAPI() {
    return this.http.get(`https://randomuser.me/api`, this.buildPayload());
  }

  private buildPayload() {
    const formSpec = this.timelineWizardService.allStepsData.reduce(
      (accumulator, currentStep) => ({...accumulator, ...currentStep.data}),
      {},
    );

    return formSpec;
  }
}
