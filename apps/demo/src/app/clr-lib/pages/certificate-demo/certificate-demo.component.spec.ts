import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CertificateDemoComponent} from './certificate-demo.component';

describe('CertificateDemoComponent', () => {
  let component: CertificateDemoComponent;
  let fixture: ComponentFixture<CertificateDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificateDemoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CertificateDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
