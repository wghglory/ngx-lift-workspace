import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';

import {CertificateDemoComponent} from './certificate-demo.component';

describe('CertificateDemoComponent', () => {
  let component: CertificateDemoComponent;
  let fixture: ComponentFixture<CertificateDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificateDemoComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(CertificateDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
