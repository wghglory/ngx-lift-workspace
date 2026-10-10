import {ComponentFixture, TestBed} from '@angular/core/testing';

import {Dns1123SubdomainValidatorComponent} from './dns1123-subdomain-validator.component';

describe('Dns1123SubdomainValidatorComponent', () => {
  let component: Dns1123SubdomainValidatorComponent;
  let fixture: ComponentFixture<Dns1123SubdomainValidatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dns1123SubdomainValidatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Dns1123SubdomainValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
