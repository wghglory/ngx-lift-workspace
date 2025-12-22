import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MergeFromComponent} from './merge-from.component';

describe('MergeFromComponent', () => {
  let component: MergeFromComponent;
  let fixture: ComponentFixture<MergeFromComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MergeFromComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MergeFromComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
