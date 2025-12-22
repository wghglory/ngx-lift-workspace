import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClrLift } from './clr-lift';

describe('ClrLift', () => {
  let component: ClrLift;
  let fixture: ComponentFixture<ClrLift>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClrLift],
    }).compileComponents();

    fixture = TestBed.createComponent(ClrLift);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
