import {TestBed} from '@angular/core/testing';
import {describe, expect, it} from 'vitest';
import {UploadComponent} from './upload.component';

describe('probe: interpolated for', () => {
  it('associates the label with the input id', () => {
    TestBed.configureTestingModule({imports: [UploadComponent]});
    const fixture = TestBed.createComponent(UploadComponent);
    fixture.componentRef.setInput('adapter', {
      initiate: async () => ({uploadId: 'u1'}),
      uploadChunk: async () => undefined,
      combine: async () => undefined,
      cancel: async () => undefined,
    });
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const input = el.querySelector('input')!;
    const label = el.querySelector('label') as HTMLLabelElement;
    console.log('input id:', input.id, '| label for:', JSON.stringify(label.getAttribute('for')));
    expect(label.getAttribute('for')).toBe(input.id);
    expect(label.htmlFor).toBe(input.id);
  });
});
