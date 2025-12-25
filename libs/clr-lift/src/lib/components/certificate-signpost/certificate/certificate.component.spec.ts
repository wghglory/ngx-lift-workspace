import {ComponentFixture, TestBed} from '@angular/core/testing';
import {pki} from 'node-forge';

import {TranslationService} from '../../../services/translation.service';
import {MockTranslationService} from '../../../services/translation.service.mock';
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

    const cert = pki.createCertificate();
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.issuer.attributes = [{name: 'string', value: 'string'}];
    cert.subject.attributes = [{name: 'string', value: 'string'}];

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
