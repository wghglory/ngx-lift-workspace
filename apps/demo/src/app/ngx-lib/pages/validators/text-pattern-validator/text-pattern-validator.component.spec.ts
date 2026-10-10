import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TextPatternValidatorComponent} from './text-pattern-validator.component';

describe('TextPatternValidatorComponent', () => {
  let component: TextPatternValidatorComponent;
  let fixture: ComponentFixture<TextPatternValidatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextPatternValidatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TextPatternValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
