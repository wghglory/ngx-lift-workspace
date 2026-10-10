import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ScrollIntoViewComponent} from './scroll-into-view.component';

describe('ScrollIntoViewComponent', () => {
  let component: ScrollIntoViewComponent;
  let fixture: ComponentFixture<ScrollIntoViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrollIntoViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScrollIntoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
