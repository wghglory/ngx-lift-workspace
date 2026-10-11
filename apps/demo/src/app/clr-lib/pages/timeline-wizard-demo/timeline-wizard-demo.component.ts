import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ClrTimelineStepState} from '@clr/angular';
import {CalloutComponent, PageContainerComponent, TimelineStep, TimelineWizardComponent, TranslatePipe} from 'clr-lift';

import {CodeBlockComponent} from '../../../shared/components/code-block/code-block.component';
import {DemoPlaygroundComponent} from '../../../shared/components/demo-playground/demo-playground.component';
import {ApiProperty, ApiTableComponent} from '../../../shared/components/api-table';
import {highlight} from '../../../shared/utils/highlight.util';
import {ConfigureOperatorComponent} from './configure-operator/configure-operator.component';
import {ConfigureReviewComponent} from './configure-review/configure-review.component';
import {ConfigureRuntimePropComponent} from './configure-runtime-prop/configure-runtime-prop.component';
import {ConfigureServiceComponent} from './configure-service/configure-service.component';
import {Deployment} from './deployment.type';

@Component({
  selector: 'app-timeline-wizard-demo',
  imports: [
    CodeBlockComponent,
    CalloutComponent,
    PageContainerComponent,
    TimelineWizardComponent,
    RouterLink,
    DemoPlaygroundComponent,
    TranslatePipe,
    ApiTableComponent,
  ],
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

  readonly wizardInputs: ApiProperty[] = [
    {
      name: 'timelineSteps',
      type: 'TimelineStep[]',
      required: true,
      description: 'An array of <code>TimelineStep</code> objects representing the steps in the wizard.',
    },
    {
      name: 'live',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Controls whether to destroy step components when clicking prev/next buttons.',
    },
    {
      name: 'confirmButtonText',
      type: 'string',
      defaultValue: "'Finish'",
      description: 'The text for the "Finish" button on the last step.',
    },
  ];

  readonly wizardOutputs: ApiProperty[] = [
    {
      name: 'confirmed',
      type: 'EventEmitter<unknown>',
      description: "Emits all previous steps' data when clicking the finish button in the last step.",
    },
    {
      name: 'canceled',
      type: 'EventEmitter<void>',
      description: 'Emits when the wizard is canceled.',
    },
    {
      name: 'finished',
      type: 'EventEmitter<void>',
      description: 'Emits when the wizard is successfully completed.',
    },
  ];

  readonly wizardMethods: ApiProperty[] = [
    {
      name: 'cancel()',
      type: 'void',
      description: 'Cancels the wizard and emits the <code>canceled</code> event.',
    },
    {
      name: 'nextStep()',
      type: 'void',
      description: 'Moves to the next step in the wizard.',
    },
    {
      name: 'previousStep()',
      type: 'void',
      description: 'Moves to the previous step in the wizard.',
    },
  ];

  readonly baseProperties: ApiProperty[] = [
    {
      name: 'allStepsData',
      type: 'unknown[]',
      description:
        'An array containing the data of all wizard steps. Available as an input property, accessible in <code>ngOnInit</code> and later lifecycle hooks.',
    },
    {
      name: 'currentStepData',
      type: 'T | null',
      description:
        'The data of the current step or <code>null</code> if not available. Available as an input property, accessible in <code>ngOnInit</code> and later lifecycle hooks.',
    },
    {
      name: 'form',
      type: 'FormGroup | null',
      description:
        'The form group associated with the step. Set to <code>null</code> for steps without a form. Override this property in your step component.',
    },
    {
      name: 'next$',
      type: 'Observable<unknown>',
      description:
        'An observable that emits when the "Next" button is clicked. Override it to perform custom actions, such as API calls.',
    },
    {
      name: 'stepInvalid',
      type: 'boolean',
      description: "Indicates whether the step's form is invalid.",
    },
  ];

  readonly baseMethods: ApiProperty[] = [
    {
      name: 'formValueToData()',
      type: 'unknown',
      description:
        "Converts the step's form value to data. Override this method if your form structure doesn't match the step data structure.",
    },
    {
      name: 'dataToFormValue(data)',
      type: 'any',
      description:
        "Converts step data to the form value that can be used for <code>patchValue</code>. Override this method if your form structure doesn't match the step data structure.",
    },
  ];

  readonly stepProperties: ApiProperty[] = [
    {
      name: 'state',
      type: 'ClrTimelineStepState',
      description: "The state of the timeline step (e.g., 'not-started', 'current', 'success', 'error').",
    },
    {
      name: 'header',
      type: 'string',
      description: 'The header of the timeline step.',
    },
    {
      name: 'title',
      type: 'string',
      required: true,
      description:
        'The title of the timeline step, acting as an identifier (should be unique). Can be used to find step data via <code>getStepData</code>.',
    },
    {
      name: 'id',
      type: 'string',
      description:
        'The id of the timeline step, acting as a primary identifier. If id is not provided, will use title as identifier instead. Can be used to find step data via <code>getStepData</code>.',
    },
    {
      name: 'description',
      type: 'string',
      description: 'The description of the timeline step.',
    },
    {
      name: 'component',
      type: 'Type<any>',
      required: true,
      description:
        'The Angular component associated with the timeline step. Must extend <code>TimelineBaseComponent</code>.',
    },
    {
      name: 'data',
      type: 'unknown',
      description:
        'Step data, which will be converted to form data by the timeline wizard component and passed to the step component as <code>currentStepData</code>.',
    },
  ];

  readonly serviceProperties: ApiProperty[] = [
    {
      name: 'currentStepIndex',
      type: 'number',
      description: 'Get the index of the current step.',
    },
    {
      name: 'isFirstStep',
      type: 'boolean',
      description: 'Check if the current step is the first step.',
    },
    {
      name: 'isLastStep',
      type: 'boolean',
      description: 'Check if the current step is the last step.',
    },
    {
      name: 'currentStep',
      type: 'TimelineStep | null',
      description: 'Get the current step object.',
    },
    {
      name: 'currentStepData',
      type: 'unknown | null',
      description: 'Get the data of the current step.',
    },
    {
      name: 'allStepsData',
      type: 'Array<{id?: string; title: string; data: unknown}>',
      description: 'Get all steps data to be reviewed. Returns an array with step identifiers and data.',
    },
  ];

  readonly serviceMethods: ApiProperty[] = [
    {
      name: 'getStepData<T>(key: string)',
      type: 'T | null',
      description:
        'Get the data of a specific step by its id or title. Returns <code>null</code> if the step is not found.',
    },
  ];
}
