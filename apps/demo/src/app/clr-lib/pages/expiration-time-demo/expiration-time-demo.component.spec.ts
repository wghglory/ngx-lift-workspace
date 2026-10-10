import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ExpirationTimeDemoComponent} from './expiration-time-demo.component';

describe('ExpirationTimeDemoComponent', () => {
  let component: ExpirationTimeDemoComponent;
  let fixture: ComponentFixture<ExpirationTimeDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpirationTimeDemoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpirationTimeDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
