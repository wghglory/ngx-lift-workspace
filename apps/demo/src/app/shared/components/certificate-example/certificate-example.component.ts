import {ChangeDetectionStrategy, Component, afterNextRender, ElementRef, inject, input} from '@angular/core';
import {CertificateSignpostComponent} from 'clr-lift';

/** Keeps certificate parsing dependencies inside the deferred example boundary. */
@Component({
  selector: 'app-certificate-example',
  imports: [CertificateSignpostComponent],
  template:
    '<cll-certificate-signpost [pem]="pem()" [pemEncoded]="pemEncoded()" [position]="position()" [showIcon]="showIcon()" />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificateExampleComponent {
  pem = input.required<string>();
  pemEncoded = input(false);
  showIcon = input(true);
  position = input<'right-middle' | 'right-top' | 'bottom-right'>('right-middle');
  constructor() {
    const element = inject<ElementRef<HTMLElement>>(ElementRef);
    // Preserve keyboard focus when the deferred load button is replaced by the example.
    afterNextRender(() => element.nativeElement.querySelector<HTMLButtonElement>('button')?.focus());
  }
}
