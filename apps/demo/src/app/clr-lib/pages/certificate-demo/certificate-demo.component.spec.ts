import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';

import {CertificateDemoComponent, signatureAlgorithmName} from './certificate-demo.component';

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

describe('signatureAlgorithmName', () => {
  it('uses standard display names for known RSA, ECDSA and Ed25519 OIDs', () => {
    expect(signatureAlgorithmName('1.2.840.113549.1.1.11')).toBe('SHA256 with RSA');
    expect(signatureAlgorithmName('1.2.840.10045.4.3.2')).toBe('ECDSA with SHA256');
    expect(signatureAlgorithmName('1.3.101.112')).toBe('Ed25519');
  });

  it('falls back to the raw OID for unknown algorithms', () => {
    expect(signatureAlgorithmName('1.2.3.4')).toBe('1.2.3.4');
  });
});
