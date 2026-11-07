import {ChangeDetectionStrategy, Component, computed, inject, linkedSignal, signal} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {AlertComponent, CalloutComponent, PageContainerComponent, TranslatePipe, TranslationService} from 'clr-lift';

import {ApiProperty, ApiTableComponent} from '../../../shared/components/api-table';
import {CodeBlockComponent} from '../../../shared/components/code-block/code-block.component';
import {StateInspectorComponent} from '../../../shared/components/state-inspector/state-inspector.component';
import {CertificateExampleComponent} from '../../../shared/components/certificate-example/certificate-example.component';
import {highlight} from '../../../shared/utils/highlight.util';
import {CERTIFICATE_SAMPLES} from './certificate-samples';

/** Outcome of the build-your-own-viewer parse action. */
type ViewerState =
  | {status: 'idle'}
  | {status: 'loading'}
  | {status: 'error'; message: string}
  | {status: 'done'; items: Record<string, string>; encodedPem: string};

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
    return state.status === 'done' ? {items: state.items, encodedPem: state.encodedPem} : null;
  });

  viewerCode = highlight(`import {
  extractDerFromPem,
  md5,
  parseCertificate,
  pemEncodeDer,
  sha1,
  sha256,
} from 'clr-lift';

// PEM text (or its base64 encoding) -> DER bytes
const der = extractDerFromPem(pemText);

// DER bytes -> certificate fields, key-algorithm agnostic (RSA, ECDSA, Ed25519, ...)
const certificate = parseCertificate(der);
certificate.subject.getField('CN');
certificate.signatureAlgorithm; // signature OID label

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
      const {buildCertificateView} = await import('../../../shared/utils/certificate-viewer-tools');
      const view = buildCertificateView(this.pemText());
      const {certificate, digests} = view;
      const translate = (key: string) => this.translationService.translate(key);
      const validity = (date: Date) =>
        new Intl.DateTimeFormat(this.translationService.locale(), {dateStyle: 'medium', timeStyle: 'short'}).format(
          date,
        );
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
        [translate('certificate.viewerFields.signatureAlgorithm')]: certificate.signatureAlgorithm,
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
      this.viewerState.set({status: 'done', items, encodedPem: view.pem});
    } catch (error: unknown) {
      this.viewerState.set({
        status: 'error',
        message: error instanceof Error ? error.message : String(error),
      });
    }
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
