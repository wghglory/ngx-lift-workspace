import {ComponentFixture, TestBed} from '@angular/core/testing';

import {IntersectionValidatorComponent} from './intersection-validator.component';

describe('IntersectionValidatorComponent', () => {
  let component: IntersectionValidatorComponent;
  let fixture: ComponentFixture<IntersectionValidatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntersectionValidatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IntersectionValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
