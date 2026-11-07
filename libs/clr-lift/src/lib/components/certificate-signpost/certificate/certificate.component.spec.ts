import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TranslationService} from '../../../services/translation.service';
import {MockTranslationService} from '../../../services/translation.service.mock';
import {X509Certificate} from '../certificate-parser';
import {CertificateComponent} from './certificate.component';

describe('CertificateComponent', () => {
  let component: CertificateComponent;
  let fixture: ComponentFixture<CertificateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CertificateComponent],
      providers: [{provide: TranslationService, useClass: MockTranslationService}],
    });
    fixture = TestBed.createComponent(CertificateComponent);
    component = fixture.componentInstance;

    const cert: X509Certificate = {
      serialNumber: '0',
      signatureAlgorithm: '1.2.840.113549.1.1.11',
      subject: {
        attributes: [{name: 'CN', value: 'example.com'}],
        getField: (name) => (name === 'CN' ? {name: 'CN', value: 'example.com'} : undefined),
      },
      issuer: {
        attributes: [{name: 'O', value: 'Example'}],
        getField: (name) => (name === 'O' ? {name: 'O', value: 'Example'} : undefined),
      },
      validity: {notBefore: new Date(), notAfter: new Date()},
    };

    fixture.componentRef.setInput('certificate', cert);
    fixture.componentRef.setInput('certificateStatus', {
      labelText: 'string',
      labelClass: 'string',
      status: 'info',
      shape: 'error-standard',
    });
    fixture.componentRef.setInput('hash', {md5: '', sha1: ''});

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
