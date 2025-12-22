import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClrTimelineStepState } from '@clr/angular';
import { TimelineWizardService } from 'clr-lift';

import { ConfigureOperatorComponent } from './configure-operator.component';
import { Deployment } from '../deployment.type';

describe('ConfigureOperatorComponent', () => {
  let component: ConfigureOperatorComponent;
  let fixture: ComponentFixture<ConfigureOperatorComponent>;
  let timelineWizardService: TimelineWizardService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigureOperatorComponent],
      providers: [TimelineWizardService],
    }).compileComponents();

    timelineWizardService = TestBed.inject(TimelineWizardService);
    // Set up the service with a step that has the 'operator' identifier
    timelineWizardService.steps = [
      {
        id: 'operator',
        state: ClrTimelineStepState.CURRENT,
        title: 'Configure Operator',
        component: ConfigureOperatorComponent,
        data: {
          operator: {
            name: '',
            namespace: '',
          },
        } as Pick<Deployment, 'operator'>,
      },
    ];

    fixture = TestBed.createComponent(ConfigureOperatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
