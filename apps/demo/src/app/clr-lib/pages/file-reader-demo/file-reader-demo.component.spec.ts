import {ComponentFixture, TestBed} from '@angular/core/testing';
import {vi} from 'vitest';

import {FileReaderDemoComponent} from './file-reader-demo.component';

describe('FileReaderDemoComponent', () => {
  let component: FileReaderDemoComponent;
  let fixture: ComponentFixture<FileReaderDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileReaderDemoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FileReaderDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should isolate basicForm and certForm so submissions do not interfere', async () => {
    await fixture.whenStable();
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    component.basicForm.controls.file.setValue('my-file-content');
    component.submitBasic();

    expect(consoleSpy).toHaveBeenCalledWith({file: 'my-file-content'});
    expect(consoleSpy).not.toHaveBeenCalledWith(expect.objectContaining({caCert: expect.anything()}));

    consoleSpy.mockClear();

    component.submitCert();
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.objectContaining({caCert: expect.stringContaining('BEGIN CERTIFICATE')}),
    );
    expect(consoleSpy).not.toHaveBeenCalledWith(expect.objectContaining({file: 'my-file-content'}));

    consoleSpy.mockRestore();
  });

  it('blocks submission while validation is pending and after validation fails', async () => {
    let complete!: (errors: {certificateValidationUnavailable: true}) => void;
    component.certForm.controls.caCert.setAsyncValidators(
      () =>
        new Promise((resolve) => {
          complete = resolve;
        }),
    );
    component.certForm.controls.caCert.updateValueAndValidity();
    fixture.detectChanges();
    const button: HTMLButtonElement = fixture.nativeElement.querySelectorAll('button[type="submit"]')[1];
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    try {
      expect(component.certForm.pending).toBe(true);
      expect(button.disabled).toBe(true);
      component.submitCert();
      expect(log).not.toHaveBeenCalled();
      complete({certificateValidationUnavailable: true});
      await fixture.whenStable();
      fixture.detectChanges();
      expect(component.certForm.invalid).toBe(true);
      expect(button.disabled).toBe(true);
      component.submitCert();
      expect(log).not.toHaveBeenCalled();
    } finally {
      log.mockRestore();
    }
  });

  it('should enable Example 1 submit button when basicForm is valid regardless of certForm', () => {
    component.basicForm.controls.file.setValue('hello world');
    fixture.detectChanges();

    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button[type="submit"]'));
    expect(buttons[0].disabled).toBe(false);

    // Invalidate certForm and verify Example 1 button is still enabled
    component.certForm.controls.caCert.setValue('invalid-cert');
    fixture.detectChanges();

    expect(buttons[0].disabled).toBe(false);
  });
});
