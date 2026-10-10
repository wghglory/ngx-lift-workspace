import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TouchedAndInvalidComponent} from './touched-and-invalid.component';

describe('TouchedAndInvalidComponent', () => {
  let component: TouchedAndInvalidComponent;
  let fixture: ComponentFixture<TouchedAndInvalidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TouchedAndInvalidComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TouchedAndInvalidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
