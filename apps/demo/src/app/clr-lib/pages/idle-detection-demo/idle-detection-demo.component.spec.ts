import {InteractivityChecker} from '@angular/cdk/a11y';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ClarityModule} from '@clr/angular';

import {ClrIdleDetectionDemoComponent} from './idle-detection-demo.component';

describe('ClrIdleDetectionDemoComponent', () => {
  let component: ClrIdleDetectionDemoComponent;
  let fixture: ComponentFixture<ClrIdleDetectionDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClrIdleDetectionDemoComponent, ClarityModule],
    })
      .overrideProvider(InteractivityChecker, {
        useValue: {
          isFocusable: () => true,
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ClrIdleDetectionDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle simulation on and off', () => {
    expect(component.isMonitoring()).toBe(false);
    component.startSimulation();
    expect(component.isMonitoring()).toBe(true);
    expect(component.sessionStatus()).toBe('Active');

    component.stopSimulation();
    expect(component.isMonitoring()).toBe(false);
  });

  it('should handle timeout callback', () => {
    component.onTimeout();
    expect(component.sessionStatus()).toBe('Timeout Triggered');
    expect(component.timeoutCount()).toBe(1);
  });
});
