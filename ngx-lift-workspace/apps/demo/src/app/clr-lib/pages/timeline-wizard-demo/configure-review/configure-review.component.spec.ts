import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ConfigureReviewComponent} from './configure-review.component';

describe('ConfigureReviewComponent', () => {
  let component: ConfigureReviewComponent;
  let fixture: ComponentFixture<ConfigureReviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConfigureReviewComponent],
    });
    fixture = TestBed.createComponent(ConfigureReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
