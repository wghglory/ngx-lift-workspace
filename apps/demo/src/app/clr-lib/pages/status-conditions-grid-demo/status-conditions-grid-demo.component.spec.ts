import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';

import {StatusConditionsGridDemoComponent} from './status-conditions-grid-demo.component';

describe('StatusConditionsGridDemoComponent', () => {
  let component: StatusConditionsGridDemoComponent;
  let fixture: ComponentFixture<StatusConditionsGridDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusConditionsGridDemoComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusConditionsGridDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
