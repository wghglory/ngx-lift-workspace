import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {ClrLiftI18nService} from 'clr-lift';
import {describe, expect, it} from 'vitest';

import {enTranslations} from '../../../../core/l10n/demo.l10n.en';
import {sourceText} from '../../../../shared/utils/highlight.util';
import {SameValueValidatorComponent} from './same-value-validator.component';

describe('SameValueValidatorComponent', () => {
  let component: SameValueValidatorComponent;
  let fixture: ComponentFixture<SameValueValidatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SameValueValidatorComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    const translations = TestBed.inject(ClrLiftI18nService);
    translations.loadTranslationsForComponent('', {en: enTranslations});
    translations.setLanguage('en');

    fixture = TestBed.createComponent(SameValueValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('shows the exact export name and a localized overview', () => {
    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('sameValueValidator');
    expect(fixture.nativeElement.querySelector('p')?.textContent).toContain('group validator');
  });

  it('reports a mismatch on the group while child rules stay independent', () => {
    component.form.controls.password.setValue('secret123');
    component.form.controls.confirmPassword.setValue('secret124');
    expect(component.form.hasError('valuesMismatch')).toBe(true);
    expect(component.form.controls.confirmPassword.errors).toBeNull();

    component.form.controls.password.setValue('short');
    expect(component.form.controls.password.hasError('minlength')).toBe(true);
    component.form.controls.password.setValue('secret123');
    component.form.controls.confirmPassword.setValue('secret123');
    expect(component.form.hasError('valuesMismatch')).toBe(false);
  });

  it('resets and toggles the disabled state', () => {
    component.form.controls.password.setValue('secret123');
    component.reset();
    expect(component.form.controls.password.value).toBe('');
    component.toggleDisabled();
    expect(component.isDisabled).toBe(true);
    component.toggleDisabled();
    expect(component.isDisabled).toBe(false);
  });

  it('announces the group error once and associates it with the confirmation control', () => {
    const confirmation = fixture.nativeElement.querySelector('#same-value-confirm') as HTMLInputElement;
    const error = fixture.nativeElement.querySelector('#same-value-group-error') as HTMLElement;
    expect(confirmation.getAttribute('aria-describedby')).toBeNull();
    expect(error.querySelector('cll-alert')).toBeNull();

    component.form.controls.password.setValue('secret123');
    component.form.controls.confirmPassword.setValue('secret124');
    fixture.detectChanges();
    expect(error.querySelector('cll-alert')).not.toBeNull();
    expect(confirmation.getAttribute('aria-describedby')).toBe('same-value-group-error');

    component.form.controls.confirmPassword.setValue('secret123');
    fixture.detectChanges();
    expect(error.querySelector('cll-alert')).toBeNull();
    expect(confirmation.getAttribute('aria-describedby')).toBeNull();
  });

  it('documents runnable imports and the real error key', () => {
    expect(sourceText(component.firstTaskCode)).toContain("import {sameValueValidator} from 'ngx-lift';");
    expect(sourceText(component.firstTaskCode)).toContain("import {AlertComponent} from 'clr-lift';");
    expect(sourceText(component.firstTaskHtml)).toContain('valuesMismatch');
    expect(sourceText(component.firstTaskHtml)).toContain('<cll-alert');
    expect(sourceText(component.firstTaskHtml)).toContain('aria-describedby');
    expect(sourceText(component.firstTaskCode)).toContain("sameValueValidator('password', 'confirmPassword')");
    expect(sourceText(component.basicUsageCode)).toContain("sameValueValidator('password', 'confirmPassword')");
    expect(sourceText(component.signatureCode)).toContain('firstControlName: string');
    expect(sourceText(component.signatureCode)).toContain('secondControlName: string');
    expect(sourceText(component.advancedCode)).toContain("sameValueValidator('pin', 'repeatPin')");
  });
});
