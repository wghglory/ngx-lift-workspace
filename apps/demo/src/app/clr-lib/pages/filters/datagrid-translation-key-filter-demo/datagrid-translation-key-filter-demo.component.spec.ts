import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';

import {DatagridTranslationKeyFilterDemoComponent} from './datagrid-translation-key-filter-demo.component';

describe('DatagridTranslationKeyFilterDemoComponent', () => {
  let component: DatagridTranslationKeyFilterDemoComponent;
  let fixture: ComponentFixture<DatagridTranslationKeyFilterDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatagridTranslationKeyFilterDemoComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(DatagridTranslationKeyFilterDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
