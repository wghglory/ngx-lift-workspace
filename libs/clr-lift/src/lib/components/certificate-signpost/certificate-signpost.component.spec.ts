import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TranslationService} from '../../services/translation.service';
import {MockTranslationService} from '../../services/translation.service.mock';
import {CertificateService} from './certificate.service';
import {CertificateSignpostComponent} from './certificate-signpost.component';

describe('CertificateSignpostComponent', () => {
  let component: CertificateSignpostComponent;
  let fixture: ComponentFixture<CertificateSignpostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CertificateSignpostComponent],
      providers: [{provide: TranslationService, useClass: MockTranslationService}, CertificateService],
    });
    fixture = TestBed.createComponent(CertificateSignpostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
