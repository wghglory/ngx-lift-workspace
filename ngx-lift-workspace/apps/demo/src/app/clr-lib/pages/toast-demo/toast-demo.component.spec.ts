import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ToastDemoComponent} from './toast-demo.component';

describe('ToastDemoComponent', () => {
  let component: ToastDemoComponent;
  let fixture: ComponentFixture<ToastDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastDemoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
