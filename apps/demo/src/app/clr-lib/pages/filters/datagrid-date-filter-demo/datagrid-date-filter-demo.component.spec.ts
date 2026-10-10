import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';

import {DatagridDateFilterDemoComponent} from './datagrid-date-filter-demo.component';

describe('DatagridDateFilterDemoComponent', () => {
  let component: DatagridDateFilterDemoComponent;
  let fixture: ComponentFixture<DatagridDateFilterDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatagridDateFilterDemoComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(DatagridDateFilterDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
