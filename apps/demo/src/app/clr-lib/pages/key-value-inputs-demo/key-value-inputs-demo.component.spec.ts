import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';
import {TranslationService} from 'clr-lift';

import {enTranslations} from '../../../core/l10n/demo.l10n.en';

import {KeyValueInputsDemoComponent} from './key-value-inputs-demo.component';

describe('KeyValueInputsDemoComponent', () => {
  let component: KeyValueInputsDemoComponent;
  let fixture: ComponentFixture<KeyValueInputsDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeyValueInputsDemoComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    const translations = TestBed.inject(TranslationService);
    translations.loadTranslationsForComponent('', {en: enTranslations});
    translations.setLanguage('en', false);

    fixture = TestBed.createComponent(KeyValueInputsDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('[data-scenario]').length).toBe(4);
    expect(component.sf.valid()).toBe(true);
    expect(fixture.nativeElement.textContent).not.toContain('!! Key');
  });

  it('updates dependent choices and the payload while editing a policy', () => {
    const policy = component.form.controls.policy.at(0);
    policy.controls.key.setValue('region');
    fixture.detectChanges();
    expect(policy.controls.value.value).toBe('');
    expect(component.sf.invalid()).toBe(true);
    const valueSelect: HTMLSelectElement = fixture.nativeElement.querySelectorAll('[data-scenario="policy"] select')[1];
    expect([...valueSelect.options].map((option) => option.value)).toEqual(['', 'us-east', 'eu-central']);
    policy.controls.value.setValue('eu-central');
    fixture.detectChanges();
    expect(component.sf.valid()).toBe(true);
    expect(component.sf.submitValue().policy).toEqual([{key: 'region', value: 'eu-central'}]);
    component.save();
    expect(component.saved()).toEqual(component.sf.submitValue());
    expect(component.saved()).not.toHaveProperty('editing');
  });

  it('binds disabled state through toSignalForm and restores defaults after dynamic edits', () => {
    component.form.controls.editing.setValue(false);
    fixture.detectChanges();
    expect(component.form.controls.tags.disabled).toBe(true);
    expect(component.form.controls.policy.disabled).toBe(true);
    component.save();
    expect(component.saved()).toBeNull();
    component.form.controls.editing.setValue(true);
    fixture.detectChanges();
    component.form.controls.tags.removeAt(0);
    component.restore();
    fixture.detectChanges();
    expect(component.sf.submitValue().tags).toEqual([{key: 'team', value: 'platform'}]);
    expect(component.sf.valid()).toBe(true);
    expect(component.sf.pristine()).toBe(true);
    expect(component.sf.untouched()).toBe(true);
  });
});
