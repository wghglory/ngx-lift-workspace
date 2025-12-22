import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ConfigureRuntimePropComponent} from './configure-runtime-prop.component';

describe('ConfigureRuntimePropComponent', () => {
  let component: ConfigureRuntimePropComponent;
  let fixture: ComponentFixture<ConfigureRuntimePropComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConfigureRuntimePropComponent],
    });
    fixture = TestBed.createComponent(ConfigureRuntimePropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
