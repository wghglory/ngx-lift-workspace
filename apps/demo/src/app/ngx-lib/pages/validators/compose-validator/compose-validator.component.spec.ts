import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ComposeValidatorComponent} from './compose-validator.component';

describe('ComposeValidatorComponent', () => {
  let component: ComposeValidatorComponent;
  let fixture: ComponentFixture<ComposeValidatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComposeValidatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ComposeValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
