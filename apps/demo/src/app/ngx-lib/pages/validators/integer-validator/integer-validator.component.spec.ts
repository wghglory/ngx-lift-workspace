import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {TranslationService} from 'clr-lift';
import {describe, expect, it} from 'vitest';

import {enTranslations} from '../../../../core/l10n/demo.l10n.en';
import {sourceText} from '../../../../shared/utils/highlight.util';
import {IntegerValidatorComponent} from './integer-validator.component';

describe('IntegerValidatorComponent', () => {
  let component: IntegerValidatorComponent;
  let fixture: ComponentFixture<IntegerValidatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntegerValidatorComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    const translations = TestBed.inject(TranslationService);
    translations.loadTranslationsForComponent('', {en: enTranslations});
    translations.setLanguage('en');

    fixture = TestBed.createComponent(IntegerValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('shows the exact export name and a localized overview', () => {
    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('integerValidator');
    expect(fixture.nativeElement.querySelector('p')?.textContent).toContain('safe integers');
  });

  it('validates integers and rejects decimals, then clears back to required', () => {
    expect(component.form.valid).toBe(false);
    component.form.controls.replicas.setValue('3');
    expect(component.form.valid).toBe(true);
    component.form.controls.replicas.setValue('3.5');
    expect(component.form.controls.replicas.hasError('invalidInteger')).toBe(true);
    component.form.controls.replicas.setValue('');
    expect(component.form.controls.replicas.hasError('required')).toBe(true);
  });

  it('resets and toggles the disabled state', () => {
    component.form.controls.replicas.setValue('3');
    component.reset();
    expect(component.form.controls.replicas.value).toBe('');
    component.toggleDisabled();
    expect(component.isDisabled).toBe(true);
    component.toggleDisabled();
    expect(component.isDisabled).toBe(false);
  });

  it('documents runnable imports and the real error key', () => {
    expect(sourceText(component.firstTaskCode)).toContain("import {integerValidator} from 'ngx-lift';");
    expect(sourceText(component.firstTaskHtml)).toContain('invalidInteger');
    expect(sourceText(component.basicUsageCode)).toContain("hasError('invalidInteger')");
  });
});
