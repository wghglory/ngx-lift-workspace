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

  it('resets both controls and clears the reported names', () => {
    component.onFiles({target: {files: {length: 1, 0: {name: 'photo.png'}}}} as unknown as Event);
    expect(component.selectedNames()).toEqual(['photo.png']);
    component.reset();
    expect(component.selectedNames()).toEqual([]);
    expect(component.form.controls.files.value).toBeNull();
  });

  it('toggles the disabled state and re-enables the form', () => {
    component.toggleDisabled();
    expect(component.isDisabled).toBe(true);
    expect(component.form.disabled).toBe(true);
    component.toggleDisabled();
    expect(component.isDisabled).toBe(false);
    expect(component.form.enabled).toBe(true);
  });

  it('documents runnable imports and the real error key', () => {
    expect(sourceText(component.firstTaskCode)).toContain(
      "import {FileSelection, fileExtensionValidator} from 'ngx-lift';",
    );
    expect(sourceText(component.firstTaskHtml)).toContain('invalidFileExtension');
    expect(sourceText(component.advancedCode)).toContain('tar.gz');
  });
});
