import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClrTimelineStepState } from '@clr/angular';
import { TimelineWizardService } from 'clr-lift';

import { ConfigureReviewComponent } from './configure-review.component';
import { Deployment } from '../deployment.type';
import { ConfigureOperatorComponent } from '../configure-operator/configure-operator.component';
import { ConfigureServiceComponent } from '../configure-service/configure-service.component';
import { ConfigureRuntimePropComponent } from '../configure-runtime-prop/configure-runtime-prop.component';

describe('ConfigureReviewComponent', () => {
  let component: ConfigureReviewComponent;
  let fixture: ComponentFixture<ConfigureReviewComponent>;
  let timelineWizardService: TimelineWizardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConfigureReviewComponent],
      providers: [TimelineWizardService, provideHttpClient(), provideHttpClientTesting()],
    });

    timelineWizardService = TestBed.inject(TimelineWizardService);
    // Set up the service with all required steps
    timelineWizardService.steps = [
      {
        id: 'operator',
        title: 'Configure Operator',
        state: ClrTimelineStepState.SUCCESS,
        component: ConfigureOperatorComponent,
        data: {
          operator: {
            name: '',
            namespace: '',
          },
        } as Pick<Deployment, 'operator'>,
      },
      {
        id: 'service',
        title: 'Configure Service',
        state: ClrTimelineStepState.SUCCESS,
        component: ConfigureServiceComponent,
        data: {
          service: {
            cpu: '',
            replicas: '',
            url: '',
          },
        } as Pick<Deployment, 'service'>,
      },
      {
        id: 'runtime-properties',
        title: 'Configure Runtime Properties',
        state: ClrTimelineStepState.SUCCESS,
        component: ConfigureRuntimePropComponent,
        data: {
          appProperties: [],
        } as { appProperties: Array<{ key: string; value: string }> },
      },
    ];

    fixture = TestBed.createComponent(ConfigureReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
