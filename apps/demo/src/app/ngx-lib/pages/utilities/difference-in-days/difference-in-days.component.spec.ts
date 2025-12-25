import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DifferenceInDaysComponent} from './difference-in-days.component';

describe('DifferenceInDaysComponent', () => {
  let component: DifferenceInDaysComponent;
  let fixture: ComponentFixture<DifferenceInDaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DifferenceInDaysComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DifferenceInDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
