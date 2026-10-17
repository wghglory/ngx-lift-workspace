import {provideRouter} from '@angular/router';
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NgxLiftHomeComponent} from './ngx-lift-home.component';

describe('NgxLiftHomeComponent', () => {
  let component: NgxLiftHomeComponent;
  let fixture: ComponentFixture<NgxLiftHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([])],
      imports: [NgxLiftHomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxLiftHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
