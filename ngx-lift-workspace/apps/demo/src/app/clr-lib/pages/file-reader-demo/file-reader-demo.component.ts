import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {
  CertificateSignpostComponent,
  certificateValidator,
  FileReaderComponent,
  PageContainerComponent,
} from 'clr-lift';

import {CodeBlockComponent} from '../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../shared/utils/highlight.util';

@Component({
  selector: 'app-file-reader-demo',
  standalone: true,
  imports: [
    ClarityModule,
    ReactiveFormsModule,
    CertificateSignpostComponent,
    FileReaderComponent,
    PageContainerComponent,
    CodeBlockComponent,
  ],
  templateUrl: './file-reader-demo.component.html',
  styleUrl: './file-reader-demo.component.scss',
})
export class FileReaderDemoComponent implements OnInit {
  form = new FormGroup({
    caCert: new FormControl('', [certificateValidator(), Validators.required]),
    file: new FormControl('', [Validators.required]),
  });

  certAcceptedFiles = '.pem, .cer, .key';
  certFileLimit = 5; // MB

  onFileChange(content: string) {
    console.log(content);
  }

  ngOnInit() {
    this.form.patchValue({
      caCert: `-----BEGIN CERTIFICATE-----
MIIHBDCCBeygAwIBAgIQBHqqtr/xOf8GW7q69OJ0XjANBgkqhkiG9w0BAQsFADBP
MQswCQYDVQQGEwJVUzEVMBMGA1UEChMMRGlnaUNlcnQgSW5jMSkwJwYDVQQDEyBE
aWdpQ2VydCBUTFMgUlNBIFNIQTI1NiAyMDIwIENBMTAeFw0yNDA5MDYwMDAwMDBa
Fw0yNTEwMDcyMzU5NTlaMHQxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpDYWxpZm9y
bmlhMRIwEAYDVQQHEwlQYWxvIEFsdG8xFjAUBgNVBAoTDUJyb2FkY29tIEluYy4x
JDAiBgNVBAMTG3Ztdy1jb25mbHVlbmNlLmJyb2FkY29tLmNvbTCCASIwDQYJKoZI
hvcNAQEBBQADggEPADCCAQoCggEBAJ0srM6wOIcb8KrvKfpcvo9vPnlCJY/fll+f
Bb5ojgBUCHO/z2Fr5z5BmMkT+XY2yTlO81rkvqWEYGrfJk7U3/J9X9MnVJpCJrXg
OJUDqujcLbiH+spYAtH7tChz5AXhH9OOBKhBFttCmljr5dcDxib1p3RJx02z+GKd
l7lZs7HuiBQzgnnOdJRr05FMfWuIRmNgDGm5HbKiZOBlAp//LlkxKdzUvV/Ftajr
atKKiyppbz52/EPRIVOpfv/1MDioYHJe/5WZwoM2ShguDZzArDOCb+LgkVm7HG+7
CT1sPbyvXCeTEdcjStR4j2j8j5nziThyWLPvDOQfCHqSJySAK4kCAwEAAaOCA7Uw
ggOxMB8GA1UdIwQYMBaAFLdrouqoqoSMeeq02g+YssWVdrn0MB0GA1UdDgQWBBQi
vPFgrwuKhNM4quMdx7E0ucfomDBeBgNVHREEVzBVght2bXctY29uZmx1ZW5jZS5i
cm9hZGNvbS5jb22CG3Ztdy1jb25mbHVlbmNlLmJyb2FkY29tLm5ldIIZY29uZmx1
ZW5jZS5lbmcudm13YXJlLmNvbTA+BgNVHSAENzA1MDMGBmeBDAECAjApMCcGCCsG
AQUFBwIBFhtodHRwOi8vd3d3LmRpZ2ljZXJ0LmNvbS9DUFMwDgYDVR0PAQH/BAQD
AgWgMB0GA1UdJQQWMBQGCCsGAQUFBwMBBggrBgEFBQcDAjCBjwYDVR0fBIGHMIGE
MECgPqA8hjpodHRwOi8vY3JsMy5kaWdpY2VydC5jb20vRGlnaUNlcnRUTFNSU0FT
SEEyNTYyMDIwQ0ExLTQuY3JsMECgPqA8hjpodHRwOi8vY3JsNC5kaWdpY2VydC5j
b20vRGlnaUNlcnRUTFNSU0FTSEEyNTYyMDIwQ0ExLTQuY3JsMH8GCCsGAQUFBwEB
BHMwcTAkBggrBgEFBQcwAYYYaHR0cDovL29jc3AuZGlnaWNlcnQuY29tMEkGCCsG
AQUFBzAChj1odHRwOi8vY2FjZXJ0cy5kaWdpY2VydC5jb20vRGlnaUNlcnRUTFNS
U0FTSEEyNTYyMDIwQ0ExLTEuY3J0MAwGA1UdEwEB/wQCMAAwggF9BgorBgEEAdZ5
AgQCBIIBbQSCAWkBZwB2ABLxTjS9U3JMhAYZw48/ehP457Vih4icbTAFhOvlhiY6
AAABkcglRiwAAAQDAEcwRQIgCwnXwDzUGbSTFKcO2/U3oUmDMCSoS6VETEkYpyHq
kuQCIQDkWSwubbdYCBuAXog35Fh+Vdj/rrNp7DYzbVhKq5PH/AB1AH1ZHhLheCp7
HGFnfF79+NCHXBSgTpWeuQMv2Q6MLnm4AAABkcglRa0AAAQDAEYwRAIgM0ib6y4m
yj0ErGlkGgOWzWqWhnsKeWcnk/epsU4K2zUCIE45JiKRX/3Q7oLzcgKgBMNXP+M9
uyLOCXwSUQH6Xs2oAHYAzPsPaoVxCWX+lZtTzumyfCLphVwNl422qX5UwP5MDbAA
AAGRyCVGkAAABAMARzBFAiEA50wID4klTV0ylaoZUp0Folzz6dIMIfZy/EbLSwU5
aSwCIGaGPVTT3ET8tp72Bc4cPuRcdp/cCMkk21yAI+JZNv8xMA0GCSqGSIb3DQEB
CwUAA4IBAQB44PEqta4Tqm1pH/XzJVMssbPuRvR0YCwjHWpA8wcrcnnOyj0WmufD
fUWQvwNR6JlxhZ4siO4s0UfjYu04A/YcxQaIkp0i0wLuDy6lesB5qd6R4cl12h5A
rOt7Cv7vgZ8lSY6KGBDn1XoZodrwUfcSLX6Bsi2RzKpsc3p2r41CBm2E6hL6qxJw
KUqMGT0DKDIVwnvKNnnDdjJ0/HpItGFra/wXk30Y/C+bS+Ic5XIPbtM2Rts6TtWP
jYaejivHnl5H+Wd0Jgp3CBEoPv7ajv/LlfOlFTHDeSxRPg1InCmI+qny+g2rjN4+
RpegRTbFn9zkb7yHHaBaVYk6pAnpF8+e
-----END CERTIFICATE-----`,
    });
  }

  submit() {
    console.log(this.form.value);
  }

  htmlCode = highlight(`
<form clrForm [formGroup]="form" (ngSubmit)="submit()">
    <clr-control-container>
      <label for="ca-bundle">CA Bundle</label>
      <cll-file-reader
        controlId="ca-bundle"
        clrControl
        [encoded]="false"
        [maxSize]="certFileLimit"
        [acceptFiles]="certAcceptedFiles"
        [formControl]="form.controls.caCert"
        (fileChange)="onFileChange($event)"
      />
      <clr-control-success *ngIf="form.controls.caCert.value">
        Show certificate:
        <cll-certificate-signpost
          *ngIf="form.controls.caCert.valid"
          [pem]="form.controls.caCert.value"
          [pemEncoded]="false"
          [showIcon]="true"
          [position]="'bottom-right'"
        />
      </clr-control-success>
      <clr-control-error *clrIfError="'exceedLimit'">
        Exceed the maximum file size ({{ certFileLimit }} MB).
      </clr-control-error>
      <clr-control-error *clrIfError="'invalidCertificate'"> Cannot parse the file correctly </clr-control-error>
      <clr-control-error *clrIfError="'required'"> Required </clr-control-error>
    </clr-control-container>

    <clr-control-container>
      <label for="file">File</label>
      <cll-file-reader controlId="file" clrControl [encoded]="false" [formControl]="form.controls.file" />
      <clr-control-success *ngIf="form.controls.file.value">
        File content has been read successfully
      </clr-control-success>
      <clr-control-error *clrIfError="'parse'; error as error"> {{ error }} </clr-control-error>
      <clr-control-error *clrIfError="'required'"> Required </clr-control-error>
    </clr-control-container>

    <button type="submit" class="btn btn-primary" [disabled]="form.invalid">Submit</button>
  </form>
  `);

  tsCode = highlight(`
import {CertificateSignpostComponent, certificateValidator, FileReaderComponent} from 'clr-lift';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ClarityModule,
    ReactiveFormsModule,
    CertificateSignpostComponent,
    FileReaderComponent,
  ]
})
export class FileReaderDemoComponent {
  form = new FormGroup({
    caCert: new FormControl('', [certificateValidator(), Validators.required]),
    file: new FormControl('', [Validators.required]),
  });

  certAcceptedFiles = '.pem, .cer, .key';
  certFileLimit = 5; // MB

  onFileChange(content: string) {
    console.log(content);
  }

  submit() {
    console.log(this.form.value);
  }

  ngOnInit() {
    this.form.patchValue({
      caCert: '-----BEGIN CERTIFICATE-----...-----END CERTIFICATE-----',
    });
  }
}
  `);
}
