import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MergeWithTrackComponent} from './merge-with-track.component';

describe('MergeWithTrackComponent', () => {
  let component: MergeWithTrackComponent;
  let fixture: ComponentFixture<MergeWithTrackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MergeWithTrackComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MergeWithTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
