import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SpinnerDemoComponent} from './spinner-demo.component';

describe('SpinnerDemoComponent', () => {
  let component: SpinnerDemoComponent;
  let fixture: ComponentFixture<SpinnerDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpinnerDemoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SpinnerDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
