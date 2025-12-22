import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UniqueValidatorComponent} from './unique-validator.component';

describe('UniqueValidatorComponent', () => {
  let component: UniqueValidatorComponent;
  let fixture: ComponentFixture<UniqueValidatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UniqueValidatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UniqueValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
