import {ComponentFixture, TestBed} from '@angular/core/testing';

import {IntegerValidatorComponent} from './integer-validator.component';

describe('IntegerValidatorComponent', () => {
  let component: IntegerValidatorComponent;
  let fixture: ComponentFixture<IntegerValidatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntegerValidatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IntegerValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
