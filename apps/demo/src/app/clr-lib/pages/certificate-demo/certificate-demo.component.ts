import {ChangeDetectionStrategy, Component, computed, inject, linkedSignal, signal, viewChildren} from '@angular/core';
import {ClarityModule, ClrTab} from '@clr/angular';
import {AlertComponent, CalloutComponent, PageContainerComponent, TranslatePipe, TranslationService} from 'clr-lift';

import {ApiProperty, ApiTableComponent} from '../../../shared/components/api-table';
import {CodeBlockComponent} from '../../../shared/components/code-block/code-block.component';
import {StateInspectorComponent} from '../../../shared/components/state-inspector/state-inspector.component';
import {CertificateExampleComponent} from '../../../shared/components/certificate-example/certificate-example.component';
import {highlight} from '../../../shared/utils/highlight.util';
import type {
  CertificateDigests,
  CertificateHierarchyNode,
  ParsedChainEntry,
} from '../../../shared/utils/certificate-viewer-tools';
import {CERTIFICATE_SAMPLES} from './certificate-samples';

/** Display-ready node of the parsed certificate chain, mirroring the reference hierarchy tree. */
interface ChainDisplayNode {
  /** Stable tab id derived from the certificate's SHA-256 fingerprint; shared by tree nodes and tabs. */
  id: string;
  name: string;
  statusText: string;
  labelClass: string;
  shape: string;
  status: 'success' | 'warning' | 'danger';
  items: Record<string, string>;
  children: ChainDisplayNode[];
}

/** Outcome of the build-your-own-viewer parse action: a fully expanded hierarchy tree plus one
 * details tab per certificate, leaf first. */
type ViewerState =
  | {status: 'idle'}
  | {status: 'loading'}
  | {status: 'error'; message: string}
  | {status: 'done'; tree: ChainDisplayNode[]; tabs: ChainDisplayNode[]; encodedPem: string};

/** Standard X.509 display names for well-known signature algorithm OIDs; display-only, not a parser contract. */
export const SIGNATURE_ALGORITHM_NAMES: Record<string, string> = {
  '1.2.840.113549.1.1.5': 'SHA1 with RSA',
  '1.2.840.113549.1.1.11': 'SHA256 with RSA',
  '1.2.840.113549.1.1.12': 'SHA384 with RSA',
  '1.2.840.113549.1.1.13': 'SHA512 with RSA',
  '1.2.840.10045.4.3.2': 'ECDSA with SHA256',
  '1.2.840.10045.4.3.3': 'ECDSA with SHA384',
  '1.2.840.10045.4.3.4': 'ECDSA with SHA512',
  '1.3.101.112': 'Ed25519',
};

/** Falls back to the raw OID so an unknown signature algorithm stays visible and unambiguous. */
export function signatureAlgorithmName(oid: string): string {
  return SIGNATURE_ALGORITHM_NAMES[oid] ?? oid;
}

/** Stable, unique id shared by hierarchy nodes and details tabs, independent of DN or extension availability. */
export function certificateTabId(digests: CertificateDigests): string {
  return `cert-${digests.sha256.toLowerCase()}`;
}

@Component({
  selector: 'app-certificate-demo',
  imports: [
    ApiTableComponent,
    AlertComponent,
    CalloutComponent,
    PageContainerComponent,
    CodeBlockComponent,
    CertificateExampleComponent,
    ClarityModule,
    StateInspectorComponent,
    TranslatePipe,
  ],
  templateUrl: './certificate-demo.component.html',
  styleUrl: './certificate-demo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificateDemoComponent {
  private translationService = inject(TranslationService);

  inputs = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'pem',
        type: 'string',
        required: true,
        description: this.translationService.translate('certificate.inputPem'),
      },
      {
        name: 'pemEncoded',
        type: 'boolean',
        defaultValue: 'false',
        description: this.translationService.translate('certificate.inputPemEncoded'),
      },
      {
        name: 'position',
        type: 'string',
        defaultValue: "'right-middle'",
        description: this.translationService.translate('certificate.inputPosition'),
      },
      {
        name: 'showIcon',
        type: 'boolean',
        defaultValue: 'true',
        description: this.translationService.translate('certificate.inputShowIcon'),
      },
    ];
  });

  utilities = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'parseCertificateFromPem',
        type: '(pem: string, pemEncoded?: boolean) => X509Certificate',
        description: this.translationService.translate('certificate.utilityParse'),
      },
      {
        name: 'extractDerFromPem',
        type: '(pem: string, pemEncoded?: boolean) => Uint8Array',
        description: this.translationService.translate('certificate.utilityExtractDer'),
      },
      {
        name: 'pemEncodeDer',
        type: '(der: Uint8Array, label?: string) => string',
        description: this.translationService.translate('certificate.utilityPemEncode'),
      },
      {
        name: 'md5 / sha1 / sha256',
        type: '(der: Uint8Array) => string',
        description: this.translationService.translate('certificate.utilityDigest'),
      },
    ];
  });

  readonly samples = CERTIFICATE_SAMPLES;
  readonly selectedSampleId = linkedSignal(() => this.samples[0].id);
  readonly selectedSample = computed(
    () => this.samples.find((sample) => sample.id === this.selectedSampleId()) ?? this.samples[0],
  );
  readonly pemText = linkedSignal(() => this.selectedSample().pem);
  readonly viewerState = signal<ViewerState>({status: 'idle'});

  /** Narrowed views of the viewer state; template calls cannot narrow the union across invocations. */
  readonly viewerError = computed(() => {
    const state = this.viewerState();
    return state.status === 'error' ? state.message : '';
  });

  readonly viewerResult = computed(() => {
    const state = this.viewerState();
    return state.status === 'done' ? {tree: state.tree, tabs: state.tabs, encodedPem: state.encodedPem} : null;
  });

  /** The rendered Clarity tabs; hierarchy node clicks activate the matching tab. */
  private readonly tabsView = viewChildren(ClrTab);

  /** Children accessor for Clarity's recursive hierarchy tree. */
  readonly treeChildren = (node: ChainDisplayNode): ChainDisplayNode[] => node.children;

  /** Clicking a hierarchy node opens that certificate's details tab. */
  selectTreeNode(node: ChainDisplayNode): void {
    const tab = this.tabsView().find((candidate) => candidate.tabLink?.tabLinkId === node.id);
    tab?.tabLink.activate();
  }

  viewerCode = highlight(`import {extractDerFromPem, md5, parseCertificate, pemEncodeDer, sha1, sha256} from 'clr-lift';

// PEM text (or its base64 encoding) -> DER bytes
const der = extractDerFromPem(pemText);

// DER bytes -> certificate fields, key-algorithm agnostic (RSA, ECDSA, Ed25519, ...)
const certificate = parseCertificate(der);
certificate.subject.getField('CN');
certificate.signatureAlgorithm; // dotted OID; map it to a display name in your UI

// DER bytes -> fingerprints (uppercase hex)
const digests = {md5: md5(der), sha1: sha1(der), sha256: sha256(der)};

// DER bytes -> PEM text (the inverse of extractDerFromPem)
const pem = pemEncodeDer(der);`);

  selectSample(id: string): void {
    this.selectedSampleId.set(id);
  }

  onPemInput(value: string): void {
    this.pemText.set(value);
  }

  resetViewer(): void {
    this.pemText.set(this.selectedSample().pem);
    this.viewerState.set({status: 'idle'});
  }

  async parseViewerPem(): Promise<void> {
    this.viewerState.set({status: 'loading'});
    try {
      // Loaded on demand like the rest of the demo's certificate tooling, keeping the parser
      // out of the page's eager chunk.
      const tools = await import('../../../shared/utils/certificate-viewer-tools');
      const entries = tools.parseCertificateChain(this.pemText());
      // Zero entries parse to a null hierarchy, so one guard covers both without a non-null assertion.
      const hierarchy = tools.buildCertificateHierarchy(entries);
      if (!hierarchy) {
        throw new Error('no PEM certificate found in the input');
      }
      const tree = this.buildChainDisplay(hierarchy);
      const tabs = entries.map((entry) => this.buildChainDisplayFromEntry(entry));
      this.viewerState.set({
        status: 'done',
        // Tabs follow the distributed order (leaf first) and activate the leaf initially.
        tabs,
        tree: [tree],
        encodedPem: tools.buildCertificateView(this.pemText()).pem,
      });
    } catch (error: unknown) {
      this.viewerState.set({
        status: 'error',
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /** Converts a hierarchy node into a display node with translated fields and validity status. */
  private buildChainDisplay(node: CertificateHierarchyNode): ChainDisplayNode {
    return {
      id: certificateTabId(node.digests),
      name: node.name,
      ...this.buildDisplayCore(node.certificate, node.digests),
      children: node.children.map((child) => this.buildChainDisplay(child)),
    };
  }

  /** Builds a leaf-first tab display node from one parsed chain entry. */
  private buildChainDisplayFromEntry(entry: ParsedChainEntry): ChainDisplayNode {
    return {
      id: certificateTabId(entry.digests),
      name: entry.certificate.subject.getField('CN')?.value ?? entry.certificate.subject.getField('O')?.value ?? '-',
      ...this.buildDisplayCore(entry.certificate, entry.digests),
      children: [],
    };
  }

  /** Translated validity status and detail rows shared by tree nodes and tabs. */
  private buildDisplayCore(
    certificate: ParsedChainEntry['certificate'],
    digests: ParsedChainEntry['digests'],
  ): Pick<ChainDisplayNode, 'statusText' | 'labelClass' | 'shape' | 'status' | 'items'> {
    const translate = (key: string, arg?: string) => this.translationService.translate(key, arg);
    const expiry = certificate.validity.notAfter.getTime();
    let statusText: string;
    let labelClass: string;
    let shape: string;
    let status: 'success' | 'warning' | 'danger';
    if (expiry <= Date.now()) {
      statusText = translate('certificate.expired');
      labelClass = 'label-danger';
      shape = 'error-standard';
      status = 'danger';
    } else {
      const days = Math.floor((expiry - Date.now()) / 86_400_000);
      if (days <= 30) {
        statusText = translate('certificate.expiresIn', `${days}`);
        labelClass = 'label-warning';
        shape = 'exclamation-triangle';
        status = 'warning';
      } else {
        statusText = translate('certificate.valid');
        labelClass = 'label-success';
        shape = 'success-standard';
        status = 'success';
      }
    }
    return {
      statusText,
      labelClass,
      shape,
      status,
      items: this.buildCertItems(certificate, digests),
    };
  }

  /** Translated label/value rows for one certificate, as shown by the state inspector. */
  private buildCertItems(
    certificate: ParsedChainEntry['certificate'],
    digests: ParsedChainEntry['digests'],
  ): Record<string, string> {
    const translate = (key: string) => this.translationService.translate(key);
    const validity = (date: Date) =>
      new Intl.DateTimeFormat(this.translationService.locale(), {dateStyle: 'medium', timeStyle: 'short'}).format(date);
    const items: Record<string, string> = {
      [translate('certificate.viewerFields.subject')]: certificate.subject.attributes
        .map((attribute) => `${attribute.name}=${attribute.value}`)
        .join(', '),
      [translate('certificate.viewerFields.issuer')]: certificate.issuer.attributes
        .map((attribute) => `${attribute.name}=${attribute.value}`)
        .join(', '),
      [translate('certificate.viewerFields.serialNumber')]: certificate.serialNumber,
      [translate('certificate.viewerFields.notBefore')]: validity(certificate.validity.notBefore),
      [translate('certificate.viewerFields.notAfter')]: validity(certificate.validity.notAfter),
      [translate('certificate.viewerFields.signatureAlgorithm')]: signatureAlgorithmName(
        certificate.signatureAlgorithm,
      ),
    };
    if (certificate.subjectAltName?.length) {
      items[translate('certificate.viewerFields.subjectAltName')] = certificate.subjectAltName
        .map((name) => `${name.type}:${name.value}`)
        .join(', ');
    }
    if (certificate.subjectKeyIdentifier) {
      items[translate('certificate.viewerFields.subjectKeyIdentifier')] = certificate.subjectKeyIdentifier;
    }
    items[translate('certificate.viewerFields.md5')] = digests.md5;
    items[translate('certificate.viewerFields.sha1')] = digests.sha1;
    items[translate('certificate.viewerFields.sha256')] = digests.sha256;
    return items;
  }

  pem1 = CERTIFICATE_SAMPLES[0].pem;

  pem2 = btoa(CERTIFICATE_SAMPLES[0].pem);

  pem1Code = highlight(`// Copy sample-certificate.pem from the download link to your public/ directory.
// Register provideHttpClient() in app.config.ts.
import {AsyncPipe} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {AlertComponent, CertificateSignpostComponent} from 'clr-lift';
import {createAsyncState} from 'ngx-lift';

@Component({
  selector: 'app-certificate',
  imports: [AsyncPipe, AlertComponent, CertificateSignpostComponent],
  template: \`
    @if (state$ | async; as state) {
      @if (state.error) {
        <cll-alert [error]="state.error" />
      }
      @if (state.data; as pem) {
        @defer (on immediate) {
          <cll-certificate-signpost [pem]="pem" />
        }
      }
    }
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificateComponent {
  private http = inject(HttpClient);
  readonly state$ = this.http.get('/sample-certificate.pem', {responseType: 'text'}).pipe(createAsyncState());
}
// The deferred template keeps the parsing code out of the eager component path.`);
  pem2Code = highlight(`// Copy sample-certificate.pem from the download link to your public/ directory.
// Register provideHttpClient() in app.config.ts.
import {AsyncPipe} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {AlertComponent, CertificateSignpostComponent} from 'clr-lift';
import {createAsyncState} from 'ngx-lift';
import {map} from 'rxjs';

@Component({
  selector: 'app-certificate',
  imports: [AsyncPipe, AlertComponent, CertificateSignpostComponent],
  template: \`
    @if (state$ | async; as state) {
      @if (state.error) {
        <cll-alert [error]="state.error" />
      }
      @if (state.data; as pem) {
        @defer (on immediate) {
          <cll-certificate-signpost [pem]="pem" [pemEncoded]="true" position="right-top" />
        }
      }
    }
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificateComponent {
  private http = inject(HttpClient);
  readonly state$ = this.http.get('/sample-certificate.pem', {responseType: 'text'}).pipe(
    map((pem) => btoa(pem)),
    createAsyncState(),
  );
}
// The deferred template keeps the parsing code out of the eager component path.`);
}
