import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {ClrLiftI18nService} from 'clr-lift';
import {describe, expect, it} from 'vitest';

import {enTranslations} from '../../../../core/l10n/demo.l10n.en';
import {sourceText} from '../../../../shared/utils/highlight.util';
import {ObjectPathComponent} from './object-path.component';

describe('ObjectPathComponent', () => {
  let component: ObjectPathComponent;
  let fixture: ComponentFixture<ObjectPathComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObjectPathComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    const translations = TestBed.inject(ClrLiftI18nService);
    translations.loadTranslationsForComponent('', {en: enTranslations});
    translations.setLanguage('en');

    fixture = TestBed.createComponent(ObjectPathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the localized overview in the page template', () => {
    expect(fixture.nativeElement.querySelector('p')?.textContent).toContain('getValueByPath');
  });

  it('names both exports in the page title', () => {
    const title = fixture.nativeElement.querySelector('h1')?.textContent ?? '';
    expect(title).toContain('getValueByPath');
    expect(title).toContain('deleteValueByPath');
  });

  it('reads an own nested value from the current read path', () => {
    expect(component.resolvedValue()).toBe('"alice@example.com"');
    component.setReadPath('user.profile.roles.1');
    expect(component.resolvedValue()).toBe('"editor"');
    component.setReadPath('user.profile.contact.missing');
    expect(component.resolvedValue()).toBeUndefined();
  });

  it('delegates prototype-path rejection to the library helpers', () => {
    component.setReadPath('__proto__.polluted');
    expect(component.resolvedValue()).toBeUndefined();
    expect(Object.hasOwn(Object.prototype, 'polluted')).toBe(false);

    component.setDeletePath('constructor.prototype');
    component.applyDelete();
    expect(component.status()).toBe('unchanged');
    expect(component.sampleText()).toContain('+1-555-0100');
  });

  it('deletes an own property, reports repeat deletes and resets the sample', () => {
    expect(component.sampleText()).toContain('+1-555-0100');
    component.applyDelete();
    expect(component.status()).toBe('deleted');
    expect(component.sampleText()).not.toContain('+1-555-0100');

    component.applyDelete();
    expect(component.status()).toBe('unchanged');

    component.reset();
    expect(component.status()).toBe('idle');
    expect(component.sampleText()).toContain('+1-555-0100');
  });

  it('exposes localized API parameter descriptions', () => {
    expect(component.parameters().map((property) => property.name)).toEqual(['obj', 'path']);
    expect(component.parameters().every((property) => property.description.length > 0)).toBe(true);
  });

  it('shows complete runnable examples with their imports', () => {
    expect(sourceText(component.firstTaskCode)).toContain(
      "import {getValueByPath, deleteValueByPath} from 'ngx-lift';",
    );
    const advanced = sourceText(component.advancedCode);
    expect(advanced).toContain("import {deleteValueByPath, getValueByPath} from 'ngx-lift';");
    expect(advanced).toContain('const payload');
  });
});
