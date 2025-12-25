import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DateRangeValidatorComponent} from './date-range-validator.component';

describe('DateRangeValidatorComponent', () => {
  let component: DateRangeValidatorComponent;
  let fixture: ComponentFixture<DateRangeValidatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateRangeValidatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DateRangeValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
