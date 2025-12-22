import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ConfigureServiceComponent} from './configure-service.component';

describe('ConfigureServiceComponent', () => {
  let component: ConfigureServiceComponent;
  let fixture: ComponentFixture<ConfigureServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigureServiceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfigureServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
