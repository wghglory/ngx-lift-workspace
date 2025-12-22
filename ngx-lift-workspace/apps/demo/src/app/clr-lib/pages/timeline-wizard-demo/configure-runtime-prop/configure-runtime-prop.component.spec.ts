import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TimelineWizardService} from 'clr-lift';

import {ConfigureRuntimePropComponent} from './configure-runtime-prop.component';

describe('ConfigureRuntimePropComponent', () => {
  let component: ConfigureRuntimePropComponent;
  let fixture: ComponentFixture<ConfigureRuntimePropComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConfigureRuntimePropComponent],
      providers: [TimelineWizardService],
    });
    fixture = TestBed.createComponent(ConfigureRuntimePropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
