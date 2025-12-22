import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MultiAlertsDemoComponent} from './multi-alerts-demo.component';

describe('MultiAlertsDemoComponent', () => {
  let component: MultiAlertsDemoComponent;
  let fixture: ComponentFixture<MultiAlertsDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiAlertsDemoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MultiAlertsDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
