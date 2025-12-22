import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RockStarComponent} from './rock-star.component';

describe('RockStarComponent', () => {
  let component: RockStarComponent;
  let fixture: ComponentFixture<RockStarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RockStarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RockStarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
