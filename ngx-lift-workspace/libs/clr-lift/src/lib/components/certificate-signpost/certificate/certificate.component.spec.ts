import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CertificateComponent} from './certificate.component';

describe('CertificateComponent', () => {
  let component: CertificateComponent;
  let fixture: ComponentFixture<CertificateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CertificateComponent],
    });
    fixture = TestBed.createComponent(CertificateComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('certificate', {
      validity: {
        notBefore: new Date(),
        notAfter: new Date(),
      },
      issuer: {
        attributes: [{name: 'string', value: 'string'}],
        hash: {md5: '', sha1: ''},
      },
      subject: {
        attributes: [{name: 'string', value: 'string'}],
        hash: {md5: '', sha1: ''},
      },
    });
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
