import {ComponentFixture, TestBed} from '@angular/core/testing';

import {IdleDetectionDemoComponent} from './idle-detection-demo.component';

describe('IdleDetectionDemoComponent', () => {
  let component: IdleDetectionDemoComponent;
  let fixture: ComponentFixture<IdleDetectionDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdleDetectionDemoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IdleDetectionDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
