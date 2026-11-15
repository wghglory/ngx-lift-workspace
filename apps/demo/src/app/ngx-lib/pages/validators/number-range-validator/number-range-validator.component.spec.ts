import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {TranslationService} from 'clr-lift';
import {describe, expect, it} from 'vitest';

import {enTranslations} from '../../../../core/l10n/demo.l10n.en';
import {sourceText} from '../../../../shared/utils/highlight.util';
import {NumberRangeValidatorComponent} from './number-range-validator.component';

describe('NumberRangeValidatorComponent', () => {
  let component: NumberRangeValidatorComponent;
  let fixture: ComponentFixture<NumberRangeValidatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumberRangeValidatorComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    const translations = TestBed.inject(TranslationService);
    translations.loadTranslationsForComponent('', {en: enTranslations});
    translations.setLanguage('en');

    fixture = TestBed.createComponent(NumberRangeValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('shows the exact export name and a localized overview', () => {
    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('numberRangeValidator');
    expect(fixture.nativeElement.querySelector('p')?.textContent).toContain('group validator');
  });

  it('reports a group error and clears it without touching child errors', () => {
    expect(component.form.hasError('minGreaterThanMax')).toBe(true);
    expect(component.form.controls.min.errors).toBeNull();
    component.form.controls.max.setValue('20');
    expect(component.form.hasError('minGreaterThanMax')).toBe(false);
    expect(component.form.valid).toBe(true);
    component.form.controls.min.setValue('');
    expect(component.form.controls.min.hasError('required')).toBe(true);
    expect(component.form.hasError('minGreaterThanMax')).toBe(false);
  });

  it('resets and toggles the disabled state', () => {
    component.reset();
    expect(component.form.controls.min.value).toBe('');
    expect(component.form.controls.max.value).toBe('');
    component.toggleDisabled();
    expect(component.isDisabled).toBe(true);
    component.toggleDisabled();
    expect(component.isDisabled).toBe(false);
  });

  it('documents runnable imports and the real error key', () => {
    expect(sourceText(component.firstTaskCode)).toContain("import {numberRangeValidator} from 'ngx-lift';");
    expect(sourceText(component.firstTaskHtml)).toContain('minGreaterThanMax');
    expect(sourceText(component.advancedCode)).toContain("numberRangeValidator('start', 'end')");
  });
});
