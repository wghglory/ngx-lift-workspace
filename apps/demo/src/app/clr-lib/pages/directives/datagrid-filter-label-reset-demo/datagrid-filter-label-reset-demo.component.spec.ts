import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';

import {DatagridFilterLabelResetDemoComponent} from './datagrid-filter-label-reset-demo.component';

describe('DatagridFilterLabelResetDemoComponent', () => {
  let component: DatagridFilterLabelResetDemoComponent;
  let fixture: ComponentFixture<DatagridFilterLabelResetDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatagridFilterLabelResetDemoComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(DatagridFilterLabelResetDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
