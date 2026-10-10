import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AutocompleteDemoComponent} from './autocomplete-demo.component';

describe('AutocompleteDemoComponent', () => {
  let component: AutocompleteDemoComponent;
  let fixture: ComponentFixture<AutocompleteDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutocompleteDemoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AutocompleteDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update selected value on selection', () => {
    component.onSelectedLanguage('Go');
    expect(component.selectedStandaloneValue()).toBe('Go');
  });
});
