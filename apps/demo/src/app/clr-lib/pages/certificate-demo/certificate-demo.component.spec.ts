import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';

import {buildCertificateView, parseCertificateChain} from '../../../shared/utils/certificate-viewer-tools';
import {CertificateDemoComponent, certificateTabId, signatureAlgorithmName} from './certificate-demo.component';
import {DEMO_CHAIN_PEM} from './certificate-samples';

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

  it('gives every hierarchy node an id that matches a details tab', async () => {
    interface IdNode {
      id: string;
      children: IdNode[];
    }
    const collect = (nodes: IdNode[]): string[] => nodes.flatMap((node) => [node.id, ...collect(node.children)]);

    component.onPemInput(DEMO_CHAIN_PEM);
    await component.parseViewerPem();

    const result = component.viewerResult();
    expect(result?.tabs).toHaveLength(3);
    const tabIds = (result?.tabs.map((tab) => tab.id) ?? []).sort();
    const treeIds = collect((result?.tree ?? []) as IdNode[]).sort();
    expect(treeIds).toEqual(tabIds);
    expect(new Set(treeIds).size).toBe(3);
  });
});

describe('signatureAlgorithmName', () => {
  it('uses standard display names for known RSA, ECDSA and Ed25519 OIDs', () => {
    expect(signatureAlgorithmName('1.2.840.113549.1.1.11')).toBe('SHA256 with RSA');
    expect(signatureAlgorithmName('1.2.840.10045.4.3.2')).toBe('ECDSA with SHA256');
    expect(signatureAlgorithmName('1.3.101.112')).toBe('Ed25519');
  });

  it('falls back to the raw OID for unknown algorithms, including large second arcs', () => {
    expect(signatureAlgorithmName('1.2.3.4')).toBe('1.2.3.4');
    expect(signatureAlgorithmName('2.100.3')).toBe('2.100.3');
  });
});

describe('certificateTabId', () => {
  it('derives a stable, DOM-safe id from the SHA-256 fingerprint', () => {
    const digests = {md5: '', sha1: '', sha256: 'ABCDEF0123'};
    expect(certificateTabId(digests)).toBe('cert-abcdef0123');
    expect(certificateTabId({...digests, sha256: 'FEDCBA'})).toBe('cert-fedcba');
  });

  it('is independent of DN fields and extension availability', () => {
    const digests = {md5: '', sha1: '', sha256: 'A1B2'};
    expect(certificateTabId(digests)).toBe(certificateTabId({...digests}));
  });
});

describe('build-your-own-viewer chain contract', () => {
  it('re-encodes only the first PEM block and parses the whole chain separately', () => {
    const view = buildCertificateView(DEMO_CHAIN_PEM);
    expect(view.pem.match(/-----BEGIN CERTIFICATE-----/g)).toHaveLength(1);
    expect(parseCertificateChain(DEMO_CHAIN_PEM)).toHaveLength(3);
  });
});
