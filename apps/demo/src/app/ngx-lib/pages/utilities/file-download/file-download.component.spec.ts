import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {TranslationService} from 'clr-lift';
import {describe, expect, it} from 'vitest';

import {enTranslations} from '../../../../core/l10n/demo.l10n.en';
import {FileDownloadComponent} from './file-download.component';

describe('FileDownloadComponent', () => {
  let component: FileDownloadComponent;
  let fixture: ComponentFixture<FileDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileDownloadComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    const translations = TestBed.inject(TranslationService);
    translations.loadTranslationsForComponent('', {en: enTranslations});
    translations.setLanguage('en');

    fixture = TestBed.createComponent(FileDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the localized overview in the page template', () => {
    expect(fixture.nativeElement.querySelector('p')?.textContent).toContain('downloadFile');
  });

  it('disables submission and shows feedback for a blank file name', () => {
    expect(component.canStart()).toBe(true);
    component.setFileName('   ');
    fixture.detectChanges();
    expect(component.canStart()).toBe(false);
    expect(fixture.nativeElement.querySelector('[data-testid="download-file-error"]')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('[data-testid="download-file-start"]')?.disabled).toBe(true);

    component.start();
    expect(component.status()).toBe('idle');
  });

  it('starts a download and localizes the status message', () => {
    component.setFileName('notes.txt');
    component.start();
    expect(component.status()).toBe('started');
    expect(component.statusText()).toContain('notes.txt');
  });

  it('exposes localized API parameter descriptions', () => {
    expect(component.parameters().map((property) => property.name)).toEqual(['content', 'fileName', 'mimeType']);
    expect(component.parameters().every((property) => property.description.length > 0)).toBe(true);
  });
});
