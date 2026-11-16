import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {TranslationService} from 'clr-lift';
import {describe, expect, it} from 'vitest';

import {enTranslations} from '../../../../core/l10n/demo.l10n.en';
import {sourceText} from '../../../../shared/utils/highlight.util';
import {FileExtensionValidatorComponent} from './file-extension-validator.component';

describe('FileExtensionValidatorComponent', () => {
  let component: FileExtensionValidatorComponent;
  let fixture: ComponentFixture<FileExtensionValidatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileExtensionValidatorComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    const translations = TestBed.inject(TranslationService);
    translations.loadTranslationsForComponent('', {en: enTranslations});
    translations.setLanguage('en');

    fixture = TestBed.createComponent(FileExtensionValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('shows the exact export name and a localized overview', () => {
    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('fileExtensionValidator');
    expect(fixture.nativeElement.querySelector('p')?.textContent).toContain('file name');
  });

  it('validates a file name string and a FileList-shaped value', () => {
    component.form.controls.fileName.setValue('photo.PNG');
    expect(component.form.controls.fileName.valid).toBe(true);
    component.form.controls.fileName.setValue('notes.txt');
    expect(component.form.controls.fileName.hasError('invalidFileExtension')).toBe(true);

    component.form.controls.files.setValue({length: 1, 0: {name: 'photo.jpg'}} as unknown as FileList);
    expect(component.form.controls.files.valid).toBe(true);
    component.form.controls.files.setValue({length: 1, 0: {name: 'notes.txt'}} as unknown as FileList);
    expect(component.form.controls.files.hasError('invalidFileExtension')).toBe(true);
  });

  it('resets both controls, the reported names and the native file input', () => {
    component.onFiles({target: {files: {length: 1, 0: {name: 'photo.png'}}}} as unknown as Event);
    expect(component.selectedNames()).toEqual(['photo.png']);

    const fileInput = {value: 'photo.png'} as HTMLInputElement;
    component.reset(fileInput);
    expect(fileInput.value).toBe('');
    expect(component.selectedNames()).toEqual([]);
    expect(component.form.controls.files.value).toBeNull();
  });

  it('toggles the disabled state and disables the native file input', () => {
    const fileInput = fixture.nativeElement.querySelector('#file-extension-files') as HTMLInputElement;

    component.toggleDisabled();
    fixture.detectChanges();
    expect(component.isDisabled).toBe(true);
    expect(component.form.disabled).toBe(true);
    expect(fileInput.disabled).toBe(true);

    component.toggleDisabled();
    fixture.detectChanges();
    expect(component.isDisabled).toBe(false);
    expect(component.form.enabled).toBe(true);
    expect(fileInput.disabled).toBe(false);
  });

  it('ignores file selection events while the form is disabled', () => {
    component.toggleDisabled();
    component.onFiles({target: {files: {length: 1, 0: {name: 'photo.png'}}}} as unknown as Event);
    expect(component.selectedNames()).toEqual([]);
    expect(component.form.controls.files.value).toBeNull();
  });

  it('documents runnable imports and the real error key', () => {
    expect(sourceText(component.firstTaskCode)).toContain(
      "import {FileSelection, fileExtensionValidator} from 'ngx-lift';",
    );
    expect(sourceText(component.firstTaskHtml)).toContain('invalidFileExtension');
    expect(sourceText(component.advancedCode)).toContain('tar.gz');
  });
});
