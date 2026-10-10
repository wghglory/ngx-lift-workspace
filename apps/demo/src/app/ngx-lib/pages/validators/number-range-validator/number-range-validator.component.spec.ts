import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NumberRangeValidatorComponent} from './number-range-validator.component';

describe('NumberRangeValidatorComponent', () => {
  let component: NumberRangeValidatorComponent;
  let fixture: ComponentFixture<NumberRangeValidatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumberRangeValidatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NumberRangeValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
