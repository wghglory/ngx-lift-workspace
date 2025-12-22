import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ArrayJoinPipeComponent} from './array-join-pipe.component';

describe('ArrayJoinPipeComponent', () => {
  let component: ArrayJoinPipeComponent;
  let fixture: ComponentFixture<ArrayJoinPipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArrayJoinPipeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ArrayJoinPipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
