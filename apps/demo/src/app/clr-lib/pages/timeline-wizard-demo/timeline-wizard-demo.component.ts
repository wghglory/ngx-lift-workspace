import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ClrTimelineStepState} from '@clr/angular';
import {CalloutComponent, PageContainerComponent, TimelineStep, TimelineWizardComponent} from 'clr-lift';

import {CodeBlockComponent} from '../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../shared/utils/highlight.util';
import {ConfigureOperatorComponent} from './configure-operator/configure-operator.component';
import {ConfigureReviewComponent} from './configure-review/configure-review.component';
import {ConfigureRuntimePropComponent} from './configure-runtime-prop/configure-runtime-prop.component';
import {ConfigureServiceComponent} from './configure-service/configure-service.component';
import {Deployment} from './deployment.type';

@Component({
  selector: 'app-timeline-wizard-demo',
  imports: [CodeBlockComponent, CalloutComponent, PageContainerComponent, TimelineWizardComponent, RouterLink],
  templateUrl: './timeline-wizard-demo.component.html',
  styleUrl: './timeline-wizard-demo.component.scss',
})
export class TimelineWizardDemoComponent {
  // simulate an API response
  initialData: Deployment = {
    operator: {
      name: 'my-operator',
      namespace: 'operator-namespace',
    },
    service: {
      cpu: 2,
      replicas: 4,
      url: 'https://example.service.com',
    },
    appProperties: {
      'java.runtime.debug': 'true',
    },
  };

  readonly timelineSteps: TimelineStep[] = [
    {
      state: ClrTimelineStepState.CURRENT,
      title: 'Configure Operator',
      id: 'operator',
      component: ConfigureOperatorComponent,
      data: {operator: this.initialData.operator},
    },
    {
      state: ClrTimelineStepState.NOT_STARTED,
      title: 'Configure Service',
      id: 'service',
      component: ConfigureServiceComponent,
      data: {service: this.initialData.service},
    },
    {
      state: ClrTimelineStepState.NOT_STARTED,
      title: 'Configure Runtime Properties', // use title to find the step, id is optional
      component: ConfigureRuntimePropComponent,
      data: {appProperties: this.initialData.appProperties},
    },
    {
      state: ClrTimelineStepState.NOT_STARTED,
      title: 'Review',
      component: ConfigureReviewComponent,
    },
  ];

  onCanceled() {
    window.alert('canceled');
  }

  onConfirmed(data: unknown) {
    window.alert('confirmed to submit, you can see form data from console. Simulate API request');
    console.log(data);
  }

  onFinished() {
    window.alert('finished');
  }

  wizardCode = highlight(`
import {ClrTimelineStepState} from '@clr/angular';
import {TimelineStep, TimelineWizardComponent} from 'clr-lift';
import {Deployment} from './deployment.type';

@Component({
  imports: [TimelineWizardComponent],
  template: \`
    <cll-timeline-wizard
      [timelineSteps]="timelineSteps"
      (canceled)="onCanceled()"
      (confirmed)="onConfirmed($event)"
      (finished)="onFinished()"
    ></cll-timeline-wizard>
  \`
})
export class TimelineWizardDemoComponent {
  // simulate an API response. These values will be set into step forms.
  initialData: Deployment = {
    operator: {
      name: 'my-operator',
      namespace: 'operator-namespace',
    },
    service: {
      cpu: 2,
      replicas: 4,
      url: 'https://example.service.com',
    },
    appProperties: {
      'java.runtime.debug': 'true',
    },
  };

  readonly timelineSteps: TimelineStep[] = [
    {
      state: ClrTimelineStepState.CURRENT,
      title: 'Configure Operator',
      id: 'operator', // use id to find the step data
      component: ConfigureOperatorComponent,
      data: {operator: this.initialData.operator},
    },
    {
      state: ClrTimelineStepState.NOT_STARTED,
      title: 'Configure Service',
      id: 'service',
      component: ConfigureServiceComponent,
      data: {service: this.initialData.service},
    },
    {
      state: ClrTimelineStepState.NOT_STARTED,
      title: 'Configure Runtime Properties', // use title to find the step, id is optional
      component: ConfigureRuntimePropComponent,
      data: {appProperties: this.initialData.appProperties},
    },
    {
      state: ClrTimelineStepState.NOT_STARTED,
      title: 'Review',
      component: ConfigureReviewComponent,
    },
  ];

  onCanceled() {
    window.alert('canceled');
  }

  onConfirmed(data: unknown) {
    window.alert('confirmed to submit, you can see form data from console. Simulate API request');
    console.log(data);
  }

  onFinished() {
    window.alert('finished');
  }
}
  `);

  deploymentTypeCode = highlight(`
export type Deployment = {
  operator: {
    name: string;
    namespace: string;
  };
  service: {
    cpu: number;
    replicas: number;
    url: string;
  };
  appProperties: Record<string, string>;
};
    `);

  operatorCode = highlight(`
import {TimelineBaseComponent, TimelineWizardService} from 'clr-lift';
import {Component, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Deployment} from '../deployment.type';

@Component({
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form">
      <p class="clr-required-mark">Required Information</p>
      <clr-input-container>
        <label class="clr-required-mark">Name</label>
        <input type="text" clrInput [formControl]="form.controls.operator.controls.name" />
        <clr-control-error> Required </clr-control-error>
      </clr-input-container>
      <clr-input-container>
        <label class="clr-required-mark">Namespace</label>
        <input type="text" clrInput [formControl]="form.controls.operator.controls.namespace" />
        <clr-control-error> Required </clr-control-error>
      </clr-input-container>
    </form>
  \`
})
export class ConfigureOperatorComponent extends TimelineBaseComponent<Deployment['operator']> implements OnInit {
  private timelineWizardService = inject(TimelineWizardService);

  override form = new FormGroup({
    operator: new FormGroup({
      name: new FormControl('', [Validators.required]),
      namespace: new FormControl('', [Validators.required]),
    }),
  });

  // use id 'operator' to find the step
  stepData = this.timelineWizardService.getStepData<Pick<Deployment, 'operator'>>('operator');

  constructor() {
    super();
    // currentStepData shape comes from TimelineBaseComponent<Deployment['operator']>.
    // Note: currentStepData is not available in constructor, use ngOnInit instead
  }

  ngOnInit() {
    // currentStepData will receive the @Input data here
    console.log(this.currentStepData);
    console.log(this.stepData); // also available from service
  }
}
  `);

  serviceCode = highlight(`
import {TimelineBaseComponent} from 'clr-lift';
import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Deployment} from '../deployment.type';

@Component({
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form">
      <clr-input-container>
        <label class="clr-required-mark">CPU</label>
        <input type="number" clrInput [formControl]="form.controls.cpu" />
        <clr-control-error> Required </clr-control-error>
      </clr-input-container>
      <clr-input-container>
        <label class="clr-required-mark">Replicas</label>
        <input type="number" clrInput [formControl]="form.controls.replicas" />
        <clr-control-error> Required </clr-control-error>
      </clr-input-container>
      <clr-input-container>
        <label class="clr-required-mark">URL</label>
        <input type="url" clrInput [formControl]="form.controls.url" />
        <clr-control-error> Required </clr-control-error>
      </clr-input-container>
    </form>
  \`
})
export class ConfigureServiceComponent extends TimelineBaseComponent<Deployment['service']> {
  override form = new FormGroup({
    cpu: new FormControl('', [Validators.required]),
    replicas: new FormControl('', [Validators.required]),
    url: new FormControl('https://default-url.com', [Validators.required]),
  });

  override formValueToData() {
    return {service: this.form.value};
  }

  override dataToFormValue(data: any): Record<string, any> {
    return data.service;
  }
}
  `);

  runtimePropsCode = highlight(`
import {KeyValueInputsComponent, TimelineBaseComponent} from 'clr-lift';
import {Component, inject} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';

type RuntimePropStepData = {appProperties: Array<{key: string; value: string}>};

@Component({
  imports: [KeyValueInputsComponent, ReactiveFormsModule],
  template: \`
    <form [formGroup]="form">
      <cll-key-value-inputs
        [formArray]="form.controls.appProperties"
        [inputSize]="50"
        [data]="currentStepData?.appProperties!"
      />
    </form>
  \`
})
export class ConfigureRuntimePropComponent extends TimelineBaseComponent<RuntimePropStepData> {
  private fb = inject(FormBuilder);

  override form = this.fb.group({
    appProperties: this.fb.array<
      FormGroup<{
        key: FormControl<string>;
        value: FormControl<string>;
      }>
    >([]),
  });

  override formValueToData(): {appProperties: Record<string, string>} {
    const keyValuePairArray = this.form.controls.appProperties.value;
    const props: Record<string, string> = {};
    keyValuePairArray.forEach((kv) => {
      if (kv.key && kv.value) {
        props[kv.key] = kv.value;
      }
    });
    return {appProperties: props};
  }

  override dataToFormValue(data: {appProperties: Record<string, string>}): RuntimePropStepData {
    return {
      appProperties: Object.keys(data.appProperties).map((key) => {
        return {key, value: data.appProperties[key]};
      }),
    };
  }
}
  `);

  reviewCode = highlight(`
import {TimelineBaseComponent, TimelineWizardService} from 'clr-lift';
import {Component, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Deployment} from '../deployment.type';

@Component({
  template: \`
    <div>
      <h3>Review Configuration</h3>
      <p>Operator: {{ operatorStep?.operator?.name }}</p>
      <p>Service: {{ serviceStep?.service?.url }}</p>
      <p>Runtime Properties: {{ runtimePropertiesStep?.appProperties | json }}</p>
    </div>
  \`
})
export class ConfigureReviewComponent extends TimelineBaseComponent {
  private timelineWizardService = inject(TimelineWizardService);
  private http = inject(HttpClient);

  override next$ = this.submitAPI();

  get operatorStep() {
    // still support to use title to find the step though id exists.
    return this.timelineWizardService.getStepData<Pick<Deployment, 'operator'>>('Configure Operator');
  }
  get serviceStep() {
    return this.timelineWizardService.getStepData<Pick<Deployment, 'service'>>('Configure Service');
  }
  get runtimePropertiesStep() {
    return this.timelineWizardService.getStepData<Pick<Deployment, 'appProperties'>>('Configure Runtime Properties');
  }

  private submitAPI() {
    return this.http.post('your-api', this.buildPayload());
  }

  private buildPayload() {
    const formSpec = this.timelineWizardService.allStepsData.reduce(
      (accumulator, currentStep) => ({...accumulator, ...currentStep.data}),
      {},
    );

    return formSpec;
  }
}
  `);
}
