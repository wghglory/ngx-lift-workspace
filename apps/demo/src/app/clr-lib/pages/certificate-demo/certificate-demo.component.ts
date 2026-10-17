import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {CalloutComponent, PageContainerComponent, TranslatePipe, TranslationService} from 'clr-lift';

import {ApiProperty, ApiTableComponent} from '../../../shared/components/api-table';
import {CodeBlockComponent} from '../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../shared/utils/highlight.util';
import {CertificateExampleComponent} from '../../../shared/components/certificate-example/certificate-example.component';

@Component({
  selector: 'app-certificate-demo',
  imports: [
    ApiTableComponent,
    CalloutComponent,
    PageContainerComponent,
    CodeBlockComponent,
    CertificateExampleComponent,
    ClarityModule,
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
  pem1 = `-----BEGIN CERTIFICATE-----
MIIDljCCAn6gAwIBAgIQC5McOtY5Z+pnI7/Dr5r0SzANBgkqhkiG9w0BAQsFADBl
MQswCQYDVQQGEwJVUzEVMBMGA1UEChMMRGlnaUNlcnQgSW5jMRkwFwYDVQQLExB3
d3cuZGlnaWNlcnQuY29tMSQwIgYDVQQDExtEaWdpQ2VydCBBc3N1cmVkIElEIFJv
b3QgRzIwHhcNMTMwODAxMTIwMDAwWhcNMzgwMTE1MTIwMDAwWjBlMQswCQYDVQQG
EwJVUzEVMBMGA1UEChMMRGlnaUNlcnQgSW5jMRkwFwYDVQQLExB3d3cuZGlnaWNl
cnQuY29tMSQwIgYDVQQDExtEaWdpQ2VydCBBc3N1cmVkIElEIFJvb3QgRzIwggEi
MA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDZ5ygvUj82ckmIkzTz+GoeMVSA
n61UQbVH35ao1K+ALbkKz3X9iaV9JPrjIgwrvJUXCzO/GU1BBpAAvQxNEP4Htecc
biJVMWWXvdMX0h5i89vqbFCMP4QMls+3ywPgym2hFEwbid3tALBSfK+RbLE4E9Hp
EgjAALAcKxHad3A2m67OeYfcgnDmCXRwVWmvo2ifv922ebPynXApVfSr/5Vh88lA
bx3RvpO704gqu52/clpWcTs/1PPRCv4o76Pu2ZmvA9OPYLfykqGxvYmJHzDNw6Yu
YjOuFgJ3RFrngQo8p0Quebg/BLxcoIfhG69Rjs3sLPr4/m3wOnyqi+RnlTGNAgMB
AAGjQjBAMA8GA1UdEwEB/wQFMAMBAf8wDgYDVR0PAQH/BAQDAgGGMB0GA1UdDgQW
BBTOw0q5mVXyuNtgv6l+vVa1lzan1jANBgkqhkiG9w0BAQsFAAOCAQEAyqVVjOPI
QW5pJ6d1Ee88hjZv0p3GeDgdaZaikmkuOGybfQTUiaWxMTeKySHMq2zNixya1r9I
0jJmwYrA8y8678Dj1JGG0VDjA9tzd29KOVPt3ibHtX2vK0LRdWLjSisCx1BL4Gni
lmwORGYQRI+tBev4eaymG+g3NJ1TyWGqolKvSnAWhsI6yLETcDbYz+70CjTVW0z9
B5yiutkBclzzTcHdDrEcDcRjvq30FPuJ7KJBDkzMyFdA0G4Dqs0MjomZmWzwPDCv
ON9vvKO+KSAnq3T/EyJ43pdSVR6DtVQgA+6uwE9W3jfMw3+qBCe703e4YtsXfJwo
IhNzbM8m9Yop5w==
-----END CERTIFICATE-----`;

  pem2 = btoa(this.pem1);

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
