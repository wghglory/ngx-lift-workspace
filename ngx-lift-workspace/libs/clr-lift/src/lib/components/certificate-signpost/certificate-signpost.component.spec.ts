import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CertificateSignpostComponent} from './certificate-signpost.component';

describe('CertificateSignpostComponent', () => {
  let component: CertificateSignpostComponent;
  let fixture: ComponentFixture<CertificateSignpostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CertificateSignpostComponent],
    });
    fixture = TestBed.createComponent(CertificateSignpostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
