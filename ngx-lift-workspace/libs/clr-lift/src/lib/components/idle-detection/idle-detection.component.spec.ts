import {ComponentFixture, TestBed} from '@angular/core/testing';

import {IdleDetectionComponent} from './idle-detection.component';

describe('IdleDetectionComponent', () => {
  let component: IdleDetectionComponent;
  let fixture: ComponentFixture<IdleDetectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdleDetectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IdleDetectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
