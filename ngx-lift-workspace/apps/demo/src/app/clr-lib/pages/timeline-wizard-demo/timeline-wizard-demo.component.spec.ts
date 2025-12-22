import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { TimelineWizardDemoComponent } from './timeline-wizard-demo.component';

describe('TimelineWizardDemoComponent', () => {
  let component: TimelineWizardDemoComponent;
  let fixture: ComponentFixture<TimelineWizardDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelineWizardDemoComponent],
      providers: [provideRouter([]), provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(TimelineWizardDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
