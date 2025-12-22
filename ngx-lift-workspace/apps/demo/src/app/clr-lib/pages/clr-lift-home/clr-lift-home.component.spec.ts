import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ClrLiftHomeComponent} from './clr-lift-home.component';

describe('ClrLiftHomeComponent', () => {
  let component: ClrLiftHomeComponent;
  let fixture: ComponentFixture<ClrLiftHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClrLiftHomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClrLiftHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
