import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RangePipeComponent} from './range-pipe.component';

describe('RangePipeComponent', () => {
  let component: RangePipeComponent;
  let fixture: ComponentFixture<RangePipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RangePipeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RangePipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
