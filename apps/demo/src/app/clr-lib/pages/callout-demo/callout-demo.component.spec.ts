import {provideRouter} from '@angular/router';
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CalloutDemoComponent} from './callout-demo.component';

describe('CalloutDemoComponent', () => {
  let component: CalloutDemoComponent;
  let fixture: ComponentFixture<CalloutDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([])],
      imports: [CalloutDemoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CalloutDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
