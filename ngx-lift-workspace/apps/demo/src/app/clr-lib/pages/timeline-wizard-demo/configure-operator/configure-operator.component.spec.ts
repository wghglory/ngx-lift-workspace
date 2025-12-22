import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ConfigureOperatorComponent} from './configure-operator.component';

describe('ConfigureOperatorComponent', () => {
  let component: ConfigureOperatorComponent;
  let fixture: ComponentFixture<ConfigureOperatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigureOperatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfigureOperatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
