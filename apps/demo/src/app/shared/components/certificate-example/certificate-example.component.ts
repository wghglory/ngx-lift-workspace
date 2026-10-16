import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {CertificateSignpostComponent} from 'clr-lift';

/** Keeps certificate parsing dependencies inside the automatically loaded deferred example boundary. */
@Component({
  selector: 'app-certificate-example',
  imports: [CertificateSignpostComponent],
  template:
    '<cll-certificate-signpost [pem]="pem()" [pemEncoded]="pemEncoded()" [position]="position()" [showIcon]="showIcon()" />',
  styles: ':host { display: inline-flex; align-items: center; }',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificateExampleComponent {
  pem = input.required<string>();
  pemEncoded = input(false);
  showIcon = input(true);
  position = input<'right-middle' | 'right-top' | 'bottom-right'>('right-middle');
}
