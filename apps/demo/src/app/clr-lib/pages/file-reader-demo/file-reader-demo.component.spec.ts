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

  it('should isolate basicForm and certForm so submissions do not interfere', () => {
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
