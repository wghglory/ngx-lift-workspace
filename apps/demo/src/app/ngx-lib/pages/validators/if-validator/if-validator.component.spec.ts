import {ComponentFixture, TestBed} from '@angular/core/testing';

import {IfValidatorComponent} from './if-validator.component';

describe('IfValidatorComponent', () => {
  let component: IfValidatorComponent;
  let fixture: ComponentFixture<IfValidatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IfValidatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IfValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
