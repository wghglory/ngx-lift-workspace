import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {ClrLiftI18nService} from 'clr-lift';
import {describe, expect, it} from 'vitest';

import {enTranslations} from '../../../../core/l10n/demo.l10n.en';
import {sourceText} from '../../../../shared/utils/highlight.util';
import {JsonValidatorComponent} from './json-validator.component';

describe('JsonValidatorComponent', () => {
  let component: JsonValidatorComponent;
  let fixture: ComponentFixture<JsonValidatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JsonValidatorComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    const translations = TestBed.inject(ClrLiftI18nService);
    translations.loadTranslationsForComponent('', {en: enTranslations});
    translations.setLanguage('en');

    fixture = TestBed.createComponent(JsonValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('shows the exact export name and a localized overview', () => {
    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('jsonValidator');
    expect(fixture.nativeElement.querySelector('p')?.textContent).toContain('JSON text');
  });

  it('accepts valid JSON text, rejects malformed text and preserves the value', () => {
    component.form.controls.payload.setValue('{"enabled": true}');
    expect(component.form.valid).toBe(true);
    component.form.controls.payload.setValue('{enabled: true}');
    expect(component.form.controls.payload.hasError('invalidJson')).toBe(true);
    expect(component.form.controls.payload.value).toBe('{enabled: true}');
  });

  it('resets and toggles the disabled state', () => {
    component.form.controls.payload.setValue('null');
    component.reset();
    expect(component.form.controls.payload.value).toBe('');
    component.toggleDisabled();
    expect(component.isDisabled).toBe(true);
    component.toggleDisabled();
    expect(component.isDisabled).toBe(false);
  });

  it('documents runnable imports and the real error key', () => {
    expect(sourceText(component.firstTaskCode)).toContain("import {jsonValidator} from 'ngx-lift';");
    expect(sourceText(component.firstTaskHtml)).toContain('invalidJson');
    expect(sourceText(component.advancedCode)).toContain('shape check');
  });
});
