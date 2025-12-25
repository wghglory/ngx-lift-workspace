import {ComponentFixture, TestBed} from '@angular/core/testing';

import {StatusIndicatorDemoComponent} from './status-indicator-demo.component';

describe('StatusIndicatorDemoComponent', () => {
  let component: StatusIndicatorDemoComponent;
  let fixture: ComponentFixture<StatusIndicatorDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusIndicatorDemoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusIndicatorDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
