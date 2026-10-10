import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';

import {DatagridNumericFilterDemoComponent} from './datagrid-numeric-filter-demo.component';

describe('DatagridNumericFilterDemoComponent', () => {
  let component: DatagridNumericFilterDemoComponent;
  let fixture: ComponentFixture<DatagridNumericFilterDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatagridNumericFilterDemoComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(DatagridNumericFilterDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
