import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PickByComponent} from './pick-by.component';

describe('PickByComponent', () => {
  let component: PickByComponent;
  let fixture: ComponentFixture<PickByComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PickByComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PickByComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
