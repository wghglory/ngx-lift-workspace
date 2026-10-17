import {provideRouter} from '@angular/router';
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ClrDatagridUtilComponent} from './clr-datagrid-util.component';

describe('ClrDatagridUtilComponent', () => {
  let component: ClrDatagridUtilComponent;
  let fixture: ComponentFixture<ClrDatagridUtilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([])],
      imports: [ClrDatagridUtilComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClrDatagridUtilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
