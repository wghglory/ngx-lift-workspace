import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';

import {ScrollToStepTopDemoComponent} from './scroll-to-step-top-demo.component';

describe('ScrollToStepTopDemoComponent', () => {
  let component: ScrollToStepTopDemoComponent;
  let fixture: ComponentFixture<ScrollToStepTopDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrollToStepTopDemoComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(ScrollToStepTopDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
