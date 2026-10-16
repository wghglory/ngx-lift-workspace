import {ChangeDetectionStrategy, Component, computed, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {FileReaderComponent, PageContainerComponent, TranslatePipe, TranslationService} from 'clr-lift';

import {ApiProperty, ApiTableComponent} from '../../../shared/components/api-table';
import {CodeBlockComponent} from '../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../shared/utils/highlight.util';
import {lazyCertificateValidator} from '../../../shared/utils/lazy-certificate-validator';
import {CertificateExampleComponent} from '../../../shared/components/certificate-example/certificate-example.component';

@Component({
  selector: 'app-file-reader-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ApiTableComponent,
    ClarityModule,
    ReactiveFormsModule,
    FileReaderComponent,
    PageContainerComponent,
    CodeBlockComponent,
    CertificateExampleComponent,
    TranslatePipe,
  ],
  templateUrl: './file-reader-demo.component.html',
  styleUrl: './file-reader-demo.component.scss',
})
export class FileReaderDemoComponent implements OnInit {
  private readonly translationService = inject(TranslationService);
  readonly inputs = computed<ApiProperty[]>(() => [
    {
      name: 'controlId',
      type: 'string',
      defaultValue: "''",
      description: this.translationService.translate('fileReader.inputControlId'),
    },
    {
      name: 'acceptFiles',
      type: 'string',
      defaultValue: "'*'",
      description: this.translationService.translate('fileReader.inputAcceptFiles'),
    },
    {
      name: 'encoded',
      type: 'boolean',
      defaultValue: 'false',
      description: this.translationService.translate('fileReader.inputEncoded'),
    },
    {
      name: 'textEncoding',
      type: "'utf-8' | 'latin1'",
      defaultValue: "'utf-8'",
      description: this.translationService.translate('fileReader.inputTextEncoding'),
    },
    {
      name: 'maxSize',
      type: 'number',
      defaultValue: 'Infinity',
      description: this.translationService.translate('fileReader.inputMaxSize'),
    },
    {
      name: 'disabled',
      type: 'boolean',
      defaultValue: 'false',
      description: this.translationService.translate('fileReader.inputDisabled'),
    },
  ]);
  readonly outputs = computed<ApiProperty[]>(() => [
    {
      name: 'fileChange',
      type: 'OutputEmitterRef<string>',
      description: this.translationService.translate('fileReader.outputChange'),
    },
  ]);

  basicForm = new FormGroup({
    file: new FormControl('', [Validators.required]),
  });

  certForm = new FormGroup({
    caCert: new FormControl('', [Validators.required], [lazyCertificateValidator()]),
  });

  certAcceptedFiles = '.pem, .cer, .key';
  certFileLimit = 5; // MB

  onFileChange(content: string) {
    console.log(content);
  }

  ngOnInit() {
    this.certForm.patchValue({
      caCert: `-----BEGIN CERTIFICATE-----
MIIDNTCCAh2gAwIBAgIBATANBgkqhkiG9w0BAQsFADBGMRgwFgYDVQQDEw9leGFt
cGxlLmludmFsaWQxHTAbBgNVBAoTFEV4YW1wbGUgT3JnYW5pemF0aW9uMQswCQYD
VQQGEwJVUzAgFw0yMDAxMDEwMDAwMDBaGA8yMDk5MDEwMTAwMDAwMFowRjEYMBYG
A1UEAxMPZXhhbXBsZS5pbnZhbGlkMR0wGwYDVQQKExRFeGFtcGxlIE9yZ2FuaXph
dGlvbjELMAkGA1UEBhMCVVMwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIB
AQChbzYUS3j5gHcbS/3hcDhNeO9jO5ZDD0Ly1rw6+FSeSlhEVh8OxxKDuyky0Qmn
erFNbbdpfUkZcvYhMunVAmqdEedMkbHgYzgCTrGYW4qOoMf3mBpFC4f9bhQvEGPP
Kr/iV3Uz1K9Y7Gtcz5uwHX9vcwF47fnUrCIKHCe5A7bHMhFeWEg+e/7DxOFp+/Z/
ToV940FHZprfJLPe2wBCdGj7/9eX/55zd//YZ9pUure1DMeh1kMSw/py+gIxkOk1
cq7UbPT+5vmFnqH3SZ92LNGf9tmZyCCPCs0IEuERVycuHYjpaoZuBDnFtRujh95M
ZcFurkDL4TD54ADXjtAvWFjLAgMBAAGjLDAqMAwGA1UdEwQFMAMBAf8wGgYDVR0R
BBMwEYIPZXhhbXBsZS5pbnZhbGlkMA0GCSqGSIb3DQEBCwUAA4IBAQBMVWRJsDji
UeAQoxGcl334CXgu6FWox3fnucB08i3nf+KCbYGu3yyIC9juh04SyFt5b/YC31j6
TgKAYVNPhwiKBYDDBS7/tBQGdONZbeKc/Hs72KlOWGUphrnCWnQQEA8MB6yViYe+
DXL+H0rS2F0M25CQuaeUwNiUeqtiKoztx6wxU1j7MAkbSsTYrykaIYVarem+Eq3g
kiSXyhhV2Q0vypCN90nzaKJ3NUhiW+MZ8HYuN/8iGEzsc2oY7XxGvG1Kn+BbW/Te
/GpJPl5jz+RiiTAzSNq2kmnW5o4UeosCjQa3u6Znxic/JcvFfC6HPLFYgdzB1H4R
WK7fpDrk9vUp
-----END CERTIFICATE-----`,
    });
    this.certForm.controls.caCert.markAsTouched();
    this.certForm.controls.caCert.markAsDirty();
  }

  submitBasic() {
    console.log(this.basicForm.value);
  }

  submitCert() {
    if (!this.certForm.valid) return;
    console.log(this.certForm.value);
  }

  basicExampleCode = highlight(`
import {FileReaderComponent} from 'clr-lift';
import {ReactiveFormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';

@Component({
  imports: [ClarityModule, ReactiveFormsModule, FileReaderComponent],
  template: \`
    <form clrForm [formGroup]="form" (ngSubmit)="submit()">
      <clr-control-container>
        <label for="file">File</label>
        <cll-file-reader controlId="file" clrControl [encoded]="false" [formControl]="form.controls.file" />
        @if (form.controls.file.value) {
          <clr-control-success>File content has been read successfully</clr-control-success>
        }
        <clr-control-error *clrIfError="'parse'; error as error">{{ error }}</clr-control-error>
        <clr-control-error *clrIfError="'required'">Required</clr-control-error>
      </clr-control-container>

      <button type="submit" class="btn btn-primary" [disabled]="form.invalid">Submit</button>
    </form>
  \`
})
export class FileReaderExampleComponent {
  form = new FormGroup({
    file: new FormControl('', [Validators.required]),
  });

  submit() {
    console.log(this.form.value);
  }
}
  `);

  certificateExampleCode = highlight(`
import {CertificateSignpostComponent, certificateValidator, FileReaderComponent} from 'clr-lift';
import {ReactiveFormsModule, FormControl, FormGroup, Validators} from '@angular/forms';
import {ClarityModule} from '@clr/angular';

@Component({
  imports: [
    ClarityModule,
    ReactiveFormsModule,
    CertificateSignpostComponent,
    FileReaderComponent,
  ],
  styles: '.certificate-success { align-items: center; }',
  template: \`
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
        @if (form.controls.caCert.value) {
          <clr-control-success class="certificate-success">
            <span cds-layout="horizontal gap:xs align:center wrap:wrap">
            <span>Show certificate:</span>
            @if (form.controls.caCert.valid) {
              <cll-certificate-signpost
                [pem]="form.controls.caCert.value"
                [pemEncoded]="false"
                [showIcon]="true"
                [position]="'bottom-right'"
              />
            }
            </span>
          </clr-control-success>
        }
        <clr-control-error *clrIfError="'exceedLimit'">
          Exceed the maximum file size ({{ certFileLimit }} MB).
        </clr-control-error>
        <clr-control-error *clrIfError="'invalidCertificate'; error as error">{{ error }}</clr-control-error>
        <clr-control-error *clrIfError="'required'">Required</clr-control-error>
      </clr-control-container>
    </form>
  \`
})
export class CertificateFileReaderExampleComponent {
  form = new FormGroup({
    caCert: new FormControl('', [certificateValidator(), Validators.required]),
  });

  certAcceptedFiles = '.pem, .cer, .key';
  certFileLimit = 5; // MB

  onFileChange(content: string) {
    console.log(content);
  }

  submit() {
    console.log(this.form.value);
  }
}
  `);
}
