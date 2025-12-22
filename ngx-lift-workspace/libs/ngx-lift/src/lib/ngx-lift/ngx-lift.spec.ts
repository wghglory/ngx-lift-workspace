import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxLift } from './ngx-lift';

describe('NgxLift', () => {
  let component: NgxLift;
  let fixture: ComponentFixture<NgxLift>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxLift],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxLift);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
